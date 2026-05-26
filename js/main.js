/* ===========================
   Agrapathik - Main JS
   =========================== */

'use strict';

const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navOverlay = document.querySelector('.nav-overlay');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }

  const scrollTopBtn = document.querySelector('.scroll-top');
  if (scrollTopBtn) {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }
});

navToggle?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  navOverlay?.classList.toggle('open');
  document.body.style.overflow = navLinks?.classList.contains('open') ? 'hidden' : '';
});

navOverlay?.addEventListener('click', closeNav);

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeNav);
});

function closeNav() {
  navLinks?.classList.remove('open');
  navOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

(function setActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

function initReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  if (!Number.isFinite(target)) return;

  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

function initCounters() {
  const counters = Array.from(document.querySelectorAll('[data-target]')).filter(el => {
    const target = el.getAttribute('data-target') || '';
    return /^\d+$/.test(target);
  });
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function initProgressBars() {
  const bars = document.querySelectorAll('.impact-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

function validateField(input) {
  const error = input.parentElement.querySelector('.form-error');
  const value = input.value.trim();
  let isValid = true;
  let msg = '';

  if (input.hasAttribute('required') && !value) {
    isValid = false;
    msg = 'This field is required.';
  } else if (input.type === 'email' && value) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(value)) {
      isValid = false;
      msg = 'Please enter a valid email address.';
    }
  } else if (input.type === 'tel' && value) {
    const telRe = /^[\d\s\+\-\(\)]{7,15}$/;
    if (!telRe.test(value)) {
      isValid = false;
      msg = 'Please enter a valid phone number.';
    }
  }

  if (!isValid) {
    input.classList.add('error');
    if (error) {
      error.textContent = msg;
      error.classList.add('show');
    }
  } else {
    input.classList.remove('error');
    if (error) error.classList.remove('show');
  }

  return isValid;
}

function initForms() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;

      inputs.forEach(input => {
        if (!validateField(input)) allValid = false;
      });

      if (allValid) {
        const formWrap = form.closest('.form-content-wrap') || form.parentElement;
        const successEl = formWrap.querySelector('.form-success');

        form.style.display = 'none';
        if (successEl) successEl.classList.add('show');
      }
    });
  });
}

function setActivityCardState(card, isOpen) {
  const toggle = card.querySelector('.activity-card-toggle');
  const gallery = card.querySelector('.activity-gallery');

  card.classList.toggle('is-open', isOpen);
  toggle?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  gallery?.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
}

function scrollActivityCardIntoView(card) {
  const top = card.getBoundingClientRect().top + window.scrollY - 104;
  window.scrollTo({
    top: Math.max(top, 0),
    behavior: 'smooth'
  });
}

function initActivityGalleries() {
  const cards = document.querySelectorAll('.activity-card');
  if (!cards.length) return;

  const closeAll = () => {
    cards.forEach(card => setActivityCardState(card, false));
  };

  cards.forEach(card => {
    setActivityCardState(card, false);

    card.addEventListener('click', (e) => {
      if (e.target.closest('.activity-gallery')) return;

      const shouldOpen = !card.classList.contains('is-open');
      closeAll();
      if (shouldOpen) {
        setActivityCardState(card, true);
        requestAnimationFrame(() => {
          scrollActivityCardIntoView(card);
        });
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.lightbox')) {
      return;
    }

    if (!e.target.closest('.activity-card')) {
      closeAll();
    }
  });
}

function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (!lightbox) return;

  function openLightbox(src, alt) {
    if (!src) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const thumbTrigger = e.target.closest('[data-lightbox-src]');
    if (thumbTrigger) {
      e.preventDefault();
      openLightbox(
        thumbTrigger.getAttribute('data-lightbox-src'),
        thumbTrigger.getAttribute('data-lightbox-alt') || thumbTrigger.querySelector('img')?.alt || ''
      );
      return;
    }

    const galleryItem = e.target.closest('.gallery-item');
    if (!galleryItem) return;

    const img = galleryItem.querySelector('img');
    openLightbox(img?.currentSrc || img?.src, img?.alt || '');
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

function initDonation() {
  const amountBtns = document.querySelectorAll('.donate-amount-btn');
  const customInput = document.getElementById('custom-amount');

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (customInput) {
        customInput.value = btn.textContent.replace('৳', '').replace('$', '').trim();
      }
    });
  });
}

function initFilters() {
  document.querySelectorAll('.filter-btns').forEach(group => {
    const btns = group.querySelectorAll('.filter-btn');
    const targetId = group.getAttribute('data-target');
    const target = targetId ? document.getElementById(targetId) : document;
    const items = target ? target.querySelectorAll('[data-category]') : [];

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        items.forEach(item => {
          if (item.classList.contains('activity-card')) {
            setActivityCardState(item, false);
          }

          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });
}

function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  btn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const btn = form.querySelector('.newsletter-btn');
      if (input && input.value.includes('@')) {
        btn.textContent = 'Subscribed';
        btn.style.background = '#15803d';
        input.value = '';
        setTimeout(() => {
          btn.textContent = 'Subscribe';
          btn.style.background = '';
        }, 3000);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
  initProgressBars();
  initForms();
  initActivityGalleries();
  initLightbox();
  initDonation();
  initFilters();
  initScrollTop();
  initSmoothScroll();
  initNewsletter();
});
