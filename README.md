# XYVORAN OS

XYVORAN OS is a Next.js MVP for a biohacking and human optimization platform. Users can create an account, complete onboarding, log biomarkers, view five optimization pillars, chat with an AI Biohacking Coach, and generate a 7-day starter protocol.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and Postgres
- OpenAI Chat Completions API
- Vercel-ready project structure

## Required Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
```

Only the first three variables are required in Vercel. `OPENAI_MODEL` is optional. `OPENAI_API_KEY` is read only by server routes and must never use a `NEXT_PUBLIC_` prefix.

XYVORAN OS now targets the shared Supabase backend used by `xyvoran.com`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://vnmzouindahoqvtizyjo.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_C6sADhHJ9gP-88jwL7ezXw_sAgBYCjL
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is still accepted as a temporary fallback for older environments, but new local, preview, and production deployments should use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

`SUPABASE_SERVICE_ROLE_KEY` is not used or required. Do not add one unless a future server-only administrative workflow genuinely needs to bypass Row Level Security.

## Supabase Setup

1. Use the shared Supabase project `vnmzouindahoqvtizyjo` owned by the public `xyvoran.com` backend.
2. Go to Project Settings -> API.
3. Copy the Project URL into `NEXT_PUBLIC_SUPABASE_URL`.
4. Copy the publishable key into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
5. Do not run local OS migrations directly against the shared backend. Any missing OS-specific tables must be reviewed and applied through Lovable Cloud migrations by the owner.
6. Go to Authentication -> URL Configuration.
7. Add these redirect URLs:

```text
http://localhost:3001/auth/callback
http://localhost:3000/auth/callback
https://os.xyvoran.com/auth/callback
https://your-vercel-preview-domain.vercel.app/auth/callback
```

Set the Supabase Auth Site URL to `https://os.xyvoran.com` for production. For changing Vercel preview URLs, Supabase also supports an allow-list pattern such as `https://*-your-team-slug.vercel.app/**`; keep the production callback exact.

8. For easiest local MVP testing, you may disable email confirmation under Authentication -> Providers -> Email. If email confirmation remains enabled, signup will require confirming the email before onboarding can save.

The shared backend already owns role infrastructure:

- `user_roles`
- enum `app_role` with `admin` and `member`
- security-definer RPC `has_role(_user_id uuid, _role app_role)`

Do not recreate those objects from XYVORAN OS migrations.

## Shared Backend Migration Boundary

The SQL files under `supabase/` document the historical XYVORAN OS schema and proposed OS-specific tables. They are not automatically safe to run against the shared `xyvoran.com` backend. For the shared backend, review missing objects first, then apply approved changes from Lovable Cloud.

## Phase 4 Protocol Migration

If your Supabase project was created before the Phase 4 protocol engine upgrade, run this small migration in Supabase SQL Editor:

```sql
alter table public.generated_protocols add column if not exists title text;
alter table public.generated_protocols add column if not exists weakest_pillar text;
alter table public.generated_protocols add column if not exists intensity text not null default 'Beginner';
alter table public.generated_protocols add column if not exists protocol_json jsonb;
alter table public.generated_protocols add column if not exists status text not null default 'active';

update public.generated_protocols
set protocol_json = protocol
where protocol_json is null;

create index if not exists generated_protocols_user_status_idx
on public.generated_protocols (user_id, status, created_at desc);
```

The same SQL is saved at `supabase/phase4_protocol_migration.sql`.

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

On this Windows Codex workspace, use `start-dev.cmd` if the default terminal uses 32-bit Node. It prepends the bundled 64-bit Node runtime and keeps the terminal open:

```bash
start-dev.cmd
```

The app usually starts at:

```text
http://localhost:3000
```

If port 3000 is already in use, Next.js will print the actual URL, commonly:

```text
http://localhost:3001
```

## Manual Test Checklist

1. Open the local URL printed by Next.js.
2. Go to `/auth/signup`.
3. Create an account.
4. Complete `/onboarding`.
5. Confirm onboarding redirects to `/dashboard`.
6. Confirm the dashboard loads five pillar scores.
7. Go to `/dashboard/biomarkers`.
8. Save a biomarker entry.
9. Confirm the entry appears in biomarker history.
10. Go to `/dashboard/protocols`.
11. Generate a protocol.
12. Confirm the protocol is saved and displayed.
13. Go to `/dashboard/coach`.
14. Send a chat message.
15. Refresh the page and confirm chat history remains.
16. Log out, log in again, and confirm dashboard data still appears.
17. Run `supabase/phase5_labs_migration.sql` in the Supabase SQL Editor.
18. Go to `/dashboard/labs` and upload a PDF, JPG, JPEG, or PNG report under 4 MB.
19. Confirm the report reaches `completed`, extracted biomarkers appear, and the dashboard lab summary updates.
20. Ask the AI Coach about a measured lab value and confirm its response references the persisted report context.

## Core Routes

- `/` landing page
- `/auth/signup` sign up
- `/auth/login` login
- `/auth/callback` Supabase email redirect callback
- `/onboarding` health and lifestyle intake
- `/dashboard` pillar scores and command center
- `/dashboard/biomarkers` biomarker entry and history
- `/dashboard/labs` private bloodwork upload, extraction, and educational analysis
- `/dashboard/coach` AI Biohacking Coach
- `/dashboard/protocols` 7-day protocol generator
- `/dashboard/membership` private membership identity, status, consent, and completion center
- `/dashboard/profile` profile summary
- `/dashboard/settings` safety and app settings

## Database Tables

`supabase/schema.sql` creates:

- `profiles`
- `onboarding_data`
- `biomarker_entries`
- `pillar_scores`
- `ai_chat_messages`
- `generated_protocols`
- `lab_reports`
- `memberships`
- `member_consents`
- `compliance_audit_logs`
- `member_admin_metadata`
- `biometrics`
- `wearable_connections`
- `bloodwork_records`
- `protocol_history`
- `health_goals`

All tables have Row Level Security enabled. Authenticated users can only select, insert, update, or delete records where the record belongs to their own `auth.uid()`.

## Persistence Notes

- Onboarding saves one row per user in `onboarding_data`.
- Biomarker entries save timestamped rows in `biomarker_entries`.
- Dashboard pillar scores are calculated by MVP rule logic and upserted into `pillar_scores`.
- AI chat messages save user and assistant messages in `ai_chat_messages`.
- Generated protocols save to `generated_protocols`.
- Lab report metadata and normalized analysis save to `lab_reports`; original files remain private in the `lab-reports` Supabase Storage bucket.

## Phase 5 Lab Setup

For an existing Supabase project, run `supabase/phase5_labs_migration.sql` once in the SQL Editor. It creates the `lab_reports` table, owner-only RLS policies, the private `lab-reports` Storage bucket, and owner-folder Storage policies. The migration is rerunnable.

PDF extraction uses embedded report text and OpenAI-assisted normalization when `OPENAI_API_KEY` is configured. JPG, JPEG, and PNG extraction requires the server-side OpenAI vision model. The API key is never sent to the browser.

The upload route enforces a 4 MB limit because Vercel Functions have a 4.5 MB request payload ceiling. Larger uploads should use a future browser-to-Supabase signed upload flow rather than passing through a Vercel Function.

## Phase 5.5 Onboarding Setup

For an existing Supabase project, run `supabase/phase55_onboarding_migration.sql` in the SQL Editor before saving the upgraded Optimization Intake. The migration adds nullable pillar-specific fields and preserves all existing onboarding rows. It is safe to rerun.

## Phase 7 Language Setup

Run `supabase/phase7_language_preference_migration.sql` in the Supabase SQL Editor. It safely adds `profiles.language_preference`, defaults existing users to English, and permits only `en` or `es`.

The selected language is stored in the `xyvoran_language` browser cookie and local storage for immediate anonymous persistence. For authenticated users it is also saved to `profiles.language_preference`, allowing the preference to be restored after login. The interface, AI Coach, newly generated protocols, and newly analyzed lab reports use the selected language. Existing English records remain readable and are not modified.

After running the migration, verify English and Spanish on the landing page, age gate, authentication, onboarding, dashboard, Coach, protocols, labs, profile, and settings. Refresh, log out, and log back in to confirm persistence.

## Phase 8 Membership and Compliance Setup

Run `supabase/phase8_membership_compliance_migration.sql` in the Supabase SQL Editor. It is safe to rerun and performs the following work:

- Expands `profiles` with private-member identity and address fields.
- Assigns permanent, unique IDs in the `XYV-000001` format.
- Enforces a minimum date-of-birth age of 21 at the database layer.
- Creates protected membership status and future billing fields.
- Stores four independent legal consent timestamps and a consent version.
- Activates pending memberships after all required consents are recorded; suspended or expired memberships are never automatically reactivated.
- Records consent, language, and profile audit events through database triggers.
- Creates admin-only compliance metadata without exposing it through authenticated-user policies.
- Prepares normalized future tables for biometrics, wearables, bloodwork, protocol history, and health goals.

After the migration, run `supabase/phase8_verification.sql`. Then complete onboarding in both English and Spanish and confirm:

1. A date of birth under age 21 is rejected with the localized message.
2. All four consent checkboxes are required.
3. `profiles.member_id` is populated and remains unchanged after profile edits.
4. `/dashboard/membership` displays ID, status, join date, language, and completion percentage.
5. `member_consents` contains all four timestamps.
6. `compliance_audit_logs` records `consent_accepted`, `consent_updated`, `profile_updated`, and `language_changed` events.
7. Members can read but cannot update `memberships`, and cannot access `member_admin_metadata` through the anon/authenticated API.

## AI Coach Safety

The coach system prompt is in `src/lib/ai-coach.ts`. It requires educational wellness framing and blocks diagnosis, prescriptions, medication changes, and dangerous peptide/hormone/drug dosing instructions. It recommends licensed healthcare providers for abnormal labs, symptoms, medical conditions, and prescription decisions.

## Vercel Deployment

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New Project** and import the repository.
3. Keep the detected framework as **Next.js**.
4. Use the repository root as the Root Directory.
5. Use `npm run build` as the Build Command. No custom Output Directory is required.
   - In Vercel Project Settings -> Build and Deployment, clear the Output Directory field completely.
   - Do not set the Output Directory to `public`, `.next`, or `out` for this application.
6. Add these variables to both Preview and Production environments:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
OPENAI_API_KEY
```

7. Optionally add `OPENAI_MODEL`; the application currently defaults to `gpt-4o-mini` when it is absent.
8. Deploy and open `/api/health`. A ready deployment returns HTTP `200` with configuration and Phase 7/8 schema booleans plus the connected Supabase project reference. It never returns secret values.
9. Test signup, confirmation callback, onboarding, dashboard, lab upload, protocol generation, and AI Coach persistence on the Vercel URL.

Local development remains:

```bash
npm run dev
```

## Custom Domain

In Vercel Project Settings -> Domains, add `os.xyvoran.com`. Vercel will provide the exact DNS target for the project. At the DNS provider for `xyvoran.com`, create the requested CNAME for the `os` host, wait for Vercel verification and TLS provisioning, then make `os.xyvoran.com` the production domain.

After the domain is active:

1. Set the Supabase Auth Site URL to `https://os.xyvoran.com`.
2. Confirm `https://os.xyvoran.com/auth/callback` is in the Supabase redirect allow list.
3. Repeat signup and email confirmation from the custom domain.
4. Confirm `/api/health` returns `200` at the custom domain.

## Production Security

- Dashboard layouts and API operations require a verified Supabase user session.
- Every application table has owner-only Row Level Security policies.
- The `lab-reports` Storage bucket is private and restricts objects to the authenticated user's folder.
- The browser receives only the Supabase project URL and publishable key. Authorization is enforced by RLS.
- OpenAI requests and lab extraction run server-side. The OpenAI key is never returned by `/api/health` or sent to browser components.
- `.env.local` and `.env` are excluded by `.gitignore`; `.env.example` contains placeholders only.
- Baseline response headers disable framing, MIME sniffing, camera, microphone, and location access.

## Private Beta

The current private-beta boundary is Supabase authentication for all dashboard routes. Before production beta, enable email confirmation again in Supabase and restrict account distribution to approved testers. Vercel Deployment Protection can additionally protect Preview deployments. A true application-level invite allow list can be added later; it is not part of the current MVP.

## Production Checklist

- `npm run typecheck` passes.
- `npm run build` passes.
- `/api/health` returns `200` without exposing values.
- Supabase Auth Site URL and redirect allow list match the production domain.
- Email confirmation is enabled for production.
- `lab-reports` remains private and the 4 MB application limit is accepted.
- OpenAI and Supabase usage, billing, logs, and rate limits are monitored during beta.
