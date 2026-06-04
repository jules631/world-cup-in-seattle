import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { runSubmitAgent } from '@/lib/submitAgent';
import { insertPendingEvent, normalizeEmail, hasRecentSubmission } from '@/lib/db';

const SubmissionSchema = z.object({
  name:         z.string().min(2).max(100),
  address:      z.string().min(5).max(300),
  section:      z.enum(['Watch Parties & Bars', 'Experiences & Events']),
  dates:        z.string().min(2).max(150),
  times:        z.string().max(100).optional(),
  cost:         z.string().min(1).max(100),
  ctaUrl:       z.string().url(),
  description:  z.string().max(300).optional(),
  matchDays:    z.string().optional(),
  tags:         z.string().optional(),
  contactEmail: z.string().email(),
  contactName:  z.string().min(1).max(100),   // required
  neighborhood: z.string().max(100).optional(),
  area:         z.string().max(50).optional(),
  placeId:      z.string().max(200).optional(),
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://worldcupinsea.com';

// Verify hours against Google Places opening_hours (best-effort, non-blocking)
async function verifyHours(placeId: string, submittedTimes: string): Promise<string> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key || submittedTimes === 'All day') return 'ℹ️ Hours unverifiable (all day or no API key)';

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours&key=${key}`,
    );
    const data = await res.json() as {
      result?: { opening_hours?: { periods?: { open: { day: number; time: string }; close?: { day: number; time: string } }[] } };
    };

    const periods = data.result?.opening_hours?.periods;
    if (!periods || periods.length === 0) return 'ℹ️ Hours unverifiable: no Google Maps hours on file';

    // Parse submitted times (format: "11:00 AM – 10:00 PM" or "14:00 – 22:00")
    const toMinutes = (t: string) => {
      const match = t.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (!match) return null;
      let h = parseInt(match[1]);
      const m = parseInt(match[2]);
      const ampm = match[3]?.toUpperCase();
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };

    const parts = submittedTimes.split(/[–—-]/);
    const openMins  = toMinutes(parts[0]?.trim() ?? '');
    const closeMins = toMinutes(parts[1]?.trim() ?? '');
    if (openMins === null || closeMins === null) return 'ℹ️ Hours unverifiable: could not parse submitted times';

    // Check any period that covers the submitted window
    const covered = periods.some(p => {
      const gOpen  = parseInt(p.open.time.slice(0, 2)) * 60 + parseInt(p.open.time.slice(2));
      const gClose = p.close ? parseInt(p.close.time.slice(0, 2)) * 60 + parseInt(p.close.time.slice(2)) : 24 * 60;
      // Handle overnight (close < open means next day)
      const overnight = gClose < gOpen;
      if (overnight) return openMins >= gOpen || closeMins <= gClose + 24 * 60;
      return openMins >= gOpen && (closeMins <= gClose || closeMins <= gClose + 24 * 60);
    });

    return covered
      ? '✅ Hours verified: venue appears open during submitted window'
      : `⚠️ Hours flagged: submitted "${submittedTimes}" may not match Google Maps hours`;
  } catch {
    return 'ℹ️ Hours unverifiable: Google Places lookup failed';
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
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

  // Spam check — normalize email and check for recent submission
  const norm = normalizeEmail(formData.contactEmail);
  const isSpam = await hasRecentSubmission(norm);
  if (isSpam) {
    return NextResponse.json(
      { error: 'You have already submitted an event in the last 24 hours. Please wait before submitting again.' },
      { status: 429 },
    );
  }

  // Optional: verify hours via Google Places
  let hoursNote = 'ℹ️ Hours not verified (no place ID captured)';
  if (formData.placeId && formData.times) {
    hoursNote = await verifyHours(formData.placeId, formData.times);
  }

  // Run Claude agent
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Service temporarily unavailable. Please try again later.' }, { status: 503 });
  }
  let result;
  try {
    result = await runSubmitAgent({
      ...formData,
      times:       formData.times ?? '',
      description: formData.description ?? '',
      matchDays:   formData.matchDays ?? 'All Seattle match days',
    });
  } catch (err) {
    console.error('Agent error:', err);
    return NextResponse.json({ error: 'Submission could not be processed. Please try again.' }, { status: 500 });
  }

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

  // Send admin notification
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
        <p>Submitted by: ${formData.contactName} &lt;${formData.contactEmail}&gt;</p>
        <p style="background:#f9f9f9;padding:8px;border-radius:4px;font-size:13px">${hoursNote}</p>
        <hr/>
        <p>
          <a href="${approveUrl}" style="background:#5D9741;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;margin-right:12px">✅ Approve</a>
          <a href="${rejectUrl}" style="background:#dc2626;color:white;padding:10px 20px;border-radius:6px;text-decoration:none">❌ Reject</a>
        </p>
      `,
    });
  } catch (err) {
    console.error('Email failed:', err);
  }

  return NextResponse.json({ success: true, message: "Submitted! We'll review it within 24 hours and send you a confirmation." });
}
