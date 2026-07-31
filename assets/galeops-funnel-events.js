(function () {
  'use strict';

  function track(name, params) {
    if (!name || typeof window.gtag !== 'function') return;
    window.gtag('event', name, Object.assign({
      event_category: 'funnel',
      page_path: window.location.pathname
    }, params || {}));
  }

  window.galeopsTrack = track;

  document.addEventListener('click', function (event) {
    var element = event.target.closest('[data-funnel-event]');
    if (!element) return;

    track(element.getAttribute('data-funnel-event'), {
      link_url: element.href || '',
      link_text: (element.textContent || '').trim().slice(0, 100)
    });
  });
}());
