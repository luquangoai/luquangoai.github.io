// ── Theme toggle — synced via localStorage ────────────────────
(function() {
  var html = document.documentElement;
  var btn  = document.querySelector('[data-theme-toggle]');
  var saved = (function(){try{return localStorage.getItem('theme')||'light';}catch(e){return 'light';}})();
  html.setAttribute('data-theme', saved);
  function icon(d) {
    if (!btn) return;
    btn.innerHTML = d === 'dark'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.setAttribute('aria-label', 'Switch to ' + (d === 'dark' ? 'light' : 'dark') + ' mode');
  }
  icon(saved);
  if (btn) btn.addEventListener('click', function() {
    var t = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch(e) {}
    icon(t);
  });
})();

// ── Smooth scroll + active highlight (index.html only) ────────
(function() {
  var anchors = document.querySelectorAll('nav a[href^="#"], .hov-nav-menu a[href^="#"]');
  if (!anchors.length) return;
  var ids = ['overview','education','experience','projects','services','selected-papers','awards','skills'];

  window.addEventListener('scroll', function() {
    var c = 'overview';
    ids.forEach(function(id) {
      var el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 80) c = id;
    });
    anchors.forEach(function(a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + c);
    });
  });

  anchors.forEach(function(a) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      var el = document.querySelector(a.getAttribute('href'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (location.hash) {
    setTimeout(function() {
      var el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }
})();

// ── Google Scholar metrics (multi-proxy, auto-refresh) ────────
(function() {
  var GS_URL = "https://scholar.google.com/citations?user=w1pGUPMAAAAJ&hl=en";
  var PROXIES = [
    "https://api.allorigins.win/raw?url=",
    "https://corsproxy.io/?",
    "https://api.codetabs.com/v1/proxy?quest="
  ];

  var elCite = document.getElementById('gs-cite');
  var elH    = document.getElementById('gs-h');
  var elI10  = document.getElementById('gs-i10');
  var elWrap = document.getElementById('gs-metrics');

  if (!elCite) return;

  // Show loading dots
  [elCite, elH, elI10].forEach(function(el) {
    if (el) { el.setAttribute('data-orig', el.textContent); el.textContent = '…'; }
  });

  function parse(text) {
    var nums = [], re = /class="gsc_rsb_std">(\d+)<\/td>/g, m;
    while ((m = re.exec(text)) !== null) nums.push(parseInt(m[1]));
    return nums;
  }

  function update(nums) {
    if (!nums || nums.length < 5) return false;
    if (nums[0] && elCite) elCite.textContent = nums[0].toLocaleString();
    if (nums[2] && elH)    elH.textContent    = nums[2];
    if (nums[4] && elI10)  elI10.textContent  = nums[4];
    // Flash update indicator
    if (elWrap) { elWrap.classList.add('gs-updated'); setTimeout(function(){ elWrap.classList.remove('gs-updated'); }, 1200); }
    return true;
  }

  function restore() {
    [elCite, elH, elI10].forEach(function(el) {
      if (el && el.getAttribute('data-orig')) el.textContent = el.getAttribute('data-orig');
    });
  }

  function tryProxy(i) {
    if (i >= PROXIES.length) { restore(); return; }
    fetch(PROXIES[i] + encodeURIComponent(GS_URL), { signal: AbortSignal.timeout(6000) })
      .then(function(r) { return r.text(); })
      .then(function(text) {
        var nums = parse(text);
        if (!update(nums)) tryProxy(i + 1);
      })
      .catch(function() { tryProxy(i + 1); });
  }

  tryProxy(0);
})();

// ── Cite copy (sp-) ───────────────────────────────────────────
function spCopy(btn, text) {
  navigator.clipboard.writeText(text.replace(/\\n/g,'\n')).then(function() {
    var orig = btn.innerHTML; btn.innerHTML = '&#10003; Copied!';
    setTimeout(function(){ btn.innerHTML = orig; }, 1800);
  });
  if (btn.closest('.sp-cite-menu')) btn.closest('.sp-cite-menu').classList.remove('open');
}
function spToggle(btn) {
  var menu = btn.nextElementSibling;
  var was  = menu.classList.contains('open');
  document.querySelectorAll('.sp-cite-menu').forEach(function(m){ m.classList.remove('open'); });
  if (!was) menu.classList.add('open');
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('.sp-cite-dropdown'))
    document.querySelectorAll('.sp-cite-menu').forEach(function(m){ m.classList.remove('open'); });
});

// ── Lightbox ─────────────────────────────────────────────────
function lbOpen(src) {
  var o = document.getElementById('lb-overlay'), i = document.getElementById('lb-img');
  if (!o || !i) return;
  i.src = src; o.classList.add('active'); document.body.style.overflow = 'hidden';
}
function lbClose() {
  var o = document.getElementById('lb-overlay');
  if (o) o.classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e){ if (e.key === 'Escape') lbClose(); });
