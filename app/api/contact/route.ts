import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const ContactSchema = z.object({
  contactName:   z.string().min(1).max(100),
  contactEmail:  z.string().email(),
  venueName:     z.string().min(1).max(200),
  incorrectTeam: z.string().min(1).max(100),
  correctTeam:   z.string().min(1).max(100),
  howYouKnow:    z.string().min(1).max(500),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
  }

  const { contactName, contactEmail, venueName, incorrectTeam, correctTeam, howYouKnow } = parsed.data;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from:    'worldcupinsea <noreply@worldcupinsea.com>',
      to:      'hello@worldcupinsea.com',
      subject: `[Fan Bar Correction] ${venueName}`,
      html: `
        <h2>Fan Bar Correction Report</h2>
        <p><strong>Venue:</strong> ${venueName}</p>
        <p><strong>Incorrectly listed team:</strong> ${incorrectTeam}</p>
        <p><strong>Correct team association:</strong> ${correctTeam}</p>
        <p><strong>How they know:</strong></p>
        <blockquote style="background:#f9f9f9;padding:10px 14px;border-left:3px solid #5D9741;margin:8px 0;">${howYouKnow}</blockquote>
        <hr/>
        <p><strong>Submitted by:</strong> ${contactName} &lt;${contactEmail}&gt;</p>
      `,
    });
  } catch (err) {
    console.error('Contact email failed:', err);
  }

  return NextResponse.json({ message: 'Thanks for the correction! We\'ll review it shortly.' });
}
