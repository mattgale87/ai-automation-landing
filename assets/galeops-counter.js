// GaleOps first-party pageview counter (loaded by /assets/galeops-counter.html snippet).
// Counts total_pageviews + unique_visitors (first-party cookie) into Netlify Blobs.
// Privacy-friendly: no PII, no third party, no consent banner needed.
(function () {
  try {
    var p = encodeURIComponent(location.pathname);
    new Image().src = "/count?p=" + p + "&t=" + Date.now();
  } catch (e) {}
})();
