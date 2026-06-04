import { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { approveEvent, rejectEvent } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://worldcupinsea.com';

function html(title: string, body: string) {
  return new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
    <style>body{font-family:system-ui,sans-serif;max-width:480px;margin:80px auto;padding:0 24px;text-align:center}
    h1{font-size:2rem}p{color:#555}</style></head>
    <body><h1>${title}</h1><p>${body}</p><p><a href="${BASE_URL}">← Back to site</a></p></body></html>`,
    { headers: { 'Content-Type': 'text/html' } },
  );
}

async function sendSubmitterEmail(
  to: string,
  subject: string,
  body: string,
) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'worldcupinsea <noreply@worldcupinsea.com>',
      to,
      subject,
      html: body,
    });
  } catch (err) {
    // Non-fatal — approve/reject already succeeded
    console.error('Submitter email failed:', err);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id     = searchParams.get('id')     ?? '';
  const token  = searchParams.get('token')  ?? '';
  const action = searchParams.get('action') ?? '';
  const reason = searchParams.get('reason') ?? 'Does not meet our current listing criteria';

  if (!id || !token || !['approve', 'reject'].includes(action)) {
    return html('Invalid link', 'This review link is missing required parameters.');
  }

  if (action === 'approve') {
    const result = await approveEvent(id, token);
    if (!result.ok) return html('Already reviewed', 'This submission has already been approved or rejected.');

    if (result.contactEmail) {
      await sendSubmitterEmail(
        result.contactEmail,
        `Your event is live on worldcupinsea.com 🎉`,
        `
          <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <h2 style="color:#1a1a1a">You're on the guide! ⚽</h2>
            <p style="color:#555"><strong>${result.eventName ?? 'Your event'}</strong> is now live on worldcupinsea.com.</p>
            <p style="color:#555">Fans looking for World Cup watch parties in Seattle will find your listing in the directory.</p>
            <p style="margin-top:24px">
              <a href="${BASE_URL}" style="background:#5D9741;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600">
                View the guide →
              </a>
            </p>
            <p style="color:#888;font-size:12px;margin-top:24px">Questions? Reply to hello@worldcupinsea.com</p>
          </div>
        `,
      );
    }

    return html('✅ Approved!', `${result.eventName ?? 'The event'} is now live on worldcupinsea.com.`);
  }

  // Reject
  const result = await rejectEvent(id, token, reason);
  if (!result.ok) return html('Already reviewed', 'This submission has already been approved or rejected.');

  if (result.contactEmail) {
    await sendSubmitterEmail(
      result.contactEmail,
      `Update on your worldcupinsea.com submission`,
      `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <h2 style="color:#1a1a1a">Thanks for submitting</h2>
          <p style="color:#555">We reviewed <strong>${result.eventName ?? 'your submission'}</strong> and weren't able to include it in the guide at this time.</p>
          <p style="color:#555">Reason: ${reason}</p>
          <p style="color:#555">If your event details change or you have additional information, you're welcome to resubmit.</p>
          <p style="margin-top:24px">
            <a href="${BASE_URL}/submit" style="background:#1a1a1a;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600">
              Submit another event →
            </a>
          </p>
          <p style="color:#888;font-size:12px;margin-top:24px">Questions? Reply to hello@worldcupinsea.com</p>
        </div>
      `,
    );
  }

  return html('Submission reviewed', `Thank you — ${result.eventName ?? 'the submission'} has been declined.`);
}
