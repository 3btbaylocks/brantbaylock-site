(function(){
 const cfg=window.BB_CONFIG||{};

 document.querySelectorAll('[data-config-link]').forEach(a=>{
  const key=a.dataset.configLink;
  if(cfg[key])a.href=cfg[key];
 });

 const menu=document.querySelector('.menu-button');
 const nav=document.querySelector('.nav-links');
 if(menu&&nav){
  menu.addEventListener('click',()=>{
   const open=nav.classList.toggle('open');
   menu.setAttribute('aria-expanded',open);
  });
 }

 const currentFile=location.pathname.split('/').pop()||'index.html';
 document.querySelectorAll('.nav-links a').forEach(a=>{
  const linkFile=(a.getAttribute('href')||'').split('/').pop();
  if(linkFile===currentFile)a.classList.add('active');
 });

 // Florida brokerage identification beside website contact points.
 const brokerageName='Platinum Real Estate';
 function brokerageLine(context){
  const line=document.createElement('div');
  line.className='brokerage-affiliation'+(context?' brokerage-affiliation--'+context:'');
  line.textContent=brokerageName;
  line.setAttribute('aria-label','Brokerage: '+brokerageName);
  return line;
 }
 function hasContactPoint(root){
  return !!root.querySelector('a[href^="tel:"],a[href^="mailto:"],[data-config-link]');
 }
 document.querySelectorAll('main .contact-card').forEach(card=>{
  if(!hasContactPoint(card)||card.querySelector('.brokerage-affiliation'))return;
  const firstContact=card.querySelector('.contact-method,.btn-row,a[href^="tel:"],a[href^="mailto:"],[data-config-link]');
  if(firstContact)firstContact.insertAdjacentElement('beforebegin',brokerageLine('contact'));
 });
 document.querySelectorAll('main .btn-row').forEach(row=>{
  if(!hasContactPoint(row)||row.closest('.contact-card')||row.previousElementSibling?.classList.contains('brokerage-affiliation'))return;
  row.insertAdjacentElement('beforebegin',brokerageLine('contact'));
 });
 document.querySelectorAll('footer .footer-grid > div').forEach(column=>{
  const heading=column.querySelector(':scope > strong');
  const links=column.querySelector(':scope > .footer-links');
  if(!heading||!links||heading.textContent.trim()!=='Connect'||column.querySelector('.brokerage-affiliation'))return;
  links.insertAdjacentElement('beforebegin',brokerageLine('footer'));
 });

 function event(name,params){
  if(typeof window.gtag==='function')window.gtag('event',name,params||{});
 }

 // Google Analytics 4
 if(cfg.gaMeasurementId){
  const script=document.createElement('script');
  script.async=true;
  script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(cfg.gaMeasurementId);
  document.head.appendChild(script);
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('js',new Date());
  window.gtag('config',cfg.gaMeasurementId,{anonymize_ip:true});
 }

 // Microsoft Clarity
 if(cfg.clarityProjectId){
  (function(c,l,a,r,i,t,y){
   c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments);};
   t=l.createElement(r);
   t.async=1;
   t.src='https://www.clarity.ms/tag/'+i;
   y=l.getElementsByTagName(r)[0];
   y.parentNode.insertBefore(t,y);
  })(window,document,'clarity','script',cfg.clarityProjectId);
 }

 function linkLocation(el){
  if(el.closest('header'))return 'header';
  if(el.closest('footer'))return 'footer';
  if(el.closest('main'))return 'main';
  return 'other';
 }

 function classifiedLinkEvent(a){
  const sourcePage=location.pathname;
  const locationName=linkLocation(a);
  const rawHref=(a.getAttribute('href')||'').trim();
  const configKey=a.dataset.configLink||'';

  if(rawHref.startsWith('tel:')){
   return {name:'phone_click',params:{source_page:sourcePage,link_location:locationName}};
  }
  if(rawHref.startsWith('mailto:')){
   return {name:'email_click',params:{source_page:sourcePage,link_location:locationName}};
  }
  if(configKey){
   const formTypes={
    contactFormUrl:'general_contact',
    ownerIntroUrl:'owner_advisory',
    communityIntroUrl:'receiving_community',
    dischargeIntroUrl:'discharge_organization'
   };
   return {
    name:'contact_request_open',
    params:{form_type:formTypes[configKey]||configKey,source_page:sourcePage,link_location:locationName}
   };
  }

  let url;
  try{url=new URL(a.href,location.origin);}catch(_){return null;}
  if(url.hostname.includes('linkedin.com')){
   return {name:'linkedin_click',params:{source_page:sourcePage,link_location:locationName}};
  }
  if(url.origin!==location.origin)return null;

  const path=url.pathname.replace(/\/+$/,'')||'/';
  const eventMap={
   '/contact.html':'contact_page_open',
   '/owner-advisory.html':'owner_advisory_interest',
   '/market-intelligence.html':'market_intelligence_interest',
   '/weekend-placement-readiness.html':'wpr_interest',
   '/resources/first-step.html':'first_step_interest',
   '/resources/facility-impact-report.html':'fir_interest',
   '/professional-advisors.html':'advisor_resource_interest',
   '/insights.html':'insights_interest'
  };
  if(!eventMap[path])return null;
  return {
   name:eventMap[path],
   params:{destination_path:path,source_page:sourcePage,link_location:locationName}
  };
 }

 document.addEventListener('click',e=>{
  const target=e.target.closest('a,button');
  if(!target)return;

  if(target.dataset.track){
   event('cta_click',{cta:target.dataset.track,source_page:location.pathname,link_location:linkLocation(target)});
  }

  if(target.matches('a')){
   const classified=classifiedLinkEvent(target);
   if(classified)event(classified.name,classified.params);
  }
 });

 const seen=new Set();
 if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(entry.isIntersecting&&!seen.has(entry.target)){
     seen.add(entry.target);
     event('section_view',{section:entry.target.dataset.trackSection,source_page:location.pathname});
    }
   });
  },{threshold:.45});
  document.querySelectorAll('[data-track-section]').forEach(el=>observer.observe(el));
 }

 if(location.pathname==='/card/'||location.pathname==='/card'){
  event('business_card_visit',{page_path:'/card/'});
 }

 setTimeout(()=>event('page_engaged_15s',{page_path:location.pathname}),15000);
 setTimeout(()=>event('page_engaged_30s',{page_path:location.pathname}),30000);
})();

(function(){
 const base=location.pathname.startsWith('/brantbaylock-site')?'/brantbaylock-site':'';
 const css=document.createElement('link');
 css.rel='stylesheet';
 css.href=base+'/assets/v5-overrides.css?v=6.3';
 document.head.appendChild(css);
 const js=document.createElement('script');
 js.src=base+'/assets/v5-patch.js?v=6.2';
 js.async=false;
 document.head.appendChild(js);
})();