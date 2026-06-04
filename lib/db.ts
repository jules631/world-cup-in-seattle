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

export async function approveEvent(
  id: string,
  token: string,
): Promise<{ ok: boolean; contactEmail?: string; eventName?: string }> {
  const db = sql();
  const rows = await db`
    UPDATE submitted_events
    SET status = 'approved', reviewed_at = NOW()
    WHERE id = ${id} AND admin_token = ${token} AND status = 'pending'
    RETURNING contact_email, event_data->>'name' AS event_name
  `;
  if (rows.length === 0) return { ok: false };
  return { ok: true, contactEmail: rows[0].contact_email as string, eventName: rows[0].event_name as string };
}

export async function rejectEvent(
  id: string,
  token: string,
  reason: string,
): Promise<{ ok: boolean; contactEmail?: string; eventName?: string }> {
  const db = sql();
  const rows = await db`
    UPDATE submitted_events
    SET status = 'rejected', rejection_reason = ${reason}, reviewed_at = NOW()
    WHERE id = ${id} AND admin_token = ${token} AND status = 'pending'
    RETURNING contact_email, event_data->>'name' AS event_name
  `;
  if (rows.length === 0) return { ok: false };
  return { ok: true, contactEmail: rows[0].contact_email as string, eventName: rows[0].event_name as string };
}

// Normalize email to catch Gmail variations: jon.smith+tag@gmail.com → jonsmith@gmail.com
export function normalizeEmail(email: string): string {
  const [local, domain] = email.toLowerCase().split('@');
  const base = local.split('+')[0].replace(/\./g, '');
  return `${base}@${domain}`;
}

export async function hasRecentSubmission(normalizedEmail: string): Promise<boolean> {
  try {
    const db = sql();
    const rows = await db`
      SELECT 1 FROM submitted_events
      WHERE REPLACE(LOWER(contact_email), '.', '') LIKE ${normalizedEmail.split('@')[0] + '%'}
        AND submitted_at > NOW() - INTERVAL '24 hours'
      LIMIT 1
    `;
    return rows.length > 0;
  } catch {
    return false;
  }
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
