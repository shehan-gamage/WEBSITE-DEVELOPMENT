/* ═══════════════════════════════════════════════════
   SRP International — Office locations
   Single source of truth. Imported by server.js and
   surfaced on /contact, /about (Regional Leadership),
   and partials/footer (International Presence links).
═══════════════════════════════════════════════════ */

export const offices = [
  {
    slug:    'sri-lanka',
    label:   'Sri Lanka',
    city:    'Colombo',
    region:  'South Asia',
    cityImage: '/images/cities/sri-lanka.jpg',
    tagline: 'Operational Hub',
    flag:    'lk',
    isHQ:    true,
    address: {
      line1: 'Level 4, 35 Edward Lane',
      line2: 'Colombo 03, Sri Lanka',
    },
    phone:     '+94 112 590 665',
    phoneHref: '+94112590665',
    email:     'info@srpitl.com',
    hours:     'Mon–Fri, 9:00 AM – 5:00 PM (GMT+5:30)',
    /* Group leadership team is based here — no separate
       regional lead card; the existing /about team gallery
       already represents this office.                       */
    lead:      null,
  },

  {
    slug:    'singapore',
    label:   'Singapore',
    city:    'Singapore',
    region:  'South-East Asia',
    cityImage: '/images/cities/singapore.jpg',
    tagline: 'Regional Office',
    flag:    'sg',
    isHQ:    false,
    address: {
      line1: 'Suite 30-00, Singapore Land Tower',
      line2: '50 Raffles Place, Singapore 048623',
    },
    phone:     '+65 6632 3432',
    phoneHref: '+6566323432',
    email:     'info@srpitl.com',
    hours:     'Mon–Fri, 9:00 AM – 5:00 PM (GMT+8)',
    lead: {
      name: 'Charles Harbottle',
      role: 'Managing Director, SRP International Singapore',
    },
  },

  {
    slug:    'uae',
    label:   'United Arab Emirates',
    city:    'Dubai',
    region:  'Middle East',
    cityImage: '/images/cities/uae.webp',
    tagline: 'Regional Office',
    flag:    'ae',
    isHQ:    false,
    address: {
      line1: 'IFZA Headquarters, Dubai Digital Park',
      line2: 'Buildings A2, PO Box 342001, Dubai UAE',
    },
    phone:     '+971 50 357 1211',
    phoneHref: '+971503571211',
    email:     'info@srpitl.com',
    hours:     'Mon–Fri, 9:00 AM – 5:00 PM (GMT+4)',
    lead:      null,
  },

  {
    slug:    'uk',
    label:   'United Kingdom',
    city:    'London',
    region:  'Europe',
    cityImage: '/images/cities/uk.jpg',
    tagline: 'Regional Office',
    flag:    'gb',
    isHQ:    false,
    address: {
      line1: 'International House, 64 Nile Street',
      line2: 'London, England, N1 7SR',
    },
    phone:     '+44 7807 854544',
    phoneHref: '+447807854544',
    email:     'info@srpitl.com',
    hours:     'Mon–Fri, 9:00 AM – 5:00 PM (GMT/BST)',
    lead: {
      name: 'Jonathan Kitcat',
      role: 'Managing Director, SRP International United Kingdom',
    },
  },

  {
    slug:    'hong-kong',
    label:   'Hong Kong',
    city:    'Hong Kong',
    region:  'East Asia',
    cityImage: '/images/cities/hong-kong.jpg',
    tagline: 'Regional Office',
    flag:    'hk',
    isHQ:    false,
    address: {
      line1: 'Suite 913, 9/F., Chinachem Golden Plaza',
      line2: 'No. 77 Mody Road, Tsim Sha Tsui, Kowloon, Hong Kong',
    },
    phone:     '+852 9387 5524',
    phoneHref: '+85293875524',
    email:     'info@srpitl.com',
    hours:     'Mon–Fri, 9:00 AM – 5:00 PM (GMT+8)',
    lead: {
      name: 'Greg Brutus',
      role: 'Managing Director, SRP International Hong Kong',
    },
  },

  {
    slug:    'guernsey',
    label:   'Guernsey',
    city:    'St Peter Port',
    region:  'Guernsey',
    cityImage: '/images/cities/guernsey.jpg',
    tagline: 'Regional Office',
    flag:    'gg',
    isHQ:    false,
    comingSoon: true,
    hideServices: true,
    address: {
      line1: '3rd Floor, 10 Le Pollet',
      line2: 'St. Peter Port, Guernsey, GY1 1WH',
    },
    phone:     '+44 7911 756590',
    phoneHref: '+447911756590',
    email:     'info@srpitl.com',
    hours:     'Mon–Fri, 9:00 AM – 5:00 PM (GMT/BST)',
    lead: {
      name: 'Rupert Pleasant',
      role: 'Managing Director, SRP International Guernsey',
    },
  },
];
