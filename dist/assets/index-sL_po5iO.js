(function(){const d=document.createElement("link").relList;if(d&&d.supports&&d.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))f(l);new MutationObserver(l=>{for(const m of l)if(m.type==="childList")for(const L of m.addedNodes)L.tagName==="LINK"&&L.rel==="modulepreload"&&f(L)}).observe(document,{childList:!0,subtree:!0});function y(l){const m={};return l.integrity&&(m.integrity=l.integrity),l.referrerPolicy&&(m.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?m.credentials="include":l.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function f(l){if(l.ep)return;l.ep=!0;const m=y(l);fetch(l.href,m)}})();const xe="https://barista-sliced-outwit.ngrok-free.dev/webhook-test/travelmind/plan";function K(p){var y;let d=p;if(Array.isArray(p)&&((y=p[0])!=null&&y.json)?d=p[0].json:Array.isArray(p)&&p[0]&&(d=p[0]),!d)return{};if(d.text&&typeof d.text=="string"){const f=d.text.trim(),l=f.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);if(l)try{return JSON.parse(l[1].trim())}catch(m){throw console.error("[normalizeN8nResponse] Failed to parse JSON from markdown code block:",m),new Error(`Failed to parse travel plan: ${m.message}`)}if(f.startsWith("{")||f.startsWith("["))try{return JSON.parse(f)}catch(m){throw console.error("[normalizeN8nResponse] Failed to parse JSON from text field:",m),new Error(`Failed to parse travel plan: ${m.message}`)}}return d}function r(p){const d=document.createElement("div");return d.textContent=p,d.innerHTML}document.addEventListener("DOMContentLoaded",async()=>{typeof lucide<"u"&&lucide.createIcons();const p=document.body,d=document.getElementById("navbar"),y=document.getElementById("menu-toggle"),f=document.getElementById("nav-links"),l=document.getElementById("theme-toggle"),m=document.getElementById("hero-cta-btn"),L=document.getElementById("planner-form"),Q=document.getElementById("destination-input"),T=document.getElementById("start-date-input"),I=document.getElementById("end-date-input"),X=document.getElementById("budget-input"),x=document.getElementById("travelers-preset"),w=document.getElementById("travelers-count"),Z=document.getElementById("style-chips-container"),D=document.getElementById("preferences-input"),ee=document.getElementById("generate-btn"),R=document.getElementById("planner-loader"),te=document.getElementById("loader-msg"),G=document.getElementById("results"),ne=document.getElementById("results-title"),se=document.getElementById("results-subtitle"),$=document.getElementById("results-overview"),ie=document.getElementById("results-badge"),B=document.getElementById("itinerary-timeline-container"),S=document.getElementById("budget-list-container"),re=document.getElementById("budget-total-cost"),M=document.getElementById("weather-list-container"),A=document.getElementById("packing-list-container"),C=document.getElementById("attractions-grid"),_=document.getElementById("hotels-grid"),H=document.getElementById("foods-grid-container"),N=document.getElementById("transport-list-container"),O=document.getElementById("safety-list-container"),E=document.getElementById("chat-messages-container"),oe=document.getElementById("chat-suggestions-container"),Y=document.getElementById("chat-input-field"),ae=document.getElementById("chat-input-form"),ce=document.getElementById("clear-chat-btn"),z=document.getElementById("chat-send-btn"),W="Frontend prototype only. Backend integration coming soon.",k=new Set;(localStorage.getItem("theme")||"dark")==="light"&&p.classList.add("light-mode");function V(t){let n=document.getElementById("toast-container");n||(n=document.createElement("div"),n.id="toast-container",n.style.position="fixed",n.style.right="20px",n.style.bottom="20px",n.style.display="flex",n.style.flexDirection="column",n.style.gap="10px",n.style.zIndex="9999",document.body.appendChild(n));const e=document.createElement("div");e.textContent=t,e.style.padding="10px 14px",e.style.borderRadius="10px",e.style.color="#fff",e.style.background="rgba(17, 24, 39, 0.92)",e.style.border="1px solid rgba(167, 139, 250, 0.45)",e.style.boxShadow="0 10px 24px rgba(0, 0, 0, 0.28)",e.style.fontSize="0.9rem",e.style.opacity="0",e.style.transform="translateY(8px)",e.style.transition="all 220ms ease",n.appendChild(e),requestAnimationFrame(()=>{e.style.opacity="1",e.style.transform="translateY(0)"}),setTimeout(()=>{e.style.opacity="0",e.style.transform="translateY(8px)",setTimeout(()=>e.remove(),240)},2200)}l.addEventListener("click",()=>{p.classList.toggle("light-mode");const t=p.classList.contains("light-mode")?"light":"dark";localStorage.setItem("theme",t)}),y.addEventListener("click",()=>{const t=y.getAttribute("aria-expanded")==="true";y.setAttribute("aria-expanded",!t),f.classList.toggle("active")}),document.querySelectorAll(".nav-link").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".nav-link").forEach(n=>n.classList.remove("active")),t.classList.add("active"),f.classList.contains("active")&&(f.classList.remove("active"),y.setAttribute("aria-expanded","false"))})}),window.addEventListener("scroll",()=>{window.scrollY>50?(d.style.boxShadow="var(--shadow-card)",d.style.background=p.classList.contains("light-mode")?"rgba(248, 250, 252, 0.9)":"rgba(3, 3, 5, 0.85)"):(d.style.boxShadow="none",d.style.background=p.classList.contains("light-mode")?"rgba(248, 250, 252, 0.7)":"rgba(3, 3, 5, 0.6)")});const J=new Date().toISOString().split("T")[0];T.min=J,I.min=J,T.addEventListener("change",()=>{I.min=T.value,I.value&&I.value<T.value&&(I.value=T.value)}),x.addEventListener("change",()=>{const t=x.value;if(t==="custom"){w.focus();return}w.value=t}),w.addEventListener("input",()=>{const t=parseInt(w.value,10);[1,2,4,6].includes(t)?x.value=t.toString():x.value="custom"}),Z.addEventListener("click",t=>{const n=t.target.closest(".chip-btn");if(!n)return;const e=n.dataset.value;k.has(e)?(k.delete(e),n.classList.remove("active")):(k.add(e),n.classList.add("active"))});function j(t,n){ee.disabled=t,L.closest(".planner-card").style.display=t?"none":"block",R.style.display=t?"flex":"none",te.textContent=n||(t?"Generating your trip...":"Finding the best attractions..."),t&&R.scrollIntoView({behavior:"smooth",block:"center"})}function le(t,n){const e=K(n),i=t.travelStyles.length>0?t.travelStyles.join(", "):"General";ie.textContent=e.badge||e.status||e.label||"Itinerary Ready";const a=e.destination||e.location||t.destination;ne.textContent=e.title||e.trip_title||e.name||`Your Custom Trip to ${a}`;const s=e.travelers||e.travelers_count||t.travelers,o=e.days||e.duration||e.days_count||t.days;se.textContent=e.subtitle||e.trip_subtitle||`${o} Days • ${s} Traveler${s>1?"s":""} • Styles: ${i}`;const c=e.overview||e.description||e.summary||e.overview_text||e.trip_overview||"";$&&(c?($.textContent=c,$.style.display="block"):($.textContent="",$.style.display="none")),de(e,t),me(e,t.budget),pe(e),ue(e),ge(e),ve(e),fe(e),ye(e),he(e),G.classList.add("visible"),G.scrollIntoView({behavior:"smooth",block:"start"}),typeof lucide<"u"&&lucide.createIcons()}function de(t,n){B.innerHTML="";const e=t.itinerary||t.itineraryDays||t.days_plan||t.days;if(Array.isArray(e)&&e.length>0){e.forEach((s,o)=>{const c=document.createElement("div");c.className="itinerary-day";const u=s.day||s.day_number||o+1,g=s.title||s.theme||s.heading||s.summary||"Daily Exploration",v=s.morning_title||s.morningTitle||s.am_title||"Morning Adventure",b=typeof s.morning=="object"?s.morning.desc||s.morning.description||s.morning.activity||"":s.morning||s.am||s.morning_activity||s.morningActivity||"",h=s.afternoon_title||s.afternoonTitle||s.pm_title||"Midday Exploration",F=typeof s.afternoon=="object"?s.afternoon.desc||s.afternoon.description||s.afternoon.activity||"":s.afternoon||s.pm||s.afternoon_activity||s.afternoonActivity||"",q=s.evening_title||s.eveningTitle||s.night_title||"Evening & Dinner",$e=typeof s.evening=="object"?s.evening.desc||s.evening.description||s.evening.activity||"":s.evening||s.night||s.evening_activity||s.eveningActivity||"";c.innerHTML=`
          <div class="day-header">
            <span class="badge badge-primary">Day ${u}</span>
            <h3>${r(g)}</h3>
          </div>
          <div class="day-timeline">
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-time">Morning</div>
              <div class="timeline-title">${r(v)}</div>
              <div class="timeline-desc">${r(b)}</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-time">Afternoon</div>
              <div class="timeline-title">${r(h)}</div>
              <div class="timeline-desc">${r(F)}</div>
            </div>
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-time">Evening</div>
              <div class="timeline-title">${r(q)}</div>
              <div class="timeline-desc">${r($e)}</div>
            </div>
          </div>
        `,B.appendChild(c)});return}const a=t.plan||t.message||t.output||t.itineraryText||`Your ${n.days}-day trip to ${n.destination} is ready.`;B.innerHTML=`
      <div class="itinerary-day">
        <div class="day-header">
          <span class="badge badge-primary">Plan</span>
          <h3>TravelMind Plan</h3>
        </div>
        <div class="day-timeline">
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-desc" style="white-space: pre-wrap;">${r(String(a))}</div>
          </div>
        </div>
      </div>
    `}function me(t,n){S.innerHTML="";let e=t.budgetBreakdown||t.expenses||t.cost_breakdown||t.cost||t.budget;const i=t.totalBudget||t.budgetTotal||t.total_cost||t.budget&&t.budget.total||n;(typeof e=="number"||typeof e=="string")&&(e=null);let a="";typeof i=="number"?a=`₹${i.toLocaleString("en-IN")}`:typeof i=="string"?a=i.trim().startsWith("₹")?i.trim():`₹${i.trim()}`:a="₹0",re.textContent=a;const s=i?typeof i=="number"?i:parseInt(String(i).replace(/[^\d]/g,""),10):n;Array.isArray(e)&&e.length>0?e.forEach(o=>{const c=o.category||o.label||o.name||o.expense||"Expense",u=o.cost||o.amount||o.value||o.price||0,g=typeof u=="number"?u:parseInt(String(u).replace(/[^\d]/g,""),10),v=s?Math.min(100,Math.round(g/s*100)):0,b=document.createElement("div");b.className="budget-item",b.innerHTML=`
          <div class="budget-label-row">
              <span class="budget-cat">${r(c)}</span>
              <span class="budget-val">₹${g.toLocaleString("en-IN")} (${v}%)</span>
          </div>
          <div class="progress-track">
              <div class="progress-bar" data-value="${v}%"></div>
          </div>
        `,S.appendChild(b)}):e&&typeof e=="object"&&Object.keys(e).length>0?Object.entries(e).forEach(([o,c])=>{if(o.toLowerCase()==="total")return;const u=typeof c=="number"?c:parseInt(String(c).replace(/[^\d]/g,""),10),g=s?Math.min(100,Math.round(u/s*100)):0,v=document.createElement("div");v.className="budget-item",v.innerHTML=`
          <div class="budget-label-row">
              <span class="budget-cat">${r(o)}</span>
              <span class="budget-val">₹${u.toLocaleString("en-IN")} (${g}%)</span>
          </div>
          <div class="progress-track">
              <div class="progress-bar" data-value="${g}%"></div>
          </div>
        `,S.appendChild(v)}):S.innerHTML='<p class="card-desc">Budget breakdown will appear here after a trip is generated.</p>',setTimeout(()=>{document.querySelectorAll(".progress-bar").forEach(o=>{o.style.width=o.getAttribute("data-value")})},300)}function pe(t){M.innerHTML="";const n=t.weather||t.weatherForecast||t.forecast||t.weather_forecast||t.weather_details;if(!Array.isArray(n)||n.length===0){M.innerHTML='<p class="card-desc">Weather details will appear here after a trip is generated.</p>';return}n.forEach(e=>{const i=document.createElement("div");i.className="weather-day-card";const a=e.day||e.date||e.name||e.day_name||"Day",s=e.temp||e.temperature||e.avg_temp||e.temp_range||"",o=e.cond||e.condition||e.weather||e.sky||"",c=e.icon||e.weather_icon||"cloud-sun";i.innerHTML=`
        <div class="weather-name">${r(a)}</div>
        <div class="weather-icon"><i data-lucide="${c}"></i></div>
        <div class="weather-temp">${r(s)}</div>
        <div class="weather-desc">${r(o)}</div>
      `,M.appendChild(i)})}function ue(t){A.innerHTML="";const n=t.packing||t.packingList||t.checklist||t.packing_list||t.packing_checklist||t.items_to_pack;if(!Array.isArray(n)||n.length===0){A.innerHTML='<p class="card-desc">Packing checklist will appear here after a trip is generated.</p>';return}n.forEach((e,i)=>{const a=document.createElement("label");a.className="packing-item";const s=typeof e=="string"?e:e.name||e.item||e.title||"";a.innerHTML=`
        <input type="checkbox" id="pack-chk-${i}">
        <span>${r(s)}</span>
      `,A.appendChild(a)})}function ge(t){C.innerHTML="";const n=t.attractions||t.recommendedAttractions||t.places_to_visit||t.sightseeing||t.points_of_interest;if(!Array.isArray(n)||n.length===0){C.innerHTML='<p class="card-desc">Attraction recommendations will appear here after a trip is generated.</p>';return}n.forEach(e=>{const i=document.createElement("div");i.className="glass-panel attraction-card";const a=e.image||e.image_url||e.imageUrl||e.photo||"",s=a?`<div class="card-img-wrapper"><img src="${r(a)}" alt="${r(e.name||"Attraction")}"></div>`:"",o=e.rating||e.stars||"",c=e.reviews||e.reviews_count||"",u=o?`<div class="card-rating-row">
            <div class="card-rating">
              <i data-lucide="star" style="width: 14px; height: 14px; fill: #fbbf24; color: #fbbf24;"></i> 
              <span>${r(String(o))}</span>
              ${c?`<span style="color: var(--text-muted); font-size: 0.8rem; font-weight: normal; margin-left: 4px;">(${r(String(c))})</span>`:""}
            </div>
           </div>`:"";i.innerHTML=`
        ${s}
        <div class="card-content">
          ${u}
          <h4 class="card-title">${r(e.name||e.title||e.attraction_name||"Attraction")}</h4>
          <p class="card-desc">${r(e.desc||e.description||e.info||"")}</p>
        </div>
      `,C.appendChild(i)})}function ve(t){_.innerHTML="";const n=t.hotels||t.recommendedStays||t.accommodations||t.stays;if(!Array.isArray(n)||n.length===0){_.innerHTML='<p class="card-desc">Hotel recommendations will appear here after a trip is generated.</p>';return}n.forEach(e=>{const i=document.createElement("div");i.className="glass-panel hotel-card";const a=e.image||e.image_url||e.imageUrl||e.photo||"",s=a?`<div class="card-img-wrapper"><img src="${r(a)}" alt="${r(e.name||"Hotel")}"></div>`:"",o=e.rating||e.stars||"",c=e.reviews||e.reviews_count||"",u=o?`<div class="card-rating-row">
            <div class="card-rating">
              <i data-lucide="star" style="width: 14px; height: 14px; fill: #fbbf24; color: #fbbf24;"></i> 
              <span>${r(String(o))}</span>
              ${c?`<span style="color: var(--text-muted); font-size: 0.8rem; font-weight: normal; margin-left: 4px;">(${r(String(c))})</span>`:""}
            </div>
           </div>`:"",g=e.price||e.cost||e.price_per_night||"",v=e.desc||e.description||e.info||"";i.innerHTML=`
        ${s}
        <div class="card-content">
          ${u}
          <h4 class="card-title">${r(e.name||e.hotel_name||e.title||"Hotel")}</h4>
          <p class="card-desc">${r(v)}</p>
          ${g?`<div class="hotel-price">${r(g)}</div>`:""}
        </div>
      `,_.appendChild(i)})}function fe(t){H.innerHTML="";const n=t.foods||t.localCuisine||t.food_recommendations||t.dishes||t.local_foods;if(!Array.isArray(n)||n.length===0){H.innerHTML='<p class="card-desc">Food recommendations will appear here after a trip is generated.</p>';return}n.forEach(e=>{const i=document.createElement("div");i.className="glass-panel food-item-card";const a=e.emoji||e.icon||"🍽️";i.innerHTML=`
        <span class="food-emoji">${r(a)}</span>
        <h4 class="food-title">${r(e.name||e.dish_name||e.title||"Local Dish")}</h4>
        <p class="food-desc">${r(e.desc||e.description||e.info||"")}</p>
      `,H.appendChild(i)})}function ye(t){N.innerHTML="";const n=t.transport||t.transportation||t.travel_modes||t.transport_guide;if(!Array.isArray(n)||n.length===0){N.innerHTML='<p class="card-desc">Transport guide will appear here after a trip is generated.</p>';return}n.forEach(e=>{const i=document.createElement("div");i.className="transport-item";const a=e.type||e.name||e.mode||"Transport",s=e.efficiency||e.note||e.details||e.description||"Recommended";i.innerHTML=`
        <div class="transport-label"><span>${r(a)}</span></div>
        <span class="badge badge-primary">${r(s)}</span>
      `,N.appendChild(i)})}function he(t){O.innerHTML="";const n=t.safety||t.safetyTips||t.safety_tips||t.tips||t.advice;if(!Array.isArray(n)||n.length===0){O.innerHTML='<p class="card-desc">Safety tips will appear here after a trip is generated.</p>';return}n.forEach(e=>{const i=document.createElement("div");i.className="safety-item";const a=e.icon||e.emoji||"💡",s=e.title||e.name||e.heading||"Tip",o=e.desc||e.description||e.detail||"";i.innerHTML=`
        <span class="safety-icon">${r(a)}</span>
        <div class="safety-item-content">
          <h4 class="safety-item-title">${r(s)}</h4>
          <p class="safety-item-desc">${r(o)}</p>
        </div>
      `,O.appendChild(i)})}async function be(){const t=Q.value.trim(),n=T.value,e=I.value,i=parseInt(X.value,10),a=parseInt(w.value,10),s=D.value.trim();if(!t||!n||!e||Number.isNaN(i)||Number.isNaN(a)){alert("Please fill in all the planner options to continue.");return}if(new Date(e)<new Date(n)){alert("End date should be on or after start date.");return}const o=new Date(n),c=new Date(e),u=Math.ceil(Math.abs(c-o)/(1e3*60*60*24))+1,g=Array.from(k),v=[...g,s].filter(Boolean).join(", "),b={destination:t,startDate:n,endDate:e,budget:i,days:u,travelers:a,travelStyles:g,interests:v||"general",preferences:s};j(!0,"Generating your trip...");try{const h=await fetch(xe,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});if(!h.ok)throw new Error(`Server returned status ${h.status}: ${h.statusText}`);const F=await h.json(),q=K(F);j(!1),le(b,q),V("Trip generated successfully!")}catch(h){j(!1),console.error("[planner] Trip generation failed:",h),V(`Network/API error: ${h.message}`)}}L.addEventListener("submit",async t=>{t.preventDefault(),await be()}),ce.addEventListener("click",()=>{E.innerHTML=`
      <div class="chat-msg chat-msg-bot">
        <div class="chat-avatar"><i data-lucide="bot"></i></div>
        <div class="chat-msg-bubble">
          Chat cleared. Frontend prototype mode is active.
        </div>
      </div>
    `,typeof lucide<"u"&&lucide.createIcons()});function U(t){const n=t.trim();if(!n)return;const e=document.createElement("div");e.className="chat-msg chat-msg-user",e.innerHTML=`
      <div class="chat-avatar"><i data-lucide="user"></i></div>
      <div class="chat-msg-bubble">${n}</div>
    `,E.appendChild(e),E.scrollTop=E.scrollHeight,z.disabled=!0,setTimeout(()=>{const i=document.createElement("div");i.className="chat-msg chat-msg-bot",i.innerHTML=`
        <div class="chat-avatar"><i data-lucide="bot"></i></div>
        <div class="chat-msg-bubble">${W}</div>
      `,E.appendChild(i),E.scrollTop=E.scrollHeight,z.disabled=!1,console.log("[frontend-prototype] Chat action handled locally only."),V(W),typeof lucide<"u"&&lucide.createIcons()},1e3)}oe.addEventListener("click",t=>{const n=t.target.closest(".suggestion-chip");n&&U(n.dataset.query||"")}),ae.addEventListener("submit",t=>{t.preventDefault();const n=Y.value.trim();n&&(U(n),Y.value="")}),m.addEventListener("click",t=>{t.preventDefault(),document.getElementById("planner").scrollIntoView({behavior:"smooth",block:"start"})});const P=document.getElementById("back-to-top-btn");window.addEventListener("scroll",()=>{window.scrollY>300?P.classList.add("visible"):P.classList.remove("visible")}),P.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})});const Ee=document.querySelectorAll(".reveal"),Le=new IntersectionObserver((t,n)=>{t.forEach(e=>{e.isIntersecting&&(e.target.classList.add("reveal-visible"),n.unobserve(e.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});Ee.forEach(t=>Le.observe(t));const Te=document.querySelectorAll("#home, #planner, #features"),Ie=document.querySelectorAll(".nav-link"),we=new IntersectionObserver(t=>{t.forEach(n=>{if(!n.isIntersecting)return;const e=n.target.getAttribute("id");Ie.forEach(i=>{i.classList.remove("active"),i.getAttribute("href")===`#${e}`&&i.classList.add("active")})})},{threshold:.2,rootMargin:"-80px 0px -50% 0px"});Te.forEach(t=>we.observe(t))});
