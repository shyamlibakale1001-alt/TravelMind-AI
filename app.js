/*
 * TravelMind - Frontend Prototype Logic
 */

const WEBHOOK_URL = "https://barista-sliced-outwit.ngrok-free.dev/webhook-test/travelmind/plan";

function normalizeN8nResponse(raw) {
  if (Array.isArray(raw) && raw[0]?.json) return raw[0].json;
  if (Array.isArray(raw) && raw[0]) return raw[0];
  return raw || {};
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
  const resultsBadge = document.getElementById('results-badge');
  const itineraryContainer = document.getElementById('itinerary-timeline-container');
  const budgetListContainer = document.getElementById('budget-list-container');
  const budgetTotalCost = document.getElementById('budget-total-cost');
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

  function showPlannerResults(formData, plannerResponse) {
    const data = normalizeN8nResponse(plannerResponse);
    const styleStr = formData.travelStyles.length > 0 ? formData.travelStyles.join(', ') : "General";

    resultsBadge.textContent = data.badge || 'Itinerary Ready';
    resultsTitle.textContent = data.title || `Your Custom Trip to ${formData.destination}`;
    resultsSubtitle.textContent = data.subtitle
      || `${formData.days} Days • ${formData.travelers} Traveler${formData.travelers > 1 ? 's' : ''} • Styles: ${styleStr}`;

    renderItinerary(data, formData);
    renderBudget(data, formData.budget);
    renderWeather(data);
    renderPacking(data);
    renderAttractions(data);
    renderHotels(data);
    renderFoods(data);
    renderTransport(data);
    renderSafety(data);

    resultsSection.classList.add('visible');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function renderItinerary(data, formData) {
    itineraryContainer.innerHTML = '';
    const days = data.itinerary || data.itineraryDays || data.days_plan;

    if (Array.isArray(days) && days.length > 0) {
      days.forEach((dayData, index) => {
      const dayEl = document.createElement('div');
      dayEl.className = 'itinerary-day';
      dayEl.innerHTML = `
        <div class="day-header">
            <span class="badge badge-primary">Day ${dayData.day || index + 1}</span>
          <h3>Daily Exploration</h3>
        </div>
        <div class="day-timeline">
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-time">Morning</div>
            <div class="timeline-title">Morning Adventure</div>
              <div class="timeline-desc">${escapeHtml(dayData.morning || dayData.am || '')}</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-time">Afternoon</div>
            <div class="timeline-title">Midday Exploration</div>
              <div class="timeline-desc">${escapeHtml(dayData.afternoon || dayData.pm || '')}</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-time">Evening</div>
            <div class="timeline-title">Evening & Dinner</div>
              <div class="timeline-desc">${escapeHtml(dayData.evening || dayData.night || '')}</div>
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
    }

  function renderBudget(data, fallbackBudget) {
    budgetListContainer.innerHTML = '';
    const breakdown = data.budget || data.budgetBreakdown;

    if (breakdown && typeof breakdown === 'object') {
      Object.entries(breakdown).forEach(([label, value]) => {
        const amount = typeof value === 'number' ? value : parseInt(value, 10);
        const pct = fallbackBudget ? Math.round((amount / fallbackBudget) * 100) : 0;
        const item = document.createElement('div');
        item.className = 'budget-item';
        item.innerHTML = `
        <div class="budget-label-row">
            <span class="budget-cat">${escapeHtml(label)}</span>
            <span class="budget-val">₹${amount.toLocaleString('en-IN')} (${pct}%)</span>
        </div>
        <div class="progress-track">
            <div class="progress-bar" data-value="${pct}%"></div>
        </div>
      `;
        budgetListContainer.appendChild(item);
      });
    } else {
      budgetListContainer.innerHTML = `<p class="card-desc">Budget breakdown will appear here after a trip is generated.</p>`;
    }

    const total = data.totalBudget || data.budgetTotal || fallbackBudget;
    budgetTotalCost.textContent = `₹${Number(total).toLocaleString('en-IN')}`;

    setTimeout(() => {
      document.querySelectorAll('.progress-bar').forEach(bar => {
        bar.style.width = bar.getAttribute('data-value');
      });
    }, 300);
  }

  function renderWeather(data) {
    weatherListContainer.innerHTML = '';
    const weather = data.weather;
    if (!Array.isArray(weather) || weather.length === 0) {
      weatherListContainer.innerHTML = `<p class="card-desc">Weather details will appear here after a trip is generated.</p>`;
      return;
    }
    weather.forEach(w => {
      const card = document.createElement('div');
      card.className = 'weather-day-card';
      card.innerHTML = `
        <div class="weather-name">${escapeHtml(w.day || 'Day')}</div>
        <div class="weather-icon"><i data-lucide="${w.icon || 'cloud-sun'}"></i></div>
        <div class="weather-temp">${escapeHtml(w.temp || '')}</div>
        <div class="weather-desc">${escapeHtml(w.cond || w.condition || '')}</div>
      `;
      weatherListContainer.appendChild(card);
    });
  }

  function renderPacking(data) {
    packingListContainer.innerHTML = '';
    const packing = data.packing || data.packingList;
    if (!Array.isArray(packing) || packing.length === 0) {
      packingListContainer.innerHTML = `<p class="card-desc">Packing checklist will appear here after a trip is generated.</p>`;
      return;
    }
    packing.forEach((item, idx) => {
      const label = document.createElement('label');
      label.className = 'packing-item';
      label.innerHTML = `
        <input type="checkbox" id="pack-chk-${idx}">
        <span>${escapeHtml(typeof item === 'string' ? item : item.name || '')}</span>
      `;
      packingListContainer.appendChild(label);
    });
  }

  function renderAttractions(data) {
    attractionsGrid.innerHTML = '';
    const attractions = data.attractions;
    if (!Array.isArray(attractions) || attractions.length === 0) {
      attractionsGrid.innerHTML = `<p class="card-desc">Attraction recommendations will appear here after a trip is generated.</p>`;
      return;
    }
    attractions.forEach(attr => {
      const card = document.createElement('div');
      card.className = 'glass-panel attraction-card';
      card.innerHTML = `
        <div class="card-content">
          <h4 class="card-title">${escapeHtml(attr.name || 'Attraction')}</h4>
          <p class="card-desc">${escapeHtml(attr.desc || attr.description || '')}</p>
        </div>
      `;
      attractionsGrid.appendChild(card);
    });
  }

  function renderHotels(data) {
    hotelsGrid.innerHTML = '';
    const hotels = data.hotels;
    if (!Array.isArray(hotels) || hotels.length === 0) {
      hotelsGrid.innerHTML = `<p class="card-desc">Hotel recommendations will appear here after a trip is generated.</p>`;
      return;
    }
    hotels.forEach(hotel => {
      const card = document.createElement('div');
      card.className = 'glass-panel hotel-card';
      card.innerHTML = `
        <div class="card-content">
          <h4 class="card-title">${escapeHtml(hotel.name || 'Hotel')}</h4>
          <p class="card-desc">${escapeHtml(hotel.price || hotel.desc || '')}</p>
        </div>
      `;
      hotelsGrid.appendChild(card);
    });
  }

  function renderFoods(data) {
    foodsGridContainer.innerHTML = '';
    const foods = data.foods;
    if (!Array.isArray(foods) || foods.length === 0) {
      foodsGridContainer.innerHTML = `<p class="card-desc">Food recommendations will appear here after a trip is generated.</p>`;
      return;
    }
    foods.forEach(food => {
      const card = document.createElement('div');
      card.className = 'glass-panel food-item-card';
      card.innerHTML = `
        <span class="food-emoji">${food.emoji || '🍽️'}</span>
        <h4 class="food-title">${escapeHtml(food.name || 'Local Dish')}</h4>
        <p class="food-desc">${escapeHtml(food.desc || food.description || '')}</p>
      `;
      foodsGridContainer.appendChild(card);
    });
  }

  function renderTransport(data) {
    transportListContainer.innerHTML = '';
    const transport = data.transport;
    if (!Array.isArray(transport) || transport.length === 0) {
      transportListContainer.innerHTML = `<p class="card-desc">Transport guide will appear here after a trip is generated.</p>`;
      return;
    }
    transport.forEach(t => {
      const item = document.createElement('div');
      item.className = 'transport-item';
      item.innerHTML = `
        <div class="transport-label"><span>${escapeHtml(t.type || t.name || 'Transport')}</span></div>
        <span class="badge badge-primary">${escapeHtml(t.efficiency || t.note || 'Recommended')}</span>
      `;
      transportListContainer.appendChild(item);
    });
  }

  function renderSafety(data) {
    safetyListContainer.innerHTML = '';
    const safety = data.safety || data.safetyTips;
    if (!Array.isArray(safety) || safety.length === 0) {
      safetyListContainer.innerHTML = `<p class="card-desc">Safety tips will appear here after a trip is generated.</p>`;
      return;
    }
    safety.forEach(tip => {
      const item = document.createElement('div');
      item.className = 'safety-item';
      item.innerHTML = `
        <span class="safety-icon">${tip.icon || '💡'}</span>
        <div class="safety-item-content">
          <h4 class="safety-item-title">${escapeHtml(tip.title || 'Tip')}</h4>
          <p class="safety-item-desc">${escapeHtml(tip.desc || tip.description || '')}</p>
        </div>
      `;
      safetyListContainer.appendChild(item);
    });
  }

  async function handleGenerateTrip() {
    const destVal = destinationInput.value.trim();
    const startVal = startDateInput.value;
    const endVal = endDateInput.value;
    const budgetVal = parseInt(budgetInput.value, 10);
    const travelersVal = parseInt(travelersCount.value, 10);
    const preferencesVal = preferencesInput.value.trim();

    if (!destVal || !startVal || !endVal || Number.isNaN(budgetVal) || Number.isNaN(travelersVal)) {
      alert("Please fill in all the planner options to continue.");
      return;
    }

    if (new Date(endVal) < new Date(startVal)) {
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

    setPlannerLoadingState(true, "Generating your trip...");

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      const travelPlan = normalizeN8nResponse(rawData);

      setPlannerLoadingState(false);
      showPlannerResults(formData, travelPlan);
      showToast("Trip generated successfully!");
    } catch (err) {
      setPlannerLoadingState(false);
      console.error('[planner] Trip generation failed:', err);
      showToast(`Network/API error: ${err.message}`);
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
