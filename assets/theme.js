/**
 * MamaWonne Theme - Main JavaScript
 * Handles: sticky header, mobile menu, cart drawer, FAQ accordion,
 * product gallery, quantity selectors, and smooth interactions
 */

(function() {
  'use strict';

  // ---- Sticky Header ----
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 50);
      lastScroll = y;
    }, { passive: true });
  }

  // ---- Announcement Bar Close ----
  const announcementClose = document.querySelector('.announcement-bar__close');
  if (announcementClose) {
    announcementClose.addEventListener('click', () => {
      const bar = announcementClose.closest('.announcement-bar');
      bar.classList.add('is-hidden');
      sessionStorage.setItem('mw_announcement_hidden', '1');
    });
    if (sessionStorage.getItem('mw_announcement_hidden') === '1') {
      const bar = document.querySelector('.announcement-bar');
      if (bar) bar.classList.add('is-hidden');
    }
  }

  // ---- Mobile Menu ----
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menuClose = document.querySelector('[data-menu-close]');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');

  function openMenu() {
    if (mobileMenu) mobileMenu.classList.add('is-open');
    if (menuOverlay) menuOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('is-open');
    if (menuOverlay) menuOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

  // ---- Cart Drawer ----
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.cart-drawer-overlay');
  const cartToggles = document.querySelectorAll('[data-cart-toggle]');
  const cartClose = document.querySelector('.cart-drawer__close');

  function openCart() {
    if (cartDrawer) cartDrawer.classList.add('is-open');
    if (cartOverlay) cartOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('is-open');
    if (cartOverlay) cartOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  cartToggles.forEach(btn => btn.addEventListener('click', openCart));
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-item__answer');
      const inner = answer.querySelector('.faq-item__answer-inner');
      const isOpen = item.classList.contains('is-open');

      // Close all others
      document.querySelectorAll('.faq-item.is-open').forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.faq-item__answer').style.maxHeight = '0';
        }
      });

      item.classList.toggle('is-open', !isOpen);
      answer.style.maxHeight = isOpen ? '0' : inner.scrollHeight + 'px';
    });
  });

  // ---- Product Accordion ----
  document.querySelectorAll('.product-accordion__trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.product-accordion__item');
      const content = item.querySelector('.product-accordion__content');
      const inner = content.querySelector('.product-accordion__content-inner');
      const isOpen = item.classList.contains('is-open');

      item.classList.toggle('is-open', !isOpen);
      content.style.maxHeight = isOpen ? '0' : inner.scrollHeight + 'px';
    });
  });

  // ---- Product Gallery Thumbnails ----
  document.querySelectorAll('.product-gallery__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const gallery = thumb.closest('.product-gallery');
      const mainImg = gallery.querySelector('.product-gallery__main img');
      const src = thumb.querySelector('img').src;

      gallery.querySelectorAll('.product-gallery__thumb').forEach(t => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
      mainImg.src = src;
    });
  });

  // ---- Quantity Selectors ----
  document.querySelectorAll('.quantity-selector').forEach(selector => {
    const input = selector.querySelector('.quantity-selector__input');
    const minus = selector.querySelector('[data-qty-minus]');
    const plus = selector.querySelector('[data-qty-plus]');

    if (minus) {
      minus.addEventListener('click', () => {
        const val = parseInt(input.value) || 1;
        if (val > 1) input.value = val - 1;
      });
    }
    if (plus) {
      plus.addEventListener('click', () => {
        const val = parseInt(input.value) || 1;
        input.value = val + 1;
      });
    }
  });

  // ---- Variant Swatches ----
  document.querySelectorAll('.product-variants__options').forEach(group => {
    group.querySelectorAll('.variant-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        group.querySelectorAll('.variant-swatch').forEach(s => s.classList.remove('is-selected'));
        swatch.classList.add('is-selected');
      });
    });
  });

  // ---- Lazy Loading Images ----
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    lazyImages.forEach(img => observer.observe(img));
  }

  // ---- Escape key closes overlays ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeCart();
    }
  });

})();
