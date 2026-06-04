CREATE TABLE IF NOT EXISTS venue_votes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id    TEXT        NOT NULL,
  team        TEXT        NOT NULL,
  action      TEXT        NOT NULL CHECK (action IN ('confirm', 'incorrect')),
  ip_hash     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- One vote per IP per venue+team combo
CREATE UNIQUE INDEX IF NOT EXISTS venue_votes_ip_unique
  ON venue_votes (venue_id, team, ip_hash);

-- Fast lookup for admin vote tallies
CREATE INDEX IF NOT EXISTS venue_votes_venue_idx ON venue_votes (venue_id, team);
