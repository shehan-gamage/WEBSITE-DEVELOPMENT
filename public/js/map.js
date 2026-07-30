/* ═══════════════════════════════════════════════════
   SRP International — Interactive Outline World Map
   v4 fixes: CSS svg scope · Singapore zoom · line weight · no city label
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── SRP offices ───────────────────────────────
     geo = [lon, lat] used for accurate placement
     AND as fallback zoom centre for tiny countries
  ─────────────────────────────────────────────────*/
  const SRP = {
    '826': { name: 'United Kingdom',       code: 'GB', iso2: 'gb', role: 'Europe',          geo: [ -2.5,  54.5 ], desc: 'Corporate services across the United Kingdom and Europe',           tag: 'Regional Office' },
    '784': { name: 'United Arab Emirates', code: 'AE', iso2: 'ae', role: 'Middle East',     geo: [ 54.0,  24.0 ], desc: 'Corporate services across the Middle East and GCC region',          tag: 'Regional Office' },
    '144': { name: 'Sri Lanka',            code: 'LK', iso2: 'lk', role: 'Head Office',     geo: [ 80.7,   7.9 ], desc: 'Corporate services across Sri Lanka and the South Asia region',     tag: 'Operational Hub' },
    '702': { name: 'Singapore',            code: 'SG', iso2: 'sg', role: 'South-East Asia', geo: [103.8,   1.4 ], desc: 'Corporate services across Singapore and the South-East Asia region', tag: 'Regional Office' },
    '344': { name: 'Hong Kong',            code: 'HK', iso2: 'hk', role: 'East Asia',       geo: [114.2,  22.3 ], desc: 'Corporate services across Hong Kong and the Greater China region',   tag: 'Regional Office' },
  };

  /* Flag URLs — flagcdn.com w160 for rectangular flags, with a
     local pre-made circular icon for UAE (flagcdn's 2:1 strip
     doesn't crop cleanly to a circle — all 4 UAE colours can't
     fit in a centred square crop).                                */
  const LOCAL_FLAGS = { ae: '/images/flags/ae.png' };
  const flagUrl = iso2 => LOCAL_FLAGS[iso2] || `https://flagcdn.com/w160/${iso2}.png`;

  /* ─── Brand ─────────────────────────────────── */
  const NAVY = '#061E75';

  /* ─── Boot ──────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }

  function tryInit () {
    if (typeof d3 === 'undefined' || typeof topojson === 'undefined') {
      setTimeout(tryInit, 80);
      return;
    }
    init();
  }

  /* ═══════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════ */
  function init () {
    const container = document.getElementById('worldMap');
    if (!container) return;
    container.innerHTML = '';

    const W = container.clientWidth  || 960;
    const H = Math.round(W * 0.505);

    /* ── SVG (transparent background) ─────────── */
    const svg = d3.select('#worldMap')
      .append('svg')
      .attr('viewBox', `0 0 ${W} ${H}`)
      .attr('width', '100%')
      .style('background', 'transparent')
      .attr('role', 'img')
      .attr('aria-label', 'Interactive world map — SRP International offices');

    const defs = svg.append('defs');

    /* Drop-shadow for flag badges */
    const sh = defs.append('filter').attr('id', 'fShadow')
      .attr('x','-60%').attr('y','-60%').attr('width','220%').attr('height','220%');
    sh.append('feDropShadow')
      .attr('dx','0').attr('dy','3').attr('stdDeviation','4')
      .attr('flood-color', NAVY).attr('flood-opacity','0.22');

    /* Shared clip-path — circle, centred at (0,0) in each marker's local space */
    defs.append('clipPath')
      .attr('id', 'flagClip')
      .append('circle')
        .attr('cx', 0).attr('cy', 0).attr('r', 19);

    /* ── Map group ─────────────────────────────── */
    const g = svg.append('g').attr('class', 'map-g');

    /* ── Mercator projection ────────────────────── */
    const proj = d3.geoMercator()
      .scale(W / 6.38)
      .translate([W / 2, H / 1.52]);

    const path = d3.geoPath().projection(proj);

    /* ── HTML tooltip ──────────────────────────── */
    const tip = d3.select('#worldMap')
      .append('div')
      .attr('class', 'map-tooltip')
      .style('opacity', '0')
      .style('pointer-events', 'none');

    /* ── State ─────────────────────────────────── */
    let activeId  = null;
    let animating = false;

    /* ═══════════════════════════════════════════
       LOAD DATA
    ═══════════════════════════════════════════ */
    /* 50m resolution — better small-country geometry (includes Singapore) */
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
      .then(buildMap)
      .catch(() => {
        container.innerHTML = '<div class="map-error">Map data unavailable.</div>';
      });

    /* ═══════════════════════════════════════════
       BUILD MAP
    ═══════════════════════════════════════════ */
    function buildMap (world) {
      const features = topojson.feature(world, world.objects.countries).features;

      /* ── Graticule ─────────────────────────────
         Very subtle lat/lon grid (30° step)
      ─────────────────────────────────────────── */
      const grat = d3.geoGraticule().step([30, 30]);
      g.append('path')
        .datum(grat())
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', `${NAVY}10`)
        .attr('stroke-width', 0.7)
        .attr('vector-effect', 'non-scaling-stroke');

      /* ── Country outlines — NO fill, heavier stroke ─
         Increased from 0.55 → 1.0 (regular) and
         0.9 → 1.8 (SRP countries) for clarity.
      ─────────────────────────────────────────── */
      const paths = g.selectAll('.country')
        .data(features)
        .enter()
        .append('path')
        .attr('class', d => `country${SRP[d.id] ? ' srp-c' : ''}`)
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', d => SRP[d.id] ? `${NAVY}70` : `${NAVY}38`)
        .attr('stroke-width', d => SRP[d.id] ? 1.8 : 1.0)
        .attr('vector-effect', 'non-scaling-stroke')
        .style('pointer-events', 'none');   /* paths are NOT hover targets */

      /* ── Border mesh overlay (country edges) ─── */
      g.append('path')
        .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
        .attr('fill', 'none')
        .attr('stroke', `${NAVY}22`)
        .attr('stroke-width', 0.5)
        .attr('vector-effect', 'non-scaling-stroke')
        .style('pointer-events', 'none');

      /* ── Flag / badge markers ──────────────────
         Positioned via geographic lon/lat — more
         reliable than path centroid for tiny
         countries like Singapore.
      ─────────────────────────────────────────── */
      const flagLayer = g.append('g').attr('class', 'flag-layer');

      /* Stagger float delay — each flag bobs at its own phase */
      const FLOAT_DELAYS = { '826': '0s', '784': '0.9s', '144': '1.8s', '702': '2.7s', '344': '3.6s' };
      const GOLD = '#CEAF71';

      /* Circle badge radius (SVG units) */
      const CR = 19;

      Object.entries(SRP).forEach(([id, info]) => {
        const [px, py] = proj(info.geo);
        if (isNaN(px) || isNaN(py)) return;

        const mg = flagLayer.append('g')
          .attr('class', 'flag-marker')
          .attr('data-id', id)
          .attr('transform', `translate(${px},${py})`);

        /* ── Invisible hit area (fixed, not animated) ── */
        mg.append('circle')
          .attr('r', 40)
          .attr('fill', 'rgba(0,0,0,0)')
          .attr('stroke', 'none')
          .style('cursor', 'pointer')
          .style('pointer-events', 'all');

        /* ── Inner group — all visuals float here ─── */
        const ig = mg.append('g')
          .attr('class', 'flag-inner')
          .style('animation-delay', FLOAT_DELAYS[id] || '0s');

        /* Gold spinning dashed orbit ring */
        ig.append('circle')
          .attr('class', 'flag-ring')
          .attr('r', CR + 7)
          .attr('fill', 'none')
          .attr('stroke', GOLD)
          .attr('stroke-width', 1.4)
          .attr('stroke-dasharray', '5 3')
          .attr('opacity', 0.65)
          .attr('vector-effect', 'non-scaling-stroke');

        /* Pin stem from bottom of circle to map surface */
        ig.append('line')
          .attr('x1', 0).attr('y1', CR)
          .attr('x2', 0).attr('y2', CR + 12)
          .attr('stroke', NAVY)
          .attr('stroke-width', 2)
          .attr('vector-effect', 'non-scaling-stroke');

        /* Pin dot at map surface */
        ig.append('circle')
          .attr('cy', CR + 13).attr('r', 3.5)
          .attr('fill', NAVY);

        /* ── White shadow disc (behind image, casts shadow) ── */
        ig.append('circle')
          .attr('cx', 0).attr('cy', 0).attr('r', CR)
          .attr('fill', '#FFFFFF')
          .attr('stroke', 'none')
          .attr('filter', 'url(#fShadow)');

        /* ── Flag image clipped to circle ─────────── */
        ig.append('image')
          .attr('href', flagUrl(info.iso2))
          .attr('x', -CR).attr('y', -CR)
          .attr('width', CR * 2).attr('height', CR * 2)
          .attr('clip-path', 'url(#flagClip)')
          .attr('preserveAspectRatio', 'xMidYMid slice')
          .style('pointer-events', 'none');

        /* ── Gold circle border on top of image ───── */
        ig.append('circle')
          .attr('cx', 0).attr('cy', 0).attr('r', CR)
          .attr('fill', 'none')
          .attr('stroke', GOLD)
          .attr('stroke-width', 2)
          .attr('vector-effect', 'non-scaling-stroke')
          .style('pointer-events', 'none');

        /* ── Hover events on outer group ──────────── */
        mg.on('mouseenter', function (event) {
            if (animating || activeId) return;
            zoomIn(id, features, paths, event);
          })
          .on('mousemove', function (event) {
            moveTip(event, id);
          });
      });

      /* ── Container mouseleave resets zoom ──────
         Once zoomed the flag badge is huge — reliable
         reset comes from leaving the whole map area.
      ─────────────────────────────────────────── */
      d3.select('#worldMap').on('mouseleave', function () {
        if (activeId) zoomOut(paths);
      });

      /* ════════════════════════════════════════
         ZOOM IN
      ════════════════════════════════════════ */
      function zoomIn (id, features, paths, event) {
        if (animating) return;
        activeId = id;

        /* Highlight hovered country, dim others */
        paths
          .attr('fill', d => String(d.id) === id ? `${NAVY}0C` : 'none')
          .attr('stroke', d => {
            const did = String(d.id);
            if (did === id)   return NAVY;
            if (SRP[did])     return `${NAVY}40`;
            return `${NAVY}15`;
          })
          .attr('stroke-width', d => String(d.id) === id ? 2.2 : (SRP[String(d.id)] ? 1.4 : 0.8))
          .attr('opacity', d => String(d.id) === id ? 1 : 0.4);

        /* Fade flag badges */
        flagLayer.selectAll('.flag-marker')
          .transition('fade').duration(180)
          .style('opacity', 0);

        /* Show tooltip */
        moveTip(event, id);

        /* Calculate zoom */
        const feat  = features.find(f => String(f.id) === id);
        const xform = calcZoom(feat, id);

        /* For tiny countries (Singapore, Bahrain, etc.) the path is
           invisible — draw a filled circle at the geo coordinate.
           It lives inside <g> so it scales with the zoom transform:
           r=1.8 at world scale → r≈14 at 8× → clearly visible. */
        if (xform?.isTiny) {
          g.append('circle')
            .attr('class', 'tiny-country-dot')
            .attr('cx', xform.cx)
            .attr('cy', xform.cy)
            .attr('r', 1.8)
            .attr('fill', `${NAVY}18`)
            .attr('stroke', NAVY)
            .attr('stroke-width', 0.5)
            .attr('vector-effect', 'non-scaling-stroke');
        }

        animating = true;
        g.transition('zoom')
          .duration(500)
          .ease(d3.easeCubicInOut)
          .attr('transform', xform
            ? `translate(${xform.tx},${xform.ty}) scale(${xform.k})`
            : null)
          .on('end', () => { animating = false; });
      }

      /* ════════════════════════════════════════
         ZOOM OUT
      ════════════════════════════════════════ */
      function zoomOut (paths) {
        activeId = null;
        tip.style('opacity', '0');

        /* Restore strokes */
        paths
          .attr('fill', 'none')
          .attr('stroke', d => SRP[String(d.id)] ? `${NAVY}70` : `${NAVY}38`)
          .attr('stroke-width', d => SRP[String(d.id)] ? 1.8 : 1.0)
          .attr('opacity', 1);

        /* Remove tiny-country dot before zooming out */
        g.selectAll('.tiny-country-dot').remove();

        animating = true;
        g.transition('zoom')
          .duration(420)
          .ease(d3.easeCubicOut)
          .attr('transform', 'translate(0,0) scale(1)')
          .on('end', () => {
            animating = false;
            /* Restore flags after map settles */
            flagLayer.selectAll('.flag-marker')
              .transition('fade').duration(240)
              .style('opacity', 1);
          });
      }

      /* ════════════════════════════════════════
         TOOLTIP  (no city label — avoids duplication)
      ════════════════════════════════════════ */
      function moveTip (event, id) {
        const info = SRP[id];
        if (!info) return;

        const rect = container.getBoundingClientRect();
        const mx   = event.clientX - rect.left;
        const my   = event.clientY - rect.top;
        const tx   = Math.max(8, Math.min(mx + 18, W - 230));
        const ty   = Math.max(8, my - 12);

        tip
          .style('opacity', '1')
          .style('left', tx + 'px')
          .style('top',  ty + 'px')
          .html(`
            <div class="mtt-header">
              <img class="flag-circle"
                   src="${flagUrl(info.iso2)}"
                   alt="${info.name} flag"
                   width="44" height="28">
              <div>
                <div class="mtt-name">${info.name}</div>
                <div class="mtt-role">${info.role}</div>
              </div>
            </div>
            ${info.desc ? `<div class="mtt-desc">${info.desc}</div>` : ''}
            ${info.tag ? `<div class="mtt-tag${info.tag === 'Operational Hub' ? ' mtt-tag--hq' : ''}">${info.tag}</div>` : ''}`);
      }

      /* ════════════════════════════════════════
         ZOOM CALC
         Returns { k, tx, ty, isTiny, cx, cy }
         ─ isTiny = true  → country is sub-pixel at
           world scale (Singapore, Bahrain, etc.).
           We centre on the stored geo coordinate and
           use a moderate zoom so surrounding context
           remains visible.
         ─ isTiny = false → fit country in 65% of
           the viewport, clamped 2×–13×.
      ════════════════════════════════════════ */
      function calcZoom (feature, id) {
        const b  = feature ? path.bounds(feature) : null;
        const bW = b ? Math.max(b[1][0] - b[0][0], 0) : 0;
        const bH = b ? Math.max(b[1][1] - b[0][1], 0) : 0;

        /* "Tiny" threshold: smaller than 15 px in either axis */
        const isTiny = !b || !isFinite(b[0][0]) || bW < 15 || bH < 15;

        let cx, cy, k;
        if (isTiny) {
          /* Use known lon/lat; zoom to 8× so surrounding region shows */
          [cx, cy] = proj(SRP[id]?.geo || [0, 0]);
          k = 8;
        } else {
          cx = (b[0][0] + b[1][0]) / 2;
          cy = (b[0][1] + b[1][1]) / 2;
          const fit = Math.min((W * 0.65) / bW, (H * 0.65) / bH);
          k = Math.min(Math.max(fit, 2), 13);
        }

        return { k, tx: W / 2 - k * cx, ty: H / 2 - k * cy, isTiny, cx, cy };
      }
    }
  }
})();
