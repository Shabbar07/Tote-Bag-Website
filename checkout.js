// Checkout Management System
class CheckoutManager {
    constructor() {
        this.currentStep = 1;
        this.formData = {
            shipping: {},
            payment: {}
        };
        this.init();
    }

    init() {
        this.loadOrderSummary();
        this.initializeFormValidation();
        this.initializePaymentMethods();
        this.initializeCardFormatting();
        this.updateProgressBar();
    }

    // Load order summary from cart
    loadOrderSummary() {
        if (typeof cart !== 'undefined') {
            cart.updateCartSummary();
        }
    }

    // Initialize form validation
    initializeFormValidation() {
        // Shipping form validation
        const shippingForm = document.getElementById('shippingForm');
        if (shippingForm) {
            this.addFormValidation(shippingForm);
        }

        // Payment form validation
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            this.addFormValidation(paymentForm);
        }
    }

    // Add real-time validation to forms
    addFormValidation(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        // Required field check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // Card number validation
        if (field.id === 'cardNumber' && value) {
            const cardNumber = value.replace(/\s/g, '');
            if (cardNumber.length < 13 || cardNumber.length > 19) {
                isValid = false;
                errorMessage = 'Please enter a valid card number';
            }
        }

        // Card expiry validation
        if (field.id === 'cardExpiry' && value) {
            const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            if (!expiryRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid expiry date (MM/YY)';
            } else {
                // Check if card is not expired
                const [month, year] = value.split('/');
                const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
                const now = new Date();
                if (expiry < now) {
                    isValid = false;
                    errorMessage = 'Card has expired';
                }
            }
        }

        // CVV validation
        if (field.id === 'cardCvv' && value) {
            if (value.length < 3 || value.length > 4) {
                isValid = false;
                errorMessage = 'Please enter a valid CVV';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    // Show field error
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    // Clear field error
    clearFieldError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Initialize payment method selection
    initializePaymentMethods() {
        const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
        paymentOptions.forEach(option => {
            option.addEventListener('change', (e) => {
                this.handlePaymentMethodChange(e.target.value);
            });
        });
    }

    // Handle payment method change
    handlePaymentMethodChange(method) {
        const paymentForm = document.querySelector('.payment-form');
        
        switch (method) {
            case 'credit':
                paymentForm.style.display = 'block';
                break;
            case 'paypal':
                paymentForm.style.display = 'none';
                break;
            case 'upi':
                paymentForm.style.display = 'none';
                break;
        }
    }

    // Initialize card number formatting
    initializeCardFormatting() {
        const cardNumber = document.getElementById('cardNumber');
        const cardExpiry = document.getElementById('cardExpiry');
        const cardCvv = document.getElementById('cardCvv');

        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '');
                let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
                if (formattedValue.length > 19) {
                    formattedValue = formattedValue.substr(0, 19);
                }
                e.target.value = formattedValue;
            });
        }

        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        if (cardCvv) {
            cardCvv.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
            });
        }
    }

    // Validate entire form
    validateForm(form) {
        const fields = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Update progress bar
    updateProgressBar() {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            if (index < this.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === this.currentStep - 1) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    // Save shipping information
    saveShippingInfo() {
        const form = document.getElementById('shippingForm');
        const formData = new FormData(form);
        
        this.formData.shipping = {
            firstName: formData.get('firstName') || document.getElementById('firstName')?.value,
            lastName: formData.get('lastName') || document.getElementById('lastName')?.value,
            email: formData.get('email') || document.getElementById('email')?.value,
            phone: formData.get('phone') || document.getElementById('phone')?.value,
            address: formData.get('address') || document.getElementById('address')?.value,
            city: formData.get('city') || document.getElementById('city')?.value,
            state: formData.get('state') || document.getElementById('state')?.value,
            postalCode: formData.get('postalCode') || document.getElementById('postalCode')?.value,
            country: formData.get('country') || document.getElementById('country')?.value
        };
    }

    // Generate order ID
    generateOrderId() {
        return 'TS' + Date.now().toString().substr(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
    }

    // Complete order
    completeOrder() {
        // Save order to localStorage (in real app, send to server)
        const orderId = this.generateOrderId();
        const orderData = {
            id: orderId,
            items: cart.getCartItems(),
            shipping: this.formData.shipping,
            total: cart.getCartTotal(),
            date: new Date().toISOString(),
            status: 'confirmed'
        };

        // Save order
        const orders = JSON.parse(localStorage.getItem('toteStoreOrders') || '[]');
        orders.push(orderData);
        localStorage.setItem('toteStoreOrders', JSON.stringify(orders));

        // Clear cart
        cart.clearCart();

        // Show success modal
        this.showSuccessModal(orderId);
    }

    // Show success modal
    showSuccessModal(orderId) {
        const modal = document.getElementById('successModal');
        const orderIdElement = document.getElementById('orderId');
        
        if (orderIdElement) {
            orderIdElement.textContent = orderId;
        }
        
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Show loading state
    showLoadingState(button, isLoading) {
        if (isLoading) {
            button.dataset.originalText = button.textContent;
            button.textContent = 'Processing...';
            button.disabled = true;
        } else {
            button.textContent = button.dataset.originalText || button.textContent;
            button.disabled = false;
        }
    }
}

// Global checkout instance
const checkout = new CheckoutManager();

// Global functions for checkout flow
function proceedToPayment() {
    const shippingForm = document.getElementById('shippingForm');
    
    if (!checkout.validateForm(shippingForm)) {
        return;
    }

    checkout.saveShippingInfo();
    checkout.currentStep = 2;
    checkout.updateProgressBar();

    // Hide shipping section, show payment section
    document.getElementById('shippingSection').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'block';

    // Scroll to top of payment section
    document.getElementById('paymentSection').scrollIntoView({ behavior: 'smooth' });
}

function backToShipping() {
    checkout.currentStep = 1;
    checkout.updateProgressBar();

    // Show shipping section, hide payment section
    document.getElementById('shippingSection').style.display = 'block';
    document.getElementById('paymentSection').style.display = 'none';

    // Scroll to top of shipping section
    document.getElementById('shippingSection').scrollIntoView({ behavior: 'smooth' });
}

function completeOrder() {
    const paymentForm = document.getElementById('paymentForm');
    const completeBtn = document.querySelector('button[onclick="completeOrder()"]');

    if (!checkout.validateForm(paymentForm)) {
        return;
    }

    // Show loading state
    checkout.showLoadingState(completeBtn, true);

    // Simulate payment processing
    setTimeout(() => {
        checkout.currentStep = 3;
        checkout.updateProgressBar();
        checkout.completeOrder();
        checkout.showLoadingState(completeBtn, false);
    }, 2000);
}

function viewOrderDetails() {
    // In a real app, this would navigate to order details page
    alert('Order details page would open here.');
    
    // Close modal and redirect to home
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    window.location.href = 'index.html';
}

// Initialize checkout when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('checkout.html')) {
        // Check if cart has items
        if (cart.getCartItems().length === 0) {
            alert('Your cart is empty. Please add items before checkout.');
            window.location.href = 'products.html';
            return;
        }
        
        checkout.loadOrderSummary();
    }
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.id === 'successModal') {
        viewOrderDetails();
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CheckoutManager;
} 