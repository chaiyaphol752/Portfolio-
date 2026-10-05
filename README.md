# Chaiyaphol — AI-assisted Digital Builder · IT Quereinsteiger

A recruiter-focused portfolio in English, German and Thai with a real backend. It positions an IT Quereinsteiger honestly: real projects are labelled **Live**, **Prototype** or **Experiment**; AI usage is transparent ("AI accelerates the work, I decide what ships"); and every enquiry runs through a real contact pipeline that delivers messages by email.

Live: https://chap-dev-profi.vercel.app

| Page | Route | What it shows |
|------|-------|---------------|
| Home | `/` | Positioning, strengths, how I use AI, proof of work |
| Projects | `/projects` | Live projects, prototypes and experiments (clearly labelled) |
| Skills | `/capabilities` | Practical skills and explorations as one connected network |
| AI systems | `/ai-native` | Python-generated circuit, cloud/local routing, bounded autonomy, multi-agent development |
| Case studies | `/case-studies` | Problem → constraints → decisions → architecture → testing → deployment |
| Lab | `/lab` | Four working tools: API request inspector, JSON inspector, responsive preview, colour tokens |
| Systems | `/systems` | The real architecture of this site, live `/api/health`, public GitHub data |
| Console | `/command-center` | Live status, stack, routes, safe terminal and Cmd/Ctrl+K palette |
| About | `/about` | Background, education, languages and how work gets done |
| Contact | `/contact` | Message form, email and phone |

Every page exists under `/en`, `/de` and `/th`. Copy is stored locally; nothing is translated at runtime.

## Design

Dark-only by design ("Editorial Instrument — Night"): semantic tokens in `src/app/globals.css` drive one consistent dark system with a single coral accent. No theme toggle, no light sections. Motion respects `prefers-reduced-motion`.

## Edit your information

Personal and contact details live only in **`src/config/profile.ts`**: name, headline, availability, location, email, phone, GitHub / LinkedIn links and the source repository. Setting `availability` to `"limited"` or `"closed"` updates the employment indicator everywhere. Optional links left `undefined` are hidden.

Page copy is in `src/content/*.ts`, one typed module per page with `en`, `de` and `th`. The type comes from the English copy, so a missing translation fails the type check. Project data (status, categories, stack, links) lives in `src/components/pages/projects/data.ts`.

## Stack

Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS v4 · Zod · Resend · Neon serverless Postgres (optional) · Python 3 (build-time generator) · Vitest · Playwright · Vercel.

No UI kit, no animation library. Diagrams are SVG and CSS.

## Contact pipeline

```
Browser form (client-side Zod check)
  → Server Action            src/app/actions/contact.ts
  → Zod validation           src/lib/contact/schema.ts   (stable error codes, localized in the UI)
  → honeypot + rate limit    src/lib/contact/rate-limit.ts
  → delivery service         src/lib/contact/deliver.ts
       ├─ Resend email        src/lib/contact/email.ts    → CONTACT_TO_EMAIL, Reply-To = visitor
       ├─ PostgreSQL          src/lib/contact/store.ts    (optional, table contact_submissions)
       └─ webhook             (optional, Slack/Discord-compatible JSON)
  → typed result             success · invalid · rate-limited · unavailable · error
```

- A submission succeeds when at least one channel accepts it. If nothing is configured, the form says so and shows email and phone instead of pretending.
- Email HTML escapes all user input; the subject line is stripped of line breaks.
- With a sender on a verified domain (`CONTACT_FROM_EMAIL`), visitors also get a localized acknowledgement. It never affects whether the owner notification counts as delivered, and it is skipped if it would mail the owner's own inbox.
- `RESEND_API_KEY` is read only on the server (`server-only` module).

## Python-generated AI circuit

`scripts/generate_ai_circuit.py` (standard library only) defines the topology of the AI-assisted engineering system, lays it out on a grid, routes traces orthogonally with 45° chamfers and writes:

- `src/generated/ai-circuit.json` — nodes, traces, focus sets and metadata, rendered interactively by `src/components/circuit`
- `public/generated/ai-circuit.svg` — a standalone static rendering

```bash
npm run generate:circuit
```

Both outputs are committed, so production never needs Python. `src/generated/circuit.test.ts` checks that the JSON and SVG match and that every trace connects real nodes.

## Environment variables

Copy `.env.example` to `.env.local`. Never commit real values.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap and Open Graph |
| `RESEND_API_KEY` | Enables the email channel |
| `CONTACT_TO_EMAIL` | Recipient of message notifications (defaults to the profile email) |
| `CONTACT_FROM_EMAIL` | Sender on a Resend-verified domain; empty uses Resend's test sender, which can only deliver to the Resend account owner |
| `CONTACT_SEND_CONFIRMATION` | `false` disables the visitor acknowledgement |
| `DATABASE_URL` | Optional Postgres connection string |
| `CONTACT_WEBHOOK_URL` | Optional webhook for submissions |
| `GITHUB_TOKEN` | Optional, raises the GitHub API rate limit |

`/api/health` reports which channels are configured, without revealing values.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

Keep `node_modules` off exFAT/FAT drives; they do not support the symlinks npm needs.

## Quality checks

```bash
npm run generate:circuit
npm run lint
npm run typecheck
npm test             # Vitest: i18n, routing, validation, email, delivery, circuit, lab tools, terminal, capability graph
npm run build

# Against a running production server (npm run build && npm start -- -p 3100):
BASE_URL=http://localhost:3100 node scripts/qa.mjs     # screenshots, console errors, horizontal overflow
BASE_URL=http://localhost:3100 node scripts/e2e.mjs    # functional checks
```

## Deployment

The GitHub repository is connected to the Vercel project, so every push to `main` deploys to production. Configure environment variables in Vercel (Settings → Environment Variables) or with `vercel env add`. The Resend Marketplace integration (`vercel integration add resend`) provisions `RESEND_API_KEY`.

## Content honesty

Projects are labelled **Live Project**, **Prototype**, **Experimental Project**, **Learning Project**, **Concept Project** or **Concept / Experimental Architecture**. Only links that really exist are shown; no metrics, clients or testimonials are invented. Add real work in `src/components/pages/projects/data.ts` and `src/content/projects.ts`.

## Folder structure

```
src/
  app/
    [locale]/            one folder per page, layout, 404
    actions/contact.ts   contact Server Action
    api/health/          health Route Handler
    sitemap.ts robots.ts manifest.ts
  components/
    shell/               header, menu, language switcher, command palette, footer
    ui/                  buttons, availability, contact actions, CTA band
    circuit/             interactive renderer for the generated circuit
    pages/<page>/        components owned by each page
  config/                profile.ts (personal info), pages.ts (routes)
  content/               typed EN/DE/TH copy
  generated/             Python-generated circuit JSON (+ test)
  i18n/                  locales, routing helpers
  lib/                   contact pipeline, GitHub, lab tools, terminal engine, SEO
  proxy.ts               locale redirect
scripts/                 generate_ai_circuit.py, qa.mjs, e2e.mjs
```
