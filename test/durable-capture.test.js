/* Durable fallback-capture tests (P2). When SMTP can't take an enquiry, the
   handler POSTs it to ENQUIRY_WEBHOOK_URL so the lead isn't lost.

   This is a SEPARATE file from security.test.js because ENQUIRY_WEBHOOK_URL is
   read into a module const at import time — it must be set before server.js
   loads. (security.test.js loads the app with the webhook UNSET, which guards
   the "no sink → unchanged behaviour" invariant.)

   global.fetch is stubbed so nothing hits the network; SMTP stays blank so the
   mailer-null path (which calls captureEnquiry identically to the send-failure
   path) is exercised. */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';

process.env.VERCEL = '1';
process.env.SMTP_USER = '';
process.env.SMTP_PASS = '';
process.env.ENQUIRY_WEBHOOK_URL = 'https://webhook.test/capture';
const { default: app } = await import('../server.js');

const xff = (ip) => `198.51.100.1, ${ip}`;

describe('P2 — durable fallback capture', () => {
  let fetchMock, warns;
  beforeEach(() => {
    fetchMock = vi.fn(async () => ({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);
    warns = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => { vi.unstubAllGlobals(); warns.mockRestore(); });

  it('contact POSTs the enquiry to the webhook and reports success', async () => {
    const res = await request(app).post('/api/contact')
      .set('X-Forwarded-For', xff('203.0.113.70'))
      .send({ name: 'Dana', email: 'dana@example.com', phone: '+9477', message: 'need help' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('https://webhook.test/capture');
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body);
    expect(body.kind).toBe('contact');
    expect(body.email).toBe('dana@example.com');
    expect(body.message).toBe('need help');
    expect(body.receivedAt).toBeTruthy();
    // The request must be time-bounded (AbortController signal present).
    expect(opts.signal).toBeTruthy();
  });

  it('subscribe POSTs the address to the webhook', async () => {
    const res = await request(app).post('/api/subscribe')
      .set('X-Forwarded-For', xff('203.0.113.71'))
      .send({ email: 'reader@example.com' });
    expect(res.status).toBe(200);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.kind).toBe('subscribe');
    expect(body.email).toBe('reader@example.com');
  });

  it('still succeeds (no crash) when the webhook itself fails', async () => {
    fetchMock.mockImplementation(async () => ({ ok: false, status: 500 }));
    const res = await request(app).post('/api/contact')
      .set('X-Forwarded-For', xff('203.0.113.72'))
      .send({ name: 'Eve', email: 'eve@example.com', message: 'hi' });
    expect(res.status).toBe(200); // mailer-null path always accepts; lead tag-logged
  });

  it('survives a webhook network error / timeout without throwing', async () => {
    fetchMock.mockImplementation(async () => { throw new Error('ECONNRESET'); });
    const res = await request(app).post('/api/subscribe')
      .set('X-Forwarded-For', xff('203.0.113.73'))
      .send({ email: 'x@example.com' });
    expect(res.status).toBe(200);
  });

  it('never logs raw PII on the capture path — only a tag', async () => {
    await request(app).post('/api/contact')
      .set('X-Forwarded-For', xff('203.0.113.74'))
      .send({ name: 'Frank Secret', email: 'frank@secret.example', message: 'private' });
    const logged = warns.mock.calls.flat().join(' ');
    expect(logged).not.toContain('Frank Secret');
    expect(logged).not.toContain('frank@secret.example');
    expect(logged).not.toContain('private');
    expect(logged).toMatch(/tag=[0-9a-f]{10}/);
    expect(logged).toContain('webhook');
  });
});
