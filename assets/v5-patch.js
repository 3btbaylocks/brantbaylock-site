(function(){
  const base=location.pathname.startsWith('/brantbaylock-site')?'/brantbaylock-site':'';
  let logo=base+'/assets/img/brand-mark.png';

  function applyBrand(){
    document.querySelectorAll('.brand img,.footer-brand img,.signature-lockup img,.hero-signature img').forEach(img=>{
      img.src=logo;
      img.alt='Brant Baylock signature logo';
    });
    const icon=document.querySelector('link[rel="icon"]');
    if(icon) icon.href=logo;
    const heroCopy=document.querySelector('.hero-copy');
    if(heroCopy&&!heroCopy.querySelector('.hero-signature')){
      const d=document.createElement('div');
      d.className='hero-signature';
      const i=document.createElement('img');
      i.src=logo;
      i.alt='Brant Baylock signature logo';
      d.appendChild(i);
      const eyebrow=heroCopy.querySelector('.eyebrow');
      heroCopy.insertBefore(d,eyebrow||heroCopy.firstChild);
    }
    document.querySelectorAll('.portrait-badge img').forEach(img=>img.remove());
  }

  async function loadExactLogo(){
    try{
      const parts=await Promise.all([1,2,3].map(i=>
        fetch(base+'/assets/logo-'+i+'.txt?v=5.1',{cache:'no-store'}).then(r=>{
          if(!r.ok) throw new Error('logo chunk '+i+' unavailable');
          return r.text();
        })
      ));
      logo='data:image/webp;base64,'+parts.map(s=>s.trim()).join('');
      applyBrand();
      document.body.classList.add('v5-brand-ready');
    }catch(err){
      console.warn('Signature logo fallback in use.',err);
      applyBrand();
    }
  }

  const rules=[
    ['For Facility Owners and Their Trusted Advisors','For Community Owners and Their Trusted Advisors'],
    ['FIRst Step: The First Step to Facility Clarity','FIRst Step: The First Step to Community Clarity'],
    ['A facility story that needs clarity before the market judges it','A community story that needs clarity before the market judges it'],
    ['Two levels of facility clarity.','Two levels of community clarity.'],
    ['Preliminary facility signal brief','Preliminary community signal brief'],
    ['preliminary facility signal brief','preliminary community signal brief'],
    ['The first step to facility clarity.','The first step to community clarity.'],
    ['A preliminary facility signal brief','A preliminary community signal brief'],
    ['Early facility signals','Early community signals'],
    ['Whether deeper facility review is warranted','Whether deeper community review is warranted'],
    ['A deeper diagnostic for facility performance, value pressure, and transition planning.','Facility Impact Report (FIR): a deeper diagnostic for community performance, value pressure, and transition planning.'],
    ['A deeper advisory report designed to help ownership understand how facility performance, market position, buyer fit, lender confidence, and transition readiness may affect value and decision-making','The Facility Impact Report (FIR) is a deeper advisory report designed to help ownership understand how community performance, market position, buyer fit, lender confidence, and transition readiness may affect value and decision-making'],
    ['organizes the facility story','organizes the community story'],
    ['Executive summary and facility snapshot','Executive summary and community snapshot'],
    ['a facility-side interpretation','a community-side interpretation'],
    ['Facility Impact Report and FIRst Step','Facility Impact Report (FIR) and FIRst Step'],
    ['FIRst Step, Facility Impact Report, decision tools','FIRst Step, Facility Impact Report (FIR), decision tools'],
    ['The Facility Impact Report goes deeper','The Facility Impact Report (FIR) goes deeper']
  ];

  function correctText(root){
    if(!root)return;
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(w.nextNode())nodes.push(w.currentNode);
    nodes.forEach(n=>{
      let t=n.nodeValue;
      for(const [a,b] of rules)t=t.split(a).join(b);
      if(t!==n.nodeValue)n.nodeValue=t;
    });
    root.querySelectorAll?.('.tag,.eyebrow,h1,h2,h3,.more').forEach(el=>{
      const t=el.textContent.trim();
      if(t==='Facility Impact Report')el.textContent='Facility Impact Report (FIR)';
      if(t==='Facility')el.textContent='Community';
    });
  }

  function run(){
    applyBrand();
    correctText(document.body);
    loadExactLogo();
  }

  run();
  new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{
    if(n.nodeType===1){applyBrand();correctText(n);}
  }))).observe(document.body,{childList:true,subtree:true});
})();
