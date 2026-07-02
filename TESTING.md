# Testing

Tests let you move fast and ship with confidence — without them, the next
change to `server.js` can silently reintroduce a security hole and nothing
catches it before deploy.

## Framework

- **vitest** (test runner) + **supertest** (HTTP assertions against the
  exported Express `app` — no listener, no network).

## Running

```bash
npm test          # full suite, single run (what CI runs)
npx vitest        # watch mode while developing
```

CI: `.github/workflows/test.yml` runs `npm test` on every push and PR.

## Layout

```
test/
  security.test.js   # security regression suite (see below)
```

## The security suite

`test/security.test.js` locks in the July 2026 API hardening. If you touch
`server.js` middleware, rate limiting, or the mail endpoints, these must stay
green:

- **Headers** — CSP (frame-ancestors, CDN allow-list incl. `connect-src`
  jsdelivr for the world map), X-Frame-Options, nosniff, HSTS
  (main-domain-only until the subdomain audit — see TODOS.md), and header
  presence on body-parser error responses (middleware ordering).
- **Rate limiting** — keyed on `req.ip` under `trust proxy: 1`; rotating the
  spoofable X-Forwarded-For prefix must NOT evade the limiter; namespaced
  buckets per endpoint; `Retry-After` on 429s.
- **Validation** — email format + length caps + control-char stripping on
  `/api/contact` and `/api/subscribe`; malformed/non-object bodies get clean
  400s.

## Conventions

- Test env vars are set **before** a dynamic `await import('../server.js')` —
  a static import hoists above the assignments and loads real `.env` SMTP
  creds (this bit us on day one; see the comment in the test file).
- Blank `SMTP_USER`/`SMTP_PASS` forces the mailer-null path so mail endpoints
  are deterministic and nothing real is ever sent.
- Never call the live Anthropic API from tests — only exercise `/api/chat`'s
  validation (400) paths.
- Each test uses its own last-hop X-Forwarded-For IP so the shared in-memory
  rate buckets never bleed between tests.
- When adding an endpoint or a conditional to `server.js`: add a test for
  both paths. When fixing a bug: add the regression test first.
