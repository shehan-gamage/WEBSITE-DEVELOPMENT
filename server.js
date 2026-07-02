import Anthropic from '@anthropic-ai/sdk';
import express from 'express';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { statSync } from 'fs';
import { createHash } from 'crypto';
import 'dotenv/config';
import { offices } from './data/offices.js';
import { services, getService, getRegionServices, globalServices } from './data/services.js';
import { posts, categories, getPost, categoryName, readingTime, categoryCounts } from './data/posts.js';
import { FAQ_KNOWLEDGE, faqTreeForClient } from './data/faq.js';
import { reportsByYear, getEdition, reportView, latestEdition, activeEditions } from './data/reports.js';
import {
  organizationLd, websiteLd, breadcrumbLd, blogPostingLd,
  reportArticleLd, faqPageLd, professionalServiceLd, serviceLd, teamPersonsLd,
} from './data/seo.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app  = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

/* ── Security headers (registered FIRST, before any middleware that can error
   out of the chain — e.g. express.json()'s 400/413 parse failures — so even
   those error responses carry the headers) ──
   No external dep: set manually. frame-ancestors 'none' blocks clickjacking
   (matters once the Client Portal login ships); nosniff stops MIME-sniffing;
   HSTS pins HTTPS (main domain only — add includeSubDomains once every
   srpitl.com subdomain is confirmed to terminate TLS; the browser pin is a
   one-way door). The CSP keeps 'unsafe-inline' for script/style because the
   site relies on inline <script> blocks, inline on* handlers, and inline
   style="" attributes throughout the EJS templates — tightening to nonces is a
   larger refactor. Allow-lists cover the CDNs and Google Fonts actually used. */
const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  /* vercel.live is the preview-deploy comments toolbar — preview only. */
  `script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net${IS_PREVIEW ? ' https://vercel.live' : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  // jsdelivr also serves the world-atlas topojson fetched by public/js/map.js (d3.json → XHR)
  `connect-src 'self' https://cdn.jsdelivr.net${IS_PREVIEW ? ' https://vercel.live wss://*.pusher.com' : ''}`,
].join('; ');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Content-Security-Policy', CSP);
  next();
});

app.use(express.json());

/* Static assets with cache headers tuned for Core Web Vitals on repeat views.
   CSS/JS are always requested with a ?v=<mtime> cache-buster (see res.locals.cssVer
   + partials/head.ejs), so they are safe to mark immutable for a year. Images and
   fonts get a week with stale-while-revalidate — fast repeat loads, but a replaced
   asset still refreshes promptly (team portraits additionally use ?v= cache-busting).
   Vercel's edge compresses (gzip/brotli) these responses automatically. */
app.use(express.static(join(__dirname, 'public'), {
  maxAge: '1d',
  setHeaders(res, filePath) {
    if (/\.(css|js)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (/\.(jpe?g|png|webp|avif|gif|svg|ico|woff2?|ttf|otf)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    }
  },
}));

/* Make the offices list available to EVERY rendered view so partials
   (header, footer) can read it without each route having to pass it. */
/* WhatsApp Business click-to-chat — defined once so footer, contact page,
   and the floating button all share the same number + prefilled message. */
const WHATSAPP = {
  number: '94768050504',
  display: '+94 768 050 504',
  href: 'https://wa.me/94768050504?text=' +
    encodeURIComponent("Hi SRP International, I'd like to ask about your services."),
};

/* Honour X-Forwarded-Proto from Vercel's proxy so req.protocol is https
   in production (needed for absolute canonical/OG URLs), AND — security-load-
   bearing — for req.ip, which keys the per-IP rate limiter (see clientIp()).
   Keep this at exactly 1 (one trusted hop = Vercel's edge): raising it or
   setting `true` would trust client-supplied X-Forwarded-For entries and
   reopen the rate-limit spoofing bypass. */
app.set('trust proxy', 1);

/* Returns the first complete sentence of a block of text — used for hero
   teasers and card summaries so they read as full sentences instead of being
   cut off mid-word. Falls back to the whole string if no sentence end is found. */
function firstSentence(text) {
  if (!text) return '';
  const m = String(text).match(/[^.!?]*[.!?]/);
  return (m ? m[0] : String(text)).trim();
}

/* Canonical host: 301-redirect www.srpitl.com → srpitl.com (preserving path +
   query). Runs first so it short-circuits before any route or static asset.
   Only the www host is affected — the apex, *.vercel.app, and localhost pass through. */
app.use((req, res, next) => {
  if (req.headers.host === 'www.srpitl.com') {
    return res.redirect(301, 'https://srpitl.com' + (req.originalUrl || '/'));
  }
  next();
});

app.use((req, res, next) => {
  res.locals.offices = offices;
  res.locals.whatsapp = WHATSAPP;
  res.locals.firstSentence = firstSentence;
  /* Absolute URLs for canonical + Open Graph tags. Host-derived so they
     follow the domain automatically (vercel.app now, custom domain later). */
  res.locals.siteBase = `${req.protocol}://${req.get('host')}`;
  res.locals.pageUrl = res.locals.siteBase + (req.originalUrl || '/').split('?')[0];
  /* Sitewide structured data emitted on every page (partials/head.ejs merges any
     per-route `jsonLd` into this @graph). Host-derived so the @id URLs follow the
     domain. Routes add page-specific nodes (BlogPosting, FAQPage, breadcrumbs, …). */
  res.locals.baseGraph = [organizationLd(res.locals.siteBase), websiteLd(res.locals.siteBase)];
  /* Date formatter for the blog (NA English: "June 12, 2026"). Anchored to
     local midnight so the date never slips across a timezone boundary. */
  res.locals.fmtDate = (iso) =>
    new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  /* Cache-bust CSS links by file mtime so stylesheet edits show immediately
     (no hard refresh) and never get served stale after a deploy. */
  res.locals.cssVer = (file) => {
    try { return Math.floor(statSync(join(__dirname, 'public', 'css', file)).mtimeMs); }
    catch { return 0; }
  };
  /* Same cache-bust for JS. Scripts are served immutable for a year (see the
     static-asset headers), so without a ?v=<mtime> query a returning visitor
     keeps stale JS after a deploy. Version every local <script> the same way
     CSS links are versioned. */
  res.locals.jsVer = (file) => {
    try { return Math.floor(statSync(join(__dirname, 'public', 'js', file)).mtimeMs); }
    catch { return 0; }
  };
  next();
});

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/* ── Email (enquiry notifications) ──
   Uses Google Workspace SMTP (smtp.gmail.com) by default since srpitl.com
   runs on Google Workspace. Authenticate with a Workspace mailbox + a
   16-char App Password (2-Step Verification must be enabled on that account).
   Set SMTP_USER / SMTP_PASS in .env. Enquiries are delivered to ENQUIRY_TO. */
const ENQUIRY_TO    = process.env.ENQUIRY_TO || 'clientrelations@srpitl.com';
/* Visible From address. Decoupled from SMTP_USER so we can send AS a
   noreply/brand address while still authenticating as a real mailbox.
   NOTE: Gmail only honours this if the SMTP account is authorised to
   "Send mail as" it (Gmail → Settings → Accounts), otherwise it rewrites
   the From back to SMTP_USER. Defaults to SMTP_USER when unset. */
const MAIL_FROM     = process.env.MAIL_FROM || process.env.SMTP_USER;
const mailConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
const mailer = mailConfigured
  ? nodemailer.createTransport({
      host:   process.env.SMTP_HOST || 'smtp.gmail.com',
      port:   Number(process.env.SMTP_PORT) || 465,
      secure: (process.env.SMTP_SECURE || 'true') !== 'false', // true for port 465
      auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

if (!mailConfigured) {
  console.warn('[contact] SMTP_USER/SMTP_PASS not set — enquiries will be accepted but NOT emailed (and NOT logged, to avoid storing PII). See .env.example.');
}

/* Contact + locations are sourced from the offices data (single source of
   truth) so the assistant never drifts from what the site shows. */
const HQ = offices.find(o => o.isHQ) || offices[0];
const LOCATIONS = offices
  .map(o => (o.city && o.city !== o.label) ? `${o.label} (${o.city})` : o.label)
  .join(', ');

/* Build a compact, accurate market catalog from the real services + offices
   data (single source of truth) so the assistant can answer jurisdiction-
   specific questions without inventing anything. Pricing FIGURES are
   deliberately omitted — the site gates fees behind a "Request a quote" CTA,
   so the assistant describes scope/structure and routes pricing to the team.
   Rebuilt at startup; static, so it is sent as a cacheable prompt block.   */
function buildMarketCatalog() {
  const out = [];
  for (const office of offices) {
    const svcMap = services[office.slug];
    if (!svcMap) continue;
    const lead = office.lead ? ` Regional lead: ${office.lead.name}, ${office.lead.role}.` : '';
    const soon = office.comingSoon ? ' (office opening soon)' : '';
    const hours = office.hours ? ` Hours: ${office.hours}.` : '';
    out.push(`\n## ${office.label} — ${office.city}${soon}`);
    out.push(`Office: ${office.address.line1}, ${office.address.line2}. Phone: ${office.phone}. Email: ${office.email}.${hours}${lead}`);
    for (const svc of Object.values(svcMap)) {
      out.push(`\n### ${svc.title}`);
      if (svc.overview) out.push(svc.overview);
      if (svc.included?.length) out.push(`Includes: ${svc.included.join('; ')}.`);
      if (Array.isArray(svc.faqs)) {
        for (const f of svc.faqs) out.push(`Q: ${f.q}\nA: ${f.a}`);
      }
      out.push('Pricing: shared via a tailored quote — do not state specific fees; route pricing questions to the team.');
    }
  }
  return out.join('\n');
}
const MARKET_CATALOG = `=== SRP INTERNATIONAL — MARKET CATALOG (authoritative; answer only from this) ===
${buildMarketCatalog()}`;

const SYSTEM_INTRO = `You are the Client Relationship Manager for SRP International, a professional corporate services firm.
Your role is to help website visitors understand SRP International's services and guide them to get in touch.
If asked who you are, introduce yourself as SRP International's Client Relationship Manager.

SRP International offers four core services:

1. Company Incorporation & Governance — Ensures companies are correctly structured and compliant with all local laws.
   Covers incorporation, ongoing compliance with regulations, and providing a secure base to operate.

2. Financial Services — Monthly management accounting, invoicing, cash management, annual financial statement
   preparation. Works with independent auditors and expert tax advisors.

3. Research & Business Planning — Feasibility studies, structured business plans, lead generation, forensic
   evaluations, bespoke reports, and equity research for client stock portfolios.

4. Human Resource Management — Recruitment, HR documentation (contracts, policies), payroll services,
   KPI and personal development plan reviews, industrial dispute handling.

Tagline: "Your trusted partner for outsourced corporate services and business support."
Contact email: ${HQ.email}
Phone: ${HQ.phone}
Head office: ${HQ.address.line1}, ${HQ.address.line2}

Locations: ${LOCATIONS}

Two reference sources follow. The CLIENT FAQ is your PRIMARY knowledge base — use it first to
answer client inquiries, matching the client's market when known. The MARKET CATALOG is supporting
detail (each market's services, regulatory specifics, timelines, regional leads, and office
phone/email/hours) — use it to add context and to give the right office's contact details.

Rules:
- Be professional, warm, and concise (aim for under 120 words per reply)
- Reply in plain conversational text — no Markdown, headings, bullet symbols, or emojis
- Answer from the CLIENT FAQ first; use the MARKET CATALOG for supporting detail and office contacts. Quote facts accurately and match the client's market
- Use the conversation history to stay in context and avoid repeating yourself
- Never state specific fees or prices — for pricing or quotes, direct the client to the team
- FALLBACK — ESCAPE CLAUSE: If the CLIENT FAQ (and catalog) do not clearly answer the question, do NOT guess or invent anything. Briefly acknowledge that, then give a clear call to action to schedule a consultation call with our team — invite them to book through the Contact page (/contact) or to reach us at ${HQ.email} or ${HQ.phone}, and offer to help arrange it. Apply this same fallback to anything outside SRP International's services`;


// ── Page Routes ───────────────────────────────────
app.get('/', (req, res) => {
  res.render('home', {
    activePage: 'home',
    title: 'SRP International | Corporate Services Built for the Long Term',
    description: 'SRP International helps companies, founders, and investors incorporate, operate, grow, and stay compliant — with dependable corporate services across five markets.',
    pageCss: 'home.css',
    pageJs: 'home.js',
    /* Preload the first cinematic hero frame (the LCP element) — see views/home.ejs */
    preloadImage: '/images/cities/sri-lanka.jpg',
  });
});

/* ── Leadership team ──
   Order = display order in the accordion gallery.
   Update `linkedin` with each member's profile URL. */
const team = [
  { firstName:'Aaron',    name:'Aaron Russell-Davison', role:'Managing Director',                              photo:'/images/team/Aaron.jpg',    linkedin:'https://www.linkedin.com/in/aaron-russell-davison-83a936211' },
  { firstName:'Charles',  name:'Charles Harbottle',     role:'Managing Director — Singapore',                  photo:'/images/team/Charles.jpg',  linkedin:'https://www.linkedin.com/in/charles-harbottle-64868aa' },
  { firstName:'Jonathan', name:'Jonathan Kitcat',       role:'Managing Director — United Kingdom',             photo:'/images/team/Jonathan.jpg', linkedin:'https://www.linkedin.com/in/jo-kitcat' },
  { firstName:'Greg',     name:'Greg Brutus',           role:'Managing Director — Hong Kong',                  photo:'/images/team/Greg.jpg',     linkedin:'https://www.linkedin.com/in/gregbrutushk/' },
  { firstName:'Madushini', name:'Madushini Fernando',    role:'Director',                                       photo:'/images/team/Madushini.jpg',linkedin:'https://www.linkedin.com/in/madushini-fernando-6722a7189' },
  { firstName:'Shehan',   name:'Shehan Gamage',         role:'Chief Operating Officer',                        photo:'/images/team/Shehan.jpg',   linkedin:'https://www.linkedin.com/in/shehan-gamage-3987151a2' },
  { firstName:'Arkam',    name:'Arkam Aroos',           role:'Chief Financial Officer',                        photo:'/images/team/Arkam.jpg',    linkedin:'https://www.linkedin.com/in/mohamed-aroos-mohamed-arkam' },
];

/* Cache-busting version for team portraits. Bump whenever a photo file is
   replaced so browsers fetch the new image instead of a stale cached copy
   (early deploys 404'd these paths and some browsers cached the miss).      */
const PORTRAIT_VER = '5';
team.forEach(m => { if (m.photo) m.photo += `?v=${PORTRAIT_VER}`; });

app.get('/about', (req, res) => {
  res.render('about', {
    activePage: 'about',
    title: 'About Us | SRP International',
    description: 'Get to know SRP International — a trusted corporate services partner supporting businesses with reliable, transparent, and dependable services since 2017.',
    pageCss: 'about.css',
    pageJs: null,
    jsonLd: [
      { '@type': 'AboutPage', '@id': `${res.locals.pageUrl}#aboutpage`, url: res.locals.pageUrl, about: { '@id': `${res.locals.siteBase}/#organization` } },
      breadcrumbLd(res.locals.siteBase, [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
      ]),
      ...teamPersonsLd(res.locals.siteBase, team, res.locals.pageUrl),
    ],
    team
  });
});

/* ─── INSIGHTS (BLOG) ──────────────────────────────
   /blog (index, optional ?category=slug filter) and /blog/:slug (article). */
app.get('/blog', (req, res) => {
  const active = categories.some(c => c.slug === req.query.category) ? req.query.category : null;
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  let featured = null, secondary = [], gridPosts = [];
  if (active) {
    gridPosts = sorted.filter(p => p.category === active);
  } else {
    featured = sorted.find(p => p.featured) || sorted[0];
    const rest = sorted.filter(p => p !== featured);
    secondary = rest.slice(0, 2);
    gridPosts = rest.slice(2);
  }
  const popularPosts = sorted.filter(p => p.popular).slice(0, 4);

  res.render('blog', {
    activePage: 'blog',
    title: active
      ? `${categoryName(active)} | SRP Insights`
      : 'SRP Insights | Corporate Services Articles & Guidance',
    description: 'Practical guidance on incorporation, tax, accounting, and doing business across Sri Lanka, Singapore, the UAE, the UK, and Hong Kong — from the SRP International team.',
    pageCss: 'blog.css',
    pageJs: null,
    jsonLd: breadcrumbLd(res.locals.siteBase, [
      { name: 'Home', path: '/' },
      { name: 'Insights', path: '/blog' },
    ]),
    categories, active, featured, secondary, gridPosts, popularPosts,
    counts: categoryCounts(),
    categoryName, readingTime,
    hasArticles: posts.length > 0,
  });
});

app.get('/blog/:slug', (req, res, next) => {
  const post = getPost(req.params.slug);
  if (!post) return next();
  const related = posts
    .filter(p => p.slug !== post.slug && p.category === post.category)
    .concat(posts.filter(p => p.slug !== post.slug && p.category !== post.category))
    .slice(0, 3);

  const section = categoryName(post.category);
  res.render('blog-post', {
    activePage: 'blog',
    title: `${post.title} | SRP Insights`,
    description: post.excerpt,
    ogType: 'article',
    ogImage: res.locals.siteBase + post.image,
    articleMeta: {
      publishedTime: post.date,
      modifiedTime: post.modified || post.date,
      author: post.author?.name,
      section,
    },
    jsonLd: [
      blogPostingLd(res.locals.siteBase, { ...post, sectionName: section }, res.locals.pageUrl),
      breadcrumbLd(res.locals.siteBase, [
        { name: 'Home', path: '/' },
        { name: 'Insights', path: '/blog' },
        { name: post.title, path: `/blog/${post.slug}` },
      ]),
    ],
    pageCss: 'blog.css',
    pageJs: null,
    post, related,
    categoryName, readingTime,
  });
});

/* Monthly Financial & Economic Analysis editions. Each registered edition
   (data/reports.js) renders its own view; the archive sidebar lists them all. */
app.get('/insights/:slug', (req, res, next) => {
  const edition = getEdition(req.params.slug);
  if (!edition) return next();
  const view = reportView(edition);
  res.render('analysis-report', {
    activePage: 'blog',
    title: `${edition.title} | SRP Insights`,
    description: edition.description,
    ogType: 'article',
    articleMeta: {
      publishedTime: `${edition.period}-01`,
      author: 'SRP Research',
      section: 'Market Updates',
    },
    jsonLd: [
      reportArticleLd(res.locals.siteBase, edition, res.locals.pageUrl),
      breadcrumbLd(res.locals.siteBase, [
        { name: 'Home', path: '/' },
        { name: 'Insights', path: '/blog' },
        { name: edition.label, path: `/insights/${edition.slug}` },
      ]),
    ],
    pageCss: 'blog.css',
    pageJs: null,
    edition,
    teaTable: view.teaTable,
    arrTable: view.arrTable,
    charts: view.charts,
    reportGroups: reportsByYear(),
    currentSlug: edition.slug,
    latestSlug: latestEdition ? latestEdition.slug : null,
  });
});

/* Shared guards for the public mail endpoints (contact + subscribe). Both are
   rate-limited per IP (the SMTP relay is a paid/quota'd resource and a spam
   target) and length-bounded (defence against oversized-payload abuse). */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_MAX = 254;               // RFC 5321 max address length
const MAIL_RATE_LIMIT = 5;           // submissions…
const MAIL_RATE_WINDOW = 60_000;     // …per minute, per IP
/* Trim, strip control characters (CR/LF must never reach mail headers — we
   don't rely solely on nodemailer's header encoding), and length-bound. */
const clip = (v, max) =>
  (typeof v === 'string' ? v.trim().replace(/[\x00-\x1f\x7f]+/g, " ").slice(0, max).trim() : '');

/* Non-reversible marker for logs. When SMTP is unconfigured we must not write
   raw PII (name/email/phone/message) to Vercel's function logs, but an operator
   still needs to correlate a dropped enquiry if the sender follows up. piiTag()
   is a stable, salted hash of the email — re-hash the address at lookup time to
   match. NOTE: the email space is enumerable, so this obscures PII in logs, it
   does not make the address secret. Salt with LOG_SALT (a real secret) when set;
   otherwise the recipient constant, which still keeps tags non-portable across
   deployments. SMTP is configured in production, so this path is a
   misconfig/local safety net — durable capture belongs in a datastore, not logs. */
const LOG_SALT = process.env.LOG_SALT || ENQUIRY_TO;
const piiTag = (email) =>
  createHash('sha256').update(String(email) + LOG_SALT).digest('hex').slice(0, 10);

/* Durable fallback sink for enquiries. When SMTP can't take a submission —
   unconfigured, or the send throws — POST it to ENQUIRY_WEBHOOK_URL so the lead
   is captured instead of lost (previously it was only tag-logged, i.e. gone).
   Point that URL at whatever the team monitors: a Google Sheet via an Apps
   Script web app, a Slack/Discord incoming webhook, Zapier/Make, etc.
   No-op (returns false) when unset, so nothing is provisioned by default and
   the behaviour is unchanged until you opt in. The URL is operator-set, not
   user input, so it is a trusted sink (not an SSRF vector); we still bound the
   request with a 5s timeout so a hung webhook can't stall the function, and we
   never log the URL or its response body. Returns true only on a 2xx.
   Setup guide (Google Sheet sink): docs/enquiry-webhook.md */
const ENQUIRY_WEBHOOK_URL = process.env.ENQUIRY_WEBHOOK_URL || '';
async function captureEnquiry(kind, data) {
  if (!ENQUIRY_WEBHOOK_URL) return false;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);
  try {
    const r = await fetch(ENQUIRY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind, receivedAt: new Date().toISOString(), ...data }),
      signal: ctrl.signal,
    });
    return r.ok;
  } catch {
    return false;                 // network error / timeout / abort — treat as not captured
  } finally {
    clearTimeout(timer);
  }
}

/* Newsletter subscribe — emails the address to the enquiry inbox when SMTP is
   configured; otherwise logs it so nothing is lost. Mirrors the contact flow. */
app.post('/api/subscribe', async (req, res) => {
  if (rateLimited('subscribe:' + clientIp(req), MAIL_RATE_LIMIT, MAIL_RATE_WINDOW)) {
    return res.status(429).set('Retry-After', '60').json({ error: 'Too many requests. Please wait a moment and try again.' });
  }
  const email = clip(req.body?.email, EMAIL_MAX);
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (!mailer) {
    if (await captureEnquiry('subscribe', { email })) {
      console.warn(`[subscribe] SMTP unconfigured — captured via fallback webhook. tag=${piiTag(email)}`);
    } else {
      console.warn(`[subscribe] Email not configured, no fallback sink — accepted, not logged (PII). tag=${piiTag(email)}`);
    }
    return res.json({ success: true });
  }
  try {
    await mailer.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: ENQUIRY_TO,
      subject: 'New SRP Insights subscriber',
      text: `New newsletter subscriber: ${email}`,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('[subscribe] send failed:', err.message);
    // Don't lose the subscriber — try the durable fallback before giving up.
    if (await captureEnquiry('subscribe', { email })) {
      console.warn(`[subscribe] send failed — captured via fallback webhook. tag=${piiTag(email)}`);
      return res.json({ success: true });
    }
    res.status(500).json({ error: 'Could not subscribe right now.' });
  }
});

/* ─── REGIONAL ROUTES ─────────────────────────────
   Primary IA: /:region (regional hub) and /:region/:serviceSlug (detail).
   Region must be one of the known office slugs to be honoured here —
   otherwise we fall through to Express's normal 404 handling.        */
const KNOWN_REGIONS = new Set(offices.map(o => o.slug));

/* /services — standalone canonical service portfolio (global view).
   Country-agnostic; shows the 4 service categories SRP offers as a
   group, with "Available in" region chips per service.              */
app.get('/services', (req, res) => {
  res.render('services', {
    activePage: 'services',
    title: 'Our Services | SRP International',
    description: 'SRP International\'s global service portfolio: company incorporation & governance, financial services, HR management, and research & business planning — calibrated to each market we operate in.',
    pageCss: 'services.css',
    pageJs: null,
    jsonLd: breadcrumbLd(res.locals.siteBase, [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
    ]),
    globalServices,
    offices,
  });
});

/* /global-presence — country directory hub. */
app.get('/global-presence', (req, res) => {
  res.render('global-presence', {
    activePage: 'global-presence',
    title: 'Global Presence | SRP International',
    description: 'SRP International operates from offices in Sri Lanka, Singapore, the United Arab Emirates, the United Kingdom, and Hong Kong — supporting clients across South Asia, South-East Asia, the Middle East, Europe, and East Asia.',
    pageCss: 'services.css',
    pageJs: null,
    jsonLd: breadcrumbLd(res.locals.siteBase, [
      { name: 'Home', path: '/' },
      { name: 'Global Presence', path: '/global-presence' },
    ]),
  });
});

/* /privacy & /terms — legal pages. */
app.get('/privacy', (req, res) => {
  res.render('privacy', {
    activePage: '',
    title: 'Privacy Policy | SRP International',
    description: 'How SRP International collects, uses, and protects your personal information across our offices in Sri Lanka, Singapore, the UAE, the UK, and Hong Kong.',
    pageCss: null,
    pageJs: null,
  });
});
app.get('/terms', (req, res) => {
  res.render('terms', {
    activePage: '',
    title: 'Terms of Use | SRP International',
    description: 'The terms that govern your use of the SRP International website.',
    pageCss: null,
    pageJs: null,
  });
});

/* Backward-compat: /services/:slug → /sri-lanka/:slug (preserve old service URL SEO). */
app.get('/services/:slug', (req, res) => res.redirect(301, `/sri-lanka/${req.params.slug}`));

/* /:region — regional hub page (services grid + regional MD card)    */
app.get('/:region', (req, res, next) => {
  const { region } = req.params;
  if (!KNOWN_REGIONS.has(region)) return next();
  const office          = offices.find(o => o.slug === region);
  const regionServices  = getRegionServices(region);
  res.render('region', {
    activePage: 'regions',
    activeRegion: region,
    title: `${office.label} | SRP International`,
    description: `Corporate services in ${office.label}: ${regionServices.map(s => s.shortTitle).join(', ')}.`,
    pageCss: 'services.css',
    pageJs: null,
    jsonLd: [
      professionalServiceLd(res.locals.siteBase, office),
      breadcrumbLd(res.locals.siteBase, [
        { name: 'Home', path: '/' },
        { name: 'Global Presence', path: '/global-presence' },
        { name: office.label, path: `/${office.slug}` },
      ]),
    ],
    office,
    regionServices,
  });
});

/* /:region/:slug — service detail, region-scoped                     */
app.get('/:region/:slug', (req, res, next) => {
  const { region, slug } = req.params;
  if (!KNOWN_REGIONS.has(region)) return next();
  const service = getService(region, slug);
  if (!service) return res.status(404).render('404', { activePage: '', title: 'Page Not Found | SRP International', robots: 'noindex, follow', pageCss: null, pageJs: null });
  const office          = offices.find(o => o.slug === region);
  const relatedServices = (service.relatedSlugs || [])
    .map(s => getService(region, s))
    .filter(Boolean);
  res.render('service-detail', {
    activePage: 'regions',
    activeRegion: region,
    title: `${service.title} — ${office.label} | SRP International`,
    description: firstSentence(service.overview),
    pageCss: 'service-detail.css',
    pageJs: null,
    jsonLd: [
      serviceLd(res.locals.siteBase, office, service, res.locals.pageUrl),
      breadcrumbLd(res.locals.siteBase, [
        { name: 'Home', path: '/' },
        { name: 'Global Presence', path: '/global-presence' },
        { name: office.label, path: `/${office.slug}` },
        { name: service.title, path: `/${office.slug}/${service.slug || req.params.slug}` },
      ]),
    ],
    office,
    service,
    relatedServices,
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    activePage: 'contact',
    title: 'Contact Us | SRP International',
    description: 'Contact SRP International for corporate services, compliance, finance, HR, and business planning support. Offices in Sri Lanka, Singapore, Dubai, the UK, and Hong Kong.',
    pageCss: 'contact.css',
    pageJs: 'contact.js',
    jsonLd: [
      { '@type': 'ContactPage', '@id': `${res.locals.pageUrl}#contactpage`, url: res.locals.pageUrl, name: 'Contact SRP International' },
      breadcrumbLd(res.locals.siteBase, [
        { name: 'Home', path: '/' },
        { name: 'Contact Us', path: '/contact' },
      ]),
    ],
  });
});

/* Post-submission destination for the contact form (the JS redirects here on
   success, replacing the old auto-confirmation email). Shows the three latest
   Insights articles + social links while the team follows up. */
app.get('/thank-you', (req, res) => {
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  res.render('thank-you', {
    activePage: 'contact',
    title: 'Thank You | SRP International',
    description: 'Thank you for reaching out to SRP International. We have received your inquiry and a member of our team will respond within 24 hours.',
    /* Utility confirmation page — keep it out of the index (thin content). */
    robots: 'noindex, follow',
    pageCss: 'thank-you.css',
    pageJs: null,
    recentPosts,
    categoryName,
    readingTime,
  });
});

/* Public FAQ page — renders the SAME FAQ tree the chatbot uses (data/faq.js),
   so the website and chatbot can never drift. Update data/faq.js → both follow.
   Markets without FAQ entries (e.g. Hong Kong) are omitted. */
app.get('/faq', (req, res) => {
  const faqTree = faqTreeForClient().filter(c => c.categories.length);
  res.render('faq', {
    activePage: 'faq',
    title: 'FAQs | SRP International',
    description: "Answers to common questions about SRP International's corporate services — incorporation, compliance, accounting, tax, and HR across Sri Lanka, Singapore, the UAE, and the UK.",
    pageCss: 'faq.css',
    pageJs: 'faq.js',
    jsonLd: [
      faqPageLd(faqTree),
      breadcrumbLd(res.locals.siteBase, [
        { name: 'Home', path: '/' },
        { name: 'FAQs', path: '/faq' },
      ]),
    ],
    faqTree,
  });
});

app.get('/portal', (req, res) => {
  res.render('portal', {
    activePage: 'portal',
    title: 'Client Portal | SRP International',
    description: 'The SRP International Client Portal — a secure dashboard to manage company documents, compliance, invoices, and services. Launching soon.',
    pageCss: 'portal.css',
    pageJs: 'portal.js',
    /* Flip to true to bring the live login form back. */
    portalLive: false,
  });
});

// ── Chat API ──────────────────────────────────────
/* Lightweight in-memory per-IP rate limiter shared by ALL public POST
   endpoints — /api/chat (paid Anthropic API), /api/contact and /api/subscribe
   (SMTP relay). Each endpoint namespaces its own bucket ("chat:<ip>" etc.).
   NOTE: on serverless (Vercel) each warm instance keeps its own counters, so
   this throttles abuse per-instance rather than globally. For hard global
   limits, front it with a shared store (e.g. Upstash Redis). It still blocks
   naive hammering and protects against an unbounded paid-API proxy. */
const CHAT_RATE_LIMIT = 20;          // requests…
const CHAT_RATE_WINDOW = 60_000;     // …per minute, per IP
const rateHits = new Map();

/* Generic fixed-window limiter. `key` namespaces the bucket per endpoint
   (e.g. "chat:1.2.3.4") so the AI proxy and the mail endpoints throttle
   independently. Returns true when the caller is over the limit. */
function rateLimited(key, limit, windowMs) {
  const now = Date.now();
  let bucket = rateHits.get(key);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    rateHits.set(key, bucket);
  }
  bucket.count += 1;
  if (rateHits.size > 5000) {                 // bound memory: drop expired buckets
    for (const [k, v] of rateHits) if (now > v.resetAt) rateHits.delete(k);
  }
  return bucket.count > limit;
}

/* Real client IP. `trust proxy` is set to 1 (Vercel's proxy), so req.ip is the
   client's address as seen by that trusted hop — NOT the raw, client-spoofable
   X-Forwarded-For header. Using the raw header would let an attacker rotate a
   fake IP per request and bypass the limiter entirely (paid-API cost DoS). */
function clientIp(req) {
  return req.ip || 'unknown';
}

app.post('/api/chat', async (req, res) => {
  if (rateLimited('chat:' + clientIp(req), CHAT_RATE_LIMIT, CHAT_RATE_WINDOW)) {
    return res.status(429).set('Retry-After', '60').json({ error: 'Too many messages. Please wait a moment and try again.' });
  }

  /* Accept a conversation: { messages: [{ role, content }, …] }.
     Backward-compatible with a single { message } string. */
  let { messages, message } = req.body;
  if (!Array.isArray(messages)) {
    messages = (message && typeof message === 'string') ? [{ role: 'user', content: message }] : null;
  }
  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  /* Sanitize + bound the history: only user/assistant turns, last 12,
     each capped at 1000 chars, and it must start on a user turn and end
     on a user turn (Claude requires the first message to be the user). */
  const history = messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant')
              && typeof m.content === 'string' && m.content.trim())
    .slice(-12)
    .map(m => ({ role: m.role, content: m.content.slice(0, 1000) }));

  while (history.length && history[0].role === 'assistant') history.shift();

  if (history.length === 0 || history[history.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Invalid message' });
  }

  try {
    /* Call the Anthropic REST API directly with native fetch — avoids the SDK,
       which Vercel's function bundler mangles. The large static catalog is sent
       as a cached (ephemeral) block so repeat messages reuse it cheaply. */
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        /* Strip any BOM/whitespace — some env-var tooling prepends a U+FEFF,
           which is an invalid HTTP header byte and throws when fetch builds it. */
        'x-api-key': (process.env.ANTHROPIC_API_KEY || '').replace(/^﻿/, '').trim(),
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 320,
        system: [
          { type: 'text', text: SYSTEM_INTRO },
          { type: 'text', text: FAQ_KNOWLEDGE },                                   // primary knowledge base
          { type: 'text', text: MARKET_CATALOG, cache_control: { type: 'ephemeral' } }, // supporting detail (one cache breakpoint covers the whole static prefix)
        ],
        messages: history,
      }),
    });

    const data = await apiRes.json();
    if (!apiRes.ok) {
      console.error('Anthropic API error:', apiRes.status, data?.error?.type, data?.error?.message);
      return res.status(502).json({ error: 'Failed to generate response' });
    }

    const reply = data?.content?.[0]?.text ?? 'Sorry, I could not generate a response.';
    res.json({ reply });
  } catch (err) {
    console.error('Chat request failed:', err?.name, err?.message);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// ── FAQ tree (drives the chatbot's guided triage chips) ──
app.get('/api/faq-tree', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300');
  res.json({ tree: faqTreeForClient() });
});

// ── Contact Form API ──────────────────────────────
app.post('/api/contact', async (req, res) => {
  if (rateLimited('contact:' + clientIp(req), MAIL_RATE_LIMIT, MAIL_RATE_WINDOW)) {
    return res.status(429).set('Retry-After', '60').json({ error: 'Too many requests. Please wait a moment and try again.' });
  }

  /* Bound every field (defends against oversized payloads and caps what lands
     in mail headers) and validate the email format — the address flows into the
     Reply-To header and the name into the Subject. */
  const name    = clip(req.body?.name, 120);
  const email   = clip(req.body?.email, EMAIL_MAX);
  const phone   = clip(req.body?.phone, 40);
  const company = clip(req.body?.company, 160);
  const service = clip(req.body?.service, 120);
  const subject = clip(req.body?.subject, 160);
  const message = clip(req.body?.message, 5000);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  const submission = { name, email, phone, company, service, subject, message };
  const ok = () => res.json({ success: true, redirect: '/thank-you', message: 'Thank you for your inquiry. We will respond within 24 hours.' });

  // No SMTP credentials → keep the form working. Try the durable fallback sink
  // first so the lead is captured; if there's no sink, fall back to a PII-free
  // correlation tag + field-presence list (content is not logged).
  if (!mailer) {
    if (await captureEnquiry('contact', submission)) {
      console.warn(`[contact] SMTP unconfigured — captured via fallback webhook. tag=${piiTag(email)}`);
      return ok();
    }
    const present = [name && 'name', email && 'email', phone && 'phone', company && 'company',
                     service && 'service', subject && 'subject', message && 'message'].filter(Boolean).join(',');
    console.warn(`[contact] Email not configured, no fallback sink — accepted, not logged (PII). tag=${piiTag(email)} fields=${present}`);
    return ok();
  }

  const lines = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    phone   ? `Phone:   ${phone}`     : null,
    company ? `Company: ${company}`   : null,
    service ? `Service: ${service}`   : null,
    subject ? `Subject: ${subject}`   : null,
    '',
    'Message:',
    message,
  ].filter(Boolean);

  const esc = (s) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
  const html = `
    <h2 style="margin:0 0 12px">New website inquiry</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      <tr><td><strong>Name</strong></td><td>${esc(name)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${esc(email)}</td></tr>
      ${phone   ? `<tr><td><strong>Phone</strong></td><td>${esc(phone)}</td></tr>` : ''}
      ${company ? `<tr><td><strong>Company</strong></td><td>${esc(company)}</td></tr>` : ''}
      ${service ? `<tr><td><strong>Service</strong></td><td>${esc(service)}</td></tr>` : ''}
      ${subject ? `<tr><td><strong>Subject</strong></td><td>${esc(subject)}</td></tr>` : ''}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;margin-top:16px"><strong>Message:</strong><br>${esc(message)}</p>`;

  try {
    // 1) Primary: notify the team. Must succeed for the form to report success.
    await mailer.sendMail({
      from:    `"SRP International Website" <${MAIL_FROM}>`,
      to:      ENQUIRY_TO,
      /* Object form: nodemailer handles display-name quoting/encoding itself —
         no string interpolation of user input into an address header. */
      replyTo: { name, address: email },      // replies go straight to the client
      subject: subject ? `Website inquiry: ${subject}` : `New website inquiry from ${name}`,
      text:    lines.join('\n'),
      html,
    });

    // The client no longer receives an auto-confirmation email — on success the
    // browser redirects them to the /thank-you page instead (see public/js/contact.js).
    ok();
  } catch (err) {
    // Log only err.message — the raw error object can echo the envelope
    // (client's address) and, in err.response, the message body.
    console.error('[contact] Failed to send enquiry email:', err?.message);
    // Don't lose the lead — try the durable fallback before reporting failure.
    if (await captureEnquiry('contact', submission)) {
      console.warn(`[contact] SMTP send failed — captured via fallback webhook. tag=${piiTag(email)}`);
      return ok();
    }
    res.status(502).json({ error: 'Sorry, we could not send your inquiry right now. Please email clientrelations@srpitl.com directly.' });
  }
});

// ── SEO: robots.txt + sitemap.xml ─────────────────
/* Both are host-derived (no hardcoded domain) so they automatically follow
   the move from the vercel.app URL to the custom domain. */
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /api/',          // JSON endpoints (chat, contact, faq-tree) — not content
      'Disallow: /thank-you',     // utility confirmation page (also meta-noindexed)
      '',
      `Sitemap: ${res.locals.siteBase}/sitemap.xml`,
      '',
    ].join('\n')
  );
});

/* Deploy timestamp — the default <lastmod> for evergreen pages. Editions and
   articles override it with their own publish dates below. */
const BUILD_DATE = new Date().toISOString().slice(0, 10);

/* Sitemap generator. Every indexable route is derived from the same data the
   app renders (offices/services/posts/active editions), so the sitemap can
   never drift from what actually resolves. Non-indexable utility routes
   (/thank-you, 404, /api/*) are intentionally excluded. */
app.get('/sitemap.xml', (req, res) => {
  const base = res.locals.siteBase;
  const entry = (path, { lastmod = BUILD_DATE, changefreq = 'monthly', priority = '0.6' } = {}) =>
    `  <url><loc>${base}${path}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;

  const items = [
    entry('/',                { changefreq: 'weekly',  priority: '1.0' }),
    entry('/about',           { priority: '0.8' }),
    entry('/services',        { priority: '0.8' }),
    entry('/global-presence', { priority: '0.8' }),
    entry('/faq',             { changefreq: 'weekly',  priority: '0.8' }),
    entry('/contact',         { priority: '0.7' }),
    entry('/blog',            { changefreq: 'weekly',  priority: '0.7' }),
    entry('/portal',          { changefreq: 'yearly',  priority: '0.3' }),
    entry('/privacy',         { changefreq: 'yearly',  priority: '0.3' }),
    entry('/terms',           { changefreq: 'yearly',  priority: '0.3' }),
  ];

  // Regional hubs + region-scoped service detail pages.
  for (const o of offices) {
    items.push(entry(`/${o.slug}`, { priority: '0.8' }));
    for (const s of Object.keys(services[o.slug] || {})) {
      items.push(entry(`/${o.slug}/${s}`, { priority: '0.7' }));
    }
  }
  // Insights articles (lastmod = publish/modified date).
  for (const p of posts) {
    items.push(entry(`/blog/${p.slug}`, { lastmod: p.modified || p.date, priority: '0.6' }));
  }
  // Monthly Financial & Economic Analysis editions inside the active window.
  for (const ed of activeEditions()) {
    items.push(entry(`/insights/${ed.slug}`, { lastmod: `${ed.period}-01`, priority: '0.6' }));
  }

  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join('\n')}\n</urlset>\n`
  );
});

// ── 404 Handler ───────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', {
    activePage: '',
    title: 'Page Not Found | SRP International',
    robots: 'noindex, follow',
    pageCss: null,
    pageJs: null
  });
});

if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`SRP International server running → http://localhost:${port}`);
  });
}

export default app;
