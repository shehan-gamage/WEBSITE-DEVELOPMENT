/* ═══════════════════════════════════════════════════
   SRP International — Global JavaScript
   ═══════════════════════════════════════════════════ */

// ── Nav scroll shadow ─────────────────────────────
// Every page gets the same treatment: the nav floats transparently
// over the dark hero at the top, then transitions to the frosted
// white state once the user scrolls past it. We dynamically measure
// the hero (home cinematic FX or inner-page navy hero) so the switch
// happens at the right moment regardless of hero height.
const navbar = document.getElementById('navbar');
if (navbar) {
  const heroEl =
    document.getElementById('heroFx') ||
    document.querySelector('.page-hero') ||
    document.querySelector('main > section:first-child');

  const getThreshold = () => {
    if (heroEl) {
      // Engage frosted state slightly before the hero ends so the
      // hand-off feels smooth (90% of hero height).
      return heroEl.offsetTop + heroEl.offsetHeight * 0.9 - 80;
    }
    return 10;
  };

  const updateNav = () => {
    navbar.classList.toggle('scrolled', window.scrollY > getThreshold());
  };
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav, { passive: true });
}

// ── Mobile hamburger ──────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ── Chatbot ───────────────────────────────────────
const chatToggle = document.getElementById('chatToggle');
const chatPanel  = document.getElementById('chatPanel');
const chatClose  = document.getElementById('chatClose');
const chatBody   = document.getElementById('chatBody');
const chatInput  = document.getElementById('chatInput');
const chatSend   = document.getElementById('chatSend');

let chatOpen = false;
let guidedStarted = false;   // guided triage flow runs once, on first open
let faqTree = null;          // cached /api/faq-tree response

function openChat() {
  chatOpen = true;
  chatPanel.classList.add('open');
  chatToggle.querySelector('.icon-chat').style.display = 'none';
  chatToggle.querySelector('.icon-close').style.display = 'block';
  chatInput.focus();
  if (!guidedStarted) { guidedStarted = true; startGuidedFlow(); }
}
function closeChat() {
  chatOpen = false;
  chatPanel.classList.remove('open');
  chatToggle.querySelector('.icon-chat').style.display = 'block';
  chatToggle.querySelector('.icon-close').style.display = 'none';
}

if (chatToggle) {
  chatToggle.addEventListener('click', () => chatOpen ? closeChat() : openChat());
}
if (chatClose) {
  chatClose.addEventListener('click', closeChat);
}

// Conversation history sent to the API for context (real turns only;
// the greeting bubble in the HTML is purely visual).
const chatHistory = [];

/* Render text safely WITHOUT innerHTML: build text + anchor nodes only, so
   neither user input nor model output can inject markup. Auto-links URLs and
   email addresses. */
function renderText(text, parent) {
  const re = /(https?:\/\/[^\s<>]+)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parent.appendChild(document.createTextNode(text.slice(last, m.index)));
    const a = document.createElement('a');
    if (m[1]) { a.href = m[1]; a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    else { a.href = `mailto:${m[2]}`; }
    a.textContent = m[0];
    parent.appendChild(a);
    last = re.lastIndex;
  }
  if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
}

function appendMsg(text, type) {
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  renderText(text, bubble);
  div.appendChild(bubble);
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Error bubble with a real /contact link (built from nodes, not innerHTML).
function appendError() {
  const div = document.createElement('div');
  div.className = 'msg bot';
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.appendChild(document.createTextNode("I'm sorry, I'm unable to respond right now. Please "));
  const a = document.createElement('a');
  a.href = '/contact';
  a.textContent = 'contact our team directly';
  bubble.appendChild(a);
  bubble.appendChild(document.createTextNode(" and we'll be happy to help."));
  div.appendChild(bubble);
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping() {
  const t = document.createElement('div');
  t.id = 'typingIndicator';
  t.className = 'msg bot';
  t.innerHTML = `<div class="typing-bubble"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  chatBody.appendChild(t);
  chatBody.scrollTop = chatBody.scrollHeight;
}
function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

async function sendChat() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  chatInput.disabled = true;
  chatSend.disabled = true;
  appendMsg(text, 'user');
  chatHistory.push({ role: 'user', content: text });
  showTyping();
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory.slice(-12) })
    });
    removeTyping();
    if (!res.ok) throw new Error();
    const data = await res.json();
    appendMsg(data.reply, 'bot');
    chatHistory.push({ role: 'assistant', content: data.reply });
  } catch {
    removeTyping();
    appendError();
  } finally {
    chatInput.disabled = false;
    chatSend.disabled  = false;
    chatInput.focus();
  }
}

if (chatSend) {
  chatSend.addEventListener('click', sendChat);
}
if (chatInput) {
  chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendChat(); });
}

// ── Guided FAQ triage (chips): country → service → question → answer/Others ──
async function loadFaqTree() {
  if (faqTree) return faqTree;
  const res = await fetch('/api/faq-tree');
  if (!res.ok) throw new Error('faq tree');
  faqTree = (await res.json()).tree;
  return faqTree;
}

/* Render a row of quick-reply chips. On click the group is consumed, the choice
   is echoed as the user's message, then onSelect() advances the flow. */
function appendChips(items, opts) {
  const wrap = document.createElement('div');
  wrap.className = 'chat-chips' + (opts && opts.stack ? ' chat-chips--stack' : '');
  items.forEach(it => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chat-chip' + (it.variant ? ` chat-chip--${it.variant}` : '');
    btn.textContent = it.label;
    btn.addEventListener('click', () => {
      wrap.remove();
      appendMsg(it.label, 'user');
      it.onSelect();
    });
    wrap.appendChild(btn);
  });
  chatBody.appendChild(wrap);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Absolute fallback — "Others" or an unmapped jurisdiction routes to a consultation.
function appendConsultationCTA(lead) {
  appendMsg(lead || 'For specific or customised inquiries, we recommend speaking directly with our advisory team. Schedule a call or share your details and a member of our team will get back to you within 24 hours.', 'bot');
  const wrap = document.createElement('div');
  wrap.className = 'chat-chips';
  const a = document.createElement('a');
  a.className = 'chat-cta-btn';
  a.href = '/contact';
  a.textContent = 'Schedule a Consultation →';
  wrap.appendChild(a);
  chatBody.appendChild(wrap);
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function startGuidedFlow() {
  try {
    await loadFaqTree();
  } catch {
    appendMsg('How can I help you today? Ask me anything about our services, or share your details and our team will be in touch.', 'bot');
    return;
  }
  renderCountryStep('To get started, please select the country or jurisdiction where you require our services:');
}

function renderCountryStep(prompt) {
  appendMsg(prompt, 'bot');
  appendChips(faqTree.map(c => ({ label: c.country, onSelect: () => chooseCountry(c) })));
}

function chooseCountry(c) {
  if (!c.categories || !c.categories.length) {
    appendConsultationCTA(`We don't have a quick FAQ for ${c.country} just yet — but our team can absolutely help. Let's get you connected.`);
    return;
  }
  appendMsg(`Great. What specific service are you looking for in ${c.country}?`, 'bot');
  appendChips(c.categories.map(cat => ({ label: cat.name, onSelect: () => chooseService(c, cat) })));
}

function chooseService(c, cat) {
  appendMsg(`Here are some frequently asked questions about ${cat.name} in ${c.country}. Select a topic, or choose “Others” if you have a different question:`, 'bot');
  const chips = cat.questions.slice(0, 6).map(item => ({ label: item.q, onSelect: () => chooseQuestion(c, cat, item) }));
  chips.push({ label: 'Others 💬', variant: 'others', onSelect: () => appendConsultationCTA() });
  appendChips(chips, { stack: true });
}

function chooseQuestion(c, cat, item) {
  appendMsg(item.a, 'bot');
  appendChips([
    { label: 'Ask another question', onSelect: () => chooseService(c, cat) },
    { label: 'Change service', onSelect: () => chooseCountry(c) },
    { label: 'Change country', onSelect: () => renderCountryStep('Which country or jurisdiction can we help you with?') },
    { label: 'Talk to our team 💬', variant: 'others', onSelect: () => appendConsultationCTA() },
  ]);
}

// ── Scroll reveal ─────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated counters ─────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

// ── Back-to-top ───────────────────────────────────
(function () {
  const toTop = document.getElementById('toTop');
  if (!toTop) return;
  const THRESHOLD = 300;
  const onScroll = () => toTop.classList.toggle('is-visible', window.scrollY > THRESHOLD);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();
