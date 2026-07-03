/* Security regression tests for the API hardening shipped 2026-07.
   These lock in the fixes from the security review:
     H1 — rate-limit keying uses req.ip (trust proxy), not raw X-Forwarded-For
     M1 — rate limits + length caps on the mail endpoints
     M2 — email format validation on /api/contact
     M3 — security headers (CSP, X-Frame-Options, HSTS, nosniff) on every response

   The suite imports the Express app directly (no listener): VERCEL=1 suppresses
   app.listen, and blank SMTP creds force the mailer-null path so /api/contact
   and /api/subscribe respond deterministically without sending mail.

   NOTE ON IPs: `trust proxy` is 1, so in tests (direct connection, one trusted
   hop) req.ip resolves to the LAST X-Forwarded-For entry — the same position
   Vercel's edge writes the real client IP to in production. Each test uses its
   own last-hop IP so the shared in-memory rate buckets never bleed between tests. */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';

/* Env setup MUST precede loading server.js — static `import` hoists above any
   statement, so the app is pulled in dynamically after these assignments.
   (dotenv never overrides pre-set vars, so blank strings win over .env.) */
process.env.VERCEL = '1';        // suppress app.listen
process.env.SMTP_USER = '';      // force mailer-null path (no real email)
process.env.SMTP_PASS = '';
const { default: app } = await import('../server.js');

/* Vercel-shaped XFF: attacker-controlled junk first, "real" client IP last. */
const xff = (ip) => `198.51.100.99, ${ip}`;

describe('M3 — security headers', () => {
  it('sets all security headers on a page response', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(res.headers['permissions-policy']).toContain('geolocation=()');
  });

  it('HSTS pins the main domain only (no includeSubDomains until subdomain audit)', async () => {
    const res = await request(app).get('/');
    expect(res.headers['strict-transport-security']).toBe('max-age=31536000');
  });

  it('CSP blocks framing and allows the CDNs the site actually uses', async () => {
    const res = await request(app).get('/');
    const csp = res.headers['content-security-policy'];
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    // script-src: nonce-based (no unsafe-inline), still allows self + the jsdelivr CDN. See the CSP-nonce suite.
    expect(csp).toMatch(/script-src 'self' 'nonce-[^']+' https:\/\/cdn\.jsdelivr\.net/);
    // connect-src must include jsdelivr — public/js/map.js fetches world-atlas topojson from it
    expect(csp).toMatch(/connect-src 'self' https:\/\/cdn\.jsdelivr\.net/);
    expect(csp).toContain('https://fonts.googleapis.com');
    expect(csp).toContain('https://fonts.gstatic.com');
  });

  it('headers survive a malformed-JSON 400 (middleware registered before body parser)', async () => {
    const res = await request(app)
      .post('/api/chat')
      .set('content-type', 'application/json')
      .set('X-Forwarded-For', xff('203.0.113.10'))
      .send('{not json!!');
    expect(res.status).toBe(400);
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});

describe('M2 — contact form validation', () => {
  it('rejects a missing email', async () => {
    const res = await request(app).post('/api/contact')
      .set('X-Forwarded-For', xff('203.0.113.20'))
      .send({ name: 'Bob', message: 'hi' });
    expect(res.status).toBe(400);
  });

  it('rejects a malformed email', async () => {
    const res = await request(app).post('/api/contact')
      .set('X-Forwarded-For', xff('203.0.113.21'))
      .send({ name: 'Bob', email: 'not-an-email', message: 'hi' });
    expect(res.status).toBe(400);
  });

  it('accepts a valid submission (mailer-null path)', async () => {
    const res = await request(app).post('/api/contact')
      .set('X-Forwarded-For', xff('203.0.113.22'))
      .send({ name: 'Bob', email: 'bob@example.com', message: 'hi there' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('survives control characters and oversized fields without crashing', async () => {
    const res = await request(app).post('/api/contact')
      .set('X-Forwarded-For', xff('203.0.113.23'))
      .send({
        name: 'Bob\r\nBcc: evil@attacker.example',
        email: 'bob@example.com',
        subject: 'x'.repeat(10_000),
        message: 'y'.repeat(50_000),
      });
    expect(res.status).toBe(200); // clipped + stripped, not errored
  });

  it('rejects a non-object body cleanly', async () => {
    const res = await request(app).post('/api/contact')
      .set('content-type', 'application/json')
      .set('X-Forwarded-For', xff('203.0.113.24'))
      .send('"just a string"');
    expect(res.status).toBe(400);
  });
});

describe('M2 — subscribe validation', () => {
  it('rejects a malformed email', async () => {
    const res = await request(app).post('/api/subscribe')
      .set('X-Forwarded-For', xff('203.0.113.30'))
      .send({ email: 'nope' });
    expect(res.status).toBe(400);
  });

  it('accepts a valid email (mailer-null path)', async () => {
    const res = await request(app).post('/api/subscribe')
      .set('X-Forwarded-For', xff('203.0.113.31'))
      .send({ email: 'reader@example.com' });
    expect(res.status).toBe(200);
  });
});

describe('H1 + M1 — rate limiting keyed on the real client IP', () => {
  it('contact trips 429 with Retry-After after 5/min even when the spoofable XFF prefix rotates', async () => {
    const results = [];
    for (let i = 1; i <= 6; i++) {
      const res = await request(app).post('/api/contact')
        // Attacker rotates the first (spoofable) entry; the trusted last hop is constant.
        .set('X-Forwarded-For', `10.9.9.${i}, 203.0.113.40`)
        .send({ name: 'x', email: 'bad', message: 'y' });
      results.push(res);
    }
    expect(results.slice(0, 5).every(r => r.status === 400)).toBe(true); // limiter not yet tripped
    expect(results[5].status).toBe(429);
    expect(results[5].headers['retry-after']).toBe('60');
  });

  it('subscribe has its own bucket (namespaced keys)', async () => {
    // Same IP as an already-limited contact bucket must NOT be pre-limited here.
    const res = await request(app).post('/api/subscribe')
      .set('X-Forwarded-For', xff('203.0.113.40'))
      .send({ email: 'bad' });
    expect(res.status).toBe(400); // 400 (validation), NOT 429 — separate namespace
  });

  it('chat validates the body shape', async () => {
    const res = await request(app).post('/api/chat')
      .set('X-Forwarded-For', xff('203.0.113.50'))
      .send({});
    expect(res.status).toBe(400);
  });
});

describe('L1 — no PII written to logs when SMTP is unconfigured', () => {
  let warns;
  beforeEach(() => { warns = vi.spyOn(console, 'warn').mockImplementation(() => {}); });
  afterEach(() => { warns.mockRestore(); });

  it('contact drops the enquiry from logs — no name/email/phone/message text', async () => {
    const pii = {
      name: 'Alice Zephyr', email: 'alice.zephyr@example.com',
      phone: '+94771234567', company: 'Acme Ltd',
      subject: 'Confidential merger', message: 'secret deal terms here',
    };
    const res = await request(app).post('/api/contact')
      .set('X-Forwarded-For', xff('203.0.113.60')).send(pii);
    expect(res.status).toBe(200);
    const logged = warns.mock.calls.flat().join(' ');
    for (const v of Object.values(pii)) expect(logged).not.toContain(v);
    // A correlation tag + the field-presence list are fine (no raw values).
    expect(logged).toMatch(/tag=[0-9a-f]{10}/);
    expect(logged).toContain('fields=');
  });

  it('subscribe logs a tag, never the raw address', async () => {
    const res = await request(app).post('/api/subscribe')
      .set('X-Forwarded-For', xff('203.0.113.61'))
      .send({ email: 'reader.secret@example.com' });
    expect(res.status).toBe(200);
    const logged = warns.mock.calls.flat().join(' ');
    expect(logged).not.toContain('reader.secret@example.com');
    expect(logged).toMatch(/tag=[0-9a-f]{10}/);
  });
});

describe('CSP nonces (script-src locked, no unsafe-inline)', () => {
  it('script-src uses a per-request nonce and has no unsafe-inline; style-src keeps it', async () => {
    const csp = (await request(app).get('/contact')).headers['content-security-policy'];
    expect(csp).toMatch(/script-src [^;]*'nonce-[^']+'/);       // nonce present
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);  // script-src locked down
    expect(csp).toMatch(/style-src[^;]*'unsafe-inline'/);       // style-src keeps it (attribute styles)
  });

  it('every inline <script> carries the response nonce', async () => {
    const res = await request(app).get('/contact');
    const nonce = res.headers['content-security-policy'].match(/'nonce-([^']+)'/)[1];
    const inline = (res.text.match(/<script\b[^>]*>/g) || []).filter(s => !/\ssrc=/.test(s));
    expect(inline.length).toBeGreaterThan(0);           // there IS at least one inline script (ld+json)
    for (const s of inline) expect(s).toContain(`nonce="${nonce}"`);
  });

  it('the nonce changes per request', async () => {
    const a = (await request(app).get('/')).headers['content-security-policy'];
    const b = (await request(app).get('/')).headers['content-security-policy'];
    expect(a).not.toBe(b);
  });
});

describe('routing hardening', () => {
  it('301-redirects www to the apex domain', async () => {
    const res = await request(app).get('/about').set('Host', 'www.srpitl.com');
    expect(res.status).toBe(301);
    expect(res.headers.location).toBe('https://srpitl.com/about');
  });

  it('404s unknown regions instead of erroring', async () => {
    const res = await request(app).get('/not-a-region');
    expect(res.status).toBe(404);
  });
});
