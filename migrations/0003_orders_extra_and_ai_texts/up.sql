-- orders 테이블에 누락 컬럼 추가
ALTER TABLE orders ADD COLUMN calendar_type TEXT DEFAULT 'solar';
ALTER TABLE orders ADD COLUMN love_status TEXT;
ALTER TABLE orders ADD COLUMN love_duration TEXT;

-- AI 생성 텍스트 캐시 테이블
CREATE TABLE IF NOT EXISTS ai_texts (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE REFERENCES orders(id),
  ai_json TEXT NOT NULL,
  model TEXT,
  input_tokens INTEGER,
  output_tokens INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ai_texts_order_id ON ai_texts(order_id);
