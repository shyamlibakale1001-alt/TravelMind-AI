/*
 * TravelMind - Frontend Prototype Logic
 */

const WEBHOOK_URL = "https://barista-sliced-outwit.ngrok-free.dev/webhook-test/travelmind/plan";

function normalizeN8nResponse(raw) {
  console.log('[normalizeN8nResponse] Incoming raw payload:', raw);
  let data = raw;
  if (Array.isArray(raw) && raw[0]?.json) {
    console.log('[normalizeN8nResponse] Detected raw[0].json array structure.');
    data = raw[0].json;
  } else if (Array.isArray(raw) && raw[0]) {
    console.log('[normalizeN8nResponse] Detected raw[0] array structure.');
    data = raw[0];
  }

  if (!data) {
    console.warn('[normalizeN8nResponse] Data payload is empty/falsy.');
    return {};
  }

  // Unwrap body if wrapped by n8n
  if (data.body && typeof data.body === 'object') {
    console.log('[normalizeN8nResponse] Unwrapping data.body wrapper:', data.body);
    data = data.body;
  } else if (data.data && typeof data.data === 'object' && !data.itinerary && !data.plan && !data.itineraryDays) {
    console.log('[normalizeN8nResponse] Unwrapping data.data wrapper:', data.data);
    data = data.data;
  }

  // Check if response contains a "text" field that has a markdown code block containing JSON
  if (data.text && typeof data.text === 'string') {
    const trimmedText = data.text.trim();
    console.log('[normalizeN8nResponse] Checking data.text for markdown/JSON payload:', trimmedText.substring(0, 100) + '...');
    
    // Match standard markdown code block: ```json ... ``` or ``` ... ```
    const match = trimmedText.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    
    if (match) {
      try {
        const parsed = JSON.parse(match[1].trim());
        console.log('[normalizeN8nResponse] Successfully parsed JSON from markdown code block:', parsed);
        return parsed;
      } catch (err) {
        console.error('[normalizeN8nResponse] Failed to parse JSON from markdown code block:', err);
        throw new Error(`Failed to parse travel plan: ${err.message}`);
      }
    }

    // Fallback: If it's a JSON string but doesn't have markdown code fences
    if (trimmedText.startsWith('{') || trimmedText.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmedText);
        console.log('[normalizeN8nResponse] Successfully parsed JSON from text field:', parsed);
        return parsed;
      } catch (err) {
        console.error('[normalizeN8nResponse] Failed to parse JSON from text field:', err);
        throw new Error(`Failed to parse travel plan: ${err.message}`);
      }
    }
  }

  console.log('[normalizeN8nResponse] Final normalized data output:', data);
  return data;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', async () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  const body = document.body;
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const themeToggle = document.getElementById('theme-toggle');
  const heroCtaBtn = document.getElementById('hero-cta-btn');

  const plannerForm = document.getElementById('planner-form');
  const destinationInput = document.getElementById('destination-input');
  const startDateInput = document.getElementById('start-date-input');
  const endDateInput = document.getElementById('end-date-input');
  const budgetInput = document.getElementById('budget-input');
  const travelersPreset = document.getElementById('travelers-preset');
  const travelersCount = document.getElementById('travelers-count');
  const styleChipsContainer = document.getElementById('style-chips-container');
  const preferencesInput = document.getElementById('preferences-input');
  const generateBtn = document.getElementById('generate-btn');
  const loaderOverlay = document.getElementById('planner-loader');
  const loaderMsg = document.getElementById('loader-msg');

  const resultsSection = document.getElementById('results');
  const resultsTitle = document.getElementById('results-title');
  const resultsSubtitle = document.getElementById('results-subtitle');
  const resultsOverview = document.getElementById('results-overview');
  const resultsBadge = document.getElementById('results-badge');
  const itineraryContainer = document.getElementById('itinerary-timeline-container');
  const budgetListContainer = document.getElementById('budget-list-container');
  const budgetTotalCost = document.getElementById('budget-total-cost');

  // Global Application State to store dynamic data
  const appState = {
    formData: null,
    travelPlan: null
  };

  // API Configuration Modal Elements
  const apiKeyBtn = document.getElementById('api-key-btn');
  const apiModal = document.getElementById('api-modal');
  const apiModalClose = document.getElementById('api-modal-close');
  const apiModalClear = document.getElementById('api-modal-clear');
  const apiModalSave = document.getElementById('api-modal-save');
  const apiKeyInput = document.getElementById('api-key-input');
  const weatherListContainer = document.getElementById('weather-list-container');
  const packingListContainer = document.getElementById('packing-list-container');
  const attractionsGrid = document.getElementById('attractions-grid');
  const hotelsGrid = document.getElementById('hotels-grid');
  const foodsGridContainer = document.getElementById('foods-grid-container');
  const transportListContainer = document.getElementById('transport-list-container');
  const safetyListContainer = document.getElementById('safety-list-container');

  const chatMessagesContainer = document.getElementById('chat-messages-container');
  const chatSuggestionsContainer = document.getElementById('chat-suggestions-container');
  const chatInputField = document.getElementById('chat-input-field');
  const chatInputForm = document.getElementById('chat-input-form');
  const clearChatBtn = document.getElementById('clear-chat-btn');
  const chatSendBtn = document.getElementById('chat-send-btn');

  const PROTOTYPE_MSG = "Frontend prototype only. Backend integration coming soon.";
  const selectedStyles = new Set();

  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    body.classList.add('light-mode');
  }

  function showToast(message) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.style.position = 'fixed';
      toastContainer.style.right = '20px';
      toastContainer.style.bottom = '20px';
      toastContainer.style.display = 'flex';
      toastContainer.style.flexDirection = 'column';
      toastContainer.style.gap = '10px';
      toastContainer.style.zIndex = '9999';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.padding = '10px 14px';
    toast.style.borderRadius = '10px';
    toast.style.color = '#fff';
    toast.style.background = 'rgba(17, 24, 39, 0.92)';
    toast.style.border = '1px solid rgba(167, 139, 250, 0.45)';
    toast.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.28)';
    toast.style.fontSize = '0.9rem';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 220ms ease';
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 240);
    }, 2200);
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
  });

  // Handle API Key Configuration Modal
  if (apiKeyBtn && apiModal) {
    apiKeyBtn.addEventListener('click', () => {
      const savedKey = localStorage.getItem('gemini_api_key') || '';
      apiKeyInput.value = savedKey;
      apiModal.classList.add('active');
    });

    apiModalClose.addEventListener('click', () => {
      apiModal.classList.remove('active');
    });

    apiModalClear.addEventListener('click', () => {
      localStorage.removeItem('gemini_api_key');
      apiKeyInput.value = '';
      showToast("API Key removed.");
      apiModal.classList.remove('active');
    });

    apiModalSave.addEventListener('click', () => {
      const keyVal = apiKeyInput.value.trim();
      if (!keyVal) {
        localStorage.removeItem('gemini_api_key');
        showToast("API Key cleared.");
      } else {
        localStorage.setItem('gemini_api_key', keyVal);
        showToast("Gemini API Key saved successfully!");
      }
      apiModal.classList.remove('active');
    });

    apiModal.addEventListener('click', (e) => {
      if (e.target === apiModal) {
        apiModal.classList.remove('active');
      }
    });
  }

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-link').forEach(nl => nl.classList.remove('active'));
      link.classList.add('active');
      
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = 'var(--shadow-card)';
      navbar.style.background = body.classList.contains('light-mode') 
        ? 'rgba(248, 250, 252, 0.9)' 
        : 'rgba(3, 3, 5, 0.85)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.background = body.classList.contains('light-mode')
        ? 'rgba(248, 250, 252, 0.7)'
        : 'rgba(3, 3, 5, 0.6)';
    }
  });

  const todayStr = new Date().toISOString().split('T')[0];
  startDateInput.min = todayStr;
  endDateInput.min = todayStr;

  startDateInput.addEventListener('change', () => {
    endDateInput.min = startDateInput.value;
    if (endDateInput.value && endDateInput.value < startDateInput.value) {
      endDateInput.value = startDateInput.value;
    }
  });

  travelersPreset.addEventListener('change', () => {
    const presetVal = travelersPreset.value;
    if (presetVal === 'custom') {
      travelersCount.focus();
      return;
    }
    travelersCount.value = presetVal;
  });

  travelersCount.addEventListener('input', () => {
    const count = parseInt(travelersCount.value, 10);
    if ([1, 2, 4, 6].includes(count)) {
      travelersPreset.value = count.toString();
    } else {
      travelersPreset.value = 'custom';
    }
  });

  styleChipsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip-btn');
    if (!btn) return;
    
    const styleVal = btn.dataset.value;
    if (selectedStyles.has(styleVal)) {
      selectedStyles.delete(styleVal);
      btn.classList.remove('active');
    } else {
      selectedStyles.add(styleVal);
      btn.classList.add('active');
    }
  });

  function setPlannerLoadingState(isLoading, message) {
    generateBtn.disabled = isLoading;
    plannerForm.closest('.planner-card').style.display = isLoading ? 'none' : 'block';
    loaderOverlay.style.display = isLoading ? 'flex' : 'none';
    loaderMsg.textContent = message || (isLoading ? "Generating your trip..." : "Finding the best attractions...");
    if (isLoading) {
      loaderOverlay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function showPlannerResults() {
    console.log('[planner] showPlannerResults triggered.');
    const data = appState.travelPlan;
    const formData = appState.formData;

    if (!data || !formData) {
      console.error('[planner] showPlannerResults called with empty appState!', appState);
      return;
    }

    const styleStr = formData.travelStyles && formData.travelStyles.length > 0 
      ? formData.travelStyles.join(', ') 
      : "General";

    resultsBadge.textContent = data.badge || data.status || data.label || 'Itinerary Ready';
    
    const dest = data.destination || data.location || formData.destination;
    resultsTitle.textContent = data.title || data.trip_title || data.name || `Your Custom Trip to ${dest}`;
    
    const travelersCountVal = data.travelers || data.travelers_count || formData.travelers;
    const daysCountVal = data.days || data.duration || data.days_count || formData.days;
    resultsSubtitle.textContent = data.subtitle || data.trip_subtitle
      || `${daysCountVal} Days • ${travelersCountVal} Traveler${travelersCountVal > 1 ? 's' : ''} • Styles: ${styleStr}`;

    const overviewText = data.overview || data.description || data.summary || data.overview_text || data.trip_overview || '';
    if (resultsOverview) {
      if (overviewText) {
        resultsOverview.textContent = overviewText;
        resultsOverview.style.display = 'block';
      } else {
        resultsOverview.textContent = '';
        resultsOverview.style.display = 'none';
      }
    }

    console.log('[planner] Executing component-specific rendering with isolation...');

    const renderComponents = [
      { name: 'Itinerary', fn: renderItinerary },
      { name: 'Budget', fn: renderBudget },
      { name: 'Weather', fn: renderWeather },
      { name: 'Packing', fn: renderPacking },
      { name: 'Attractions', fn: renderAttractions },
      { name: 'Hotels', fn: renderHotels },
      { name: 'Foods', fn: renderFoods },
      { name: 'Transport', fn: renderTransport },
      { name: 'Safety', fn: renderSafety }
    ];

    renderComponents.forEach(component => {
      try {
        console.log(`[planner] Rendering panel: ${component.name}`);
        component.fn();
      } catch (err) {
        console.error(`[planner] Failed rendering panel "${component.name}":`, err);
      }
    });

    resultsSection.classList.add('visible');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    console.log('[planner] showPlannerResults execution completed.');
  }

   function renderItinerary() {
    try {
      itineraryContainer.innerHTML = '';
      const data = appState.travelPlan;
      const formData = appState.formData;
      if (!data || !formData) {
        itineraryContainer.innerHTML = `<p class="card-desc">Itinerary details will appear here after a trip is generated.</p>`;
        return;
      }

      const days = data.itinerary || data.itineraryDays || data.days_plan || data.days;

      if (Array.isArray(days) && days.length > 0) {
        days.forEach((dayData, index) => {
          if (!dayData) return;
          const dayEl = document.createElement('div');
          dayEl.className = 'itinerary-day';
          
          const dayNum = dayData.day || dayData.day_number || index + 1;
          const dayTitle = dayData.title || dayData.theme || dayData.heading || dayData.summary || 'Daily Exploration';

          // Extract morning activity details dynamically
          const morningTitle = dayData.morning_title || dayData.morningTitle || dayData.am_title || 'Morning Adventure';
          const morningDesc = (dayData.morning && typeof dayData.morning === 'object') 
            ? (dayData.morning.desc || dayData.morning.description || dayData.morning.activity || '') 
            : (dayData.morning || dayData.am || dayData.morning_activity || dayData.morningActivity || '');

          // Extract afternoon activity details dynamically
          const afternoonTitle = dayData.afternoon_title || dayData.afternoonTitle || dayData.pm_title || 'Midday Exploration';
          const afternoonDesc = (dayData.afternoon && typeof dayData.afternoon === 'object') 
            ? (dayData.afternoon.desc || dayData.afternoon.description || dayData.afternoon.activity || '') 
            : (dayData.afternoon || dayData.pm || dayData.afternoon_activity || dayData.afternoonActivity || '');

          // Extract evening activity details dynamically
          const eveningTitle = dayData.evening_title || dayData.eveningTitle || dayData.night_title || 'Evening & Dinner';
          const eveningDesc = (dayData.evening && typeof dayData.evening === 'object') 
            ? (dayData.evening.desc || dayData.evening.description || dayData.evening.activity || '') 
            : (dayData.evening || dayData.night || dayData.evening_activity || dayData.eveningActivity || '');

          dayEl.innerHTML = `
            <div class="day-header">
              <span class="badge badge-primary">Day ${dayNum}</span>
              <h3>${escapeHtml(dayTitle)}</h3>
            </div>
            <div class="day-timeline">
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-time">Morning</div>
                <div class="timeline-title">${escapeHtml(morningTitle)}</div>
                <div class="timeline-desc">${escapeHtml(morningDesc)}</div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-time">Afternoon</div>
                <div class="timeline-title">${escapeHtml(afternoonTitle)}</div>
                <div class="timeline-desc">${escapeHtml(afternoonDesc)}</div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-time">Evening</div>
                <div class="timeline-title">${escapeHtml(eveningTitle)}</div>
                <div class="timeline-desc">${escapeHtml(eveningDesc)}</div>
              </div>
            </div>
          `;
          itineraryContainer.appendChild(dayEl);
        });
        return;
      }

      const planText = data.plan || data.message || data.output || data.itineraryText;
      const fallbackText = planText
        || `Your ${formData.days}-day trip to ${formData.destination} is ready.`;

      itineraryContainer.innerHTML = `
        <div class="itinerary-day">
          <div class="day-header">
            <span class="badge badge-primary">Plan</span>
            <h3>TravelMind Plan</h3>
          </div>
          <div class="day-timeline">
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-desc" style="white-space: pre-wrap;">${escapeHtml(String(fallbackText))}</div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error('[renderItinerary] Critical error:', err);
      itineraryContainer.innerHTML = `<p class="card-desc" style="color: var(--accent-color);">Failed to render itinerary panel: ${escapeHtml(err.message)}</p>`;
    }
  }

  function renderBudget() {
    try {
      budgetListContainer.innerHTML = '';
      const data = appState.travelPlan;
      const formData = appState.formData;
      if (!data || !formData) {
        budgetListContainer.innerHTML = `<p class="card-desc">Budget breakdown will appear here after a trip is generated.</p>`;
        budgetTotalCost.textContent = '';
        return;
      }
      
      let breakdown = data.budgetBreakdown || data.expenses || data.cost_breakdown || data.cost || data.budget;
      const total = data.totalBudget || data.budgetTotal || data.total_cost || (data.budget && data.budget.total) || formData.budget;
      
      if (typeof breakdown === 'number' || typeof breakdown === 'string') {
        breakdown = null;
      }

      let displayTotal = '';
      if (typeof total === 'number') {
        displayTotal = `₹${total.toLocaleString('en-IN')}`;
      } else if (typeof total === 'string') {
        displayTotal = total.trim().startsWith('₹') ? total.trim() : `₹${total.trim()}`;
      } else {
        displayTotal = `₹0`;
      }
      budgetTotalCost.textContent = displayTotal;

      const parsedTotal = total ? (typeof total === 'number' ? total : parseInt(String(total).replace(/[^\d]/g, ''), 10)) : formData.budget;

      if (Array.isArray(breakdown) && breakdown.length > 0) {
        breakdown.forEach(item => {
          if (!item) return;
          const label = item.category || item.label || item.name || item.expense || 'Expense';
          const value = item.cost || item.amount || item.value || item.price || 0;
          const amount = typeof value === 'number' ? value : parseInt(String(value).replace(/[^\d]/g, ''), 10);
          const pct = parsedTotal ? Math.min(100, Math.round((amount / parsedTotal) * 100)) : 0;
          
          const divItem = document.createElement('div');
          divItem.className = 'budget-item';
          divItem.innerHTML = `
            <div class="budget-label-row">
                <span class="budget-cat">${escapeHtml(label)}</span>
                <span class="budget-val">₹${amount.toLocaleString('en-IN')} (${pct}%)</span>
            </div>
            <div class="progress-track">
                <div class="progress-bar" data-value="${pct}%"></div>
            </div>
          `;
          budgetListContainer.appendChild(divItem);
        });
      } else if (breakdown && typeof breakdown === 'object' && Object.keys(breakdown).length > 0) {
        Object.entries(breakdown).forEach(([label, value]) => {
          if (label.toLowerCase() === 'total') return;

          const amount = typeof value === 'number' ? value : parseInt(String(value).replace(/[^\d]/g, ''), 10);
          const pct = parsedTotal ? Math.min(100, Math.round((amount / parsedTotal) * 100)) : 0;
          
          const divItem = document.createElement('div');
          divItem.className = 'budget-item';
          divItem.innerHTML = `
            <div class="budget-label-row">
                <span class="budget-cat">${escapeHtml(label)}</span>
                <span class="budget-val">₹${amount.toLocaleString('en-IN')} (${pct}%)</span>
            </div>
            <div class="progress-track">
                <div class="progress-bar" data-value="${pct}%"></div>
            </div>
          `;
          budgetListContainer.appendChild(divItem);
        });
      } else {
        budgetListContainer.innerHTML = `<p class="card-desc">Detailed expenses breakdown is not available.</p>`;
      }

      setTimeout(() => {
        document.querySelectorAll('.progress-bar').forEach(bar => {
          bar.style.width = bar.getAttribute('data-value');
        });
      }, 300);
    } catch (err) {
      console.error('[renderBudget] Critical error:', err);
      budgetListContainer.innerHTML = `<p class="card-desc" style="color: var(--accent-color);">Failed to render budget panel: ${escapeHtml(err.message)}</p>`;
    }
  }

  function renderWeather() {
    try {
      weatherListContainer.innerHTML = '';
      const data = appState.travelPlan;
      if (!data) {
        weatherListContainer.innerHTML = `<p class="card-desc">Weather details will appear here after a trip is generated.</p>`;
        return;
      }
      const weather = data.weather || data.weatherForecast || data.forecast || data.weather_forecast || data.weather_details;
      if (!Array.isArray(weather) || weather.length === 0) {
        weatherListContainer.innerHTML = `<p class="card-desc">Weather forecast is not available.</p>`;
        return;
      }
      weather.forEach(w => {
        if (!w) return;
        const card = document.createElement('div');
        card.className = 'weather-day-card';
        const dayName = w.day || w.date || w.name || w.day_name || 'Day';
        const temp = w.temp || w.temperature || w.avg_temp || w.temp_range || '';
        const condition = w.cond || w.condition || w.weather || w.sky || '';
        const icon = w.icon || w.weather_icon || 'cloud-sun';
        
        card.innerHTML = `
          <div class="weather-name">${escapeHtml(dayName)}</div>
          <div class="weather-icon"><i data-lucide="${icon}"></i></div>
          <div class="weather-temp">${escapeHtml(temp)}</div>
          <div class="weather-desc">${escapeHtml(condition)}</div>
        `;
        weatherListContainer.appendChild(card);
      });
    } catch (err) {
      console.error('[renderWeather] Critical error:', err);
      weatherListContainer.innerHTML = `<p class="card-desc" style="color: var(--accent-color);">Failed to render weather panel: ${escapeHtml(err.message)}</p>`;
    }
  }

  function renderPacking() {
    try {
      packingListContainer.innerHTML = '';
      const data = appState.travelPlan;
      if (!data) {
        packingListContainer.innerHTML = `<p class="card-desc">Packing checklist will appear here after a trip is generated.</p>`;
        return;
      }
      const packing = data.packing || data.packingList || data.checklist || data.packing_list || data.packing_checklist || data.items_to_pack;
      if (!Array.isArray(packing) || packing.length === 0) {
        packingListContainer.innerHTML = `<p class="card-desc">Packing checklist is empty.</p>`;
        return;
      }
      packing.forEach((item, idx) => {
        if (!item) return;
        const label = document.createElement('label');
        label.className = 'packing-item';
        const name = typeof item === 'string' ? item : (item.name || item.item || item.title || '');
        label.innerHTML = `
          <input type="checkbox" id="pack-chk-${idx}">
          <span>${escapeHtml(name)}</span>
        `;
        packingListContainer.appendChild(label);
      });
    } catch (err) {
      console.error('[renderPacking] Critical error:', err);
      packingListContainer.innerHTML = `<p class="card-desc" style="color: var(--accent-color);">Failed to render packing panel: ${escapeHtml(err.message)}</p>`;
    }
  }

  function renderAttractions() {
    try {
      attractionsGrid.innerHTML = '';
      const data = appState.travelPlan;
      if (!data) {
        attractionsGrid.innerHTML = `<p class="card-desc">Attraction recommendations will appear here after a trip is generated.</p>`;
        return;
      }
      const attractions = data.attractions || data.recommendedAttractions || data.places_to_visit || data.sightseeing || data.points_of_interest;
      if (!Array.isArray(attractions) || attractions.length === 0) {
        attractionsGrid.innerHTML = `<p class="card-desc">No attractions found for this destination.</p>`;
        return;
      }
      attractions.forEach(attr => {
        if (!attr) return;
        const card = document.createElement('div');
        card.className = 'glass-panel attraction-card';
        
        const imgUrl = attr.image || attr.image_url || attr.imageUrl || attr.photo || '';
        const imgHtml = imgUrl 
          ? `<div class="card-img-wrapper"><img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(attr.name || 'Attraction')}"></div>`
          : '';
          
        const ratingVal = attr.rating || attr.stars || '';
        const reviewsVal = attr.reviews || attr.reviews_count || '';
        const ratingHtml = ratingVal
          ? `<div class="card-rating-row">
              <div class="card-rating">
                <i data-lucide="star" style="width: 14px; height: 14px; fill: #fbbf24; color: #fbbf24;"></i> 
                <span>${escapeHtml(String(ratingVal))}</span>
                ${reviewsVal ? `<span style="color: var(--text-muted); font-size: 0.8rem; font-weight: normal; margin-left: 4px;">(${escapeHtml(String(reviewsVal))})</span>` : ''}
              </div>
             </div>`
          : '';

        card.innerHTML = `
          ${imgHtml}
          <div class="card-content">
            ${ratingHtml}
            <h4 class="card-title">${escapeHtml(attr.name || attr.title || attr.attraction_name || 'Attraction')}</h4>
            <p class="card-desc">${escapeHtml(attr.desc || attr.description || attr.info || '')}</p>
          </div>
        `;
        attractionsGrid.appendChild(card);
      });
    } catch (err) {
      console.error('[renderAttractions] Critical error:', err);
      attractionsGrid.innerHTML = `<p class="card-desc" style="color: var(--accent-color);">Failed to render attractions panel: ${escapeHtml(err.message)}</p>`;
    }
  }

  function renderHotels() {
    try {
      hotelsGrid.innerHTML = '';
      const data = appState.travelPlan;
      if (!data) {
        hotelsGrid.innerHTML = `<p class="card-desc">Hotel recommendations will appear here after a trip is generated.</p>`;
        return;
      }
      const hotels = data.hotels || data.recommendedStays || data.accommodations || data.stays;
      if (!Array.isArray(hotels) || hotels.length === 0) {
        hotelsGrid.innerHTML = `<p class="card-desc">No hotel recommendations found.</p>`;
        return;
      }
      hotels.forEach(hotel => {
        if (!hotel) return;
        const card = document.createElement('div');
        card.className = 'glass-panel hotel-card';

        const imgUrl = hotel.image || hotel.image_url || hotel.imageUrl || hotel.photo || '';
        const imgHtml = imgUrl 
          ? `<div class="card-img-wrapper"><img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(hotel.name || 'Hotel')}"></div>`
          : '';
          
        const ratingVal = hotel.rating || hotel.stars || '';
        const reviewsVal = hotel.reviews || hotel.reviews_count || '';
        const ratingHtml = ratingVal
          ? `<div class="card-rating-row">
              <div class="card-rating">
                <i data-lucide="star" style="width: 14px; height: 14px; fill: #fbbf24; color: #fbbf24;"></i> 
                <span>${escapeHtml(String(ratingVal))}</span>
                ${reviewsVal ? `<span style="color: var(--text-muted); font-size: 0.8rem; font-weight: normal; margin-left: 4px;">(${escapeHtml(String(reviewsVal))})</span>` : ''}
              </div>
             </div>`
          : '';

        const priceVal = hotel.price || hotel.cost || hotel.price_per_night || '';
        const descVal = hotel.desc || hotel.description || hotel.info || '';

        card.innerHTML = `
          ${imgHtml}
          <div class="card-content">
            ${ratingHtml}
            <h4 class="card-title">${escapeHtml(hotel.name || hotel.hotel_name || hotel.title || 'Hotel')}</h4>
            <p class="card-desc">${escapeHtml(descVal)}</p>
            ${priceVal ? `<div class="hotel-price">${escapeHtml(priceVal)}</div>` : ''}
          </div>
        `;
        hotelsGrid.appendChild(card);
      });
    } catch (err) {
      console.error('[renderHotels] Critical error:', err);
      hotelsGrid.innerHTML = `<p class="card-desc" style="color: var(--accent-color);">Failed to render hotels panel: ${escapeHtml(err.message)}</p>`;
    }
  }

  function renderFoods() {
    try {
      foodsGridContainer.innerHTML = '';
      const data = appState.travelPlan;
      if (!data) {
        foodsGridContainer.innerHTML = `<p class="card-desc">Food recommendations will appear here after a trip is generated.</p>`;
        return;
      }
      const foods = data.foods || data.localCuisine || data.food_recommendations || data.dishes || data.local_foods;
      if (!Array.isArray(foods) || foods.length === 0) {
        foodsGridContainer.innerHTML = `<p class="card-desc">No local foods recommendations found.</p>`;
        return;
      }
      foods.forEach(food => {
        if (!food) return;
        const card = document.createElement('div');
        card.className = 'glass-panel food-item-card';
        
        const emojiVal = food.emoji || food.icon || '🍽️';
        
        card.innerHTML = `
          <span class="food-emoji">${escapeHtml(emojiVal)}</span>
          <h4 class="food-title">${escapeHtml(food.name || food.dish_name || food.title || 'Local Dish')}</h4>
          <p class="food-desc">${escapeHtml(food.desc || food.description || food.info || '')}</p>
        `;
        foodsGridContainer.appendChild(card);
      });
    } catch (err) {
      console.error('[renderFoods] Critical error:', err);
      foodsGridContainer.innerHTML = `<p class="card-desc" style="color: var(--accent-color);">Failed to render local foods panel: ${escapeHtml(err.message)}</p>`;
    }
  }

  function renderTransport() {
    try {
      transportListContainer.innerHTML = '';
      const data = appState.travelPlan;
      if (!data) {
        transportListContainer.innerHTML = `<p class="card-desc">Transport guide will appear here after a trip is generated.</p>`;
        return;
      }
      const transport = data.transport || data.transportation || data.travel_modes || data.transport_guide;
      if (!Array.isArray(transport) || transport.length === 0) {
        transportListContainer.innerHTML = `<p class="card-desc">No transport guide found.</p>`;
        return;
      }
      transport.forEach(t => {
        if (!t) return;
        const item = document.createElement('div');
        item.className = 'transport-item';
        const typeVal = t.type || t.name || t.mode || 'Transport';
        const noteVal = t.efficiency || t.note || t.details || t.description || 'Recommended';
        item.innerHTML = `
          <div class="transport-label"><span>${escapeHtml(typeVal)}</span></div>
          <span class="badge badge-primary">${escapeHtml(noteVal)}</span>
        `;
        transportListContainer.appendChild(item);
      });
    } catch (err) {
      console.error('[renderTransport] Critical error:', err);
      transportListContainer.innerHTML = `<p class="card-desc" style="color: var(--accent-color);">Failed to render transport panel: ${escapeHtml(err.message)}</p>`;
    }
  }

  function renderSafety() {
    try {
      safetyListContainer.innerHTML = '';
      const data = appState.travelPlan;
      if (!data) {
        safetyListContainer.innerHTML = `<p class="card-desc">Safety tips will appear here after a trip is generated.</p>`;
        return;
      }
      const safety = data.safety || data.safetyTips || data.safety_tips || data.tips || data.advice;
      if (!Array.isArray(safety) || safety.length === 0) {
        safetyListContainer.innerHTML = `<p class="card-desc">No safety tips found.</p>`;
        return;
      }
      safety.forEach(tip => {
        if (!tip) return;
        const item = document.createElement('div');
        item.className = 'safety-item';
        const iconVal = tip.icon || tip.emoji || '💡';
        const titleVal = tip.title || tip.name || tip.heading || 'Tip';
        const descVal = tip.desc || tip.description || tip.detail || '';
        item.innerHTML = `
          <span class="safety-icon">${escapeHtml(iconVal)}</span>
          <div class="safety-item-content">
            <h4 class="safety-item-title">${escapeHtml(titleVal)}</h4>
            <p class="safety-item-desc">${escapeHtml(descVal)}</p>
          </div>
        `;
        safetyListContainer.appendChild(item);
      });
    } catch (err) {
      console.error('[renderSafety] Critical error:', err);
      safetyListContainer.innerHTML = `<p class="card-desc" style="color: var(--accent-color);">Failed to render safety panel: ${escapeHtml(err.message)}</p>`;
    }
  }

  async function generateTripWithGemini(formData, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    console.log('[planner] Preparing prompt for Gemini AI model...');

    const systemPrompt = `You are TravelMind AI, an expert travel planner. You must generate a highly detailed and realistic travel plan for a trip to ${formData.destination} based on the user's details.
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
  "totalBudget": total estimated budget (must be a number close to or matching ${formData.budget}),
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
Destination: ${formData.destination}
Duration: ${formData.days} days (from ${formData.startDate} to ${formData.endDate})
Budget limit: ₹${formData.budget}
Number of travelers: ${formData.travelers}
Travel styles: ${formData.travelStyles.join(', ')}
Interests/Preferences: ${formData.preferences || 'General exploration'}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: systemPrompt
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const errorMessage = errorJson.error?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(`Gemini API Error: ${errorMessage}`);
    }

    const resJson = await response.json();
    const textOutput = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textOutput) {
      throw new Error("No text content returned from Gemini API");
    }

    const parsedPlan = JSON.parse(textOutput.trim());
    return parsedPlan;
  }

  function generateTripSimulated(formData) {
    console.log('[planner] Running simulated fallback generation...');
    const dest = formData.destination;
    const days = formData.days;
    const styles = formData.travelStyles.length > 0 ? formData.travelStyles : ['Adventure', 'Relaxation'];

    const weatherConditions = ['Sunny', 'Partly Cloudy', 'Clear', 'Windy', 'Mild Rain'];
    const weatherIcons = ['sun', 'cloud', 'cloud-sun', 'wind', 'cloud-drizzle'];
    const weather = [];
    for (let i = 1; i <= Math.min(days, 5); i++) {
      const idx = Math.floor(Math.random() * weatherConditions.length);
      weather.push({
        day: `Day ${i}`,
        temp: `${20 + Math.floor(Math.random() * 8)}°C`,
        cond: weatherConditions[idx],
        icon: weatherIcons[idx]
      });
    }

    const itinerary = [];
    const morningActs = [
      "Guided historic walking tour of the old quarter.",
      "Explore the local street market and enjoy a fresh breakfast.",
      "Visit the iconic central cathedral and museum.",
      "Take a scenic cable car ride to the mountain overlook.",
      "Stroll through the botanical gardens and take photos."
    ];
    const afternoonActs = [
      "Visit the high-end shopping district and local boutiques.",
      "Join a traditional cooking class hosted by a local chef.",
      "Rent bicycles and explore the waterfront path.",
      "Relax at a top-rated local café and write in a travel journal.",
      "Boat cruise down the central river to see the architecture."
    ];
    const eveningActs = [
      "Enjoy a gourmet dinner at a rooftop restaurant overlooking the skyline.",
      "Catch a live cultural performance or local acoustic music show.",
      "Take a guided night walk through the neon-lit food alleys.",
      "Sunset drinks by the beach or lakeside boardwalk.",
      "Attend a wine tasting session at a historic cellar."
    ];

    for (let i = 1; i <= days; i++) {
      const mIdx = (i - 1) % morningActs.length;
      const aIdx = i % afternoonActs.length;
      const eIdx = (i + 1) % eveningActs.length;
      itinerary.push({
        day: i,
        title: `Exploring the Wonders of ${dest}`,
        morning_title: "Morning Adventure",
        morning: morningActs[mIdx],
        afternoon_title: "Afternoon Sightseeing",
        afternoon: afternoonActs[aIdx],
        evening_title: "Evening & Dinner",
        evening: eveningActs[eIdx]
      });
    }

    const total = formData.budget;
    const accommodation = Math.round(total * 0.35);
    const transport = Math.round(total * 0.20);
    const food = Math.round(total * 0.25);
    const sightseeing = Math.round(total * 0.12);
    const misc = Math.round(total * 0.08);

    const budget = {
      "Accommodation": accommodation,
      "Transport": transport,
      "Food": food,
      "Sightseeing": sightseeing,
      "Miscellaneous": misc
    };

    const attractions = [
      {
        name: `The Grand Plaza of ${dest}`,
        desc: `The bustling, historic heart of ${dest}, surrounded by beautiful classical architecture and lively street performances.`,
        rating: 4.8,
        reviews: 2430,
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: `${dest} National Art Museum`,
        desc: "Housing a collection of historical artifacts and masterpieces from local and international artists alike.",
        rating: 4.7,
        reviews: 1560,
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Riverfront Promenade",
        desc: "A beautiful, scenic tree-lined walkway perfect for an afternoon stroll or watching the sunset over the city.",
        rating: 4.9,
        reviews: 3200,
        image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&auto=format&fit=crop&q=60"
      }
    ];

    const hotels = [
      {
        name: `The Grand Heritage Hotel`,
        price: `₹${Math.round(accommodation / days * 0.6).toLocaleString('en-IN')}/night`,
        desc: "Premium accommodation with exceptional service, featuring a panoramic sky terrace and spa.",
        rating: 4.6,
        reviews: 420,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Urban Boutique Hotel",
        price: `₹${Math.round(accommodation / days * 0.4).toLocaleString('en-IN')}/night`,
        desc: "A stylish, modern hotel in the city center within walking distance of primary sights.",
        rating: 4.5,
        reviews: 280,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60"
      }
    ];

    const foods = [
      { emoji: "🍲", name: `Traditional Local Stew`, desc: "A hearty slow-cooked stew combining fresh seasonal vegetables and local herbs." },
      { emoji: "🥐", name: "Fresh Street Bakery Platter", desc: "Crispy, hand-rolled pastries baked fresh daily, famous in the city center." },
      { emoji: "🍛", name: "Spiced Street Rice", desc: "A savory street-food staple featuring aromatic rice, local spices, and grilled toppings." },
      { emoji: "🍧", name: "Glazed Shaved Ice", desc: "A popular local dessert infused with fruit syrups and sweetened condensed milk." }
    ];

    const packing = [
      "Comfortable walking shoes",
      "Camera or smartphone for pictures",
      "Universal travel adapter",
      "Light waterproof jacket",
      "Refillable water bottle",
      "Local currency cash"
    ];

    const transportGuide = [
      { type: "Metro System", efficiency: "Highly Recommended" },
      { type: "Bicycle Rental", efficiency: "Eco-Friendly & Fun" },
      { type: "Ride-Sharing Apps", efficiency: "Convenient at Night" }
    ];

    const safety = [
      { icon: "🛡️", title: "Secure Belongings", desc: "Keep personal items secure, especially in crowded tourist hotspots." },
      { icon: "💡", title: "Stay Hydrated", desc: "Drink plenty of bottled water while exploring under the sun." },
      { icon: "📞", title: "Emergency Contacts", desc: "Save local emergency services numbers and the address of your embassy." }
    ];

    return {
      badge: "Plan Simulated",
      title: `Grand Getaway to ${dest}`,
      subtitle: `${days} Days • ${formData.travelers} Traveler(s) • Styles: ${styles.join(', ')}`,
      overview: `Discover the gorgeous sights of ${dest}. This custom travel plan provides a balanced mix of adventure, relaxation, local food, and sights curated specifically for you.`,
      itinerary,
      budget,
      totalBudget: total,
      weather,
      packing,
      attractions,
      hotels,
      foods,
      transport: transportGuide,
      safety
    };
  }

  async function fetchWebhook(formData) {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify(formData)
    });

    console.log(`[planner] Webhook response received. Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  async function handleGenerateTrip() {
    console.log('[planner] Form submitted. Extracting input values...');
    const destVal = destinationInput.value.trim();
    const startVal = startDateInput.value;
    const endVal = endDateInput.value;
    const budgetVal = parseInt(budgetInput.value, 10);
    const travelersVal = parseInt(travelersCount.value, 10);
    const preferencesVal = preferencesInput.value.trim();

    if (!destVal || !startVal || !endVal || Number.isNaN(budgetVal) || Number.isNaN(travelersVal)) {
      console.warn('[planner] Validation failed: missing required inputs.');
      alert("Please fill in all the planner options to continue.");
      return;
    }

    if (new Date(endVal) < new Date(startVal)) {
      console.warn('[planner] Validation failed: end date is before start date.');
      alert("End date should be on or after start date.");
      return;
    }

    const date1 = new Date(startVal);
    const date2 = new Date(endVal);
    const diffDays = Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)) + 1;
    const travelStyles = Array.from(selectedStyles);
    const interests = [...travelStyles, preferencesVal].filter(Boolean).join(', ');

    const formData = {
      destination: destVal,
      startDate: startVal,
      endDate: endVal,
      budget: budgetVal,
      days: diffDays,
      travelers: travelersVal,
      travelStyles,
      interests: interests || 'general',
      preferences: preferencesVal
    };

    const savedApiKey = localStorage.getItem('gemini_api_key');
    let travelPlan;

    if (savedApiKey && savedApiKey.trim()) {
      console.log('[planner] Gemini API Key detected. Using Gemini direct AI model...');
      setPlannerLoadingState(true, "Crafting your AI travel plan via Gemini...");
      try {
        travelPlan = await generateTripWithGemini(formData, savedApiKey.trim());
        console.log('[planner] Successfully generated trip via Gemini API.');
      } catch (geminiErr) {
        console.error('[planner] Gemini AI generation failed, attempting n8n webhook fallback...', geminiErr);
        setPlannerLoadingState(true, "Gemini failed. Falling back to n8n webhook...");
        try {
          const rawData = await fetchWebhook(formData);
          travelPlan = normalizeN8nResponse(rawData);
          console.log('[planner] Successfully generated trip via n8n webhook fallback.');
        } catch (webhookErr) {
          console.error('[planner] Webhook fallback failed, using local simulation...', webhookErr);
          travelPlan = generateTripSimulated(formData);
          showToast("Offline mode: Simulated plan generated!");
        }
      }
    } else {
      console.log('[planner] No Gemini API key found. Attempting custom n8n webhook...');
      setPlannerLoadingState(true, "Connecting to n8n Webhook...");
      try {
        const rawData = await fetchWebhook(formData);
        travelPlan = normalizeN8nResponse(rawData);
        console.log('[planner] Successfully generated trip via n8n webhook.');
      } catch (webhookErr) {
        console.error('[planner] Webhook failed. Using local simulation...', webhookErr);
        travelPlan = generateTripSimulated(formData);
        showToast("No API Key configured. Simulated plan generated!");
      }
    }

    try {
      // Save to application state
      console.log('[planner] Storing results in application state (appState)...');
      appState.formData = formData;
      appState.travelPlan = travelPlan;

      setPlannerLoadingState(false);
      console.log('[planner] Triggering UI results rendering...');
      showPlannerResults();
    } catch (err) {
      setPlannerLoadingState(false);
      console.error('[planner] Rendering results failed:', err);
      showToast(`UI rendering error: ${err.message}`);
    }
  }

  plannerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleGenerateTrip();
  });

  clearChatBtn.addEventListener('click', () => {
    chatMessagesContainer.innerHTML = `
      <div class="chat-msg chat-msg-bot">
        <div class="chat-avatar"><i data-lucide="bot"></i></div>
        <div class="chat-msg-bubble">
          Chat cleared. Frontend prototype mode is active.
        </div>
      </div>
    `;
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });

  function triggerFrontendOnlyChatAction(rawText) {
    const text = rawText.trim();
    if (!text) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg chat-msg-user';
    userMsg.innerHTML = `
      <div class="chat-avatar"><i data-lucide="user"></i></div>
      <div class="chat-msg-bubble">${text}</div>
    `;
    chatMessagesContainer.appendChild(userMsg);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

    chatSendBtn.disabled = true;
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg chat-msg-bot';
      botMsg.innerHTML = `
        <div class="chat-avatar"><i data-lucide="bot"></i></div>
        <div class="chat-msg-bubble">${PROTOTYPE_MSG}</div>
      `;
      chatMessagesContainer.appendChild(botMsg);
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
      chatSendBtn.disabled = false;

      console.log('[frontend-prototype] Chat action handled locally only.');
      showToast(PROTOTYPE_MSG);

      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 1000);
  }

  chatSuggestionsContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.suggestion-chip');
    if (!chip) return;
    triggerFrontendOnlyChatAction(chip.dataset.query || '');
  });

  chatInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInputField.value.trim();
    if (!text) return;
    triggerFrontendOnlyChatAction(text);
    chatInputField.value = '';
  });

  heroCtaBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const plannerSec = document.getElementById('planner');
    plannerSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const backToTopBtn = document.getElementById('back-to-top-btn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  revealElements.forEach(el => revealObserver.observe(el));

  const scrollSections = document.querySelectorAll('#home, #planner, #features');
  const scrollNavLinks = document.querySelectorAll('.nav-link');
  const navScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        scrollNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
    });
  }, {
    threshold: 0.2,
    rootMargin: '-80px 0px -50% 0px'
  });
  scrollSections.forEach(sec => navScrollObserver.observe(sec));
});
