/* ═══════════════════════════════════════════════════
   SRP International — Home Page JavaScript
   ═══════════════════════════════════════════════════ */

/* ── Timeline entrance animation ─────────────────── */
const timeline = document.querySelector('.timeline');
if (timeline) {
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        timelineObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  timelineObserver.observe(timeline);
}

/* ── Testimonial scroll: pause when off-screen ───────
   Saves GPU when the section isn't visible.          */
const tsOuter = document.querySelector('.ts-outer');
if (tsOuter) {
  const tsObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      tsOuter.querySelectorAll('.ts-col').forEach(col => {
        col.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
      });
    });
  }, { threshold: 0 });
  tsObserver.observe(tsOuter);

  /* Respect prefers-reduced-motion */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tsOuter.querySelectorAll('.ts-col').forEach(col => {
      col.style.animation = 'none';
    });
  }
}

/* ═══════════════════════════════════════════════════
   TILT CARDS — 12° max + cursor-following gloss
   Opt-in via [data-tilt] attribute on any card.
═══════════════════════════════════════════════════ */
(function () {
  /* Skip on touch devices and reduced-motion preferences */
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;

  const MAX_TILT = 12;        /* max degrees on each axis */
  const PERSPECTIVE = 1000;   /* px — lower = stronger 3D effect */

  cards.forEach(card => {
    let rafId = null;
    let lastEvent = null;

    function update () {
      if (!lastEvent) return;
      const rect = card.getBoundingClientRect();
      const x = lastEvent.clientX - rect.left;
      const y = lastEvent.clientY - rect.top;

      /* Normalise to 0–1 across the card surface */
      const px = Math.max(0, Math.min(1, x / rect.width));
      const py = Math.max(0, Math.min(1, y / rect.height));

      /* Tilt: cursor right → rotateY positive (right edge tilts away)
                cursor down  → rotateX negative (bottom tilts away) */
      const tiltY = (px - 0.5) *  2 * MAX_TILT;
      const tiltX = (py - 0.5) * -2 * MAX_TILT;

      card.style.transform =
        `perspective(${PERSPECTIVE}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      card.style.setProperty('--gloss-x', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--gloss-y', (py * 100).toFixed(1) + '%');

      rafId = null;
    }

    card.addEventListener('mouseenter', () => {
      card.classList.add('is-tilting');
      /* Disable the transition during active tracking — we want
         instant response. Re-enabled on mouseleave for smooth reset. */
      card.style.transition = 'transform 0.05s linear';
    });

    card.addEventListener('mousemove', e => {
      lastEvent = e;
      if (rafId === null) rafId = requestAnimationFrame(update);
    });

    card.addEventListener('mouseleave', () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      lastEvent = null;
      card.classList.remove('is-tilting');
      /* Restore the smooth ease-out reset transition */
      card.style.transition = '';
      card.style.transform = '';
    });
  });
})();
