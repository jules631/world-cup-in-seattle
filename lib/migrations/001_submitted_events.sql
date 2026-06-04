CREATE TABLE IF NOT EXISTS submitted_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_data   JSONB        NOT NULL,
  contact_email TEXT,
  admin_token  TEXT         NOT NULL,
  status       TEXT         DEFAULT 'pending',   -- pending | approved | rejected
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ  DEFAULT NOW(),
  reviewed_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS submitted_events_status_idx ON submitted_events (status);
