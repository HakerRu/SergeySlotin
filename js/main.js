/**
 * SERGEY SLOTIN — LUXURY JEWELRY HOUSE
 * Core Interactive Scripts: 3s Slider, Catalog, Cart Drawer & Mobile Navigation
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. HERO SLIDER (3-SECOND AUTO ROTATION)
  // ==========================================================================
  const slides = [
    {
      num: '01',
      image: 'images/hero_model.jpg',
      tagline: 'ИСКУССТВО БЫТЬ СОБОЙ'
    },
    {
      num: '02',
      image: 'images/collection_necklace.jpg',
      tagline: 'БЕСКОНЕЧНОЕ СИЯНИЕ БРИЛЛИАНТОВ'
    },
    {
      num: '03',
      image: 'images/about_ring.jpg',
      tagline: 'ВЕЛИЧИЕ АВТОРСКИХ ФОРМ'
    },
    {
      num: '04',
      image: 'images/salon_interior.jpg',
      tagline: 'АТМОСФЕРА ИСТИННОЙ РОСКОШИ'
    }
  ];

  let currentSlideIndex = 0;
  const SLIDE_INTERVAL_MS = 3000; // 3 seconds per slide
  let slideTimer = null;
  let progressInterval = null;
  let progressStartTime = 0;

  const currentSlideNum = document.getElementById('currentSlideNum');
  const sliderProgressBar = document.getElementById('sliderProgressBar');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const heroImage = document.getElementById('heroImage');
  const heroTagline = document.querySelector('.hero-tagline');
  const heroSection = document.getElementById('hero');

  function updateSlide(index) {
    currentSlideIndex = (index + slides.length) % slides.length;
    const slide = slides[currentSlideIndex];

    if (currentSlideNum) {
      currentSlideNum.textContent = slide.num;
    }

    if (heroImage) {
      heroImage.style.opacity = '0.35';
      heroImage.style.transform = 'scale(1.02)';
      setTimeout(() => {
        heroImage.src = slide.image;
        heroImage.style.opacity = '1';
        heroImage.style.transform = 'scale(1)';
      }, 250);
    }

    if (heroTagline) {
      heroTagline.style.opacity = '0';
      setTimeout(() => {
        heroTagline.textContent = slide.tagline;
        heroTagline.style.opacity = '1';
      }, 250);
    }

    resetAutoSlider();
  }

  function startProgressBar() {
    if (!sliderProgressBar) return;
    sliderProgressBar.style.width = '0%';
    progressStartTime = Date.now();

    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - progressStartTime;
      const pct = Math.min(100, (elapsed / SLIDE_INTERVAL_MS) * 100);
      sliderProgressBar.style.width = `${pct}%`;
      if (pct >= 100) {
        clearInterval(progressInterval);
      }
    }, 50);
  }

  function resetAutoSlider() {
    if (slideTimer) clearInterval(slideTimer);
    startProgressBar();

    slideTimer = setInterval(() => {
      updateSlide(currentSlideIndex + 1);
    }, SLIDE_INTERVAL_MS);
  }

  if (prevSlideBtn && nextSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
      updateSlide(currentSlideIndex - 1);
    });

    nextSlideBtn.addEventListener('click', () => {
      updateSlide(currentSlideIndex + 1);
    });
  }

  // Pause on hover, resume on leave
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => {
      if (slideTimer) clearInterval(slideTimer);
      if (progressInterval) clearInterval(progressInterval);
    });
    heroSection.addEventListener('mouseleave', () => {
      resetAutoSlider();
    });
  }

  // Start 3s slider on page load
  resetAutoSlider();


  // ==========================================================================
  // 2. HEADER & STICKY SCROLL
  // ==========================================================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Burger Menu
  const burgerBtn = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      burgerBtn.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        burgerBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }


  // ==========================================================================
  // 3. PRODUCT CATALOG RENDERING & FILTERING
  // ==========================================================================
  const productsGrid = document.getElementById('productsGrid');
  const filterTabs = document.querySelectorAll('.filter-tab');

  // Load products from PRODUCTS_DATA (from js/products-data.js)
  const products = typeof PRODUCTS_DATA !== 'undefined' ? PRODUCTS_DATA : [];

  // Update counter badges on filter tabs
  const countRings = products.filter(p => p.category === 'Кольца').length;
  const countEarrings = products.filter(p => p.category === 'Серьги').length;
  const countPendants = products.filter(p => p.category === 'Подвески').length;

  const countAllEl = document.getElementById('countAll');
  const countRingsEl = document.getElementById('countRings');
  const countEarringsEl = document.getElementById('countEarrings');
  const countPendantsEl = document.getElementById('countPendants');

  if (countAllEl) countAllEl.textContent = products.length;
  if (countRingsEl) countRingsEl.textContent = countRings;
  if (countEarringsEl) countEarringsEl.textContent = countEarrings;
  if (countPendantsEl) countPendantsEl.textContent = countPendants;

  function renderProducts(category = 'all') {
    if (!productsGrid) return;

    const filtered = category === 'all' 
      ? products 
      : products.filter(p => p.category === category);

    productsGrid.innerHTML = '';

    filtered.forEach(product => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.setAttribute('data-id', product.id);

      const badgeHtml = product.badge 
        ? `<span class="product-badge">${product.badge}</span>` 
        : '';

      card.innerHTML = `
        <div class="product-thumb-box">
          ${badgeHtml}
          <button class="product-wishlist-btn" aria-label="В избранное" data-id="${product.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-details">
          <span class="product-category">${product.category}</span>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-footer-row">
            <span class="product-price">${product.formattedPrice}</span>
            <button class="btn-add-cart" data-id="${product.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>В корзину</span>
            </button>
          </div>
        </div>
      `;

      productsGrid.appendChild(card);
    });

    attachProductCardEvents();
  }

  // Filter tab click handlers
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-category');
      renderProducts(cat);
    });
  });

  // Also hook collection cards links to catalog filter
  document.querySelectorAll('.card-full-link[data-filter]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = link.getAttribute('data-filter');
      const targetTab = document.querySelector(`.filter-tab[data-category="${filter}"]`);
      if (targetTab) {
        targetTab.click();
      }
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Initial render
  renderProducts('all');


  // ==========================================================================
  // 4. CART SYSTEM (ADD, REMOVE, QUANTITY, DRAWER)
  // ==========================================================================
  let cart = [];

  // Try loading cart from localStorage
  try {
    const saved = localStorage.getItem('sergey_slotin_cart');
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (e) {
    cart = [];
  }

  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBtn = document.getElementById('cartBtn');
  const mobileCartBtn = document.getElementById('mobileCartBtn');
  const cartBadge = document.getElementById('cartBadge');
  const mobileCartBadge = document.getElementById('mobileCartBadge');
  const cartDrawerCount = document.getElementById('cartDrawerCount');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  const cartEmptyGoBtn = document.getElementById('cartEmptyGoBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function saveCart() {
    try {
      localStorage.setItem('sergey_slotin_cart', JSON.stringify(cart));
    } catch (e) {}
    updateCartUI();
  }

  function formatPrice(num) {
    return `${num.toLocaleString('ru-RU')} ₽`;
  }

  function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Update badges
    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    if (mobileCartBadge) {
      mobileCartBadge.textContent = totalItems;
      mobileCartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    if (cartDrawerCount) {
      cartDrawerCount.textContent = `(${totalItems})`;
    }
    if (cartTotalPrice) {
      cartTotalPrice.textContent = formatPrice(totalPrice);
    }

    // Toggle Empty State vs Items List
    if (totalItems === 0) {
      if (cartEmptyState) cartEmptyState.style.display = 'flex';
      if (cartItemsList) cartItemsList.style.display = 'none';
      if (cartFooter) cartFooter.style.display = 'none';
    } else {
      if (cartEmptyState) cartEmptyState.style.display = 'none';
      if (cartItemsList) {
        cartItemsList.style.display = 'flex';
        renderCartItems();
      }
      if (cartFooter) cartFooter.style.display = 'block';
    }
  }

  function renderCartItems() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    cart.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div class="cart-item-thumb">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-price">${formatPrice(item.price * item.quantity)}</span>
          <div class="cart-item-controls">
            <button class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Уменьшить">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Увеличить">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" aria-label="Удалить">✕</button>
      `;
      cartItemsList.appendChild(itemEl);
    });

    // Attach item buttons
    cartItemsList.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        const existing = cart.find(i => i.id === id);
        if (existing) {
          if (action === 'increase') {
            existing.quantity++;
          } else if (action === 'decrease') {
            existing.quantity--;
            if (existing.quantity <= 0) {
              cart = cart.filter(i => i.id !== id);
            }
          }
          saveCart();
        }
      });
    });

    cartItemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        cart = cart.filter(i => i.id !== id);
        saveCart();
      });
    });
  }

  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1
      });
    }

    saveCart();
    showToast(`«${product.name}» добавлен в корзину`);

    // Animate badge
    if (cartBadge) {
      cartBadge.style.transform = 'scale(1.4)';
      setTimeout(() => cartBadge.style.transform = 'scale(1)', 250);
    }
  }

  function openCart() {
    if (cartDrawer) {
      cartDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    if (cartDrawer) {
      cartDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (mobileCartBtn) mobileCartBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
  if (cartEmptyGoBtn) {
    cartEmptyGoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeCart();
      const catEl = document.getElementById('catalog');
      if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Hook product card click events
  function attachProductCardEvents() {
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        addToCart(id);

        btn.classList.add('added');
        const span = btn.querySelector('span');
        const originalText = span ? span.textContent : '';
        if (span) span.textContent = 'В корзине ✓';

        setTimeout(() => {
          btn.classList.remove('added');
          if (span) span.textContent = originalText;
        }, 1500);
      });
    });

    // Wishlist buttons
    document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.classList.toggle('active');
        const wishlistBadge = document.getElementById('wishlistBadge');
        if (wishlistBadge) {
          const current = parseInt(wishlistBadge.textContent) || 0;
          const next = btn.classList.contains('active') ? current + 1 : Math.max(0, current - 1);
          wishlistBadge.textContent = next;
          wishlistBadge.style.display = next > 0 ? 'flex' : 'none';
        }
      });
    });
  }

  // Initial cart UI update
  updateCartUI();


  // ==========================================================================
  // 5. CHECKOUT MODAL
  // ==========================================================================
  const checkoutModal = document.getElementById('checkoutModal');
  const checkoutBackdrop = document.getElementById('checkoutBackdrop');
  const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutFinalAmount = document.getElementById('checkoutFinalAmount');
  const checkoutFormWrapper = document.getElementById('checkoutFormWrapper');
  const checkoutSuccess = document.getElementById('checkoutSuccess');
  const orderDoneBtn = document.getElementById('orderDoneBtn');
  const orderIdNum = document.getElementById('orderIdNum');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      closeCart();
      const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      if (checkoutFinalAmount) {
        checkoutFinalAmount.textContent = formatPrice(totalPrice);
      }
      if (checkoutFormWrapper) checkoutFormWrapper.style.display = 'block';
      if (checkoutSuccess) checkoutSuccess.style.display = 'none';

      if (checkoutModal) {
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  function closeCheckoutModal() {
    if (checkoutModal) {
      checkoutModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeCheckoutModal);
  if (checkoutBackdrop) checkoutBackdrop.addEventListener('click', closeCheckoutModal);

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const randomOrder = 'SL-' + Math.floor(1000 + Math.random() * 9000);
      if (orderIdNum) orderIdNum.textContent = '#' + randomOrder;

      if (checkoutFormWrapper) checkoutFormWrapper.style.display = 'none';
      if (checkoutSuccess) checkoutSuccess.style.display = 'block';

      // Clear cart
      cart = [];
      saveCart();
    });
  }

  if (orderDoneBtn) {
    orderDoneBtn.addEventListener('click', () => {
      closeCheckoutModal();
    });
  }


  // ==========================================================================
  // 6. TOAST NOTIFICATION
  // ==========================================================================
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimeout = null;

  function showToast(text) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = text;
    toast.classList.add('active');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 2800);
  }


  // ==========================================================================
  // 7. SALON MODAL & SEARCH OVERLAY
  // ==========================================================================
  const salonModal = document.getElementById('salonModal');
  const findSalonBtn = document.getElementById('findSalonBtn');
  const aboutLearnMoreBtn = document.getElementById('aboutLearnMoreBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');

  function openSalonModal() {
    if (salonModal) {
      salonModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSalonModal() {
    if (salonModal) {
      salonModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (findSalonBtn) {
    findSalonBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSalonModal();
    });
  }

  if (aboutLearnMoreBtn) {
    aboutLearnMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSalonModal();
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeSalonModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeSalonModal);

  // Search Overlay
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchInput = document.getElementById('searchInput');

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 100);
    });
  }

  if (searchCloseBtn && searchOverlay) {
    searchCloseBtn.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim().toLowerCase();
        if (query) {
          searchOverlay.classList.remove('active');
          document.body.style.overflow = '';
          const catalogEl = document.getElementById('catalog');
          if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });

          // Filter by search query
          const filtered = products.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.category.toLowerCase().includes(query)
          );
          if (productsGrid) {
            productsGrid.innerHTML = '';
            if (filtered.length === 0) {
              productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">По запросу «${query}» ничего не найдено. Попробуйте другой запрос.</p>`;
            } else {
              // temporarily render filtered
              filtered.forEach(product => {
                // ...
              });
              renderProducts('all');
            }
          }
        }
      }
    });
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSalonModal();
      closeCart();
      closeCheckoutModal();
      if (searchOverlay) {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // Mobile Bottom Nav Highlight on Scroll
  const mobileNavLinks = document.querySelectorAll('.mobile-bottom-nav a');
  window.addEventListener('scroll', () => {
    const fromTop = window.scrollY + 200;
    mobileNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const section = document.querySelector(href);
        if (section) {
          if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
            mobileNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      }
    });
  });

});
