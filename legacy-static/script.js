/* ─────────────────────────────────────────────────────────
   PORTFOLIO — JavaScript
   Intersection Observer · Nav scroll · Hamburger
   ───────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Smooth scroll for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top: top, behavior: 'smooth' });

      // Close mobile menu if open
      closeMobileMenu();
    });
  });

  /* ── Nav scroll effect ─────────────────────────────────── */
  var nav = document.getElementById('nav');
  var lastScroll = 0;

  function onScroll() {
    var scroll = window.scrollY;
    if (scroll > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scroll;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on load

  /* ── Hamburger / mobile menu ───────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  hamburger.addEventListener('click', function () {
    var isOpen = hamburger.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }
  });

  /* Close on outside click */
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) {
      closeMobileMenu();
    }
  });

  /* ── Intersection Observer for fade animations ─────────── */
  var animateEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = parseInt(el.getAttribute('data-delay') || '0');
            setTimeout(function () {
              el.classList.add('in-view');
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    animateEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback: show all immediately */
    animateEls.forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  /* ── Active nav link highlight on scroll ──────────────── */
  var sections = document.querySelectorAll('section[id], div[id="home"]');
  var navLinks = document.querySelectorAll('.nav__link');

  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === '#' + id) {
              link.style.color = 'var(--ink)';
            } else {
              link.style.color = '';
            }
          });
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* ── Theme toggle (placeholder) ───────────────────────── */
  var themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', function () {
    // Placeholder — extend with full dark mode implementation if needed
    themeToggle.style.opacity = themeToggle.style.opacity === '0.4' ? '1' : '0.4';
    setTimeout(function () {
      themeToggle.style.opacity = '1';
    }, 300);
  });

  /* ── Cursor-aware tilt on portrait ───────────────────────
     Subtle, premium effect — not intrusive.               */
  var portrait = document.getElementById('hero-portrait');

  if (portrait && window.matchMedia('(pointer: fine)').matches) {
    var wrapRect = null;

    function resetPortrait() {
      portrait.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    }

    portrait.parentElement.addEventListener('mousemove', function (e) {
      wrapRect = portrait.parentElement.getBoundingClientRect();
      var x = e.clientX - wrapRect.left;
      var y = e.clientY - wrapRect.top;
      var cx = wrapRect.width / 2;
      var cy = wrapRect.height / 2;
      var rx = ((y - cy) / cy) * -3;
      var ry = ((x - cx) / cx) * 3;
      portrait.style.transition = 'transform 80ms ease-out';
      portrait.style.transform =
        'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    });

    portrait.parentElement.addEventListener('mouseleave', function () {
      portrait.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)';
      resetPortrait();
    });
  }

})();
