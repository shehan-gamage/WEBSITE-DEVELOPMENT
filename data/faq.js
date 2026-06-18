/* ═══════════════════════════════════════════════════
   SRP International — Client FAQ (single source of truth)

   The FAQ content lives in the "WEBSITE - FAQ" Google Doc
   (docId 1JHKn9duE-J55ojpZ7tWW0t9GGfjA0jVmd96NlS_Ox2o). On every Vercel build,
   scripts/sync-faq.mjs fetches + parses it into data/faq.generated.json
   (a build artifact, gitignored). This loader prefers that fresh copy and
   falls back to the committed data/faq.baseline.json (last-known-good) if the
   sync didn't run or failed — so the FAQs can never break a deploy.

   FAQ_TREE here is the single source that drives ALL of:
     • the public /faq page (views/faq.ejs),
     • the chatbot's guided triage chips (/api/faq-tree), and
     • FAQ_KNOWLEDGE — the text block fed to the AI for free-text questions.
   ═══════════════════════════════════════════════════ */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function isValid(tree) {
  if (!Array.isArray(tree) || tree.length < 3) return false;
  const total = tree.reduce(
    (n, c) => n + (c.categories || []).reduce((m, k) => m + (k.questions || []).length, 0), 0);
  return total >= 50;
}

function load(file) {
  try {
    const tree = JSON.parse(readFileSync(join(__dirname, file), 'utf8'));
    return isValid(tree) ? tree : null;
  } catch {
    return null;
  }
}

/* Fresh build-time copy from the Google Doc, else committed last-known-good. */
export const FAQ_TREE = load('faq.generated.json') || load('faq.baseline.json') || [];

/* Serialize the tree into the AI's plain-text knowledge base (free-text path). */
function buildFaqKnowledge() {
  const out = ['=== SRP INTERNATIONAL — CLIENT FAQ (PRIMARY KNOWLEDGE BASE) ===',
    "Answer client inquiries from this FAQ first. Match the client's market when known.", ''];
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
