'use strict';
(()=>{
const escText=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function num(v,unit='',digits){return v==null||!Number.isFinite(v)?'資料なし':v.toLocaleString('ja-JP',digits==null?{}:{maximumFractionDigits:digits})+unit;}
function statBlock(record,title,explanation=''){
 if(!record)return `<section class="dex-data" data-dex-data><b>${escText(title)}</b><p>この地域の統計は収録されていません。</p>${explanation?`<small>${escText(explanation)}</small>`:''}</section>`;
 const rows=[['自治体コード',record.code||'資料なし'],['人口',num(record.population,'人')],['男性',num(record.male,'人')],['女性',num(record.female,'人')],['世帯数',num(record.households,'世帯')],['面積',num(record.area,' km²',2)],['人口密度',num(record.density,'人/km²',1)],['人口増減率（2015→2020年）',num(record.change,' %',2)]];
 return `<section class="dex-data" data-dex-data><b>${escText(title)}</b>${explanation?`<p>${escText(explanation)}</p>`:''}<small>2020年10月1日時点。現在の人口・境域とは異なる場合があります。</small><dl>${rows.map(([k,v])=>`<div><dt>${escText(k)}</dt><dd>${escText(v)}</dd></div>`).join('')}</dl>${record.reorganized?'<small>※2024年再編前の行政区画です。</small><br>':''}<a href="https://www.stat.go.jp/data/kokusei/2020/kekka.html" target="_blank" rel="noopener noreferrer">令和2年国勢調査</a> ・ <a href="SOURCE-NOTES.md" target="_blank" rel="noopener noreferrer">出典・面積データ</a></section>`;
}
function addDetails(){
 const zd=document.getElementById('zd');if(zd&&ZT==='normal'&&ZS&&zd.querySelector('#svh')&&!zd.querySelector('[data-dex-data]')){
  if(CITY_P[ZS]){const r=window.ghStatistics?.byName.get(ZS);zd.insertAdjacentHTML('beforeend',statBlock(r,'市区町村の統計'));}
  else if(PREF.includes(ZS)){zd.insertAdjacentHTML('beforeend','<section class="dex-data" data-dex-data><b>地域データ</b><p>都道府県全体の人口・面積統計は本編に収録されていません。市区町村マップから各市区町村の統計をご覧ください。</p></section>');}
 }
 const md=document.getElementById('md'),model=md?.querySelector('[data-model-name]');if(!model||md.querySelector('[data-dex-data]'))return;
 const n=model.dataset.modelName,content=model.closest('section')||model.parentElement.parentElement;
 const town=TOWN_BY_NAME.get(n);if(town){const code=town.code.slice(0,5);const r=window.GH_STATISTICS?.records.find(x=>x.code===code);const info=`町丁コード：${town.code}。以下は${town.city}全体の統計で、この町丁だけの数値ではありません。`;content.insertAdjacentHTML('beforeend',statBlock(r,'所属する市区町村の統計',info));return;}
 const lake=LAKE_BY[n];if(lake){const cells=[['所在地',lake.locality],['資料面積',lake.sourceAreaKm2==null?null:num(lake.sourceAreaKm2,' km²',3)],['資料最大水深',lake.depth==null?null:num(lake.depth,' m',2)],['標高',lake.elevation==null?null:num(lake.elevation,' m',2)],['緯度・経度',lake.lat!=null&&lake.lon!=null?`${lake.lat}, ${lake.lon}`:null]];const html=cells.filter(([,v])=>v!=null&&v!=='').map(([k,v])=>`<div><dt>${escText(k)}</dt><dd>${escText(v)}</dd></div>`).join('');content.insertAdjacentHTML('beforeend',`<section class="dex-data" data-dex-data><b>湖の資料データ</b><small>元データに収録された参考値（2005年基準）</small><dl>${html}</dl><a href="SOURCE-NOTES.md" target="_blank" rel="noopener noreferrer">データの出典</a></section>`);return;}
}
function clean(){
 const root=document.getElementById('zukan');if(!root)return;addDetails();
 for(const el of root.querySelectorAll('small, .town-card-meta')){const t=el.textContent.trim();if(/^所持\s*\d+\s*／/.test(t))el.textContent=t.replace(/^所持\s*\d+\s*／\s*/, '');else if(el.matches('.town-card-meta')||/^(?:Lv\s*\d+|固有(?:なし|：)|所持\s*[×\d]|未所持)/.test(t))el.style.display='none';}
 for(const el of root.querySelectorAll('button'))if(/ガチャ出典/.test(el.textContent))el.textContent='出典';
 for(const el of root.querySelectorAll('select[aria-label*="所持状況"],#past-own,#lake-own,#ua-own,#pre-own'))el.style.display='none';
 for(const el of root.querySelectorAll('#zsvg text')){let t=el.textContent;if(/^\d+\/\d+$/.test(t))el.textContent=t.split('/')[1];}
 const h=document.getElementById('zh');if(h){for(const div of h.querySelectorAll('div')){const t=div.textContent;if(/^島\s*[\d,]+\s*\/\s*[\d,]+$/.test(t))div.textContent=t.replace(/[\d,]+\s*\/\s*/, '');}}if(h)for(const node of h.childNodes){if(node.nodeType===Node.TEXT_NODE){const a=node.nodeValue,b=a.replace(/\b\d+\/(\d+)\b/g,'$1');if(a!==b)node.nodeValue=b;}if(node.nodeType===Node.ELEMENT_NODE&&node.tagName==='B'&&/^\d+\/\d+$/.test(node.textContent))node.textContent=node.textContent.split('/')[1];}
 for(const s of root.querySelectorAll('.gh-island-card small'))if(/(?:所持|未所持)/.test(s.textContent))s.style.display='none';
 const zd=document.getElementById('zd');if(zd&&!zd.querySelector('#svh')){const sm=zd.querySelector('small');if(sm&&/所持済み|未所持|収集数/.test(sm.textContent))sm.textContent='タップで地域を選択。ピンチ・ホイールで拡大、ドラッグで移動できます。右のボタンでも操作できます。';}
 const stats=document.getElementById('gh-statistics');if(stats){for(const el of stats.querySelectorAll('small,button')){if(/戦闘能力や排出確率|現在地に合わせる/.test(el.textContent))el.style.display='none'}}
 const modal=document.getElementById('md');if(modal){for(const el of modal.querySelectorAll('.model-hint')){if(!el.dataset.dexHint){el.dataset.dexHint='1';el.textContent='ドラッグで回転。輪郭を押し出した模型で、実際の標高ではありません。';}}}
}
function start(){if(!window.GH_READY)return;window.removeEventListener('standalone-dex-ready',start);try{worldTick=()=>{};if(window.ghStatistics?.root)window.ghStatistics.root.ghBack=()=>{window.ghStatistics.root.classList.remove('on');openZukan()};document.getElementById('title').style.display='none';window.TITLE=false;document.getElementById('modal').style.display='none';openZukan();clean();const obs=new MutationObserver(()=>{if(obs.pending)return;obs.pending=true;requestAnimationFrame(()=>{obs.pending=false;clean()})});obs.observe(document.getElementById('zukan'),{subtree:true,childList:true});obs.observe(document.getElementById('md'),{subtree:true,childList:true});if(document.getElementById('gh-statistics'))obs.observe(document.getElementById('gh-statistics'),{subtree:true,childList:true});}catch(e){console.error('図鑑の起動エラー',e)}}
window.addEventListener('standalone-dex-ready',start);if(window.GH_READY)start();
})();
(()=>{const style=document.createElement('style');style.textContent='#gh-emergency-rescue,#gh-world-dex-button,#gh-statistics-dex-button,.gh-stat-inline button,.gh-dex-battle,button[aria-label="図鑑から戻る"],#toast{display:none!important}';document.head.appendChild(style)})();
(()=>{const style=document.createElement('style');style.textContent='#gh-emergency-rescue{visibility:hidden!important;width:0!important;min-width:0!important;padding:0!important;border:0!important;overflow:hidden!important}';document.head.appendChild(style)})();

(()=>{const style=document.createElement('style');style.textContent=`.dex-data{margin:10px 0 2px;padding:10px 12px;background:#fffaf0;border:1px solid #d6c5a2;border-radius:9px;font-size:12px;line-height:1.55;text-align:left}.dex-data b{font-size:13px;color:#60451e}.dex-data p{margin:4px 0}.dex-data small{display:block;color:#6b796c}.dex-data dl{display:grid;grid-template-columns:1fr 1fr;gap:0 14px;margin:6px 0}.dex-data dl div{display:flex;justify-content:space-between;gap:8px;border-bottom:1px solid #e8e1d2;padding:3px 0}.dex-data dt{color:#6b796c}.dex-data dd{margin:0;text-align:right;font-weight:bold}.dex-data a{color:#315f83}@media(max-width:480px){.dex-data dl{grid-template-columns:1fr}}`;document.head.appendChild(style)})();
