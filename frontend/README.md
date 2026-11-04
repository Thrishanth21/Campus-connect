# Campus Connect frontend

React 19 and Vite frontend. The app is in `src/`; the Vite dev server proxies `/api` to the Flask API at `127.0.0.1:5000`.

From this directory, run `npm install`, copy `.env.example` to `.env`, put your Supabase project URL and publishable key in it, and run `npm run dev`. Sign-in/sign-up uses Supabase Auth; Flask verifies the session token and derives the user ID from that verified token.

See the project [README](../README.md) for backend setup, current API support, and known limitations.
