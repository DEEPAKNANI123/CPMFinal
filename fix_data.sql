-- 1. Create the missing master_cycles table to stop the backend warning
CREATE TABLE IF NOT EXISTS master_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_name TEXT UNIQUE NOT NULL,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT false
);

-- 2. Insert the current year cycle
INSERT INTO master_cycles (cycle_name, start_date, end_date, is_active) 
VALUES ('FY 2026', '2026-01-01', '2026-12-31', true)
ON CONFLICT (cycle_name) DO NOTHING;

-- 3. Fix Theme Statuses so the frontend can see them (Frontend looks for 'approved')
UPDATE global_themes SET status = 'approved' WHERE status = 'active';

-- 4. Fix Monthly Review Dates so they show up for the current month (May 2026)
UPDATE monthly_reviews SET submitted_at = '2026-05-15 12:00:00' WHERE submitted_at IS NULL;

-- 5. Fix Profile Names (If they are showing as "?? .")
UPDATE profiles SET first_name = 'Alexander', last_name = 'Vance' WHERE id = '00000000-0000-0000-0000-000000000001' AND (first_name = '' OR first_name IS NULL);
