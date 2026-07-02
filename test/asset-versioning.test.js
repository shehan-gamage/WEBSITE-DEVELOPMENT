/* Asset cache-bust versioning (SHA-based on Vercel).

   On Vercel, file mtimes are normalized to a fixed constant at build, so the old
   mtime-based ?v= never changed across deploys — returning visitors kept stale
   CSS/JS. The fix keys ?v= off the deploy's git SHA (VERCEL_GIT_COMMIT_SHA),
   which is unique per deploy. This test loads the app WITH that env set and
   asserts every local CSS/JS link carries ?v=<first 8 of the SHA>.

   DEPLOY_VER is read into a module const at import time, so the env must be set
   before the dynamic import. */

import { describe, it, expect } from 'vitest';
import request from 'supertest';

process.env.VERCEL = '1';
process.env.SMTP_USER = '';
process.env.SMTP_PASS = '';
process.env.VERCEL_GIT_COMMIT_SHA = 'deadbeefcafef00d5678';
const SHA8 = 'deadbeef'; // first 8 chars
const { default: app } = await import('../server.js');

describe('SHA-based asset versioning (Vercel)', () => {
  it('versions global + page JS with the deploy SHA on /contact', async () => {
    const html = (await request(app).get('/contact')).text;
    expect(html).toContain(`/js/global.js?v=${SHA8}`);
    expect(html).toContain(`/js/contact.js?v=${SHA8}`);
  });

  it('versions CSS with the deploy SHA', async () => {
    const html = (await request(app).get('/contact')).text;
    // global.css is on every page; contact.css is the page stylesheet.
    expect(html).toMatch(new RegExp(`/css/global\\.css\\?v=${SHA8}`));
    expect(html).toMatch(new RegExp(`/css/contact\\.css\\?v=${SHA8}`));
  });

  it('versions the home page local scripts (map.js, cinematic-fx.js) with the SHA', async () => {
    const html = (await request(app).get('/')).text;
    expect(html).toContain(`/js/map.js?v=${SHA8}`);
    expect(html).toContain(`/js/cinematic-fx.js?v=${SHA8}`);
  });

  it('leaves no unversioned local asset link', async () => {
    const html = (await request(app).get('/')).text + (await request(app).get('/contact')).text;
    // No local /js/foo.js or /css/foo.css without a ?v= query.
    expect(html).not.toMatch(/(?:src|href)="\/(?:js|css)\/[a-z0-9-]+\.(?:js|css)"/i);
  });
});
