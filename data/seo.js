/* ═══════════════════════════════════════════════════
   SRP International — Structured data (JSON-LD) builders
   Single source for every schema.org node emitted in the
   page <head> as one consolidated @graph (see partials/head.ejs).

   Every builder takes an absolute `base` (e.g. https://srpitl.com)
   so the markup follows the domain automatically and never hardcodes
   a host. Builders return plain objects; head.ejs serialises them.

   Accuracy first: only assert facts the site already states. Wrong
   structured data is worse than none, so nothing is invented here.
   ═══════════════════════════════════════════════════ */

import { offices } from './offices.js';

const HQ = offices.find(o => o.isHQ) || offices[0];
/* Offices withdrawn for review (`holding`) are omitted from public structured data. */
const PUBLIC_OFFICES = offices.filter(o => !o.holding);

/* Public social profiles (mirror partials/footer.ejs). */
const SAME_AS = [
  'https://www.facebook.com/srpitl',
  'https://www.instagram.com/srpitl/',
  'https://lk.linkedin.com/company/srpinternational',
];

const ORG_ID = base => `${base}/#organization`;
const SITE_ID = base => `${base}/#website`;

/* Map an office record → schema.org PostalAddress. The data file stores a
   two-line address; line2 carries "City NN, Country" so we surface the city
   and an ISO-ish country in the structured fields where we can infer them. */
function postalAddress(office) {
  return {
    '@type': 'PostalAddress',
    streetAddress: office.address.line1,
    addressLocality: office.city,
    addressCountry: COUNTRY_CODE[office.slug] || undefined,
    name: office.address.line2,
  };
}

const COUNTRY_CODE = {
  'sri-lanka': 'LK',
  'singapore': 'SG',
  'uae': 'AE',
  'uk': 'GB',
  'hong-kong': 'HK',
};

/* ── Sitewide nodes (emitted on every page) ─────────── */

export function organizationLd(base) {
  return {
    '@type': 'Organization',
    '@id': ORG_ID(base),
    name: 'SRP International',
    legalName: 'SRP International',
    url: `${base}/`,
    logo: {
      '@type': 'ImageObject',
      url: `${base}/images/logo/srp-international-logo.png`,
    },
    image: `${base}/images/og/share.png`,
    description:
      'SRP International is a professional corporate services firm providing company incorporation & governance, financial services, research & business planning, and human resource management across Sri Lanka, Singapore, the UAE, the UK, and Hong Kong.',
    slogan: 'Your trusted partner for outsourced corporate services and business support.',
    foundingDate: '2017',
    email: HQ.email,
    telephone: HQ.phone,
    address: postalAddress(HQ),
    sameAs: SAME_AS,
    areaServed: PUBLIC_OFFICES.map(o => ({ '@type': 'Country', name: o.label })),
    contactPoint: PUBLIC_OFFICES.map(o => ({
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: o.phone,
      email: o.email,
      areaServed: COUNTRY_CODE[o.slug] || o.label,
      availableLanguage: ['en'],
    })),
  };
}

export function websiteLd(base) {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID(base),
    url: `${base}/`,
    name: 'SRP International',
    inLanguage: 'en',
    publisher: { '@id': ORG_ID(base) },
  };
}

/* ── Per-page nodes ─────────────────────────────────── */

/* items: [{ name, path }] — path is root-relative ("/" , "/blog", …).
   The current page should be the last item. */
export function breadcrumbLd(base, items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${base}${it.path}`,
    })),
  };
}

export function blogPostingLd(base, post, pageUrl) {
  return {
    '@type': 'BlogPosting',
    '@id': `${pageUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    image: post.image ? [`${base}${post.image}`] : undefined,
    datePublished: post.date,
    dateModified: post.modified || post.date,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    author: {
      '@type': 'Person',
      name: post.author?.name,
      jobTitle: post.author?.role,
    },
    publisher: { '@id': ORG_ID(base) },
    articleSection: post.sectionName || undefined,
  };
}

export function reportArticleLd(base, edition, pageUrl) {
  return {
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline: edition.title,
    description: edition.description,
    image: [`${base}/images/services/financial-services.jpg`],
    datePublished: `${edition.period}-01`,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    author: { '@id': ORG_ID(base), name: 'SRP Research' },
    publisher: { '@id': ORG_ID(base) },
    isPartOf: { '@type': 'PublicationIssue', issueNumber: edition.label },
  };
}

/* tree: faqTreeForClient() output → [{ country, categories:[{ name, questions:[{q,a}] }] }] */
export function faqPageLd(tree) {
  const qa = [];
  for (const country of tree) {
    for (const cat of country.categories || []) {
      for (const item of cat.questions || []) {
        if (!item.q || !item.a) continue;
        qa.push({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        });
      }
    }
  }
  return { '@type': 'FAQPage', mainEntity: qa };
}

/* One office → a ProfessionalService (a LocalBusiness subtype). All offices
   keep the same Mon–Fri 09:00–17:00 schedule per the offices data file. */
export function professionalServiceLd(base, office) {
  return {
    '@type': 'ProfessionalService',
    '@id': `${base}/${office.slug}#business`,
    name: `SRP International ${office.label}`,
    url: `${base}/${office.slug}`,
    image: `${base}/images/og/share.png`,
    telephone: office.phone,
    email: office.email,
    address: postalAddress(office),
    areaServed: { '@type': 'Country', name: office.label },
    parentOrganization: { '@id': ORG_ID(base) },
    openingHours: 'Mo-Fr 09:00-17:00',
  };
}

export function serviceLd(base, office, service, pageUrl) {
  return {
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.overview,
    url: pageUrl,
    areaServed: { '@type': 'Country', name: office.label },
    provider: { '@id': ORG_ID(base) },
  };
}

/* Leadership team → Person nodes for the /about page. Each Person is tied to
   the Organization via worksFor (@id reference, resolved within the page's own
   @graph) and to their LinkedIn profile via sameAs. The ?v= cache-buster on the
   photo path is stripped so the image URL is a stable canonical. */
export function teamPersonsLd(base, team, pageUrl) {
  return (team || []).map(m => ({
    '@type': 'Person',
    '@id': `${base}/about#${m.firstName.toLowerCase()}`,
    name: m.name,
    jobTitle: m.role,
    image: m.photo ? `${base}${m.photo.split('?')[0]}` : undefined,
    worksFor: { '@id': ORG_ID(base) },
    url: m.linkedin || pageUrl,
    sameAs: m.linkedin ? [m.linkedin] : undefined,
  }));
}
