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

  // ---- Product Gallery Thumbnails & Slider ----
  const gallerySlider = document.getElementById('ProductGallerySlider');
  
  if (gallerySlider) {
    // Sync thumbnails on scroll
    gallerySlider.addEventListener('scroll', () => {
      const scrollLeft = gallerySlider.scrollLeft;
      const slideWidth = gallerySlider.clientWidth;
      const activeIndex = Math.round(scrollLeft / slideWidth);
      
      gallerySlider.setAttribute('data-active-index', activeIndex);
      
      document.querySelectorAll('.product-gallery__thumb').forEach((t, i) => {
        t.classList.toggle('is-active', i === activeIndex);
      });
    }, { passive: true });
  }

  document.querySelectorAll('.product-gallery__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const gallery = thumb.closest('.product-gallery');
      const gSlider = gallery.querySelector('.product-gallery__slider');
      const targetIndex = parseInt(thumb.getAttribute('data-index') || thumb.dataset.index || 0);
      
      // If we don't have data-index, fallback to index within parent
      let finalIndex = targetIndex;
      if (!thumb.hasAttribute('data-index')) {
        const thumbs = Array.from(gallery.querySelectorAll('.product-gallery__thumb'));
        finalIndex = thumbs.indexOf(thumb);
      }
      
      if (gSlider) {
        const targetSlide = gSlider.querySelectorAll('.product-gallery__slide')[finalIndex];
        if (targetSlide) {
          gSlider.scrollTo({ left: targetSlide.offsetLeft, behavior: 'smooth' });
        }
      }

      gallery.querySelectorAll('.product-gallery__thumb').forEach(t => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
    });
  });

  // ---- Product Lightbox (Mobile swipe gallery) ----
  const lightbox = document.getElementById('ProductLightbox');
  const lightboxTrigger = document.querySelector('[data-lightbox-trigger]');
  const lightboxClose = document.querySelector('.product-lightbox__close');
  
  if (lightbox && lightboxTrigger) {
    // Add data-index to thumbs if not present
    document.querySelectorAll('.product-gallery__thumb').forEach((t, i) => t.setAttribute('data-index', i));

    lightboxTrigger.addEventListener('click', () => {
      lightbox.showModal();
      document.body.style.overflow = 'hidden';
      
      // Scroll to the active image
      const activeIndex = gallerySlider ? parseInt(gallerySlider.getAttribute('data-active-index') || 0) : 0;
      const slider = lightbox.querySelector('.product-lightbox__slider');
      const activeSlide = lightbox.querySelectorAll('.product-lightbox__slide')[activeIndex];
      
      if (slider && activeSlide) {
        // Small timeout to allow dialog to render before scrolling
        setTimeout(() => {
          slider.scrollTo({ left: activeSlide.offsetLeft, behavior: 'auto' });
        }, 10);
      }
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.close();
        document.body.style.overflow = '';
      });
    }

    lightbox.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
    
    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.close();
      }
    });
  }

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
