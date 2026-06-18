import Anthropic from '@anthropic-ai/sdk';
import express from 'express';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { statSync } from 'fs';
import 'dotenv/config';
import { offices } from './data/offices.js';
import { services, getService, getRegionServices, globalServices } from './data/services.js';
import { posts, categories, getPost, categoryName, readingTime, categoryCounts } from './data/posts.js';
import { FAQ_KNOWLEDGE, faqTreeForClient } from './data/faq.js';
import { reportsByYear, getEdition, reportView, latestEdition } from './data/reports.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app  = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

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
   in production (needed for absolute canonical/OG URLs). */
app.set('trust proxy', 1);

/* Returns the first complete sentence of a block of text — used for hero
   teasers and card summaries so they read as full sentences instead of being
   cut off mid-word. Falls back to the whole string if no sentence end is found. */
function firstSentence(text) {
  if (!text) return '';
  const m = String(text).match(/[^.!?]*[.!?]/);
  return (m ? m[0] : String(text)).trim();
}

app.use((req, res, next) => {
  res.locals.offices = offices;
  res.locals.whatsapp = WHATSAPP;
  res.locals.firstSentence = firstSentence;
  /* Absolute URLs for canonical + Open Graph tags. Host-derived so they
     follow the domain automatically (vercel.app now, custom domain later). */
  res.locals.siteBase = `${req.protocol}://${req.get('host')}`;
  res.locals.pageUrl = res.locals.siteBase + (req.originalUrl || '/').split('?')[0];
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
  console.warn('[contact] SMTP_USER/SMTP_PASS not set — enquiries will be logged but NOT emailed. See .env.example.');
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
    pageJs: 'home.js'
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

  res.render('blog-post', {
    activePage: 'blog',
    title: `${post.title} | SRP Insights`,
    description: post.excerpt,
    ogType: 'article',
    ogImage: res.locals.siteBase + post.image,
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

/* Newsletter subscribe — emails the address to the enquiry inbox when SMTP is
   configured; otherwise logs it so nothing is lost. Mirrors the contact flow. */
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (!mailer) {
    console.warn('[subscribe] Email not configured — logged only:', email);
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
    office,
    regionServices,
  });
});

/* /:region/:slug — service detail, region-scoped                     */
app.get('/:region/:slug', (req, res, next) => {
  const { region, slug } = req.params;
  if (!KNOWN_REGIONS.has(region)) return next();
  const service = getService(region, slug);
  if (!service) return res.status(404).render('404', { activePage: '', title: 'Page Not Found | SRP International', pageCss: null, pageJs: null });
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
    pageJs: 'contact.js'
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
    pageCss: 'thank-you.css',
    pageJs: null,
    recentPosts,
    categoryName,
    readingTime,
  });
});

app.get('/portal', (req, res) => {
  res.render('portal', {
    activePage: 'portal',
    title: 'Client Portal | SRP International',
    description: 'Access the SRP International Client Portal to manage company documents, compliance, invoices, and services in one secure dashboard.',
    pageCss: 'portal.css',
    pageJs: 'portal.js'
  });
});

// ── Chat API ──────────────────────────────────────
/* Lightweight in-memory per-IP rate limiter for the public AI endpoint.
   NOTE: on serverless (Vercel) each warm instance keeps its own counters, so
   this throttles abuse per-instance rather than globally. For hard global
   limits, front it with a shared store (e.g. Upstash Redis). It still blocks
   naive hammering and protects against an unbounded paid-API proxy. */
const CHAT_RATE_LIMIT = 20;          // requests…
const CHAT_RATE_WINDOW = 60_000;     // …per minute, per IP
const rateHits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  let bucket = rateHits.get(ip);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + CHAT_RATE_WINDOW };
    rateHits.set(ip, bucket);
  }
  bucket.count += 1;
  if (rateHits.size > 5000) {                 // bound memory: drop expired buckets
    for (const [k, v] of rateHits) if (now > v.resetAt) rateHits.delete(k);
  }
  return bucket.count > CHAT_RATE_LIMIT;
}

function clientIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress
    || 'unknown';
}

app.post('/api/chat', async (req, res) => {
  if (rateLimited(clientIp(req))) {
    return res.status(429).json({ error: 'Too many messages. Please wait a moment and try again.' });
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
  const { name, email, phone, company, service, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const submission = { name, email, phone, company, service, subject, message };

  // No SMTP credentials yet → log so nothing is lost, but keep the form working.
  if (!mailer) {
    console.warn('[contact] Email not configured — enquiry logged only:', submission);
    return res.json({ success: true, redirect: '/thank-you', message: 'Thank you for your inquiry. We will respond within 24 hours.' });
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
      replyTo: `"${name}" <${email}>`,        // replies go straight to the client
      subject: subject ? `Website inquiry: ${subject}` : `New website inquiry from ${name}`,
      text:    lines.join('\n'),
      html,
    });

    // The client no longer receives an auto-confirmation email — on success the
    // browser redirects them to the /thank-you page instead (see public/js/contact.js).
    res.json({ success: true, redirect: '/thank-you', message: 'Thank you for your inquiry. We will respond within 24 hours.' });
  } catch (err) {
    console.error('[contact] Failed to send enquiry email:', err);
    res.status(502).json({ error: 'Sorry, we could not send your inquiry right now. Please email clientrelations@srpitl.com directly.' });
  }
});

// ── SEO: robots.txt + sitemap.xml ─────────────────
/* Both are host-derived (no hardcoded domain) so they automatically follow
   the move from the vercel.app URL to the custom domain. */
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\n\nSitemap: ${res.locals.siteBase}/sitemap.xml\n`
  );
});

app.get('/sitemap.xml', (req, res) => {
  const staticPaths = ['/', '/about', '/services', '/global-presence', '/contact', '/blog', '/privacy', '/terms', '/portal'];
  const regionPaths = offices.flatMap(o => [
    `/${o.slug}`,
    ...Object.keys(services[o.slug] || {}).map(s => `/${o.slug}/${s}`),
  ]);
  const blogPaths = posts.map(p => `/blog/${p.slug}`);
  const urls = [...staticPaths, ...regionPaths, ...blogPaths]
    .map(p => `  <url><loc>${res.locals.siteBase}${p}</loc></url>`)
    .join('\n');
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
});

// ── 404 Handler ───────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', {
    activePage: '',
    title: 'Page Not Found | SRP International',
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
