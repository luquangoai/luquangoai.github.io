// ── Theme toggle (dùng localStorage để sync giữa 2 trang) ────
(function() {
  var html = document.documentElement;
  var btn  = document.querySelector('[data-theme-toggle]');
  var saved = localStorage.getItem('theme') || 'light';
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
    localStorage.setItem('theme', t);
    icon(t);
  });
})();

// ── Smooth scroll + active highlight (index.html) ─────────────
(function() {
  var ids = ['overview','education','experience','projects','services','selected-papers','awards','skills'];
  var anchors = document.querySelectorAll('nav a[href^="#"]');
  if (!anchors.length) return;

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

  // Scroll đến section khi vào từ publications.html#education
  if (location.hash) {
    setTimeout(function() {
      var el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }
})();

// ── Google Scholar metrics ────────────────────────────────────
(function() {
  var proxy = "https://api.allorigins.win/raw?url=" +
    encodeURIComponent("https://scholar.google.com/citations?user=w1pGUPMAAAAJ&hl=en");
  fetch(proxy).then(function(r){ return r.text(); }).then(function(text) {
    var nums = [], re = /class="gsc_rsb_std">(\d+)<\/td>/g, m;
    while ((m = re.exec(text)) !== null) nums.push(parseInt(m[1]));
    if (nums[0]) { var e=document.getElementById('gs-cite'); if(e) e.textContent=nums[0].toLocaleString(); }
    if (nums[2]) { var e=document.getElementById('gs-h');    if(e) e.textContent=nums[2]; }
    if (nums[4]) { var e=document.getElementById('gs-i10');  if(e) e.textContent=nums[4]; }
  }).catch(function(){});
})();

// ── Cite copy ─────────────────────────────────────────────────
function spCopy(btn, text) {
  navigator.clipboard.writeText(text.replace(/\\n/g,'\n')).then(function() {
    var orig = btn.innerHTML; btn.innerHTML = '&#10003; Copied!';
    setTimeout(function(){ btn.innerHTML = orig; }, 1800);
  });
  btn.closest('.sp-cite-menu').classList.remove('open');
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
  if (!o||!i) return; i.src=src; o.classList.add('active'); document.body.style.overflow='hidden';
}
function lbClose() {
  var o = document.getElementById('lb-overlay');
  if (o) o.classList.remove('active'); document.body.style.overflow='';
}
document.addEventListener('keydown', function(e){ if(e.key==='Escape') lbClose(); });
