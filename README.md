# AI Travel Planner — Frontend (React + Vite)

Frontend for **AI Travel Planner** — a modern dashboard-style web app to upload travel documents and view AI-generated itineraries.

## Tech

- React 18 + Vite
- React Router DOM
- TanStack Query
- Tailwind CSS
- Framer Motion
- React Hook Form
- Axios

## Setup

```bash
cd frontend
npm install
copy .env.example .env
```

## Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Run

```bash
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Pages / Routes

- `/login`
- `/register`
- `/dashboard`
- `/upload`
- `/history` (debounced search + pagination)
- `/itinerary/:id`
- `/profile`
- `/share/:shareId` (public)

## Deployment (Vercel)

1. Push this `frontend/` folder to its own repo (or use mono-repo and set Vercel root dir to `frontend`).
2. In Vercel project settings set:
   - `VITE_API_URL=https://<your-render-backend>.onrender.com/api`
3. Deploy.

If you use React Router on Vercel, keep the SPA rewrite (already present in `vercel.json`).

## Troubleshooting

- **Blank page on refresh**: ensure `vercel.json` rewrite is present.
- **401 / auto-logout**: your backend URL in `VITE_API_URL` is wrong or backend is down.
- **CORS errors**: set `FRONTEND_URL` on backend to your Vercel URL.

