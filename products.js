// Products Page Management
class ProductsManager {
    constructor() {
        this.products = this.getProductData();
        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.init();
    }

    init() {
        this.renderProducts();
        this.initializeFilters();
        this.initializeSearch();
        this.updateLoadMoreButton();
    }

    // Product data - in a real app, this would come from an API
    getProductData() {
        return [
            {
                id: 'tote_001',
                name: 'Designed Tote Bag',
                price: 299,
                category: 'designed',
                image: 'product-1.jpg',
                rating: 4.5,
                reviews: 128,
                description: 'Beautiful designed tote bag perfect for everyday use.',
                colors: ['black', 'brown', 'beige'],
                inStock: true
            },
            {
                id: 'tote_002',
                name: 'Painted Tote Bag',
                price: 449,
                category: 'painted',
                image: 'product-2.jpg',
                rating: 4.7,
                reviews: 95,
                description: 'Hand-painted artistic tote bag with unique patterns.',
                colors: ['multicolor', 'blue', 'red'],
                inStock: true
            },
            {
                id: 'tote_003',
                name: 'Handcrafted Tote Bag',
                price: 399,
                category: 'handcrafted',
                image: 'product-3.jpg',
                rating: 4.8,
                reviews: 203,
                description: 'Carefully handcrafted tote bag with premium materials.',
                colors: ['natural', 'brown', 'black'],
                inStock: true
            },
            {
                id: 'tote_004',
                name: 'Printed Tote Bag',
                price: 349,
                category: 'printed',
                image: 'product-4.jpg',
                rating: 4.3,
                reviews: 167,
                description: 'Modern printed design on high-quality canvas.',
                colors: ['white', 'black', 'grey'],
                inStock: true
            },
            {
                id: 'tote_005',
                name: 'Vintage Canvas Tote',
                price: 499,
                category: 'designed',
                image: 'product-1.jpg',
                rating: 4.6,
                reviews: 89,
                description: 'Vintage-style canvas tote with leather handles.',
                colors: ['olive', 'navy', 'khaki'],
                inStock: true
            },
            {
                id: 'tote_006',
                name: 'Floral Painted Tote',
                price: 529,
                category: 'painted',
                image: 'product-2.jpg',
                rating: 4.9,
                reviews: 142,
                description: 'Beautiful floral patterns hand-painted by local artists.',
                colors: ['pink', 'purple', 'yellow'],
                inStock: false
            },
            {
                id: 'tote_007',
                name: 'Eco-Friendly Jute Tote',
                price: 279,
                category: 'handcrafted',
                image: 'product-3.jpg',
                rating: 4.4,
                reviews: 198,
                description: 'Sustainable jute tote bag with organic cotton lining.',
                colors: ['natural', 'green', 'brown'],
                inStock: true
            },
            {
                id: 'tote_008',
                name: 'Geometric Print Tote',
                price: 379,
                category: 'printed',
                image: 'product-4.jpg',
                rating: 4.5,
                reviews: 156,
                description: 'Modern geometric patterns in bold colors.',
                colors: ['black', 'white', 'multicolor'],
                inStock: true
            },
            {
                id: 'tote_009',
                name: 'Minimalist Leather Tote',
                price: 699,
                category: 'designed',
                image: 'product-1.jpg',
                rating: 4.8,
                reviews: 243,
                description: 'Premium leather tote with minimalist design.',
                colors: ['black', 'brown', 'tan'],
                inStock: true
            },
            {
                id: 'tote_010',
                name: 'Abstract Art Tote',
                price: 459,
                category: 'painted',
                image: 'product-2.jpg',
                rating: 4.6,
                reviews: 178,
                description: 'Unique abstract art designs created by emerging artists.',
                colors: ['multicolor', 'blue', 'red'],
                inStock: true
            },
            {
                id: 'tote_011',
                name: 'Woven Bamboo Tote',
                price: 599,
                category: 'handcrafted',
                image: 'product-3.jpg',
                rating: 4.7,
                reviews: 134,
                description: 'Handwoven bamboo tote with traditional techniques.',
                colors: ['natural', 'brown'],
                inStock: true
            },
            {
                id: 'tote_012',
                name: 'Typography Tote',
                price: 329,
                category: 'printed',
                image: 'product-4.jpg',
                rating: 4.2,
                reviews: 187,
                description: 'Inspirational quotes and typography designs.',
                colors: ['black', 'white', 'grey'],
                inStock: true
            }
        ];
    }

    // Render products to the grid
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        const startIndex = 0;
        const endIndex = this.currentPage * this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (this.currentPage === 1) {
            productsGrid.innerHTML = '';
        }

        productsToShow.forEach(product => {
            const productHTML = this.createProductCard(product);
            productsGrid.insertAdjacentHTML('beforeend', productHTML);
        });

        // Trigger animation
        setTimeout(() => {
            const newCards = productsGrid.querySelectorAll('.product-card:not(.animated)');
            newCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animated');
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 50);
    }

    // Create product card HTML
    createProductCard(product) {
        const stockStatus = product.inStock ? '' : '<div class="out-of-stock">Out of Stock</div>';
        const addToCartButton = product.inStock 
            ? `<button class="add-to-cart" data-id="${product.id}">Add to Cart</button>`
            : `<button class="add-to-cart" disabled>Out of Stock</button>`;

        return `
            <div class="col-4">
                <div class="product-card" data-id="${product.id}" style="opacity: 0; transform: translateY(20px);">
                    ${stockStatus}
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-overlay">
                            <button class="quick-view-btn" onclick="showQuickView('${product.id}')">
                                <i class="fas fa-eye"></i> Quick View
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <div class="product-rating">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                            <span class="rating-count">(${product.reviews})</span>
                        </div>
                        <p class="price">₹${product.price}</p>
                        <div class="product-colors">
                            ${product.colors.map(color => `<span class="color-dot ${color}" title="${color}"></span>`).join('')}
                        </div>
                        ${addToCartButton}
                    </div>
                </div>
            </div>
        `;
    }

    // Initialize search functionality
    initializeSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filterProducts();
            }, 300);
        });
    }

    // Initialize filter controls
    initializeFilters() {
        // Sort by dropdown
        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', () => this.filterProducts());
        }

        // Category filter
        const filterCategory = document.getElementById('filterCategory');
        if (filterCategory) {
            filterCategory.addEventListener('change', () => this.filterProducts());
        }

        // Price range filter
        const priceRange = document.getElementById('priceRange');
        const priceValue = document.getElementById('priceValue');
        if (priceRange && priceValue) {
            priceRange.addEventListener('input', (e) => {
                priceValue.textContent = e.target.value;
                this.filterProducts();
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreProducts());
        }
    }

    // Filter and sort products
    filterProducts() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const sortBy = document.getElementById('sortBy')?.value || 'featured';
        const category = document.getElementById('filterCategory')?.value || 'all';
        const maxPrice = parseInt(document.getElementById('priceRange')?.value || '1000');

        // Filter products
        this.filteredProducts = this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || product.category === category;
            const matchesPrice = product.price <= maxPrice;

            return matchesSearch && matchesCategory && matchesPrice;
        });

        // Sort products
        this.sortProducts(sortBy);

        // Reset pagination and render
        this.currentPage = 1;
        this.renderProducts();
        this.updateLoadMoreButton();
        this.showLoadingOverlay(false);
    }

    // Sort products based on criteria
    sortProducts(criteria) {
        switch (criteria) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'featured':
            default:
                // Keep original order or sort by some featured criteria
                break;
        }
    }

    // Load more products
    loadMoreProducts() {
        this.showLoadingOverlay(true);
        
        setTimeout(() => {
            this.currentPage++;
            this.renderProducts();
            this.updateLoadMoreButton();
            this.showLoadingOverlay(false);
        }, 1000);
    }

    // Update load more button visibility
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;

        const totalShown = this.currentPage * this.productsPerPage;
        const hasMore = totalShown < this.filteredProducts.length;

        loadMoreBtn.style.display = hasMore ? 'block' : 'none';
        
        if (hasMore) {
            const remaining = this.filteredProducts.length - totalShown;
            loadMoreBtn.textContent = `Load More (${remaining} remaining)`;
        }
    }

    // Show/hide loading overlay
    showLoadingOverlay(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    // Get product by ID
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }
}

// Quick view modal functionality
function showQuickView(productId) {
    const product = productsManager.getProductById(productId);
    if (!product) return;

    // Create modal HTML
    const modalHTML = `
        <div class="quick-view-modal" id="quickViewModal">
            <div class="modal-content">
                <button class="close-modal" onclick="closeQuickView()">
                    <i class="fas fa-times"></i>
                </button>
                <div class="quick-view-content">
                    <div class="quick-view-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="quick-view-details">
                        <h2>${product.name}</h2>
                        <div class="product-rating">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                            <span class="rating-count">(${product.reviews} reviews)</span>
                        </div>
                        <p class="price">₹${product.price}</p>
                        <p class="description">${product.description}</p>
                        <div class="color-selection">
                            <h4>Available Colors:</h4>
                            <div class="color-options">
                                ${product.colors.map(color => `
                                    <label class="color-option">
                                        <input type="radio" name="color" value="${color}">
                                        <span class="color-dot ${color}" title="${color}"></span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        <div class="quick-view-actions">
                            <button class="add-to-cart btn" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                                ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button class="btn-secondary" onclick="viewProductDetails('${product.id}')">
                                View Full Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal with animation
    setTimeout(() => {
        document.getElementById('quickViewModal').classList.add('show');
    }, 10);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    }
}

function viewProductDetails(productId) {
    // In a real app, this would navigate to a detailed product page
    closeQuickView();
    alert(`Product details page for ${productId} would open here.`);
}

// Initialize products manager
let productsManager;

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('/tote-bag-shop/products')) {
        productsManager = new ProductsManager();
    }
});

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-view-modal')) {
        closeQuickView();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeQuickView();
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductsManager;
} 