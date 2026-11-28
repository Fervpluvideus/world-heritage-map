
/* Additional data providers and historical overlays. No paid API calls. */
const EXTRA_DEFS=[
 {id:'unesco',title:'UNESCO 世界遗产',enabled:true,color:'#b58a28'},
 {id:'pleiades',title:'Pleiades 古代地名',enabled:false,color:'#8a624e'}
];
const extraControls=new Map(),extraStates=new Map();
function extraEnabled(d){return extraControls.get(d.id)?.checked===true}
function openInventory(p){return String(p.licence_class||'').toLowerCase()==='open'&&String(p.id||'').toLowerCase()!=='epsg:4326'}
function saveExtraSources(){prefs.extraLayers=Object.fromEntries(EXTRA_DEFS.map(d=>[d.id,extraEnabled(d)]));writePrefs()}
function resetExtraSources(){for(const d of EXTRA_DEFS){const i=extraControls.get(d.id);if(i){i.checked=d.enabled;if(d.enabled)loadExtra(d)}}saveExtraSources();refreshExtraStatus();queueAggregation()}
function refreshExtraStatus(){$('extraStatus').textContent=EXTRA_DEFS.filter(extraEnabled).map(d=>{const s=extraStates.get(d.id);return d.title+'：'+(s?.state==='ready'?s.rows.length+' 个坐标记录':s?.state==='loading'?'加载中…':s?.state==='error'?'失败（'+s.error+'）':'等待加载')}).join(' · ');refreshLayerDetailsSummary()}
function plainSourceText(v){return String(v||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim().slice(0,1800)}
function validCoords(lon,lat){return [lon,lat].every(v=>v!==''&&v!==null&&v!==undefined&&Number.isFinite(Number(v)))&&Math.abs(Number(lon))<=180&&Math.abs(Number(lat))<=90}
function externalFeature(p,lon,lat){return {geometry:{type:'Point',coordinates:[Number(lon),Number(lat)]},properties:{...p,lat:Number(lat),lon:Number(lon)}}}
function unescoFeatures(r){
 const id=String(r.id_no||'');if(!/^\d+$/.test(id))return [];
 const name=clean(r.name_en),zh=clean(r.name_zh);if(!name&&!zh)return [];
 const base={sourceId:'unesco',sourceLabel:'UNESCO 世界遗产名录',catKey:'worldheritage',hasDesignation:true,conditionKey:'unknown',name,name_en:name,name_zh:zh,recordUrl:'https://whc.unesco.org/en/list/'+id+'/',recordIntro:plainSourceText(r.short_description_zh||r.short_description_en),recordIntroLang:r.short_description_zh?'zh':'en',recordCredit:'UNESCO · '+(clean(r.category)||'类别未标明')+' · CC BY-SA 4.0',kind:'世界遗产'};
 let comp=[];try{comp=typeof r.components_list==='string'?JSON.parse(r.components_list):r.components_list||[]}catch(e){}
 const valid=Array.isArray(comp)?comp.filter(c=>validCoords(c.longitude,c.latitude)):[];
 if(valid.length)return valid.map((c,i)=>externalFeature({...base,id:id+'-'+String(c.ref||i),recordCredit:base.recordCredit+(c.name?' · 分项：'+clean(c.name):'')},c.longitude,c.latitude));
 const g=r.coordinates?.geometry||r.coordinates,coords=g?.type==='Point'?[g.coordinates]:g?.type==='MultiPoint'?g.coordinates:[];
 if(coords.length)return coords.filter(c=>Array.isArray(c)&&validCoords(c[0],c[1])).map((c,i)=>externalFeature({...base,id:id+'-'+i},c[0],c[1]));
 const pt=r.geo_point_2d,lat=Array.isArray(pt)?pt[0]:pt?.lat,lon=Array.isArray(pt)?pt[1]:pt?.lon;
 return validCoords(lon,lat)?[externalFeature({...base,id},lon,lat)]:[];
}
async function loadUNESCO(){
 const rows=[],seen=new Set();let offset=0,total=Infinity;
 const fields='id_no,name_en,name_zh,short_description_en,short_description_zh,category,coordinates,components_list,geo_point_2d';
 while(offset<total&&offset<10000){
  const q=new URLSearchParams({select:fields,limit:'100',offset:String(offset),order_by:'id_no'});
  const data=await fetchJson('https://data.unesco.org/api/explore/v2.1/catalog/datasets/whc001/records?'+q,{},25000);
  if(!Array.isArray(data.results)||!Number.isFinite(Number(data.total_count)))throw Error('UNESCO 数据格式异常');
  total=Number(data.total_count);if(!data.results.length)break;
  for(const rec of data.results)for(const f of unescoFeatures(rec)){const key=f.properties.id;if(!seen.has(key)){seen.add(key);rows.push(f)}}
  offset+=data.results.length;
 }
 if(!rows.length||offset<total)throw Error('未获取完整可定位名录');return rows;
}
function readCSV(text,onRow){
 let row=[],field='',quoted=false;
 for(let i=0;i<text.length;i++){
  const ch=text[i];
  if(quoted){if(ch==='"'){if(text[i+1]==='"'){field+='"';i++}else quoted=false}else field+=ch}
  else if(ch==='"'&&!field)quoted=true;
  else if(ch===','){row.push(field);field=''}
  else if(ch==='\n'){row.push(field.replace(/\r$/,''));onRow(row);row=[];field=''}
  else field+=ch;
 }
 if(quoted)throw Error('CSV 引号不完整');
 if(row.length||field){row.push(field.replace(/\r$/,''));onRow(row)}
}
function pleiadesFeatures(csv){
 const rows=[];let ix=null;
 readCSV(csv.replace(/^\uFEFF/,''),a=>{
  if(!ix){ix=Object.fromEntries(a.map((v,i)=>[v.trim(),i]));for(const k of ['id','title','representative_longitude','representative_latitude'])if(!(k in ix))throw Error('Pleiades 缺少字段 '+k);return}
  const get=k=>clean(a[ix[k]]),id=get('id'),name=get('title'),lon=get('representative_longitude'),lat=get('representative_latitude');
  if(!/^\d+$/.test(id)||!name||!validCoords(lon,lat))return;
  rows.push(externalFeature({id,sourceId:'pleiades',sourceLabel:'Pleiades 古代地理数据库',name,catKey:'ancientplace',kind:'古代地理实体',conditionKey:'unknown',hasDesignation:false,recordUrl:'https://pleiades.stoa.org/places/'+id,recordCredit:'代表坐标（精度：'+(get('location_precision')||'未标明')+'），并非遗址精确位置 · Pleiades contributors / CC BY 3.0',recordIntro:plainSourceText(get('description')),approxLocation:true},lon,lat));
 });
 if(!rows.length)throw Error('Pleiades 未返回可定位记录');return rows;
}
async function loadPleiades(){
 const res=await fetch('https://raw.githubusercontent.com/isawnyu/pleiades.datasets/main/data/gis/places.csv',{signal:AbortSignal.timeout(90000)});
 if(!res.ok)throw Error('HTTP '+res.status);
 const csv=await res.text();if(csv.length>35000000)throw Error('数据过大');return pleiadesFeatures(csv);
}
function indexExternal(rows){const index=new Map();for(const f of rows){const [lon,lat]=f.geometry.coordinates,key=Math.floor(lon===180?-180:lon)+'|'+Math.floor(lat);if(!index.has(key))index.set(key,[]);index.get(key).push(f)}return index}
async function loadExtra(d){
 if(!extraEnabled(d)||['loading','ready'].includes(extraStates.get(d.id)?.state))return;
 const s={state:'loading',rows:[]};extraStates.set(d.id,s);refreshExtraStatus();
 try{s.rows=await(d.id==='unesco'?loadUNESCO():loadPleiades());s.index=indexExternal(s.rows);s.state='ready'}catch(e){s.state='error';s.error=String(e.message||e).slice(0,80)}
 finally{refreshExtraStatus();queueAggregation()}
}
function extraVisibleFeatures(center,size,pad=0,collect=null){
 const out=[],condition=$('conditionFilter').value,designation=$('designationFilter').value,b=map.getBounds(),dx=(b.getEast()-b.getWest())*pad/Math.max(1,size.clientWidth),dy=(b.getNorth()-b.getSouth())*pad/Math.max(1,size.clientHeight),west=b.getWest()-dx,east=b.getEast()+dx,south=Math.max(-90,b.getSouth()-dy),north=Math.min(90,b.getNorth()+dy);
 for(const d of EXTRA_DEFS){
  const s=extraStates.get(d.id);if(!extraEnabled(d)||s?.state!=='ready')continue;
  let candidates=s.rows;
  if(east-west<120&&north-south<70&&s.index){
   candidates=[];const used=new Set();
   for(let x=Math.floor(west);x<=Math.floor(east);x++)for(let y=Math.floor(south);y<=Math.floor(north);y++){const k=(((x+180)%360+360)%360-180)+'|'+y;if(!used.has(k)){used.add(k);candidates.push(...(s.index.get(k)||[]))}}
  }
  for(const f of candidates){
   const [lon,y]=f.geometry.coordinates,x=lon+360*Math.round((center.lng-lon)/360);if(y<south||y>north||x<west||x>east||!passesCategory(f.properties,condition,designation))continue;
   const xy=map.project([x,y]);if(xy.x< -pad||xy.y< -pad||xy.x>size.clientWidth+pad||xy.y>size.clientHeight+pad)continue;
   const item={...f,xy,geometry:{type:'Point',coordinates:[x,y]}};if(collect){if(!collect(item))return null}else out.push(item);
  }
 }
 return out;
}
function initExtraSources(){
 for(const d of EXTRA_DEFS){
  const lab=document.createElement('label'),i=document.createElement('input'),dot=document.createElement('span');i.type='checkbox';i.checked=prefEnabled('extraLayers',d.id,d.enabled);dot.className='sw';dot.style.background=d.color;lab.append(i,dot,d.title);$('extraFilters').append(lab);extraControls.set(d.id,i);
  i.onchange=()=>{saveExtraSources();if(i.checked)loadExtra(d);refreshExtraStatus();queueAggregation()};
 }
 afterInitialPaint(()=>{for(const d of EXTRA_DEFS)if(extraEnabled(d))loadExtra(d)});
 initHistoryMaps();
}
const OHM_LAYERS=[
 ['place_areas','line','#967044',1.3],['landuse_areas','fill','#d7bf8b',0.18],['water_areas','fill','#78a9be',0.34],
 ['buildings','fill','#b77c51',0.48],['transport_lines','line','#a95f3d',1.6],['other_lines','line','#86654b',1.3],['water_lines','line','#4b91a9',1.4]
];
function historicalYearFilter(year){return ['all',['any',['has','start_decdate'],['has','end_decdate']],['<=',['to-number',['coalesce',['get','start_decdate'],-100000],-100000],year],['>=',['to-number',['coalesce',['get','end_decdate'],100000],100000],year]]}
function setOHM(){
 const enabled=$('ohmToggle').checked,year=Number($('ohmYear').value);
 if(!enabled){for(let i=0;i<OHM_LAYERS.length;i++){const id='ohm-history-'+i;if(map.getLayer(id))map.setLayoutProperty(id,'visibility','none')}updateHistoryControls();return}
 if(!$('ohmYear').value||!Number.isInteger(year)||year<-3000||year>2026){$('archiveStatus').textContent='请输入 -3000 至 2026 的整数年份。';return}
 if(!map.getSource('ohm-history'))map.addSource('ohm-history',{type:'vector',tiles:['https://vtiles.openhistoricalmap.org/maps/ohm/{z}/{x}/{y}.pbf'],minzoom:0,maxzoom:20,attribution:'<a href="https://www.openhistoricalmap.org/copyright">OpenHistoricalMap · CC0 except where noted</a>'});
 for(const [i,[sourceLayer,type,color,value]] of OHM_LAYERS.entries()){
  const id='ohm-history-'+i,filter=historicalYearFilter(year);
  if(map.getLayer(id)){map.setFilter(id,filter);map.setLayoutProperty(id,'visibility',archiveHidden?'none':'visible')}
  else map.addLayer({id,type,source:'ohm-history','source-layer':sourceLayer,filter,layout:{visibility:archiveHidden?'none':'visible'},paint:type==='fill'?{'fill-color':color,'fill-opacity':value}:{'line-color':color,'line-width':value,'line-opacity':0.88}},map.getLayer('agg-icons')?'agg-icons':undefined);
 }
 $('archiveStatus').textContent='历史矢量地图：'+year+' 年初；仅显示具有时间信息的要素。';updateHistoryControls();
}
let archiveSearchGeneration=0,archiveSelected=null;
function archiveId(value){
 const raw=String(value||'').trim();if(/^[a-f0-9]{16}(?:@[a-f0-9]{16})?$/i.test(raw))return raw;
 try{const u=new URL(raw);if(u.hostname==='viewer.allmaps.org')return archiveId(u.searchParams.get('url'));if(u.hostname==='annotations.allmaps.org'||u.hostname==='allmaps.xyz'||u.hostname==='api.allmaps.org'){const m=/^\/maps\/([a-f0-9]{16}(?:@[a-f0-9]{16})?)(?:\/|$)/i.exec(u.pathname);return m?.[1]||''}}catch(e){}
 return '';
}
function annotationList(data){return data?.type==='Annotation'?[data]:Array.isArray(data?.items)?data.items:[]}
function archiveRecord(a){
 const id=archiveId(a?.id||'');if(!id)return null;
 const target=Array.isArray(a.target)?a.target[0]:a.target;
 const src=target?.source,meta=typeof src==='object'&&src?src:{};
 const imageUrl=safeHttpUrl(typeof src==='string'?src:meta.id||meta['@id']);
 const part=Array.isArray(meta.partOf)?meta.partOf[0]:meta.partOf,manifestUrl=safeHttpUrl(part?.id||part?.['@id']);
 const l=meta.label||part?.label||a.label;
 let title=typeof l==='string'?l:Array.isArray(l)?l[0]:l?.zh?.[0]||l?.en?.[0]||l?.none?.[0]||Object.values(l||{}).flat().find(x=>typeof x==='string');
 const rumsey=[imageUrl,manifestUrl].some(s=>/https?:\/\/(?:[^/]+\.)?davidrumsey\.com\//i.test(s));
 return {id,title:clean(title)||'已配准地图 '+id,rumsey,imageUrl,manifestUrl};
}
function archiveViewer(id){return 'https://viewer.allmaps.org/?url='+encodeURIComponent('https://annotations.allmaps.org/maps/'+id)}

let archiveLoadGeneration=0,archiveWatch=null,archiveHidden=false,archiveSpec=null,archiveResume=null;
function archiveMessage(t){$('archiveStatus').textContent=t;$('archiveToastText').textContent=t;$('archiveToast').hidden=archiveHidden;updateArchivePickerState();updateHistoryControls()}
function updateHistoryControls(){const raster=!!archiveSpec||!!archiveSelected,ohm=$('ohmToggle').checked,active=raster||ohm;$('historyDock').hidden=!active;$('historyVisibility').textContent=archiveHidden?'恢复历史地图':'暂时隐藏地图';$('historyVisibility').setAttribute('aria-pressed',String(archiveHidden));$('historyVisibility').disabled=!active;$('historyClose').disabled=!active;$('historyDockTitle').textContent=archiveHidden?'历史地图 · 已隐藏':raster?'馆藏历史地图':'历史矢量地图';}
function toggleHistoryVisibility(){if(!archiveSpec&&!archiveSelected&&!$('ohmToggle').checked)return;archiveHidden=!archiveHidden;if(map.getLayer('archive-overlay'))map.setLayoutProperty('archive-overlay','visibility',archiveHidden?'none':'visible');for(let i=0;i<OHM_LAYERS.length;i++){const id='ohm-history-'+i;if(map.getLayer(id))map.setLayoutProperty(id,'visibility',!archiveHidden&&$('ohmToggle').checked?'visible':'none')}if(archiveHidden){stopArchiveWatch();$('archiveToast').hidden=true}else if(archiveSpec?.watch){archiveSpec.watch()}updateHistoryControls()}
function closeHistoryOverlays(){archiveHidden=false;$('ohmToggle').checked=false;setOHM();clearArchive();updateHistoryControls()}
function stopArchiveWatch(){
 if(!archiveWatch)return;
 clearTimeout(archiveWatch.timer);map.off('sourcedata',archiveWatch.data);map.off('error',archiveWatch.error);archiveWatch=null;
}
function removeArchiveLayer(){
 stopArchiveWatch();
 if(map.getLayer('archive-overlay'))map.removeLayer('archive-overlay');
 if(map.getSource('archive-overlay'))map.removeSource('archive-overlay');
}
function clearArchive(){
 ++archiveLoadGeneration;removeArchiveLayer();archiveSelected=null;archiveSpec=null;archiveResume=null;
 $('rumseyXYZRights').checked=false;$('archiveStatus').textContent='老地图已关闭。';$('archiveToast').hidden=true;updateArchivePickerState();updateHistoryControls();
}
function validArchiveBounds(b){return Array.isArray(b)&&b.length===4&&b.every(Number.isFinite)&&b[0]>=-180&&b[2]<=180&&b[1]>=-85.0512&&b[3]<=85.0512&&b[2]>b[0]&&b[3]>b[1]}
function footprintBounds(data){
 if(validArchiveBounds(data?.bbox))return data.bbox;
 const points=[];
 function coords(c){if(!Array.isArray(c))return;if(c.length>=2&&typeof c[0]==='number'&&typeof c[1]==='number'){if(validCoords(c[0],c[1]))points.push(c);return}for(const v of c)coords(v)}
 function walk(o){if(!o)return;if(o.type==='FeatureCollection')for(const f of o.features||[])walk(f);else if(o.type==='Feature')walk(o.geometry);else if(o.type==='GeometryCollection')for(const g of o.geometries||[])walk(g);else coords(o.coordinates)}
 walk(data);if(!points.length)return null;
 const b=[Infinity,Infinity,-Infinity,-Infinity];for(const [x,y] of points){b[0]=Math.min(b[0],x);b[1]=Math.min(b[1],y);b[2]=Math.max(b[2],x);b[3]=Math.max(b[3],y)}
 return validArchiveBounds(b)&&b[2]-b[0]<180?b:null;
}
function archiveOpacity(){return Math.max(0,Math.min(1,Number($('archiveOpacity').value)/100))}
function mountArchiveRaster(tile,credit,bounds,gen,onFail){
 if(gen!==archiveLoadGeneration)return;
 archiveSpec={tile,credit,bounds,gen,onFail};archiveResume=null;removeArchiveLayer();
 const source={type:'raster',tiles:[tile],tileSize:256,minzoom:0,maxzoom:22,attribution:credit};
 if(validArchiveBounds(bounds))source.bounds=bounds;
 let failed=false,loaded=false,errors=0;
 const fail=reason=>{if(failed||gen!==archiveLoadGeneration)return;failed=true;stopArchiveWatch();onFail(reason)};
 const data=e=>{
  if(archiveHidden||gen!==archiveLoadGeneration||e.sourceId!=='archive-overlay'||e.sourceDataType!=='content')return;
  if(e.tile?.state==='loaded'||(e.coord&&e.isSourceLoaded)){
   loaded=true;clearTimeout(archiveWatch?.timer);archiveMessage('老地图瓦片已加载；若图像为空，请检查覆盖范围及透明度。');
  }
 };
 const error=e=>{
  if(archiveHidden||gen!==archiveLoadGeneration||e.sourceId!=='archive-overlay')return;
  errors++;if(!loaded&&errors>=2)fail(String(e.error?.message||'瓦片请求失败').slice(0,100));
  else if(loaded)archiveMessage('部分老地图瓦片加载失败，可调整缩放或重试。');
 };
 const watch=()=>{if(archiveHidden||failed||gen!==archiveLoadGeneration||archiveWatch)return;archiveWatch={data,error,timer:loaded?null:setTimeout(()=>{if(!loaded)fail('等待瓦片超时')},35000)};map.on('sourcedata',data);map.on('error',error)};
 archiveSpec.watch=watch;watch();
 try{
  map.addSource('archive-overlay',source);
  map.addLayer({id:'archive-overlay',type:'raster',source:'archive-overlay',layout:{visibility:archiveHidden?'none':'visible'},paint:{'raster-opacity':archiveOpacity(),'raster-fade-duration':motionOK($('archivePicker'))?300:0}},map.getLayer('agg-icons')?'agg-icons':undefined);
 }catch(e){fail(String(e.message||e))}
}
async function overlayArchive(record,rights){
 if(!rights){archiveMessage('请先核查这幅地图的原图授权并勾选确认。');return}
 if(!archiveId(record.id))return;
 const gen=++archiveLoadGeneration;archiveHidden=false;removeArchiveLayer();archiveSpec=null;archiveSelected=record;archiveResume=null;setOHM();
 archiveMessage('正在获取 '+record.title+' 的覆盖范围…');
 let bounds=null;
 try{const g=await fetchJson('https://annotations.allmaps.org/maps/'+record.id+'.geojson',{},12000);bounds=footprintBounds(g)}catch(e){}
 if(gen!==archiveLoadGeneration)return;
 const credit=record.rumsey?'David Rumsey Map Collection, David Rumsey Map Center, Stanford University Libraries · Allmaps':'原图所属馆藏 · Allmaps';
 const attribution='<a href="'+archiveViewer(record.id)+'">'+credit+'</a>';
 const opacity=Number($('archiveOpacity').value);if(!Number.isFinite(opacity)||opacity<35){$('archiveOpacity').value='75';$('archiveOpacityValue').textContent='75%'}
 if(bounds){const c=map.getCenter();if(c.lng<bounds[0]||c.lng>bounds[2]||c.lat<bounds[1]||c.lat>bounds[3])map.fitBounds([[bounds[0],bounds[1]],[bounds[2],bounds[3]]],{padding:55,maxZoom:17,duration:500})}
 closeArchivePicker();setTopOpen(false);
 const prefix='https://allmaps.xyz/maps/'+record.id+'/{z}/{x}/{y}';
 archiveMessage('正在加载 '+record.title+' 的老地图瓦片…');
 mountArchiveRaster(prefix+'.webp',attribution,bounds,gen,reason=>{
  archiveMessage('WebP 加载失败，正在尝试 PNG…');
  mountArchiveRaster(prefix+'.png',attribution,bounds,gen,second=>{
   archiveMessage('老地图加载失败：'+second+'。可打开原图查看，或重新选择地图。');$('archiveToastLink').hidden=false;$('archiveToastLink').href=archiveViewer(record.id);
  });
 });
 $('archiveToastLink').href=archiveViewer(record.id);$('archiveToastLink').hidden=false;
}

function openArchivePicker(){
 if(!ready)return;
 closeInfo();closeList();setTopOpen(false);
 animatePanel($('archivePicker'),true,'sheet');updateArchivePickerState();
}
function closeArchivePicker(){if(desiredOpen($('archivePicker')))animatePanel($('archivePicker'),false,'sheet')}
function updateArchivePickerState(){
 const active=archiveSelected?.id||'';
 for(const item of $('archiveResults').children){
  const current=!!active&&item.dataset.archiveId===active;
  item.classList.toggle('archiveActive',current);
  const indicator=item.querySelector('.archiveActiveText');if(indicator)indicator.hidden=!current;
 }
}
function renderArchives(records){
 const el=$('archiveResults');el.replaceChildren();
 $('archiveResultCount').textContent=records.length?records.length+' 幅已配准地图':'未找到地图';
 if(!records.length){addText(el,'p','当前查询没有匹配的地图。可切换馆藏、移动地图后重试，或手动导入。').className='archiveEmpty';return}
 for(const [index,record] of records.entries()){
  const item=addText(el,'article','');item.className='archiveItem';item.dataset.archiveId=record.id;item.style.setProperty('--card-delay',Math.min(index,7)*30+'ms');
  const top=addText(item,'div','');top.className='archiveCardTop';
  const glyph=addText(top,'span','▧');glyph.className='archiveGlyph';glyph.setAttribute('aria-hidden','true');
  const heading=addText(top,'div','');heading.className='archiveCardHeading';
  addText(heading,'strong',record.title);addText(heading,'p',record.rumsey?'David Rumsey 馆藏':'Allmaps 关联馆藏').className='hint';
  const state=addText(heading,'span','当前选择');state.className='archiveActiveText';state.hidden=true;
  const toggle=addText(top,'button','');toggle.className='archiveCardToggle';toggle.type='button';toggle.setAttribute('aria-expanded','false');const chevron=addText(toggle,'span','');chevron.className='chevron';toggle.setAttribute('aria-label','展开地图信息');
  const body=addText(item,'div','');body.className='archiveCardBody';body.hidden=true;
  const inside=addText(body,'div','');inside.className='archiveCardInner';
  const links=addText(inside,'div','');links.className='archiveCardLinks';
  link(links,'原图及配准',archiveViewer(record.id));if(record.manifestUrl)link(links,'馆藏记录',record.manifestUrl);else if(record.imageUrl)link(links,'原始图像接口',record.imageUrl);
  if(record.rumsey)link(links,'馆藏许可','https://www.davidrumsey.com/about/copyright-and-permissions');
  const lab=addText(inside,'label','');lab.className='historyCheck';const rights=document.createElement('input');rights.type='checkbox';lab.append(rights,document.createTextNode('已核查本图授权'));
  const apply=addText(inside,'button','叠加到地图');apply.className='archiveApply';apply.disabled=true;rights.onchange=()=>{apply.disabled=!rights.checked};apply.onclick=()=>overlayArchive(record,rights.checked).catch(e=>archiveMessage('叠加失败：'+e.message));
  toggle.onclick=()=>{const open=!desiredOpen(body);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'收起地图信息':'展开地图信息');animatePanel(body,open)};
  if(records.length===1){body.hidden=false;toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','收起地图信息')}
 }
 updateArchivePickerState();
}
async function searchArchive(manual=false){
 const generation=++archiveSearchGeneration,kind=$('archiveKind').value;
 $('archiveStatus').textContent='正在查询馆藏…';$('archiveResultCount').textContent='查询中…';$('findArchive').disabled=true;$('loadArchive').disabled=true;$('archiveResults').setAttribute('aria-busy','true');
 try{
  let url;
  if(manual){
   const v=$('archiveInput').value.trim(),id=archiveId(v);
   if(id)url='https://annotations.allmaps.org/maps/'+id;
   else if(/^https:\/\/[^\s]+$/i.test(v)&&safeHttpUrl(v))url='https://annotations.allmaps.org/?url='+encodeURIComponent(v);
   else throw Error('请输入有效 Allmaps 地图 ID 或 HTTPS IIIF 链接');
  }else{const c=map.getCenter();url='https://annotations.allmaps.org/maps?'+new URLSearchParams({intersects:c.lat.toFixed(5)+','+c.lng.toFixed(5),limit:'40'})}
  const data=await fetchJson(url,{},25000);if(generation!==archiveSearchGeneration)return;
  const all=annotationList(data).map(archiveRecord).filter(Boolean),records=manual||kind!=='rumsey'?all:all.filter(r=>r.rumsey);
  renderArchives(records);$('archiveStatus').textContent=records.length?'找到 '+records.length+' 幅已配准地图（请核查原图授权）。':kind==='rumsey'&&!manual?'本次附近查询未发现可识别的 Rumsey 馆藏；可使用原站目录或指定 IIIF 链接。':'未找到可识别的已配准地图。';
 }catch(e){if(generation===archiveSearchGeneration){$('archiveStatus').textContent='馆藏查询失败：'+String(e.message||e).slice(0,100);$('archiveResultCount').textContent='查询失败'}}finally{if(generation===archiveSearchGeneration){$('findArchive').disabled=false;$('loadArchive').disabled=false;$('archiveResults').setAttribute('aria-busy','false')}}
}

function rumseyXYZ(value){
 const raw=String(value||'').trim();
 if(!raw||raw.length>2000||/[\s<>"']/u.test(raw)||!['{z}','{x}','{y}'].every(k=>raw.includes(k)))return '';
 if(/[{}]/.test(raw.replace(/\{[zxy]\}/g,'')))return '';
 try{const u=new URL(raw.replace(/\{[zxy]\}/g,'0'));
  if(u.protocol!=='https:'||u.username||u.password||u.port||!['maps.georeferencer.com','davidrumsey.georeferencer.com','davidrumsey.oldmapsonline.org'].includes(u.hostname))return '';
  return raw;
 }catch(e){return ''}
}

function importRumseyXYZ(){
 const tile=rumseyXYZ($('rumseyXYZInput').value);
 if(!tile){$('archiveStatus').textContent='请从 Rumsey 的 Use in GIS apps 复制完整 HTTPS XYZ 链接（包含 {z}/{x}/{y}）。';return}
 if(!$('rumseyXYZRights').checked){$('archiveStatus').textContent='请先核查原图及瓦片服务使用许可，并勾选确认。';return}
 const gen=++archiveLoadGeneration;archiveHidden=false;archiveSelected=null;archiveResume=null;setOHM();$('archiveToastLink').hidden=true;closeArchivePicker();setTopOpen(false);
 archiveMessage('正在加载 Rumsey 历史地图，请确保位于原图覆盖范围。');
 mountArchiveRaster(tile,'<a href="https://www.davidrumsey.com/view/georeferenced-maps">David Rumsey Map Collection, David Rumsey Map Center, Stanford University Libraries</a>',null,gen,reason=>archiveMessage('Rumsey 加载失败：'+reason+'。请检查链接和授权。'));
}
function initHistoryMaps(){
 $('archiveOpen').onclick=openArchivePicker;$('archivePickerClose').onclick=closeArchivePicker;$('archiveAdvancedToggle').onclick=()=>toggleMenu('archiveAdvanced','archiveAdvancedToggle');
 $('importRumseyXYZ').onclick=importRumseyXYZ;$('archiveToastClose').onclick=clearArchive;$('archiveToastHide').onclick=()=>{$('archiveToast').hidden=true};$('historyVisibility').onclick=toggleHistoryVisibility;$('historyClose').onclick=closeHistoryOverlays;
 $('ohmToggle').onchange=()=>{try{if($('ohmToggle').checked&&archiveHidden){archiveHidden=false;if(map.getLayer('archive-overlay'))map.setLayoutProperty('archive-overlay','visibility','visible');if(archiveSpec?.watch){archiveSpec.watch()}}setOHM()}catch(e){$('archiveStatus').textContent='OHM 加载失败：'+e.message}};
 $('ohmYear').onchange=$('ohmToggle').onchange;
 $('findArchive').onclick=()=>searchArchive(false);$('loadArchive').onclick=()=>searchArchive(true);$('clearArchive').onclick=clearArchive;
 $('archiveOpacity').oninput=()=>{$('archiveOpacityValue').textContent=$('archiveOpacity').value+'%';if(map.getLayer('archive-overlay'))map.setPaintProperty('archive-overlay','raster-opacity',Number($('archiveOpacity').value)/100)};
}
