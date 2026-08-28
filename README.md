# Bharat Yojana

A citizen-facing Government Scheme Eligibility Assistant built for Smart India Hackathon.
**This is a student project and is not affiliated with the Government of India.**

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Environment variables

Create a `.env` file at the repo root (this file is gitignored, it will not be committed):

```bash
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="<any long random string>"        # required by Auth.js (NextAuth) for JWT session signing
GEMINI_API_KEY="<a real Google AI Studio / Gemini API key>"   # required only for voice intake
EXTERNAL_SCHEME_FEED_URL=                     # optional — leave unset unless you have a real external scheme feed
```

### 2. Install and set up the database

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

`prisma db seed` creates three demo accounts and prints their plaintext passwords to the console —
save them, you'll need them to sign in as an officer or admin (see "Accounts" below).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Accounts and roles

There are three roles: `citizen`, `officer`, `admin`.

- **Citizens never sign in.** The eligibility-check flow is anonymous and stored in the browser's
  `localStorage`, by design — this is not a limitation, it's intentional (no reason to require an
  account just to check eligibility).
- **Officers and admins sign in for real** at `/login`, backed by [Auth.js](https://authjs.dev)
  (NextAuth v5) with a Credentials provider and bcrypt-hashed passwords stored in the `User`
  table. Every officer/admin-only page and API route independently verifies the real session
  server-side — there is no client-settable role switch anywhere in this app.
- Seeded demo accounts (created by `npx prisma db seed`, see `prisma/seed.ts`):
  - `officer1@example.com` / `officer1_pass`
  - `officer2@example.com` / `officer2_pass`
  - `admin@example.com` / `admin_pass`
  - **These are hardcoded, plaintext demo credentials for local/judge-demo use only.** If this app
    is ever deployed anywhere publicly reachable, rotate these before doing so.

## Identity caveat

The `citizenId` stored in `localStorage` is a lightweight, unauthenticated pseudo-identity used
purely to let a citizen see only their own tracked applications on `/dashboard`. It has no
cryptographic backing and should never be described as "secure" or "authenticated" — it's private
only in the sense that nobody else happens to know the random ID.

## Known limitations

- Reports and applications live in a real SQLite database now (via Prisma), but it's a single
  local file — this is fine for a hackathon demo, not a production data store.
- Voice intake requires the Web Speech API (Chrome/Edge); it is not available in Firefox or Safari.
- Full translation coverage currently spans the homepage only — other pages (schemes list, scheme
  detail, dashboard, connect, verify, admin analytics, login) are English-only regardless of the
  selected language. See `MASTER_HANDOFF.md` for the full, current list of known gaps.

## Learn More (Next.js boilerplate)

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to automatically optimize and load [Geist](https://vercel.com/font).
