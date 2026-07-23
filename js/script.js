/* =========================================================
   Xevnex Technologies — Global Script
   Features: Responsive Nav, Dark Mode, Scroll-to-Top,
   Typing Animation, Animated Counters, Testimonial Slider,
   FAQ Accordion, Portfolio Filter, Form Validation,
   Scroll Reveal
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Responsive Navigation Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Highlight active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });

  /* ---------- 2. Dark Mode Toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('xevnex-theme');

  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
    if (themeToggle) themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      root.setAttribute('data-theme', newTheme);
      localStorage.setItem('xevnex-theme', newTheme);
      themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
  }

  /* ---------- 3. Header shadow on scroll + Scroll-to-Top Button ---------- */
  const header = document.querySelector('.site-header');
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 60;
    if (header) header.style.boxShadow = scrolled ? '0 4px 18px rgba(0,0,0,0.12)' : 'var(--shadow-sm)';
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 400);
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 4. Typing Animation ---------- */
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const words = JSON.parse(typingEl.getAttribute('data-words') || '["Businesses"]');
    let wordIndex = 0, charIndex = 0, deleting = false;

    function type() {
      const current = words[wordIndex];
      if (!deleting) {
        charIndex++;
        typingEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 1500);
          return;
        }
      } else {
        charIndex--;
        typingEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? 60 : 110);
    }
    type();
  }

  /* ---------- 5. Animated Counters ---------- */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1800;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---------- 6. Testimonial / Image Slider ---------- */
  const slider = document.querySelector('.slider');
  if (slider) {
    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.parentElement.querySelector('.slider-prev');
    const nextBtn = slider.parentElement.querySelector('.slider-next');
    const dotsWrap = slider.parentElement.querySelector('.slider-dots');
    let current = 0;
    let autoplay;

    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('.dot');

    function update() {
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      update();
      resetAutoplay();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function resetAutoplay() {
      clearInterval(autoplay);
      autoplay = setInterval(next, 5000);
    }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    resetAutoplay();
  }

  /* ---------- 7. FAQ Accordion ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /* ---------- 8. Portfolio Filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          const category = item.getAttribute('data-category');
          const show = filter === 'all' || filter === category;
          item.classList.toggle('hide', !show);
        });
      });
    });
  }

  /* ---------- 9. Contact Form Validation ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    const fields = {
      name: { el: form.querySelector('#name'), validate: v => v.trim().length >= 2, msg: 'Please enter your full name (min 2 characters).' },
      email: { el: form.querySelector('#email'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email address.' },
      phone: { el: form.querySelector('#phone'), validate: v => v.trim() === '' || /^[0-9+\-\s()]{7,}$/.test(v), msg: 'Please enter a valid phone number.' },
      subject: { el: form.querySelector('#subject'), validate: v => v.trim().length >= 3, msg: 'Please enter a subject.' },
      message: { el: form.querySelector('#message'), validate: v => v.trim().length >= 10, msg: 'Message should be at least 10 characters.' }
    };

    function validateField(key) {
      const field = fields[key];
      if (!field || !field.el) return true;
      const group = field.el.closest('.form-group');
      const valid = field.validate(field.el.value);
      group.classList.toggle('invalid', !valid);
      group.classList.toggle('valid', valid);
      return valid;
    }

    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (!field.el) return;
      field.el.addEventListener('input', () => validateField(key));
      field.el.addEventListener('blur', () => validateField(key));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      Object.keys(fields).forEach(key => {
        if (!validateField(key)) allValid = false;
      });

      const successMsg = document.getElementById('formSuccess');

      if (allValid) {
        form.reset();
        Object.values(fields).forEach(f => f.el && f.el.closest('.form-group').classList.remove('valid', 'invalid'));
        if (successMsg) {
          successMsg.classList.add('show');
          setTimeout(() => successMsg.classList.remove('show'), 4500);
        }
      } else if (successMsg) {
        successMsg.classList.remove('show');
      }
    });
  }

  /* ---------- 10. Scroll Reveal Animation ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- 11. Set current year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
