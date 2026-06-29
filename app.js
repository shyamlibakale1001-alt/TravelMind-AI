/*
 * TravelMind - Frontend Prototype Logic
 */

document.addEventListener('DOMContentLoaded', () => {
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
  const generateBtn = document.getElementById('generate-btn');
  const loaderOverlay = document.getElementById('planner-loader');
  const loaderMsg = document.getElementById('loader-msg');

  const resultsSection = document.getElementById('results');
  const resultsTitle = document.getElementById('results-title');
  const resultsSubtitle = document.getElementById('results-subtitle');
  const resultsBadge = document.getElementById('results-badge');

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

  function setPlannerLoadingState(isLoading) {
    generateBtn.disabled = isLoading;
    plannerForm.closest('.planner-card').style.display = isLoading ? 'none' : 'block';
    loaderOverlay.style.display = isLoading ? 'flex' : 'none';
    loaderMsg.textContent = isLoading ? "Preparing frontend preview..." : "Finding the best attractions...";
    if (isLoading) {
      loaderOverlay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  plannerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const destVal = destinationInput.value.trim();
    const startVal = startDateInput.value;
    const endVal = endDateInput.value;
    const budgetVal = parseInt(budgetInput.value, 10);
    const travelersVal = parseInt(travelersCount.value, 10);

    if (!destVal || !startVal || !endVal || Number.isNaN(budgetVal) || Number.isNaN(travelersVal)) {
      alert("Please fill in all the planner options to continue.");
      return;
    }

    if (new Date(endVal) < new Date(startVal)) {
      alert("End date should be on or after start date.");
      return;
    }

    setPlannerLoadingState(true);
    setTimeout(() => {
      setPlannerLoadingState(false);
      resultsSection.classList.add('visible');
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      const styleStr = selectedStyles.size > 0 ? Array.from(selectedStyles).join(', ') : "General";
      resultsBadge.textContent = 'Prototype Preview';
      resultsTitle.textContent = `Trip Preview for ${destVal}`;
      resultsSubtitle.textContent = `Dates: ${startVal} to ${endVal} • ${travelersVal} Traveler${travelersVal > 1 ? 's' : ''} • Styles: ${styleStr}`;

      console.log('[frontend-prototype] Planner submit processed locally only.');
      showToast(PROTOTYPE_MSG);
    }, 1000);
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
