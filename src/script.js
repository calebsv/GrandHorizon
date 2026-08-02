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
