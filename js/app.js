/**
 * Krishna Candles - Main Application
 * Handles storefront functionality
 */

// ============================================
// Global State
// ============================================
let currentProduct = null;

// ============================================
// DOM Elements
// ============================================
const productsGrid = document.getElementById('productsGrid');
const combosGrid = document.getElementById('combosGrid');
const cartCountElements = document.querySelectorAll('.cart-count');

// ============================================
// Initialize Application
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initializeData();
  renderProducts();
  renderCombos();
  updateCartCount();
  initNavbar();
  initScrollAnimations();
});

// ============================================
// Render Products
// ============================================
function renderProducts() {
  const products = getAllProducts();
  if (!productsGrid) return;

  if (products.length === 0) {
    productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">🕯️</div>
                <h3>No candles available</h3>
                <p>Check back soon for our divine collection!</p>
            </div>
        `;
    return;
  }

  productsGrid.innerHTML = products.map(product => {
    const stockStatus = getStockStatus(product.stock);
    return `
            <div class="product-card reveal" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300?text=Candle'">
                    <span class="stock-badge ${stockStatus.class}">${stockStatus.text}</span>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="price-current">${formatPrice(product.price)}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-small" onclick="openProductModal(${product.id})" ${product.stock <= 0 ? 'disabled' : ''}>
                            ${product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="quickAddToCart(${product.id})">
                            🛒
                        </button>
                    </div>
                </div>
            </div>
        `;
  }).join('');

  // Trigger scroll animations
  setTimeout(initScrollAnimations, 100);
}

// ============================================
// Render Combos
// ============================================
function renderCombos() {
  const combos = getAllCombos();
  if (!combosGrid) return;

  if (combos.length === 0) {
    combosGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">🎁</div>
                <h3>No combos available</h3>
                <p>Special bundles coming soon!</p>
            </div>
        `;
    return;
  }

  combosGrid.innerHTML = combos.map(combo => {
    const comboWithProducts = getComboWithProducts(combo.id);
    const savings = combo.originalPrice - combo.comboPrice;
    const savingsPercent = Math.round((savings / combo.originalPrice) * 100);

    return `
            <div class="combo-card reveal" data-id="${combo.id}">
                <div class="product-image" style="height: 200px; margin-bottom: 20px; border-radius: 15px;">
                    <img src="${combo.image}" alt="${combo.name}" onerror="this.src='https://via.placeholder.com/400x300?text=Combo'">
                    <span class="stock-badge in-stock">COMBO</span>
                </div>
                <h3 class="combo-name">${combo.name}</h3>
                <p style="color: var(--gold-light); margin-bottom: 15px; font-size: 0.9rem;">${combo.description}</p>
                <ul class="combo-items">
                    ${comboWithProducts?.productDetails?.map(p => `
                        <li>${p.name} <span style="opacity: 0.7">(${formatPrice(p.price)})</span></li>
                    `).join('') || '<li>Loading products...</li>'}
                </ul>
                <div class="combo-pricing">
                    <span class="combo-price-current">${formatPrice(combo.comboPrice)}</span>
                    <span class="combo-price-original">${formatPrice(combo.originalPrice)}</span>
                    <span class="combo-savings">Save ${savingsPercent}%</span>
                </div>
                <button class="btn btn-gold" onclick="addComboToCart(${combo.id})">
                    Add Combo to Cart
                </button>
            </div>
        `;
  }).join('');
}

// ============================================
// Product Modal
// ============================================
function openProductModal(productId) {
  currentProduct = getProductById(productId);
  if (!currentProduct) return;

  const modal = document.getElementById('productModal');
  const modalContent = document.getElementById('productModalContent');

  modalContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <div class="product-image" style="height: 300px; border-radius: 15px; overflow: hidden;">
                <img src="${currentProduct.image}" alt="${currentProduct.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div>
                <h2 style="font-family: 'Cinzel', serif; color: var(--peacock-dark); margin-bottom: 10px;">${currentProduct.name}</h2>
                <p style="color: var(--text-light); margin-bottom: 20px;">${currentProduct.description}</p>
                <div style="font-size: 1.8rem; color: var(--saffron); font-weight: 700; margin-bottom: 20px;">
                    ${formatPrice(currentProduct.price)}
                </div>
                <div class="form-group">
                    <label>Quantity</label>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <button class="qty-btn" onclick="updateModalQty(-1)">−</button>
                        <span id="modalQty" style="font-size: 1.2rem; font-weight: 600;">1</span>
                        <button class="qty-btn" onclick="updateModalQty(1)">+</button>
                    </div>
                </div>
                <div class="form-group">
                    <label>Customization Note (Optional)</label>
                    <textarea id="customizationNote" placeholder="Add any special requests, custom messages, etc." style="min-height: 80px;"></textarea>
                </div>
                <div style="font-size: 1.5rem; color: var(--peacock-dark); font-weight: 700; margin-top: 20px;">
                    Total: <span id="modalTotal">${formatPrice(currentProduct.price)}</span>
                </div>
            </div>
        </div>
    `;

  modal.classList.add('active');
}

function updateModalQty(change) {
  const qtySpan = document.getElementById('modalQty');
  const totalSpan = document.getElementById('modalTotal');
  let qty = parseInt(qtySpan.textContent) + change;
  qty = Math.max(1, Math.min(qty, currentProduct.stock));
  qtySpan.textContent = qty;
  totalSpan.textContent = formatPrice(currentProduct.price * qty);
}

function addToCartFromModal() {
  const qty = parseInt(document.getElementById('modalQty').textContent);
  const customization = document.getElementById('customizationNote').value;

  addToCart({
    id: currentProduct.id,
    type: 'product',
    name: currentProduct.name,
    price: currentProduct.price,
    image: currentProduct.image,
    quantity: qty,
    customization: customization
  });

  closeModal('productModal');
  updateCartCount();
  showToast(`${currentProduct.name} added to cart!`, 'success');
}

function quickAddToCart(productId) {
  const product = getProductById(productId);
  if (!product || product.stock <= 0) {
    showToast('Product is out of stock', 'error');
    return;
  }

  addToCart({
    id: product.id,
    type: 'product',
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1,
    customization: ''
  });

  updateCartCount();
  showToast(`${product.name} added to cart!`, 'success');
}

function addComboToCart(comboId) {
  const combo = getComboById(comboId);
  if (!combo) return;

  addToCart({
    id: combo.id,
    type: 'combo',
    name: combo.name,
    price: combo.comboPrice,
    image: combo.image,
    quantity: 1,
    customization: '',
    products: combo.products
  });

  updateCartCount();
  showToast(`${combo.name} added to cart!`, 'success');
}

// ============================================
// Modal Management
// ============================================
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
    });
  }
});

// ============================================
// Cart Count Update
// ============================================
function updateCartCount() {
  const count = getCartCount();
  cartCountElements.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'block' : 'none';
  });
}

// ============================================
// Navigation
// ============================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  mobileMenuBtn?.addEventListener('click', () => {
    navLinks?.classList.toggle('active');
  });
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}

// ============================================
// Smooth Scroll
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
