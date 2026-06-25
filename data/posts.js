/* ═══════════════════════════════════════════════════
   SRP International — Insights (blog) content
   Single source of truth for the /blog index and the
   /blog/:slug article pages. Add new articles to the
   `posts` array; categories are referenced by slug.
   Body is a block list so article pages stay clean:
     { p:  '…' }   paragraph
     { h2: '…' }   section heading
     { list: [] }  bullet list
   ═══════════════════════════════════════════════════ */

export const categories = [
  { slug: 'tax-accounting',     name: 'Tax & Accounting' },
  { slug: 'incorporation',      name: 'Incorporation & Governance' },
  { slug: 'corporate-services', name: 'Corporate Services' },
  { slug: 'research',           name: 'Research & Insights' },
  { slug: 'hr',                 name: 'HR & People' },
  { slug: 'market-updates',     name: 'Market Updates' },
  { slug: 'news',               name: 'Company News' },
];

/* Authors map to real SRP leadership so bylines and avatars are genuine. */
const A = {
  greg:    { name: 'Greg Brutus',           role: 'Managing Director — Hong Kong',      avatar: '/images/team/Greg.jpg' },
  charles: { name: 'Charles Harbottle',     role: 'Managing Director — Singapore',      avatar: '/images/team/Charles.jpg' },
  aaron:   { name: 'Aaron Russell-Davison', role: 'Managing Director',                  avatar: '/images/team/Aaron.jpg' },
  arkam:   { name: 'Arkam Aroos',           role: 'Chief Financial Officer',            avatar: '/images/team/Arkam.jpg' },
  madushini:{ name: 'Madushini Fernando',   role: 'Director',                           avatar: '/images/team/Madushini.jpg' },
  shehan:  { name: 'Shehan Gamage',         role: 'Chief Operating Officer',            avatar: '/images/team/Shehan.jpg' },
  /* Article authors carry a short `role` (shown after the name in the byline)
     and a `department` (shown on the meta line). See views/blog-post.ejs. */
  praneeth:{ name: 'Praneeth Ashan',        role: 'Accountant',        department: 'Financial Services',                 avatar: '/images/team/praneeth.jpg' },
  hamdhan: { name: 'Hamdhan Nabeel',        role: 'Company Secretary', department: 'Company Incorporation & Governance', avatar: '/images/team/hamdhan.jpg' },
  shanika: { name: 'Shanika Fernando',      role: 'Head of Research',  department: 'Research',                           avatar: '/images/team/shanika.jpg' },
  ramesh:  { name: 'Ramesh Kumarage',       role: 'Head of HR Services', department: 'Human Resources',                  avatar: '/images/team/ramesh.jpg' },
  azmar:   { name: 'Mohamed Azmar Huzair',  role: 'Head of International Accounting', department: 'Corporate Compliance / Tax & Finance', avatar: '/images/team/azmar.jpg' },
  /* Madushini also appears in leadership above as Director; this entry carries her
     article byline (Company Secretary, Corporate Services) for the UBO piece. */
  madushiniCs:{ name: 'Madushini Fernando',  role: 'Company Secretary', department: 'Corporate Services', avatar: '/images/team/Madushini.jpg' },
};

export const posts = [
  {
    slug: 'sri-lanka-ubo-compliance-2026',
    title: 'Who Really Owns the Company? Understanding UBO Compliance in Sri Lanka',
    excerpt: 'Sri Lanka’s Companies (Amendment) Act No. 12 of 2025 and the Beneficial Ownership Regulations — effective 30 March 2026 — require companies to look past the share register and identify the natural persons who ultimately own or control them, keep verified records, and report to the Registrar. UBO compliance is now an ongoing governance process, not a one-off filing.',
    category: 'corporate-services',
    author: A.madushiniCs,
    date: '2026-06-24',
    image: '/images/services/incorporation-governance.jpg',
    featured: false,
    popular: true,
    body: [
      { p: 'A company’s share register identifies its legal shareholders — but it does not always reveal the individual who ultimately benefits from, or controls, the business. Behind a registered corporate shareholder there may be another company, a nominee, a trust, or a chain of entities, and somewhere at the end of that chain sits a real person.' },
      { p: 'Sri Lanka’s Companies (Amendment) Act, No. 12 of 2025 and the Companies (Beneficial Ownership) Regulations, No. 01 of 2026 — effective from 30 March 2026 — now require companies to look beyond the registered name and identify the natural persons behind the ownership and control structure. In essence, the law asks companies to identify the people who ultimately own or control them, maintain verified records, and report those details to the Registrar of Companies. The key shift in mindset is this: UBO compliance is an ongoing governance process, not a one-off filing.' },

      { h2: 'Who is an ultimate beneficial owner?' },
      { p: 'A beneficial owner is a natural person who ultimately owns or controls 10% or more of a company — directly or indirectly — through shares, voting rights, or another ownership interest.' },
      { p: 'The definition deliberately reaches further than shareholding alone. It also captures a person who exercises effective control by other means, such as influencing strategic decisions or the appointment or removal of directors. Companies must therefore trace through corporate shareholders, nominees, trusts, and layered ownership structures until the relevant natural person is identified. Ownership on paper and control in practice are not always the same thing — and the law is concerned with both.' },

      { h2: 'What companies must do' },
      { p: 'The obligations are practical and ongoing. Companies must:' },
      { list: [
        'Identify and verify their beneficial owners;',
        'Maintain a beneficial ownership register; and',
        'Appoint a natural person resident in Sri Lanka as the authorised person responsible for safeguarding the records.',
      ] },
      { p: 'Prescribed BO filings are required at several trigger points: at incorporation, after an issue or transfer of shares, with the annual return, and when the authorised person or the location of the register changes. The timelines matter — changes to beneficial-owner information must generally be notified within 14 working days, while filings following an issue or transfer of shares are required within 20 working days.' },

      { h2: 'Why accurate UBO records matter' },
      { p: 'The real challenge is rarely completing the form. It is establishing the true ownership and control position in the first place.' },
      { p: 'To do that reliably, directors and company secretaries should obtain reliable identification documents, prepare an ownership chart, and record the precise basis on which the 10% threshold or the effective-control test is met — then update those records whenever ownership or control changes. The stakes for getting it wrong are significant: inaccurate, incomplete, or misleading information may expose both the company and its responsible officers to serious statutory penalties. And because certain beneficial-ownership details may be publicly accessible, errors are not only a compliance risk but a reputational one.' },

      { h2: 'The practical takeaway' },
      { p: 'Companies should conduct a UBO review now, rather than waiting for the next filing trigger:' },
      { list: [
        'Identify every natural person who meets the ownership or control test.',
        'Collect and verify the prescribed information.',
        'Appoint the authorised person.',
        'Complete the applicable initial filing.',
        'Introduce a standing process requiring shareholders to notify the company of relevant changes.',
      ] },
      { p: 'From here on, UBO checks should form part of every incorporation, share issue, share transfer, restructuring, and annual-return review — built into the company’s routine governance rather than treated as a separate compliance chore.' },

      { h2: 'References and source notes' },
      { list: [
        'Companies (Amendment) Act, No. 12 of 2025.',
        'Gazette Extraordinary No. 2480/47 dated 21 March 2026 (commencement order).',
        'Companies (Beneficial Ownership) Regulations, No. 01 of 2026 — Gazette Extraordinary No. 2480/48 dated 21 March 2026.',
        'Department of the Registrar of Companies — Beneficial Ownership System and user guides.',
      ] },
      { p: 'This article is intended as general guidance for company directors, shareholders, company secretaries, and compliance teams in Sri Lanka. It is not a substitute for advice on a specific matter.' },
    ],
  },
  {
    slug: 'sri-lanka-cash-payment-rules-2026',
    title: 'Updated Cash Payment Rules in Sri Lanka: Why Rs. 500,000 Payments Need Proper Banking Evidence',
    excerpt: 'A Rs. 500,000+ cash payment made outside approved banking channels can be disallowed as a deduction — or rejected as the cost of an asset. Here is what the 2026 amendment changed, and how to stay compliant.',
    category: 'tax-accounting',
    author: A.praneeth,
    date: '2026-06-16',
    image: '/images/cities/sri-lanka.jpg',
    featured: true,
    popular: true,
    body: [
      { p: 'Cash is convenient. For everyday business transactions it is fast, familiar, and often the path of least resistance. But when the amounts get large, that convenience can quietly turn into a tax liability. Under Section 10(2A) of the Inland Revenue Act, a payment of Rs. 500,000 or more that is not made through an approved method can be disallowed as a deduction — and may not be accepted as the cost of an asset — directly affecting your taxable income, your capital allowance claims, and the tax treatment of asset purchases. A 2026 amendment has now widened the list of approved methods, and understanding exactly what counts is the difference between a clean deduction and an unwelcome adjustment at audit.' },

      { h2: 'What the Rs. 500,000 rule covers' },
      { p: 'The rule applies whenever one person pays another Rs. 500,000 or more in a single day — whether that is one transaction, or a series of transactions relating to a single event. This last point matters more than many businesses realise. Splitting a large payment into several smaller cash payments does not, by itself, take you outside the rule if those payments all relate to the same underlying transaction or event.' },
      { p: 'In practice, this means you should look at the substance and commercial purpose of a payment, not just the figure printed on each individual voucher. Three cash payments of Rs. 200,000 made on the same day for the same purchase are, in substance, a single Rs. 600,000 payment — and they are treated accordingly.' },

      { h2: 'Approved payment methods' },
      { p: 'To protect both deductibility and asset-cost recognition, high-value payments should be routed through channels that leave a clear trail. The approved methods include:' },
      { list: [
        'An account payee cheque.',
        'An account payee bank draft.',
        'A credit card.',
        'A debit card.',
        'An electronic payment system operating through a bank account.',
        'Depositing cash directly into the bank account of the person entitled to the payment — newly confirmed by the 2026 amendment.',
      ] },
      { p: 'That final method is the key change. Previously, businesses that dealt in cash were caught in an awkward position: the recipient wanted cash, but cash failed the test. The amendment closes that gap by accepting a direct deposit into the payee’s account as a compliant method. The common thread across every approved channel is the same — the payment must be traceable through the banking system and supported by documentary evidence.' },

      { h2: 'Tax consequences of non-compliance' },
      { p: 'The cost of getting this wrong is concrete, not theoretical. If a payment of Rs. 500,000 or more is not made through an approved method:' },
      { list: [
        'The payer may lose the right to claim it as a deductible expense when calculating income; and',
        'The amount may not be recognised as the cost of an asset for tax purposes.',
      ] },
      { p: 'Both outcomes push taxable income up. The asset-cost point is easy to overlook but can be expensive — it affects capital allowances and the gain or loss recognised when the asset is later sold. These issues tend to surface during a tax review or audit, and they are hardest to defend precisely when the business cannot produce clean payment records. A disallowed deduction on a payment you genuinely made is a frustrating way to increase your tax bill.' },

      { h2: 'The practical takeaway' },
      { p: 'Before making any payment of Rs. 500,000 or more, treat it as a compliance checkpoint, not just a transaction:' },
      { list: [
        'Confirm the method is approved before the money moves — not after.',
        'Retain the evidence: bank confirmations, receipts, invoices, and internal approval records, kept together.',
        'Update your payment policy so that procurement staff, suppliers, and cash handlers all understand that a large cash payment can trigger a tax disallowance.',
      ] },
      { p: 'As a simple working rule: high-value payments should be routed through documented banking channels, every time. The few minutes it takes to deposit funds into a supplier’s account or issue an account payee cheque is far cheaper than losing the deduction later.' },

      { h2: 'References and source notes' },
      { list: [
        'Inland Revenue Act, No. 24 of 2017 — Section 10(2A).',
        'Inland Revenue (Amendment) Act, No. 11 of 2026 — Section 3, which amends Section 10(2A) of the principal Act to add depositing cash in the second-mentioned person’s bank account as an accepted payment method, effective 08 May 2023.',
      ] },
      { p: 'This article is intended as general guidance for business owners, directors, and payment-processing teams. It is not a substitute for advice on a specific transaction.' },
    ],
  },
  {
    slug: 'singapore-company-secretary-growing-business',
    title: 'Why Every Growing Business Needs a Professional Company Secretary in Singapore',
    excerpt: 'In Singapore, incorporation is only the start of a company’s regulatory lifecycle. With obligations under the Companies Act and ACRA growing — and the 2026 removal of the filing grace period — a professional company secretary is now essential, not optional.',
    category: 'corporate-services',
    author: A.hamdhan,
    date: '2026-06-16',
    image: '/images/cities/singapore.jpg',
    featured: false,
    popular: true,
    body: [
      { p: 'In Singapore, incorporation is only the starting line of a company’s regulatory lifecycle, not the finish. Once a company is formed, it carries ongoing statutory obligations under the Companies Act 1967 and the requirements of the Accounting and Corporate Regulatory Authority (ACRA) — and those obligations only grow heavier as the business does. Transactions multiply, ownership structures become more layered, and reporting expectations tighten.' },
      { p: 'The regulatory environment has tightened too. Since January 2026, the informal grace period that once gave companies a few extra days after a missed deadline has been removed: penalties now apply from the first day after the due date. In this climate, a professional company secretary is no longer a back-office convenience. The role has become essential — for legal compliance, governance discipline, and the management of regulatory risk.' },

      { h2: 'Statutory compliance and beneficial ownership transparency' },
      { p: 'Every Singapore company has a recurring set of obligations that are not optional and are actively enforced: filing Annual Returns with ACRA, maintaining statutory registers, keeping director and shareholder particulars current, and properly recording corporate resolutions. Miss any of these, and enforcement can follow.' },
      { p: 'Closely tied to this is the Register of Registrable Controllers (RORC), which requires companies to identify and record the individuals or entities with significant control, keep that information current, and make it available for inspection on request. RORC enforcement has tightened in step with broader anti-money-laundering expectations, and outdated or missing entries now carry real regulatory risk. A professional company secretary keeps both the statutory filings and the controller records accurate and up to date — closing a gap that is easy to overlook until a regulator asks to see it.' },

      { h2: 'Governance discipline: resolutions and corporate actions' },
      { p: 'As a company grows, its decisions have to be documented properly — through board resolutions, shareholder resolutions, or written resolutions in lieu of meetings — each following the correct notice periods, quorum requirements, and drafting standards, with filing to ACRA where required.' },
      { p: 'The same discipline applies to the corporate actions that come with growth: share issuances and transfers, director appointments and resignations, capital restructuring, investor onboarding, and cross-border expansion. Improperly documented corporate actions are a common source of disputes and invalid resolutions — the kind of problem that surfaces at the worst possible moment, during due diligence or a dispute. The company secretary’s job is to ensure every decision is legally sound and properly recorded the first time.' },

      { h2: 'AGM and Annual Return timelines' },
      { p: 'Timing is where many companies stumble. Under Section 175 of the Companies Act, a company must generally hold an Annual General Meeting within 6 months of its financial year end.' },
      { p: 'Private companies may rely on the Section 175A exemption to dispense with the AGM — but only if specific conditions are met. Financial statements must be sent to all members entitled to notice within 5 months of financial year end (or the company must qualify as a dormant relevant company exempt from preparing financial statements). The exemption also carries safeguards: any member may still compel an AGM by notifying the company no later than 14 days before the end of the sixth month after financial year end, or by requesting one shortly after the financial statements are circulated. Where a company relies on this exemption, the dispensation should be properly documented and lodged with ACRA — not simply assumed.' },
      { p: 'Separately, the Annual Return must be filed with ACRA within 7 months of financial year end for private companies (5 months for public companies).' },
      { p: 'Extension of Time (EOT) applications exist for limited circumstances, but they are not automatic and must be properly justified. And with the 2026 removal of ACRA’s grace period, late filing now triggers an immediate penalty, with escalating fines and the risk of strike-off for persistent non-compliance. A company secretary establishes the correct AGM position each year — ahead of the Annual Return — and ensures statutory deadlines are met under the current rules.' },

      { h2: 'The practical takeaway' },
      { p: 'As companies grow, compliance becomes more complex and far less forgiving of small delays. Engaging a professional company secretary ensures that statutory registers, RORC records, corporate resolutions, and AGM and Annual Return deadlines are all managed correctly under the rules as they stand today — letting directors focus on building the business while staying fully compliant.' },

      { h2: 'References and source notes' },
      { list: [
        'Singapore Companies Act 1967 — including Sections 175 and 175A (AGM requirements and exemption).',
        'ACRA Filing and Compliance Guidelines — including the January 2026 removal of the informal grace period.',
        'ACRA Register of Registrable Controllers (RORC) requirements.',
        'ACRA Annual Return and AGM filing requirements.',
        'Singapore Code of Corporate Governance.',
      ] },
      { p: 'This article is intended as general guidance for company directors, founders, and businesses operating in or expanding into Singapore. It is not a substitute for advice on a specific matter.' },
    ],
  },
  {
    slug: 'uae-ubo-register-companies-overlook',
    title: 'The UBO Register Most UAE Companies Forget They Need',
    excerpt: 'Since Cabinet Decision No. 109 of 2023, every UAE mainland and commercial free-zone company must keep a standalone Register of Real Beneficial Owners — filed within 60 days of licensing and updated within 14 days of any change. It is one of the most overlooked obligations we see.',
    category: 'corporate-services',
    author: A.hamdhan,
    date: '2026-06-16',
    image: '/images/cities/uae.webp',
    featured: false,
    popular: true,
    body: [
      { p: 'Most directors of UAE free zone companies can tell you exactly where their trade licence and shareholder certificate are kept. Far fewer can say the same about their UBO register.' },
      { p: 'Since Cabinet Decision No. 109 of 2023 came into effect, every legal person licensed in the UAE mainland or a commercial free zone has been required to maintain a standalone Register of Real Beneficial Owners, in addition to its existing register of partners or shareholders. In our day-to-day work reviewing client files, this is one of the most consistently overlooked compliance obligations we come across — and the gap is rarely intentional. It is simply a register that many companies never knew they needed to create.' },

      { h2: 'What the law actually requires' },
      { p: 'Cabinet Decision No. 109 of 2023, which replaced the earlier Cabinet Resolution No. 58 of 2020, requires in-scope companies to maintain three distinct registers:' },
      { list: [
        'A Register of Real Beneficial Owners;',
        'A Register of Partners or Shareholders;',
        'Where applicable, a Register of Nominee Directors or Managers.',
      ] },
      { p: 'A beneficial owner is generally any natural person who owns or controls 25% or more of a company’s shares or voting rights, or who otherwise exercises ultimate control over its management.' },
      { p: 'The timing requirements are specific. Companies must prepare and file their UBO register with the relevant licensing authority within 60 days of incorporation or licensing, and must update it within 14 days of any change in ownership or control — for example, a post-incorporation share transfer or the appointment of a new shareholder.' },

      { h2: 'Why free zone companies fall behind' },
      { p: 'In our experience, the gap usually comes down to timing and awareness rather than negligence.' },
      { p: 'Many free zone companies — including those registered under IFZA — are incorporated quickly through registration agents who focus on the trade licence and shareholder documentation, with the UBO register treated as a secondary or optional step. Ownership changes are another common blind spot: a share transfer or new investor is recorded with the free zone authority, but the company’s own UBO register is never updated to reflect it. Nominee arrangements, where they exist, are frequently undocumented altogether.' },
      { p: 'None of this is unique to one free zone. It is a pattern we see across jurisdictions — which is precisely why it is worth checking before it becomes a problem.' },

      { h2: 'The cost of non-compliance' },
      { p: 'The consequences of an outdated or missing UBO register are not merely administrative. Cabinet Decision No. 132 of 2023 sets out an escalating penalty framework for violations, ranging from written warnings for a first offence to fines of up to AED 100,000 and potential licence suspension for repeated breaches.' },
      { p: 'Beyond the regulatory exposure, an incomplete UBO register increasingly surfaces during bank KYC refreshes and due diligence exercises — where its absence can delay account opening, financing, or a transaction at the worst possible time. The register that felt optional at incorporation becomes urgent the moment a bank or counterparty asks for it.' },

      { h2: 'The practical takeaway' },
      { p: 'Directors should confirm, today, whether a standalone UBO register actually exists for their company — and should not assume that a shareholder certificate or trade licence satisfies the requirement.' },
      { p: 'Once confirmed, the register should be:' },
      { list: [
        'Checked against current ownership;',
        'Updated for any changes within the 14-day window; and',
        'Reviewed annually alongside other corporate compliance matters — rather than only when a bank or authority asks for it.',
      ] },

      { h2: 'References and source notes' },
      { list: [
        'Cabinet Decision No. 109 of 2023 on the Regulation of Real Beneficiary Procedures (replacing Cabinet Resolution No. 58 of 2020).',
        'Cabinet Decision No. 132 of 2023 on Administrative Penalties for Violations.',
      ] },
      { p: 'This article is intended as general guidance for company directors, investors, and finance and compliance teams managing UAE entities. It is not a substitute for advice on a specific matter.' },
    ],
  },
  {
    slug: 'feasibility-study-before-you-commit',
    title: 'Feasibility Studies: Testing an Idea Before You Commit',
    excerpt: 'Before you commit capital to a new venture, market, or expansion, one question comes first: is it actually realistic and financially viable? A feasibility study turns assumptions into evidence — while it is still cheap to change course.',
    category: 'research',
    author: A.shanika,
    date: '2026-06-17',
    image: '/images/services/research-planning.jpg',
    featured: false,
    popular: true,
    body: [
      { p: 'Before starting a new business, investing in a project, expanding operations, or entering a new market, there is one question worth answering first: is this opportunity actually realistic and financially viable? It is an easy question to skip in the excitement of a new venture — and an expensive one to ignore. A feasibility study exists to answer it, reviewing the key commercial, financial, operational, legal, and risk factors before the important decisions are made.' },
      { p: 'In short, a feasibility study turns assumptions into evidence — and does so while it is still cheap to change course.' },

      { h2: 'What is a feasibility study?' },
      { p: 'A feasibility study is a structured review of a proposed business idea, project, investment, or expansion plan. It examines whether the opportunity can work in practice, what resources it would require, what risks might arise, and whether the expected return justifies the investment.' },
      { p: 'It is usually prepared at a decision point — before committing capital, applying for funding, entering a new market, or making a strategic move. The goal is not to confirm that an idea is good, but to test honestly whether it is, while there is still time and flexibility to act on the answer.' },

      { h2: 'Key areas reviewed in a feasibility study' },
      { p: 'A thorough feasibility study looks across several dimensions of a proposed venture rather than focusing on any single one. Typically, it reviews:' },
      { list: [
        'Commercial — market demand, customer segments, competition, and pricing.',
        'Financial — financial projections, funding requirements, revenue, costs, profitability, cash flow, and the break-even position.',
        'Operational — the resources, processes, and staffing the venture would need to run.',
        'Legal and regulatory — the licensing, compliance, and jurisdictional requirements that apply.',
        'Risk and return — the main risks, the expected return on investment, and the sensitivity of key assumptions to change.',
      ] },
      { p: 'That last point — sensitivity — is often where a feasibility study earns its value. By testing how the numbers shift when core assumptions move, it shows not just whether a plan works on paper, but how much room for error it can absorb before it does not.' },

      { h2: 'How feasibility studies support better decisions' },
      { p: 'A well-prepared feasibility study helps decision-makers avoid relying on assumptions or optimism alone. It gives investors, business owners, and finance teams a clearer view of the potential outcomes, risks, and financial impact of a project before they are committed to it.' },
      { p: 'That clarity is what makes the study useful in practice. It lets clients compare options side by side, adjust their plans, identify funding needs early, and decide — on evidence rather than instinct — whether to proceed, revise, delay, or stop a proposed project. A “no,” reached early and for the right reasons, is just as valuable an outcome as a confident “yes.”' },

      { h2: 'The practical takeaway' },
      { p: 'Before making a major business or investment decision, test the idea through a feasibility study. Done properly, it helps you understand the market, build realistic financial assumptions, identify risks early, and move forward with genuine confidence — or step back, knowing you have saved yourself a far costlier lesson later.' },

      { h2: 'References and source notes' },
      { list: [
        'Internal research experience and previous client project analysis.',
        'Market research, industry reports, and competitor reviews.',
        'Official statistics, economic data, and sector-specific market data, where applicable.',
        'Financial assumptions, management information, and project-specific forecasts.',
        'Legal, regulatory, and licensing sources relevant to the project or jurisdiction.',
      ] },
      { p: 'This article is intended as general guidance for investors, business owners, and finance teams. It is not a substitute for a feasibility study or professional advice on a specific project.' },
    ],
  },
  {
    slug: 'epf-etf-compliance-employee-relations',
    title: 'Why EPF & ETF Compliance Is Key to Good Industrial and Employee Relations',
    excerpt: 'In Sri Lanka, EPF and ETF contributions are statutory obligations — but treating them as mere legal duties misses the point. Paid accurately and on time, they become a cornerstone of employee trust and stable industrial relations.',
    category: 'hr',
    author: A.ramesh,
    date: '2026-06-17',
    image: '/images/services/hr-management.jpg',
    featured: false,
    popular: true,
    body: [
      { p: 'In Sri Lanka, the Employees’ Provident Fund (EPF) and Employees’ Trust Fund (ETF) are statutory obligations that every employer must honour. Yet non-compliance remains one of the most common HR failures — and one of the most damaging.' },
      { p: 'The cost goes well beyond legal penalties. Failure to remit contributions on time erodes employee trust, triggers grievances, and can escalate into formal industrial disputes. For HR professionals and business leaders, the key insight is this: these obligations matter not merely as legal duties, but as relationship-building tools. Compliance with EPF and ETF is, in practice, a cornerstone of healthy employee relations (ER) and industrial relations (IR) — employers who consistently meet these duties build trust, reduce disputes, and create a workplace where employees feel protected and valued.' },

      { h2: 'EPF & ETF in Sri Lanka: what the law requires' },
      { p: 'Under the EPF Act No. 15 of 1958, employers must contribute 12% and employees 8% of monthly gross salary to the Employees’ Provident Fund, administered by the Central Bank of Sri Lanka. The ETF Act No. 46 of 1980 requires a further 3% employer contribution to the Employees’ Trust Fund Board.' },
      { p: 'Both must be remitted monthly, and failure to do so attracts surcharges, penalties, and potential legal proceedings. These are not optional benefits. They are enforceable statutory entitlements that form the primary retirement safety net for covered employees across the country — which is precisely why employees, regulators, and unions treat lapses so seriously.' },

      { h2: 'The link between EPF/ETF compliance and employee relations' },
      { p: 'Employee relations is fundamentally about the trust and sense of fairness that exists between an employer and its workforce. When EPF and ETF contributions are paid accurately and on time, employees receive tangible proof that their employer respects their rights and their long-term financial security.' },
      { p: 'The reverse is just as powerful. Delayed or incorrect contributions are among the most common triggers for employee grievances. Employees who discover that their EPF balances are understated — or that contributions were withheld — often feel deceived, and that sense of betrayal erodes morale far beyond the financial impact alone. Resolving such grievances consumes significant management time, damages employer branding, and can drive higher attrition. A statutory payment missed quietly in payroll can surface, months later, as a very public breakdown in trust.' },

      { h2: 'The impact on industrial relations and legal exposure' },
      { p: 'Industrial relations concern the collective relationship between employers, employees, and trade unions — and here the stakes rise further. EPF and ETF non-compliance is frequently cited in collective disputes, union negotiations, and labour tribunal proceedings in Sri Lanka.' },
      { p: 'The Department of Labour and the EPF department conduct periodic inspections, and employers found in default face surcharges, penalties, and significant reputational damage. Beyond the financial cost, a history of non-compliance weakens an employer’s position in any IR dispute and invites greater union scrutiny. Consistent, proactive compliance does the opposite: it signals to the workforce and its representatives that the organisation operates with integrity — reducing the likelihood of collective grievances and supporting a stable, productive industrial-relations environment.' },

      { h2: 'The practical takeaway' },
      { p: 'Treating EPF and ETF compliance as a priority — not an afterthought — is one of the most effective ways to strengthen employee trust, protect the organisation’s legal standing, and maintain sound industrial relations. In practice, that means:' },
      { list: [
        'Review remittance schedules to confirm contributions are submitted by the stipulated monthly deadlines.',
        'Cross-check employee records against EPF statements periodically, so HR and payroll can catch and correct discrepancies early.',
        'Regularise any arrears proactively, engaging the relevant authorities to resolve the position before an inspection or an employee complaint forces the issue.',
      ] },
      { p: 'Get this right, and a routine payroll obligation quietly becomes one of the strongest signals of trust an employer can send.' },

      { h2: 'References and source notes' },
      { list: [
        'Employees’ Provident Fund Act No. 15 of 1958 (Sri Lanka).',
        'Employees’ Trust Fund Act No. 46 of 1980 (Sri Lanka).',
        'Central Bank of Sri Lanka — EPF Division (www.epf.lk).',
        'Employees’ Trust Fund Board (www.etfb.lk).',
        'Department of Labour, Sri Lanka (www.labourdept.gov.lk).',
      ] },
      { p: 'This article is intended as general guidance for employers, HR managers, and finance teams in Sri Lanka. It is not a substitute for advice on a specific compliance matter.' },
    ],
  },
  {
    slug: 'singapore-iras-tax-filing',
    title: 'Why Tax Filing with IRAS Matters — And What Happens If You Don’t',
    excerpt: 'Every company and individual earning income in Singapore must file with IRAS — and the penalties for late or non-filing are entirely avoidable. Here is what you must file, when it is due, and why timely filing is the gateway to Singapore’s tax reliefs.',
    category: 'tax-accounting',
    author: A.azmar,
    date: '2026-06-17',
    image: '/images/services/incorporation-governance.jpg',
    featured: false,
    popular: true,
    body: [
      { p: 'Every company and individual earning income in Singapore has a legal obligation to file taxes with the Inland Revenue Authority of Singapore (IRAS). Yet each year, late filings and non-compliance generate penalties that are entirely avoidable.' },
      { p: 'The frustrating part is that Singapore’s tax system is built to be business-friendly. The corporate tax rate is a flat 17%, and generous exemptions exist for start-ups and smaller companies — but only those who file correctly and on time can actually access these benefits. This article breaks down what you need to know, when you need to act, and why taking your IRAS filing obligations seriously is one of the most important things you can do for your business.' },

      { h2: 'What are your tax filing obligations with IRAS?' },
      { p: 'All companies in Singapore must file a Corporate Income Tax Return — Form C-S, Form C-S Lite, or Form C — annually via the myTax Portal. The YA 2026 e-filing deadline is 30 November 2026, and it applies even to companies that did not carry on business or that incurred a loss.' },
      { p: 'A few essentials are easy to miss:' },
      { list: [
        'Self-employed persons, directors, and those with rental income must file personally.',
        'Tax is assessed on a preceding-year basis — YA 2026 covers income earned in FY 2025.',
        'Directors are personally responsible for timely, accurate filing, even when a tax agent is engaged.',
      ] },
      { p: 'That last point is the one that catches people out: appointing an agent does not transfer the legal responsibility away from you.' },

      { h2: 'Key consequences of late or non-filing' },
      { p: 'The consequences are concrete, and they escalate. IRAS can impose financial penalties (Composition Amounts) for late or non-filing, and may take court action against directors in persistent cases.' },
      { list: [
        'If a company misses its Estimated Chargeable Income (ECI) deadline — three months from financial year-end — IRAS may raise an estimated assessment, which can produce a higher tax bill than the company actually owes.',
        'Late filers also risk losing eligibility for the Start-Up Tax Exemption (SUTE) and Partial Tax Exemption schemes.',
        'For individuals, penalties for incorrect or late filing can reach up to 200% of the tax undercharged.',
      ] },
      { p: 'The damage isn’t only financial. Unresolved tax issues can quietly undermine your ability to secure bank loans or government grants, or to pass investor due diligence — often surfacing at exactly the moment a clean compliance record matters most.' },

      { h2: 'How to file correctly — and make the most of Singapore’s tax framework' },
      { p: 'All filings are done online via the myTax Portal (mytax.iras.gov.sg), and companies need Corppass authorisation to access it. Before filing, a company should:' },
      { list: [
        'Set up Corppass.',
        'Identify the correct form — Form C-S for revenue up to S$5M, Form C-S Lite for revenue up to S$200K, or Form C for larger companies.',
        'Prepare financial statements and tax computations.',
      ] },
      { p: 'This is also where Singapore’s framework rewards companies that file properly. Qualifying start-ups may claim the Start-Up Tax Exemption (SUTE) for their first three Years of Assessment: a 75% exemption on the first S$100,000 of normal chargeable income and a 50% exemption on the next S$100,000. For context, individual tax residents are taxed progressively from 0% to 24%, and all companies must retain their records for at least five years.' },
      { p: 'None of these benefits apply automatically to a company that has fallen behind — which is the whole point. Filing correctly is not just about avoiding penalties; it is the gateway to the reliefs that make Singapore’s system so favourable in the first place.' },

      { h2: 'The practical takeaway' },
      { p: 'Check your company’s financial year-end date and work backwards: your ECI must be filed within three months of year-end, and your Corporate Income Tax Return is due by 30 November each year. If you are a self-employed individual or director, confirm whether you also need to file personally.' },
      { p: 'Log in to the myTax Portal to check your filing status and claim any available exemptions before the deadline. When in doubt, engage a qualified tax agent — but remember, the responsibility for timely filing always remains with you.' },

      { h2: 'References and source notes' },
      { list: [
        'Income Tax Act 1947 (Singapore Statutes Online).',
        'Inland Revenue Authority of Singapore (IRAS) — Corporate Income Tax Filing Season 2026.',
        'IRAS — Basic Guide to Corporate Income Tax for Companies.',
        'IRAS — Corporate Income Tax Rate, Rebates & Tax Exemption Schemes.',
        'IRAS — Individual Income Tax Rates.',
        'IRAS myTax Portal — Online Filing Platform (mytax.iras.gov.sg).',
      ] },
      { p: 'This article is intended as general guidance for company directors, business owners, and finance teams operating in Singapore. It is not a substitute for advice on a specific tax matter.' },
    ],
  },
];

/* ─── Articles removed on request — preserved here for easy restore.
   To republish, move objects back into the `posts` array above. ─── */
/*
const _archivedPosts = [
  {
    slug: 'hong-kong-two-tiered-profits-tax-2026',
    title: "Hong Kong's Two-Tiered Profits Tax: What It Means for Your 2026 Filing",
    excerpt: 'A clear breakdown of the 8.25% and 16.5% rates, who qualifies, and how to prepare an audit-ready Profits Tax Return — without surprises.',
    category: 'tax-accounting',
    author: A.greg,
    date: '2026-06-12',
    image: '/images/cities/hong-kong.jpg',
    featured: true,
    popular: true,
    body: [
      { p: 'Hong Kong remains one of the most competitive places in Asia to run a company — and its two-tiered profits tax is a big part of why. But "competitive" is not the same as "automatic." A clean filing still depends on accurate books, a statutory audit, and a correctly prepared Profits Tax Return.' },
      { h2: 'How the two-tiered rates work' },
      { p: 'For incorporated businesses, the first HK$2 million of assessable profits is taxed at 8.25%. Profits above that threshold are taxed at the standard 16.5%. The lower rate is designed to ease the burden on smaller companies and start-ups while keeping the headline rate predictable for larger operations.' },
      { p: 'Only one entity within a group of "connected" companies can elect the two-tiered rates in a given year, so groups need to decide where the benefit is best applied.' },
      { h2: 'The audit is not optional' },
      { p: 'Every Hong Kong company must have its financial statements audited annually by a local Certified Public Accountant before the Profits Tax Return (BIR51) is filed. The smoother your bookkeeping through the year, the faster and cheaper that audit becomes.' },
      { h2: 'How to prepare' },
      { list: [
        'Keep books reconciled monthly — not in a year-end scramble.',
        'Maintain clear records of inter-company transactions if you operate as a group.',
        'Align your audit timeline with the IRD filing window to avoid extensions.',
        'Confirm which entity should elect the two-tiered rate each year.',
      ] },
      { p: 'Our Hong Kong team prepares audit-ready books, liaises with your appointed auditor, and handles the Profits Tax Return end to end. If you would like a tailored timeline for your 2026 filing, our advisors are happy to help.' },
    ],
  },
  {
    slug: 'singapore-local-director-requirement-explained',
    title: 'Setting Up in Singapore: The Local Director Requirement, Explained',
    excerpt: 'Every Singapore company needs at least one ordinarily-resident director. Here is what that means in practice — and the options if you do not have one yet.',
    category: 'incorporation',
    author: A.charles,
    date: '2026-06-05',
    image: '/images/cities/singapore.jpg',
    featured: false,
    popular: true,
    body: [
      { p: 'Singapore is one of the fastest jurisdictions in the world to incorporate in — most private limited companies are registered with ACRA within one to three business days. The single requirement that trips up foreign founders is the local director rule.' },
      { h2: 'What the rule actually says' },
      { p: 'Every Singapore company must have at least one director who is "ordinarily resident" in Singapore — typically a citizen, permanent resident, or holder of an eligible pass. This is a governance safeguard, not a tax mechanism, and it applies from day one.' },
      { h2: 'Your options as a foreign founder' },
      { list: [
        'Appoint a qualifying resident from your own team if you have one.',
        'Use a nominee director service to satisfy the requirement while you retain full control of the business.',
        'Relocate a founder under an eligible work pass — a longer route, but viable for committed market entrants.',
      ] },
      { p: 'A nominee director is a compliance role, not a management one: they do not run your company or access your funds. We can introduce nominee services where needed and hand the governance back to you as your local presence grows.' },
      { p: 'Once incorporation is complete, our Company Secretarial service picks up the ongoing ACRA filings, AGMs, and statutory records — the two are designed to flow together.' },
    ],
  },
  {
    slug: 'uae-corporate-tax-free-zone-checklist',
    title: 'UAE Corporate Tax at 9%: A Free Zone Owner’s Checklist',
    excerpt: 'The UAE now levies a 9% corporate tax. Free Zone companies can still benefit — but only if they meet the conditions. Here is a practical checklist.',
    category: 'market-updates',
    author: A.arkam,
    date: '2026-05-28',
    image: '/images/cities/uae.webp',
    featured: false,
    popular: true,
    body: [
      { p: 'The UAE’s introduction of a 9% corporate tax changed the planning conversation for every business in the country. For Free Zone companies, the headline benefits are still available — but they are now conditional, and the conditions matter.' },
      { h2: 'What changed' },
      { p: 'Mainland businesses are subject to 9% corporate tax on profits above the threshold. Qualifying Free Zone persons may still access a 0% rate on qualifying income, provided they meet substance and compliance requirements and do not elect out.' },
      { h2: 'Your checklist' },
      { list: [
        'Confirm whether your income is "qualifying" under your Free Zone’s rules.',
        'Maintain adequate substance — real operations, not just a licence.',
        'Register for Corporate Tax with the Federal Tax Authority on time.',
        'Keep audit-ready financial statements; many Free Zones now require them.',
        'Handle VAT (5%) registration and quarterly returns where applicable.',
      ] },
      { p: 'The cost of getting this wrong is not just tax — it is the loss of the Free Zone benefit entirely. Our UAE team handles Corporate Tax and VAT registration, bookkeeping, and FTA correspondence so your status is protected and your filings are clean.' },
    ],
  },
  {
    slug: 'five-compliance-deadlines-founders-miss',
    title: 'Five Compliance Deadlines Founders Miss in Their First Year',
    excerpt: 'The filings that quietly turn into penalties — and a simple way to stay ahead of every one of them across multiple markets.',
    category: 'corporate-services',
    author: A.madushini,
    date: '2026-05-19',
    image: '/images/services/incorporation-governance.jpg',
    featured: false,
    popular: false,
    body: [
      { p: 'Incorporation feels like the finish line. In reality it is the start of a compliance calendar — and the first year is where well-run companies still slip, because the deadlines are unfamiliar and nobody owns them yet.' },
      { h2: 'The five that catch people out' },
      { list: [
        'Annual return — every jurisdiction has one (NAR1 in Hong Kong, the confirmation statement in the UK, the annual return in Singapore). Miss it and penalties accrue automatically.',
        'Business registration renewal — easy to forget when it is on a different cycle from your incorporation date.',
        'First-year tax registration — corporate tax and VAT/GST registrations have their own windows.',
        'Statutory records upkeep — registers of directors, members, and significant controllers must be current and available for inspection.',
        'AGM and financial statements — timing is fixed by statute, not by when your accounts happen to be ready.',
      ] },
      { h2: 'The fix is ownership, not heroics' },
      { p: 'None of these are hard individually. They become problems when no single person is tracking them across markets. A mapped compliance calendar — with reminders tied to each authority’s windows — turns a recurring risk into a routine. That is exactly what our Company Secretarial service exists to do.' },
    ],
  },
  {
    slug: 'feasibility-study-right-questions',
    title: 'Is Your Feasibility Study Asking the Right Questions?',
    excerpt: 'A feasibility study is only as good as the questions behind it. What a decision-grade study should contain before you commit capital.',
    category: 'research',
    author: A.aaron,
    date: '2026-05-08',
    image: '/images/services/research-planning.jpg',
    featured: false,
    popular: false,
    body: [
      { p: 'Most feasibility studies fail in the same way: they confirm what the founder already hoped, rather than test what could go wrong. A decision-grade study is designed to challenge the idea, not flatter it.' },
      { h2: 'Four questions a real study answers' },
      { list: [
        'Is there genuine, sized demand — or just enthusiasm from people close to the project?',
        'What does the unit economics look like at realistic, not best-case, assumptions?',
        'Who already serves this market, and what is your defensible reason to win share?',
        'What has to be true for this to work — and how fragile are those assumptions?',
      ] },
      { p: 'The value is not in the document; it is in the decisions it de-risks. A good study can save a year and a great deal of capital by surfacing a fatal assumption early — or give you the evidence to move with conviction.' },
      { p: 'Our Research & Business Planning team delivers technical, financial, market, and operational feasibility for new ventures and expansions, structured so the conclusion is something you can actually act on.' },
    ],
  },
  {
    slug: 'payroll-process-that-scales',
    title: 'Building a Payroll Process That Scales With Your Team',
    excerpt: 'From first hire to fiftieth, without the admin overwhelm. The foundations that keep payroll accurate, compliant, and quiet.',
    category: 'hr',
    author: A.madushini,
    date: '2026-04-24',
    image: '/images/services/hr-management.jpg',
    featured: false,
    popular: false,
    body: [
      { p: 'Payroll is invisible when it works and corrosive when it does not. A single late or incorrect run damages trust with exactly the people you most need to keep. The good news: payroll scales cleanly if the foundations are right early.' },
      { h2: 'Get these right first' },
      { list: [
        'Clean employment contracts — pay, benefits, and terms documented before the first run.',
        'A single source of truth for hours, leave, and changes.',
        'Statutory deductions and contributions handled correctly for each jurisdiction.',
        'A fixed monthly cycle with a review step before disbursement.',
      ] },
      { p: 'As headcount grows, the process should not get heavier — it should get more automated. The structure you set at five employees is what lets you reach fifty without adding administrative drag.' },
      { p: 'Our HR team manages payroll alongside contracts, policies, and performance frameworks, so your people are looked after and your obligations are met.' },
    ],
  },
  {
    slug: 'monthly-management-accounts-underrated',
    title: 'Monthly Management Accounts: The Number Founders Underrate',
    excerpt: 'Annual statements tell you where you have been. Monthly management accounts tell you where you are going — in time to do something about it.',
    category: 'tax-accounting',
    author: A.arkam,
    date: '2026-04-11',
    image: '/images/services/financial-services.jpg',
    featured: false,
    popular: true,
    body: [
      { p: 'Many founders treat accounting as a year-end obligation — something the auditors need. That view quietly costs them, because the most valuable financial information is also the most timely.' },
      { h2: 'Why monthly beats annual' },
      { p: 'Annual financial statements are a rear-view mirror. Monthly management accounts are a dashboard: cash position, margins, and trends while you can still act on them. The founders who review their numbers every month make earlier, calmer decisions than those who discover problems at audit.' },
      { h2: 'What good looks like' },
      { list: [
        'Books reconciled monthly on a modern cloud platform.',
        'A short, readable report — not a data dump.',
        'Cash-flow visibility, not just profit on paper.',
        'A consistent format you can compare month to month.',
      ] },
      { p: 'Our Financial Services team delivers monthly management accounts and clear reporting across our markets, working alongside your auditors and tax advisors so the numbers behind your decisions are sound.' },
    ],
  },
  {
    slug: 'inside-srp-colombo-five-markets',
    title: 'Inside SRP: How a Colombo HQ Supports Clients Across Five Markets',
    excerpt: 'A look at how SRP International coordinates incorporation, accounting, and HR across Sri Lanka, Singapore, the UAE, the UK, and Hong Kong.',
    category: 'news',
    author: A.shehan,
    date: '2026-03-30',
    image: '/images/cities/sri-lanka.jpg',
    featured: false,
    popular: false,
    body: [
      { p: 'SRP International began in Colombo with a simple belief: businesses deserve corporate services they can count on — reliable, transparent, and built for the long term. Today that operating hub supports clients across five markets, with local leadership in each.' },
      { h2: 'One coordinated group, not five vendors' },
      { p: 'Expanding into a new market is hard enough without juggling separate providers in every country. Our model puts a coordinated team behind you: a single relationship that spans incorporation, governance, accounting, tax, and HR — with people on the ground who know each jurisdiction’s rules.' },
      { p: 'With the recent opening of our Hong Kong office, clients can now structure operations across South Asia, South-East Asia, the Middle East, Europe, and East Asia through one partner.' },
      { p: 'The goal has never changed: take the operational and compliance weight off founders, so they can focus on building the business. If you are weighing an expansion, our advisors can walk you through the trade-offs between markets.' },
    ],
  },
];
*/

/* ─── Helpers ─── */
export function getPost(slug) {
  return posts.find(p => p.slug === slug) || null;
}

export function categoryName(slug) {
  return (categories.find(c => c.slug === slug) || {}).name || slug;
}

/* Estimated reading time from the body word count (~200 wpm). */
export function readingTime(post) {
  const words = (post.body || []).reduce((n, b) => {
    const text = b.p || b.h2 || (b.list ? b.list.join(' ') : '');
    return n + text.split(/\s+/).filter(Boolean).length;
  }, post.title.split(/\s+/).length);
  return Math.max(2, Math.ceil(words / 200));
}

/* Count of published posts per category (for the sidebar). */
export function categoryCounts() {
  const counts = {};
  for (const p of posts) counts[p.category] = (counts[p.category] || 0) + 1;
  return counts;
}
