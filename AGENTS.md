# Project conventions — Bharat Yojana

Next.js 16 (App Router) + React 19 + Tailwind v4 + TypeScript.

- Rule engine: `lib/astEvaluator.ts` (JSON-Logic via `json-logic-js`). Extend
  `SchemeEngine`, don't fork it. Scheme data in `lib/seedData.ts` — bump
  `REGISTRY_VERSION` on any schema-shape change.
- `/api/schemes` reports `source: local-registry | external-feed |
  external-feed-unavailable`. Never claim a live feed unless
  `EXTERNAL_SCHEME_FEED_URL` is actually set and reachable.
- i18n: `lib/translations.ts`, keyed by `LangCode`. Add new keys to every language.
- Styling target: GIGW 3.0 / WCAG 2.1 AA. No gradients, no `shadow-xl`, no
  `outline-none` without a replacement focus style.
- This is a student Smart India Hackathon project, not affiliated with the
  Government of India. Never build pages that impersonate real government
  e-services (scholarship portals, Aadhaar services, ration card status, etc.)
  even as placeholders — link out to the real `.gov.in` domain instead, or
  leave the label non-interactive.
- Roles (citizen / officer / admin) gate routes.