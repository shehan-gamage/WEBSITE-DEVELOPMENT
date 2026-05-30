/* ═══════════════════════════════════════════════════
   SRP International — Cinematic Full-Screen Scroll FX
   Vanilla port of the React FullScreenScrollFX concept.
   Requires: gsap, ScrollTrigger (loaded via CDN, deferred).
═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Wait until GSAP + ScrollTrigger are ready (they're deferred). */
  function ready () {
    if (typeof window.gsap === 'undefined' ||
        typeof window.ScrollTrigger === 'undefined') {
      setTimeout(ready, 60);
      return;
    }
    init();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }

  /* ═══════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════ */
  function init () {
    /* Look for the hero FX container; fall back to legacy id */
    const root = document.getElementById('heroFx')
              || document.getElementById('globalPresence');
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    /* ── DOM references ─────────────────────────── */
    const fixedSection = root.querySelector('.fx-fixed-section');
    const fixed        = root.querySelector('.fx-fixed');
    const bgs          = root.querySelectorAll('.fx-bg-img');
    const featureds    = root.querySelectorAll('.fx-featured');
    const leftItems    = root.querySelectorAll('.fx-left-item');
    const rightItems   = root.querySelectorAll('.fx-right-item');
    const leftTrack    = root.querySelector('.fx-left .fx-track');
    const rightTrack   = root.querySelector('.fx-right .fx-track');
    const total = featureds.length;
    if (!total) return;

    /* ── State ──────────────────────────────────── */
    let currentIndex = 0;
    let isAnimating  = false;

    /* ── Respect reduced motion ─────────────────── */
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    /* Longer duration = silkier crossfades between countries.    */
    const D = reducedMotion ? 0.001 : 1.0;       /* change duration */

    /* ── Initial states ─────────────────────────── */
    gsap.set(bgs, { opacity: 0, scale: 1.04, yPercent: 0 });
    if (bgs[0]) gsap.set(bgs[0], { opacity: 1, scale: 1 });

    featureds.forEach((f, sIdx) => {
      const words = f.querySelectorAll('.fx-word');
      words.forEach(w => {
        gsap.set(w, {
          yPercent: sIdx === 0 ? 0 : 100,
          opacity:  sIdx === 0 ? 1 : 0,
        });
      });
    });

    /* ── Centre the active row inside both side tracks ── */
    function centreLists (toIndex, animate) {
      [
        { track: leftTrack,  items: leftItems  },
        { track: rightTrack, items: rightItems },
      ].forEach(({ track, items }) => {
        if (!track || !items.length) return;

        /* Skip on mobile — CSS already shows only the active item */
        if (window.innerWidth <= 900) {
          gsap.set(track, { y: 0 });
          return;
        }

        const first  = items[0];
        const second = items[1];
        const containerRect = track.parentElement.getBoundingClientRect();
        let rowH = first.getBoundingClientRect().height;
        if (second) {
          rowH = second.getBoundingClientRect().top - first.getBoundingClientRect().top;
        }
        const targetY = containerRect.height / 2 - rowH / 2 - toIndex * rowH;

        if (animate) {
          gsap.to(track, { y: targetY, duration: D * 0.9, ease: 'power3.out' });
        } else {
          gsap.set(track, { y: targetY });
        }
      });
    }

    /* Initial centre — wait two rafs for layout to settle */
    requestAnimationFrame(() => requestAnimationFrame(() => centreLists(0, false)));

    /* ═══════════════════════════════════════════════
       SECTION CHANGE — cross-fade bg + word reveal
    ═══════════════════════════════════════════════ */
    function changeSection (to) {
      if (to === currentIndex || isAnimating || to < 0 || to >= total) return;
      const from = currentIndex;
      const down = to > from;
      isAnimating = true;
      currentIndex = to;

      /* Active class toggles on featured panels (drives opacity via CSS) */
      featureds[from].classList.remove('active');
      featureds[to].classList.add('active');

      /* Word mask animations on the centre title */
      const outWords = featureds[from].querySelectorAll('.fx-word');
      const inWords  = featureds[to].querySelectorAll('.fx-word');

      if (outWords.length) {
        gsap.to(outWords, {
          yPercent: down ? -100 : 100,
          opacity:  0,
          duration: D * 0.6,
          stagger:  down ? 0.03 : -0.03,
          ease:     'power3.out',
        });
      }
      if (inWords.length) {
        gsap.set(inWords, { yPercent: down ? 100 : -100, opacity: 0 });
        gsap.to(inWords, {
          yPercent: 0,
          opacity:  1,
          duration: D,
          stagger:  down ? 0.05 : -0.05,
          ease:     'power3.out',
        });
      }

      /* Background cross-fade with subtle parallax drift */
      const prevBg = bgs[from];
      const newBg  = bgs[to];
      if (newBg) {
        gsap.set(newBg, { opacity: 0, scale: 1.04, yPercent: down ? 1 : -1 });
        gsap.to(newBg, {
          opacity: 1,
          scale:   1,
          yPercent: 0,
          duration: D,
          ease: 'power2.out',
        });
      }
      if (prevBg) {
        gsap.to(prevBg, {
          opacity: 0,
          yPercent: down ? -4 : 4,
          duration: D,
          ease: 'power2.out',
        });
      }

      /* Side label tracks centre the new active row */
      centreLists(to, true);

      leftItems.forEach((el, i) => {
        el.classList.toggle('active', i === to);
      });
      rightItems.forEach((el, i) => {
        el.classList.toggle('active', i === to);
      });

      gsap.delayedCall(D, () => { isAnimating = false; });
    }

    /* ═══════════════════════════════════════════════
       SCROLLTRIGGER — pin the section and step
       through indices based on scroll progress
    ═══════════════════════════════════════════════ */
    const st = ScrollTrigger.create({
      trigger: fixedSection,
      start:   'top top',
      end:     'bottom bottom',
      pin:     fixed,
      pinSpacing: true,
      /* anticipatePin smooths the moment the section pins, so the
         hand-off from page scroll to pinned scroll feels seamless. */
      anticipatePin: 1,
      /* Snap the scroll to each country boundary — gives a buttery,
         intentional glide instead of an abrupt index jump.          */
      snap: reducedMotion ? false : {
        snapTo: (value) => {
          /* total-1 segments (the last index sits at progress=1).   */
          return Math.round(value * (total - 1)) / (total - 1);
        },
        duration: { min: 0.35, max: 0.85 },
        delay:    0.08,
        ease:     'power3.inOut',
        inertia:  true,
      },
      onUpdate: (self) => {
        if (isAnimating) return;
        /* Use round() not floor() so the active index switches at
           the midpoint between two segments — keeps the change
           in sync with where the snap is gliding to.                */
        const target = Math.min(total - 1, Math.round(self.progress * (total - 1)));
        if (target !== currentIndex) {
          changeSection(target);
        }
      },
    });

    /* ═══════════════════════════════════════════════
       CLICK HANDLERS — jump to section
    ═══════════════════════════════════════════════ */
    function jumpTo (i) {
      const fsTop   = fixedSection.offsetTop;
      const fsH     = fixedSection.offsetHeight;
      /* Align with the snap math: section i lives at progress i/(total-1). */
      const targetY = fsTop + (fsH * i) / (total - 1 || 1);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
    leftItems.forEach((el, i)  => el.addEventListener('click', () => { jumpTo(i); resetAutoPlay(); }));
    rightItems.forEach((el, i) => el.addEventListener('click', () => { jumpTo(i); resetAutoPlay(); }));

    /* ═══════════════════════════════════════════════
       AUTO-PLAY — cycle countries every 5s while idle
       Any user interaction (scroll, side-label click,
       touch swipe) resets the 5-second window. Hero
       leaving the viewport pauses playback entirely.
    ═══════════════════════════════════════════════ */
    const AUTOPLAY_INTERVAL_MS = 5000;
    let autoPlayId   = null;
    let isHeroInView = true;

    function autoAdvance () {
      if (isAnimating) return;
      if (!isHeroInView) return;
      const next = (currentIndex + 1) % total;
      changeSection(next);
    }
    function startAutoPlay () {
      if (reducedMotion) return;        /* respect user motion preference */
      stopAutoPlay();
      autoPlayId = window.setInterval(autoAdvance, AUTOPLAY_INTERVAL_MS);
    }
    function stopAutoPlay () {
      if (autoPlayId !== null) {
        window.clearInterval(autoPlayId);
        autoPlayId = null;
      }
    }
    /* Called by every interaction handler — clears the current
       timer and starts a fresh 5-second window, so the next
       auto-advance won't fire until the user has been idle for 5s. */
    function resetAutoPlay () {
      if (isHeroInView) startAutoPlay();
    }

    /* Pause auto-play when the hero leaves the viewport */
    if ('IntersectionObserver' in window) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isHeroInView = entry.isIntersecting;
          if (entry.isIntersecting) startAutoPlay();
          else                       stopAutoPlay();
        });
      }, { threshold: 0.15 });
      heroObserver.observe(root);
    }

    /* Reset on any user interaction */
    window.addEventListener('scroll',     resetAutoPlay, { passive: true });
    window.addEventListener('wheel',      resetAutoPlay, { passive: true });
    window.addEventListener('touchstart', resetAutoPlay, { passive: true });

    /* Kick it off */
    startAutoPlay();

    /* ═══════════════════════════════════════════════
       RESIZE
    ═══════════════════════════════════════════════ */
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        centreLists(currentIndex, false);
        ScrollTrigger.refresh();
      }, 120);
    });
  }
})();
