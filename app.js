let devices=[], activeCategory="All", activeView="explore", currentDevice=null;
let compareIds=JSON.parse(localStorage.getItem("dx_compare")||"[]");
let favorites=JSON.parse(localStorage.getItem("dx_favorites")||"[]");
const $=id=>document.getElementById(id);
const save=()=>{localStorage.setItem("dx_compare",JSON.stringify(compareIds));localStorage.setItem("dx_favorites",JSON.stringify(favorites));$("compareCount").textContent=compareIds.length};
const escapeHtml=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function init(){try{const r=await fetch("devices.json");devices=await r.json()}catch(e){$("deviceGrid").innerHTML='<p>Could not load devices.json. Please run this app through a local web server.</p>';return}
 const brands=[...new Set(devices.map(d=>d.brand))].sort();brands.forEach(b=>{const o=document.createElement("option");o.value=b;o.textContent=b;$("brandFilter").append(o)});
 $("searchInput").addEventListener("input",renderDevices);$("brandFilter").addEventListener("change",renderDevices);
 document.querySelectorAll("[data-category]").forEach(b=>b.addEventListener("click",()=>setCategory(b.dataset.category)));
 document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
 document.querySelectorAll("[data-query]").forEach(b=>b.addEventListener("click",()=>{$("searchInput").value=b.dataset.query;renderDevices()}));
 $("clearFilters").onclick=()=>{$("searchInput").value="";$("brandFilter").value="All";setCategory("All")};
 $("modalClose").onclick=closeModal;$("detailModal").addEventListener("click",e=>{if(e.target===$("detailModal"))closeModal()});
 $("modalFavorite").onclick=()=>toggleFavorite(currentDevice.id);$("modalCompare").onclick=()=>toggleCompare(currentDevice.id);
 $("menuBtn").onclick=()=>$("sidebar").classList.toggle("open");
 document.querySelectorAll("[data-goto]").forEach(b=>b.onclick=()=>showView(b.dataset.goto));
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
 save();renderDevices();renderFavorites();
}
function setCategory(cat){activeCategory=cat;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.category===cat));document.querySelectorAll(".category-link").forEach(b=>b.classList.toggle("active",b.dataset.category===cat));renderDevices()}
function renderDevices(){const q=$("searchInput").value.toLowerCase().trim(),brand=$("brandFilter").value;
 const list=devices.filter(d=>(activeCategory==="All"||d.category===activeCategory)&&(brand==="All"||d.brand===brand)&&(!q||[d.name,d.brand,d.category,d.summary,...Object.values(d.specs)].join(" ").toLowerCase().includes(q)));
 $("resultCount").textContent=`${list.length} device${list.length===1?"":"s"}`;$("deviceGrid").innerHTML=list.map(cardHTML).join("");$("emptyState").classList.toggle("hidden",list.length>0);
 document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openDetail(b.dataset.open));
 document.querySelectorAll("[data-fav]").forEach(b=>b.onclick=()=>toggleFavorite(b.dataset.fav));
 document.querySelectorAll("[data-compare]").forEach(b=>b.onclick=()=>toggleCompare(b.dataset.compare));
}
function cardHTML(d){const saved=favorites.includes(d.id),comp=compareIds.includes(d.id);const specs=Object.entries(d.specs).slice(0,3).map(([k,v])=>`<span>${escapeHtml(k)}: ${escapeHtml(v.length>28?v.slice(0,25)+"…":v)}</span>`).join("");
 return `<article class="device-card"><div class="card-top"><span class="pill">${escapeHtml(d.category)}</span><button class="heart-btn ${saved?"saved":""}" data-fav="${d.id}" aria-label="Toggle favorite">${saved?"♥":"♡"}</button></div><div class="device-visual"><span>${d.image}</span></div><div class="device-meta"><span class="year">${escapeHtml(d.brand)}</span><span class="year">• ${d.year}</span></div><h3>${escapeHtml(d.name)}</h3><p class="summary">${escapeHtml(d.summary)}</p><div class="card-specs">${specs}</div><div class="card-actions"><button class="primary-btn" data-open="${d.id}">View specifications ↗</button><button class="compare-toggle ${comp?"selected":""}" data-compare="${d.id}">${comp?"✓ Added":"⇄ Compare"}</button></div></article>`;
}
function openDetail(id){currentDevice=devices.find(d=>d.id===id);if(!currentDevice)return;const d=currentDevice;
 $("detailIcon").textContent=d.image;$("detailBrand").textContent=d.brand.toUpperCase();$("modalTitle").textContent=d.name;$("detailSummary").textContent=d.summary;$("detailCategory").textContent=d.category;$("detailYear").textContent=d.year;$("detailTag").textContent=d.tag;
 $("specList").innerHTML=Object.entries(d.specs).map(([k,v])=>`<div class="spec-row"><b>${escapeHtml(k)}</b><span>${escapeHtml(v)}</span></div>`).join("");
 $("sourceNote").textContent=d.sourceNote;$("sourceLink").href=d.sourceUrl;$("modalFavorite").textContent=favorites.includes(id)?"♥ Saved":"♡ Save";$("modalCompare").textContent=compareIds.includes(id)?"✓ In comparison":"⇄ Add to compare";
 $("detailModal").classList.remove("hidden");}
function closeModal(){$("detailModal").classList.add("hidden")}
function toggleFavorite(id){favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];save();renderDevices();renderFavorites();if(currentDevice?.id===id)$("modalFavorite").textContent=favorites.includes(id)?"♥ Saved":"♡ Save"}
function toggleCompare(id){if(compareIds.includes(id))compareIds=compareIds.filter(x=>x!==id);else if(compareIds.length<3)compareIds.push(id);else{alert("You can compare up to 3 devices at a time.");return}save();renderDevices();renderCompare();if(currentDevice?.id===id)$("modalCompare").textContent=compareIds.includes(id)?"✓ In comparison":"⇄ Add to compare"}
function showView(view){activeView=view;["explore","compare","favorites"].forEach(v=>$(v+"View").classList.toggle("hidden",v!==view));document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===view));$("crumbName").textContent=view[0].toUpperCase()+view.slice(1);$("sidebar").classList.remove("open");if(view==="compare")renderCompare();if(view==="favorites")renderFavorites()}
function renderCompare(){
 const selected=compareIds.map(id=>devices.find(d=>d.id===id)).filter(Boolean);
 if(!selected.length){
  $("compareContent").innerHTML=`<div class="compare-empty"><div>⇄</div><h3>Your comparison is waiting</h3><p>Go to Explore and add two or more devices to compare their specifications.</p><button class="primary-btn" id="goExplore">Explore devices</button></div>`;
  $("goExplore").onclick=()=>showView("explore");
  return;
 }
 const keys=[...new Set(selected.flatMap(d=>Object.keys(d.specs)))];
 $("compareContent").innerHTML=`<div class="compare-table-wrap"><table class="compare-table"><thead><tr><th>SPECIFICATION</th>${selected.map(d=>`<th>${escapeHtml(d.name)}<br><button class="remove-compare" data-remove="${d.id}">Remove ×</button></th>`).join("")}</tr></thead><tbody><tr><td>Brand / category</td>${selected.map(d=>`<td>${escapeHtml(d.brand)} · ${escapeHtml(d.category)}</td>`).join("")}</tr>${keys.map(k=>`<tr><td>${escapeHtml(k)}</td>${selected.map(d=>`<td>${escapeHtml(d.specs[k]||"—")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
 document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>toggleCompare(b.dataset.remove));
}
function renderFavorites(){const list=favorites.map(id=>devices.find(d=>d.id===id)).filter(Boolean);$("favoriteGrid").innerHTML=list.map(cardHTML).join("");$("favoriteEmpty").classList.toggle("hidden",list.length>0);
 document.querySelectorAll("#favoriteGrid [data-open]").forEach(b=>b.onclick=()=>openDetail(b.dataset.open));document.querySelectorAll("#favoriteGrid [data-fav]").forEach(b=>b.onclick=()=>toggleFavorite(b.dataset.fav));document.querySelectorAll("#favoriteGrid [data-compare]").forEach(b=>b.onclick=()=>toggleCompare(b.dataset.compare))}
init();