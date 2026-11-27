
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
function refreshExtraStatus(){$('extraStatus').textContent=EXTRA_DEFS.filter(extraEnabled).map(d=>{const s=extraStates.get(d.id);return d.title+'：'+(s?.state==='ready'?s.rows.length+' 个坐标记录':s?.state==='loading'?'加载中…':s?.state==='error'?'失败（'+s.error+'）':'等待加载')}).join(' · ')}
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
function extraVisibleFeatures(center,size){
 const out=[],b=map.getBounds(),west=b.getWest(),east=b.getEast(),south=b.getSouth(),north=b.getNorth();
 for(const d of EXTRA_DEFS){
  const s=extraStates.get(d.id);if(!extraEnabled(d)||s?.state!=='ready')continue;
  let candidates=s.rows;
  if(east-west<120&&north-south<70&&s.index){
   candidates=[];const used=new Set();
   for(let x=Math.floor(west);x<=Math.floor(east);x++)for(let y=Math.floor(south);y<=Math.floor(north);y++){const k=(((x+180)%360+360)%360-180)+'|'+y;if(!used.has(k)){used.add(k);candidates.push(...(s.index.get(k)||[]))}}
  }
  for(const f of candidates){
   const [lon,y]=f.geometry.coordinates,x=lon+360*Math.round((center.lng-lon)/360);if(y<south||y>north||x<west||x>east||!passesCategory(f.properties))continue;
   const xy=map.project([x,y]);if(xy.x<0||xy.y<0||xy.x>size.clientWidth||xy.y>size.clientHeight)continue;
   out.push({...f,geometry:{type:'Point',coordinates:[x,y]}});
  }
 }
 return out;
}
function initExtraSources(){
 for(const d of EXTRA_DEFS){
  const lab=document.createElement('label'),i=document.createElement('input'),dot=document.createElement('span');i.type='checkbox';i.checked=prefEnabled('extraLayers',d.id,d.enabled);dot.className='sw';dot.style.background=d.color;lab.append(i,dot,d.title);$('extraFilters').append(lab);extraControls.set(d.id,i);
  i.onchange=()=>{saveExtraSources();if(i.checked)loadExtra(d);refreshExtraStatus();queueAggregation()};
 }
 for(const d of EXTRA_DEFS)if(extraEnabled(d))loadExtra(d);
 initHistoryMaps();
}
const OHM_LAYERS=[
 ['place_areas','line','#967044',1.3],['landuse_areas','fill','#d7bf8b',0.18],['water_areas','fill','#78a9be',0.34],
 ['buildings','fill','#b77c51',0.48],['transport_lines','line','#a95f3d',1.6],['other_lines','line','#86654b',1.3],['water_lines','line','#4b91a9',1.4]
];
function historicalYearFilter(year){return ['all',['any',['has','start_decdate'],['has','end_decdate']],['<=',['to-number',['coalesce',['get','start_decdate'],-100000],-100000],year],['>=',['to-number',['coalesce',['get','end_decdate'],100000],100000],year]]}
function setOHM(){
 const enabled=$('ohmToggle').checked,year=Number($('ohmYear').value);
 if(!enabled){for(let i=0;i<OHM_LAYERS.length;i++){const id='ohm-history-'+i;if(map.getLayer(id))map.setLayoutProperty(id,'visibility','none')}return}
 if(!$('ohmYear').value||!Number.isInteger(year)||year<-3000||year>2026){$('archiveStatus').textContent='请输入 -3000 至 2026 的整数年份。';return}
 if(!map.getSource('ohm-history'))map.addSource('ohm-history',{type:'vector',tiles:['https://vtiles.openhistoricalmap.org/maps/ohm/{z}/{x}/{y}.pbf'],minzoom:0,maxzoom:20,attribution:'<a href="https://www.openhistoricalmap.org/copyright">OpenHistoricalMap · CC0 except where noted</a>'});
 for(const [i,[sourceLayer,type,color,value]] of OHM_LAYERS.entries()){
  const id='ohm-history-'+i,filter=historicalYearFilter(year);
  if(map.getLayer(id)){map.setFilter(id,filter);map.setLayoutProperty(id,'visibility','visible')}
  else map.addLayer({id,type,source:'ohm-history','source-layer':sourceLayer,filter,paint:type==='fill'?{'fill-color':color,'fill-opacity':value}:{'line-color':color,'line-width':value,'line-opacity':0.88}},map.getLayer('agg-icons')?'agg-icons':undefined);
 }
 $('archiveStatus').textContent='历史矢量地图：'+year+' 年初；仅显示具有时间信息的要素。';
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
function clearArchive(){
 if(map.getLayer('archive-overlay'))map.removeLayer('archive-overlay');
 if(map.getSource('archive-overlay'))map.removeSource('archive-overlay');
 archiveSelected=null;$('archiveRights').checked=false;$('rumseyXYZRights').checked=false;$('archiveStatus').textContent='老地图已关闭。';
}
function overlayArchive(record){
 if(!$('archiveRights').checked||archiveSelected?.id!==record.id){$('archiveStatus').textContent='请先选择该地图、核查原图许可并勾选授权确认。';return}
 if(!archiveId(record.id))return;
 if(map.getLayer('archive-overlay'))map.removeLayer('archive-overlay');if(map.getSource('archive-overlay'))map.removeSource('archive-overlay');
 const credit=record.rumsey?'David Rumsey Map Collection, David Rumsey Map Center, Stanford University Libraries · Allmaps':'原图所属馆藏 · Allmaps';
 map.addSource('archive-overlay',{type:'raster',tiles:['https://allmaps.xyz/maps/'+record.id+'/{z}/{x}/{y}.webp'],tileSize:256,minzoom:0,maxzoom:22,attribution:'<a href="'+archiveViewer(record.id)+'">'+credit+'</a>'});
 map.addLayer({id:'archive-overlay',type:'raster',source:'archive-overlay',paint:{'raster-opacity':Number($('archiveOpacity').value)/100}},map.getLayer('agg-icons')?'agg-icons':undefined);
 $('archiveStatus').textContent='已选择：'+record.title+'。原图年代和配准精度请以馆藏页面为准。';setTopOpen(false);
}
function renderArchives(records){
 const el=$('archiveResults');el.replaceChildren();archiveSelected=null;$('archiveRights').checked=false;
 for(const record of records){
  const item=addText(el,'div','');item.className='archiveItem';addText(item,'strong',record.title);
  addText(item,'p',record.rumsey?'David Rumsey 馆藏':'Allmaps 关联馆藏').className='hint';
  link(item,'查看原图／配准',archiveViewer(record.id));if(record.manifestUrl)link(item,'馆藏记录',record.manifestUrl);else if(record.imageUrl)link(item,'原始图像接口',record.imageUrl);
  if(record.rumsey)link(item,'馆藏许可','https://www.davidrumsey.com/about/copyright-and-permissions');
  const select=addText(item,'button','选择这幅地图');select.onclick=()=>{archiveSelected=record;$('archiveRights').checked=false;$('archiveStatus').textContent='已选择 '+record.title+'；核查原图许可后勾选确认并点击叠加。'};
  const apply=addText(item,'button','叠加到地图');apply.onclick=()=>{try{overlayArchive(record)}catch(e){$('archiveStatus').textContent='叠加失败：'+e.message}};
 }
}
async function searchArchive(manual=false){
 const generation=++archiveSearchGeneration,kind=$('archiveKind').value;
 $('archiveStatus').textContent='正在查询馆藏…';
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
 }catch(e){if(generation===archiveSearchGeneration)$('archiveStatus').textContent='馆藏查询失败：'+String(e.message||e).slice(0,100)}
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
 try{
  if(map.getLayer('archive-overlay'))map.removeLayer('archive-overlay');
  if(map.getSource('archive-overlay'))map.removeSource('archive-overlay');
  map.addSource('archive-overlay',{type:'raster',tiles:[tile],tileSize:256,minzoom:0,maxzoom:22,attribution:'<a href="https://www.davidrumsey.com/view/georeferenced-maps">David Rumsey Map Collection, David Rumsey Map Center, Stanford University Libraries</a>'});
  map.addLayer({id:'archive-overlay',type:'raster',source:'archive-overlay',paint:{'raster-opacity':Number($('archiveOpacity').value)/100}},map.getLayer('agg-icons')?'agg-icons':undefined);
  $('archiveStatus').textContent='已添加 Rumsey XYZ 图层；请移动至原图覆盖范围，实际显示取决于瓦片服务权限与网络。';
  archiveSelected=null;$('archiveRights').checked=false;$('rumseyXYZRights').checked=false;setTopOpen(false);
 }catch(e){$('archiveStatus').textContent='Rumsey 叠加失败：'+String(e.message||e)}
}
function initHistoryMaps(){
 $('importRumseyXYZ').onclick=importRumseyXYZ;
 $('ohmToggle').onchange=()=>{try{setOHM()}catch(e){$('archiveStatus').textContent='OHM 加载失败：'+e.message}};
 $('ohmYear').onchange=$('ohmToggle').onchange;
 $('findArchive').onclick=()=>searchArchive(false);$('loadArchive').onclick=()=>searchArchive(true);$('clearArchive').onclick=clearArchive;
 $('archiveOpacity').oninput=()=>{$('archiveOpacityValue').textContent=$('archiveOpacity').value+'%';if(map.getLayer('archive-overlay'))map.setPaintProperty('archive-overlay','raster-opacity',Number($('archiveOpacity').value)/100)};
}
