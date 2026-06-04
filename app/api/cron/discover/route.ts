import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { getSeenEventKeys, insertPendingEvent } from '@/lib/db';
import { events as staticEvents } from '@/data/events';
import { Event } from '@/lib/types';

const SEATTLE_MATCH_DAYS = ['Jun 15', 'Jun 19', 'Jun 24', 'Jun 26', 'Jul 1', 'Jul 6'];
const MAX_QUEUE_PER_RUN = 10;
const MIN_QUALITY_SCORE = 7;

const DISCOVER_TOOL: Anthropic.Tool = {
  name: 'evaluate_discovered_events',
  description: 'Evaluate a list of web search results and identify genuine World Cup watch party events',
  input_schema: {
    type: 'object' as const,
    properties: {
      events: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            qualityScore: { type: 'number', description: '1-10. ≥7 = queue, 5-6 = flag, <5 = discard' },
            valid:        { type: 'boolean' },
            reason:       { type: 'string' },
            event: {
              type: 'object',
              properties: {
                id:           { type: 'string' },
                emoji:        { type: 'string' },
                name:         { type: 'string' },
                venue:        { type: 'string' },
                neighborhood: { type: 'string' },
                area:         { type: 'string', enum: ['Seattle', 'Bellevue', 'Kirkland', 'Tacoma'] },
                cost:         { type: 'string' },
                dates:        { type: 'string' },
                times:        { type: 'string' },
                description:  { type: 'string' },
                ctaLabel:     { type: 'string', enum: ['Learn more', 'Get tickets'] },
                ctaUrl:       { type: 'string' },
                section:      { type: 'string', enum: ['Official Fan Zones', 'Watch Parties & Bars', 'Experiences & Events'] },
                matchDays:    { oneOf: [{ type: 'string', const: 'all' }, { type: 'array', items: { type: 'string' } }] },
              },
            },
          },
          required: ['qualityScore', 'valid'],
        },
      },
    },
    required: ['events'],
  },
};

async function searchSerper(query: string): Promise<{ title: string; link: string; snippet: string }[]> {
  const res = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: { 'X-API-KEY': process.env.SERPER_API_KEY ?? '', 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: query, num: 10 }),
  });
  const data = await res.json() as { organic?: { title: string; link: string; snippet: string }[] };
  return data.organic ?? [];
}

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sets CRON_SECRET automatically)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Build seen-set from DB + static events
  const seenFromDB = await getSeenEventKeys();
  const staticKeys = new Set(staticEvents.map((e) => `${e.name}|${e.neighborhood}`.toLowerCase()));
  const seen = new Set([...seenFromDB, ...staticKeys]);

  // Search for new events
  const queries = [
    '"Seattle" "World Cup 2026" "watch party" OR "viewing party"',
    '"FIFA 2026" Seattle bar event -site:worldcupinsea.com',
    '"World Cup" "2026" Seattle "fan zone" OR "watch party" site:eventbrite.com OR site:visitseattle.org',
  ];

  const allResults: { title: string; link: string; snippet: string }[] = [];
  for (const q of queries) {
    const results = await searchSerper(q);
    allResults.push(...results);
  }

  // Dedup URLs
  const uniqueResults = [...new Map(allResults.map((r) => [r.link, r])).values()];

  // Run Claude agent to evaluate
  const client = new Anthropic();
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    tools: [DISCOVER_TOOL],
    tool_choice: { type: 'any' },
    system: `You are a quality-control agent for worldcupinsea.com. Evaluate web search results and identify GENUINE World Cup 2026 watch party events in Seattle metro area.

Quality score criteria (1-10):
- 9-10: Verified event, specific dates, clear World Cup framing, real venue with web presence
- 7-8: Likely real event, some specific info, World Cup related
- 5-6: Possibly real but vague, missing details, or tangentially related
- 1-4: Not a specific event, generic bar, spam, or out of area

MATCH DAYS for reference: ${SEATTLE_MATCH_DAYS.join(', ')}
VALID AREAS: Seattle, Bellevue, Kirkland, Tacoma

Already seen (do NOT include these): ${[...seen].slice(0, 50).join('; ')}`,
    messages: [{
      role: 'user',
      content: `Evaluate these ${uniqueResults.length} search results. For each, determine if it's a new, genuine World Cup watch party event worth adding to worldcupinsea.com:\n\n${
        uniqueResults.map((r, i) => `[${i + 1}] ${r.title}\n${r.link}\n${r.snippet}`).join('\n\n')
      }`,
    }],
  });

  const toolUse = response.content.find((b) => b.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    return NextResponse.json({ queued: 0, message: 'Agent returned no results' });
  }

  const { events: evaluated } = toolUse.input as { events: { qualityScore: number; valid: boolean; event?: Event }[] };

  // Filter and cap
  const toQueue = evaluated
    .filter((e) => e.valid && e.event && e.qualityScore >= MIN_QUALITY_SCORE)
    .slice(0, MAX_QUEUE_PER_RUN);

  const lowConfidence = evaluated.filter((e) => e.valid && e.event && e.qualityScore >= 5 && e.qualityScore < MIN_QUALITY_SCORE);

  // Save to DB
  const queued: Event[] = [];
  for (const item of toQueue) {
    if (!item.event) continue;
    const key = `${item.event.name}|${item.event.neighborhood}`.toLowerCase();
    if (seen.has(key)) continue;
    try {
      const token = crypto.randomUUID();
      await insertPendingEvent(item.event, '', token);
      queued.push(item.event);
    } catch {
      // continue
    }
  }

  // Send digest email
  if (queued.length > 0 || lowConfidence.length > 0) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://worldcupinsea.com';

      const queuedHtml = queued.map((e) =>
        `<li><strong>${e.emoji} ${e.name}</strong> — ${e.venue}, ${e.area} · ${e.dates}<br>
        <a href="${e.ctaUrl}">${e.ctaUrl}</a></li>`
      ).join('');

      const flaggedHtml = lowConfidence.map((item) => item.event ?
        `<li>${item.event.emoji} ${item.event.name} (score: ${item.qualityScore}) — ${item.event.ctaUrl}</li>` : ''
      ).join('');

      await resend.emails.send({
        from:    'worldcupinsea <noreply@worldcupinsea.com>',
        to:      'hello@worldcupinsea.com',
        subject: `[Daily Discovery] ${queued.length} new events found`,
        html: `
          <h2>Daily Event Discovery — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
          <p>Found <strong>${queued.length} new events</strong> queued for review.</p>
          ${queued.length > 0 ? `<h3>✅ Queued for Review</h3><ul>${queuedHtml}</ul>` : ''}
          ${lowConfidence.length > 0 ? `<h3>⚠️ Low Confidence (not queued)</h3><ul>${flaggedHtml}</ul>` : ''}
          <p><a href="${BASE_URL}/api/review">Review all pending events →</a></p>
        `,
      });
    } catch (err) {
      console.error('Digest email failed:', err);
    }
  }

  return NextResponse.json({ queued: queued.length, lowConfidence: lowConfidence.length });
}
