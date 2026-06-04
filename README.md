# World Cup in SEA

**The complete fan guide to the 2026 FIFA World Cup in Seattle.**

---

## The Problem

When the FIFA World Cup comes to Seattle, fans need to answer one question fast: *where do I go?* The information exists — fan zones, watch parties, cultural events — but it's scattered across dozens of websites, Instagram pages, and press releases with no single place to plan around it.

## The Solution

worldcupinsea.com is a structured, filterable event directory built for Seattle fans. It surfaces the right venue for the right game in seconds — whether you're routing for the USA, looking for an Aussie pub, or want to know what's happening on a random Tuesday in June.

---

## Features

### Match Calendar
- Full 2026 FIFA World Cup schedule (all 48 group stage matches + knockout rounds)
- 26-day scrollable date strip from Jun 11 – Jul 6
- Filter by team — all 48 nations with flag emojis
- On each date: global match listing with kickoff times (PT) and venue city
- Seattle matches at Lumen Field highlighted with direct ticket access via StubHub and Gametime

### Fan Zone & Watch Party Directory
- 40+ curated events across Seattle, Bellevue, Kirkland, and Tacoma
- Organized by category: Official Fan Zones · Watch Parties & Bars · Experiences & Events
- Per-event type badge, location color-coding, and Google Maps link
- Identity tags for confirmed LGBTQ+ Friendly, BIPOC-Owned, and Women-Owned venues
- Team fan community panels — shows which bars serve which team's supporters (e.g. Kangaroo & Kiwi → Australia, Rhein Haus → Germany)
- EN / ES language toggle throughout

### Business Submission Pipeline
- `/submit` — self-service form for bars and venues to apply for a listing
- Claude AI (Sonnet 4.6) validates and formats each submission into the correct event schema
- Admin receives a formatted email with one-click approve / reject links
- Approved events go live instantly via Neon Postgres — no code deploy required

### Daily Event Discovery (Cron)
- Vercel Cron job runs daily at 9 AM PT via `/api/cron/discover`
- Searches the web (Serper API) for new Seattle World Cup watch party listings
- Claude AI grades each result on 5 quality criteria (relevance, location, completeness, legitimacy, deduplication)
- Only events scoring ≥ 7/10 are queued; admin receives a daily digest for review

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Database | Neon Postgres (via Vercel Marketplace) |
| AI | Anthropic Claude Sonnet 4.6 |
| Email | Resend |
| Web Search | Serper API |
| Hosting | Vercel (auto-deploy on push to main) |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Claude AI for submission validation and event discovery |
| `DATABASE_URL` | Neon Postgres — stores submitted and approved events |
| `RESEND_API_KEY` | Sends admin review emails and submitter confirmations |
| `SERPER_API_KEY` | Powers the daily web search for new events |
| `NEXT_PUBLIC_BASE_URL` | Base URL for approve/reject links (https://worldcupinsea.com) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps Places Autocomplete on /submit form |

---

## Setup

```bash
npm install
vercel env pull .env.local   # pulls env vars from Vercel project
psql $DATABASE_URL < lib/migrations/001_submitted_events.sql
npm run dev -- --turbo
```
