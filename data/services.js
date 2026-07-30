/* ═══════════════════════════════════════════════════
   SRP International — Regional service catalogs
   Keyed by region slug, then service slug. Looked up
   by the /:region/:serviceSlug route in server.js.
   ─────────────────────────────────────────────────
   Pricing is intentionally KEPT in this file so the
   data is complete and auditable — the /:region hub
   only DISPLAYS a teaser; the full table is hidden
   behind a "Request a quote" CTA per design decision.
═══════════════════════════════════════════════════ */

/* ─── SRI LANKA ─── 4 services (existing site catalog, unchanged) ─── */
const sriLanka = {
  'company-secretarial': {
    slug: 'company-secretarial',
    title: 'Company Incorporation & Governance',
    shortTitle: 'Incorporation & Governance',
    icon: 'file-text',
    overview: 'SRP International handles company incorporation and governance from start to finish — making sure your business is correctly structured, properly registered, and compliant with every local regulation. From the first incorporation step through ongoing secretarial support, we look after the details of corporate governance so you can stay focused on building the business.',
    benefits: [
      { title: 'Full Legal Compliance', desc: 'Your company meets every local and international requirement, at every stage.' },
      { title: 'Expert Guidance', desc: 'Work directly with experienced corporate secretaries who know these regulatory frameworks inside out.' },
      { title: 'Time Savings', desc: 'Stay focused on your business while we manage the paperwork, filings, and regulatory deadlines.' },
      { title: 'Risk Mitigation', desc: 'Avoid penalties and unwelcome surprises with proactive compliance monitoring and advice.' },
    ],
    included: [
      'Company incorporation and registration',
      'Annual return filing and compliance',
      'Board meeting coordination and minutes',
      'Statutory record maintenance',
      'Director and shareholder updates',
      'Regulatory filing and reporting',
      'Corporate restructuring support',
      'Registered office services',
    ],
    process: [
      { step: 1, title: 'Initial Consultation', desc: 'We learn your structure needs and the regulations that apply to you.' },
      { step: 2, title: 'Structure Planning', desc: 'We recommend the corporate structure that best fits your objectives.' },
      { step: 3, title: 'Documentation', desc: 'We prepare every incorporation and compliance document you need.' },
      { step: 4, title: 'Registration', desc: 'We handle the full registration process with the relevant authorities.' },
      { step: 5, title: 'Ongoing Support', desc: 'We keep supporting you with secretarial and compliance work.' },
    ],
    faqs: [
      { q: 'How long does company incorporation typically take?',  a: 'Timelines vary by jurisdiction. In Sri Lanka, incorporation usually takes 3–5 business days once the documents are prepared and submitted.' },
      { q: 'Do you handle compliance for existing companies?',     a: 'Yes. We provide ongoing secretarial and compliance services for both newly incorporated and established companies.' },
      { q: 'Can you help with company restructuring?',             a: 'Absolutely. We advise on and manage corporate restructuring, including mergers, acquisitions, and changes to share capital.' },
      { q: 'What jurisdictions do you cover?',                     a: 'We operate primarily in Sri Lanka, Singapore, Dubai, and the United Kingdom, and we can coordinate with partners in other jurisdictions.' },
    ],
    relatedSlugs: ['financial-services', 'research-planning', 'hr-management'],
  },

  'financial-services': {
    slug: 'financial-services',
    title: 'Financial Services',
    shortTitle: 'Financial Services',
    icon: 'dollar-sign',
    overview: 'SRP International delivers complete financial management using modern, online financial systems. From monthly management accounting through to year-end financial statements, we give your business the financial clarity and control it needs to plan with confidence. We work closely with independent auditors and tax advisors to make sure the guidance behind your numbers is sound.',
    benefits: [
      { title: 'Real-Time Insight', desc: 'See up-to-date financial data through modern online accounting systems.' },
      { title: 'Expert Tax Advisory', desc: 'Work with our network of tax specialists to optimize your tax position.' },
      { title: 'Audit Readiness', desc: 'Keep clean, organized financial records that are always ready for audit.' },
      { title: 'Cost Control', desc: 'Clearer financial visibility leads to smarter spending and better cash management.' },
    ],
    included: [
      'Monthly management accounting',
      'Invoicing and accounts receivable',
      'Cash flow management',
      'Annual financial statement preparation',
      'Tax planning and advisory coordination',
      'Audit liaison and support',
      'Budgeting and forecasting',
      'Financial reporting and analysis',
    ],
    process: [
      { step: 1, title: 'Assessment', desc: 'We review your current financial processes and find what can be improved.' },
      { step: 2, title: 'System Setup', desc: 'We configure online accounting systems around how your business works.' },
      { step: 3, title: 'Data Migration', desc: 'We move your existing financial data across safely.' },
      { step: 4, title: 'Ongoing Management', desc: 'We handle day-to-day accounting, reporting, and financial management.' },
      { step: 5, title: 'Review & Advisory', desc: 'Regular financial reviews, with clear insights and recommendations.' },
    ],
    faqs: [
      { q: 'What accounting software do you use?',          a: 'We use modern, cloud-based accounting platforms that give you real-time access to your financial data from anywhere.' },
      { q: 'Can you work with our existing auditors?',      a: 'Yes. We work closely with your chosen independent auditors and tax advisors for seamless financial management.' },
      { q: 'Do you handle payroll as well?',                a: 'Payroll is handled through our Human Resource Management service, and we coordinate closely between the two for integrated financial management.' },
      { q: 'How often will I receive financial reports?',   a: 'We provide monthly management accounts and can deliver custom reports on demand, depending on your needs.' },
    ],
    relatedSlugs: ['company-secretarial', 'research-planning', 'hr-management'],
  },

  'research-planning': {
    slug: 'research-planning',
    title: 'Research & Business Planning',
    shortTitle: 'Research & Planning',
    icon: 'search',
    overview: 'SRP International helps you understand new ventures clearly and keep a close eye on existing investments. We deliver thorough feasibility studies, structured business plans, lead generation, forensic evaluations, and bespoke equity research — each one shaped around your specific portfolio and objectives.',
    benefits: [
      { title: 'Informed Decisions', desc: 'Make confident decisions backed by thorough research and analysis.' },
      { title: 'Market Intelligence', desc: 'Understand your market, your competitors, and where the real opportunities are.' },
      { title: 'Investment Clarity', desc: 'Get clear, unbiased evaluations of both potential and existing investments.' },
      { title: 'Strategic Direction', desc: 'Build structured business plans that line your resources up with your goals.' },
    ],
    included: [
      'Feasibility studies',
      'Business plan development',
      'Market research and analysis',
      'Lead generation campaigns',
      'Forensic evaluations',
      'Equity research reports',
      'Competitor analysis',
      'Investment tracking and reporting',
    ],
    process: [
      { step: 1, title: 'Brief & Scope', desc: 'We define the research objectives, scope, and deliverables together.' },
      { step: 2, title: 'Data Collection', desc: 'We gather primary and secondary data from reliable sources.' },
      { step: 3, title: 'Analysis', desc: 'We analyze the data using proven research methods.' },
      { step: 4, title: 'Report Delivery', desc: 'We deliver a clear report with practical, actionable recommendations.' },
      { step: 5, title: 'Follow-Up', desc: 'We support implementation and provide further research as you need it.' },
    ],
    faqs: [
      { q: 'What types of feasibility studies do you offer?', a: 'We cover technical, financial, market, and operational feasibility for new ventures, product launches, and expansion plans.' },
      { q: 'Can you help with investor presentations?',       a: 'Yes. We develop structured business plans and supporting research you can use for investor pitches and funding applications.' },
      { q: 'Do you provide ongoing market monitoring?',       a: 'Yes. We offer ongoing market intelligence and portfolio tracking, tailored to your investment strategy.' },
      { q: 'How long does a typical research project take?',  a: 'It depends on scope. A standard feasibility study usually takes 2–4 weeks; a comprehensive business plan may take 4–6 weeks.' },
    ],
    relatedSlugs: ['company-secretarial', 'financial-services', 'hr-management'],
  },

  'hr-management': {
    slug: 'hr-management',
    title: 'Human Resource Management',
    shortTitle: 'HR Management',
    icon: 'users',
    overview: 'SRP International helps you manage your people well, with HR support across the board. From recruitment and documentation to performance reviews and payroll, we handle every part of human resource management — so your team is well looked after, motivated, and compliant with employment regulations.',
    benefits: [
      { title: 'Compliance Assurance', desc: 'Stay compliant with employment laws, contracts, and regulatory requirements.' },
      { title: 'Talent Acquisition', desc: 'Find and hire the right people with structured recruitment support.' },
      { title: 'Team Development', desc: 'Put KPI frameworks and personal development plans in place for your team.' },
      { title: 'Operational Efficiency', desc: 'Streamline payroll, leave management, and day-to-day HR administration.' },
    ],
    included: [
      'Recruitment and onboarding',
      'HR contract drafting and management',
      'HR policy development',
      'Payroll processing and management',
      'KPI and performance reviews',
      'Personal development plans',
      'Industrial dispute handling',
      'Employee relations advisory',
    ],
    process: [
      { step: 1, title: 'HR Audit', desc: 'We review your current HR processes, policies, and compliance status.' },
      { step: 2, title: 'Policy Setup', desc: 'We develop or update your HR policies, contracts, and documentation.' },
      { step: 3, title: 'System Integration', desc: 'We set up your payroll and HR management processes.' },
      { step: 4, title: 'Ongoing Management', desc: 'We run day-to-day HR operations, including payroll and recruitment.' },
      { step: 5, title: 'Reviews & Growth', desc: 'We run regular performance reviews and support your team\'s development.' },
    ],
    faqs: [
      { q: 'Can you handle payroll for companies of any size?', a: 'Yes. We manage payroll for businesses from small teams to large organizations, with accuracy and full compliance.' },
      { q: 'Do you help with employment disputes?',             a: 'Yes. We support and advise on industrial disputes, grievances, and terminations, in line with local labor laws.' },
      { q: 'Can you recruit staff on our behalf?',              a: 'We support the full recruitment process — job descriptions, candidate screening, and onboarding — working closely with your team to find the right fit.' },
      { q: 'Do you offer training and development services?',   a: 'We build personal development plans and KPI frameworks. For specialized training, we coordinate with training partners to meet your team\'s needs.' },
    ],
    relatedSlugs: ['company-secretarial', 'financial-services', 'research-planning'],
  },
};

/* ─── SINGAPORE ─── 3 services from the SG primer ─────────────── */
const singapore = {
  'incorporation': {
    slug: 'incorporation',
    title: 'Singapore Company Incorporation',
    shortTitle: 'Incorporation',
    icon: 'briefcase',
    overview: 'End-to-end Singapore company registration — incorporation documents, ACRA approvals, and compliance setup. We get your Singapore entity registered, set up, and ready to operate, so you can stay focused on building the business.',
    benefits: [
      { title: 'ACRA-Ready Setup', desc: 'Every filing and document prepared to ACRA standards from day one.' },
      { title: 'Fast Turnaround', desc: 'Most Singapore incorporations complete within a few business days.' },
      { title: 'Single Point of Contact', desc: 'One coordinator across registration, banking, and compliance setup.' },
      { title: 'Group Backing', desc: 'Backed by SRP\'s wider regional group, so your incorporation connects cleanly to the rest of your operation.' },
    ],
    included: [
      'Singapore Pte Ltd company registration',
      'Incorporation document preparation',
      'ACRA approvals and submissions',
      'Compliance requirement setup',
      'Constitution drafting',
      'Initial board and shareholder resolutions',
      'Registered office address coordination',
      'Corporate bank account introduction',
    ],
    process: [
      { step: 1, title: 'Scoping', desc: 'We confirm your shareholder structure, share capital, and activity scope.' },
      { step: 2, title: 'Documentation', desc: 'We prepare the constitution, resolutions, and ACRA filings.' },
      { step: 3, title: 'ACRA Filing', desc: 'We file with ACRA and obtain your UEN.' },
      { step: 4, title: 'Bank Account', desc: 'We coordinate your corporate bank account opening.' },
      { step: 5, title: 'Handover', desc: 'You receive the full incorporation pack, ready to operate.' },
    ],
    faqs: [
      { q: 'How long does Singapore incorporation take?',          a: 'Most Singapore Pte Ltd incorporations complete within 1–3 business days, once all KYC and documentation are in order.' },
      { q: 'Do I need a local director?',                          a: 'Yes — Singapore requires at least one director who is ordinarily resident in Singapore. We can introduce nominee director services where needed.' },
      { q: 'What is the minimum paid-up capital?',                 a: 'Singapore allows a minimum paid-up capital of SGD 1, though most operating companies start higher, based on their needs.' },
      { q: 'Will you also handle ongoing compliance after setup?', a: 'Yes — our CoSec & Governance service picks up right after incorporation. The two are designed to flow together.' },
    ],
    pricing: {
      currency: 'USD',
      note: 'Prices subject to final scope, client profile and relevant authority charges where applicable.',
      tiers: [
        { name: 'Incorporation',                       term: 'One-time', fee: '750' },
        { name: 'Company Secretarial Services, inclusive of AGM', term: 'Annually', fee: '1,000' },
      ],
      addons: [],
    },
    relatedSlugs: ['governance', 'accounting'],
  },

  'governance': {
    slug: 'governance',
    title: 'Company Secretarial & Governance',
    shortTitle: 'CoSec & Governance',
    icon: 'file-text',
    overview: 'Ongoing, ACRA-aligned corporate governance for Singapore companies — statutory filings, meeting minutes, statutory records, annual returns, AGM documentation, and governance support right across the corporate calendar.',
    benefits: [
      { title: 'ACRA Compliance', desc: 'Stay on the right side of ACRA with timely filings and clean statutory records.' },
      { title: 'Calendar Coverage', desc: 'AGMs, annual returns, and board cycles managed from end to end.' },
      { title: 'Audit-Ready', desc: 'Statutory records kept to a standard your auditors will appreciate.' },
      { title: 'Director Support', desc: 'Resolutions, share transactions, and director changes handled cleanly.' },
    ],
    included: [
      'ACRA statutory filings',
      'Board meeting minutes',
      'Statutory records maintenance',
      'Annual returns',
      'AGM documentation',
      'Governance support and advisory',
      'Director and shareholder changes',
      'Share transfer and EGM coordination',
    ],
    process: [
      { step: 1, title: 'Onboarding', desc: 'We review your statutory records and bring them up to date.' },
      { step: 2, title: 'Calendar Setup', desc: 'We map your ACRA deadlines, AGM dates, and filing windows.' },
      { step: 3, title: 'Ongoing Filings', desc: 'We prepare and submit filings as they fall due.' },
      { step: 4, title: 'AGM Cycle', desc: 'We coordinate your AGM documentation and minutes each year.' },
      { step: 5, title: 'Advisory & Updates', desc: 'We flag the regulatory changes that affect your obligations.' },
    ],
    faqs: [
      { q: 'Can you take over CoSec from another provider?',     a: 'Yes — we handle transitions regularly. We audit the existing records, bring everything current, and carry on seamlessly.' },
      { q: 'Do you support EGMs and ad-hoc resolutions?',        a: 'Yes — both as add-ons and as part of bundled packages. See pricing for the EGM Bundle structure.' },
      { q: 'What about share transfers and stamp duty (IRAS)?',  a: 'Share transfer forms, share agreements, and IRAS e-stamping are all covered as add-ons.' },
      { q: 'Can you handle company striking-off?',               a: 'Yes — striking-off support is available as a one-time add-on.' },
    ],
    pricing: {
      currency: 'USD',
      note: 'Prices subject to final scope, client profile and relevant authority charges where applicable.',
      tiers: [
        { name: 'Company Secretarial Services, inclusive of AGM', term: 'Annually', fee: '1,000' },
      ],
      addons: [
        { name: 'EGM Bundle (Base charge)',                          term: 'Per/Each', fee: '300' },
        { name: 'Service fee — each director/shareholder/activity', term: 'Per/Each', fee: '100' },
        { name: 'Share Transfer Forms & Share Agreement',            term: 'Per/Each', fee: '100' },
        { name: 'E-Stamping — IRAS Filing',                          term: 'Per/Each', fee: '100' },
        { name: 'Ministry of Manpower Liaison',                      term: 'Per interaction', fee: '100' },
        { name: 'Striking Off of a Company',                         term: 'One-time', fee: '1,250' },
      ],
    },
    relatedSlugs: ['incorporation', 'accounting'],
  },

  'accounting': {
    slug: 'accounting',
    title: 'Accounting, GST & Corporate Tax',
    shortTitle: 'Accounting',
    icon: 'dollar-sign',
    overview: 'Full-stack Singapore accounting — bookkeeping, annual financial reporting, GST returns, and corporate tax return support. Priced to your transaction volume, with optional quarterly financials and tax computations.',
    benefits: [
      { title: 'Tier-Right Pricing', desc: 'Pricing scales with your transaction volume, so you never overpay for what you don\'t use.' },
      { title: 'GST Handled', desc: 'Quarterly GST computation and submission, available as an add-on.' },
      { title: 'Corporate Tax', desc: 'Annual corporate tax computation, with ECI and Form C-S / Form C support.' },
      { title: 'Audit Liaison', desc: 'Clean books, ready for your auditor, every year.' },
    ],
    included: [
      'Bookkeeping (tiered to transaction volume)',
      'Annual financial reporting',
      'GST returns (where applicable)',
      'Corporate tax return support',
      'Quarterly financial statements (optional)',
      'Interim financial statements (optional)',
      'Audit liaison and support',
      'IRAS correspondence and filings',
    ],
    process: [
      { step: 1, title: 'Setup', desc: 'We set your books up on a modern cloud accounting platform.' },
      { step: 2, title: 'Monthly Bookkeeping', desc: 'We post transactions and reconcile accounts on a monthly cycle.' },
      { step: 3, title: 'Quarterly Reviews', desc: 'We deliver interim financials and prepare GST returns where applicable.' },
      { step: 4, title: 'Annual Reporting', desc: 'We produce your year-end financial statements and tax computations.' },
      { step: 5, title: 'Audit Support', desc: 'We liaise with your auditors and respond to IRAS queries.' },
    ],
    faqs: [
      { q: 'How do the bookkeeping tiers work?',                a: 'Tiers are based on monthly transaction volume — Tier 1 up to 250, Tier 2 between 250 and 500, Tier 3 between 500 and 1,000. We re-tier annually if your volume shifts.' },
      { q: 'Do you handle GST registration?',                   a: 'Yes — we register you for GST when your company crosses the threshold or elects voluntary registration, and we then handle the quarterly returns.' },
      { q: 'What about corporate tax filings (ECI / Form C-S)?', a: 'Yes — both estimated chargeable income and the annual corporate tax return are supported.' },
      { q: 'Can I get quarterly financials, not just annual?',   a: 'Yes — quarterly and interim financial statement preparation is available as an add-on.' },
    ],
    pricing: {
      currency: 'USD',
      note: 'Prices subject to final scope, client profile and relevant authority charges where applicable.',
      tiers: [
        { name: 'Bookkeeping — Tier 1 (up to 250 transactions)',    term: 'Annually', fee: '1,750' },
        { name: 'Bookkeeping — Tier 2 (250 to 500 transactions)',   term: 'Annually', fee: '2,500' },
        { name: 'Bookkeeping — Tier 3 (500 to 1,000 transactions)', term: 'Annually', fee: '3,000' },
      ],
      addons: [
        { name: 'Quarterly GST computation & returns submission',     term: 'Per/Each', fee: '250' },
        { name: 'Corporate tax computation & return submission',      term: 'Per/Each', fee: '600' },
        { name: 'Quarterly Financial / Interim Financial Statements', term: 'Per/Each', fee: '250 – 750' },
      ],
    },
    relatedSlugs: ['incorporation', 'governance'],
  },
};

/* ─── UAE ─── 3 services from the UAE primer ────────────────── */
const uae = {
  'incorporation': {
    slug: 'incorporation',
    title: 'UAE Free Zone Incorporation',
    shortTitle: 'Free Zone Incorporation',
    icon: 'briefcase',
    overview: 'Free Zone company registration in the UAE — documentation, regulatory approvals, and compliance setup. We take you from the initial scoping conversation through license issuance and bank account, ready to operate.',
    benefits: [
      { title: 'Free Zone Expertise', desc: 'Deep experience with IFZA, DDP, and other major UAE Free Zones.' },
      { title: 'End-to-End Setup', desc: 'Documentation, approvals, bank account, residency — all coordinated under one partner.' },
      { title: 'Residency Support', desc: 'Visa and residency requirements supported as part of the incorporation path.' },
      { title: 'Operational Backing', desc: 'Backed by SRP\'s wider group, so your UAE entity connects cleanly to the rest of your operation.' },
    ],
    included: [
      'Free Zone company registration',
      'Incorporation documentation',
      'Regulatory approvals and submissions',
      'Compliance requirement setup',
      'Trade license coordination',
      'Corporate bank account introduction',
      'Initial visa and residency pathway setup',
      'Free Zone authority liaison',
    ],
    process: [
      { step: 1, title: 'Scoping', desc: 'We confirm Free Zone fit, ownership structure, and licensed activities.' },
      { step: 2, title: 'Documentation', desc: 'We prepare your incorporation paperwork and KYC.' },
      { step: 3, title: 'Approvals', desc: 'We submit to the Free Zone authority and secure approvals.' },
      { step: 4, title: 'License & Bank', desc: 'Trade license issued; bank account opened.' },
      { step: 5, title: 'Handover', desc: 'Full incorporation pack delivered, residency path begun.' },
    ],
    faqs: [
      { q: 'Which Free Zone should I choose?',                       a: 'It depends on your activity, residency needs, and budget. We advise based on your specific use case — IFZA, DDP, JAFZA, and others each have different strengths.' },
      { q: 'Can you handle the residence visa as part of setup?',    a: 'Yes — residency coordination is part of CoSec Tier 2, and several items are available as add-ons under incorporation, including trade license upgrades for residence, residence assistance, and re-entry permits.' },
      { q: 'Is incorporation assistance really free of charge?',      a: 'Incorporation Assistance is offered at no charge when bundled with our governance and accounting services. Standalone, it carries a premium.' },
      { q: 'Will you set up VAT and Corporate Tax registration too?', a: 'Yes — tax and VAT registration are handled as part of our CoSec Tier 2 service.' },
    ],
    pricing: {
      currency: 'USD',
      note: 'Prices subject to final scope, client profile and relevant authority charges where applicable.',
      tiers: [
        { name: 'Incorporation Assistance', term: 'One-time', fee: 'FOC' },
      ],
      addons: [],
    },
    relatedSlugs: ['governance', 'accounting'],
  },

  'governance': {
    slug: 'governance',
    title: 'Company Secretarial & Governance',
    shortTitle: 'CoSec & Governance',
    icon: 'file-text',
    overview: 'Ongoing UAE corporate governance — statutory filings, meeting minutes, regulatory compliance, Free Zone amendments, and residency coordination. Tier 1 covers the baseline; Tier 2 extends to residency, trade license upgrades, and bank account operations support.',
    benefits: [
      { title: 'Free Zone Aligned', desc: 'Filings and amendments aligned to your specific Free Zone authority\'s requirements.' },
      { title: 'Residency Coordination', desc: 'Visa, residence, and re-entry paths managed alongside corporate compliance.' },
      { title: 'Two-Tier Model', desc: 'Tier 1 for baseline governance; Tier 2 for hands-on residency and trade license support.' },
      { title: 'Bank Operations Help', desc: 'Tier 2 includes hands-on support for corporate bank account operations.' },
    ],
    included: [
      'Statutory filings',
      'Meeting minutes',
      'Regulatory compliance monitoring',
      'Free Zone amendments coordination',
      'Residency coordination',
      'Tax and VAT registration (Tier 2)',
      'Trade license upgrades (Tier 2)',
      'Bank account operations support (Tier 2)',
    ],
    process: [
      { step: 1, title: 'Onboarding', desc: 'We review your Free Zone records and bring them up to date.' },
      { step: 2, title: 'Tier Selection', desc: 'Tier 1 (baseline) or Tier 2 (extended), chosen to fit your activity.' },
      { step: 3, title: 'Calendar Setup', desc: 'We map your filing windows, license renewals, and residency dates.' },
      { step: 4, title: 'Ongoing Compliance', desc: 'We file, amend, and coordinate as obligations arise.' },
      { step: 5, title: 'Annual Review', desc: 'We confirm your tier still fits as the business evolves.' },
    ],
    faqs: [
      { q: 'What\'s the difference between Tier 1 and Tier 2?',       a: 'Tier 1 is baseline statutory governance — filings, minutes, compliance. Tier 2 adds residency requirements, trade license upgrades, tax/VAT registration, and hands-on bank operations support.' },
      { q: 'Do you handle bank account operations day-to-day?',       a: 'Tier 2 includes hands-on support for corporate bank account operations as needed. A standalone "Bank Account & Card Services" option is also available as an add-on.' },
      { q: 'Are residency permits charged on top?',                   a: 'Tier 2 covers residency coordination. Specific items, like "Residence and Assistance" and "Re-entry Permits," are available as one-time add-ons.' },
      { q: 'What about dividend resolutions and trade license changes?', a: 'Dividend resolutions, trade license upgrades, and similar one-time items are offered as add-ons. See the pricing detail.' },
    ],
    pricing: {
      currency: 'USD',
      note: 'Prices subject to final scope, client profile and relevant authority charges where applicable.',
      tiers: [
        { name: 'Company Secretarial — Tier 1',  term: 'Annually', fee: '1,000' },
        { name: 'Company Secretarial — Tier 2',  term: 'Annually', fee: '1,500' },
      ],
      addons: [
        { name: 'Trade License Upgrade for Residence', term: 'One-time', fee: '100' },
        { name: 'Residence and Assistance',            term: 'One-time', fee: '250' },
        { name: 'Bank Account & Card Services',        term: 'One-time', fee: '150' },
        { name: 'Dividend Resolution',                 term: 'One-time', fee: '75'  },
        { name: 'Re-entry Permits',                    term: 'One-time', fee: '75'  },
      ],
    },
    relatedSlugs: ['incorporation', 'accounting'],
  },

  'accounting': {
    slug: 'accounting',
    title: 'Accounting, VAT & Corporate Tax',
    shortTitle: 'Accounting',
    icon: 'dollar-sign',
    overview: 'Full-stack UAE accounting — bookkeeping, annual financial reporting, VAT returns, and corporate tax return support. Priced to your transaction volume, with quarterly VAT and annual tax filings handled cleanly.',
    benefits: [
      { title: 'Tier-Right Pricing', desc: 'Pricing scales with your transaction volume.' },
      { title: 'VAT Handled', desc: 'Quarterly VAT computation and return submission, available as an add-on.' },
      { title: 'Corporate Tax', desc: 'Annual corporate tax computation and submission, fully supported.' },
      { title: 'Audit-Ready Books', desc: 'Clean records, ready for audit or FTA review.' },
    ],
    included: [
      'Bookkeeping (tiered to transaction volume)',
      'Annual financial reporting',
      'VAT returns (where applicable)',
      'Corporate tax return support',
      'FTA correspondence and filings',
      'Audit liaison and support',
      'Management reporting (optional)',
      'IFRS-aligned reporting',
    ],
    process: [
      { step: 1, title: 'Setup', desc: 'We set your books up on a cloud accounting platform.' },
      { step: 2, title: 'Monthly Bookkeeping', desc: 'Transactions posted and reconciled monthly.' },
      { step: 3, title: 'Quarterly VAT', desc: 'VAT computation and submission to the FTA.' },
      { step: 4, title: 'Annual Reporting', desc: 'Year-end financial statements and corporate tax computation.' },
      { step: 5, title: 'Audit Support', desc: 'Auditor liaison and FTA queries handled.' },
    ],
    faqs: [
      { q: 'How do the bookkeeping tiers work?',          a: 'Tier 1 up to 250 transactions, Tier 2 between 250 and 500, Tier 3 between 500 and 1,000 — re-tiered annually based on volume.' },
      { q: 'Do you handle VAT registration and de-registration?', a: 'Yes — VAT registration is part of CoSec Tier 2, and ongoing quarterly returns are available as an accounting add-on.' },
      { q: 'What about Corporate Tax (the 9% regime)?',   a: 'Yes — corporate tax computation and annual return submission are available as an add-on.' },
      { q: 'Can you support free zone audit requirements?', a: 'Yes — many Free Zones require audited financials. We prepare audit-ready books and liaise with your appointed auditors.' },
    ],
    pricing: {
      currency: 'USD',
      note: 'Prices subject to final scope, client profile and relevant authority charges where applicable.',
      tiers: [
        { name: 'Bookkeeping — Tier 1 (up to 250 transactions)',    term: 'Annually', fee: '2,000' },
        { name: 'Bookkeeping — Tier 2 (250 to 500 transactions)',   term: 'Annually', fee: '2,750' },
        { name: 'Bookkeeping — Tier 3 (500 to 1,000 transactions)', term: 'Annually', fee: '3,500' },
      ],
      addons: [
        { name: 'Quarterly VAT computation & return submission',  term: 'Annually', fee: '300' },
        { name: 'Corporate tax computation & return submission',  term: 'Annually', fee: '700' },
      ],
    },
    relatedSlugs: ['incorporation', 'governance'],
  },
};

/* ─── UK ─── 3 services mirroring SG/UAE structure ─── */
const uk = {
  'incorporation': {
    slug: 'incorporation',
    title: 'UK Company Incorporation',
    shortTitle: 'Incorporation',
    icon: 'briefcase',
    overview: 'UK company incorporation — Companies House registration, governance setup, and ongoing compliance. Delivered from our London office at 64 Nile Street.',
    benefits: [
      { title: 'Companies House Ready', desc: 'Registration and post-incorporation filings handled to Companies House standards.' },
      { title: 'UK Governance Setup', desc: 'Constitution, resolutions, and PSC register prepared from day one.' },
      { title: 'Group Continuity', desc: 'The same SRP coordination model your other regional entities already use.' },
      { title: 'London-Based Team', desc: 'A local director and account team supporting your UK operations on the ground.' },
    ],
    included: [
      'UK Limited company registration',
      'Companies House submissions',
      'Memorandum & Articles of Association',
      'PSC register setup',
      'Initial board and shareholder resolutions',
      'Registered office address (UK)',
      'Director appointment documentation',
      'Bank account introduction',
    ],
    process: [
      { step: 1, title: 'Scoping', desc: 'We confirm your ownership, share capital, and SIC codes.' },
      { step: 2, title: 'Documentation', desc: 'We prepare your constitution and Companies House filings.' },
      { step: 3, title: 'Filing', desc: 'We file with Companies House and obtain your company number.' },
      { step: 4, title: 'Bank Account', desc: 'We coordinate your corporate banking introduction.' },
      { step: 5, title: 'Handover', desc: 'You receive the full incorporation pack.' },
    ],
    faqs: [
      { q: 'Where is SRP UK based?',                       a: 'International House, 64 Nile Street, London, England N1 7SR. You can reach us on +44 7807 854544.' },
      { q: 'How long does UK incorporation take?',         a: 'A standard private limited company incorporation through Companies House usually completes within 1–2 business days, once all KYC and documentation are in order.' },
      { q: 'Will UK pricing mirror Singapore and the UAE?', a: 'Our UK service follows the same three-pillar model, with UK-specific fee bands. Ask us for a scoping conversation and we\'ll give you a tailored quote.' },
      { q: 'Who leads SRP in the UK?',                     a: 'Jonathan Kitcat is Managing Director, SRP International United Kingdom.' },
    ],
    pricing: null,
    relatedSlugs: ['governance', 'accounting'],
  },

  'governance': {
    slug: 'governance',
    title: 'Company Secretarial & Governance',
    shortTitle: 'CoSec & Governance',
    icon: 'file-text',
    overview: 'Ongoing UK corporate governance — Companies House filings, confirmation statements, PSC register maintenance, board minutes, and statutory compliance.',
    benefits: [
      { title: 'Companies House Aligned', desc: 'Confirmation statements and filings handled to deadline.' },
      { title: 'PSC Maintained', desc: 'Your People with Significant Control register kept current.' },
      { title: 'Board Cycle Coverage', desc: 'Your annual board cycle and minutes managed end to end.' },
      { title: 'Group Backing', desc: 'Coordinated with your other regional SRP services.' },
    ],
    included: [
      'Companies House confirmation statements',
      'Statutory filings',
      'PSC register maintenance',
      'Board meeting minutes',
      'Statutory records maintenance',
      'Director and shareholder changes',
      'Share transfer support',
      'Annual compliance calendar',
    ],
    process: [
      { step: 1, title: 'Onboarding', desc: 'We review your existing UK records and bring them up to date.' },
      { step: 2, title: 'Calendar Setup', desc: 'We map your confirmation statement and accounts filing deadlines.' },
      { step: 3, title: 'Ongoing Filings', desc: 'We file as obligations fall due.' },
      { step: 4, title: 'Director Changes', desc: 'Appointments, resignations, and PSC updates handled cleanly.' },
      { step: 5, title: 'Advisory & Updates', desc: 'We flag the regulatory changes that affect your obligations.' },
    ],
    faqs: [
      { q: 'Will you support UK confirmation statements?',    a: 'Yes — confirmation statements and PSC register maintenance are core to the UK CoSec service.' },
      { q: 'Can you handle UK share transfers and stamp duty?', a: 'Yes — share transfer documentation and HMRC stamp duty filings are part of the service.' },
      { q: 'Can you take over UK CoSec from another provider?', a: 'Yes — we handle transitions regularly. We audit the existing records, bring everything current, and carry on seamlessly.' },
      { q: 'Who leads SRP UK?',                                a: 'Jonathan Kitcat is Managing Director, SRP International United Kingdom.' },
    ],
    pricing: null,
    relatedSlugs: ['incorporation', 'accounting'],
  },

  'accounting': {
    slug: 'accounting',
    title: 'Accounting, VAT & Corporation Tax',
    shortTitle: 'Accounting',
    icon: 'dollar-sign',
    overview: 'Full-stack UK accounting — bookkeeping, statutory accounts, VAT returns, and Corporation Tax (CT600) support. Priced to your transaction volume.',
    benefits: [
      { title: 'FRS-Aligned', desc: 'Statutory accounts prepared to FRS 102 / FRS 105 standards, as applicable.' },
      { title: 'VAT Handled', desc: 'Quarterly VAT returns under Making Tax Digital.' },
      { title: 'CT600 Support', desc: 'Annual Corporation Tax return prepared and submitted to HMRC.' },
      { title: 'Audit-Ready', desc: 'Books prepared for statutory audit where it applies.' },
    ],
    included: [
      'Bookkeeping (tiered to transaction volume)',
      'Statutory accounts (FRS 102 / FRS 105)',
      'Quarterly VAT returns (MTD)',
      'Corporation Tax (CT600) return',
      'HMRC correspondence',
      'Companies House accounts filing',
      'Management reporting (optional)',
      'Audit liaison where applicable',
    ],
    process: [
      { step: 1, title: 'Setup', desc: 'We set your books up on a UK-friendly cloud accounting platform.' },
      { step: 2, title: 'Monthly Bookkeeping', desc: 'Transactions posted and reconciled monthly.' },
      { step: 3, title: 'Quarterly VAT', desc: 'VAT returns submitted under MTD.' },
      { step: 4, title: 'Annual Accounts', desc: 'Statutory accounts and CT600 prepared and filed.' },
      { step: 5, title: 'Audit Support', desc: 'Auditor liaison for companies above the audit thresholds.' },
    ],
    faqs: [
      { q: 'How do the bookkeeping tiers work?',         a: 'They\'re tiered to monthly transaction volume — Tier 1 up to 250, Tier 2 between 250 and 500, Tier 3 between 500 and 1,000 — re-tiered annually based on volume.' },
      { q: 'Will UK pricing be tiered like SG and UAE?', a: 'Yes — the same three-tier bookkeeping framework applies, with UK-specific fee bands. Ask us for a scoping conversation and we\'ll give you a tailored quote.' },
      { q: 'Will you handle Companies House filings?',   a: 'Yes — annual accounts and confirmation statement filings to Companies House are part of the service.' },
      { q: 'Who leads SRP UK?',                          a: 'Jonathan Kitcat is Managing Director, SRP International United Kingdom.' },
    ],
    pricing: null,
    relatedSlugs: ['incorporation', 'governance'],
  },
};

/* ─── HONG KONG ─── 3 services mirroring SG/UAE/UK structure ─── */
const hongKong = {
  'incorporation': {
    slug: 'incorporation',
    title: 'Hong Kong Company Incorporation',
    shortTitle: 'Incorporation',
    icon: 'briefcase',
    overview: 'Hong Kong company incorporation — Companies Registry registration, Business Registration Certificate, and governance setup. We get your Hong Kong limited company registered, set up, and ready to operate.',
    benefits: [
      { title: 'Companies Registry Ready', desc: 'Incorporation and post-registration filings handled to Companies Registry standards.' },
      { title: 'Fast Turnaround', desc: 'Most Hong Kong companies are incorporated within a few business days through the e-Registry.' },
      { title: 'Company Secretary Provided', desc: 'Hong Kong requires a local company secretary and registered office — both covered from day one.' },
      { title: 'Group Backing', desc: 'Backed by SRP\'s wider regional group, so your Hong Kong entity connects cleanly to the rest of your operation.' },
    ],
    included: [
      'Hong Kong private limited company registration',
      'Companies Registry submissions (Form NNC1)',
      'Business Registration Certificate (IRD)',
      'Company secretary service',
      'Registered office address (Hong Kong)',
      'Articles of Association',
      'Initial board and shareholder resolutions',
      'Significant Controllers Register setup',
    ],
    process: [
      { step: 1, title: 'Scoping', desc: 'We confirm your ownership, share capital, and business activities.' },
      { step: 2, title: 'Documentation', desc: 'We prepare the incorporation forms, Articles, and KYC.' },
      { step: 3, title: 'Registry Filing', desc: 'We file with the Companies Registry and obtain your Certificate of Incorporation.' },
      { step: 4, title: 'Business Registration', desc: 'We secure your Business Registration Certificate from the IRD.' },
      { step: 5, title: 'Handover', desc: 'You receive the full incorporation pack, ready to operate.' },
    ],
    faqs: [
      { q: 'How long does Hong Kong incorporation take?',          a: 'Most Hong Kong private limited companies are incorporated within 1–5 business days through the Companies Registry, once all KYC and documentation are in order.' },
      { q: 'Do I need a company secretary and registered office?', a: 'Yes — every Hong Kong company must appoint a company secretary based in Hong Kong and maintain a local registered office. Both are included in our service.' },
      { q: 'Is there a minimum share capital?',                    a: 'There is no minimum capital requirement in Hong Kong. Companies are commonly incorporated with a nominal issued capital, typically denominated in HKD.' },
      { q: 'Who leads SRP in Hong Kong?',                          a: 'Greg Brutus is Managing Director, SRP International Hong Kong.' },
    ],
    pricing: null,
    relatedSlugs: ['governance', 'accounting'],
  },

  'governance': {
    slug: 'governance',
    title: 'Company Secretarial & Governance',
    shortTitle: 'CoSec & Governance',
    icon: 'file-text',
    overview: 'Ongoing Hong Kong corporate governance — Companies Registry filings, annual returns, Business Registration renewals, significant controllers register, and statutory compliance.',
    benefits: [
      { title: 'Companies Registry Aligned', desc: 'Annual returns (Form NAR1) and statutory filings handled to deadline.' },
      { title: 'BR Renewals', desc: 'Business Registration Certificate renewals tracked and filed with the IRD.' },
      { title: 'SCR Maintained', desc: 'Your Significant Controllers Register kept current and available for inspection.' },
      { title: 'Company Secretary', desc: 'A Hong Kong-based company secretary and registered office, maintained for you.' },
    ],
    included: [
      'Companies Registry annual return (NAR1)',
      'Business Registration Certificate renewal',
      'Company secretary service',
      'Registered office address (Hong Kong)',
      'Significant Controllers Register maintenance',
      'Statutory records and minutes',
      'AGM documentation',
      'Director and shareholder changes',
    ],
    process: [
      { step: 1, title: 'Onboarding', desc: 'We review your existing Hong Kong records and bring them up to date.' },
      { step: 2, title: 'Calendar Setup', desc: 'We map your annual return, BR renewal, and AGM deadlines.' },
      { step: 3, title: 'Ongoing Filings', desc: 'We prepare and submit filings as they fall due.' },
      { step: 4, title: 'Register Upkeep', desc: 'We maintain the statutory records and Significant Controllers Register.' },
      { step: 5, title: 'Advisory & Updates', desc: 'We flag the regulatory changes that affect your obligations.' },
    ],
    faqs: [
      { q: 'What is the annual return (NAR1)?',                 a: 'Every Hong Kong company must file an annual return (Form NAR1) with the Companies Registry each year. We prepare and submit it on time as part of the service.' },
      { q: 'Do you handle Business Registration renewals?',     a: 'Yes — we track and renew your Business Registration Certificate with the IRD, on a one-year or three-year basis as you prefer.' },
      { q: 'Can you take over CoSec from another provider?',    a: 'Yes — we handle transitions regularly. We audit the existing records, bring everything current, and carry on seamlessly.' },
      { q: 'Who leads SRP Hong Kong?',                          a: 'Greg Brutus is Managing Director, SRP International Hong Kong.' },
    ],
    pricing: null,
    relatedSlugs: ['incorporation', 'accounting'],
  },

  'accounting': {
    slug: 'accounting',
    title: 'Accounting, Audit & Profits Tax',
    shortTitle: 'Accounting',
    icon: 'dollar-sign',
    overview: 'Full-stack Hong Kong accounting — bookkeeping, financial statements, statutory audit coordination, and Profits Tax Return support. Priced to your transaction volume.',
    benefits: [
      { title: 'HKFRS-Aligned', desc: 'Financial statements prepared to Hong Kong Financial Reporting Standards.' },
      { title: 'Audit Coordination', desc: 'Hong Kong companies require an annual statutory audit — we prepare the books and liaise with your CPA auditor.' },
      { title: 'Profits Tax Support', desc: 'Profits Tax Return (BIR51) preparation and submission to the IRD.' },
      { title: 'Two-Tiered Rates', desc: 'We apply Hong Kong\'s two-tiered profits tax rates of 8.25% and 16.5% correctly.' },
    ],
    included: [
      'Bookkeeping (tiered to transaction volume)',
      'Annual financial statements (HKFRS)',
      'Statutory audit liaison',
      'Profits Tax Return (BIR51)',
      'IRD correspondence',
      'Employer\'s Return support',
      'Management reporting (optional)',
      'Tax computation and advisory coordination',
    ],
    process: [
      { step: 1, title: 'Setup', desc: 'We set your books up on a cloud accounting platform.' },
      { step: 2, title: 'Monthly Bookkeeping', desc: 'Transactions posted and reconciled on a regular cycle.' },
      { step: 3, title: 'Annual Statements', desc: 'We prepare year-end financial statements to HKFRS.' },
      { step: 4, title: 'Audit & Tax', desc: 'We liaise with your auditor and prepare the Profits Tax Return.' },
      { step: 5, title: 'Filing & Support', desc: 'We submit to the IRD and respond to queries.' },
    ],
    faqs: [
      { q: 'Do Hong Kong companies need an audit?',             a: 'Yes — Hong Kong companies are required to have their financial statements audited annually by a local Certified Public Accountant. We prepare audit-ready books and liaise with your appointed auditor.' },
      { q: 'How does Hong Kong profits tax work?',              a: 'Hong Kong operates a two-tiered profits tax: 8.25% on the first HK$2 million of assessable profits and 16.5% on the remainder, for corporations. We handle the computation and Profits Tax Return.' },
      { q: 'Will bookkeeping be tiered like the other regions?', a: 'Yes — the same transaction-volume bookkeeping framework applies, with Hong Kong-specific fee bands. Ask us for a scoping conversation and we\'ll give you a tailored quote.' },
      { q: 'Who leads SRP Hong Kong?',                          a: 'Greg Brutus is Managing Director, SRP International Hong Kong.' },
    ],
    pricing: null,
    relatedSlugs: ['incorporation', 'governance'],
  },
};

/* ─── Export the unified catalog keyed by region slug ─── */
/* ─── GUERNSEY ─── bespoke 4-service catalog (client-supplied scope) ─── */
const guernsey = {
  'company-formation': {
    slug: 'company-formation',
    comingSoon: true,
    title: 'Company Formation & Establishment',
    shortTitle: 'Company Formation',
    icon: 'file-text',
    overview: 'SRP International helps businesses and investors establish their presence in Guernsey — from entity setup and incorporation documentation through to statutory registrations and initial corporate structuring. We coordinate every step and work alongside your local professional advisers so your company is set up correctly from day one.',
    benefits: [
      { title: 'Set Up Correctly', desc: 'Your entity is structured and registered properly from the outset, avoiding costly corrections later.' },
      { title: 'Local Coordination', desc: 'We work alongside your Guernsey advisers and the relevant registries so nothing falls between the cracks.' },
      { title: 'Documentation Handled', desc: 'Incorporation paperwork and statutory registrations are prepared and submitted for you.' },
      { title: 'One Point of Contact', desc: 'A single team coordinates the whole establishment process end to end.' },
    ],
    included: [
      'Company incorporation and entity setup coordination',
      'Preparation and submission of incorporation documentation',
      'Assistance with statutory registrations and onboarding requirements',
      'Support with initial corporate structuring requirements',
      'Coordination with local professional advisers where required',
    ],
    process: [
      { step: 1, title: 'Initial Consultation', desc: 'We understand your objectives and the structure you need in Guernsey.' },
      { step: 2, title: 'Structure & Documentation', desc: 'We plan the setup and prepare the incorporation and registration documents.' },
      { step: 3, title: 'Registration', desc: 'We submit filings and coordinate statutory registrations and onboarding.' },
      { step: 4, title: 'Ongoing Support', desc: 'We hand over cleanly and support your governance and accounting needs as they arise.' },
    ],
    faqs: [
      { q: 'Can you work alongside our existing advisers in Guernsey?', a: 'Yes. We coordinate with your local legal, tax, and professional advisers so the establishment process stays joined up.' },
      { q: 'Do you support businesses expanding into Guernsey as well as new entities?', a: 'Yes. We assist with new incorporations and with investors or groups establishing a presence in the jurisdiction.' },
    ],
    relatedSlugs: ['corporate-governance', 'bookkeeping-accounting', 'outsourced-support'],
  },

  'corporate-governance': {
    slug: 'corporate-governance',
    comingSoon: true,
    title: 'Corporate Governance & Administration',
    shortTitle: 'Governance & Administration',
    icon: 'briefcase',
    overview: 'We support businesses with their ongoing corporate governance and administration — company secretarial support, statutory record-keeping, board documentation, and compliance coordination — keeping your entity in good standing and your records ready for review.',
    benefits: [
      { title: 'Good Standing, Maintained', desc: 'Statutory records and filings stay current, so your entity remains compliant year-round.' },
      { title: 'Board Support', desc: 'Resolutions, minutes, and corporate documentation are prepared to a consistent standard.' },
      { title: 'Clear Oversight', desc: 'Compliance coordination and reporting keep directors and shareholders informed.' },
      { title: 'Reliable Liaison', desc: 'We act as a steady point of contact between directors, shareholders, and advisers.' },
    ],
    included: [
      'Company secretarial support',
      'Maintenance of statutory and corporate records',
      'Preparation of board resolutions and corporate documentation',
      'Compliance coordination and reporting support',
      'Liaison with directors, shareholders, and professional advisers',
    ],
    process: [
      { step: 1, title: 'Records Review', desc: 'We review your statutory records and identify anything outstanding.' },
      { step: 2, title: 'Bring Current', desc: 'We update registers and prepare any overdue documentation or filings.' },
      { step: 3, title: 'Ongoing Administration', desc: 'We maintain records, prepare resolutions, and coordinate compliance on a rolling basis.' },
      { step: 4, title: 'Reporting', desc: 'We keep directors and shareholders informed and flag actions ahead of deadlines.' },
    ],
    faqs: [
      { q: 'Can you take over governance and administration from another provider?', a: 'Yes. We review the existing records, bring everything up to date, and continue the administration seamlessly.' },
      { q: 'Do you prepare board resolutions and corporate documentation?', a: 'Yes. We prepare board resolutions, minutes, and the supporting corporate documentation your entity needs.' },
    ],
    relatedSlugs: ['company-formation', 'bookkeeping-accounting', 'outsourced-support'],
  },

  'bookkeeping-accounting': {
    slug: 'bookkeeping-accounting',
    comingSoon: true,
    title: 'Bookkeeping & Accounting Support',
    shortTitle: 'Bookkeeping & Accounting',
    icon: 'dollar-sign',
    overview: 'Our accounting support helps businesses keep accurate financial records and meet ongoing reporting requirements — day-to-day bookkeeping, bank reconciliations, management reporting, and financial statement preparation support, delivered through modern accounting systems.',
    benefits: [
      { title: 'Accurate Records', desc: 'Clean, up-to-date books give you a reliable financial picture at any time.' },
      { title: 'Reporting on Time', desc: 'Management reports and reconciliations are prepared to a regular schedule.' },
      { title: 'Audit-Ready', desc: 'Well-kept records make financial statement preparation and review far smoother.' },
      { title: 'System Fit', desc: 'We work with your accounting systems and help optimise them as you grow.' },
    ],
    included: [
      'Day-to-day bookkeeping',
      'Bank reconciliations',
      'Management reporting',
      'Financial statement preparation support',
      'Accounting system management and optimisation',
    ],
    process: [
      { step: 1, title: 'Onboarding', desc: 'We set up or connect to your accounting system and agree the reporting cadence.' },
      { step: 2, title: 'Bookkeeping', desc: 'We record transactions and reconcile accounts on an ongoing basis.' },
      { step: 3, title: 'Management Reporting', desc: 'We prepare regular management reports so you can track performance.' },
      { step: 4, title: 'Year-End Support', desc: 'We prepare records to support financial statement preparation and review.' },
    ],
    faqs: [
      { q: 'Can you work with our existing accounting software?', a: 'Yes. We work with commonly used accounting systems and can help manage or optimise your setup.' },
      { q: 'How often will we receive management reports?', a: 'We agree a reporting schedule with you at onboarding — typically monthly, with additional reports on request.' },
    ],
    relatedSlugs: ['company-formation', 'corporate-governance', 'outsourced-support'],
  },

  'outsourced-support': {
    slug: 'outsourced-support',
    comingSoon: true,
    title: 'Outsourced Business Support',
    shortTitle: 'Outsourced Support',
    icon: 'users',
    overview: 'Flexible operational support to help businesses manage day-to-day requirements — administrative assistance, document management, process coordination, and liaison with your legal, tax, and professional advisers — so your team can stay focused on the work that matters.',
    benefits: [
      { title: 'Capacity When You Need It', desc: 'Flexible support that scales with your day-to-day operational demands.' },
      { title: 'Organised Documentation', desc: 'Document management and process coordination keep your operations tidy.' },
      { title: 'Joined-Up Advisers', desc: 'We coordinate with your legal, tax, and professional advisers on your behalf.' },
      { title: 'Focus Retained', desc: 'We handle the administrative load so your team stays on core priorities.' },
    ],
    included: [
      'Administrative assistance',
      'Document management',
      'Process coordination and operational support',
      'Coordination with legal, tax, and professional advisers',
    ],
    process: [
      { step: 1, title: 'Scope', desc: 'We agree which day-to-day tasks and coordination you want supported.' },
      { step: 2, title: 'Set Up', desc: 'We put simple processes and document management in place.' },
      { step: 3, title: 'Ongoing Support', desc: 'We deliver administrative and operational support on a rolling basis.' },
      { step: 4, title: 'Review', desc: 'We check in regularly and adjust the support as your needs change.' },
    ],
    faqs: [
      { q: 'Is the support flexible month to month?', a: 'Yes. We scope the support to your needs and can adjust it as your requirements change.' },
      { q: 'Will you liaise with our other advisers?', a: 'Yes. We coordinate with your legal, tax, and professional advisers so your operations stay joined up.' },
    ],
    relatedSlugs: ['company-formation', 'corporate-governance', 'bookkeeping-accounting'],
  },
};

export const services = {
  'sri-lanka': sriLanka,
  'singapore': singapore,
  'uae':       uae,
  'uk':        uk,
  'hong-kong': hongKong,
  'guernsey':  guernsey,
};

/* ─── GLOBAL service portfolio ─────────────────────
   The canonical 4 service categories SRP offers as a
   group. Each entry maps which regional pages deliver
   it — used on /services (standalone) for the
   "Available in" region chips.                       */
export const globalServices = [
  {
    slug: 'incorporation-governance',
    title: 'Company Incorporation & Governance',
    shortTitle: 'Incorporation & Governance',
    icon: 'file-text',
    bgImage: '/images/services/incorporation-governance.jpg',
    overview: 'Setting up companies and keeping them compliant. We handle company registration, statutory filings, board minutes, annual returns, and ongoing regulatory compliance — tailored to each market\'s regulatory framework.',
    highlights: [
      'Company registration & incorporation documents',
      'Statutory filings & annual returns',
      'Board minutes & resolutions',
      'Director / shareholder changes',
      'Free Zone amendments (UAE) · ACRA filings (SG) · Companies House (UK) · Companies Registry (HK)',
    ],
    regions: [
      { slug: 'sri-lanka', linkSlug: 'company-secretarial' },
      { slug: 'singapore', linkSlug: 'incorporation' },
      { slug: 'uae',       linkSlug: 'incorporation' },
      { slug: 'uk',        linkSlug: 'incorporation' },
      { slug: 'hong-kong', linkSlug: 'incorporation' },
      { slug: 'guernsey',  linkSlug: 'company-formation', comingSoon: true },
    ],
  },
  {
    slug: 'financial-services',
    title: 'Financial Services',
    shortTitle: 'Financial Services',
    icon: 'dollar-sign',
    bgImage: '/images/services/financial-services.jpg',
    overview: 'Full-stack accounting, financial reporting, and tax — from monthly bookkeeping through to annual financial statements, GST / VAT returns, and corporate tax filings. Priced to your transaction volume.',
    highlights: [
      'Bookkeeping tiered to transaction volume',
      'Monthly & annual financial reporting',
      'GST (SG) · VAT (UAE / UK) returns',
      'Corporate tax computation & filing',
      'Audit liaison and tax advisory coordination',
    ],
    regions: [
      { slug: 'sri-lanka', linkSlug: 'financial-services' },
      { slug: 'singapore', linkSlug: 'accounting' },
      { slug: 'uae',       linkSlug: 'accounting' },
      { slug: 'uk',        linkSlug: 'accounting' },
      { slug: 'hong-kong', linkSlug: 'accounting' },
      { slug: 'guernsey',  linkSlug: 'bookkeeping-accounting', comingSoon: true },
    ],
  },
  {
    slug: 'hr-management',
    title: 'Human Resource Management',
    shortTitle: 'HR Management',
    icon: 'users',
    bgImage: '/images/services/hr-management.jpg',
    overview: 'End-to-end HR — recruitment, contracts, payroll, performance reviews, and personal development frameworks. Currently delivered from our Sri Lanka hub, with regional expansion underway.',
    highlights: [
      'Recruitment & onboarding',
      'HR policies & employment contracts',
      'Payroll processing',
      'KPI reviews & development plans',
      'Industrial dispute support',
    ],
    regions: [
      { slug: 'sri-lanka', linkSlug: 'hr-management' },
    ],
  },
  {
    slug: 'research-planning',
    title: 'Research & Business Planning',
    shortTitle: 'Research & Planning',
    icon: 'search',
    bgImage: '/images/services/research-planning.jpg',
    overview: 'Decision-grade business research — feasibility studies, structured business plans, lead generation, forensic evaluations, and bespoke equity research. Currently delivered from our Sri Lanka hub.',
    highlights: [
      'Feasibility studies',
      'Business plan development',
      'Market & competitor research',
      'Forensic evaluations',
      'Equity research reports',
    ],
    regions: [
      { slug: 'sri-lanka', linkSlug: 'research-planning' },
    ],
  },
];

/* Helper: look up a single service, region-aware */
export function getService(regionSlug, serviceSlug) {
  return services[regionSlug]?.[serviceSlug] || null;
}

/* Helper: list all services for a region (as array, ordered) */
export function getRegionServices(regionSlug) {
  const map = services[regionSlug];
  return map ? Object.values(map) : [];
}
