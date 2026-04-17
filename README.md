# Cadence Health — AI Patient Check-in Prototype

An exception-based physician dashboard paired with a conversational mobile check-in flow. Built as a V2 iteration informed by physician and patient feedback sessions.

**Live demo:** https://rpseaman.github.io/cadence-prototype/

## What's inside

Four views, switchable from the toggle in every header:

- **Physician Dashboard** — Flagged-First default. Separates *Requires Action* (clinical signal) from *Non-Responsive* (silent signal). Patient cards carry CCM/RPM reimbursement pills, AI-generated summaries, and a *Reviewed by Physician* badge for liability clarity. Rendered inside a mock Epic Hyperspace chrome to convey deep-integration intent.
- **Patient Desktop**
- **Patient Mobile** — Conversational check-in (one question per screen, ~90 seconds). Persistent *Something feels off* escalation with 3-tier routing. Every AI summary surfaces a *Verified by your Doctor* trust badge and speaks in trend narratives, not raw numbers.
- **Admin Dashboard**

## Stack

React 18 · TypeScript · Vite · Tailwind CSS v4 · react-router · Radix UI · Recharts

## Local development

```bash
npm install
npm run dev
```

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds with Vite and publishes the `dist/` directory to GitHub Pages.

## Project structure

```
src/
  app/
    components/   UI components (dashboards, check-in flow, EMR frame)
    context/      View-mode provider
    data/         Mock patients, vitals, flags, check-ins
    App.tsx       Router
  main.tsx
  styles/
```
