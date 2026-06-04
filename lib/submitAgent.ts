import Anthropic from '@anthropic-ai/sdk';
import { Event } from './types';

const SEATTLE_MATCH_DAYS = ['Jun 15', 'Jun 19', 'Jun 24', 'Jun 26', 'Jul 1', 'Jul 6'];

const SYSTEM_PROMPT = `You are a validator and formatter for worldcupinsea.com — a fan guide to the 2026 FIFA World Cup in Seattle.

When given a business submission, call the format_event tool with your assessment.

VALIDATION RULES (reject if any fail):
- Must be located in Seattle, Bellevue, Kirkland, or Tacoma
- Must be a bar, restaurant, pub, or venue that will be showing World Cup matches — any place with screens showing the games qualifies, no FIFA branding required
- Must have specific dates within Jun 11 – Jul 19, 2026 OR be open all match days
- Reject only if clearly not a watch party venue (e.g. a gym, dentist, or unrelated business)
- Do NOT reject based on the URL — accept any URL the submitter provides (their website, Yelp, Instagram, etc.)

FORMATTING RULES (if valid):
- id: lowercase, hyphen-separated from venue name (e.g. "pike-brewing-world-cup")
- emoji: pick the most fitting single emoji for the venue type (🍺 bar, ⚽ sports, 🌮 food-focused, etc.)
- area: one of "Seattle" | "Bellevue" | "Kirkland" | "Tacoma" — derive from address
- neighborhood: specific neighborhood name from the address (Capitol Hill, SODO, Downtown, etc.)
- section: "Watch Parties & Bars" for bars and restaurants showing matches; "Experiences & Events" for concerts, markets, cultural events, and non-bar experiences. Do NOT use "Official Fan Zones" — those are pre-curated and not user-submittable
- cost: "Free" if free, otherwise "Paid · [brief description]" (e.g. "Paid · $10 cover")
- dates: human-readable range (e.g. "Jun 15 – Jul 6" or "Jun 19")
- matchDays: "all" if open every Seattle match day, otherwise array from [${SEATTLE_MATCH_DAYS.map((d) => `"${d}"`).join(', ')}]
- ctaLabel: "Get tickets" if ticketed, otherwise "Learn more"
- description: clean, factual, max 200 chars — what makes this venue worth going to for the World Cup`;

const FORMAT_TOOL: Anthropic.Tool = {
  name: 'format_event',
  description: 'Validate and format the submission into the worldcupinsea Event schema',
  input_schema: {
    type: 'object' as const,
    properties: {
      valid: { type: 'boolean' },
      reason: { type: 'string', description: 'Why rejected (only when valid=false)' },
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
          transit:      { type: 'string' },
          description:  { type: 'string' },
          ctaLabel:     { type: 'string', enum: ['Learn more', 'Get tickets'] },
          ctaUrl:       { type: 'string' },
          section:      { type: 'string', enum: ['Watch Parties & Bars', 'Experiences & Events'] },
          matchDays:    {
            oneOf: [
              { type: 'string', const: 'all' },
              { type: 'array', items: { type: 'string', enum: SEATTLE_MATCH_DAYS } },
            ],
          },
        },
        required: ['id', 'emoji', 'name', 'venue', 'neighborhood', 'area', 'cost', 'dates', 'ctaLabel', 'ctaUrl', 'section', 'matchDays'],
      },
    },
    required: ['valid'],
  },
};

export interface AgentResult {
  valid: boolean;
  reason?: string;
  event?: Event;
}

export async function runSubmitAgent(formData: Record<string, string>): Promise<AgentResult> {
  const client = new Anthropic();

  const userMessage = `Please validate and format this watch party submission:

Venue name: ${formData.name}
Address: ${formData.address}
Event type: ${formData.section}
Dates: ${formData.dates}
Times: ${formData.times || 'Not specified'}
Cost: ${formData.cost}
Website / ticket URL: ${formData.ctaUrl}
Description: ${formData.description || 'None provided'}
Match days selected: ${formData.matchDays || 'All Seattle match days'}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    tools: [FORMAT_TOOL],
    tool_choice: { type: 'any' },
    messages: [{ role: 'user', content: userMessage }],
  });

  const toolUse = response.content.find((b) => b.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') {
    return { valid: false, reason: 'Agent failed to evaluate submission.' };
  }

  const result = toolUse.input as AgentResult & { event?: Record<string, unknown> };
  return {
    valid: result.valid,
    reason: result.reason,
    event: result.valid ? (result.event as unknown as Event) : undefined,
  };
}
