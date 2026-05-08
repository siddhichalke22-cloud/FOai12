# SpacePulse AI Dashboard

Production-ready React + Vite dashboard featuring live ISS tracking, space news intelligence, and a context-restricted AI chatbot.

## Features

- Live ISS tracking every 15 seconds with Leaflet map and trajectory path
- ISS speed calculation using reusable Haversine utility (`src/utils/haversine.js`)
- Astronauts-in-space section from Open Notify
- News dashboard with search, sort, refresh, and 15-minute localStorage cache
- Interactive Recharts:
  - ISS speed line chart
  - News source distribution pie chart
  - ISS live map visualization
- Floating AI chatbot with strict dashboard-only answers
- Dark/light mode with persistence
- Toast notifications, skeleton loading states, retry-friendly errors
- Vercel deployment ready with SPA rewrites

## Tech Stack

- React + Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- Leaflet + React Leaflet
- Recharts
- React Hot Toast

## Environment Variables

Create a `.env` file (use `.env.example`):

```env
VITE_NEWS_API_KEY=
VITE_AI_TOKEN=
VITE_EVENTREGISTRY_API_KEY=
```

## Setup Commands

```bash
npm install
cp .env.example .env
npm run dev
```

## Build Commands

```bash
npm run build
npm run preview
```

## Folder Structure

```text
src/
  charts/
  chatbot/
  components/
  context/
  hooks/
  layouts/
  map/
  pages/
  services/
  utils/
```

## AI Chatbot Restriction Strategy

- User query is keyword-gated to dashboard domain.
- Prompt includes strict system guardrails.
- Model receives only serialized dashboard context (ISS + astronauts + loaded news).
- Unrelated questions are refused with a fixed policy response.

## Vercel Deployment Steps

1. Push project to GitHub.
2. Open [Vercel](https://vercel.com/) and import repository.
3. Framework preset: `Vite`.
4. Add environment variables:
   - `VITE_NEWS_API_KEY`
   - `VITE_AI_TOKEN`
5. Deploy.

`vercel.json` is included for SPA route rewrites.
