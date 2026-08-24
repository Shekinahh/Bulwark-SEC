# Bulwark SEC, Inc. — Database Architecture & Integration

## 🔐 Credentials & Connection

- **Supabase Project URL**: `https://ejxqjavwgfrqtaxvlvol.supabase.co`
- **Publishable / Anon Key**: `sb_publishable_MRn4w9bPjaiZgKDqVXtCJQ_d6e0-OP3`
- **PostgreSQL Connection String**: `postgresql://postgres:@BulwarkDatabase11@db.ejxqjavwgfrqtaxvlvol.supabase.co:5432/postgres`

---

## 🗄️ Tables Created (`schema.sql`)

1. **`guard_requests`**: Stores online quote and coverage requests from `hire.html` and `estimator.html`.
2. **`clients`**: Stores client accounts, clearance levels, authorized emails, and active contract details for `portal.html`.
3. **`guard_posts`**: Live posts, active officers, post codes, shift schedules, and check-in statuses for `portal.html` & `patrol.html`.
4. **`incident_reports`**: Real-time physical incident logs, severity tags (`low`, `medium`, `high`, `critical`), and resolution statuses.
5. **`guard_tour_scans`**: Real-time NFC patrol checkpoint scans with GPS telemetry and timestamps.
6. **`officer_applicants`**: Recruits in the 7-stage background vetting pipeline from `vetting.html`.

---

## ⚡ How to Initialize the Database

1. Open your [Supabase Dashboard](https://supabase.com/dashboard/project/ejxqjavwgfrqtaxvlvol).
2. Navigate to the **SQL Editor** in the left sidebar.
3. Paste the contents of [`schema.sql`](file:///c:/Users/user/.gemini/antigravity-ide/scratch/bulwark-sec/schema.sql) and click **Run**.
4. All tables, Row Level Security (RLS) policies, and seed data will be created automatically.

---

## 🌐 Client Integration (`supabaseClient.js`)

The web frontend includes the Supabase JS SDK and [`supabaseClient.js`](file:///c:/Users/user/.gemini/antigravity-ide/scratch/bulwark-sec/supabaseClient.js), exposing the `window.BulwarkDB` service object:
- `BulwarkDB.submitGuardRequest(formData)` — Writes new quote/hire submissions.
- `BulwarkDB.fetchActivePosts(clientId)` — Fetches real-time post assignments.
- `BulwarkDB.fetchIncidents(clientId)` — Fetches incident logs.
- `BulwarkDB.logIncident(incident)` — Creates new incident alerts.
- `BulwarkDB.fetchTourScans(clientId)` — Fetches NFC tour scans.
- `BulwarkDB.subscribeToLivePatrol(callback)` — Listens for real-time tour scan events via Supabase WebSockets.
