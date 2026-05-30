/* ═══════════════════════════════════════════════════
   SRP International — About Page
   Team gallery lightbox controller
═══════════════════════════════════════════════════ */
(function () {
  const dataEl  = document.getElementById('teamData');
  const gallery = document.getElementById('teamGallery');
  const lb      = document.getElementById('teamLightbox');
  if (!dataEl || !gallery || !lb) return;

  /* Team data injected by EJS as a JSON island */
  let team;
  try { team = JSON.parse(dataEl.textContent); } catch (e) { return; }
  if (!Array.isArray(team) || !team.length) return;

  /* DOM refs */
  const elImg         = document.getElementById('tgLbImg');
  const elPlaceholder = document.getElementById('tgLbPlaceholder');
  const elInitials    = document.getElementById('tgLbInitials');
  const elName        = document.getElementById('tgLbName');
  const elRole        = document.getElementById('tgLbRole');
  const elLinkedin    = document.getElementById('tgLbLinkedin');
  const elIndex       = document.getElementById('tgLbIndex');
  const btnClose      = document.getElementById('tgLbClose');
  const btnPrev       = document.getElementById('tgLbPrev');
  const btnNext       = document.getElementById('tgLbNext');

  let current = 0;
  let prevFocus = null;

  /* ── Render a slide ───────────────────────────── */
  function render (idx) {
    current = ((idx % team.length) + team.length) % team.length;
    const m = team[current];

    if (m.photo) {
      elImg.src = m.photo;
      elImg.alt = m.name;
      elImg.hidden = false;
      elPlaceholder.hidden = true;
    } else {
      elImg.hidden = true;
      elImg.removeAttribute('src');
      elInitials.textContent = m.initials || '';
      elPlaceholder.hidden = false;
    }
    elName.textContent = m.name;
    elRole.textContent = m.role;
    elLinkedin.href = m.linkedin || '#';
    elIndex.textContent = current + 1;
  }

  /* ── Open / close ─────────────────────────────── */
  function open (idx) {
    prevFocus = document.activeElement;
    render(idx);
    lb.hidden = false;
    /* next frame → trigger fade-in transition */
    requestAnimationFrame(() => lb.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    btnClose.focus();
    document.addEventListener('keydown', onKey);
  }

  function close () {
    lb.classList.remove('is-open');
    document.removeEventListener('keydown', onKey);
    setTimeout(() => {
      lb.hidden = true;
      document.body.style.overflow = '';
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    }, 280);
  }

  function next () { render(current + 1); }
  function prev () { render(current - 1); }

  /* ── Keyboard ─────────────────────────────────── */
  function onKey (e) {
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  }

  /* ── Tile click → open ────────────────────────── */
  gallery.querySelectorAll('.tg-tile').forEach(tile => {
    tile.addEventListener('click', e => {
      /* Ignore clicks on the inline LinkedIn icon
         (it has its own stopPropagation but be safe). */
      if (e.target.closest('.tg-linkedin')) return;
      const i = parseInt(tile.dataset.index, 10);
      if (!isNaN(i)) open(i);
    });
  });

  /* ── Controls ─────────────────────────────────── */
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  /* Click background (not on frame) → close */
  lb.addEventListener('click', e => {
    if (e.target === lb) close();
  });

  /* ── Touch swipe ──────────────────────────────── */
  let touchStart = null;
  lb.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend',   e => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) (diff > 0 ? next : prev)();
    touchStart = null;
  });
})();
