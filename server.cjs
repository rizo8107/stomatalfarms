const express = require('express');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');

console.log('--- server.cjs init ---');
console.log('process.cwd():', process.cwd());
console.log('__dirname:', __dirname);

// Manually load .env variables in local development if present
const dotenvPath = fs.existsSync(path.join(process.cwd(), '.env'))
  ? path.join(process.cwd(), '.env')
  : path.join(__dirname, '.env');

console.log('dotenvPath:', dotenvPath);
console.log('dotenvPath exists:', fs.existsSync(dotenvPath));

if (fs.existsSync(dotenvPath)) {
  const envContent = fs.readFileSync(dotenvPath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      if (!process.env[key]) {
        process.env[key] = value.trim();
      }
    }
  });
}
console.log('APIFY_TOKEN in process.env:', process.env.APIFY_TOKEN ? 'EXISTS (length ' + process.env.APIFY_TOKEN.length + ')' : 'NOT SET');

const compression = require('compression');

const app = express();
app.use(compression());
app.use(express.json());

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('CRITICAL ERROR: DATABASE_URL environment variable is not set.');
  process.exit(1);
}
const pool = new Pool({ connectionString });

// Setup database tables on startup
async function initDb() {
  const query = `
    CREATE TABLE IF NOT EXISTS google_reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      external_review_id TEXT NOT NULL UNIQUE,
      author_name TEXT NOT NULL,
      author_photo_url TEXT,
      rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      review_text TEXT NOT NULL DEFAULT '',
      published_at TIMESTAMPTZ NOT NULL
    );

    CREATE TABLE IF NOT EXISTS google_reviews_meta (
      id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      rating NUMERIC NOT NULL DEFAULT 0,
      total_review_count INTEGER NOT NULL DEFAULT 0,
      last_synced_at TIMESTAMPTZ
    );

    INSERT INTO google_reviews_meta (id, rating, total_review_count) 
    VALUES (1, 0, 0)
    ON CONFLICT (id) DO NOTHING;
  `;
  try {
    await pool.query(query);
    console.log('PostgreSQL tables initialized/verified.');
  } catch (err) {
    console.error('Error initializing database tables:', err);
  }
}

// Apify Scraper Sync logic
const PLACE_ID = 'ChIJ0WAVLno-pGcRr0yNSWn8bxA';
const APIFY_ACTOR = 'compass~google-maps-reviews-scraper';

async function syncGoogleReviews() {
  const apifyToken = process.env.APIFY_TOKEN;
  if (!apifyToken) {
    console.warn('Sync skipped: APIFY_TOKEN environment variable not set.');
    return { error: 'APIFY_TOKEN is not set' };
  }

  console.log('Starting Google Reviews synchronization via Apify...');
  try {
    const apifyRes = await fetch(
      `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items?token=${apifyToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeIds: [PLACE_ID],
          maxReviews: 200,
          reviewsSort: 'newest',
          language: 'en',
        }),
      }
    );

    if (!apifyRes.ok) {
      throw new Error(`Apify actor run failed with status: ${apifyRes.status}`);
    }

    const rawItems = await apifyRes.json();
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      console.log('No reviews returned from Apify.');
      return { synced: 0, message: 'No reviews found' };
    }

    // Deduplicate by reviewId (Apify can return duplicates on pagination boundaries)
    const seen = new Set();
    const items = rawItems.filter((item) => {
      const id = String(item.reviewId);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const item of items) {
        const reviewId = String(item.reviewId);
        const authorName = String(item.name ?? 'Google User');
        const photoUrl = item.reviewerPhotoUrl ? String(item.reviewerPhotoUrl) : null;
        const rating = Number(item.stars);
        const reviewText = String(item.text ?? '');
        const publishedAt = String(item.publishedAtDate);

        await client.query(`
          INSERT INTO google_reviews (external_review_id, author_name, author_photo_url, rating, review_text, published_at)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (external_review_id) 
          DO UPDATE SET 
            author_name = EXCLUDED.author_name,
            author_photo_url = EXCLUDED.author_photo_url,
            rating = EXCLUDED.rating,
            review_text = EXCLUDED.review_text,
            published_at = EXCLUDED.published_at
        `, [reviewId, authorName, photoUrl, rating, reviewText, publishedAt]);
      }

      // Update meta info using the first review item
      const first = items[0];
      const ratingAverage = Number(first.totalScore ?? 4.7);
      const totalReviewsCount = Number(first.reviewsCount ?? items.length);

      await client.query(`
        UPDATE google_reviews_meta
        SET rating = $1, total_review_count = $2, last_synced_at = NOW()
        WHERE id = 1
      `, [ratingAverage, totalReviewsCount]);

      await client.query('COMMIT');
      console.log(`Successfully synced ${items.length} reviews.`);
      return { synced: items.length };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Failed to sync Google Reviews:', err);
    return { error: err.message };
  }
}

// API Routes
app.get('/api/reviews', async (req, res) => {
  try {
    const reviewsRes = await pool.query(`
      SELECT external_review_id, author_name, author_photo_url, rating, review_text, published_at
      FROM google_reviews
      WHERE review_text != ''
      ORDER BY published_at DESC
    `);

    const metaRes = await pool.query(`
      SELECT rating, total_review_count
      FROM google_reviews_meta
      WHERE id = 1
    `);

    const meta = metaRes.rows[0] || { rating: 0, total_review_count: 0 };

    res.json({
      rating: Number(meta.rating),
      totalReviews: Number(meta.total_review_count),
      reviews: reviewsRes.rows.map((row) => ({
        external_review_id: row.external_review_id,
        author_name: row.author_name,
        author_photo_url: row.author_photo_url,
        rating: row.rating,
        review_text: row.review_text,
        published_at: row.published_at,
      })),
    });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/sync', async (req, res) => {
  const result = await syncGoogleReviews();
  if (result.error) {
    res.status(500).json(result);
  } else {
    res.json(result);
  }
});

// Start server if executed directly
if (require.main === module) {
  // Serve frontend build static files
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath, {
    maxAge: '1y',
    immutable: true
  }));

  // For Single Page App client-side routing, fallback to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    
    // Connect and initialize database schema
    await initDb();

    // If database is empty, try running a sync on startup (if APIFY_TOKEN is present)
    try {
      const countCheck = await pool.query('SELECT count(*) FROM google_reviews');
      const count = parseInt(countCheck.rows[0].count, 10);
      if (count === 0 && process.env.APIFY_TOKEN) {
        console.log('Database is empty. Running initial sync...');
        await syncGoogleReviews();
      }
    } catch (err) {
      console.error('Error running initial db count check/sync:', err);
    }
  });

  // Daily background synchronization (once every 24 hours)
  setInterval(() => {
    syncGoogleReviews().catch((err) => console.error('Scheduled review sync failed:', err));
  }, 24 * 60 * 60 * 1000);
} else {
  // When loaded as a module (e.g. inside Vite dev server), just initialize db tables
  initDb().catch((err) => console.error('Error initializing db tables:', err));
}

module.exports = app;
