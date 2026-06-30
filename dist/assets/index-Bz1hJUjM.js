(function(){const c=document.createElement("link").relList;if(c&&c.supports&&c.supports("modulepreload"))return;for(const g of document.querySelectorAll('link[rel="modulepreload"]'))w(g);new MutationObserver(g=>{for(const d of g)if(d.type==="childList")for(const x of d.addedNodes)x.tagName==="LINK"&&x.rel==="modulepreload"&&w(x)}).observe(document,{childList:!0,subtree:!0});function T(g){const d={};return g.integrity&&(d.integrity=g.integrity),g.referrerPolicy&&(d.referrerPolicy=g.referrerPolicy),g.crossOrigin==="use-credentials"?d.credentials="include":g.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function w(g){if(g.ep)return;g.ep=!0;const d=T(g);fetch(g.href,d)}})();const Ke="https://barista-sliced-outwit.ngrok-free.dev/webhook-test/travelmind/plan";function oe(f){var T;console.log("[normalizeN8nResponse] Incoming raw payload:",f);let c=f;if(Array.isArray(f)&&((T=f[0])!=null&&T.json)?(console.log("[normalizeN8nResponse] Detected raw[0].json array structure."),c=f[0].json):Array.isArray(f)&&f[0]&&(console.log("[normalizeN8nResponse] Detected raw[0] array structure."),c=f[0]),!c)return console.warn("[normalizeN8nResponse] Data payload is empty/falsy."),{};if(c.body&&typeof c.body=="object"?(console.log("[normalizeN8nResponse] Unwrapping data.body wrapper:",c.body),c=c.body):c.data&&typeof c.data=="object"&&!c.itinerary&&!c.plan&&!c.itineraryDays&&(console.log("[normalizeN8nResponse] Unwrapping data.data wrapper:",c.data),c=c.data),c.text&&typeof c.text=="string"){const w=c.text.trim();console.log("[normalizeN8nResponse] Checking data.text for markdown/JSON payload:",w.substring(0,100)+"...");const g=w.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);if(g)try{const d=JSON.parse(g[1].trim());return console.log("[normalizeN8nResponse] Successfully parsed JSON from markdown code block:",d),d}catch(d){throw console.error("[normalizeN8nResponse] Failed to parse JSON from markdown code block:",d),new Error(`Failed to parse travel plan: ${d.message}`)}if(w.startsWith("{")||w.startsWith("["))try{const d=JSON.parse(w);return console.log("[normalizeN8nResponse] Successfully parsed JSON from text field:",d),d}catch(d){throw console.error("[normalizeN8nResponse] Failed to parse JSON from text field:",d),new Error(`Failed to parse travel plan: ${d.message}`)}}return console.log("[normalizeN8nResponse] Final normalized data output:",c),c}function s(f){const c=document.createElement("div");return c.textContent=f,c.innerHTML}document.addEventListener("DOMContentLoaded",async()=>{typeof lucide<"u"&&lucide.createIcons();const f=document.body,c=document.getElementById("navbar"),T=document.getElementById("menu-toggle"),w=document.getElementById("nav-links"),g=document.getElementById("theme-toggle"),d=document.getElementById("hero-cta-btn"),x=document.getElementById("planner-form"),ie=document.getElementById("destination-input"),M=document.getElementById("start-date-input"),A=document.getElementById("end-date-input"),ce=document.getElementById("budget-input"),z=document.getElementById("travelers-preset"),H=document.getElementById("travelers-count"),le=document.getElementById("style-chips-container"),de=document.getElementById("preferences-input"),me=document.getElementById("generate-btn"),Y=document.getElementById("planner-loader"),pe=document.getElementById("loader-msg"),D=document.getElementById("results"),ue=document.getElementById("results-title"),ge=document.getElementById("results-subtitle"),B=document.getElementById("results-overview"),he=document.getElementById("results-badge"),N=document.getElementById("itinerary-timeline-container"),C=document.getElementById("budget-list-container"),Q=document.getElementById("budget-total-cost"),v={formData:null,travelPlan:null},X=document.getElementById("api-key-btn"),S=document.getElementById("api-modal"),fe=document.getElementById("api-modal-close"),ve=document.getElementById("api-modal-clear"),ye=document.getElementById("api-modal-save"),U=document.getElementById("api-key-input"),_=document.getElementById("weather-list-container"),P=document.getElementById("packing-list-container"),O=document.getElementById("attractions-grid"),j=document.getElementById("hotels-grid"),R=document.getElementById("foods-grid-container"),F=document.getElementById("transport-list-container"),V=document.getElementById("safety-list-container"),I=document.getElementById("chat-messages-container"),be=document.getElementById("chat-suggestions-container"),Z=document.getElementById("chat-input-field"),we=document.getElementById("chat-input-form"),Ee=document.getElementById("clear-chat-btn"),ee=document.getElementById("chat-send-btn"),te="Frontend prototype only. Backend integration coming soon.",q=new Set;(localStorage.getItem("theme")||"dark")==="light"&&f.classList.add("light-mode");function $(e){let n=document.getElementById("toast-container");n||(n=document.createElement("div"),n.id="toast-container",n.style.position="fixed",n.style.right="20px",n.style.bottom="20px",n.style.display="flex",n.style.flexDirection="column",n.style.gap="10px",n.style.zIndex="9999",document.body.appendChild(n));const t=document.createElement("div");t.textContent=e,t.style.padding="10px 14px",t.style.borderRadius="10px",t.style.color="#fff",t.style.background="rgba(17, 24, 39, 0.92)",t.style.border="1px solid rgba(167, 139, 250, 0.45)",t.style.boxShadow="0 10px 24px rgba(0, 0, 0, 0.28)",t.style.fontSize="0.9rem",t.style.opacity="0",t.style.transform="translateY(8px)",t.style.transition="all 220ms ease",n.appendChild(t),requestAnimationFrame(()=>{t.style.opacity="1",t.style.transform="translateY(0)"}),setTimeout(()=>{t.style.opacity="0",t.style.transform="translateY(8px)",setTimeout(()=>t.remove(),240)},2200)}g.addEventListener("click",()=>{f.classList.toggle("light-mode");const e=f.classList.contains("light-mode")?"light":"dark";localStorage.setItem("theme",e)}),X&&S&&(X.addEventListener("click",()=>{const e=localStorage.getItem("gemini_api_key")||"";U.value=e,S.classList.add("active")}),fe.addEventListener("click",()=>{S.classList.remove("active")}),ve.addEventListener("click",()=>{localStorage.removeItem("gemini_api_key"),U.value="",$("API Key removed."),S.classList.remove("active")}),ye.addEventListener("click",()=>{const e=U.value.trim();e?(localStorage.setItem("gemini_api_key",e),$("Gemini API Key saved successfully!")):(localStorage.removeItem("gemini_api_key"),$("API Key cleared.")),S.classList.remove("active")}),S.addEventListener("click",e=>{e.target===S&&S.classList.remove("active")})),T.addEventListener("click",()=>{const e=T.getAttribute("aria-expanded")==="true";T.setAttribute("aria-expanded",!e),w.classList.toggle("active")}),document.querySelectorAll(".nav-link").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".nav-link").forEach(n=>n.classList.remove("active")),e.classList.add("active"),w.classList.contains("active")&&(w.classList.remove("active"),T.setAttribute("aria-expanded","false"))})}),window.addEventListener("scroll",()=>{window.scrollY>50?(c.style.boxShadow="var(--shadow-card)",c.style.background=f.classList.contains("light-mode")?"rgba(248, 250, 252, 0.9)":"rgba(3, 3, 5, 0.85)"):(c.style.boxShadow="none",c.style.background=f.classList.contains("light-mode")?"rgba(248, 250, 252, 0.7)":"rgba(3, 3, 5, 0.6)")});const ne=new Date().toISOString().split("T")[0];M.min=ne,A.min=ne,M.addEventListener("change",()=>{A.min=M.value,A.value&&A.value<M.value&&(A.value=M.value)}),z.addEventListener("change",()=>{const e=z.value;if(e==="custom"){H.focus();return}H.value=e}),H.addEventListener("input",()=>{const e=parseInt(H.value,10);[1,2,4,6].includes(e)?z.value=e.toString():z.value="custom"}),le.addEventListener("click",e=>{const n=e.target.closest(".chip-btn");if(!n)return;const t=n.dataset.value;q.has(t)?(q.delete(t),n.classList.remove("active")):(q.add(t),n.classList.add("active"))});function G(e,n){me.disabled=e,x.closest(".planner-card").style.display=e?"none":"block",Y.style.display=e?"flex":"none",pe.textContent=n||(e?"Generating your trip...":"Finding the best attractions..."),e&&Y.scrollIntoView({behavior:"smooth",block:"center"})}function ke(){console.log("[planner] showPlannerResults triggered.");const e=v.travelPlan,n=v.formData;if(!e||!n){console.error("[planner] showPlannerResults called with empty appState!",v);return}const t=n.travelStyles&&n.travelStyles.length>0?n.travelStyles.join(", "):"General";he.textContent=e.badge||e.status||e.label||"Itinerary Ready";const r=e.destination||e.location||n.destination;ue.textContent=e.title||e.trip_title||e.name||`Your Custom Trip to ${r}`;const i=e.travelers||e.travelers_count||n.travelers,a=e.days||e.duration||e.days_count||n.days;ge.textContent=e.subtitle||e.trip_subtitle||`${a} Days • ${i} Traveler${i>1?"s":""} • Styles: ${t}`;const o=e.overview||e.description||e.summary||e.overview_text||e.trip_overview||"";B&&(o?(B.textContent=o,B.style.display="block"):(B.textContent="",B.style.display="none")),console.log("[planner] Executing component-specific rendering with isolation..."),[{name:"Itinerary",fn:Te},{name:"Budget",fn:Se},{name:"Weather",fn:Le},{name:"Packing",fn:Ie},{name:"Attractions",fn:$e},{name:"Hotels",fn:xe},{name:"Foods",fn:Me},{name:"Transport",fn:Ae},{name:"Safety",fn:Ce}].forEach(m=>{try{console.log(`[planner] Rendering panel: ${m.name}`),m.fn()}catch(u){console.error(`[planner] Failed rendering panel "${m.name}":`,u)}}),D.classList.add("visible"),D.scrollIntoView({behavior:"smooth",block:"start"}),typeof lucide<"u"&&lucide.createIcons(),console.log("[planner] showPlannerResults execution completed.")}function Te(){try{N.innerHTML="";const e=v.travelPlan,n=v.formData;if(!e||!n){N.innerHTML='<p class="card-desc">Itinerary details will appear here after a trip is generated.</p>';return}const t=e.itinerary||e.itineraryDays||e.days_plan||e.days;if(Array.isArray(t)&&t.length>0){t.forEach((a,o)=>{if(!a)return;const l=document.createElement("div");l.className="itinerary-day";const m=a.day||a.day_number||o+1,u=a.title||a.theme||a.heading||a.summary||"Daily Exploration",h=a.morning_title||a.morningTitle||a.am_title||"Morning Adventure",p=a.morning&&typeof a.morning=="object"?a.morning.desc||a.morning.description||a.morning.activity||"":a.morning||a.am||a.morning_activity||a.morningActivity||"",E=a.afternoon_title||a.afternoonTitle||a.pm_title||"Midday Exploration",b=a.afternoon&&typeof a.afternoon=="object"?a.afternoon.desc||a.afternoon.description||a.afternoon.activity||"":a.afternoon||a.pm||a.afternoon_activity||a.afternoonActivity||"",y=a.evening_title||a.eveningTitle||a.night_title||"Evening & Dinner",L=a.evening&&typeof a.evening=="object"?a.evening.desc||a.evening.description||a.evening.activity||"":a.evening||a.night||a.evening_activity||a.eveningActivity||"";l.innerHTML=`
            <div class="day-header">
              <span class="badge badge-primary">Day ${m}</span>
              <h3>${s(u)}</h3>
            </div>
            <div class="day-timeline">
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-time">Morning</div>
                <div class="timeline-title">${s(h)}</div>
                <div class="timeline-desc">${s(p)}</div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-time">Afternoon</div>
                <div class="timeline-title">${s(E)}</div>
                <div class="timeline-desc">${s(b)}</div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-time">Evening</div>
                <div class="timeline-title">${s(y)}</div>
                <div class="timeline-desc">${s(L)}</div>
              </div>
            </div>
          `,N.appendChild(l)});return}const i=e.plan||e.message||e.output||e.itineraryText||`Your ${n.days}-day trip to ${n.destination} is ready.`;N.innerHTML=`
        <div class="itinerary-day">
          <div class="day-header">
            <span class="badge badge-primary">Plan</span>
            <h3>TravelMind Plan</h3>
          </div>
          <div class="day-timeline">
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-desc" style="white-space: pre-wrap;">${s(String(i))}</div>
            </div>
          </div>
        </div>
      `}catch(e){console.error("[renderItinerary] Critical error:",e),N.innerHTML=`<p class="card-desc" style="color: var(--accent-color);">Failed to render itinerary panel: ${s(e.message)}</p>`}}function Se(){try{C.innerHTML="";const e=v.travelPlan,n=v.formData;if(!e||!n){C.innerHTML='<p class="card-desc">Budget breakdown will appear here after a trip is generated.</p>',Q.textContent="";return}let t=e.budgetBreakdown||e.expenses||e.cost_breakdown||e.cost||e.budget;const r=e.totalBudget||e.budgetTotal||e.total_cost||e.budget&&e.budget.total||n.budget;(typeof t=="number"||typeof t=="string")&&(t=null);let i="";typeof r=="number"?i=`₹${r.toLocaleString("en-IN")}`:typeof r=="string"?i=r.trim().startsWith("₹")?r.trim():`₹${r.trim()}`:i="₹0",Q.textContent=i;const a=r?typeof r=="number"?r:parseInt(String(r).replace(/[^\d]/g,""),10):n.budget;Array.isArray(t)&&t.length>0?t.forEach(o=>{if(!o)return;const l=o.category||o.label||o.name||o.expense||"Expense",m=o.cost||o.amount||o.value||o.price||0,u=typeof m=="number"?m:parseInt(String(m).replace(/[^\d]/g,""),10),h=a?Math.min(100,Math.round(u/a*100)):0,p=document.createElement("div");p.className="budget-item",p.innerHTML=`
            <div class="budget-label-row">
                <span class="budget-cat">${s(l)}</span>
                <span class="budget-val">₹${u.toLocaleString("en-IN")} (${h}%)</span>
            </div>
            <div class="progress-track">
                <div class="progress-bar" data-value="${h}%"></div>
            </div>
          `,C.appendChild(p)}):t&&typeof t=="object"&&Object.keys(t).length>0?Object.entries(t).forEach(([o,l])=>{if(o.toLowerCase()==="total")return;const m=typeof l=="number"?l:parseInt(String(l).replace(/[^\d]/g,""),10),u=a?Math.min(100,Math.round(m/a*100)):0,h=document.createElement("div");h.className="budget-item",h.innerHTML=`
            <div class="budget-label-row">
                <span class="budget-cat">${s(o)}</span>
                <span class="budget-val">₹${m.toLocaleString("en-IN")} (${u}%)</span>
            </div>
            <div class="progress-track">
                <div class="progress-bar" data-value="${u}%"></div>
            </div>
          `,C.appendChild(h)}):C.innerHTML='<p class="card-desc">Detailed expenses breakdown is not available.</p>',setTimeout(()=>{document.querySelectorAll(".progress-bar").forEach(o=>{o.style.width=o.getAttribute("data-value")})},300)}catch(e){console.error("[renderBudget] Critical error:",e),C.innerHTML=`<p class="card-desc" style="color: var(--accent-color);">Failed to render budget panel: ${s(e.message)}</p>`}}function Le(){try{_.innerHTML="";const e=v.travelPlan;if(!e){_.innerHTML='<p class="card-desc">Weather details will appear here after a trip is generated.</p>';return}const n=e.weather||e.weatherForecast||e.forecast||e.weather_forecast||e.weather_details;if(!Array.isArray(n)||n.length===0){_.innerHTML='<p class="card-desc">Weather forecast is not available.</p>';return}n.forEach(t=>{if(!t)return;const r=document.createElement("div");r.className="weather-day-card";const i=t.day||t.date||t.name||t.day_name||"Day",a=t.temp||t.temperature||t.avg_temp||t.temp_range||"",o=t.cond||t.condition||t.weather||t.sky||"",l=t.icon||t.weather_icon||"cloud-sun";r.innerHTML=`
          <div class="weather-name">${s(i)}</div>
          <div class="weather-icon"><i data-lucide="${l}"></i></div>
          <div class="weather-temp">${s(a)}</div>
          <div class="weather-desc">${s(o)}</div>
        `,_.appendChild(r)})}catch(e){console.error("[renderWeather] Critical error:",e),_.innerHTML=`<p class="card-desc" style="color: var(--accent-color);">Failed to render weather panel: ${s(e.message)}</p>`}}function Ie(){try{P.innerHTML="";const e=v.travelPlan;if(!e){P.innerHTML='<p class="card-desc">Packing checklist will appear here after a trip is generated.</p>';return}const n=e.packing||e.packingList||e.checklist||e.packing_list||e.packing_checklist||e.items_to_pack;if(!Array.isArray(n)||n.length===0){P.innerHTML='<p class="card-desc">Packing checklist is empty.</p>';return}n.forEach((t,r)=>{if(!t)return;const i=document.createElement("label");i.className="packing-item";const a=typeof t=="string"?t:t.name||t.item||t.title||"";i.innerHTML=`
          <input type="checkbox" id="pack-chk-${r}">
          <span>${s(a)}</span>
        `,P.appendChild(i)})}catch(e){console.error("[renderPacking] Critical error:",e),P.innerHTML=`<p class="card-desc" style="color: var(--accent-color);">Failed to render packing panel: ${s(e.message)}</p>`}}function $e(){try{O.innerHTML="";const e=v.travelPlan;if(!e){O.innerHTML='<p class="card-desc">Attraction recommendations will appear here after a trip is generated.</p>';return}const n=e.attractions||e.recommendedAttractions||e.places_to_visit||e.sightseeing||e.points_of_interest;if(!Array.isArray(n)||n.length===0){O.innerHTML='<p class="card-desc">No attractions found for this destination.</p>';return}n.forEach(t=>{if(!t)return;const r=document.createElement("div");r.className="glass-panel attraction-card";const i=t.image||t.image_url||t.imageUrl||t.photo||"",a=i?`<div class="card-img-wrapper"><img src="${s(i)}" alt="${s(t.name||"Attraction")}"></div>`:"",o=t.rating||t.stars||"",l=t.reviews||t.reviews_count||"",m=o?`<div class="card-rating-row">
              <div class="card-rating">
                <i data-lucide="star" style="width: 14px; height: 14px; fill: #fbbf24; color: #fbbf24;"></i> 
                <span>${s(String(o))}</span>
                ${l?`<span style="color: var(--text-muted); font-size: 0.8rem; font-weight: normal; margin-left: 4px;">(${s(String(l))})</span>`:""}
              </div>
             </div>`:"";r.innerHTML=`
          ${a}
          <div class="card-content">
            ${m}
            <h4 class="card-title">${s(t.name||t.title||t.attraction_name||"Attraction")}</h4>
            <p class="card-desc">${s(t.desc||t.description||t.info||"")}</p>
          </div>
        `,O.appendChild(r)})}catch(e){console.error("[renderAttractions] Critical error:",e),O.innerHTML=`<p class="card-desc" style="color: var(--accent-color);">Failed to render attractions panel: ${s(e.message)}</p>`}}function xe(){try{j.innerHTML="";const e=v.travelPlan;if(!e){j.innerHTML='<p class="card-desc">Hotel recommendations will appear here after a trip is generated.</p>';return}const n=e.hotels||e.recommendedStays||e.accommodations||e.stays;if(!Array.isArray(n)||n.length===0){j.innerHTML='<p class="card-desc">No hotel recommendations found.</p>';return}n.forEach(t=>{if(!t)return;const r=document.createElement("div");r.className="glass-panel hotel-card";const i=t.image||t.image_url||t.imageUrl||t.photo||"",a=i?`<div class="card-img-wrapper"><img src="${s(i)}" alt="${s(t.name||"Hotel")}"></div>`:"",o=t.rating||t.stars||"",l=t.reviews||t.reviews_count||"",m=o?`<div class="card-rating-row">
              <div class="card-rating">
                <i data-lucide="star" style="width: 14px; height: 14px; fill: #fbbf24; color: #fbbf24;"></i> 
                <span>${s(String(o))}</span>
                ${l?`<span style="color: var(--text-muted); font-size: 0.8rem; font-weight: normal; margin-left: 4px;">(${s(String(l))})</span>`:""}
              </div>
             </div>`:"",u=t.price||t.cost||t.price_per_night||"",h=t.desc||t.description||t.info||"";r.innerHTML=`
          ${a}
          <div class="card-content">
            ${m}
            <h4 class="card-title">${s(t.name||t.hotel_name||t.title||"Hotel")}</h4>
            <p class="card-desc">${s(h)}</p>
            ${u?`<div class="hotel-price">${s(u)}</div>`:""}
          </div>
        `,j.appendChild(r)})}catch(e){console.error("[renderHotels] Critical error:",e),j.innerHTML=`<p class="card-desc" style="color: var(--accent-color);">Failed to render hotels panel: ${s(e.message)}</p>`}}function Me(){try{R.innerHTML="";const e=v.travelPlan;if(!e){R.innerHTML='<p class="card-desc">Food recommendations will appear here after a trip is generated.</p>';return}const n=e.foods||e.localCuisine||e.food_recommendations||e.dishes||e.local_foods;if(!Array.isArray(n)||n.length===0){R.innerHTML='<p class="card-desc">No local foods recommendations found.</p>';return}n.forEach(t=>{if(!t)return;const r=document.createElement("div");r.className="glass-panel food-item-card";const i=t.emoji||t.icon||"🍽️";r.innerHTML=`
          <span class="food-emoji">${s(i)}</span>
          <h4 class="food-title">${s(t.name||t.dish_name||t.title||"Local Dish")}</h4>
          <p class="food-desc">${s(t.desc||t.description||t.info||"")}</p>
        `,R.appendChild(r)})}catch(e){console.error("[renderFoods] Critical error:",e),R.innerHTML=`<p class="card-desc" style="color: var(--accent-color);">Failed to render local foods panel: ${s(e.message)}</p>`}}function Ae(){try{F.innerHTML="";const e=v.travelPlan;if(!e){F.innerHTML='<p class="card-desc">Transport guide will appear here after a trip is generated.</p>';return}const n=e.transport||e.transportation||e.travel_modes||e.transport_guide;if(!Array.isArray(n)||n.length===0){F.innerHTML='<p class="card-desc">No transport guide found.</p>';return}n.forEach(t=>{if(!t)return;const r=document.createElement("div");r.className="transport-item";const i=t.type||t.name||t.mode||"Transport",a=t.efficiency||t.note||t.details||t.description||"Recommended";r.innerHTML=`
          <div class="transport-label"><span>${s(i)}</span></div>
          <span class="badge badge-primary">${s(a)}</span>
        `,F.appendChild(r)})}catch(e){console.error("[renderTransport] Critical error:",e),F.innerHTML=`<p class="card-desc" style="color: var(--accent-color);">Failed to render transport panel: ${s(e.message)}</p>`}}function Ce(){try{V.innerHTML="";const e=v.travelPlan;if(!e){V.innerHTML='<p class="card-desc">Safety tips will appear here after a trip is generated.</p>';return}const n=e.safety||e.safetyTips||e.safety_tips||e.tips||e.advice;if(!Array.isArray(n)||n.length===0){V.innerHTML='<p class="card-desc">No safety tips found.</p>';return}n.forEach(t=>{if(!t)return;const r=document.createElement("div");r.className="safety-item";const i=t.icon||t.emoji||"💡",a=t.title||t.name||t.heading||"Tip",o=t.desc||t.description||t.detail||"";r.innerHTML=`
          <span class="safety-icon">${s(i)}</span>
          <div class="safety-item-content">
            <h4 class="safety-item-title">${s(a)}</h4>
            <p class="safety-item-desc">${s(o)}</p>
          </div>
        `,V.appendChild(r)})}catch(e){console.error("[renderSafety] Critical error:",e),V.innerHTML=`<p class="card-desc" style="color: var(--accent-color);">Failed to render safety panel: ${s(e.message)}</p>`}}async function He(e,n){var u,h,p,E,b,y;const t=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${n}`;console.log("[planner] Preparing prompt for Gemini AI model...");const i={contents:[{parts:[{text:`You are TravelMind AI, an expert travel planner. You must generate a highly detailed and realistic travel plan for a trip to ${e.destination} based on the user's details.
Your output MUST be a single, valid JSON object that matches the schema described below. Do not wrap the JSON in markdown code blocks or add any other text outside of the JSON object.

JSON Schema:
{
  "badge": "Itinerary Ready",
  "title": "Short catchy title for the trip",
  "subtitle": "Overview description (e.g. 5 Days • 2 Travelers • Styles: Culture, Food)",
  "overview": "A premium overview summary of the trip highlighting what the traveler will experience.",
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1 theme or focus",
      "morning_title": "Morning adventure title",
      "morning": "Detailed description of morning activities, sights to see.",
      "afternoon_title": "Afternoon exploration title",
      "afternoon": "Detailed description of afternoon activities.",
      "evening_title": "Evening & Dinner focus title",
      "evening": "Detailed description of evening activities and dinner."
    }
  ],
  "budget": {
    "Accommodation": estimated cost as a number,
    "Transport": estimated cost as a number,
    "Food": estimated cost as a number,
    "Sightseeing": estimated cost as a number,
    "Miscellaneous": estimated cost as a number
  },
  "totalBudget": total estimated budget (must be a number close to or matching ${e.budget}),
  "weather": [
    {
      "day": "Day 1",
      "temp": "Average temperature (e.g. 24°C)",
      "cond": "Short condition description (e.g. Sunny)",
      "icon": "Lucide weather icon name (choose one: sun, cloud, cloud-rain, cloud-lightning, cloud-snow, cloud-drizzle, wind, cloud-sun)"
    }
  ],
  "packing": ["Packing item 1", "Packing item 2", "Packing item 3", "Packing item 4", "Packing item 5"],
  "attractions": [
    {
      "name": "Attraction Name 1",
      "desc": "Short description of the attraction.",
      "rating": rating out of 5 (e.g. 4.8),
      "reviews": review count (e.g. 1540),
      "image": "Use a high quality unsplash image URL relevant to this attraction (or leave empty)"
    }
  ],
  "hotels": [
    {
      "name": "Recommended Hotel 1",
      "price": "Price per night (e.g. ₹5,000/night)",
      "desc": "Short description of the hotel and its vibe.",
      "rating": 4.4,
      "reviews": 120,
      "image": "Use a high quality unsplash image URL relevant to this hotel (or leave empty)"
    }
  ],
  "foods": [
    {
      "emoji": "Emoji of the food item (e.g. 🍣)",
      "name": "Local dish name",
      "desc": "Description of the dish."
    }
  ],
  "transport": [
    {
      "type": "Transit Mode (e.g. Subway)",
      "efficiency": "Efficiency tag (e.g. High / Fast)"
    }
  ],
  "safety": [
    {
      "icon": "Emoji or icon (e.g. 🛡️)",
      "title": "Safety tip title",
      "desc": "Safety advice details."
    }
  ]
}

User Details:
Destination: ${e.destination}
Duration: ${e.days} days (from ${e.startDate} to ${e.endDate})
Budget limit: ₹${e.budget}
Number of travelers: ${e.travelers}
Travel styles: ${e.travelStyles.join(", ")}
Interests/Preferences: ${e.preferences||"General exploration"}`}]}],generationConfig:{responseMimeType:"application/json"}},a=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(!a.ok){const K=((u=(await a.json().catch(()=>({}))).error)==null?void 0:u.message)||`HTTP ${a.status} ${a.statusText}`;throw new Error(`Gemini API Error: ${K}`)}const l=(y=(b=(E=(p=(h=(await a.json()).candidates)==null?void 0:h[0])==null?void 0:p.content)==null?void 0:E.parts)==null?void 0:b[0])==null?void 0:y.text;if(!l)throw new Error("No text content returned from Gemini API");return JSON.parse(l.trim())}function ae(e){console.log("[planner] Running simulated fallback generation...");const n=e.destination,t=e.days,r=e.travelStyles.length>0?e.travelStyles:["Adventure","Relaxation"],i=["Sunny","Partly Cloudy","Clear","Windy","Mild Rain"],a=["sun","cloud","cloud-sun","wind","cloud-drizzle"],o=[];for(let k=1;k<=Math.min(t,5);k++){const J=Math.floor(Math.random()*i.length);o.push({day:`Day ${k}`,temp:`${20+Math.floor(Math.random()*8)}°C`,cond:i[J],icon:a[J]})}const l=[],m=["Guided historic walking tour of the old quarter.","Explore the local street market and enjoy a fresh breakfast.","Visit the iconic central cathedral and museum.","Take a scenic cable car ride to the mountain overlook.","Stroll through the botanical gardens and take photos."],u=["Visit the high-end shopping district and local boutiques.","Join a traditional cooking class hosted by a local chef.","Rent bicycles and explore the waterfront path.","Relax at a top-rated local café and write in a travel journal.","Boat cruise down the central river to see the architecture."],h=["Enjoy a gourmet dinner at a rooftop restaurant overlooking the skyline.","Catch a live cultural performance or local acoustic music show.","Take a guided night walk through the neon-lit food alleys.","Sunset drinks by the beach or lakeside boardwalk.","Attend a wine tasting session at a historic cellar."];for(let k=1;k<=t;k++){const J=(k-1)%m.length,Ue=k%u.length,We=(k+1)%h.length;l.push({day:k,title:`Exploring the Wonders of ${n}`,morning_title:"Morning Adventure",morning:m[J],afternoon_title:"Afternoon Sightseeing",afternoon:u[Ue],evening_title:"Evening & Dinner",evening:h[We]})}const p=e.budget,E=Math.round(p*.35),b=Math.round(p*.2),y=Math.round(p*.25),L=Math.round(p*.12),K=Math.round(p*.08),Re={Accommodation:E,Transport:b,Food:y,Sightseeing:L,Miscellaneous:K},Fe=[{name:`The Grand Plaza of ${n}`,desc:`The bustling, historic heart of ${n}, surrounded by beautiful classical architecture and lively street performances.`,rating:4.8,reviews:2430,image:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&auto=format&fit=crop&q=60"},{name:`${n} National Art Museum`,desc:"Housing a collection of historical artifacts and masterpieces from local and international artists alike.",rating:4.7,reviews:1560,image:"https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=500&auto=format&fit=crop&q=60"},{name:"Riverfront Promenade",desc:"A beautiful, scenic tree-lined walkway perfect for an afternoon stroll or watching the sunset over the city.",rating:4.9,reviews:3200,image:"https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&auto=format&fit=crop&q=60"}],Ve=[{name:"The Grand Heritage Hotel",price:`₹${Math.round(E/t*.6).toLocaleString("en-IN")}/night`,desc:"Premium accommodation with exceptional service, featuring a panoramic sky terrace and spa.",rating:4.6,reviews:420,image:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60"},{name:"Urban Boutique Hotel",price:`₹${Math.round(E/t*.4).toLocaleString("en-IN")}/night`,desc:"A stylish, modern hotel in the city center within walking distance of primary sights.",rating:4.5,reviews:280,image:"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60"}],Ge=[{emoji:"🍲",name:"Traditional Local Stew",desc:"A hearty slow-cooked stew combining fresh seasonal vegetables and local herbs."},{emoji:"🥐",name:"Fresh Street Bakery Platter",desc:"Crispy, hand-rolled pastries baked fresh daily, famous in the city center."},{emoji:"🍛",name:"Spiced Street Rice",desc:"A savory street-food staple featuring aromatic rice, local spices, and grilled toppings."},{emoji:"🍧",name:"Glazed Shaved Ice",desc:"A popular local dessert infused with fruit syrups and sweetened condensed milk."}],ze=["Comfortable walking shoes","Camera or smartphone for pictures","Universal travel adapter","Light waterproof jacket","Refillable water bottle","Local currency cash"],qe=[{type:"Metro System",efficiency:"Highly Recommended"},{type:"Bicycle Rental",efficiency:"Eco-Friendly & Fun"},{type:"Ride-Sharing Apps",efficiency:"Convenient at Night"}],Je=[{icon:"🛡️",title:"Secure Belongings",desc:"Keep personal items secure, especially in crowded tourist hotspots."},{icon:"💡",title:"Stay Hydrated",desc:"Drink plenty of bottled water while exploring under the sun."},{icon:"📞",title:"Emergency Contacts",desc:"Save local emergency services numbers and the address of your embassy."}];return{badge:"Plan Simulated",title:`Grand Getaway to ${n}`,subtitle:`${t} Days • ${e.travelers} Traveler(s) • Styles: ${r.join(", ")}`,overview:`Discover the gorgeous sights of ${n}. This custom travel plan provides a balanced mix of adventure, relaxation, local food, and sights curated specifically for you.`,itinerary:l,budget:Re,totalBudget:p,weather:o,packing:ze,attractions:Fe,hotels:Ve,foods:Ge,transport:qe,safety:Je}}async function re(e){const n=await fetch(Ke,{method:"POST",headers:{"Content-Type":"application/json","ngrok-skip-browser-warning":"true"},body:JSON.stringify(e)});if(console.log(`[planner] Webhook response received. Status: ${n.status} ${n.statusText}`),!n.ok)throw new Error(`Server returned status ${n.status}: ${n.statusText}`);return await n.json()}async function Be(){console.log("[planner] Form submitted. Extracting input values...");const e=ie.value.trim(),n=M.value,t=A.value,r=parseInt(ce.value,10),i=parseInt(H.value,10),a=de.value.trim();if(!e||!n||!t||Number.isNaN(r)||Number.isNaN(i)){console.warn("[planner] Validation failed: missing required inputs."),alert("Please fill in all the planner options to continue.");return}if(new Date(t)<new Date(n)){console.warn("[planner] Validation failed: end date is before start date."),alert("End date should be on or after start date.");return}const o=new Date(n),l=new Date(t),m=Math.ceil(Math.abs(l-o)/(1e3*60*60*24))+1,u=Array.from(q),h=[...u,a].filter(Boolean).join(", "),p={destination:e,startDate:n,endDate:t,budget:r,days:m,travelers:i,travelStyles:u,interests:h||"general",preferences:a},E=localStorage.getItem("gemini_api_key");let b;if(E&&E.trim()){console.log("[planner] Gemini API Key detected. Using Gemini direct AI model..."),G(!0,"Crafting your AI travel plan via Gemini...");try{b=await He(p,E.trim()),console.log("[planner] Successfully generated trip via Gemini API.")}catch(y){console.error("[planner] Gemini AI generation failed, attempting n8n webhook fallback...",y),G(!0,"Gemini failed. Falling back to n8n webhook...");try{const L=await re(p);b=oe(L),console.log("[planner] Successfully generated trip via n8n webhook fallback.")}catch(L){console.error("[planner] Webhook fallback failed, using local simulation...",L),b=ae(p),$("Offline mode: Simulated plan generated!")}}}else{console.log("[planner] No Gemini API key found. Attempting custom n8n webhook..."),G(!0,"Connecting to n8n Webhook...");try{const y=await re(p);b=oe(y),console.log("[planner] Successfully generated trip via n8n webhook.")}catch(y){console.error("[planner] Webhook failed. Using local simulation...",y),b=ae(p),$("No API Key configured. Simulated plan generated!")}}try{console.log("[planner] Storing results in application state (appState)..."),v.formData=p,v.travelPlan=b,G(!1),console.log("[planner] Triggering UI results rendering..."),ke()}catch(y){G(!1),console.error("[planner] Rendering results failed:",y),$(`UI rendering error: ${y.message}`)}}x.addEventListener("submit",async e=>{e.preventDefault(),await Be()}),Ee.addEventListener("click",()=>{I.innerHTML=`
      <div class="chat-msg chat-msg-bot">
        <div class="chat-avatar"><i data-lucide="bot"></i></div>
        <div class="chat-msg-bubble">
          Chat cleared. Frontend prototype mode is active.
        </div>
      </div>
    `,typeof lucide<"u"&&lucide.createIcons()});function se(e){const n=e.trim();if(!n)return;const t=document.createElement("div");t.className="chat-msg chat-msg-user",t.innerHTML=`
      <div class="chat-avatar"><i data-lucide="user"></i></div>
      <div class="chat-msg-bubble">${n}</div>
    `,I.appendChild(t),I.scrollTop=I.scrollHeight,ee.disabled=!0,setTimeout(()=>{const r=document.createElement("div");r.className="chat-msg chat-msg-bot",r.innerHTML=`
        <div class="chat-avatar"><i data-lucide="bot"></i></div>
        <div class="chat-msg-bubble">${te}</div>
      `,I.appendChild(r),I.scrollTop=I.scrollHeight,ee.disabled=!1,console.log("[frontend-prototype] Chat action handled locally only."),$(te),typeof lucide<"u"&&lucide.createIcons()},1e3)}be.addEventListener("click",e=>{const n=e.target.closest(".suggestion-chip");n&&se(n.dataset.query||"")}),we.addEventListener("submit",e=>{e.preventDefault();const n=Z.value.trim();n&&(se(n),Z.value="")}),d.addEventListener("click",e=>{e.preventDefault(),document.getElementById("planner").scrollIntoView({behavior:"smooth",block:"start"})});const W=document.getElementById("back-to-top-btn");window.addEventListener("scroll",()=>{window.scrollY>300?W.classList.add("visible"):W.classList.remove("visible")}),W.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})});const Ne=document.querySelectorAll(".reveal"),_e=new IntersectionObserver((e,n)=>{e.forEach(t=>{t.isIntersecting&&(t.target.classList.add("reveal-visible"),n.unobserve(t.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});Ne.forEach(e=>_e.observe(e));const Pe=document.querySelectorAll("#home, #planner, #features"),Oe=document.querySelectorAll(".nav-link"),je=new IntersectionObserver(e=>{e.forEach(n=>{if(!n.isIntersecting)return;const t=n.target.getAttribute("id");Oe.forEach(r=>{r.classList.remove("active"),r.getAttribute("href")===`#${t}`&&r.classList.add("active")})})},{threshold:.2,rootMargin:"-80px 0px -50% 0px"});Pe.forEach(e=>je.observe(e))});
