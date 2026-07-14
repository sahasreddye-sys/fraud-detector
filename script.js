(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     LIVE LEDGER DEMO
     Purely illustrative synthetic feed — not connected to any
     real model. Flag rate is exaggerated so a visitor actually
     sees a flagged row within a few seconds.
     ============================================================ */
  var ledgerEl = document.getElementById("ledger-rows");

  function randomAmount() {
    // mostly small transactions, occasional large one
    var base = Math.random() < 0.9
      ? Math.random() * 180 + 5
      : Math.random() * 1800 + 300;
    return base.toFixed(2);
  }

  function randomTime() {
    var h = Math.floor(Math.random() * 24);
    var m = Math.floor(Math.random() * 60);
    return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
  }

  function randomId(counter) {
    return "TX-" + String(10000 + counter).slice(-6);
  }

  var txCounter = 0;
  var maxRows = 7;

  function buildRow(isFlagged, amount, time, id) {
    var row = document.createElement("div");
    row.className = "ledger-row" + (isFlagged ? " is-flagged" : "");

    var risk = isFlagged
      ? (0.7 + Math.random() * 0.29).toFixed(2)
      : (Math.random() * 0.35).toFixed(2);

    row.innerHTML =
      '<span class="mono">' + id + '</span>' +
      '<span class="mono">$' + amount + '</span>' +
      '<span class="mono">' + time + '</span>' +
      '<span class="mono">' + risk + '</span>' +
      '<span class="' + (isFlagged ? "status-flag" : "status-clear") + '">' +
        (isFlagged ? 'FLAGGED<span class="stamp-pop">FLAG</span>' : "CLEAR") +
      "</span>";

    return row;
  }

  function pushRow() {
    if (!ledgerEl) return;
    txCounter += 1;
    var isFlagged = Math.random() < 0.12; // exaggerated demo rate
    var row = buildRow(isFlagged, randomAmount(), randomTime(), randomId(txCounter));
    ledgerEl.appendChild(row);

    while (ledgerEl.children.length > maxRows) {
      ledgerEl.removeChild(ledgerEl.firstChild);
    }
  }

  if (ledgerEl) {
    // seed a few rows immediately so the panel isn't empty on load
    for (var i = 0; i < 5; i++) pushRow();
    if (!prefersReducedMotion) {
      window.setInterval(pushRow, 1400);
    }
  }

  /* ============================================================
     STAT COUNT-UP
     ============================================================ */
  var statEls = document.querySelectorAll(".stat-value");

  function animateStat(el) {
    var target = parseFloat(el.getAttribute("data-target"));
    if (isNaN(target)) return;
    var suffix = el.getAttribute("data-suffix") || "";
    var scale = parseFloat(el.getAttribute("data-scale")) || 1;
    var displayTarget = target * scale;
    var duration = 1100;
    var start = null;

    if (prefersReducedMotion) {
      el.textContent = (suffix === "%" ? Math.round(displayTarget) : displayTarget.toFixed(3)) + suffix;
      return;
    }

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = displayTarget * eased;
      el.textContent = (suffix === "%" ? Math.round(current) : current.toFixed(3)) + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  /* ============================================================
     SCROLL REVEALS (gallery cards + stats)
     ============================================================ */
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll(".gallery-card").forEach(function (card) {
      revealObserver.observe(card);
    });

    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statEls.forEach(function (el) { statObserver.observe(el); });
  } else {
    // fallback: no IntersectionObserver support — just show everything
    document.querySelectorAll(".gallery-card").forEach(function (card) {
      card.classList.add("is-visible");
    });
    statEls.forEach(animateStat);
  }
})();
