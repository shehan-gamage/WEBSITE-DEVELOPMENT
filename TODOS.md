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

### Durable capture of enquiries while SMTP is down
**Priority:** P2
When SMTP is unconfigured or a send fails, the contact/subscribe handler now
POSTs the enquiry JSON to `ENQUIRY_WEBHOOK_URL` (5s timeout, no-op if unset)
so the lead is captured instead of only tag-logged. Point the URL at a Google
Sheet (Apps Script), Slack/Discord webhook, or Zapier/Make. Env-gated →
unchanged behaviour until configured. Falls back to the PII-free tag log if the
webhook itself fails. Tests + live E2E (local receiver) confirm the payload
lands and no PII reaches logs. Set `ENQUIRY_WEBHOOK_URL` in prod to activate.
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
