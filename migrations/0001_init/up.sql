-- Users table (synced from Auth.js sessions)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  image TEXT,
  provider TEXT NOT NULL DEFAULT 'google',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Orders (one per saju service request)
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  name TEXT NOT NULL,
  birthdate TEXT NOT NULL,
  birthtime TEXT NOT NULL,
  gender TEXT NOT NULL,
  question TEXT,
  question_count INTEGER NOT NULL DEFAULT 0,
  paid INTEGER NOT NULL DEFAULT 0,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Saju results (AI-generated analysis JSON per order)
CREATE TABLE IF NOT EXISTS saju_results (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE REFERENCES orders(id),
  result_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_service_id ON orders(service_id);
CREATE INDEX IF NOT EXISTS idx_saju_results_order_id ON saju_results(order_id);
