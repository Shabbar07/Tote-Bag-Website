// Cart Management System
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    init() {
        this.updateCartCount();
        this.updateCartDisplay();
        
        // Add event listeners for cart operations
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                this.handleAddToCart(e);
            } else if (e.target.classList.contains('remove-item')) {
                this.removeFromCart(e.target.dataset.id);
            } else if (e.target.classList.contains('quantity-btn')) {
                this.updateQuantity(e.target.dataset.id, e.target.dataset.action);
            }
        });

        // Update quantities when input changes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                this.updateQuantity(e.target.dataset.id, 'set', parseInt(e.target.value));
            }
        });
    }

    // Load cart from localStorage
    loadCart() {
        const saved = localStorage.getItem('toteStoreCart');
        return saved ? JSON.parse(saved) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('toteStoreCart', JSON.stringify(this.cart));
    }

    // Add item to cart
    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
        this.showCartNotification('Item added to cart!');
    }

    // Remove item from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
        this.showCartNotification('Item removed from cart!');
    }

    // Update quantity
    updateQuantity(productId, action, value = null) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        switch (action) {
            case 'increase':
                item.quantity += 1;
                break;
            case 'decrease':
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    this.removeFromCart(productId);
                    return;
                }
                break;
            case 'set':
                if (value && value > 0) {
                    item.quantity = value;
                } else {
                    this.removeFromCart(productId);
                    return;
                }
                break;
        }

        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    // Update cart count in header
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElements.forEach(el => el.textContent = totalItems);
    }

    // Handle add to cart button clicks
    handleAddToCart(e) {
        e.preventDefault();
        
        const productCard = e.target.closest('.product-card');
        if (!productCard) return;

        const product = {
            id: productCard.dataset.id || this.generateId(),
            name: productCard.querySelector('h4').textContent,
            price: parseInt(productCard.querySelector('.price').textContent.replace('₹', '')),
            image: productCard.querySelector('img').src
        };

        this.addToCart(product);
        
        // Visual feedback
        const button = e.target;
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 1000);
    }

    // Generate unique ID for products
    generateId() {
        return 'product_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Update cart display on cart page
    updateCartDisplay() {
        const cartContainer = document.getElementById('cartContainer');
        const emptyCart = document.getElementById('emptyCart');
        const cartSummary = document.getElementById('cartSummary');

        if (!cartContainer) return; // Not on cart page

        if (this.cart.length === 0) {
            cartContainer.style.display = 'none';
            emptyCart.style.display = 'block';
            cartSummary.style.display = 'none';
            return;
        }

        cartContainer.style.display = 'block';
        emptyCart.style.display = 'none';
        cartSummary.style.display = 'block';

        // Generate cart items HTML
        cartContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">₹${item.price}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                </div>
                <div class="item-total">
                    <p>₹${item.price * item.quantity}</p>
                </div>
                <div class="item-remove">
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Update summary
        this.updateCartSummary();
    }

    // Update cart summary totals
    updateCartSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 999 ? 0 : 50;
        const tax = Math.round(subtotal * 0.18); // 18% GST
        const total = subtotal + shipping + tax;

        const elements = {
            subtotal: document.getElementById('subtotal'),
            shipping: document.getElementById('shipping'),
            tax: document.getElementById('tax'),
            total: document.getElementById('total')
        };

        if (elements.subtotal) elements.subtotal.textContent = `₹${subtotal}`;
        if (elements.shipping) elements.shipping.textContent = `₹${shipping}`;
        if (elements.tax) elements.tax.textContent = `₹${tax}`;
        if (elements.total) elements.total.textContent = `₹${total}`;

        // Update checkout page elements
        const orderElements = {
            orderSubtotal: document.getElementById('orderSubtotal'),
            orderShipping: document.getElementById('orderShipping'),
            orderTax: document.getElementById('orderTax'),
            orderTotal: document.getElementById('orderTotal')
        };

        if (orderElements.orderSubtotal) orderElements.orderSubtotal.textContent = `₹${subtotal}`;
        if (orderElements.orderShipping) orderElements.orderShipping.textContent = `₹${shipping}`;
        if (orderElements.orderTax) orderElements.orderTax.textContent = `₹${tax}`;
        if (orderElements.orderTotal) orderElements.orderTotal.textContent = `₹${total}`;

        // Update order items on checkout page
        const orderItems = document.getElementById('orderItems');
        if (orderItems) {
            orderItems.innerHTML = this.cart.map(item => `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-item-details">
                        <h4>${item.name}</h4>
                        <p>Qty: ${item.quantity}</p>
                        <p class="order-item-price">₹${item.price * item.quantity}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    // Show cart notification
    showCartNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
    }

    // Apply coupon
    applyCoupon(code) {
        const validCoupons = {
            'WELCOME10': { discount: 10, type: 'percentage' },
            'SAVE50': { discount: 50, type: 'fixed' },
            'FREESHIP': { discount: 0, type: 'shipping' }
        };

        const coupon = validCoupons[code.toUpperCase()];
        if (coupon) {
            // Apply coupon logic here
            this.showCartNotification(`Coupon "${code}" applied successfully!`);
            return true;
        } else {
            this.showCartNotification('Invalid coupon code');
            return false;
        }
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    // Get cart total
    getCartTotal() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 999 ? 0 : 50;
        const tax = Math.round(subtotal * 0.18);
        return subtotal + shipping + tax;
    }

    // Get cart items
    getCartItems() {
        return [...this.cart];
    }
}

// Global cart instance
const cart = new CartManager();

// Global functions for easy access
function openCart() {
    window.location.href = 'cart.html';
}

function applyCoupon() {
    const couponInput = document.getElementById('couponCode');
    if (couponInput) {
        cart.applyCoupon(couponInput.value);
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    // Update cart display if on cart page
    const path = window.location.pathname;
    if (path.includes('cart.html')) {
        cart.updateCartDisplay();
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
} 