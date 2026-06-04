import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { createHash } from 'crypto';

function hashIp(ip: string): string {
  return createHash('sha256').update(ip + (process.env.ADMIN_SECRET ?? 'salt')).digest('hex').slice(0, 16);
}

function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set');
  return neon(process.env.DATABASE_URL);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { venueId, team, action } = body ?? {};

  if (!venueId || !team || !['confirm', 'incorrect'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Hash the IP — never store raw IPs
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown';
  const ipHash = hashIp(ip);

  try {
    const sql = db();
    await sql`
      INSERT INTO venue_votes (venue_id, team, action, ip_hash)
      VALUES (${venueId}, ${team}, ${action}, ${ipHash})
    `;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    // Unique constraint violation = already voted
    if (err && typeof err === 'object' && 'code' in err && err.code === '23505') {
      return NextResponse.json({ error: 'already_voted' }, { status: 409 });
    }
    console.error('Vote error:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

// Admin: get vote tallies for all venues
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const sql = db();
  const rows = await sql`
    SELECT venue_id, team, action, COUNT(*) AS count
    FROM venue_votes
    GROUP BY venue_id, team, action
    ORDER BY venue_id, team, action
  `;
  return NextResponse.json(rows);
}
