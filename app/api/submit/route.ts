import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { runSubmitAgent } from '@/lib/submitAgent';
import { insertPendingEvent } from '@/lib/db';

const SubmissionSchema = z.object({
  name:        z.string().min(2).max(100),
  address:     z.string().min(5).max(200),
  section:     z.enum(['Watch Parties & Bars', 'Official Fan Zones', 'Experiences & Events']),
  dates:       z.string().min(2).max(100),
  times:       z.string().max(100).optional(),
  cost:        z.string().min(1).max(100),
  ctaUrl:      z.string().url(),
  description: z.string().max(300).optional(),
  matchDays:   z.string().optional(),
  contactEmail: z.string().email(),
  contactName: z.string().max(100).optional(),
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://worldcupinsea.com';

export async function POST(req: NextRequest) {
  // Parse + validate form body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = SubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please fill in all required fields.', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const formData = parsed.data;

  // Run Claude agent
  const result = await runSubmitAgent({
    ...formData,
    times:       formData.times ?? '',
    description: formData.description ?? '',
    matchDays:   formData.matchDays ?? 'All Seattle match days',
  });

  if (!result.valid || !result.event) {
    return NextResponse.json(
      { error: result.reason ?? 'Submission did not meet our listing criteria.' },
      { status: 422 },
    );
  }

  // Save to DB
  const adminToken = crypto.randomUUID();
  let submissionId: string;
  try {
    submissionId = await insertPendingEvent(result.event, formData.contactEmail, adminToken);
  } catch (err) {
    console.error('DB insert failed:', err);
    return NextResponse.json({ error: 'Failed to save submission. Please try again.' }, { status: 500 });
  }

  // Send admin notification email
  const approveUrl = `${BASE_URL}/api/review?id=${submissionId}&token=${adminToken}&action=approve`;
  const rejectUrl  = `${BASE_URL}/api/review?id=${submissionId}&token=${adminToken}&action=reject`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from:    'worldcupinsea <noreply@worldcupinsea.com>',
      to:      'hello@worldcupinsea.com',
      subject: `[New Submission] ${result.event.name}`,
      html: `
        <h2>New Watch Party Submission</h2>
        <p><strong>${result.event.emoji} ${result.event.name}</strong></p>
        <p>${result.event.venue} · ${result.event.neighborhood} · ${result.event.area}</p>
        <p>${result.event.cost} · ${result.event.dates}${result.event.times ? ` · ${result.event.times}` : ''}</p>
        <p>${result.event.description ?? ''}</p>
        <p><a href="${result.event.ctaUrl}">${result.event.ctaUrl}</a></p>
        <p>Section: ${result.event.section}</p>
        <p>Match days: ${Array.isArray(result.event.matchDays) ? result.event.matchDays.join(', ') : result.event.matchDays}</p>
        <p>Submitted by: ${formData.contactName ?? ''} &lt;${formData.contactEmail}&gt;</p>
        <hr/>
        <p>
          <a href="${approveUrl}" style="background:#5D9741;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;margin-right:12px">✅ Approve</a>
          <a href="${rejectUrl}" style="background:#dc2626;color:white;padding:10px 20px;border-radius:6px;text-decoration:none">❌ Reject</a>
        </p>
      `,
    });
  } catch (err) {
    // Email failure is non-fatal — submission is still saved
    console.error('Email failed:', err);
  }

  return NextResponse.json({ success: true, message: "Submitted! We'll review it and be in touch." });
}
