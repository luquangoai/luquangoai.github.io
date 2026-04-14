// Filter
  document.getElementById('ro-filter').addEventListener('click',function(e){
    var b=e.target.closest('.ro-ftag');if(!b)return;
    document.querySelectorAll('.ro-ftag').forEach(function(x){x.classList.remove('active');});
    b.classList.add('active');
    var f=b.dataset.filter;
    document.querySelectorAll('.ro-card').forEach(function(c){
      c.style.display=(f==='all'||(' '+c.dataset.tags+' ').indexOf(' '+f+' ')>-1)?'':'none';
    });
  });
  // Cite dropdown
  function roCiteToggle(id){
    var el=document.getElementById(id),was=el.classList.contains('open');
    document.querySelectorAll('.ro-cw').forEach(function(w){w.classList.remove('open');});
    if(!was)el.classList.add('open');
  }
  document.addEventListener('click',function(e){
    if(!e.target.closest('.ro-cw'))
      document.querySelectorAll('.ro-cw').forEach(function(w){w.classList.remove('open');});
  });
  // Copy
  function roCopy(el,txt){
    navigator.clipboard.writeText(txt).then(function(){
      var o=el.innerHTML;el.classList.add('ro-copied');
      el.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Copied!';
      setTimeout(function(){el.innerHTML=o;el.classList.remove('ro-copied');},1800);
    });
    document.querySelectorAll('.ro-cw').forEach(function(w){w.classList.remove('open');});
  }
  // Lightbox
  function roLb(el){
    document.getElementById('ro-lb-img').src=el.querySelector('img').src;
    document.getElementById('ro-lb').classList.add('open');
    document.body.style.overflow='hidden';
  }
  function roLbClose(){
    document.getElementById('ro-lb').classList.remove('open');
    document.body.style.overflow='';
  }
  document.addEventListener('keydown',function(e){if(e.key==='Escape')roLbClose();});

(function(){
  const html=document.documentElement,btn=document.querySelector('[data-theme-toggle]');
  html.setAttribute('data-theme','light');
  let t='light';
  function icon(d){if(!btn)return;btn.innerHTML=d==='dark'?'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>':'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';btn.setAttribute('aria-label','Switch to '+(d==='dark'?'light':'dark')+' mode');}
  icon(t);
  if(btn)btn.addEventListener('click',()=>{t=t==='dark'?'light':'dark';html.setAttribute('data-theme',t);icon(t);});
  const nl=document.querySelectorAll('nav a[href^="#"]'),ids=['overview','education','experience','projects','services','publications','awards','skills'];
  window.addEventListener('scroll',()=>{let c='overview';ids.forEach(id=>{const e=document.getElementById(id);if(e&&window.scrollY>=e.offsetTop-75)c=id;});nl.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+c));});
  nl.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const el=document.querySelector(a.getAttribute('href'));if(el)el.scrollIntoView({behavior:'smooth',block:'start'});}));
})();

(function(){
    var url = "https://scholar.google.com/citations?user=w1pGUPMAAAAJ&hl=en";
    var proxy = "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);
    fetch(proxy)
      .then(function(r){ return r.text(); })
      .then(function(text){
        // gsc_rsb_std contains: citations-all, citations-since2019, h-index-all, h-index-since2019, i10-all, i10-since2019
        var nums = [];
        var re = /class="gsc_rsb_std">(\d+)<\/td>/g;
        var m;
        while((m = re.exec(text)) !== null){ nums.push(parseInt(m[1])); }
        // indices: 0=cite-all, 1=cite-5y, 2=h-all, 3=h-5y, 4=i10-all, 5=i10-5y
        if(nums[0]){ var e=document.getElementById('gs-cite'); if(e) e.textContent=nums[0].toLocaleString(); }
        if(nums[2]){ var e=document.getElementById('gs-h');    if(e) e.textContent=nums[2]; }
        if(nums[4]){ var e=document.getElementById('gs-i10');  if(e) e.textContent=nums[4]; }
      })
      .catch(function(){});
  })();

function spCopy(btn,text){
    var t=text.replace(/\\n/g,'\n');
    navigator.clipboard.writeText(t).then(function(){
      var orig=btn.innerHTML;btn.innerHTML='&#10003; Copied!';
      setTimeout(function(){btn.innerHTML=orig;},1800);
    });
    btn.closest('.sp-cite-menu').classList.remove('open');
  }
  function spToggle(btn){
    var menu=btn.nextElementSibling;
    var wasOpen=menu.classList.contains('open');
    document.querySelectorAll('.sp-cite-menu').forEach(function(m){m.classList.remove('open');});
    if(!wasOpen)menu.classList.add('open');
  }
  document.addEventListener('click',function(e){
    if(!e.target.closest('.sp-cite-dropdown'))
      document.querySelectorAll('.sp-cite-menu').forEach(function(m){m.classList.remove('open');});
  });
  function lbOpen(src){document.getElementById('lb-img').src=src;document.getElementById('lb-overlay').classList.add('active');document.body.style.overflow='hidden';}
  function lbClose(){document.getElementById('lb-overlay').classList.remove('active');document.body.style.overflow='';}
  document.addEventListener('keydown',function(e){if(e.key==='Escape')lbClose();});

function secNavClose(){}
