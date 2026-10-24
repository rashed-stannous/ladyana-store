# Ladyana Store
Responsive Ladyana shopping app with a compact mobile header, Supabase product catalogue, email/password sign-in and customer wishlists.

## Run
Requires Node.js 22+. Run `npm ci`, then `npm run dev`. Run `npm run build` to create `dist/`.

## Vercel
Import this repository, choose Vite, use `npm run build` and output directory `dist`. The included public Supabase configuration works without additional environment variables. Optional overrides: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

## Database
Project: `hzvysxorvicovdtnmiak` (ladyana-store). Products are public read-only; authenticated customers can read, add and delete only their own wishlist entries. All exposed tables have RLS. Manage product records through the Supabase dashboard. The browser contains only a publishable API key, never a privileged service key.

## Customer accounts
Open Account, create an account, confirm the email if required, then sign in. Sign-in uses email/password. Saved pieces sync to the account. Email confirmation delivery and the final deployed-domain auth settings need checking before launch. No real customer email was used in automated checks.

## Current status
The six products and prices are samples. Checkout, payment options, order tracking and newsletter are simulated. No payment is collected and delivery details are not stored. Do not use this preview to accept real orders.

## Validation
Production build passes. Browser-key API check confirms six catalogue products are readable and anonymous wishlist access is denied. Supabase security advisor reports no database issues.
