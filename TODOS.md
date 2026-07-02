# TODOS

## Security

### Re-enable HSTS includeSubDomains after a subdomain audit
**Priority:** P2
HSTS currently pins the main domain only (`max-age=31536000`). Before adding
`includeSubDomains` (+ eventual preload), enumerate every DNS record on
srpitl.com and confirm each subdomain terminates TLS — the browser pin is a
one-way door for repeat visitors. See the header comment in `server.js`.

### Migrate CSP from 'unsafe-inline' to nonces
**Priority:** P3
`script-src`/`style-src` carry `'unsafe-inline'` because the EJS templates
use inline `<script>` blocks, `on*` handlers, and `style=""` attributes
throughout. Move inline scripts to `/public/js` files, replace inline
handlers with listeners, then drop `'unsafe-inline'` for a nonce-based CSP.

## Server

### Extract a rate-limit middleware factory
**Priority:** P3
The identical 3-line 429 guard is repeated in `/api/chat`, `/api/contact`,
and `/api/subscribe` (`server.js`). Extract
`rateLimit(prefix, limit, windowMs)` returning Express middleware and mount
it per route so the three call sites can't drift. Flagged by the 2026-07
pre-landing review (maintainability).

### Global rate limiting via a shared store
**Priority:** P4
The in-memory limiter is per-warm-instance on Vercel. For hard global limits
on the paid Anthropic endpoint, front it with a shared store (e.g. Upstash
Redis). Documented limitation in the limiter's header comment.

## Completed

### Rotate the enquiry-webhook token
**Priority:** P4
The `ENQUIRY_WEBHOOK_URL` `?token=` shared secret was exposed in a setup
transcript. Rotated: new `SECRET` in the Apps Script → deployed as Version 2 of
the same web-app deployment (the `/exec` URL is unchanged); `?token=` updated in
the Vercel env var and prod redeployed. Verified the sink now rejects the old
token (`unauthorized`) and accepts the new one. Old token is dead.
**Completed:** 2026-07-02

### Asset cache-busting → SHA-based (Vercel-effective)
**Priority:** P2
The `mtime`-based `?v=` was silently broken on Vercel (build normalizes mtimes
to a fixed constant, so the token never changed across deploys). Now keyed off
`VERCEL_GIT_COMMIT_SHA` (per-deploy), with an mtime fallback locally. Also
versioned the previously-missed `cinematic-fx.css`. `test/asset-versioning.test.js`
asserts every local asset carries `?v=<sha8>` and none ship unversioned.
Verified live: prod serves `?v=<sha>`.
**Completed:** 2026-07-02

### Contact/portal forms: inline errors (blocking alert() removed)
**Priority:** P3
`alert()` (which suspends the JS event loop and wedges automated QA) replaced
with styled inline `.form-msg` / `.portal-msg` (aria-live, node-built, no
innerHTML). Also cache-busted local `<script>` tags (see the SHA fix above).
Root-cause investigation confirmed the contact page has no real perf/loop bug.
**Completed:** 2026-07-02

### Durable capture of enquiries while SMTP is down — BUILT + LIVE
**Priority:** P2
`captureEnquiry()` POSTs the enquiry to `ENQUIRY_WEBHOOK_URL` when SMTP is
unconfigured or a send fails (5s timeout, PII-free tag-log fallback). Wired live
in prod: a token-guarded Apps Script web app appends rows to the "SRP Website
Enquiries" Google Sheet; `ENQUIRY_WEBHOOK_URL` is set in Vercel (Production).
Verified end-to-end (valid → row, bad token → rejected). Setup guide in
`docs/enquiry-webhook.md`.
**Completed:** 2026-07-02

### Scrub PII from serverless logs
**Priority:** P1
When SMTP was unconfigured, `/api/contact` logged the full submission and
`/api/subscribe` logged the raw address; the contact send-failure path logged
the raw nodemailer error (which can echo the envelope + body). Replaced with a
salted non-reversible `piiTag(email)` correlation marker + field-presence list;
send-failure now logs `err.message` only. Regression tests assert no raw
name/email/phone/message text reaches `console`. Found in the 2026-07 security
review (L1).
**Completed:** 2026-07-02

### API security hardening (H1–M3) + test suite
**Priority:** P1
From the 2026-07 security review: rate-limit keying moved to `req.ip` (kills the
X-Forwarded-For spoof / paid-API DoS); rate limits + length caps + email
validation on `/api/contact` and `/api/subscribe`; global security headers
(CSP, X-Frame-Options, nosniff, HSTS, Referrer/Permissions-Policy) registered
before the body parser. Bootstrapped the vitest + supertest suite and CI that
now guards all of the above.
**Completed:** 2026-07-02
