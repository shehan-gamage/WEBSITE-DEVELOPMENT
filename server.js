import Anthropic from '@anthropic-ai/sdk';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';
import { offices } from './data/offices.js';
import { services, getService, getRegionServices, globalServices } from './data/services.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app  = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

/* Make the offices list available to EVERY rendered view so partials
   (header, footer) can read it without each route having to pass it. */
app.use((req, res, next) => {
  res.locals.offices = offices;
  next();
});

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are a helpful assistant for SRP International, a professional corporate services firm.
Your role is to help website visitors understand SRP International's services and guide them to get in touch.

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
Contact email: info@srpitl.com
Phone: 0112 590 665
Address: Level 4, 35 Edward Lane, Colombo 03

Locations: Sri Lanka (Colombo, Galle, Matara), Singapore, Dubai, United Kingdom

Rules:
- Be professional, warm, and concise (aim for under 120 words per reply)
- Answer questions about the four services accurately using the information above
- For pricing, quotes, or detailed consultations direct visitors to contact the team at info@srpitl.com
- Do not invent information about team members or fees
- If asked about something unrelated to SRP International's services, politely redirect to how you can help`;


// ── Page Routes ───────────────────────────────────
app.get('/', (req, res) => {
  res.render('home', {
    activePage: 'home',
    title: 'SRP International | Global Corporate Services for Ambitious Businesses',
    description: 'SRP International helps companies, entrepreneurs, and investors incorporate, manage, grow, and stay compliant with trusted corporate services and business support.',
    pageCss: 'home.css',
    pageJs: 'home.js'
  });
});

/* ── Leadership team ──
   Order = display order in the accordion gallery.
   Update `linkedin` with each member's profile URL. */
const team = [
  { firstName:'Aaron',    name:'Aaron Russell-Davison', role:'Managing Director',                              photo:'/images/team/Aaron.png',    linkedin:'#' },
  { firstName:'Charles',  name:'Charles Harbottle',     role:'Managing Director — Singapore',                  photo:'/images/team/Charles.png',  linkedin:'#' },
  { firstName:'Jonathan', name:'Jonathan Kitcat',       role:'Managing Director — United Kingdom',             photo:'/images/team/Jonathan.png', linkedin:'#' },
  { firstName:'Madushini', name:'Madushini Fernando',    role:'Director',                                       photo:'/images/team/Madushini.png',linkedin:'#' },
  { firstName:'Shehan',   name:'Shehan Gamage',         role:'Chief Operating Officer',                        photo:'/images/team/Shehan.png',   linkedin:'#' },
  { firstName:'Arkam',    name:'Arkam Aroos',           role:'Chief Financial Officer',                        photo:'/images/team/Arkam.png',    linkedin:'#' },
  { firstName:'Rochelle', name:'Rochelle DonPaul',      role:'Head of International Business Development',     photo:'/images/team/Rochelle.png', linkedin:'#' },
  { firstName:'Hadi',     name:'Mohamed Hadi',          role:'Head of Client Relationship Management',         photo:'/images/team/Hadi.png',     linkedin:'#' },
  { firstName:'Shanika',  name:'Shanika Fernando',      role:'Head of Research and Business Development',      photo:'/images/team/Shanika.png',  linkedin:'#' },
  { firstName:'Fiyaz',    name:'Ahmed Fiyaz',           role:'Head of Accounting Services',                    photo:'/images/team/Fiyaz.png',    linkedin:'#' },
  { firstName:'Ramesh',   name:'Ramesh Kumarage',       role:'Head of HR Services',                            photo:'/images/team/Ramesh.png',   linkedin:'#' },
];

app.get('/about', (req, res) => {
  res.render('about', {
    activePage: 'about',
    title: 'About Us | SRP International',
    description: 'Learn about SRP International, a trusted corporate services partner supporting businesses with reliable, transparent, and efficient services since 2017.',
    pageCss: 'about.css',
    pageJs: 'about.js',
    team
  });
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
    description: 'SRP International operates from offices in Sri Lanka, Singapore, the United Arab Emirates, and the United Kingdom — supporting clients across South Asia, South-East Asia, the Middle East, and Europe.',
    pageCss: 'services.css',
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
    description: service.overview.substring(0, 160),
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
    description: 'Contact SRP International for corporate services, compliance, finance, HR, and business planning support. Offices in Sri Lanka, Singapore, Dubai, and the UK.',
    pageCss: 'contact.css',
    pageJs: 'contact.js'
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
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: SYSTEM,
      messages: [{ role: 'user', content: message.slice(0, 1000) }],
    });

    const reply = response.content[0]?.text ?? 'Sorry, I could not generate a response.';
    res.json({ reply });
  } catch (err) {
    console.error('Claude API error:', err.message);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// ── Contact Form API ──────────────────────────────
app.post('/api/contact', (req, res) => {
  const { name, email, phone, company, service, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  console.log('Contact form submission:', { name, email, phone, company, service, subject, message });
  res.json({ success: true, message: 'Thank you for your enquiry. We will respond within 24 hours.' });
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

app.listen(port, () => {
  console.log(`SRP International server running → http://localhost:${port}`);
});
