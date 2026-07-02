# TODOS

## Security

### Durable capture of enquiries while SMTP is down
**Priority:** P2
The PII log scrub means that when SMTP is unconfigured, a contact/subscribe
submission is accepted but its content is no longer written anywhere — only a
correlation `tag=` + field-presence list is logged. SMTP is configured in
production so this is a safety-net path, but for guaranteed capture during an
outage, persist submissions to a datastore (e.g. a Google Sheet via the
existing Workspace creds, or a KV store) instead of relying on logs.

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
