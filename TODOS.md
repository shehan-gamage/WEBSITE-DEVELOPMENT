# TODOS

## Security

### Scrub PII from serverless logs
**Priority:** P1
When SMTP is unconfigured, `/api/contact` logs the full submission (name,
email, phone, message) and the subscribe handler logs the address
(`server.js` — search `[contact] Email not configured` / `[subscribe]`).
Vercel retains function logs. Log a non-PII marker (e.g. a hash of the email)
instead. Found in the 2026-07 security review (L1).

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
