CREATE TABLE google_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_review_id TEXT NOT NULL UNIQUE,
  author_name TEXT NOT NULL,
  author_photo_url TEXT,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL DEFAULT '',
  published_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_google_reviews_published_at ON google_reviews (published_at DESC);

ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON google_reviews
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON google_reviews TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON google_reviews FROM anon, authenticated;

CREATE TABLE google_reviews_meta (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  rating NUMERIC NOT NULL DEFAULT 0,
  total_review_count INTEGER NOT NULL DEFAULT 0,
  last_synced_at TIMESTAMPTZ
);

INSERT INTO google_reviews_meta (id, rating, total_review_count) VALUES (1, 0, 0);

ALTER TABLE google_reviews_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read" ON google_reviews_meta
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT SELECT ON google_reviews_meta TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON google_reviews_meta FROM anon, authenticated;
