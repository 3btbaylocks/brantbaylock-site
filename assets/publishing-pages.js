async function loadContent(){
 const cfg=window.BB_CONFIG||{};
 if(cfg.contentApiUrl){try{return await new Promise((resolve,reject)=>{const cb='bbcb_'+Date.now();window[cb]=d=>{resolve(d.items||d);delete window[cb];s.remove()};const s=document.createElement('script');s.src=cfg.contentApiUrl+(cfg.contentApiUrl.includes('?')?'&':'?')+'callback='+cb;s.onerror=reject;document.head.appendChild(s);setTimeout(()=>reject(new Error('timeout')),7000)});}catch(e){console.warn('Content API unavailable; using fallback.',e)}}
 const r=await fetch('/content/content.json');return r.json();
}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function fmtDate(s){if(!s)return'';const d=new Date(s+'T12:00:00');return d.toLocaleDateString('en-US',{month:'long',year:'numeric'})}
function resourceHref(x){if(x.internalUrl)return x.internalUrl;if(x.slug==='owners-and-trusted-advisors')return '/resources/owners-and-trusted-advisors.html';return x.externalUrl||'#'}
function card(item){const href=item.internalUrl||item.externalUrl||('#');const ext=/^https?:/.test(href);return `<a class="card" href="${esc(href)}" ${ext?'target="_blank" rel="noopener"':''}><span class="tag">${esc(item.eyebrow||item.category||item.contentType)}</span><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><span class="more">${esc(item.ctaLabel||'Read more')}</span></a>`}
function corridorArchiveCard(item){return `<div class="card"><span class="tag">${esc(fmtDate(item.publishDate))}</span><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><span class="more">Privately circulated edition</span></div>`}
loadContent().then(items=>{
 items=(items||[]).filter(x=>x.status==='Published').sort((a,b)=>(a.sortOrder||999)-(b.sortOrder||999));
 const i=document.querySelector('#insights-list');if(i){const a=items.filter(x=>x.contentType==='Article');i.innerHTML=a.map(card).join('')}
 const o=document.querySelector('#observations-list');if(o){const a=items.filter(x=>x.contentType==='Owner Observation');o.innerHTML=a.map(card).join('')}
 const r=document.querySelector('#resources-list');if(r){const a=items.filter(x=>x.contentType==='Resource');r.innerHTML=a.map(x=>{const href=resourceHref(x);const ext=/^https?:/.test(href);return `<div class="resource-card"><div><div class="eyebrow">${esc(x.eyebrow||x.category)}</div><h3>${esc(x.title)}</h3><p>${esc(x.summary)}</p></div><a class="btn ghost" href="${esc(href)}" ${ext?'target="_blank" rel="noopener"':''}>${esc(x.ctaLabel||'Learn more')}</a></div>`}).join('')}
 const c=document.querySelector('#corridor-current');if(c){const x=items.find(x=>x.contentType==='Corridor Edition'&&x.currentEdition==='Yes')||items.find(x=>x.contentType==='Corridor Edition');c.innerHTML=x?`<div class="eyebrow">Current edition · ${esc(fmtDate(x.publishDate))}</div><h3>${esc(x.title)}</h3><p>${esc(x.summary)}</p><div class="btn-row"><a class="btn gold" href="/contact.html">Request the current edition</a></div>`:'<strong>Current edition unavailable.</strong>'}
 const archive=document.querySelector('#corridor-archive');if(archive){const a=items.filter(x=>x.contentType==='Corridor Edition'&&x.currentEdition!=='Yes');archive.innerHTML=a.map(corridorArchiveCard).join('')}
}).catch(console.error);
