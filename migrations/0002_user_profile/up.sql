-- Add saju profile columns to users table
ALTER TABLE users ADD COLUMN birthdate TEXT;        -- 'YYYY.MM.DD'
ALTER TABLE users ADD COLUMN birthtime TEXT;        -- 'joja','chuk','in','myo',...,'hae','unknown'
ALTER TABLE users ADD COLUMN gender TEXT;           -- '남성' | '여성'
ALTER TABLE users ADD COLUMN calendar_type TEXT DEFAULT 'solar'; -- 'solar' | 'lunar'
ALTER TABLE users ADD COLUMN display_name TEXT;     -- 사주 서비스에서 사용하는 이름 (Google name과 별도)
ALTER TABLE users ADD COLUMN saju_badge TEXT;       -- 예: '을목 신강' (계산된 일간+강약)
