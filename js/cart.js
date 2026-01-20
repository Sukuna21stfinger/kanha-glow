/**
 * Kanha Glow Candles - Cart Management
 * Orders sent to custom mail server at localhost:3001
 */

// ============================================
// Mail Server Configuration
// ============================================
// Your mail server endpoint (Mail-Server-main running on port 3001)
const MAIL_SERVER_URL = 'https://yuji1405.vercel.app/api/contact';

// IMPORTANT: Set this to your BACKEND_IDENTIFIER from the mail server's .env.local
// This is required for the mail server to accept requests
const BACKEND_IDENTIFIER = 'kanha_glow_secure_2025_orders';

// Business contact info
const BUSINESS_EMAIL = 'kanhaglow09@gmail.com';
const BUSINESS_PHONE = '6388009305';

document.addEventListener('DOMContentLoaded', () => {
  initializeData();
  renderCartItems();
  updateCartSummary();
  initOrderForm();
});

function renderCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cart = getCart();

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some divine candles to get started!</p>
                <a href="index.html" class="btn btn-primary" style="margin-top: 20px;">Continue Shopping</a>
            </div>
        `;
    return;
  }

  cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100?text=Candle'">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                ${item.type === 'combo' ? '<span style="background: var(--saffron); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem;">COMBO</span>' : ''}
                ${item.customization ? `<p class="cart-item-customization">"${item.customization}"</p>` : ''}
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn" onclick="changeCartQty(${index}, -1)">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="changeCartQty(${index}, 1)">+</button>
            </div>
            <div class="cart-item-total"><strong>${formatPrice(item.price * item.quantity)}</strong></div>
            <span class="remove-item" onclick="removeCartItem(${index})" title="Remove">🗑️</span>
        </div>
  `).join('');
}

function changeCartQty(index, change) {
  const cart = getCart();
  if (!cart[index]) return;

  const newQty = cart[index].quantity + change;
  if (cart[index].type === 'product') {
    const product = getProductById(cart[index].id);
    if (product && newQty > product.stock) {
      showToast(`Only ${product.stock} available`, 'error');
      return;
    }
  }

  if (newQty <= 0) {
    removeCartItem(index);
  } else {
    updateCartItemQuantity(index, newQty);
    renderCartItems();
    updateCartSummary();
    updateCartCount();
  }
}

function removeCartItem(index) {
  removeFromCart(index);
  renderCartItems();
  updateCartSummary();
  updateCartCount();
  showToast('Item removed', 'info');
}

function updateCartCount() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'block' : 'none';
  });
}

function updateCartSummary() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  const itemCountEl = document.getElementById('itemCount');

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl) totalEl.textContent = formatPrice(subtotal);
  if (itemCountEl) itemCountEl.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
}

function initOrderForm() {
  const form = document.getElementById('shippingForm');
  if (form) form.addEventListener('submit', handleOrderSubmit);
}

async function handleOrderSubmit(e) {
  e.preventDefault();
  const cart = getCart();
  const submitBtn = document.getElementById('submitBtn');

  if (cart.length === 0) {
    showToast('Cart is empty', 'error');
    return;
  }

  const total = getCartTotal();
  const name = document.getElementById('customerName').value.trim();
  const email = document.getElementById('customerEmail').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();
  const city = document.getElementById('customerCity').value.trim();
  const state = document.getElementById('customerState').value.trim();
  const pincode = document.getElementById('customerPincode').value.trim();

  // Validate phone
  if (!/^[0-9]{10}$/.test(phone.replace(/\s/g, ''))) {
    showToast('Please enter a valid 10-digit phone number', 'error');
    return;
  }

  // Show loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Placing Order...';
  }

  // Create order
  const order = createOrder({
    items: cart,
    customer: { name, email, phone, address, city, state, pincode },
    payment: { status: 'pending', note: 'Payment to be collected manually' },
    subtotal: total,
    total: total
  });

  // Build order message
  const itemsList = cart.map(item =>
    `• ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`
  ).join('\n');

  const orderMessage = `
NEW ORDER RECEIVED!

Order Number: #${order.id}
Date: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

CUSTOMER DETAILS:
Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}
City: ${city}
State: ${state}
PIN Code: ${pincode}

ORDER ITEMS:
${itemsList}

ORDER TOTAL: ₹${total}
(Delivery charges to be added based on location)

---
Action Required: Contact the customer to confirm delivery charges and collect payment.
  `.trim();

  // Send to mail server
  try {
    const response = await fetch(MAIL_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `Order #${order.id} - ${name}`,
        email: email,
        message: orderMessage,
        identifier: BACKEND_IDENTIFIER
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showOrderSuccess(order, true);
    } else {
      console.error('Mail server error:', result);
      showOrderSuccess(order, false);
    }
  } catch (error) {
    console.error('Failed to send order email:', error);
    showOrderSuccess(order, false);
  }
}

function showOrderSuccess(order, emailSent) {
  const cartContent = document.querySelector('.cart-container');
  if (!cartContent) return;

  const emailStatus = emailSent
    ? `<div style="background: #E8F5E9; padding: 20px; border-radius: 15px; max-width: 500px; margin: 25px auto; border-left: 4px solid #4CAF50;">
        <p style="color: #2E7D32; font-weight: 600;">✅ Order Details Sent Successfully!</p>
        <p style="color: #555;">We have received your order and will contact you shortly to confirm delivery and payment.</p>
       </div>`
    : `<div style="background: #FFF3E0; padding: 20px; border-radius: 15px; max-width: 500px; margin: 25px auto; border-left: 4px solid #FF9800;">
        <p style="color: #E65100; font-weight: 600;">⚠️ Order Placed (Email pending)</p>
        <p style="color: #555;">Please contact us directly to confirm your order:</p>
        <p style="color: #555; font-weight: 600;">📞 ${BUSINESS_PHONE} | 📧 ${BUSINESS_EMAIL}</p>
       </div>`;

  cartContent.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
            <div style="font-size: 5rem; margin-bottom: 20px;">🙏</div>
            <h2 style="font-family: 'Cinzel', serif; color: var(--peacock-dark);">धन्यवाद (Thank You)!</h2>
            <p style="font-size: 1.2rem; color: var(--text-light);">Your order has been placed successfully!</p>
            <p style="color: var(--peacock-blue); font-weight: 600; margin: 20px 0;">
                Order Number: <strong>#${order.id}</strong>
            </p>
            <p style="font-size: 1.5rem; color: var(--saffron); font-weight: 700;">Order Total: ${formatPrice(order.total)}</p>
            <p style="color: #888; margin-top: 10px;">+ Delivery charges (to be confirmed)</p>
            
            ${emailStatus}
            
            <div style="background: #E3F2FD; padding: 15px; border-radius: 10px; max-width: 400px; margin: 20px auto;">
                <p style="color: #1565C0; font-size: 0.9rem;"><strong>Contact Us:</strong><br>
                📞 ${BUSINESS_PHONE}<br>
                📧 ${BUSINESS_EMAIL}</p>
            </div>
            
            <a href="index.html" class="btn btn-primary" style="margin-top: 20px;">Continue Shopping</a>
        </div>
  `;
  updateCartCount();
}

function clearCartItems() {
  if (confirm('Clear your cart?')) {
    clearCart();
    renderCartItems();
    updateCartSummary();
    updateCartCount();
  }
}
