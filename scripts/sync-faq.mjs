#!/usr/bin/env node
/* ═══════════════════════════════════════════════════
   Sync the FAQ from the "WEBSITE - FAQ" Google Doc.

   Runs automatically on every Vercel build (package.json "postinstall").
   Fetches the Doc's Markdown export, parses it into the FAQ tree, validates
   it, and writes data/faq.generated.json — which data/faq.js loads in
   preference to the committed data/faq.baseline.json.

   FAIL-SAFE: on ANY error (network, bad export, parse/validation failure) it
   logs a warning and exits 0 WITHOUT writing — so the app falls back to the
   last-known-good baseline. A broken Doc edit can never break a deploy or
   push malformed FAQs live.

   Local testing:
     node scripts/sync-faq.mjs --force                 # fetch the live Doc
     node scripts/sync-faq.mjs --force --file doc.md    # parse a local export
     node scripts/sync-faq.mjs --force --baseline       # also refresh the baseline
   ═══════════════════════════════════════════════════ */

import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const GENERATED = join(DATA_DIR, 'faq.generated.json');
const BASELINE = join(DATA_DIR, 'faq.baseline.json');

const DOC_ID = '1JHKn9duE-J55ojpZ7tWW0t9GGfjA0jVmd96NlS_Ox2o';
const EXPORT_URL = `https://docs.google.com/document/d/${DOC_ID}/export?format=md`;

/* Canonical identities — also the keyword allow-list mapping a country
   heading to a stable slug/flag (so /faq anchors never shift if the Doc
   rewords a heading). A bold heading not matched here still imports, slugified. */
const COUNTRIES = [
  { re: /sri\s*lanka/i,             country: 'Sri Lanka',      slug: 'sri-lanka', flag: '🇱🇰' },
  { re: /singapore/i,               country: 'Singapore',      slug: 'singapore', flag: '🇸🇬' },
  { re: /uae|dubai/i,               country: 'United Arab Emirates', slug: 'uae',  flag: '🇦🇪' },
  { re: /united\s*kingdom|\buk\b/i, country: 'United Kingdom', slug: 'uk',        flag: '🇬🇧' },
  { re: /hong\s*kong/i,             country: 'Hong Kong',      slug: 'hong-kong', flag: '🇭🇰' },
  { re: /guernsey/i,                country: 'Guernsey',       slug: 'guernsey',  flag: '🇬🇬' },
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const countTotal = (tree) =>
  tree.reduce((n, c) => n + c.categories.reduce((m, k) => m + k.questions.length, 0), 0);

/* Parse the Doc's Markdown:
     # **Bold heading**  → country
     # Plain heading     → category (under current country)
     * Question? Answer  → Q&A (split on the first '?')
     * sub-item          → appended to the previous answer (lists inside an answer) */
function parse(md) {
  const tree = [];
  let country = null, cat = null;

  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith('#')) {
      const heading = line.replace(/^#+\s*/, '').trim();
      const bold = heading.match(/^\*\*(.+?)\*\*$/);
      if (bold) {                                   // country
        const name = bold[1].trim();
        const known = COUNTRIES.find((c) => c.re.test(name));
        country = known
          ? { country: known.country, slug: known.slug, flag: known.flag, categories: [] }
          : { country: name, slug: slugify(name), flag: '', categories: [] };
        tree.push(country);
        cat = null;
      } else if (country) {                         // category
        cat = { name: heading, questions: [] };
        country.categories.push(cat);
      }
      continue;
    }

    if (line.startsWith('*') || line.startsWith('-')) {
      // Google Docs' Markdown export backslash-escapes punctuation it deems
      // significant (e.g. a period after a number: "2026." exports as "2026\.").
      // Strip those escapes so answers read as clean prose — a backslash before
      // punctuation is never intentional in the source Doc.
      const text = line.replace(/^[*-]\s*/, '').replace(/\s+/g, ' ')
        .replace(/\\([^\w\s])/g, '$1').trim();
      if (!text || !cat) continue;
      const q = text.indexOf('?');
      if (q !== -1 && q < text.length - 1) {        // new Q&A
        cat.questions.push({ q: text.slice(0, q + 1).trim(), a: text.slice(q + 1).trim() });
      } else if (cat.questions.length) {            // sub-item of previous answer
        const prev = cat.questions[cat.questions.length - 1];
        prev.a = (prev.a ? prev.a + ' ' : '') + text;
      }
    }
  }

  for (const c of tree) c.categories = c.categories.filter((k) => k.questions.length);
  return tree.filter((c) => c.categories.length);
}

/* Reject obviously-broken parses so we never overwrite good data with junk. */
function validate(tree) {
  if (!Array.isArray(tree) || tree.length < 3) return false;
  if (countTotal(tree) < 50) return false;
  for (const c of tree)
    for (const k of c.categories)
      for (const item of k.questions)
        if (!item.q || !item.a) return false;
  return true;
}

async function getMarkdown() {
  const fileArg = process.argv.indexOf('--file');
  if (fileArg !== -1 && process.argv[fileArg + 1]) {
    return readFileSync(process.argv[fileArg + 1], 'utf8');
  }
  const res = await fetch(EXPORT_URL, { redirect: 'follow' });
  if (!res.ok) throw new Error('export HTTP ' + res.status);
  return res.text();
}

async function main() {
  if (!process.env.VERCEL && !process.argv.includes('--force')) {
    console.log('[faq-sync] skipped (not on Vercel; pass --force to run locally)');
    return;
  }
  try {
    const md = await getMarkdown();
    const tree = parse(md);
    if (!validate(tree)) throw new Error(`validation failed (parsed ${countTotal(tree)} questions)`);
    const json = JSON.stringify(tree, null, 2);
    writeFileSync(GENERATED, json);
    if (process.argv.includes('--baseline')) writeFileSync(BASELINE, json);
    console.log(`[faq-sync] OK — ${tree.length} countries, ${countTotal(tree)} questions → data/faq.generated.json`);
  } catch (err) {
    console.warn('[faq-sync] FAILED — keeping last-known-good FAQs:', err.message);
    // Intentionally exit 0: never break the build.
  }
}

main();
