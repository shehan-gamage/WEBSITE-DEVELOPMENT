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

function openChat() {
  chatOpen = true;
  chatPanel.classList.add('open');
  chatToggle.querySelector('.icon-chat').style.display = 'none';
  chatToggle.querySelector('.icon-close').style.display = 'block';
  chatInput.focus();
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

function appendMsg(text, type) {
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
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
  showTyping();
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    removeTyping();
    if (!res.ok) throw new Error();
    const data = await res.json();
    appendMsg(data.reply, 'bot');
  } catch {
    removeTyping();
    appendMsg('I\'m sorry, I\'m unable to respond right now. Please <a href="/contact" style="color:var(--navy);font-weight:600">contact our team directly</a> and we\'ll be happy to help.', 'bot');
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
