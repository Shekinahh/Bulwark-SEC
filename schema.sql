-- =========================================================================
-- BULWARK SEC, INC. — Supabase Master Database Schema
-- Database: PostgreSQL (Supabase Project: ejxqjavwgfrqtaxvlvol)
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. GUARD REQUESTS & CLIENT LEADS (hire.html, estimator.html)
CREATE TABLE IF NOT EXISTS public.guard_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    company_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    property_type TEXT,
    guard_type TEXT DEFAULT 'uniformed_armed',
    coverage_hours TEXT DEFAULT '24_7',
    officers_needed INTEGER DEFAULT 1,
    estimated_weekly_budget TEXT,
    start_date DATE,
    site_address TEXT,
    special_instructions TEXT,
    status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'contacted', 'site_survey_scheduled', 'proposal_sent', 'active_contract', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ACTIVE CLIENT ACCOUNTS (portal.html)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    client_code TEXT UNIQUE NOT NULL, -- e.g. MRP-0041
    contact_name TEXT NOT NULL,
    contact_email TEXT UNIQUE NOT NULL,
    contact_phone TEXT,
    clearance_level TEXT DEFAULT 'STANDARD',
    active_posts_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ACTIVE GUARD POSTS (portal.html, patrol.html)
CREATE TABLE IF NOT EXISTS public.guard_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    post_code TEXT NOT NULL UNIQUE, -- e.g. P-401, MBU-7
    location_name TEXT NOT NULL,
    officer_name TEXT NOT NULL,
    officer_badge_id TEXT,
    guard_type TEXT NOT NULL, -- Unarmed Concierge, Armed Static, Mobile Patrol, Executive Protection
    shift_schedule TEXT NOT NULL, -- e.g. 06:00 - 22:00
    status TEXT DEFAULT 'ON_DUTY' CHECK (status IN ('ON_DUTY', 'INCOMING', 'ACTIVE', 'RELIEVED', 'INCIDENT_ALERT')),
    last_check_in TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    nfc_scans_today INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. INCIDENT REPORTS (portal.html, patrol.html)
CREATE TABLE IF NOT EXISTS public.incident_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    post_code TEXT NOT NULL,
    incident_number TEXT UNIQUE DEFAULT ('INC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(uuid_generate_v4()::text, 1, 4)),
    title TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    officer_name TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'escalated')),
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. GUARD TOUR & NFC CHECKPOINTS (Real-time telemetry)
CREATE TABLE IF NOT EXISTS public.guard_tour_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_code TEXT NOT NULL,
    officer_name TEXT NOT NULL,
    checkpoint_name TEXT NOT NULL,
    nfc_tag_uid TEXT,
    gps_lat DOUBLE PRECISION,
    gps_lng DOUBLE PRECISION,
    status TEXT DEFAULT 'VERIFIED',
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. OFFICER APPLICANTS & VETTING (vetting.html)
CREATE TABLE IF NOT EXISTS public.officer_applicants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    guard_card_number TEXT,
    military_law_enforcement_exp BOOLEAN DEFAULT FALSE,
    years_experience INTEGER DEFAULT 0,
    vetting_stage TEXT DEFAULT 'stage_1_identity' CHECK (vetting_stage IN (
        'stage_1_identity',
        'stage_2_criminal_fbi',
        'stage_3_licensing',
        'stage_4_drug_screening',
        'stage_5_interviews',
        'stage_6_academy_training',
        'stage_7_certified_ready'
    )),
    status TEXT DEFAULT 'under_review' CHECK (status IN ('under_review', 'approved', 'rejected', 'deployed')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.guard_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guard_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guard_tour_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_applicants ENABLE ROW LEVEL SECURITY;

-- Allow public submissions for quote requests & applications
CREATE POLICY "Allow public inserts on guard_requests" ON public.guard_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public reads on active guard_posts" ON public.guard_posts FOR SELECT USING (true);
CREATE POLICY "Allow public inserts on guard_tour_scans" ON public.guard_tour_scans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public reads on guard_tour_scans" ON public.guard_tour_scans FOR SELECT USING (true);
CREATE POLICY "Allow public inserts on incident_reports" ON public.incident_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public reads on incident_reports" ON public.incident_reports FOR SELECT USING (true);
CREATE POLICY "Allow public inserts on officer_applicants" ON public.officer_applicants FOR INSERT WITH CHECK (true);

-- 9. INITIAL SEED DATA
INSERT INTO public.clients (company_name, client_code, contact_name, contact_email, clearance_level, active_posts_count)
VALUES ('Morrison & Reed Properties LLC', 'MRP-0041', 'James Morrison', 'client@company.com', 'STANDARD', 6)
ON CONFLICT (client_code) DO NOTHING;

INSERT INTO public.guard_posts (post_code, location_name, officer_name, officer_badge_id, guard_type, shift_schedule, status, last_check_in, nfc_scans_today)
VALUES
('P-401', 'Main Lobby — North Tower', 'Officer D. Reeves', 'BW-8821', 'Unarmed Concierge', '06:00 – 22:00', 'ON_DUTY', NOW() - INTERVAL '2 minutes', 38),
('P-402', 'Loading Dock — Level B2', 'Officer M. Tanaka', 'BW-9410', 'Armed Static', '06:00 – 18:00', 'ON_DUTY', NOW() - INTERVAL '7 minutes', 24),
('P-403', 'Parking Structure — Gates 1–3', 'Officer S. Williams', 'BW-7104', 'Armed Gate', '06:00 – 22:00', 'ON_DUTY', NOW() - INTERVAL '12 minutes', 42),
('P-404', 'South Tower Lobby', 'Officer F. Coleman', 'BW-6012', 'Unarmed Concierge', '22:00 – 06:00', 'INCOMING', NOW() - INTERVAL '45 minutes', 0),
('P-405', 'Executive Floor 40–45', 'CPO J. Harrington', 'BW-1109', 'Executive Protection', '08:00 – 20:00', 'ON_DUTY', NOW() - INTERVAL '1 minute', 19),
('MBU-7', 'Perimeter — All Lots', 'Unit Bravo-7', 'BW-5520', 'Mobile Patrol Vehicle', '18:00 – 06:00', 'ACTIVE', NOW() - INTERVAL '3 minutes', 64)
ON CONFLICT (post_code) DO NOTHING;

INSERT INTO public.incident_reports (post_code, incident_number, title, severity, description, officer_name, status, logged_at)
VALUES
('P-403', 'INC-20260824-001', 'Tailgating Vehicle Attempt at Gate 2', 'medium', 'Vehicle attempted to enter without authorized RFID badge. Officer S. Williams intercepted and redirected vehicle.', 'Officer S. Williams', 'resolved', NOW() - INTERVAL '2 hours'),
('MBU-7', 'INC-20260824-002', 'Perimeter Gate 4 Lock Tamper Inspection', 'low', 'Routine patrol detected loose latch pin. Maintenance alerted; secondary padlock secured.', 'Unit Bravo-7', 'resolved', NOW() - INTERVAL '4 hours')
ON CONFLICT (incident_number) DO NOTHING;
