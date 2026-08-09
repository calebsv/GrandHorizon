
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
  }

  // Ano do rodapé
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
});