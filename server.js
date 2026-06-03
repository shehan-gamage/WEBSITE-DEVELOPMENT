import Anthropic from '@anthropic-ai/sdk';
import express from 'express';
import nodemailer from 'nodemailer';
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

/* ── Email (enquiry notifications) ──
   Uses Google Workspace SMTP (smtp.gmail.com) by default since srpitl.com
   runs on Google Workspace. Authenticate with a Workspace mailbox + a
   16-char App Password (2-Step Verification must be enabled on that account).
   Set SMTP_USER / SMTP_PASS in .env. Enquiries are delivered to ENQUIRY_TO. */
const ENQUIRY_TO    = process.env.ENQUIRY_TO || 'clientrelations@srpitl.com';
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
  { firstName:'Aaron',    name:'Aaron Russell-Davison', role:'Managing Director',                              photo:'/images/team/Aaron.png',    linkedin:'https://www.linkedin.com/in/aaron-russell-davison-83a936211' },
  { firstName:'Charles',  name:'Charles Harbottle',     role:'Managing Director — Singapore',                  photo:'/images/team/Charles.png',  linkedin:'https://www.linkedin.com/in/charles-harbottle-64868aa' },
  { firstName:'Jonathan', name:'Jonathan Kitcat',       role:'Managing Director — United Kingdom',             photo:'/images/team/Jonathan.png', linkedin:'https://www.linkedin.com/in/jo-kitcat' },
  { firstName:'Madushini', name:'Madushini Fernando',    role:'Director',                                       photo:'/images/team/Madushini.png',linkedin:'https://www.linkedin.com/in/madushini-fernando-6722a7189' },
  { firstName:'Shehan',   name:'Shehan Gamage',         role:'Chief Operating Officer',                        photo:'/images/team/Shehan.png',   linkedin:'https://www.linkedin.com/in/shehan-gamage-3987151a2' },
  { firstName:'Arkam',    name:'Arkam Aroos',           role:'Chief Financial Officer',                        photo:'/images/team/Arkam.png',    linkedin:'https://www.linkedin.com/in/mohamed-aroos-mohamed-arkam' },
  { firstName:'Rochelle', name:'Rochelle DonPaul',      role:'Head of International Business Development',     photo:'/images/team/Rochelle.png', linkedin:'https://www.linkedin.com/in/rochelle-donpaul' },
  { firstName:'Hadi',     name:'Mohamed Hadi',          role:'Head of Client Relationship Management',         photo:'/images/team/Hadi.png',     linkedin:'https://www.linkedin.com/in/mohamed-hadi-17ab43247' },
  { firstName:'Shanika',  name:'Shanika Fernando',      role:'Head of Research and Business Development',      photo:'/images/team/Shanika.png',  linkedin:'https://www.linkedin.com/in/shanika-fernando-3a073a195' },
  { firstName:'Fiyaz',    name:'Ahmed Fiyaz',           role:'Head of Accounting Services',                    photo:'/images/team/Fiyaz.png',    linkedin:'https://www.linkedin.com/in/fiyaz-hussain-b770837' },
  { firstName:'Ramesh',   name:'Ramesh Kumarage',       role:'Head of HR Services',                            photo:'/images/team/Ramesh.png',   linkedin:'https://www.linkedin.com/in/rameshkumarage' },
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
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, company, service, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const submission = { name, email, phone, company, service, subject, message };

  // No SMTP credentials yet → log so nothing is lost, but keep the form working.
  if (!mailer) {
    console.warn('[contact] Email not configured — enquiry logged only:', submission);
    return res.json({ success: true, message: 'Thank you for your enquiry. We will respond within 24 hours.' });
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
    <h2 style="margin:0 0 12px">New website enquiry</h2>
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
      from:    `"SRP International Website" <${process.env.SMTP_USER}>`,
      to:      ENQUIRY_TO,
      replyTo: `"${name}" <${email}>`,        // replies go straight to the client
      subject: subject ? `Website enquiry: ${subject}` : `New website enquiry from ${name}`,
      text:    lines.join('\n'),
      html,
    });

    // 2) Secondary: auto-reply confirmation to the client for their records.
    //    Best-effort — if it fails the team still has the enquiry, so don't error.
    try {
      const confirmText = [
        'Hi there,',
        '',
        'Thank you for reaching out to us. We have successfully received your inquiry and a member of our team will get back to you as soon as possible.',
        '',
        'Best regards,',
        'SRP International',
        'Client Relationship Management Team',
      ].join('\n');
      const confirmHtml = `
        <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#1a1a22">
          <p>Hi there,</p>
          <p>Thank you for reaching out to us. We have successfully received your inquiry and a member of our team will get back to you as soon as possible.</p>
          <p style="margin-bottom:0">Best regards,<br>
          <strong>SRP International</strong><br>
          Client Relationship Management Team</p>
        </div>`;
      await mailer.sendMail({
        from:    `"SRP International" <${process.env.SMTP_USER}>`,
        to:      `"${name}" <${email}>`,
        replyTo: ENQUIRY_TO,                  // client replies reach the team group
        subject: 'We’ve received your inquiry!',
        text:    confirmText,
        html:    confirmHtml,
      });
    } catch (confErr) {
      console.error('[contact] Enquiry delivered, but client confirmation failed:', confErr);
    }

    res.json({ success: true, message: 'Thank you for your enquiry. We will respond within 24 hours.' });
  } catch (err) {
    console.error('[contact] Failed to send enquiry email:', err);
    res.status(502).json({ error: 'Sorry, we could not send your enquiry right now. Please email clientrelations@srpitl.com directly.' });
  }
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
