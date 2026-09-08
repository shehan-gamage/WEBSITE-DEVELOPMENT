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
    expect(res.text).toContain('info@srpitl.com');
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
