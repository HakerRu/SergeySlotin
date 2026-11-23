/**
 * SERGEY SLOTIN — LUXURY JEWELRY HOUSE
 * Multi-page Core Interactive Scripts: Cart, Wishlist, Showcase, Catalog, Salons, Auth & QuickView
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. PRODUCTS & SALONS DATA FALLBACK
  // ==========================================================================
  const products = typeof PRODUCTS_DATA !== 'undefined' ? PRODUCTS_DATA : [];
  const salons = typeof SALONS_DATA !== 'undefined' ? SALONS_DATA : [];


  // ==========================================================================
  // 2. HERO SLIDER (3-SECOND AUTO ROTATION ON MAIN PAGE)
  // ==========================================================================
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const slides = [
      { num: '01', image: 'images/hero_model.jpg', tagline: 'ИСКУССТВО БЫТЬ СОБОЙ' },
      { num: '02', image: 'images/collection_necklace.jpg', tagline: 'БЕСКОНЕЧНОЕ СИЯНИЕ БРИЛЛИАНТОВ' },
      { num: '03', image: 'images/about_ring.jpg', tagline: 'ВЕЛИЧИЕ АВТОРСКИХ ФОРМ' },
      { num: '04', image: 'images/collection_earrings.jpg', tagline: 'ГАРМОНИЯ ФОРМ И СВЕТА' }
    ];

    let currentSlideIndex = 0;
    const SLIDE_INTERVAL_MS = 3000;
    let slideTimer = null;
    let progressInterval = null;
    let progressStartTime = 0;

    const currentSlideNum = document.getElementById('currentSlideNum');
    const sliderProgressBar = document.getElementById('sliderProgressBar');
    const prevSlideBtn = document.getElementById('prevSlideBtn');
    const nextSlideBtn = document.getElementById('nextSlideBtn');
    const heroImage = document.getElementById('heroImage');
    const heroTagline = document.querySelector('.hero-tagline');

    function updateSlide(index) {
      currentSlideIndex = (index + slides.length) % slides.length;
      const slide = slides[currentSlideIndex];

      if (currentSlideNum) currentSlideNum.textContent = slide.num;

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
        if (pct >= 100) clearInterval(progressInterval);
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
      prevSlideBtn.addEventListener('click', () => updateSlide(currentSlideIndex - 1));
      nextSlideBtn.addEventListener('click', () => updateSlide(currentSlideIndex + 1));
    }

    heroSection.addEventListener('mouseenter', () => {
      if (slideTimer) clearInterval(slideTimer);
      if (progressInterval) clearInterval(progressInterval);
    });
    heroSection.addEventListener('mouseleave', resetAutoSlider);

    resetAutoSlider();
  }


  // ==========================================================================
  // 3. HEADER & MOBILE BURGER MENU
  // ==========================================================================
  const header = document.getElementById('header');
  if (header && !header.classList.contains('inner-page-header')) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

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
  // 4. SHARED CART & WISHLIST STORAGE (SYNCED ACROSS ALL PAGES)
  // ==========================================================================
  let cart = [];
  try {
    const saved = localStorage.getItem('sergey_slotin_cart_v2');
    if (saved) cart = JSON.parse(saved);
  } catch (e) {
    cart = [];
  }

  let wishlist = [];
  try {
    const savedW = localStorage.getItem('sergey_slotin_wishlist_v2');
    if (savedW) wishlist = JSON.parse(savedW);
  } catch (e) {
    wishlist = [];
  }

  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartBtn = document.getElementById('cartBtn');
  const mobileCartBtn = document.getElementById('mobileCartBtn');
  const cartBadge = document.getElementById('cartBadge');
  const mobileCartBadge = document.getElementById('mobileCartBadge');
  const wishlistBadge = document.getElementById('wishlistBadge');
  const cartDrawerCount = document.getElementById('cartDrawerCount');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  const cartEmptyGoBtn = document.getElementById('cartEmptyGoBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function saveCart() {
    try {
      localStorage.setItem('sergey_slotin_cart_v2', JSON.stringify(cart));
    } catch (e) {}
    updateCartUI();
  }

  function saveWishlist() {
    try {
      localStorage.setItem('sergey_slotin_wishlist_v2', JSON.stringify(wishlist));
    } catch (e) {}
    updateWishlistUI();
  }

  function formatPrice(num) {
    return `${num.toLocaleString('ru-RU')} ₽`;
  }

  function updateWishlistUI() {
    if (wishlistBadge) {
      wishlistBadge.textContent = wishlist.length;
      wishlistBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
  }

  function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    if (mobileCartBadge) {
      mobileCartBadge.textContent = totalItems;
      mobileCartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    if (cartDrawerCount) cartDrawerCount.textContent = `(${totalItems})`;
    if (cartTotalPrice) cartTotalPrice.textContent = formatPrice(totalPrice);

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
      const sizeNote = item.size ? `<span style="font-size: 11px; color: #888;">Размер: ${item.size}</span>` : '';

      itemEl.innerHTML = `
        <div class="cart-item-thumb">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          ${sizeNote}
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

    cartItemsList.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        const existing = cart.find(i => i.id === id);
        if (existing) {
          if (action === 'increase') existing.quantity++;
          else if (action === 'decrease') {
            existing.quantity--;
            if (existing.quantity <= 0) cart = cart.filter(i => i.id !== id);
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

  function addToCart(productId, selectedSize = null) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItemId = selectedSize ? `${productId}-${selectedSize}` : productId;
    const existing = cart.find(item => item.id === cartItemId);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({
        id: cartItemId,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        size: selectedSize,
        quantity: 1
      });
    }

    saveCart();
    showToast(`«${product.name}» добавлен в корзину`);

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
      closeCart();
    });
  }

  updateCartUI();
  updateWishlistUI();


  // ==========================================================================
  // 5. PRODUCT CARD RENDERING HELPER (SHARED BY MAIN SHOWCASE & CATALOG)
  // ==========================================================================
  function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);

    let badgeClass = 'product-badge';
    if (product.badge === 'Спеццена' || product.badge === '-25%') badgeClass += ' badge-special';
    if (product.badge === 'Новинка') badgeClass += ' badge-new';

    const badgeHtml = product.badge ? `<span class="${badgeClass}">${product.badge}</span>` : '';
    const isWished = wishlist.includes(product.id);
    const oldPriceHtml = product.formattedOldPrice ? `<span class="product-old-price">${product.formattedOldPrice}</span>` : '';

    card.innerHTML = `
      <div class="product-thumb-box" data-action="quickview" data-id="${product.id}">
        ${badgeHtml}
        <button class="product-wishlist-btn ${isWished ? 'active' : ''}" aria-label="В избранное" data-id="${product.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWished ? '#e53935' : 'none'}" stroke="currentColor" stroke-width="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-details">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name" data-action="quickview" data-id="${product.id}">${product.name}</h3>
        <span class="product-meta-specs">${product.metal} • ${product.insert}</span>
        <div class="product-footer-row">
          <div class="price-box">
            <span class="product-price">${product.formattedPrice}</span>
            ${oldPriceHtml}
          </div>
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

    return card;
  }

  function attachCardListeners(container) {
    if (!container) return;

    // Add to cart button
    container.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
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

    // Wishlist button
    container.querySelectorAll('.product-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (wishlist.includes(id)) {
          wishlist = wishlist.filter(item => item !== id);
          btn.classList.remove('active');
          btn.querySelector('svg').setAttribute('fill', 'none');
          showToast('Удалено из избранного');
        } else {
          wishlist.push(id);
          btn.classList.add('active');
          btn.querySelector('svg').setAttribute('fill', '#e53935');
          showToast('Добавлено в избранное ❤️');
        }
        saveWishlist();
      });
    });

    // Quick View click on image or title
    container.querySelectorAll('[data-action="quickview"]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-id');
        openQuickView(id);
      });
    });
  }


  // ==========================================================================
  // 6. MAIN PAGE SHOWCASE (TABS: НОВЫЕ, ПОПУЛЯРНЫЕ, СПЕЦПРЕДЛОЖЕНИЯ)
  // ==========================================================================
  const showcaseGrid = document.getElementById('showcaseGrid');
  const showcaseTabs = document.querySelectorAll('.showcase-tab');

  if (showcaseGrid && showcaseTabs.length > 0) {
    function renderShowcase(tabType) {
      showcaseGrid.innerHTML = '';
      let filtered = [];

      if (tabType === 'new') {
        filtered = products.filter(p => p.isNew);
      } else if (tabType === 'popular') {
        filtered = products.filter(p => p.isPopular);
      } else if (tabType === 'special') {
        filtered = products.filter(p => p.isSpecial || p.oldPrice);
      }

      if (filtered.length === 0) filtered = products.slice(0, 4);

      filtered.forEach(p => {
        showcaseGrid.appendChild(createProductCard(p));
      });

      attachCardListeners(showcaseGrid);
    }

    showcaseTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        showcaseTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const type = tab.getAttribute('data-tab');
        renderShowcase(type);
      });
    });

    // Initial showcase render (New arrivals)
    renderShowcase('new');
  }


  // ==========================================================================
  // 7. DEDICATED CATALOG PAGE (FILTERS, SORTING, LIVE COUNTERS)
  // ==========================================================================
  const catalogGrid = document.getElementById('catalogGrid');
  const catalogCountText = document.getElementById('catalogCountText');
  const catalogSortSelect = document.getElementById('catalogSortSelect');
  const filterCategoryRadios = document.querySelectorAll('input[name="filterCategory"]');
  const filterMetalCheckboxes = document.querySelectorAll('input[name="filterMetal"]');
  const filterPriceMin = document.getElementById('filterPriceMin');
  const filterPriceMax = document.getElementById('filterPriceMax');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  if (catalogGrid) {
    let currentCategory = 'all';
    let currentSort = 'popular';
    let selectedMetals = [];

    // Parse URL params for preselected filter (e.g. catalog.html?cat=Кольца)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (catParam) {
      currentCategory = catParam;
      const matchingRadio = document.querySelector(`input[name="filterCategory"][value="${catParam}"]`);
      if (matchingRadio) matchingRadio.checked = true;
    }

    function applyCatalogFilters() {
      let result = [...products];

      // Category
      if (currentCategory !== 'all') {
        result = result.filter(p => p.category === currentCategory);
      }

      // Metals
      if (selectedMetals.length > 0) {
        result = result.filter(p => selectedMetals.some(metal => p.metal.toLowerCase().includes(metal.toLowerCase())));
      }

      // Price range
      const minPrice = parseFloat(filterPriceMin ? filterPriceMin.value : 0) || 0;
      const maxPrice = parseFloat(filterPriceMax ? filterPriceMax.value : 999999) || 999999;
      result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);

      // Sorting
      if (currentSort === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (currentSort === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
      } else if (currentSort === 'new') {
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      } else {
        result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
      }

      // Render
      catalogGrid.innerHTML = '';
      if (result.length === 0) {
        catalogGrid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
            <p style="font-size: 18px; color: #888; margin-bottom: 16px;">По заданным фильтрам украшений не найдено.</p>
            <button class="btn btn-outline-dark" id="clearFiltersBtn">Сбросить фильтры</button>
          </div>
        `;
        const clrBtn = document.getElementById('clearFiltersBtn');
        if (clrBtn) clrBtn.addEventListener('click', resetAllFilters);
      } else {
        result.forEach(p => catalogGrid.appendChild(createProductCard(p)));
        attachCardListeners(catalogGrid);
      }

      if (catalogCountText) {
        catalogCountText.textContent = `Найдено ${result.length} ${pluralizeItems(result.length)}`;
      }
    }

    function pluralizeItems(count) {
      if (count % 10 === 1 && count % 100 !== 11) return 'изделие';
      if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'изделия';
      return 'изделий';
    }

    function resetAllFilters() {
      currentCategory = 'all';
      currentSort = 'popular';
      selectedMetals = [];

      const allCatRadio = document.querySelector('input[name="filterCategory"][value="all"]');
      if (allCatRadio) allCatRadio.checked = true;

      filterMetalCheckboxes.forEach(cb => cb.checked = false);
      if (filterPriceMin) filterPriceMin.value = '';
      if (filterPriceMax) filterPriceMax.value = '';
      if (catalogSortSelect) catalogSortSelect.value = 'popular';

      applyCatalogFilters();
    }

    filterCategoryRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        currentCategory = radio.value;
        applyCatalogFilters();
      });
    });

    filterMetalCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        selectedMetals = Array.from(filterMetalCheckboxes).filter(c => c.checked).map(c => c.value);
        applyCatalogFilters();
      });
    });

    if (filterPriceMin) filterPriceMin.addEventListener('input', applyCatalogFilters);
    if (filterPriceMax) filterPriceMax.addEventListener('input', applyCatalogFilters);

    if (catalogSortSelect) {
      catalogSortSelect.addEventListener('change', () => {
        currentSort = catalogSortSelect.value;
        applyCatalogFilters();
      });
    }

    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);

    // Initial catalog render
    applyCatalogFilters();
  }


  // ==========================================================================
  // 8. SALONS PAGE INTERACTIVE DIRECTORY & MAP
  // ==========================================================================
  const salonDirectoryCards = document.querySelectorAll('.salon-directory-card');
  const mapOverlayTitle = document.getElementById('mapOverlayTitle');
  const mapOverlayAddress = document.getElementById('mapOverlayAddress');
  const mapIframe = document.getElementById('mapIframe');
  const mapBookBtn = document.getElementById('mapBookBtn');

  if (salonDirectoryCards.length > 0) {
    salonDirectoryCards.forEach(card => {
      card.addEventListener('click', () => {
        salonDirectoryCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const salonId = card.getAttribute('data-id');
        const salon = salons.find(s => s.id === salonId);
        if (salon) {
          if (mapOverlayTitle) mapOverlayTitle.textContent = salon.name;
          if (mapOverlayAddress) mapOverlayAddress.textContent = salon.address;
          if (mapBookBtn) {
            mapBookBtn.setAttribute('data-salon', salon.address);
          }
          // Update map center with Yandex Maps coords
          if (mapIframe && salon.coordinates) {
            const [lat, lon] = salon.coordinates;
            mapIframe.src = `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=16&pt=${lon}%2C${lat},pm2rdm`;
          }
        }
      });
    });
  }


  // ==========================================================================
  // 9. QUICK VIEW MODAL
  // ==========================================================================
  const quickViewModal = document.getElementById('quickViewModal');
  const quickViewCloseBtn = document.getElementById('quickViewCloseBtn');
  const qvImage = document.getElementById('qvImage');
  const qvCategory = document.getElementById('qvCategory');
  const qvTitle = document.getElementById('qvTitle');
  const qvPrice = document.getElementById('qvPrice');
  const qvOldPrice = document.getElementById('qvOldPrice');
  const qvDesc = document.getElementById('qvDesc');
  const qvMetal = document.getElementById('qvMetal');
  const qvInsert = document.getElementById('qvInsert');
  const qvWeight = document.getElementById('qvWeight');
  const qvSizesContainer = document.getElementById('qvSizesContainer');
  const qvAddToCartBtn = document.getElementById('qvAddToCartBtn');

  let activeQuickViewProduct = null;
  let activeQuickViewSize = null;

  function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !quickViewModal) return;

    activeQuickViewProduct = product;
    activeQuickViewSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;

    if (qvImage) qvImage.src = product.image;
    if (qvCategory) qvCategory.textContent = product.category;
    if (qvTitle) qvTitle.textContent = product.name;
    if (qvPrice) qvPrice.textContent = product.formattedPrice;
    if (qvOldPrice) {
      qvOldPrice.textContent = product.formattedOldPrice || '';
      qvOldPrice.style.display = product.formattedOldPrice ? 'inline' : 'none';
    }
    if (qvDesc) qvDesc.textContent = product.description;
    if (qvMetal) qvMetal.textContent = product.metal || 'Золото 585';
    if (qvInsert) qvInsert.textContent = product.insert || 'Бриллиант';
    if (qvWeight) qvWeight.textContent = product.weight || '2.5 г';

    // Sizes
    if (qvSizesContainer) {
      qvSizesContainer.innerHTML = '';
      if (product.sizes && product.sizes.length > 0) {
        product.sizes.forEach((size, idx) => {
          const pill = document.createElement('span');
          pill.className = `size-pill ${idx === 0 ? 'active' : ''}`;
          pill.textContent = size;
          pill.addEventListener('click', () => {
            qvSizesContainer.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeQuickViewSize = size;
          });
          qvSizesContainer.appendChild(pill);
        });
      }
    }

    quickViewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    if (quickViewModal) {
      quickViewModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (quickViewCloseBtn) quickViewCloseBtn.addEventListener('click', closeQuickView);
  if (qvAddToCartBtn) {
    qvAddToCartBtn.addEventListener('click', () => {
      if (activeQuickViewProduct) {
        addToCart(activeQuickViewProduct.id, activeQuickViewSize);
        closeQuickView();
        openCart();
      }
    });
  }


  // ==========================================================================
  // 10. AUTH & LOYALTY CLUB PAGE (LOGIN / REGISTRATION)
  // ==========================================================================
  const authTabBtns = document.querySelectorAll('.auth-tab-btn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const authFormsWrapper = document.getElementById('authFormsWrapper');
  const userProfileView = document.getElementById('userProfileView');
  const profileUserName = document.getElementById('profileUserName');
  const profileUserPhone = document.getElementById('profileUserPhone');
  const logoutBtn = document.getElementById('logoutBtn');

  // Check saved user
  let currentUser = null;
  try {
    const savedU = localStorage.getItem('sergey_slotin_user');
    if (savedU) currentUser = JSON.parse(savedU);
  } catch (e) {
    currentUser = null;
  }

  function updateAuthPageUI() {
    if (!authFormsWrapper || !userProfileView) return;

    if (currentUser) {
      authFormsWrapper.style.display = 'none';
      userProfileView.style.display = 'flex';
      if (profileUserName) profileUserName.textContent = currentUser.name || 'Гость дома';
      if (profileUserPhone) profileUserPhone.textContent = currentUser.phone || '';
    } else {
      authFormsWrapper.style.display = 'block';
      userProfileView.style.display = 'none';
    }
  }

  if (authTabBtns.length > 0) {
    authTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        authTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');

        if (mode === 'login') {
          if (loginForm) loginForm.style.display = 'flex';
          if (registerForm) registerForm.style.display = 'none';
        } else {
          if (loginForm) loginForm.style.display = 'none';
          if (registerForm) registerForm.style.display = 'flex';
        }
      });
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneInput = document.getElementById('loginPhone');
      currentUser = {
        name: 'Анна Смирнова',
        phone: phoneInput ? phoneInput.value : '+7 (912) 827-00-11',
        bonuses: 5000,
        tier: 'Silver Privé (5%)'
      };
      localStorage.setItem('sergey_slotin_user', JSON.stringify(currentUser));
      showToast('Добро пожаловать в Клуб привилегий SERGEY SLOTIN!');
      updateAuthPageUI();
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('regName');
      const phoneInput = document.getElementById('regPhone');
      currentUser = {
        name: nameInput ? nameInput.value : 'Новый клиент',
        phone: phoneInput ? phoneInput.value : '+7 (912) 000-00-00',
        bonuses: 5000,
        tier: 'Silver Privé (5%)'
      };
      localStorage.setItem('sergey_slotin_user', JSON.stringify(currentUser));
      showToast('Вам начислено 5 000 приветственных бонусов! 🎁');
      updateAuthPageUI();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      currentUser = null;
      localStorage.removeItem('sergey_slotin_user');
      showToast('Вы вышли из личного кабинета');
      updateAuthPageUI();
    });
  }

  updateAuthPageUI();


  // ==========================================================================
  // 11. CHECKOUT & VIP FITTING BOOKING MODAL
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
  const modalDialogTitle = document.getElementById('modalDialogTitle');
  const modalDialogSub = document.getElementById('modalDialogSub');
  const pickupSalonSelect = document.getElementById('pickupSalon');
  const checkoutSummaryBox = document.getElementById('checkoutSummaryBox');
  const submitFormBtn = document.getElementById('submitFormBtn');

  function openBookingModal(options = {}) {
    closeCart();
    const { title, subtitle, salonName, isOrder } = options;

    if (modalDialogTitle) modalDialogTitle.textContent = title || 'Запись на примерку в салон';
    if (modalDialogSub) modalDialogSub.textContent = subtitle || 'Персональный стилист подготовит украшения к вашему визиту';

    if (salonName && pickupSalonSelect) {
      for (let i = 0; i < pickupSalonSelect.options.length; i++) {
        if (pickupSalonSelect.options[i].text.includes(salonName) || pickupSalonSelect.options[i].value.includes(salonName)) {
          pickupSalonSelect.selectedIndex = i;
          break;
        }
      }
    }

    if (isOrder) {
      if (checkoutSummaryBox) checkoutSummaryBox.style.display = 'block';
      const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      if (checkoutFinalAmount) checkoutFinalAmount.textContent = formatPrice(totalPrice);
      if (submitFormBtn) submitFormBtn.textContent = 'Подтвердить заказ';
    } else {
      if (checkoutSummaryBox) checkoutSummaryBox.style.display = 'none';
      if (submitFormBtn) submitFormBtn.textContent = 'Забронировать визит';
    }

    if (checkoutFormWrapper) checkoutFormWrapper.style.display = 'block';
    if (checkoutSuccess) checkoutSuccess.style.display = 'none';

    if (checkoutModal) {
      checkoutModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCheckoutModal() {
    if (checkoutModal) {
      checkoutModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      openBookingModal({
        title: 'Оформление заказа',
        subtitle: 'Забронируйте изделия для примерки в салоне Кирова или оформите доставку',
        isOrder: true
      });
    });
  }

  // Hook all booking buttons across pages
  document.querySelectorAll('[data-action="book-fitting"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const salon = btn.getAttribute('data-salon') || '';
      openBookingModal({
        title: 'Запись на примерку в салон',
        subtitle: 'Персональный стилист подготовит понравившиеся украшения',
        salonName: salon,
        isOrder: false
      });
    });
  });

  const bespokeConsultBtn = document.getElementById('bespokeConsultBtn');
  if (bespokeConsultBtn) {
    bespokeConsultBtn.addEventListener('click', () => {
      openBookingModal({
        title: 'Заявка на индивидуальный дизайн',
        subtitle: 'Консультация с главным ювелиром и разработка 3D-эскиза изделия',
        isOrder: false
      });
    });
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

      cart = [];
      saveCart();
    });
  }

  if (orderDoneBtn) orderDoneBtn.addEventListener('click', closeCheckoutModal);


  // ==========================================================================
  // 12. TOAST NOTIFICATION
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
  // 13. SEARCH OVERLAY
  // ==========================================================================
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
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }

  // Close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeCheckoutModal();
      closeQuickView();
      if (searchOverlay) {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

});
