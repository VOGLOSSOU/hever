// Sample product data
const products = [
    { id: 1, name: 'Pagne Wax Coloré', category: 'pagnes', price: 25, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', date: '2023-10-01' },
    { id: 2, name: 'Chaussures de Sport', category: 'chaussures', price: 50, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', date: '2023-09-15' },
    { id: 3, name: 'T-Shirt Blanc', category: 'habits', price: 15, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', date: '2023-11-20' },
    { id: 4, name: 'Complet Classique', category: 'complets', price: 100, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', date: '2023-08-10' },
    { id: 5, name: 'Sac à Main', category: 'autres', price: 30, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', date: '2023-12-05' },
    { id: 6, name: 'Pagne Traditionnel', category: 'pagnes', price: 30, image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', date: '2023-07-22' },
    { id: 7, name: 'Bottes en Cuir', category: 'chaussures', price: 60, image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', date: '2023-11-30' },
    { id: 8, name: 'Robe d\'Été', category: 'habits', price: 40, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', date: '2023-10-18' },
    { id: 9, name: 'Costume Complet', category: 'complets', price: 120, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', date: '2023-09-28' },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'all';
let searchTerm = '';
let sortBy = 'recent';

// Categories
const categories = [
    { id: 'pagnes', name: 'Pagnes', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { id: 'chaussures', name: 'Chaussures', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { id: 'habits', name: 'Habits', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { id: 'complets', name: 'Complets', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
    { id: 'autres', name: 'Autres', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
];

// DOM elements
const productGrid = document.getElementById('product-grid');
const categoryGrid = document.getElementById('category-grid');
const cartCount = document.getElementById('cart-count');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayCategories();
    displayProducts();
    setupEventListeners();
});

function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    categoryFilter.addEventListener('change', handleFilter);
    sortFilter.addEventListener('change', handleSort);
}

function displayCategories() {
    categoryGrid.innerHTML = '';
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1 category-card';
        categoryCard.dataset.category = category.id;
        categoryCard.innerHTML = `
            <img src="${category.image}" alt="${category.name}" class="w-full h-32 object-cover">
            <div class="p-4 text-center">
                <h3 class="text-lg font-semibold text-black">${category.name}</h3>
            </div>
        `;
        categoryGrid.appendChild(categoryCard);
    });

    // Add event listeners to category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            currentCategory = card.dataset.category;
            categoryFilter.value = currentCategory;
            displayProducts();
            // Scroll to products
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function handleSearch() {
    searchTerm = searchInput.value.toLowerCase();
    displayProducts();
}

function handleFilter() {
    currentCategory = categoryFilter.value;
    displayProducts();
}

function handleSort() {
    sortBy = sortFilter.value;
    displayProducts();
}

function displayProducts() {
    productGrid.innerHTML = '';

    let filteredProducts = products.filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    // Sort products
    if (sortBy === 'recent') {
        filteredProducts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'old') {
        filteredProducts.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h3 class="text-lg font-semibold mb-2 text-black">${product.name}</h3>
                <p class="text-gray-600 mb-4 text-xl font-bold">${product.price} FCFA</p>
                <button class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition add-to-cart w-full flex items-center justify-center" data-id="${product.id}">
                    <i class="fas fa-cart-plus mr-2"></i> Ajouter au Panier
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('button').dataset.id);
            addToCart(productId);
        });
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.product.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ product, quantity: 1 });
    }
    saveCart();
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}