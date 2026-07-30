(function(){
 const cfg=window.BB_CONFIG||{};
 document.querySelectorAll('[data-config-link]').forEach(a=>{const k=a.dataset.configLink;if(cfg[k])a.href=cfg[k];});
 const menu=document.querySelector('.menu-button'), nav=document.querySelector('.nav-links');
 if(menu&&nav){menu.addEventListener('click',()=>{const o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',o);});}
 // active nav
 const p=location.pathname.split('/').pop()||'index.html'; document.querySelectorAll('.nav-links a').forEach(a=>{const ap=(a.getAttribute('href')||'').split('/').pop();if(ap===p)a.classList.add('active')});
 // analytics placeholders
 function event(name,params){if(typeof window.gtag==='function')window.gtag('event',name,params||{});}
 document.addEventListener('click',e=>{const a=e.target.closest('[data-track]');if(a)event('cta_click',{cta:a.dataset.track,page:location.pathname});});
 const seen=new Set(); if('IntersectionObserver'in window){new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting&&!seen.has(x.target)){seen.add(x.target);event('section_view',{section:x.target.dataset.trackSection,page:location.pathname});}}),{threshold:.45}).observe&&document.querySelectorAll('[data-track-section]').forEach(el=>{const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting&&!seen.has(x.target)){seen.add(x.target);event('section_view',{section:x.target.dataset.trackSection,page:location.pathname});}}),{threshold:.45});io.observe(el);});}
 setTimeout(()=>event('page_engaged_15s',{page:location.pathname}),15000);setTimeout(()=>event('page_engaged_30s',{page:location.pathname}),30000);
 // GA4
 if(cfg.gaMeasurementId){const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(cfg.gaMeasurementId);document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',cfg.gaMeasurementId,{anonymize_ip:true});}
 // Clarity
 if(cfg.clarityProjectId){(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script',cfg.clarityProjectId);}
})();
(function(){
 const base=location.pathname.startsWith('/brantbaylock-site')?'/brantbaylock-site':'';
 const css=document.createElement('link');css.rel='stylesheet';css.href=base+'/assets/v5-overrides.css?v=5';document.head.appendChild(css);
 const js=document.createElement('script');js.src=base+'/assets/v5-patch.js?v=5';js.async=false;document.head.appendChild(js);
})();
