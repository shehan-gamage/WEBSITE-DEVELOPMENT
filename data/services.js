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
    overview: 'SRP International provides end-to-end company incorporation and governance services, ensuring your business is correctly structured, registered, and compliant with all local regulations. From initial incorporation through to ongoing secretarial support, we handle every aspect of corporate governance so you can focus on growing your business.',
    benefits: [
      { title: 'Full Legal Compliance', desc: 'Ensure your company meets all local and international regulatory requirements at every stage.' },
      { title: 'Expert Guidance',       desc: 'Work with experienced corporate secretaries who understand complex regulatory frameworks.' },
      { title: 'Time Savings',          desc: 'Focus on your business while we handle the paperwork, filings, and regulatory deadlines.' },
      { title: 'Risk Mitigation',       desc: 'Avoid penalties and legal issues with proactive compliance monitoring and advisory.' },
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
      { step: 1, title: 'Initial Consultation', desc: 'We understand your business structure needs and regulatory requirements.' },
      { step: 2, title: 'Structure Planning',   desc: 'We recommend the optimal corporate structure for your objectives.' },
      { step: 3, title: 'Documentation',        desc: 'We prepare all necessary incorporation and compliance documents.' },
      { step: 4, title: 'Registration',         desc: 'We handle the full registration process with relevant authorities.' },
      { step: 5, title: 'Ongoing Support',      desc: 'We provide continued secretarial and compliance support.' },
    ],
    faqs: [
      { q: 'How long does company incorporation typically take?',  a: 'The timeline varies by jurisdiction, but in Sri Lanka, incorporation typically takes 3-5 business days once all documents are prepared and submitted.' },
      { q: 'Do you handle compliance for existing companies?',     a: 'Yes. We provide ongoing secretarial and compliance services for both newly incorporated and established companies.' },
      { q: 'Can you help with company restructuring?',             a: 'Absolutely. We advise on and manage corporate restructuring, including mergers, acquisitions, and changes to share capital.' },
      { q: 'What jurisdictions do you cover?',                     a: 'We primarily operate in Sri Lanka, Singapore, Dubai, and the United Kingdom, and can coordinate with partners in other jurisdictions.' },
    ],
    relatedSlugs: ['financial-services', 'research-planning', 'hr-management'],
  },

  'financial-services': {
    slug: 'financial-services',
    title: 'Financial Services',
    shortTitle: 'Financial Services',
    icon: 'dollar-sign',
    overview: 'SRP International delivers comprehensive financial management services using the latest online financial systems. From monthly management accounting to annual financial statement preparation, we provide the financial clarity and control your business needs. We work closely with independent auditors and expert tax advisors to ensure the best possible financial guidance.',
    benefits: [
      { title: 'Real-Time Insight',    desc: 'Access up-to-date financial data through modern online accounting systems.' },
      { title: 'Expert Tax Advisory',  desc: 'Work with our network of tax specialists to optimise your tax position.' },
      { title: 'Audit Readiness',      desc: 'Maintain clean, organised financial records that are always audit-ready.' },
      { title: 'Cost Control',         desc: 'Better financial visibility leads to smarter spending and improved cash management.' },
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
      { step: 1, title: 'Assessment',         desc: 'We review your current financial processes and identify improvements.' },
      { step: 2, title: 'System Setup',       desc: 'We configure online accounting systems tailored to your business.' },
      { step: 3, title: 'Data Migration',     desc: 'We safely transfer your existing financial data to the new system.' },
      { step: 4, title: 'Ongoing Management', desc: 'We handle day-to-day accounting, reporting, and financial management.' },
      { step: 5, title: 'Review & Advisory',  desc: 'Regular financial reviews with insights and recommendations.' },
    ],
    faqs: [
      { q: 'What accounting software do you use?',          a: 'We use modern cloud-based accounting platforms that provide real-time access to your financial data from anywhere.' },
      { q: 'Can you work with our existing auditors?',      a: 'Yes. We collaborate closely with your chosen independent auditors and tax advisors to ensure seamless financial management.' },
      { q: 'Do you handle payroll as well?',                a: 'Payroll is managed through our Human Resource Management service. We coordinate closely between both services for integrated financial management.' },
      { q: 'How often will I receive financial reports?',   a: 'We provide monthly management accounts and can deliver custom reports on demand depending on your business needs.' },
    ],
    relatedSlugs: ['company-secretarial', 'research-planning', 'hr-management'],
  },

  'research-planning': {
    slug: 'research-planning',
    title: 'Research & Business Planning',
    shortTitle: 'Research & Planning',
    icon: 'search',
    overview: 'SRP International helps you gain valuable insight into new ventures and effectively track existing investments. We deliver thorough feasibility studies, structured business plans, lead generation, forensic evaluations, and bespoke equity research reports tailored to your specific portfolio and business objectives.',
    benefits: [
      { title: 'Informed Decisions',  desc: 'Make confident business decisions backed by thorough research and analysis.' },
      { title: 'Market Intelligence', desc: 'Understand your market landscape, competitors, and growth opportunities.' },
      { title: 'Investment Clarity',  desc: 'Get clear, unbiased evaluations of potential and existing investments.' },
      { title: 'Strategic Direction', desc: 'Develop structured business plans that align resources with objectives.' },
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
      { step: 1, title: 'Brief & Scope',  desc: 'We define the research objectives, scope, and deliverables.' },
      { step: 2, title: 'Data Collection', desc: 'We gather primary and secondary data from reliable sources.' },
      { step: 3, title: 'Analysis',        desc: 'We analyse the data using proven research methodologies.' },
      { step: 4, title: 'Report Delivery', desc: 'We deliver a comprehensive report with actionable recommendations.' },
      { step: 5, title: 'Follow-Up',       desc: 'We support implementation and provide ongoing research as needed.' },
    ],
    faqs: [
      { q: 'What types of feasibility studies do you offer?', a: 'We cover technical, financial, market, and operational feasibility for new business ventures, product launches, and expansion plans.' },
      { q: 'Can you help with investor presentations?',       a: 'Yes. We develop structured business plans and supporting research that can be used for investor pitches and funding applications.' },
      { q: 'Do you provide ongoing market monitoring?',       a: 'Yes. We offer ongoing market intelligence and portfolio tracking services tailored to your investment strategy.' },
      { q: 'How long does a typical research project take?',  a: 'Timelines vary based on scope. A standard feasibility study typically takes 2-4 weeks, while comprehensive business plans may take 4-6 weeks.' },
    ],
    relatedSlugs: ['company-secretarial', 'financial-services', 'hr-management'],
  },

  'hr-management': {
    slug: 'hr-management',
    title: 'Human Resource Management',
    shortTitle: 'HR Management',
    icon: 'users',
    overview: 'SRP International helps you handle your staff effectively with comprehensive HR support. From recruitment and documentation to performance reviews and payroll, we assist with every aspect of human resource management, ensuring your team is well-managed, motivated, and compliant with employment regulations.',
    benefits: [
      { title: 'Compliance Assurance',    desc: 'Stay compliant with employment laws, contracts, and regulatory requirements.' },
      { title: 'Talent Acquisition',      desc: 'Find and recruit the right people with our structured recruitment support.' },
      { title: 'Team Development',        desc: 'Implement KPI frameworks and personal development plans for your team.' },
      { title: 'Operational Efficiency',  desc: 'Streamline payroll, leave management, and HR administration.' },
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
      { step: 1, title: 'HR Audit',           desc: 'We review your current HR processes, policies, and compliance status.' },
      { step: 2, title: 'Policy Setup',       desc: 'We develop or update HR policies, contracts, and documentation.' },
      { step: 3, title: 'System Integration', desc: 'We set up payroll and HR management processes.' },
      { step: 4, title: 'Ongoing Management', desc: 'We handle day-to-day HR operations including payroll and recruitment.' },
      { step: 5, title: 'Reviews & Growth',   desc: 'We conduct regular performance reviews and support team development.' },
    ],
    faqs: [
      { q: 'Can you handle payroll for companies of any size?', a: 'Yes. We manage payroll for businesses ranging from small teams to large organisations, ensuring accuracy and compliance.' },
      { q: 'Do you help with employment disputes?',             a: 'Yes. We provide support and advisory for handling industrial disputes, grievances, and employment terminations in compliance with local labour laws.' },
      { q: 'Can you recruit staff on our behalf?',              a: 'We support the recruitment process including job descriptions, candidate screening, and onboarding, working closely with your team to find the right fit.' },
      { q: 'Do you offer training and development services?',   a: 'We develop personal development plans and KPI frameworks. For specialised training, we coordinate with training partners to meet your team\'s needs.' },
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
    overview: 'End-to-end Singapore company registration — incorporation documents, ACRA approvals, and compliance setup. We get your Singapore entity up, registered, and ready to operate while you focus on building the business.',
    benefits: [
      { title: 'ACRA-Ready Setup',   desc: 'All filings and documentation prepared to ACRA standards from day one.' },
      { title: 'Fast Turnaround',    desc: 'Most Singapore incorporations complete within a few business days.' },
      { title: 'Single Point Of Contact', desc: 'One coordinator across registration, banking, and compliance setup.' },
      { title: 'Group Backing',      desc: 'Backed by SRP\'s wider regional group — incorporation that connects to the rest of your operation.' },
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
      { step: 1, title: 'Scoping',        desc: 'We confirm shareholder structure, share capital, and activity scope.' },
      { step: 2, title: 'Documentation',  desc: 'We prepare the constitution, resolutions, and ACRA filings.' },
      { step: 3, title: 'ACRA Filing',    desc: 'We file with ACRA and obtain the UEN.' },
      { step: 4, title: 'Bank Account',   desc: 'We coordinate the corporate bank account opening.' },
      { step: 5, title: 'Handover',       desc: 'You receive the full incorporation pack, ready to operate.' },
    ],
    faqs: [
      { q: 'How long does Singapore incorporation take?',          a: 'Most Singapore Pte Ltd incorporations complete within 1-3 business days once all KYC and documentation are in order.' },
      { q: 'Do I need a local director?',                          a: 'Yes — Singapore requires at least one director who is ordinarily resident in Singapore. We can introduce nominee director services where needed.' },
      { q: 'What is the minimum paid-up capital?',                 a: 'Singapore allows a minimum paid-up capital of SGD 1, though most operating companies start at a higher number based on business needs.' },
      { q: 'Will you also handle ongoing compliance after setup?', a: 'Yes — our CoSec & Governance service picks up immediately after incorporation. The two are designed to flow together.' },
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
    overview: 'Ongoing ACRA-aligned corporate governance for Singapore companies — statutory filings, meeting minutes, statutory records, annual returns, AGM documentation, and governance support across the corporate calendar.',
    benefits: [
      { title: 'ACRA Compliance',   desc: 'Stay on the right side of ACRA with timely filings and clean statutory records.' },
      { title: 'Calendar Coverage', desc: 'AGMs, annual returns, and board cycles managed end-to-end.' },
      { title: 'Audit-Ready',       desc: 'Statutory records maintained to a standard your auditors will love.' },
      { title: 'Director Support',  desc: 'Resolutions, share transactions, and director changes handled cleanly.' },
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
      { step: 1, title: 'Onboarding',          desc: 'We review your statutory records and bring them current.' },
      { step: 2, title: 'Calendar Setup',      desc: 'We map ACRA deadlines, AGM dates, and filing windows.' },
      { step: 3, title: 'Ongoing Filings',     desc: 'We prepare and submit filings as they fall due.' },
      { step: 4, title: 'AGM Cycle',           desc: 'We coordinate the AGM documentation and minutes annually.' },
      { step: 5, title: 'Advisory & Updates',  desc: 'We flag regulatory changes that affect your obligations.' },
    ],
    faqs: [
      { q: 'Can you take over CoSec from another provider?',     a: 'Yes — we handle transitions regularly. We audit the existing records, bring everything current, and continue seamlessly.' },
      { q: 'Do you support EGMs and ad-hoc resolutions?',        a: 'Yes — both as add-ons and as part of bundled packages. See pricing for the EGM Bundle structure.' },
      { q: 'What about share transfers and stamp duty (IRAS)?',  a: 'Share transfer forms, share agreements, and IRAS e-stamping are all covered as add-ons.' },
      { q: 'Can you handle company striking-off?',               a: 'Yes — striking-off support is offered as a one-time add-on service.' },
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
    overview: 'Full-stack Singapore accounting — bookkeeping, annual financial reporting, GST returns, and corporate tax return support. Tiered to your transaction volume, with optional quarterly financials and tax computations.',
    benefits: [
      { title: 'Tier-Right Pricing', desc: 'Pricing scales with your transaction volume — no overpaying for what you don\'t use.' },
      { title: 'GST Handled',        desc: 'Quarterly GST computation and submission as an optional add-on.' },
      { title: 'Corporate Tax',      desc: 'Annual corporate tax computation and ECI/Form C-S/Form C support.' },
      { title: 'Audit Liaison',      desc: 'Clean books, ready for your auditor, every year.' },
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
      { step: 1, title: 'Setup',                desc: 'We configure your books on a modern cloud accounting platform.' },
      { step: 2, title: 'Monthly Bookkeeping',  desc: 'We post transactions and reconcile accounts on a monthly cycle.' },
      { step: 3, title: 'Quarterly Reviews',    desc: 'We deliver interim financials and prepare GST returns where applicable.' },
      { step: 4, title: 'Annual Reporting',     desc: 'We produce the year-end financial statements and tax computations.' },
      { step: 5, title: 'Audit Support',        desc: 'We liaise with your auditors and respond to IRAS queries.' },
    ],
    faqs: [
      { q: 'How do the bookkeeping tiers work?',                a: 'Tiers are based on monthly transaction volume — Tier 1 up to 250, Tier 2 between 250 and 500, Tier 3 between 500 and 1,000. We re-tier annually if your volume shifts.' },
      { q: 'Do you handle GST registration?',                   a: 'Yes — we register for GST when your company crosses the threshold or elects voluntary registration, and we then handle the quarterly returns.' },
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
    overview: 'Free Zone company registration in the UAE — documentation, regulatory approvals, and compliance setup. We take you from initial scoping through licence issuance and bank account, ready to operate.',
    benefits: [
      { title: 'Free Zone Expertise', desc: 'Deep experience with IFZA, DDP, and other major UAE Free Zones.' },
      { title: 'End-to-End Setup',    desc: 'Documentation, approvals, bank account, residency — all coordinated under one partner.' },
      { title: 'Residency Support',   desc: 'Visa and residency requirements supported as part of the incorporation pathway.' },
      { title: 'Operational Backing', desc: 'Backed by SRP\'s wider group — your UAE entity connects cleanly to the rest of your operation.' },
    ],
    included: [
      'Free Zone company registration',
      'Incorporation documentation',
      'Regulatory approvals and submissions',
      'Compliance requirement setup',
      'Trade licence coordination',
      'Corporate bank account introduction',
      'Initial visa and residency pathway setup',
      'Free Zone authority liaison',
    ],
    process: [
      { step: 1, title: 'Scoping',        desc: 'We confirm Free Zone fit, ownership structure, and licensed activities.' },
      { step: 2, title: 'Documentation',  desc: 'We prepare incorporation paperwork and KYC.' },
      { step: 3, title: 'Approvals',      desc: 'We submit to the Free Zone authority and secure approvals.' },
      { step: 4, title: 'Licence & Bank', desc: 'Trade licence issued; bank account opened.' },
      { step: 5, title: 'Handover',       desc: 'Full incorporation pack delivered, residency pathway begun.' },
    ],
    faqs: [
      { q: 'Which Free Zone should I choose?',                       a: 'Choice depends on activity, residency needs, and budget. We advise based on your specific use case — IFZA, DDP, JAFZA, and others have different strengths.' },
      { q: 'Can you handle the residence visa as part of setup?',    a: 'Yes — residency coordination is part of CoSec Tier 2 and is available as add-ons under incorporation. We handle Trade License upgrades for residence, residence assistance, and re-entry permits.' },
      { q: 'Is incorporation assistance really free of charge?',      a: 'Incorporation Assistance is offered at no charge when bundled with our governance and accounting services. Standalone pricing carries a premium.' },
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
    overview: 'Ongoing UAE corporate governance — statutory filings, meeting minutes, regulatory compliance, Free Zone amendments, and residency coordination. Tier 1 covers the baseline; Tier 2 extends to residency, trade licence upgrades, and bank account operations support.',
    benefits: [
      { title: 'Free Zone Aligned',   desc: 'Filings and amendments aligned to your specific Free Zone authority\'s requirements.' },
      { title: 'Residency Coordination', desc: 'Visa, residence, and re-entry pathways managed alongside corporate compliance.' },
      { title: 'Two-Tier Model',     desc: 'Tier 1 baseline governance, Tier 2 hands-on residency + trade licence support.' },
      { title: 'Bank Operations Help', desc: 'Tier 2 includes hands-on support for corporate bank account operations.' },
    ],
    included: [
      'Statutory filings',
      'Meeting minutes',
      'Regulatory compliance monitoring',
      'Free Zone amendments coordination',
      'Residency coordination',
      'Tax and VAT registration (Tier 2)',
      'Trade licence upgrades (Tier 2)',
      'Bank account operations support (Tier 2)',
    ],
    process: [
      { step: 1, title: 'Onboarding',         desc: 'We review your Free Zone records and bring them current.' },
      { step: 2, title: 'Tier Selection',     desc: 'Tier 1 (baseline) or Tier 2 (extended) — chosen to fit your activity.' },
      { step: 3, title: 'Calendar Setup',     desc: 'We map filing windows, licence renewals, and residency dates.' },
      { step: 4, title: 'Ongoing Compliance', desc: 'We file, amend, and coordinate as obligations arise.' },
      { step: 5, title: 'Annual Review',      desc: 'We confirm tier fit annually as your business evolves.' },
    ],
    faqs: [
      { q: 'What\'s the difference between Tier 1 and Tier 2?',       a: 'Tier 1 is baseline statutory governance — filings, minutes, compliance. Tier 2 adds residency requirements, trade licence upgrades, tax/VAT registration, and hands-on bank operations support.' },
      { q: 'Do you handle bank account operations day-to-day?',       a: 'Tier 2 includes hands-on support for corporate bank account operations as needed. Standalone "Bank Account & Card Services" is also available as an add-on.' },
      { q: 'Are residency permits charged on top?',                   a: 'Tier 2 covers residency coordination. Specific items like "Residence and Assistance" and "Re-entry Permits" are available as one-time add-ons.' },
      { q: 'What about dividend resolutions and trade licence changes?', a: 'Dividend resolutions, trade licence upgrades, and similar one-time items are offered as add-ons. See pricing detail.' },
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
    overview: 'Full-stack UAE accounting — bookkeeping, annual financial reporting, VAT returns, and corporate tax return support. Tiered to your transaction volume, with quarterly VAT and annual tax filings handled cleanly.',
    benefits: [
      { title: 'Tier-Right Pricing',  desc: 'Pricing scales with your transaction volume.' },
      { title: 'VAT Handled',         desc: 'Quarterly VAT computation and return submission as an optional add-on.' },
      { title: 'Corporate Tax',       desc: 'Annual corporate tax computation and submission supported.' },
      { title: 'Audit-Ready Books',   desc: 'Clean records, ready for audit or FTA review.' },
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
      { step: 1, title: 'Setup',                desc: 'We configure your books on a cloud accounting platform.' },
      { step: 2, title: 'Monthly Bookkeeping',  desc: 'Transactions posted and reconciled monthly.' },
      { step: 3, title: 'Quarterly VAT',        desc: 'VAT computation and submission to the FTA.' },
      { step: 4, title: 'Annual Reporting',     desc: 'Year-end financial statements and corporate tax computation.' },
      { step: 5, title: 'Audit Support',        desc: 'Liaison with auditors and FTA queries handled.' },
    ],
    faqs: [
      { q: 'How do the bookkeeping tiers work?',          a: 'Tier 1 up to 250 transactions, Tier 2 between 250 and 500, Tier 3 between 500 and 1,000. Re-tiered annually based on volume.' },
      { q: 'Do you handle VAT registration and de-registration?', a: 'Yes — VAT registration is part of CoSec Tier 2. Ongoing quarterly returns are available as an accounting add-on.' },
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
    overview: 'UK company incorporation services — Companies House registration, governance setup, and ongoing compliance. Delivered out of our London office at 64 Nile Street.',
    benefits: [
      { title: 'Companies House Ready', desc: 'Registration and post-incorporation filings handled to Companies House standards.' },
      { title: 'UK Governance Setup',   desc: 'Constitution, resolutions, and PSC register prepared from day one.' },
      { title: 'Group Continuity',      desc: 'Same SRP coordination model your other regional entities already use.' },
      { title: 'London-Based Team',     desc: 'Local director and account team supporting your UK operations on the ground.' },
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
      { step: 1, title: 'Scoping',       desc: 'We confirm ownership, share capital, and SIC codes.' },
      { step: 2, title: 'Documentation', desc: 'We prepare the constitution and Companies House filings.' },
      { step: 3, title: 'Filing',        desc: 'We file with Companies House and obtain the company number.' },
      { step: 4, title: 'Bank Account',  desc: 'We coordinate the corporate banking introduction.' },
      { step: 5, title: 'Handover',      desc: 'You receive the full incorporation pack.' },
    ],
    faqs: [
      { q: 'Where is SRP UK based?',                       a: 'International House, 64 Nile Street, London, England N1 7SR. Call us on +44 7485 480474.' },
      { q: 'How long does UK incorporation take?',         a: 'A standard private limited company incorporation through Companies House typically completes within 1–2 business days once all KYC and documentation are in order.' },
      { q: 'Will UK pricing mirror Singapore and the UAE?', a: 'Our UK service structure follows the same three-pillar model. UK-specific fee bands apply — request a scoping conversation for a tailored quote.' },
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
      { title: 'PSC Maintained',          desc: 'People with Significant Control register kept current.' },
      { title: 'Board Cycle Coverage',    desc: 'Annual board cycle and minutes managed end-to-end.' },
      { title: 'Group Backing',           desc: 'Coordinated with your other regional SRP services.' },
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
      { step: 1, title: 'Onboarding',         desc: 'We review your existing UK records and bring them current.' },
      { step: 2, title: 'Calendar Setup',     desc: 'We map confirmation statement and accounts filing deadlines.' },
      { step: 3, title: 'Ongoing Filings',    desc: 'We file as obligations fall due.' },
      { step: 4, title: 'Director Changes',   desc: 'Appointments, resignations, and PSC updates managed cleanly.' },
      { step: 5, title: 'Advisory & Updates', desc: 'We flag regulatory changes affecting your obligations.' },
    ],
    faqs: [
      { q: 'Will you support UK confirmation statements?',    a: 'Yes — confirmation statements and PSC register maintenance are core to the UK CoSec service.' },
      { q: 'Can you handle UK share transfers and stamp duty?', a: 'Yes — share transfer documentation and HMRC stamp duty filings are part of the service.' },
      { q: 'Can you take over UK CoSec from another provider?', a: 'Yes — we handle transitions regularly. We audit the existing records, bring everything current, and continue seamlessly.' },
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
    overview: 'Full-stack UK accounting — bookkeeping, statutory accounts, VAT returns, and Corporation Tax (CT600) support. Tiered to transaction volume.',
    benefits: [
      { title: 'FRS-Aligned',         desc: 'Statutory accounts prepared to FRS 102 / FRS 105 standards as applicable.' },
      { title: 'VAT Handled',         desc: 'Quarterly VAT returns under Making Tax Digital.' },
      { title: 'CT600 Support',       desc: 'Annual Corporation Tax return preparation and submission to HMRC.' },
      { title: 'Audit-Ready',         desc: 'Books prepared for statutory audit where applicable.' },
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
      { step: 1, title: 'Setup',                desc: 'We configure your books on a UK-friendly cloud accounting platform.' },
      { step: 2, title: 'Monthly Bookkeeping',  desc: 'Transactions posted and reconciled monthly.' },
      { step: 3, title: 'Quarterly VAT',        desc: 'VAT returns submitted under MTD.' },
      { step: 4, title: 'Annual Accounts',      desc: 'Statutory accounts and CT600 prepared and filed.' },
      { step: 5, title: 'Audit Support',        desc: 'Auditor liaison for companies above audit thresholds.' },
    ],
    faqs: [
      { q: 'How do the bookkeeping tiers work?',         a: 'Tiered to monthly transaction volume — Tier 1 up to 250, Tier 2 between 250 and 500, Tier 3 between 500 and 1,000. Re-tiered annually based on volume.' },
      { q: 'Will UK pricing be tiered like SG and UAE?', a: 'Yes — the same three-tier bookkeeping framework applies, with UK-specific fee bands. Request a scoping conversation for a tailored quote.' },
      { q: 'Will you handle Companies House filings?',   a: 'Yes — annual accounts and confirmation statement filings to Companies House are part of the service.' },
      { q: 'Who leads SRP UK?',                          a: 'Jonathan Kitcat is Managing Director, SRP International United Kingdom.' },
    ],
    pricing: null,
    relatedSlugs: ['incorporation', 'governance'],
  },
};

/* ─── Export the unified catalog keyed by region slug ─── */
export const services = {
  'sri-lanka': sriLanka,
  'singapore': singapore,
  'uae':       uae,
  'uk':        uk,
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
    overview: 'Setting up companies and keeping them compliant. We handle company registration, statutory filings, board minutes, annual returns, and ongoing regulatory compliance — calibrated to each market\'s regulatory framework.',
    highlights: [
      'Company registration & incorporation documents',
      'Statutory filings & annual returns',
      'Board minutes & resolutions',
      'Director / shareholder changes',
      'Free Zone amendments (UAE) · ACRA filings (SG) · Companies House (UK)',
    ],
    regions: [
      { slug: 'sri-lanka', linkSlug: 'company-secretarial' },
      { slug: 'singapore', linkSlug: 'incorporation' },
      { slug: 'uae',       linkSlug: 'incorporation' },
      { slug: 'uk',        linkSlug: 'incorporation' },
    ],
  },
  {
    slug: 'financial-services',
    title: 'Financial Services',
    shortTitle: 'Financial Services',
    icon: 'dollar-sign',
    bgImage: '/images/services/financial-services.jpg',
    overview: 'Full-stack accounting, financial reporting, and tax — from monthly bookkeeping through to annual financial statements, GST / VAT returns, and corporate tax filings. Tiered to your transaction volume.',
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
    ],
  },
  {
    slug: 'hr-management',
    title: 'Human Resource Management',
    shortTitle: 'HR Management',
    icon: 'users',
    bgImage: '/images/services/hr-management.jpg',
    overview: 'End-to-end HR — recruitment, contracts, payroll, performance reviews, and personal development frameworks. Currently delivered out of our Sri Lanka hub; regional expansion underway.',
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
    overview: 'Decision-grade business research — feasibility studies, structured business plans, lead generation, forensic evaluations, and bespoke equity research. Currently delivered out of our Sri Lanka hub.',
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
