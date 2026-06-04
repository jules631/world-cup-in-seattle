# World Cup in SEA

**The complete fan guide to the 2026 FIFA World Cup in Seattle.**
[worldcupinsea.com](https://worldcupinsea.com)

---

## The Problem

When the FIFA World Cup comes to Seattle, fans need to answer one question fast: *where do I go?* The information exists — fan zones, watch parties, cultural events — but it's scattered across dozens of websites, Instagram pages, and press releases with no single place to plan around it. Fans waste time. Bars miss foot traffic. The moment passes.

## The Solution

worldcupinsea.com is a structured, filterable event directory built for Seattle fans. It surfaces the right venue for the right game in seconds — whether you're rooting for the USA, looking for an Aussie pub, or want to know what's happening on a random Tuesday in June. Businesses can self-list. The site stays current without manual intervention.

---

## Build Log

The goal from day one was to ship fast, iterate based on what the reference product (worldcupinnyc.com) had already proven worked, and layer in intelligence where it added real value. Tournament starts June 11. Everything below was built in a single sprint.

### June 3 — Foundation
*Problem identified: no single Seattle World Cup guide exists. NYC had one. Build the SEA version.*

- Stood up Next.js 16 (Turbopack), Tailwind v4, TypeScript
- Scraped and structured 40+ events across Official Fan Zones, Watch Parties & Bars, and Experiences & Events
- Built filterable event directory: search, area filter (Seattle/Bellevue/Kirkland/Tacoma), collapsible sections
- Added EN/ES language toggle throughout
- Chose **Sounders FC Rave Green (#5D9741)** as the accent color — the obvious choice for a Seattle soccer guide
- Deployed to Vercel, connected to GitHub for auto-deploy

### June 3 — Match Calendar
*Key gap vs. NYC: no date strip, no game context. Users needed to plan around specific matches, not just browse a list.*

- Added full 2026 FIFA World Cup schedule — all 48 group stage matches across 26 tournament days (Jun 11–Jul 6)
- Built scrollable date strip: click any day to see all global matches with PT kickoff times
- Added team filter for all 48 nations with flag emojis — selecting a team auto-highlights their match days
- Seattle matches (Lumen Field) get a green border indicator and SEA badge
- When a Seattle match day is selected: two-column panel shows which bars serve each team's fan community
- Replaced "Get tickets" with StubHub + Gametime secondary links — the site is a guide, not a ticketing platform

### June 3 — Business Submission Pipeline
*If a bar wants to be listed, they shouldn't need to email anyone. The process should be self-service and quality-controlled.*

- Built `/submit` form with Google Maps Places Autocomplete for address entry
- Claude Sonnet 4.6 validates and formats each submission: checks Seattle geography, World Cup relevance, data completeness, and formats it into the correct Event schema
- Admin receives a formatted email with one-click Approve/Reject links — no manual review UI needed
- Approved events stored in Neon Postgres and merged with the static directory at request time — new events go live without a code push
- Both approve and reject trigger an automatic confirmation email to the submitter

### June 3 — Daily Event Discovery
*Manual sourcing doesn't scale. The site should find new events on its own.*

- Vercel Cron job runs daily at 9 AM PT
- Searches the web via Serper API with targeted queries (Eventbrite, VisitSeattle, venue sites)
- Claude AI grades each result on 5 criteria: World Cup relevance, geographic fit, information completeness, legitimacy signal, deduplication
- Events scoring ≥ 7/10 are queued for admin review; 5–6 are flagged as low confidence; below 5 are silently discarded
- Admin receives a daily digest email — never more than 10 new submissions per run

### June 3 — Submit Form Hardening
*The form worked. It needed to be trustworthy — for submitters, for admin, and legally.*

- **Times**: All Day toggle or specific hours (time pickers format to "11:00 AM – 10:00 PM")
- **Match day selection**: Redesigned from checkboxes to a toggle + pill chip pattern — one click for "All Seattle matches," pill chips with team flags for specific games
- **Dates**: Full tournament or specific date range via dropdowns
- **Cost**: Structured Free / Paid ($X cover) / Varies — eliminates free-text ambiguity
- **Spam prevention**: Email normalization (catches Gmail dot/plus variations) + 24-hour submission cooldown per email
- **Time verification**: Google Places Details API cross-checks submitted hours against Google Maps hours — flags mismatches in admin email (non-blocking; admin decides)
- **Identity tags**: LGBTQ+ Friendly · Women-Owned · BIPOC-Owned (with clarifying note: covers Black, Indigenous, People of Color — no redundant sub-tags)
- **Legal**: Privacy disclaimer (email use only, never shared) + independence disclaimer (no FIFA affiliation, no proceeds taken) on form and footer
- **Name now required**: No anonymous submissions

---

## Features

### Match Calendar
- Full 2026 FIFA World Cup schedule (all 48 group stage matches + knockout rounds)
- 26-day scrollable date strip, Jun 11 – Jul 6; click any day to see global matches in PT
- Filter by team — all 48 nations with flag emojis; selecting a team surfaces their match days and relevant Seattle bars
- Seattle Lumen Field matches highlighted with SEA badge; StubHub + Gametime ticket links
- When a match day is selected: team fan community panels show which bars serve which team's supporters

### Fan Zone & Watch Party Directory
- 40+ curated events across Seattle, Bellevue, Kirkland, and Tacoma
- Organized by category: Official Fan Zones · Watch Parties & Bars · Experiences & Events
- Per-event type badge, location color-coding, and Google Maps deep link
- Identity tags for confirmed LGBTQ+ Friendly, BIPOC-Owned, and Women-Owned venues (confirmed only, never assumed)
- EN / ES language toggle throughout

### Business Submission Pipeline
- `/submit` — self-service form: Google Maps address autocomplete, structured time/date/cost pickers, game-specific match day selection
- Claude AI validates geography, relevance, and data quality; formats into the Event schema
- Admin email with one-click approve/reject; submitter receives automatic confirmation either way
- Approved events live instantly via Neon Postgres — no code deploy required
- Spam prevention: 24-hour cooldown per email; Gmail alias normalization
- Hour verification: Google Places cross-check flagged in admin review (non-blocking)

### Daily Event Discovery
- Vercel Cron at 9 AM PT searches the web for new Seattle watch party listings
- Claude AI quality-scores each result (1–10); only ≥ 7 are queued
- Admin receives a daily digest with previews — max 10 per run, never floods the queue

---

## Cost Architecture

Every component was chosen with a deliberate cost model. The goal: $0 until there's meaningful traffic, and predictable unit economics once there is. The only variable cost is Claude API usage — everything else runs free at this scale.

### Vercel — Hosting, Functions, Cron
| Tier | Limit | Our Usage | Cost |
|------|-------|-----------|------|
| Hobby (free) | 100K function invocations/month · 100 GB bandwidth | ~500 page loads + ~100 API calls/month | **$0** |
| Cron jobs | Included on Hobby | 1 job/day (discovery) | **$0** |
| Auto-deploy | Unlimited | Every `git push` to main | **$0** |

*Scale trigger: upgrade to Pro ($20/mo) only if function invocations exceed 100K — roughly 3,000+ submissions/month.*

### Anthropic Claude Sonnet 4.6 — AI Validation + Discovery
| Use case | Tokens per run | Runs/month | Unit cost | Monthly est. |
|----------|---------------|------------|-----------|--------------|
| Submission validation | ~800 in / 400 out | 100 submissions | $0.006/submission | **~$0.60** |
| Daily event discovery | ~3,000 in / 1,500 out | 30 cron runs | $0.06/run | **~$1.80** |
| **Total** | | | | **~$2.40/month** |

Pricing: $3/M input tokens · $15/M output tokens (Sonnet 4.6).
*Scale trigger: cost scales linearly with submissions. At 1,000 submissions/month → ~$8/month. Still negligible.*

### Neon Postgres — Event Storage
| Tier | Limit | Our Usage | Cost |
|------|-------|-----------|------|
| Free | 0.5 GB storage · 190 compute hours/month | <1 MB for 500+ events · <1 compute hour | **$0** |

*Scale trigger: $19/month (Launch plan) if storage exceeds 0.5 GB — roughly 500,000+ event records.*

### Resend — Transactional Email
| Tier | Limit | Our Usage | Cost |
|------|-------|-----------|------|
| Free | 3,000 emails/month · 100/day | 2 per submission (admin + submitter) + 1 daily digest = ~230/month at 100 submissions | **$0** |

*Scale trigger: $20/month (Pro) at 3,000+ emails/month — roughly 1,500 submissions/month.*

### Serper — Web Search (Cron Discovery)
| Tier | Limit | Our Usage | Cost |
|------|-------|-----------|------|
| Free | 2,500 searches/month | ~10 searches/day × 30 days = 300/month | **$0** |

*Scale trigger: $50/month for 50K searches — far beyond any realistic cron need.*

### GitHub — Source Control + CI trigger
- Free for public repos. Auto-deploy to Vercel on every push.
- **$0**

### Total Cost Summary

| Scenario | Monthly Cost |
|----------|-------------|
| Launch (0–100 submissions/month) | **~$2.40** (Claude only) |
| Growth (500 submissions/month) | **~$5.40** |
| Scale (1,000 submissions/month) | **~$8.40** |
| High volume (5,000+ submissions) | **~$20–30** (Vercel Pro + Claude) |

The site is architected to stay free or near-free through the entire World Cup window (Jun 11–Jul 19). The only line item that scales with usage is Claude — and it scales linearly, not exponentially.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Database | Neon Postgres (Vercel Marketplace) |
| AI | Anthropic Claude Sonnet 4.6 |
| Email | Resend |
| Web Search | Serper API |
| Maps | Google Maps JS API (Autocomplete) + Places Details API |
| Hosting | Vercel — auto-deploy on push to main |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Claude AI — submission validation and daily discovery |
| `DATABASE_URL` | Neon Postgres — submitted and approved events |
| `RESEND_API_KEY` | Admin notification + submitter confirmation emails |
| `SERPER_API_KEY` | Daily web search for new events |
| `NEXT_PUBLIC_BASE_URL` | Base URL for approve/reject links |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Client-side Places Autocomplete on /submit |
| `GOOGLE_MAPS_API_KEY` | Server-side Places Details — hour verification |

---

## Setup

```bash
npm install
vercel env pull .env.local
psql $DATABASE_URL < lib/migrations/001_submitted_events.sql
psql $DATABASE_URL < lib/migrations/002_email_index.sql
npm run dev -- --turbo
```
