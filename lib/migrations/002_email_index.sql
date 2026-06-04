CREATE INDEX IF NOT EXISTS submitted_events_email_idx
  ON submitted_events (LOWER(contact_email));
