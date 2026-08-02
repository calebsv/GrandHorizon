// ==========================================================
// Bliss — Wellness Sanctuary
// Interações da página
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const dotsWrap = document.getElementById('testimonial-dots');

  if (track && prevBtn && nextBtn && dotsWrap) {
    const slides = Array.from(track.children);
    const total = slides.length;
    let index = 0;

    // cria um dot por depoimento
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
      // desloca por porcentagem: 100% = largura de um slide.
      // Isso funciona em qualquer largura de tela, sem precisar medir
      // pixels (e sem depender de o Tailwind já ter aplicado as classes).
      track.style.transform = `translateX(-${index * 100}%)`;
      updateDots();
    }

    function goTo(newIndex) {
      index = ((newIndex % total) + total) % total; // sempre dentro de 0..total-1, com loop
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

    // navegação por teclado quando o carrossel está em foco
    track.closest('.testimonial-carousel').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    // swipe em telas touch
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

  // realce simples do link ativo no scroll (opcional / progressivo)
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
});