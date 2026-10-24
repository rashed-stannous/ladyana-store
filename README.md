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

## PWA and admin
- Installable manifest, 192/512 PNG icons, Apple touch icon and offline fallback. The popup appears after load; dismissing it hides it for seven days. iOS shows manual installation instructions. No account, order or API responses are cached by the service worker.
- `/admin` provides a protected dashboard, product create/edit/publish/hide, photo uploads, stock quantities, manual orders and payment/tracking status, order-derived customer summary and store settings.
- Admin authorization uses `public.admin_members`, writable only by a trusted database operator. A customer cannot assign themselves this role. The owner must identify their exact registered, verified account before membership is granted.
- Orders are manually recorded (e.g. Messenger/phone); the customer checkout remains a demo. Admins adjust stock separately. Online payment collection, automatic inventory reservation, coupons and refunds through payment gateways are not implemented.

## Social account sign-in

Google, Facebook and Apple buttons are shared by customer accounts and `/admin`.
The UI reads Supabase's public Auth settings on load and only enables configured
providers. Disabled providers display Coming soon; email sign-up remains available.
The SDK handles browser OAuth sessions. Customer redirects return to `/?account=1`,
while admin redirects return to `/admin`; social login never grants admin membership.

Activation (store owner):
1. In Supabase Authentication > URL Configuration set Site URL to
   `https://ladyana-store.vercel.app` and allow these exact redirect URLs:
   `https://ladyana-store.vercel.app/?account=1` and `https://ladyana-store.vercel.app/admin`.
2. In Authentication > Sign In / Providers configure the provider's client ID and
   secret. Enter secrets only in Supabase, never in this repository or chat.
3. Use `https://hzvysxorvicovdtnmiak.supabase.co/auth/v1/callback` as the provider's
   authorized callback URL.
4. Google: create a Web OAuth client and consent screen in Google Cloud; complete
   publication requirements so customers beyond test users can sign in.
5. Facebook: configure Facebook Login with public_profile/email permissions and
   publish the app in Live mode after meeting Meta's policy/review requirements.
6. Apple: use an Apple Developer account, App ID with Sign in with Apple, web
   Services ID, and signing key. Supabase's Apple Client IDs must list the web
   Services ID first. Configure the Supabase project domain and callback with Apple.
   Generate the client secret securely and rotate it before its six-month expiry.
7. Test each provider with a customer account: new account, returning login,
   cancellation, sign-out, and denied access to admin. Test iPhone Safari/PWA too.

Provider setup is pending: all three reported disabled on 24 October 2026.
Docs: https://supabase.com/docs/guides/auth/social-sign-in/auth-google
https://supabase.com/docs/guides/auth/social-sign-in/auth-facebook
https://supabase.com/docs/guides/auth/social-sign-in/auth-apple
