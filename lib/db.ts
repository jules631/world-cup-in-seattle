import { neon } from '@neondatabase/serverless';
import { Event } from './types';

function sql() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  return neon(process.env.DATABASE_URL);
}

export async function getApprovedEvents(): Promise<Event[]> {
  try {
    const db = sql();
    const rows = await db`
      SELECT event_data FROM submitted_events
      WHERE status = 'approved'
      ORDER BY submitted_at DESC
    `;
    return rows.map((r) => r.event_data as Event);
  } catch {
    // DB unavailable — degrade gracefully, site still works with static events
    return [];
  }
}

export async function insertPendingEvent(
  eventData: Event,
  contactEmail: string,
  adminToken: string,
): Promise<string> {
  const db = sql();
  const rows = await db`
    INSERT INTO submitted_events (event_data, contact_email, admin_token)
    VALUES (${JSON.stringify(eventData)}, ${contactEmail}, ${adminToken})
    RETURNING id
  `;
  return rows[0].id as string;
}

export async function approveEvent(id: string, token: string): Promise<boolean> {
  const db = sql();
  const rows = await db`
    UPDATE submitted_events
    SET status = 'approved', reviewed_at = NOW()
    WHERE id = ${id} AND admin_token = ${token} AND status = 'pending'
    RETURNING id
  `;
  return rows.length > 0;
}

export async function rejectEvent(id: string, token: string, reason: string): Promise<boolean> {
  const db = sql();
  const rows = await db`
    UPDATE submitted_events
    SET status = 'rejected', rejection_reason = ${reason}, reviewed_at = NOW()
    WHERE id = ${id} AND admin_token = ${token} AND status = 'pending'
    RETURNING id
  `;
  return rows.length > 0;
}

export async function getSeenEventKeys(): Promise<Set<string>> {
  try {
    const db = sql();
    const rows = await db`
      SELECT event_data->>'name' AS name, event_data->>'neighborhood' AS neighborhood
      FROM submitted_events WHERE status IN ('pending', 'approved')
    `;
    return new Set(rows.map((r) => `${r.name}|${r.neighborhood}`.toLowerCase()));
  } catch {
    return new Set();
  }
}
