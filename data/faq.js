/* ═══════════════════════════════════════════════════
   SRP International — Client FAQ (single source of truth)

   Source: the "WEBSITE - FAQ" Google Doc
   (owner shehan@srpitl.com, docId 1JHKn9duE-J55ojpZ7tWW0t9GGfjA0jVmd96NlS_Ox2o).
   Synced 2026-06-17. When the Doc changes, update FAQ_TREE to match.

   FAQ_TREE is the SINGLE SOURCE OF TRUTH — it drives all of:
     • the public /faq page (views/faq.ejs),
     • the chatbot's guided triage flow (country → service → question chips), and
     • FAQ_KNOWLEDGE — the text block fed to the AI for free-text questions.
   Update this one file and the website + chatbot stay in sync automatically.

   Hong Kong is offered as a jurisdiction but has no FAQ entries yet, so its
   `categories` is empty — the chatbot routes it straight to the consultation CTA.
   ═══════════════════════════════════════════════════ */

export const FAQ_TREE = [
  {
    country: 'Sri Lanka', flag: '🇱🇰', slug: 'sri-lanka',
    categories: [
      { name: 'Incorporation & Governance', questions: [
        { q: `How long does company incorporation take?`, a: `Sri Lanka incorporation takes 5–7 business days once documents are in order and submitted to the Registrar.` },
        { q: `Do you handle compliance for existing companies?`, a: `Yes — ongoing secretarial and compliance services for new and established companies.` },
        { q: `Can you help with company restructuring?`, a: `Yes — we advise on and manage mergers, acquisitions, and share capital changes.` },
        { q: `What jurisdictions do you cover?`, a: `Sri Lanka, Singapore, Dubai, the UK, and Hong Kong.` },
        { q: `How are my company records stored?`, a: `Records are generally maintained electronically and not stored physically, unless you have signed documents at SRP using wet signatures or provided original physical documents. Where physical documents are received, they are securely maintained at an SRP office.` },
        { q: `What's included in the annual compliance/secretarial retainer?`, a: `Usually maintaining company records, preparing basic resolutions, annual compliance reminders, company secretarial support, and coordinating statutory filings.` },
        { q: `How do I change my company's registered address?`, a: `It usually requires a company resolution, updated forms, approval/filing with the relevant authority, and updates to bank and company records. The effective date is set five working days after filing. If there are outstanding statutory filings, the change cannot complete until all backlog filings are brought up to date, as it is processed in real time.` },
      ]},
      { name: 'Land & Property', questions: [
        { q: `How can I secure land if my company isn't incorporated yet?`, a: `Usually through a reservation agreement, an advance payment agreement, or a nominee/holding arrangement until the company is ready.` },
        { q: `Is it safe to pay a deposit to the seller before my bank account is open?`, a: `It's not recommended. Your company must be incorporated and the bank account opened before making any payments.` },
        { q: `How should I record an advance land payment?`, a: `Usually as an advance payment or prepayment until the land transfer is completed.` },
        { q: `Why can't I convert my advance land payment into director's shares?`, a: `Because the advance was paid for land, not as share capital. Share capital must be properly issued and recorded; otherwise it essentially becomes a sunk cost.` },
        { q: `Can I use a local provider as a trusted fund holder for land?`, a: `Funds should flow from your IIA, through your company accounts, then to the land seller. Other methods aren't recommended, as they may create issues with the payment trail and future repatriation.` },
        { q: `How does Capital Gains Tax affect my land purchase and sale?`, a: `CGT does not usually apply when buying the land. It may apply later if the land is sold at a profit.` },
      ]},
      { name: 'Financial Services', questions: [
        { q: `Can you work with our existing auditors?`, a: `Yes — we work closely with your chosen auditors and tax advisors.` },
        { q: `Do you handle payroll as well?`, a: `Yes — handled through our HR Management service, coordinated with finance.` },
        { q: `How often will I receive financial reports?`, a: `Monthly management accounts, plus custom reports on demand.` },
        { q: `What accounting software do you use?`, a: `Suitable software based on your requirements and business; we can also work with records from common systems such as QuickBooks and Xero.` },
        { q: `Do you file tax returns and provide tax advisory?`, a: `Yes — we file APIT/WHT/VAT/SSCL/SD and all other relevant IRD returns, and we provide tax consultancy.` },
        { q: `What is the VAT registration threshold?`, a: `Currently LKR 60m per annum and LKR 15m per quarter, whichever occurs first. In the near future this will reduce to LKR 36m per annum and LKR 9m per quarter.` },
        { q: `How long must documents be maintained?`, a: `A minimum of five years from the date of each transaction. If you send daily/weekly/monthly reports to us, we can store those on your behalf.` },
      ]},
      { name: 'Research & Business Planning', questions: [
        { q: `What types of feasibility studies do you offer?`, a: `Financial, market, and operational feasibility for new ventures, product launches, and expansion plans.` },
        { q: `Can you help with investor presentations?`, a: `Yes — business plans and research for investor pitches and funding applications.` },
        { q: `How long does a typical research project take?`, a: `Feasibility study: 2–3 weeks. Comprehensive business plan: 3–4 weeks.` },
        { q: `Can you customise a study for bank or investor requirements?`, a: `Yes — scope and presentation can be tailored to banks, investors, shareholders, government institutions, or internal management.` },
        { q: `Do you prepare proposals for bank loan applications?`, a: `Yes — structured proposals with financial forecasts, cash-flow projections, repayment analysis, business information, and proposed use of funds.` },
        { q: `Is my information kept confidential?`, a: `Yes — client information, financial data, and project details are confidential and used only for the agreed purpose.` },
      ]},
      { name: 'HR Management', questions: [
        { q: `Can you handle payroll for companies of any size?`, a: `Yes — from small teams to large organisations, with full accuracy and compliance, across permanent, temporary, part-time, contract, and hourly-paid employees.` },
        { q: `Do you help with employment disputes?`, a: `Yes — we advise on disputes, grievances, and terminations under local labour law.` },
        { q: `Can you recruit staff on our behalf?`, a: `Yes — job descriptions, candidate screening, and onboarding, working closely with your team.` },
        { q: `Do you offer training and development services?`, a: `Yes — personal development plans, KPI frameworks, and coordination with specialist training partners.` },
        { q: `Do you help with EPF/ETF registration and amendments?`, a: `Yes — one-off company EPF registration and employee registrations.` },
      ]},
    ],
  },
  {
    country: 'Singapore', flag: '🇸🇬', slug: 'singapore',
    categories: [
      { name: 'Incorporation', questions: [
        { q: `How long does Singapore incorporation take?`, a: `Most Pte Ltd incorporations are approved within 1–5 business days by ACRA, once KYC, due diligence, onboarding, and incorporation documents are signed and in order. ACRA may occasionally refer an application for additional review, extending the timeline.` },
        { q: `Do I need a local director?`, a: `Yes — at least one director must be ordinarily resident in Singapore (citizen, permanent resident, or eligible pass holder). We can provide nominee director services where needed.` },
        { q: `What is the minimum paid-up capital?`, a: `A minimum of SGD 1, though most operating companies start higher to reflect working capital, licensing, or banking requirements.` },
        { q: `Can foreigners own 100% of a Singapore company?`, a: `Yes — Singapore places no restriction on foreign shareholding; a Pte Ltd can be entirely foreign-owned. The local-resident requirement applies only to the director and company secretary roles, not shareholders.` },
        { q: `Do I need to be physically present to incorporate?`, a: `No — incorporation can be completed entirely remotely. Corporate bank account opening may sometimes require an in-person visit or video verification, depending on the bank.` },
        { q: `Do I need to appoint a company secretary?`, a: `Yes — every Singapore company must appoint a qualified company secretary within 6 months of incorporation, and the secretary must be ordinarily resident in Singapore.` },
      ]},
      { name: 'CoSec & Governance', questions: [
        { q: `What are my ongoing annual compliance obligations?`, a: `File an Annual Return with ACRA (generally within 7 months of financial year-end), hold an AGM or formally dispense with it under the Companies Act, and file a corporate tax return with IRAS. We manage this full cycle.` },
        { q: `Can you take over CoSec from another provider?`, a: `Yes — we audit existing records, bring everything current, and continue seamlessly.` },
        { q: `Do you support EGMs and ad-hoc resolutions?`, a: `Yes — both as add-ons and in bundled packages (EGM Bundle).` },
        { q: `What about share transfers and stamp duty (IRAS)?`, a: `Share transfer forms, agreements, and IRAS e-stamping are covered as add-ons.` },
        { q: `Can you handle striking off the company?`, a: `Yes — available as a one-time add-on.` },
        { q: `What if my company has overdue filings or lapsed compliance?`, a: `We run a compliance health check, identify outstanding filings, and bring the company back into good standing with ACRA before taking over ongoing CoSec.` },
      ]},
      { name: 'Accounting', questions: [
        { q: `How do the bookkeeping tiers work?`, a: `By monthly transaction volume: Tier 1 up to 250, Tier 2 up to 500, Tier 3 up to 1,000 — re-tiered annually.` },
        { q: `Do you handle GST registration?`, a: `Yes. Threshold registration is mandatory when annual turnover exceeds SGD 1 million; voluntary registration is available below the threshold (e.g. to reclaim input GST). We manage GST returns quarterly with IRAS.` },
        { q: `What about corporate tax filings?`, a: `Yes — full corporate tax compliance: ECI (Estimated Chargeable Income), Form C-S (corporate income tax return), and statutory accounts.` },
        { q: `Can I get quarterly financials, not just annual?`, a: `Yes — quarterly and interim financial statements are available as an add-on (full financial position reports and income statements).` },
        { q: `Do you handle statutory audits?`, a: `Yes. If your company meets the audit threshold or an audit is mandatory, we manage the full process or connect you with our audit partners, prepare audited statements, and manage ACRA compliance.` },
        { q: `What happens if I miss a filing deadline?`, a: `Missing deadlines can result in ACRA/IRAS penalties. We maintain a filing calendar and reminders, alert you if a deadline is at risk, and file late if necessary — it's better to file late than not at all.` },
      ]},
    ],
  },
  {
    country: 'Dubai (UAE)', flag: '🇦🇪', slug: 'uae',
    categories: [
      { name: 'Incorporation', questions: [
        { q: `Which Free Zone should I choose?`, a: `It depends on activity, residency needs, and budget (e.g. IFZA, RAKEZ, Ajman Free Zone) — each has strengths; we advise on your use case.` },
        { q: `Can you handle the residence visa as part of setup?`, a: `Yes — residency coordination is part of the CoSec Tier.` },
        { q: `What's the difference between Free Zone and Mainland?`, a: `Free Zone companies offer 100% foreign ownership, fast setup, and visa quotas, but are generally restricted from trading directly in the UAE market without a local distributor or branch. Mainland companies can trade across the UAE and contract directly with government entities.` },
        { q: `Do I need to register for UAE Corporate Tax?`, a: `Yes — Corporate Tax registration with the FTA is mandatory for all UAE companies, including free zone entities, regardless of whether you expect to owe tax. We handle this as part of incorporation.` },
        { q: `How many visas come with my free zone licence?`, a: `Visa allocation depends on the free zone, licence package, and office/flexi-desk size; we confirm your quota once your free zone and package are chosen.` },
      ]},
      { name: 'CoSec & Governance', questions: [
        { q: `What's the difference between Tier 1 and Tier 2?`, a: `Tier 1 is baseline statutory governance; Tier 2 adds residency, trade-licence upgrades, tax/VAT registration, and bank operations support.` },
        { q: `Do you handle bank account opening?`, a: `Tier 2 includes hands-on support; a standalone "Bank Account & Card Services" option is also an add-on. We work closely with WIO Bank and Mashreq Bank.` },
        { q: `How long does opening a UAE business bank account take?`, a: `Anywhere from 3–7 working days to a few weeks, depending on the bank, your activity, documentation, and the KYC/compliance review.` },
        { q: `Do I need proof of a UAE residential address to open a corporate account?`, a: `Banks may, case by case, require one for compliance and correspondence. It need not be in your name — it may be a friend's or relative's address with a confirmation letter stating you reside with them.` },
        { q: `Can I apply for a card payment machine/POS?`, a: `Yes, though requirements vary by bank/provider and depend on your activity, expected volume, and compliance checks. A physical business address may be required; the Free Zone's registered address is virtual and may not be accepted.` },
        { q: `How long must I stay in the UAE to complete my residency visa?`, a: `Long enough to complete the medical test, Emirates ID biometrics, and visa processing — about 7–10 business days (subject to immigration approval).` },
        { q: `Do I need to spend a minimum number of days to keep my residency valid?`, a: `Once you have UAE residency, you must not remain outside the UAE for more than 180 consecutive days, or the visa may become invalid (you'd generally need a re-entry permit before returning).` },
        { q: `How do I add my spouse as a director or shareholder later?`, a: `Usually via a share transfer or company amendment, followed by updating the Free Zone, bank, and company records.` },
      ]},
      { name: 'Accounting', questions: [
        { q: `How do the bookkeeping tiers work?`, a: `Tier 1 up to 250, Tier 2 250–500, Tier 3 500–1,000 transactions; re-tiered annually.` },
        { q: `Do you provide financial statement preparation?`, a: `Yes — Statement of Financial Position (Balance Sheet), Statement of Profit or Loss (Income Statement), Cash Flow Statement, and Notes to Financial Statements.` },
        { q: `Do you provide VAT registration and return filing?`, a: `Yes — full VAT support. VAT registration is mandatory when annual turnover exceeds AED 375,000 (AED 187,500 for voluntary registration).` },
        { q: `What is the current corporate tax rate in the UAE?`, a: `UAE Corporate Income Tax is effective from 1 January 2023: 0% on taxable income up to AED 375,000, and 9% above AED 375,000.` },
        { q: `Do you provide annual audit services?`, a: `We provide audit coordination services and work with qualified auditors, and can support free zone audit requirements — managing the process and ensuring timely audited statements.` },
        { q: `Do you provide tax consultation services?`, a: `We help set up hourly tax consultation with a third-party consultant; let us know to reserve a session and our team will reach out.` },
      ]},
    ],
  },
  {
    country: 'United Kingdom', flag: '🇬🇧', slug: 'uk',
    categories: [
      { name: 'Incorporation', questions: [
        { q: `How long does UK incorporation take?`, a: `A standard private limited company usually takes 2–4 business days for Companies House approval, once KYC, documentation, and incorporation forms are completed and in order.` },
        { q: `Do I need a UK resident director?`, a: `No — UK company law doesn't require directors to be UK residents, but every company must maintain a registered office address in the UK.` },
        { q: `Do you provide a UK registered office address?`, a: `Yes — available as an add-on service at an extra cost.` },
        { q: `Where is SRP UK based?`, a: `International House, 64 Nile Street, London, England N1 7SR · +44 7807 854544.` },
      ]},
      { name: 'CoSec & Governance', questions: [
        { q: `What are my ongoing UK filing obligations?`, a: `An annual confirmation statement and accounts filed with Companies House, plus a Corporation Tax return filed with HMRC.` },
        { q: `Will you support UK confirmation statements?`, a: `Yes — confirmation statements and PSC register maintenance are core.` },
        { q: `Can you handle UK share transfers and stamp duty?`, a: `Yes — share transfer documentation and HMRC stamp duty filings.` },
        { q: `Can you take over UK CoSec from another provider?`, a: `Yes — we handle transitions regularly.` },
      ]},
      { name: 'Accounting', questions: [
        { q: `How do the bookkeeping tiers work?`, a: `Tier 1 up to 250, Tier 2 250–500, Tier 3 500–1,000; re-tiered annually.` },
        { q: `Do you prepare statutory accounts?`, a: `Yes — full statutory accounts (Statement of Financial Position, Profit & Loss, Notes, and Directors' Report where required), filed with Companies House under UK standards (FRS 102 or the micro-entities regime).` },
        { q: `Can I file dormant company accounts?`, a: `Yes. If your company is dormant (no significant accounting transactions), simplified dormant accounts can be filed with Companies House. We advise if you qualify and prepare the filings.` },
        { q: `What is the current Corporation Tax rate?`, a: `19% on small company profits, with reliefs and allowances available.` },
        { q: `Do I need to file a Corporation Tax return?`, a: `Yes — all limited companies must file with HMRC online, even with no profit or expected tax liability.` },
        { q: `What is the VAT registration threshold?`, a: `Registration is mandatory when annual taxable turnover exceeds £90,000; voluntary registration is available below this. Once registered, you account for VAT quarterly and file returns with HMRC.` },
        { q: `Do I need a statutory audit?`, a: `Most small companies are exempt if they meet the small-company thresholds: turnover ≤ £10.2m, balance sheet total ≤ £5.1m, employees ≤ 50.` },
      ]},
    ],
  },
  { country: 'Hong Kong', flag: '🇭🇰', slug: 'hong-kong', categories: [] },
];

/* Serialize the tree into the AI's plain-text knowledge base (free-text path). */
function buildFaqKnowledge() {
  const out = ['=== SRP INTERNATIONAL — CLIENT FAQ (PRIMARY KNOWLEDGE BASE) ===',
    'Answer client inquiries from this FAQ first. Match the client\'s market when known.', ''];
  for (const c of FAQ_TREE) {
    if (!c.categories.length) continue;
    out.push(`## ${c.country.toUpperCase()}`);
    for (const cat of c.categories) {
      out.push(`### ${cat.name}`);
      for (const item of cat.questions) out.push(`- ${item.q} — ${item.a}`);
    }
    out.push('');
  }
  return out.join('\n');
}

export const FAQ_KNOWLEDGE = buildFaqKnowledge();

/* Lightweight tree for the client (questions + answers, no server internals). */
export function faqTreeForClient() {
  return FAQ_TREE.map(c => ({
    country: c.country, flag: c.flag, slug: c.slug,
    categories: c.categories.map(cat => ({
      name: cat.name,
      questions: cat.questions.map(q => ({ q: q.q, a: q.a })),
    })),
  }));
}
