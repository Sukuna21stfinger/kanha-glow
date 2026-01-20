/**
 * Krishna Candles - Admin Panel
 */

// Logout function
function logout() {
  localStorage.removeItem('kanha_admin_session');
  window.location.href = 'admin-login.html';
}

let editingProductId = null;
let editingComboId = null;
let selectedComboProducts = [];

document.addEventListener('DOMContentLoaded', () => {
  initializeData();
  initAdminNav();
  renderStats();
  renderProductsTable();
  renderCombosTable();
  populateProductSelect();
});

function initAdminNav() {
  document.querySelectorAll('.admin-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      document.querySelectorAll('.admin-nav a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
      document.getElementById(section)?.classList.add('active');
    });
  });
}

function renderStats() {
  const products = getAllProducts();
  const combos = getAllCombos();
  const orders = getAllOrders();
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  document.getElementById('totalProducts').textContent = products.length;
  document.getElementById('totalCombos').textContent = combos.length;
  document.getElementById('totalStock').textContent = totalStock;
  document.getElementById('totalOrders').textContent = orders.length;
}

function renderProductsTable() {
  const tbody = document.getElementById('productsTableBody');
  const products = getAllProducts();

  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;">No products. Add your first candle!</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(p => {
    const status = getStockStatus(p.stock);
    return `
            <tr>
                <td><img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/60'"></td>
                <td><strong>${p.name}</strong><br><small style="color:#888">${p.description.substring(0, 50)}...</small></td>
                <td>${formatPrice(p.price)}</td>
                <td>
                    <div class="stock-controls">
                        <button class="stock-btn minus" onclick="adjustStock(${p.id}, -1)">−</button>
                        <span class="stock-value">${p.stock}</span>
                        <button class="stock-btn plus" onclick="adjustStock(${p.id}, 1)">+</button>
                    </div>
                    <span class="stock-badge ${status.class}" style="font-size:0.7rem;margin-top:5px;display:inline-block;">${status.text}</span>
                </td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn edit" onclick="editProduct(${p.id})">✏️</button>
                        <button class="action-btn delete" onclick="deleteProductItem(${p.id})">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
  }).join('');
}

function adjustStock(id, change) {
  updateStock(id, change);
  renderProductsTable();
  renderStats();
  showToast(`Stock updated`, 'success');
}

function openProductModal(productId = null) {
  editingProductId = productId;
  const modal = document.getElementById('productModal');
  const title = document.getElementById('productModalTitle');
  const form = document.getElementById('productForm');

  form.reset();
  document.getElementById('imagePreview').innerHTML = '';

  if (productId) {
    const product = getProductById(productId);
    if (product) {
      title.textContent = 'Edit Candle';
      document.getElementById('productName').value = product.name;
      document.getElementById('productDescription').value = product.description;
      document.getElementById('productPrice').value = product.price;
      document.getElementById('productStock').value = product.stock;
      document.getElementById('productCategory').value = product.category || 'sacred';
      document.getElementById('productImageUrl').value = product.image;
      document.getElementById('imagePreview').innerHTML = `<img src="${product.image}" alt="Preview">`;
    }
  } else {
    title.textContent = 'Add New Candle';
  }

  modal.classList.add('active');
}

function editProduct(id) {
  openProductModal(id);
}

function saveProduct() {
  const name = document.getElementById('productName').value.trim();
  const description = document.getElementById('productDescription').value.trim();
  const price = parseInt(document.getElementById('productPrice').value);
  const stock = parseInt(document.getElementById('productStock').value);
  const category = document.getElementById('productCategory').value;
  const image = document.getElementById('productImageUrl').value.trim() || 'https://via.placeholder.com/400x300?text=Candle';

  if (!name || !price) {
    showToast('Please fill required fields', 'error');
    return;
  }

  const productData = { name, description, price, stock, category, image };

  if (editingProductId) {
    updateProduct(editingProductId, productData);
    showToast('Candle updated!', 'success');
  } else {
    addProduct(productData);
    showToast('Candle added!', 'success');
  }

  closeModal('productModal');
  renderProductsTable();
  renderStats();
  populateProductSelect();
}

function deleteProductItem(id) {
  if (confirm('Delete this candle?')) {
    deleteProduct(id);
    renderProductsTable();
    renderStats();
    populateProductSelect();
    showToast('Candle deleted', 'info');
  }
}

// Combo Management
function renderCombosTable() {
  const tbody = document.getElementById('combosTableBody');
  const combos = getAllCombos();

  if (!tbody) return;

  if (combos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:40px;">No combos. Create your first bundle!</td></tr>';
    return;
  }

  tbody.innerHTML = combos.map(c => {
    const comboData = getComboWithProducts(c.id);
    const productNames = comboData?.productDetails?.map(p => p.name).join(', ') || 'N/A';
    const savings = c.originalPrice - c.comboPrice;

    return `
            <tr>
                <td><strong>${c.name}</strong></td>
                <td><small>${productNames}</small></td>
                <td>${formatPrice(c.comboPrice)}<br><small style="text-decoration:line-through;color:#888">${formatPrice(c.originalPrice)}</small></td>
                <td><span style="background:#27AE60;color:white;padding:3px 8px;border-radius:10px;font-size:0.8rem;">Save ${formatPrice(savings)}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn edit" onclick="editCombo(${c.id})">✏️</button>
                        <button class="action-btn delete" onclick="deleteComboItem(${c.id})">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
  }).join('');
}

function populateProductSelect() {
  const select = document.getElementById('comboProducts');
  const products = getAllProducts();
  if (!select) return;

  select.innerHTML = products.map(p => `<option value="${p.id}">${p.name} - ${formatPrice(p.price)}</option>`).join('');
}

function openComboModal(comboId = null) {
  editingComboId = comboId;
  selectedComboProducts = [];
  const modal = document.getElementById('comboModal');
  const title = document.getElementById('comboModalTitle');
  const form = document.getElementById('comboForm');

  form.reset();
  updateSelectedProducts();

  if (comboId) {
    const combo = getComboById(comboId);
    if (combo) {
      title.textContent = 'Edit Combo';
      document.getElementById('comboName').value = combo.name;
      document.getElementById('comboDescription').value = combo.description;
      document.getElementById('comboPrice').value = combo.comboPrice;
      selectedComboProducts = [...combo.products];
      updateSelectedProducts();
    }
  } else {
    title.textContent = 'Create New Combo';
  }

  modal.classList.add('active');
}

function editCombo(id) {
  openComboModal(id);
}

function addProductToCombo() {
  const select = document.getElementById('comboProducts');
  const productId = parseInt(select.value);
  if (!selectedComboProducts.includes(productId)) {
    selectedComboProducts.push(productId);
    updateSelectedProducts();
  }
}

function removeProductFromCombo(productId) {
  selectedComboProducts = selectedComboProducts.filter(id => id !== productId);
  updateSelectedProducts();
}

function updateSelectedProducts() {
  const container = document.getElementById('selectedProducts');
  const originalPriceEl = document.getElementById('comboOriginalPrice');
  if (!container) return;

  const products = selectedComboProducts.map(id => getProductById(id)).filter(p => p);
  const totalOriginal = products.reduce((sum, p) => sum + p.price, 0);

  if (originalPriceEl) originalPriceEl.textContent = formatPrice(totalOriginal);

  container.innerHTML = products.length === 0
    ? '<p style="color:#888;font-style:italic;">No products selected</p>'
    : products.map(p => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:#f5f5f5;border-radius:8px;margin-bottom:5px;">
                <span>${p.name} - ${formatPrice(p.price)}</span>
                <button type="button" onclick="removeProductFromCombo(${p.id})" style="background:none;border:none;color:#E74C3C;cursor:pointer;font-size:1.2rem;">×</button>
            </div>
        `).join('');
}

function saveCombo() {
  const name = document.getElementById('comboName').value.trim();
  const description = document.getElementById('comboDescription').value.trim();
  const comboPrice = parseInt(document.getElementById('comboPrice').value);

  if (!name || !comboPrice || selectedComboProducts.length < 2) {
    showToast('Need name, price, and at least 2 products', 'error');
    return;
  }

  const products = selectedComboProducts.map(id => getProductById(id)).filter(p => p);
  const originalPrice = products.reduce((sum, p) => sum + p.price, 0);

  const comboData = { name, description, products: selectedComboProducts, originalPrice, comboPrice };

  if (editingComboId) {
    updateCombo(editingComboId, comboData);
    showToast('Combo updated!', 'success');
  } else {
    addCombo(comboData);
    showToast('Combo created!', 'success');
  }

  closeModal('comboModal');
  renderCombosTable();
  renderStats();
}

function deleteComboItem(id) {
  if (confirm('Delete this combo?')) {
    deleteCombo(id);
    renderCombosTable();
    renderStats();
    showToast('Combo deleted', 'info');
  }
}

function closeModal(modalId) {
  document.getElementById(modalId)?.classList.remove('active');
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
});

function previewImage() {
  const url = document.getElementById('productImageUrl').value;
  const preview = document.getElementById('imagePreview');
  if (url) {
    preview.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<p>Invalid URL</p>'">`;
  }
}
