/* FAQ page — live search filtering + jurisdiction scroll-spy. */
(function () {
  var content = document.getElementById('faqContent');
  if (!content) return;

  var search   = document.getElementById('faqSearch');
  var noResults = document.getElementById('faqNoResults');
  var queryEl  = document.getElementById('faqQuery');
  var items    = Array.prototype.slice.call(content.querySelectorAll('[data-item]'));
  var cats     = Array.prototype.slice.call(content.querySelectorAll('[data-cat]'));
  var countries = Array.prototype.slice.call(content.querySelectorAll('[data-country]'));

  /* ── Live search ── */
  function applyFilter() {
    var q = (search.value || '').trim().toLowerCase();
    var shown = 0;

    items.forEach(function (item) {
      var match = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
      item.classList.toggle('is-hidden', !match);
      if (match) shown++;
    });
    // Hide a category / country once all of its items are filtered out.
    cats.forEach(function (cat) {
      cat.classList.toggle('is-hidden', !cat.querySelector('[data-item]:not(.is-hidden)'));
    });
    countries.forEach(function (co) {
      co.classList.toggle('is-hidden', !co.querySelector('[data-item]:not(.is-hidden)'));
    });

    if (noResults) {
      noResults.hidden = !(q && shown === 0);
      if (queryEl) queryEl.textContent = search.value;
    }
  }

  if (search) {
    search.addEventListener('input', applyFilter);
    search.addEventListener('search', applyFilter);
  }

  /* ── Scroll-spy: highlight the jurisdiction in view ── */
  var links = Array.prototype.slice.call(document.querySelectorAll('.faq-nav-link'));
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (l) { byId[l.getAttribute('data-slug')] = l; });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        var active = byId[e.target.id];
        if (active) active.classList.add('is-active');
      });
    }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });

    countries.forEach(function (co) { spy.observe(co); });
  }
})();
