# AI-native developer portfolio

A nine-page, three-language freelance portfolio with a real backend. It is built to show what a web developer who works AI-natively can deliver: a considered interface, working server-side code, tests and a production deployment.

The site deliberately gets more technical from page to page. Page 01 is a calm introduction; page 09 is an engineering command center. The visual language stays the same throughout.

| # | Page | What it demonstrates |
|---|------|----------------------|
| 01 | Home | Positioning and first impression |
| 02 | Journey | How I think and work, and where AI fits |
| 03 | Toolbox | Capabilities as a connected system, not percentage bars |
| 04 | Projects | Searchable project explorer (clearly labelled concept projects) |
| 05 | Case studies | Problem-to-tradeoffs write-ups with SVG/HTML diagrams |
| 06 | AI-native | The workflow: AI accelerates, human judgment decides |
| 07 | Lab | Three working tools: JSON inspector, responsive preview, colour tokens |
| 08 | Systems | Real contact form, architecture, live `/api/health`, public GitHub data |
| 09 | Command center | Safe terminal, Cmd/Ctrl+K palette, architecture of this repo |

Languages: English, German, Thai (`/en`, `/de`, `/th`). All copy is stored locally; nothing is translated at runtime.

## Stack

Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS v4 · Zod · Neon serverless Postgres · Vitest · Playwright (QA scripts) · Vercel.

There is no UI kit and no animation library. Motion is limited to CSS entrance transitions and respects `prefers-reduced-motion`.

## Edit your information

All personal information lives in **`src/config/profile.ts`**: name, availability, location, email, GitHub / LinkedIn / freelance links and the source repository URL. Fields marked `PLACEHOLDER` should be replaced before you share the site. Optional fields left `undefined` are hidden from the UI automatically (for example, no email means no `mailto:` links).

Page copy is in `src/content/*.ts`, one typed module per page with `en`, `de` and `th` versions. The TypeScript type is derived from the English copy, so a missing key in another language fails the type check.

## Architecture

```
Browser
  → Next.js App Router ([locale] segment, Server Components by default)
  → src/proxy.ts          redirects / and unprefixed paths to /en, /de or /th
  → Server Action         src/app/actions/contact.ts
  → Zod validation        src/lib/contact/schema.ts (stable error codes, localized in the UI)
  → rate limit + honeypot src/lib/contact/rate-limit.ts
  → delivery              src/lib/contact/deliver.ts → Postgres and/or webhook
  → typed response state  (success, invalid, rate-limited, unavailable, error)
```

- **Routing and i18n:** `src/i18n/` (locale detection, path helpers), `src/proxy.ts`, `generateStaticParams` for all 27 localized routes. Canonical URLs and `hreflang` alternates come from `src/lib/seo.ts`.
- **Design system:** tokens and type scale in `src/app/globals.css`; shared primitives in `src/components/ui`; site shell (header, menu, footer, command palette) in `src/components/shell`.
- **Backend:** `/api/health` (Route Handler) and the contact Server Action. Security headers are set in `next.config.ts`.
- **Honest delivery:** if neither a database nor a webhook is configured, the form says it is unavailable instead of pretending a message was sent.

## Database and contact delivery

Configure at least one channel, otherwise the form cannot deliver messages.

- **Postgres (Neon):** set `DATABASE_URL`. The `contact_submissions` table is created automatically on first use (`id, name, email, company, project_type, budget, message, preferred_language, status, created_at`).
- **Webhook:** set `CONTACT_WEBHOOK_URL` to a Slack/Discord-compatible incoming webhook (or Formspree, Zapier, n8n). Each submission is posted as JSON.

Both can be active at the same time; a submission succeeds if at least one channel accepts it.

## Environment variables

Copy `.env.example` to `.env.local`. Nothing secret is ever committed or sent to the browser.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap and Open Graph |
| `DATABASE_URL` | Optional Postgres connection string |
| `CONTACT_WEBHOOK_URL` | Optional webhook for contact submissions |
| `GITHUB_TOKEN` | Optional, raises the GitHub API rate limit for the public repo list |

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

Note: do not keep `node_modules` on an exFAT/FAT drive. These filesystems do not support symlinks, which npm relies on.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test             # Vitest: i18n, routing, validation, rate limit, delivery, lab tools, terminal, filters
npm run build
npm run check        # all of the above

# With a production server running (npm run build && npm start -- -p 3100):
BASE_URL=http://localhost:3100 node scripts/qa.mjs       # screenshots, console errors, horizontal overflow
BASE_URL=http://localhost:3100 node scripts/e2e.mjs      # functional smoke tests
```

## Deployment

The project deploys to Vercel with no special configuration.

```bash
npm i -g vercel
vercel login
vercel link
vercel env add NEXT_PUBLIC_SITE_URL production
vercel integration add neon      # optional: provisions DATABASE_URL
vercel deploy --prod
```

Connecting the GitHub repository in the Vercel dashboard makes every push to `main` deploy automatically.

## AI-native philosophy

AI accelerates the workflow; engineering judgment controls the outcome. Agents are used for research, drafting, refactoring and review. Requirements, architecture, security decisions and the final verification stay with a person, and every change has to pass types, lint, tests and a production build before it ships. Page 06 explains the workflow in detail.

## Content honesty

The projects shown are labelled **Concept Project** or **Technical Demonstration**. They use synthetic data and were not delivered to real clients. Add real work in `src/components/pages/projects/data.ts` and `src/content/projects.ts`.

## Folder structure

```
src/
  app/
    [locale]/            pages (one folder per page), layout, 404
    actions/contact.ts   contact Server Action
    api/health/          health Route Handler
    sitemap.ts robots.ts manifest.ts
  components/
    shell/               header, index menu, language switcher, command palette, footer
    ui/                  buttons, page hero, CTA band, complexity meter
    pages/<page>/        components owned by each page
  config/                profile.ts (personal info), pages.ts (page list)
  content/               typed EN/DE/TH copy, one module per page
  i18n/                  locales, routing helpers
  lib/                   contact backend, GitHub, lab tools, terminal engine, SEO
  proxy.ts               locale redirect
scripts/                 QA and e2e scripts
```
