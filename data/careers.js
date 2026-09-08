/* ═══════════════════════════════════════════════════
   SRP International — Careers
   Single source of truth for /careers. Add an object to
   `openings` and the vacancy renders automatically; an
   empty array renders the speculative-application state
   instead, so the page is never stale or misleading.
═══════════════════════════════════════════════════ */

/* Where applications are received. Single source of truth: this address is
   both shown on the page and used as the delivery target for /api/careers,
   so the published inbox and the form can never disagree. (Set CAREERS_TO
   in the environment to override delivery without changing the page.) */
export const CAREERS_EMAIL = 'hrservices@srpitl.com';

/* Current vacancies. Shape:
     {
       id:      'sri-lanka-corporate-secretarial-executive',  // URL-safe, unique
       title:   'Corporate Secretarial Executive',
       office:  'sri-lanka',        // matches an offices.js slug (optional)
       location:'Colombo, Sri Lanka',
       type:    'Full Time',
       summary: 'One or two sentences describing the role.',
       responsibilities: ['…'],
       requirements:     ['…'],
     }
   Leave the array empty when nothing is advertised. */
export const openings = [];

/* Why candidates join — grounded in how the group actually operates,
   not generic recruitment copy. */
export const whyJoin = [
  {
    icon: 'globe',
    title: 'Multi-Jurisdiction Exposure',
    desc: 'You will work on engagements spanning Sri Lanka, Singapore, the United Arab Emirates, the United Kingdom, and Hong Kong, building experience that is difficult to acquire within a single market.',
  },
  {
    icon: 'users',
    title: 'Senior-Led Development',
    desc: 'Experienced directors are involved on every account, so you learn directly from the people accountable for the work rather than at a distance from it.',
  },
  {
    icon: 'briefcase',
    title: 'Breadth of Discipline',
    desc: 'Company incorporation and governance, financial services, research and business planning, and human resource management sit under one roof, giving you exposure well beyond a single specialism.',
  },
  {
    icon: 'monitor',
    title: 'Technology-Enabled Delivery',
    desc: 'Our processes are digital-first, so your time goes into advisory work and client outcomes rather than avoidable administration.',
  },
];

/* What we look for in applicants. */
export const whatWeLookFor = [
  'A commitment to accuracy and detail in regulated, deadline-driven work.',
  'Clear written and spoken communication with clients and colleagues.',
  'Professional integrity and sound judgement when handling confidential information.',
  'A willingness to learn across jurisdictions and service lines.',
  'A relevant professional qualification, or a genuine intention to pursue one.',
];
