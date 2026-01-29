/**
 * Krishna Candles - Data Management
 * Handles LocalStorage CRUD operations and sample data
 */

// ============================================
// LocalStorage Keys
// ============================================
const STORAGE_KEYS = {
    PRODUCTS: 'kanha_glow_products',
    COMBOS: 'kanha_glow_combos',
    CART: 'kanha_glow_cart',
    ORDERS: 'kanha_glow_orders'
};

// ============================================
// Catalog Data - Updated Jan 2025
// ============================================
const sampleProducts = [
    // Daisy Dreams & Glass Artistry - Glass/Jar Candles (80-120g, 15+ hrs)
    {
        id: 1,
        name: "Azure Bloom",
        description: "Fragrant glass jar candle with delicate floral notes. 80-120g, 15+ hours burn time. Best for gifting and decorations.",
        price: 249,
        stock: 50,
        image: "images/blue daisy 2.PNG",
        category: "glass",
        featured: true
    },
    {
        id: 2,
        name: "Blush Petal",
        description: "Scented glass jar candle with soft floral fragrance. 80-120g, 15+ hours burn time. Perfect for gifting.",
        price: 249,
        stock: 45,
        image: "images/pink daisy edit.PNG",
        category: "glass",
        featured: false
    },
    {
        id: 3,
        name: "Pink Glass Bloom",
        description: "Premium fragrant glass candle. Elegant and gift-worthy. 80-120g, 15+ hours burn time.",
        price: 249,
        stock: 40,
        image: "images/pink glass daisy edit 1.PNG",
        category: "glass",
        featured: true
    },
    {
        id: 4,
        name: "Crystal Daisy",
        description: "Scented glass jar candle with delicate daisy design. 80-120g, 15+ hours burn time. Best for decorations.",
        price: 249,
        stock: 35,
        image: "images/glass daisy 1.PNG",
        category: "glass",
        featured: false
    },

    // Sacred Flame - Decor Candles (60-80g, 12+ hrs)
    {
        id: 5,
        name: "Crimson Passion",
        description: "Fragrant decor heart candle symbolizing deep love. 60-80g, 12+ hours burn time. Perfect for gifting.",
        price: 219,
        stock: 60,
        image: "images/buring heart red.PNG",
        category: "sacred",
        featured: true
    },
    {
        id: 6,
        name: "Rose Blush Heart",
        description: "Scented pink heart candle with tender fragrance. 60-80g, 12+ hours burn time. Ideal for loved ones.",
        price: 219,
        stock: 55,
        image: "images/burning heart pink 1.PNG",
        category: "sacred",
        featured: false
    },
    {
        id: 7,
        name: "Pure Devotion",
        description: "Fragrant white heart candle representing pure love. 60-80g, 12+ hours burn time. Elegant and timeless.",
        price: 219,
        stock: 50,
        image: "images/burning heart white.PNG",
        category: "sacred",
        featured: false
    },

    // Bloom Heart - Decor Candles (60-80g, 12+ hrs)
    {
        id: 8,
        name: "Sapphire Blossom",
        description: "Scented floral heart candle for statement gifting. 60-80g, 12+ hours burn time. Best for decorations.",
        price: 249,
        stock: 30,
        image: "images/flower heart blue edit lit.PNG",
        category: "floral",
        featured: false
    },
    {
        id: 9,
        name: "Emerald Garden",
        description: "Fragrant green floral heart candle with calming aroma. 60-80g, 12+ hours burn time. Serene décor.",
        price: 249,
        stock: 30,
        image: "images/flower heart green edit 2.PNG",
        category: "floral",
        featured: false
    },
    {
        id: 10,
        name: "Rosewood Heart",
        description: "Scented floral heart candle with classic romantic appeal. 60-80g, 12+ hours burn time. Ideal gift.",
        price: 249,
        stock: 40,
        image: "images/flower heart pink edit 7.PNG",
        category: "floral",
        featured: true
    },
    {
        id: 11,
        name: "Ruby Petals",
        description: "Fragrant bold floral heart candle for statement moments. 60-80g, 12+ hours burn time.",
        price: 249,
        stock: 35,
        image: "images/flower heart red edit lit.PNG",
        category: "floral",
        featured: false
    },
    {
        id: 12,
        name: "Golden Sunrise",
        description: "Scented yellow floral heart with joyful fragrance. 60-80g, 12+ hours burn time. Spreads positivity.",
        price: 249,
        stock: 25,
        image: "images/flower heart yellow edit.PNG",
        category: "floral",
        featured: false
    },

    // Tower Elegance - Decor Candles (60-80g, 12+ hrs)
    {
        id: 13,
        name: "Blush Tower",
        description: "Fragrant pink tower candle with floral elements. 60-80g, 12+ hours burn time. Artisan masterpiece.",
        price: 249,
        stock: 20,
        image: "images/flower tower pink edit.PNG",
        category: "tower",
        featured: false
    },
    {
        id: 14,
        name: "Scarlet Spire",
        description: "Scented bold red tower candle commanding attention. 60-80g, 12+ hours burn time. Statement piece.",
        price: 249,
        stock: 20,
        image: "images/flower tower red edit 6.PNG",
        category: "tower",
        featured: true
    },
    {
        id: 15,
        name: "Ivory Column",
        description: "Fragrant white tower candle with minimalist elegance. 60-80g, 12+ hours burn time. Timeless beauty.",
        price: 249,
        stock: 25,
        image: "images/flower tower white edit 2.PNG",
        category: "tower",
        featured: false
    },

    // Rosé Shot - Glass (100-120g, 12+ hrs)
    {
        id: 16,
        name: "Rosé Shot",
        description: "Scented glass candle with rose lotus topper and wax flower melts. 100-120g, 12+ hours burn time. Best for gifting.",
        price: 169,
        stock: 100,
        image: "images/rose shot lit edit 1.PNG",
        category: "glass",
        featured: true
    },

    // Velvet Hive - Decor (60-80g, 12+ hrs)
    {
        id: 17,
        name: "Velvet Hive Heart",
        description: "Fragrant sculpted heart-shaped decor candle. 60-80g, 12+ hours burn time. Perfect for celebrations.",
        price: 249,
        stock: 45,
        image: "images/velvet hive lit edit.PNG",
        category: "modern",
        featured: false
    }
];

const sampleCombos = [
    {
        id: 101,
        name: "Duo Lumina",
        description: "Matching pair of 2 scented glass daisy candles. Best for gifting.",
        products: [4, 4],
        originalPrice: 498,
        comboPrice: 449,
        image: "images/glass duo.PNG",
        featured: true
    },
    {
        id: 102,
        name: "Trio Lumina Premium",
        description: "Premium set of 3 fragrant glass candles. Perfect centerpiece.",
        products: [4, 4, 3],
        originalPrice: 747,
        comboPrice: 649,
        image: "images/glass duo lit combo edit.PNG",
        featured: true
    },
    {
        id: 103,
        name: "Trinity Hearts Trio",
        description: "Set of 3 scented burning heart candles in red, pink, and white.",
        products: [5, 6, 7],
        originalPrice: 657,
        comboPrice: 499,
        image: "images/burning heart trio.PNG",
        featured: true
    },
    {
        id: 104,
        name: "Bloom Harmony Set",
        description: "Curated 5-piece collection of fragrant floral heart candles.",
        products: [8, 9, 10, 11, 12],
        originalPrice: 1245,
        comboPrice: 999,
        image: "images/flower heart combo edit 7.PNG",
        featured: false
    },
    {
        id: 105,
        name: "Tower Trinity Set",
        description: "Complete trio of scented tower candles. Architectural display.",
        products: [13, 14, 15],
        originalPrice: 747,
        comboPrice: 599,
        image: "images/flower tower trio edit 4.PNG",
        featured: false
    },
    {
        id: 106,
        name: "Velvet Hive Trio",
        description: "Set of 3 fragrant heart-shaped hive candles in assorted colors.",
        products: [17, 17, 17],
        originalPrice: 1047,
        comboPrice: 699,
        image: "images/velvet hive trio.jpeg",
        featured: false
    }
];

// ============================================
// Data Management Functions
// ============================================

function initializeData() {
    // Force update of product catalog to latest version
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(sampleProducts));
    localStorage.setItem(STORAGE_KEYS.COMBOS, JSON.stringify(sampleCombos));

    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
}

// ============================================
// Product CRUD Operations
// ============================================

function getAllProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
}

function getProductById(id) {
    const products = getAllProducts();
    return products.find(p => p.id === parseInt(id));
}

function addProduct(product) {
    const products = getAllProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    product.id = newId;
    products.push(product);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return product;
}

function updateProduct(id, updatedData) {
    const products = getAllProducts();
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedData };
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return products[index];
    }
    return null;
}

function deleteProduct(id) {
    const products = getAllProducts();
    const filtered = products.filter(p => p.id !== parseInt(id));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    return true;
}

function updateStock(id, change) {
    const products = getAllProducts();
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
        products[index].stock = Math.max(0, products[index].stock + change);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        return products[index].stock;
    }
    return null;
}

// ============================================
// Combo CRUD Operations
// ============================================

function getAllCombos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMBOS)) || [];
}

function getComboById(id) {
    const combos = getAllCombos();
    return combos.find(c => c.id === parseInt(id));
}

function addCombo(combo) {
    const combos = getAllCombos();
    const newId = combos.length > 0 ? Math.max(...combos.map(c => c.id)) + 1 : 1;
    combo.id = newId;
    combos.push(combo);
    localStorage.setItem(STORAGE_KEYS.COMBOS, JSON.stringify(combos));
    return combo;
}

function updateCombo(id, updatedData) {
    const combos = getAllCombos();
    const index = combos.findIndex(c => c.id === parseInt(id));
    if (index !== -1) {
        combos[index] = { ...combos[index], ...updatedData };
        localStorage.setItem(STORAGE_KEYS.COMBOS, JSON.stringify(combos));
        return combos[index];
    }
    return null;
}

function deleteCombo(id) {
    const combos = getAllCombos();
    const filtered = combos.filter(c => c.id !== parseInt(id));
    localStorage.setItem(STORAGE_KEYS.COMBOS, JSON.stringify(filtered));
    return true;
}

function getComboWithProducts(comboId) {
    const combo = getComboById(comboId);
    if (combo) {
        const products = combo.products.map(pid => getProductById(pid)).filter(p => p);
        return { ...combo, productDetails: products };
    }
    return null;
}

// ============================================
// Cart Operations
// ============================================

function getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
}

function addToCart(item) {
    const cart = getCart();
    const existingIndex = cart.findIndex(
        c => c.id === item.id && c.type === item.type && c.customization === item.customization
    );

    if (existingIndex !== -1) {
        cart[existingIndex].quantity += item.quantity || 1;
    } else {
        item.quantity = item.quantity || 1;
        cart.push(item);
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
}

function updateCartItemQuantity(index, quantity) {
    const cart = getCart();
    if (cart[index]) {
        if (quantity <= 0) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = quantity;
        }
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    }
    return cart;
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    return cart;
}

function clearCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    return [];
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// ============================================
// Order Operations
// ============================================

function getAllOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
}

// Generate a proper 6-7 digit order number
function generateOrderNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}

function createOrder(orderData) {
    const orders = getAllOrders();
    const orderId = generateOrderNumber();
    const order = {
        id: orderId,
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    orders.push(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Clear cart after order
    clearCart();

    return order;
}

function updateOrderStatus(id, status) {
    const orders = getAllOrders();
    const index = orders.findIndex(o => o.id === parseInt(id));
    if (index !== -1) {
        orders[index].status = status;
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        return orders[index];
    }
    return null;
}

// ============================================
// Utility Functions
// ============================================

function formatPrice(price) {
    return `₹${price.toLocaleString('en-IN')}`;
}

function getStockStatus(stock) {
    if (stock <= 0) return { class: 'out-of-stock', text: 'Out of Stock' };
    if (stock <= 5) return { class: 'low-stock', text: 'Low Stock' };
    return { class: 'in-stock', text: 'In Stock' };
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ============================================
// Toast Notifications
// ============================================

function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// Initialize on Load
// ============================================
document.addEventListener('DOMContentLoaded', initializeData);
