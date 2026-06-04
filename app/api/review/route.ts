import { NextRequest } from 'next/server';
import { approveEvent, rejectEvent } from '@/lib/db';

function html(title: string, body: string) {
  return new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
    <style>body{font-family:system-ui,sans-serif;max-width:480px;margin:80px auto;padding:0 24px;text-align:center}
    h1{font-size:2rem}p{color:#555}</style></head>
    <body><h1>${title}</h1><p>${body}</p><p><a href="https://worldcupinsea.com">← Back to site</a></p></body></html>`,
    { headers: { 'Content-Type': 'text/html' } },
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id     = searchParams.get('id')     ?? '';
  const token  = searchParams.get('token')  ?? '';
  const action = searchParams.get('action') ?? '';
  const reason = searchParams.get('reason') ?? 'Does not meet listing criteria';

  if (!id || !token || !['approve', 'reject'].includes(action)) {
    return html('Invalid link', 'This review link is missing required parameters.');
  }

  if (action === 'approve') {
    const ok = await approveEvent(id, token);
    if (!ok) return html('Already reviewed', 'This submission has already been approved or rejected.');
    return html('✅ Approved!', 'The event is now live on worldcupinsea.com.');
  }

  const ok = await rejectEvent(id, token, reason);
  if (!ok) return html('Already reviewed', 'This submission has already been approved or rejected.');
  return html('❌ Rejected', `The submission has been rejected: ${reason}`);
}
