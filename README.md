# ProofPe

ProofPe is India's verified startup revenue leaderboard. Startups submit public revenue metrics, upload proof, and get reviewed for ranking.

## Features

- Premium homepage with trust strip, how it works, featured startups, categories, and pricing preview
- Revenue leaderboard with filters and sorting
- Startup profile pages with SEO metadata and Open Graph
- Multi-step submission flow
- Firebase Storage screenshot upload
- Firestore startup submissions
- Verification statuses: `verified`, `proof_uploaded`, `unverified`, `rejected`
- Firebase Auth protected admin dashboard with email allowlist
- Pricing, about, FAQ, contact, privacy policy, terms
- Sitemap and robots routes

## Environment Variables

Copy `.env.example` to `.env.local` and fill:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAILS=founder@proofpe.com

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

`NEXT_PUBLIC_ADMIN_EMAILS` accepts a comma-separated allowlist.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Firebase Setup

Create a Firebase project with:

- Firebase Auth: enable Google provider
- Firestore: create a database
- Firebase Storage: create a bucket

Rules are included in `firestore.rules` and `storage.rules`. Tighten admin writes with Firebase custom claims or server-side checks before scaling beyond MVP.

## V2 Items

- Razorpay Connect
- Stripe Connect
- Payment integration for Boost and Pro
- Founder claim workflow
- Server-side admin enforcement with custom claims
- Automated verification audit trail
