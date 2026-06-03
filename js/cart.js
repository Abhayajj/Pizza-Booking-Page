// cart.js - Global Pizzeria Cart & Customizer Manager

// Global State
let cart = [];
let currentPizza = null; // Holds the pizza currently being customized
let activePromo = null; // Active coupon details { code, type, value }

// Promo Codes Database
const PROMO_CODES = {
    'PIZZALOVER': { type: 'percent', value: 15 },
    'GUPTA50': { type: 'percent', value: 50 },
    'FREECOKE': { type: 'flat', value: 3.00 }
};

document.addEventListener('DOMContentLoaded', () => {
    // Load Cart from LocalStorage
    loadCart();
    
    // Bind global UI elements
    bindUIEvents();
    
    // Initial Cart Render
    renderCart();
});

// Load cart from LocalStorage
function loadCart() {
    const savedCart = localStorage.getItem('pizzeria-cart');
    const savedPromo = localStorage.getItem('pizzeria-promo');
    
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
    
    if (savedPromo) {
        try {
            activePromo = JSON.parse(savedPromo);
            const promoInput = document.getElementById('promo-code-input');
            if (promoInput) promoInput.value = activePromo.code;
        } catch (e) {
            activePromo = null;
        }
    }
}

// Save cart to LocalStorage
function saveCart() {
    localStorage.setItem('pizzeria-cart', JSON.stringify(cart));
    if (activePromo) {
        localStorage.setItem('pizzeria-promo', JSON.stringify(activePromo));
    } else {
        localStorage.removeItem('pizzeria-promo');
    }
    
    // Broadcast cart change event (in case multiple tabs are open)
    window.dispatchEvent(new Event('storage'));
}

// Bind event listeners to UI components
function bindUIEvents() {
    // Cart Drawer Toggle
    const cartToggleBtn = document.getElementById('cart-toggle');
    const cartCloseBtn = document.getElementById('cart-close');
    const cartDrawer = document.getElementById('cart-drawer-panel');
    
    if (cartToggleBtn && cartDrawer) {
        cartToggleBtn.addEventListener('click', () => {
            cartDrawer.classList.toggle('active');
        });
    }
    
    if (cartCloseBtn && cartDrawer) {
        cartCloseBtn.addEventListener('click', () => {
            cartDrawer.classList.remove('active');
        });
    }
    
    // Close cart drawer if user clicks outside of it
    document.addEventListener('click', (e) => {
        if (cartDrawer && cartDrawer.classList.contains('active')) {
            if (!cartDrawer.contains(e.target) && e.target !== cartToggleBtn && !cartToggleBtn.contains(e.target) && !e.target.classList.contains('qty-btn') && !e.target.classList.contains('cart-item-remove')) {
                cartDrawer.classList.remove('active');
            }
        }
    });

    // Add Direct Button Click Listeners (on Menu pages)
    const addDirectBtns = document.querySelectorAll('.add-to-cart-direct-btn');
    addDirectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const img = btn.getAttribute('data-img');
            
            // Direct adds are Medium Size & Classic Crust with no toppings
            const directItem = {
                id: id,
                name: name,
                basePrice: price,
                price: price + 2.00, // Medium size adds $2.00 by default in customizer
                img: img,
                size: 'Medium',
                crust: 'Classic Hand-Tossed',
                toppings: [],
                quantity: 1
            };
            
            addItemToCart(directItem);
        });
    });

    // Customize Button Click Listeners
    const customizeBtns = document.querySelectorAll('.customize-pizza-btn');
    customizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const img = btn.getAttribute('data-img');
            const desc = btn.getAttribute('data-desc');
            
            openCustomizerModal({ id, name, price, img, desc });
        });
    });

    // Customizer Modal Closing
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalOverlay = document.getElementById('pizza-customizer-modal');
    if (modalCloseBtn && modalOverlay) {
        modalCloseBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    // Modal Live Price Calculation Bindings
    const sizeRadios = document.querySelectorAll('input[name="pizza-size"]');
    const crustRadios = document.querySelectorAll('input[name="pizza-crust"]');
    const toppingCheckboxes = document.querySelectorAll('#toppings-selector-group input[type="checkbox"]');
    
    sizeRadios.forEach(radio => radio.addEventListener('change', calculateModalPrice));
    crustRadios.forEach(radio => radio.addEventListener('change', calculateModalPrice));
    toppingCheckboxes.forEach(cb => cb.addEventListener('change', calculateModalPrice));

    // Modal Add To Cart Click
    const modalAddBtn = document.getElementById('modal-add-to-cart-btn');
    if (modalAddBtn) {
        modalAddBtn.addEventListener('click', () => {
            if (!currentPizza) return;
            
            const selectedSizeRadio = document.querySelector('input[name="pizza-size"]:checked');
            const selectedCrustRadio = document.querySelector('input[name="pizza-crust"]:checked');
            
            const size = selectedSizeRadio.value;
            const crust = selectedCrustRadio.value;
            
            const toppings = [];
            document.querySelectorAll('#toppings-selector-group input[type="checkbox"]:checked').forEach(cb => {
                toppings.push(cb.value);
            });
            
            const finalPrice = parseFloat(document.getElementById('modal-price-amount').textContent.replace('$', ''));
            
            const customizedItem = {
                id: currentPizza.id,
                name: currentPizza.name,
                basePrice: currentPizza.price,
                price: finalPrice,
                img: currentPizza.img,
                size: size,
                crust: crust,
                toppings: toppings,
                quantity: 1
            };
            
            addItemToCart(customizedItem);
            
            // Close modal
            if (modalOverlay) modalOverlay.classList.remove('active');
        });
    }

    // Apply Promo Button
    const promoApplyBtn = document.getElementById('promo-apply-btn');
    const promoInput = document.getElementById('promo-code-input');
    if (promoApplyBtn && promoInput) {
        promoApplyBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toUpperCase();
            applyPromoCode(code);
        });
    }

    // Storage Event Listener to sync cart across pages/tabs
    window.addEventListener('storage', () => {
        loadCart();
        renderCart();
    });
}

// Open and configure Customizer Modal
function openCustomizerModal(pizza) {
    currentPizza = pizza;
    
    const modalOverlay = document.getElementById('pizza-customizer-modal');
    const modalImg = document.getElementById('modal-pizza-image');
    const modalTitle = document.getElementById('modal-pizza-title');
    const modalDesc = document.getElementById('modal-pizza-description');
    
    if (modalImg) modalImg.src = pizza.img;
    if (modalTitle) modalTitle.textContent = pizza.name;
    if (modalDesc) modalDesc.textContent = pizza.desc;
    
    // Reset selections to default (Medium size, Classic crust, no toppings)
    const sizeMedium = document.getElementById('size-medium');
    const crustClassic = document.getElementById('crust-classic');
    if (sizeMedium) sizeMedium.checked = true;
    if (crustClassic) crustClassic.checked = true;
    
    const toppings = document.querySelectorAll('#toppings-selector-group input[type="checkbox"]');
    toppings.forEach(cb => cb.checked = false);
    
    calculateModalPrice();
    
    if (modalOverlay) {
        modalOverlay.classList.add('active');
    }
}

// Calculate the item price inside the customizer modal in real time
function calculateModalPrice() {
    if (!currentPizza) return;
    
    const selectedSizeRadio = document.querySelector('input[name="pizza-size"]:checked');
    const selectedCrustRadio = document.querySelector('input[name="pizza-crust"]:checked');
    const toppingCheckboxes = document.querySelectorAll('#toppings-selector-group input[type="checkbox"]:checked');
    
    const sizeAdd = selectedSizeRadio ? parseFloat(selectedSizeRadio.getAttribute('data-add')) : 0;
    const crustAdd = selectedCrustRadio ? parseFloat(selectedCrustRadio.getAttribute('data-add')) : 0;
    
    let toppingsAdd = 0;
    toppingCheckboxes.forEach(cb => {
        toppingsAdd += parseFloat(cb.getAttribute('data-price'));
    });
    
    const total = currentPizza.price + sizeAdd + crustAdd + toppingsAdd;
    const priceDisplay = document.getElementById('modal-price-amount');
    if (priceDisplay) {
        priceDisplay.textContent = `$${total.toFixed(2)}`;
    }
}

// Generate unique key for distinct cart entries (allowing same pizza with different crust/toppings)
function getCartItemKey(item) {
    const sortedToppings = [...item.toppings].sort().join(',');
    return `${item.id}_${item.size}_${item.crust}_${sortedToppings}`;
}

// Add item to cart and show Toast
function addItemToCart(newItem) {
    const key = getCartItemKey(newItem);
    
    // Check if configuration already exists in cart
    const existingIndex = cart.findIndex(item => getCartItemKey(item) === key);
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push(newItem);
    }
    
    saveCart();
    renderCart();
    
    // Show Toast
    showToast(`🍕 Added ${newItem.name} (${newItem.size}) to cart!`, 'success');
    
    // Automatically open the cart drawer to show the user
    const cartDrawer = document.getElementById('cart-drawer-panel');
    if (cartDrawer) cartDrawer.classList.add('active');
}

// Update item quantity
function updateItemQty(key, amount) {
    const index = cart.findIndex(item => getCartItemKey(item) === key);
    if (index > -1) {
        cart[index].quantity += amount;
        if (cart[index].quantity <= 0) {
            const name = cart[index].name;
            cart.splice(index, 1);
            showToast(`🗑️ Removed ${name} from cart.`, 'info');
        }
        saveCart();
        renderCart();
    }
}

// Remove item from cart completely
function removeItemFromCart(key) {
    const index = cart.findIndex(item => getCartItemKey(item) === key);
    if (index > -1) {
        const name = cart[index].name;
        cart.splice(index, 1);
        saveCart();
        renderCart();
        showToast(`🗑️ Removed ${name} from cart.`, 'info');
    }
}

// Validate and apply promo code
function applyPromoCode(code) {
    const msgDiv = document.getElementById('promo-msg');
    if (!msgDiv) return;
    
    msgDiv.style.display = 'block';
    
    if (code === '') {
        activePromo = null;
        msgDiv.className = 'promo-feedback';
        msgDiv.style.display = 'none';
        saveCart();
        renderCart();
        return;
    }
    
    if (PROMO_CODES[code]) {
        const promo = PROMO_CODES[code];
        activePromo = {
            code: code,
            type: promo.type,
            value: promo.value
        };
        msgDiv.className = 'promo-feedback promo-success';
        msgDiv.textContent = `Promo code applied successfully!`;
        saveCart();
        renderCart();
        showToast(`🎉 Coupon ${code} applied!`, 'success');
    } else {
        msgDiv.className = 'promo-feedback promo-error';
        msgDiv.textContent = `Invalid promo code.`;
        activePromo = null;
        saveCart();
        renderCart();
    }
}

// Show micro-interactions toast notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'info';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'alert-triangle';
    if (type === 'info') icon = 'info';
    
    toast.innerHTML = `
        <i data-lucide="${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();
    
    // Auto remove toast
    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}

// Re-render the side drawer cart contents and sum up prices
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartBadgeCount = document.getElementById('cart-badge-count');
    
    // Cart Summary nodes
    const subtotalNode = document.getElementById('cart-subtotal');
    const discountRow = document.getElementById('discount-row');
    const discountPct = document.getElementById('discount-pct');
    const discountValNode = document.getElementById('cart-discount');
    const taxNode = document.getElementById('cart-tax');
    const totalNode = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-action-btn');
    
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    let totalItemsCount = 0;
    let subtotal = 0;
    
    if (cart.length === 0) {
        // Render Empty Cart View
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i data-lucide="shopping-basket"></i>
                <p>Your cart is empty.<br>Start adding some hot pizzas!</p>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        
        if (cartBadgeCount) cartBadgeCount.style.display = 'none';
        if (subtotalNode) subtotalNode.textContent = '$0.00';
        if (discountRow) discountRow.style.display = 'none';
        if (taxNode) taxNode.textContent = '$0.00';
        if (totalNode) totalNode.textContent = '$0.00';
        if (checkoutBtn) {
            checkoutBtn.classList.add('disabled');
            checkoutBtn.style.opacity = '0.5';
            checkoutBtn.style.pointerEvents = 'none';
        }
        return;
    }
    
    // Enable checkout button
    if (checkoutBtn) {
        checkoutBtn.classList.remove('disabled');
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.pointerEvents = 'auto';
    }
    
    // Populate items
    cart.forEach(item => {
        totalItemsCount += item.quantity;
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const key = getCartItemKey(item);
        
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        
        const customizations = [];
        customizations.push(`Size: ${item.size}`);
        customizations.push(`Crust: ${item.crust}`);
        if (item.toppings.length > 0) {
            customizations.push(`Toppings: ${item.toppings.join(', ')}`);
        }
        
        cartItemEl.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-customizations">${customizations.join('<br>')}</div>
                <div class="cart-item-row">
                    <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
                    <div class="qty-selector">
                        <button class="qty-btn qty-minus" data-key="${key}">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn qty-plus" data-key="${key}">+</button>
                    </div>
                    <button class="cart-item-remove" data-key="${key}" aria-label="Remove Item">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemEl);
    });
    
    if (window.lucide) window.lucide.createIcons();
    
    // Add Click listeners inside cart
    document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            updateItemQty(btn.getAttribute('data-key'), -1);
        });
    });
    document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            updateItemQty(btn.getAttribute('data-key'), 1);
        });
    });
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            removeItemFromCart(btn.getAttribute('data-key'));
        });
    });
    
    // Update Badge Count
    if (cartBadgeCount) {
        cartBadgeCount.textContent = totalItemsCount;
        cartBadgeCount.style.display = 'flex';
        // Add bounce micro-animation
        cartBadgeCount.style.animation = 'none';
        setTimeout(() => {
            cartBadgeCount.style.animation = 'scaleUp 0.3s';
        }, 10);
    }
    
    // Calculate discounts
    let discount = 0;
    if (activePromo) {
        if (activePromo.type === 'percent') {
            discount = subtotal * (activePromo.value / 100);
            if (discountPct) discountPct.textContent = `${activePromo.value}%`;
        } else if (activePromo.type === 'flat') {
            discount = Math.min(activePromo.value, subtotal);
            if (discountPct) discountPct.textContent = 'Flat Discount';
        }
        
        if (discountRow) discountRow.style.display = 'flex';
        if (discountValNode) discountValNode.textContent = `-$${discount.toFixed(2)}`;
    } else {
        if (discountRow) discountRow.style.display = 'none';
    }
    
    // Calculate Tax & Final Total
    const tax = (subtotal - discount) * 0.18;
    const finalTotal = subtotal - discount + tax;
    
    if (subtotalNode) subtotalNode.textContent = `$${subtotal.toFixed(2)}`;
    if (taxNode) taxNode.textContent = `$${tax.toFixed(2)}`;
    if (totalNode) totalNode.textContent = `$${finalTotal.toFixed(2)}`;
}
