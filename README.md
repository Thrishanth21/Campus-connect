# Campus Connect

The React/Vite frontend and Flask/Supabase API now live in one project folder.

## Run locally

1. Create `.env` from `.env.example` and enter your Supabase project URL and publishable key.
2. Install backend dependencies: `pip install -r requirements.txt`.
3. Start Flask from this folder: `python app.py` (API on `http://127.0.0.1:5000`).
4. In `frontend/`, install frontend dependencies with `npm install`.
5. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to the same project values as the backend. The publishable key is intended for browser clients; never place a secret or service-role key in frontend variables.
6. In the Supabase SQL Editor, review and run [supabase-events-schema.sql](supabase-events-schema.sql). The live `Events` table currently exposes only `id`, `title`, `capacity`, `organizer_id`, `status`, and `timestamp`; the script adds the fields the event editor needs plus RLS policies for owner-bound event and registration access.
7. Start the UI from `frontend/` with `npm run dev` and open `http://localhost:3000`.

Vite proxies `/api` to Flask in local development. For deployment, set `VITE_API_BASE_URL` to the API origin and set Flask's `FRONTEND_ORIGIN` to the deployed frontend origin.

## API wiring

The event browser, event detail view, registration submit, My Registrations, attendee list, and API Inspector use the Flask API. Event search and category filters run against the fetched event list. The frontend maps common snake_case Supabase fields to the UI's view model.

The frontend signs users in with Supabase Auth. Flask validates each protected request's Supabase access token and uses the verified user ID. The API supports event reads/creation, registration creation/listing, and organizer-only attendee reads. Registration cancellation is not implemented yet.

The Supabase database must have the columns and RLS policies in the provided SQL file. Configure email/password sign-in and allow the local frontend URL (for example `http://localhost:3000/**`) in Supabase Auth redirect settings. I confirmed the live `Events` table has the six columns listed above; I have not applied this SQL to your database.
