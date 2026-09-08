/* Careers page tests.

   The /careers route has one meaningful conditional — whether
   data/careers.js publishes any vacancies — so both branches are covered:
   the speculative-application state (the current, empty state) and a
   rendered vacancy. The populated branch mocks the data module and
   re-imports the app so the real careers data stays untouched.

   Same harness as the other suites: VERCEL=1 suppresses app.listen and
   blank SMTP creds force the mailer-null path. */
import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

process.env.VERCEL = '1';
process.env.SMTP_USER = '';
process.env.SMTP_PASS = '';

describe('careers page', () => {
  it('renders and invites speculative applications when no vacancies are published', async () => {
    const { default: app } = await import('../server.js');
    const res = await request(app).get('/careers');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Build Your Career With SRP International');
    expect(res.text).toContain('No Advertised Vacancies at Present');
    expect(res.text).toContain('hrservices@srpitl.com');
  });

  it('lists the vacancy and hides the empty state when a role is published', async () => {
    vi.resetModules();
    vi.doMock('../data/careers.js', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        openings: [{
          id: 'corporate-secretarial-executive',
          title: 'Corporate Secretarial Executive',
          location: 'Colombo, Sri Lanka',
          type: 'Full Time',
          summary: 'Supporting statutory compliance for a portfolio of client entities.',
          responsibilities: ['Maintain statutory registers and corporate records.'],
          requirements: ['Two years of company secretarial experience.'],
        }],
      };
    });

    const { default: app } = await import('../server.js');
    const res = await request(app).get('/careers');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Corporate Secretarial Executive');
    expect(res.text).toContain('Colombo, Sri Lanka');
    expect(res.text).toContain('Apply for This Role');
    expect(res.text).not.toContain('No Advertised Vacancies at Present');

    vi.doUnmock('../data/careers.js');
    vi.resetModules();
  });

  it('is listed in the sitemap', async () => {
    const { default: app } = await import('../server.js');
    const res = await request(app).get('/sitemap.xml');
    // supertest binds an ephemeral port, so match the path rather than the host.
    expect(res.text).toMatch(/<loc>https?:\/\/[^<]*\/careers<\/loc>/);
  });
});

/* /api/careers — same hardening as /api/contact. SMTP is blank in tests, so the
   handler takes the mailer-null path and reports success without sending mail.
   `trust proxy` is 1, so req.ip is the LAST X-Forwarded-For entry; each test
   uses its own last hop so the shared rate-limit buckets never bleed. */
const xff = (ip) => `198.51.100.99, ${ip}`;

const validApplication = {
  name: 'Test Candidate',
  email: 'candidate@example.com',
  phone: '+94 11 234 5678',
  position: 'Corporate Secretarial Executive',
  cvLink: 'https://example.com/cv.pdf',
  message: 'I have five years of company secretarial experience.',
};

describe('POST /api/careers', () => {
  it('accepts a complete application', async () => {
    const { default: app } = await import('../server.js');
    const res = await request(app)
      .post('/api/careers')
      .set('X-Forwarded-For', xff('203.0.113.41'))
      .send(validApplication);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.redirect).toBe('/thank-you');
  });

  it('rejects an application with no covering note', async () => {
    const { default: app } = await import('../server.js');
    const res = await request(app)
      .post('/api/careers')
      .set('X-Forwarded-For', xff('203.0.113.42'))
      .send({ ...validApplication, message: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  it('rejects a malformed email address', async () => {
    const { default: app } = await import('../server.js');
    const res = await request(app)
      .post('/api/careers')
      .set('X-Forwarded-For', xff('203.0.113.43'))
      .send({ ...validApplication, email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/valid email/i);
  });

  it('rate-limits repeated submissions from one IP', async () => {
    const { default: app } = await import('../server.js');
    const ip = xff('203.0.113.44');
    let last;
    for (let i = 0; i < 7; i++) {
      last = await request(app).post('/api/careers').set('X-Forwarded-For', ip).send(validApplication);
    }
    expect(last.status).toBe(429);
  });
});
