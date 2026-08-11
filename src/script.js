
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar-glass');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger, .reveal-none');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  const track = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsWrap = document.getElementById('testimonial-dots');

  if (track && prevBtn && nextBtn && dotsWrap) {
    const slides = Array.from(track.children);
    const total = slides.length;
    let index = 0;

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      Array.from(dotsWrap.children).forEach((dot, i) => {
        dot.setAttribute('aria-current', String(i === index));
      });
    }

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      updateDots();
    }

    function goTo(newIndex) {
      index = ((newIndex % total) + total) % total;
      render();
    }

    function next() {
      goTo(index + 1);
    }

    function prev() {
      goTo(index - 1);
    }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    track.closest('.testimonial-carousel').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const deltaX = e.changedTouches[0].clientX - startX;
      const threshold = 40;
      if (deltaX > threshold) prev();
      else if (deltaX < -threshold) next();
    });

    buildDots();
    render();
  }

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('header nav a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('text-white', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = menuToggle?.querySelector('.menu-icon');
  const closeIcon = menuToggle?.querySelector('.close-icon');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

      mobileMenu.classList.toggle('hidden');

      if (menuIcon && closeIcon) {
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
      }

      menuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (menuIcon && closeIcon) {
          menuIcon.classList.remove('hidden');
          closeIcon.classList.add('hidden');
        }
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          if (menuIcon && closeIcon) {
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
          }
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  const modal = document.getElementById('reserva-modal');
  const triggers = document.querySelectorAll('.reserva-trigger');

  if (modal && triggers.length) {
    const modalBox = modal.querySelector('.modal-box');
    const closeBtn = document.getElementById('modal-close');
    const doneBtn = document.getElementById('modal-done');
    const form = document.getElementById('reserva-form');
    const formView = document.getElementById('modal-form-view');
    const successView = document.getElementById('modal-success-view');
    const roomNameEl = document.getElementById('modal-room-name');

    let lastFocused = null;

    function resetModalContent() {
      formView.classList.remove('hidden');
      successView.classList.add('hidden');
      form.reset();
    }

    function openModal(roomName) {
      lastFocused = document.activeElement;
      resetModalContent();
      roomNameEl.textContent = roomName ? `Você está solicitando: ${roomName}` : '';

      modal.classList.remove('hidden', 'is-closing');
      void modal.offsetWidth;
      modal.classList.add('is-visible');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const firstInput = document.getElementById('res-nome');
      if (firstInput) setTimeout(() => firstInput.focus(), 200);
    }

    function closeModal() {
      if (modal.classList.contains('hidden')) return;

      modal.classList.remove('is-visible');
      modal.classList.add('is-closing');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      const onAnimEnd = () => {
        modal.classList.add('hidden');
        modal.classList.remove('is-closing');
        modal.removeEventListener('animationend', onAnimEnd);
        if (lastFocused) lastFocused.focus();
      };
      modal.addEventListener('animationend', onAnimEnd);
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(trigger.dataset.room);
      });
    });

    closeBtn.addEventListener('click', closeModal);
    doneBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-visible')) {
        closeModal();
      }
    });

    let autoCloseTimer = null;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      formView.classList.add('hidden');
      successView.classList.remove('hidden');

      clearTimeout(autoCloseTimer);
      autoCloseTimer = setTimeout(() => {
        closeModal();
      }, 3000);
    });

    closeBtn.addEventListener('click', () => clearTimeout(autoCloseTimer));
    doneBtn.addEventListener('click', () => clearTimeout(autoCloseTimer));

    modalBox.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('open-reserva-modal', (e) => {
  openModal(e.detail?.room || '');
});
  }

  // Ano do rodapé
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
  // Simulação
  const suiteTabsWrap = document.getElementById('sim-suite-tabs');
  const suiteImg = document.getElementById('sim-suite-img');
  const suiteNameEl = document.getElementById('sim-suite-name');
  const suitePriceEl = document.getElementById('sim-suite-price');
  const suiteFeaturesEl = document.getElementById('sim-suite-features');
  const suiteSelectBtn = document.getElementById('sim-suite-select');
  const servicesListEl = document.getElementById('sim-services-list');
  const summarySuiteEl = document.getElementById('sim-summary-suite');
  const summaryServicesEl = document.getElementById('sim-summary-services');
  const totalEl = document.getElementById('sim-total');
  const finalizarBtn = document.getElementById('sim-finalizar');

  if (suiteTabsWrap && servicesListEl) {

    const suites = [
      {
        id: 'deluxe',
        name: 'Deluxe Suite',
        price: 890,
        img: 'https://images.unsplash.com/photo-1737517302831-e7b8a8eaa97c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        features: ['Cama king size', 'Vista para o jardim', 'Ar-condicionado', 'Wi-fi de alta velocidade']
      },
      {
        id: 'mar',
        name: 'Suíte com vista para o mar',
        price: 1290,
        img: 'https://plus.unsplash.com/premium_photo-1661962688308-2b00b88b9765?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        features: ['Varanda privativa', 'Vista panorâmica para o mar', 'Banheira de hidromassagem', 'Serviço de quarto 24h']
      },
      {
        id: 'spa',
        name: 'Suíte com SPA incluso',
        price: 1590,
        img: 'https://plus.unsplash.com/premium_photo-1661875135365-16aab794632f?q=80&w=653&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        features: ['SPA privativo', 'Sauna', 'Roupão e chinelos exclusivos', 'Vista para as montanhas']
      }
    ];

    const services = [
      { id: 'cafe', name: 'Café da manhã premium', price: 60 },
      { id: 'jantar', name: 'Jantar romântico à luz de velas', price: 250 },
      { id: 'tour', name: 'City tour guiado', price: 180 },
      { id: 'transfer', name: 'Transfer aeroporto (ida e volta)', price: 150 },
      { id: 'massagem', name: 'Massagem relaxante (casal)', price: 320 },
      { id: 'checkout', name: 'Late check-out', price: 90 }
    ];

    let previewSuiteId = suites[0].id;
    let selectedSuiteId = null;
    const selectedServiceIds = new Set();

    const formatBRL = (value) =>
      value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    function getSuite(id) {
      return suites.find((s) => s.id === id);
    }

    function renderSuiteTabs() {
      suiteTabsWrap.innerHTML = '';
      suites.forEach((suite) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sim-tab' + (suite.id === previewSuiteId ? ' is-active' : '');
        btn.textContent = suite.name;
        btn.addEventListener('click', () => {
          previewSuiteId = suite.id;
          renderSuiteTabs();
          renderSuitePreview();
        });
        suiteTabsWrap.appendChild(btn);
      });
    }

    function renderSuitePreview() {
      const suite = getSuite(previewSuiteId);
      suiteImg.src = suite.img;
      suiteImg.alt = suite.name;
      suiteNameEl.textContent = suite.name;
      suitePriceEl.textContent = `${formatBRL(suite.price)} / noite`;
      suiteFeaturesEl.innerHTML = suite.features
        .map((f) => `<li><i class="bi bi-check2"></i>${f}</li>`)
        .join('');

      const isSelected = selectedSuiteId === suite.id;
      suiteSelectBtn.textContent = isSelected ? 'Selecionada' : 'Selecionar';
      suiteSelectBtn.classList.toggle('is-selected', isSelected);
    }

    function renderServices() {
      servicesListEl.innerHTML = '';
      services.forEach((service) => {
        const isSelected = selectedServiceIds.has(service.id);
        const li = document.createElement('li');
        li.className = 'sim-service-item' + (isSelected ? ' is-selected' : '');
        li.innerHTML = `
          <div>
            <p class="sim-service-name">${service.name}</p>
            <p class="sim-service-price">${formatBRL(service.price)}</p>
          </div>
          <button type="button" class="sim-service-select${isSelected ? ' is-selected' : ''}" data-id="${service.id}">
            ${isSelected ? 'Selecionado' : 'Selecionar'}
          </button>
        `;
        servicesListEl.appendChild(li);
      });

      servicesListEl.querySelectorAll('.sim-service-select').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          if (selectedServiceIds.has(id)) {
            selectedServiceIds.delete(id);
          } else {
            selectedServiceIds.add(id);
          }
          renderServices();
          renderSummary();
        });
      });
    }

    function renderSummary() {
      const suite = selectedSuiteId ? getSuite(selectedSuiteId) : null;

      if (suite) {
        summarySuiteEl.classList.remove('sim-empty');
        summarySuiteEl.innerHTML = `<span>${suite.name}</span><span>${formatBRL(suite.price)}</span>`;
      } else {
        summarySuiteEl.classList.add('sim-empty');
        summarySuiteEl.textContent = 'Nenhuma suíte selecionada';
      }

      const chosenServices = services.filter((s) => selectedServiceIds.has(s.id));
      if (chosenServices.length) {
        summaryServicesEl.classList.remove('sim-empty');
        summaryServicesEl.innerHTML = chosenServices
          .map((s) => `<div class="sim-summary-row"><span>${s.name}</span><span>${formatBRL(s.price)}</span></div>`)
          .join('');
      } else {
        summaryServicesEl.classList.add('sim-empty');
        summaryServicesEl.textContent = 'Nenhum serviço selecionado';
      }

      const total = (suite ? suite.price : 0) + chosenServices.reduce((sum, s) => sum + s.price, 0);
      totalEl.textContent = formatBRL(total);

      finalizarBtn.disabled = !suite;
      finalizarBtn.dataset.roomName = suite ? suite.name : '';
      finalizarBtn.dataset.services = chosenServices.map((s) => s.name).join(', ');
    }

    suiteSelectBtn.addEventListener('click', () => {
      selectedSuiteId = previewSuiteId;
      renderSuitePreview();
      renderSummary();
    });

    finalizarBtn.addEventListener('click', () => {
      if (finalizarBtn.disabled) return;
      const roomLabel = finalizarBtn.dataset.services
        ? `${finalizarBtn.dataset.roomName} + ${finalizarBtn.dataset.services}`
        : finalizarBtn.dataset.roomName;

      document.dispatchEvent(new CustomEvent('open-reserva-modal', {
        detail: { room: roomLabel }
      }));
    });

    renderSuiteTabs();
    renderSuitePreview();
    renderServices();
    renderSummary();
  }
});