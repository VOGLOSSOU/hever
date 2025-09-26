const ADMIN_PASSWORD = 'hever2025'; // Simple password for demo
const API_BASE = 'backend/api';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login');
    const adminPanel = document.getElementById('admin-panel');
    const loginDiv = document.getElementById('login-form');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('admin-password').value;
        if (password === ADMIN_PASSWORD) {
            loginDiv.classList.add('hidden');
            adminPanel.classList.remove('hidden');
            initializeAdmin();
        } else {
            alert('Mot de passe incorrect');
        }
    });

    document.getElementById('logout').addEventListener('click', () => {
        adminPanel.classList.add('hidden');
        loginDiv.classList.remove('hidden');
        document.getElementById('admin-password').value = '';
    });
});

function initializeAdmin() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.dataset.tab);
        });
    });

    // Category form handlers
    document.getElementById('add-category-btn').addEventListener('click', () => {
        document.getElementById('category-form').classList.remove('hidden');
    });

    document.getElementById('cancel-category').addEventListener('click', () => {
        document.getElementById('category-form').classList.add('hidden');
        document.getElementById('add-category-form').reset();
    });

    document.getElementById('add-category-form').addEventListener('submit', handleAddCategory);

    // Product form handlers
    document.getElementById('add-product-btn').addEventListener('click', () => {
        loadCategoriesForSelect();
        document.getElementById('product-form').classList.remove('hidden');
    });

    document.getElementById('cancel-product').addEventListener('click', () => {
        document.getElementById('product-form').classList.add('hidden');
        document.getElementById('add-product-form').reset();
    });

    document.getElementById('add-product-form').addEventListener('submit', handleAddProduct);

    // Load initial data
    loadOrders();
    loadCategories();
    loadProducts();
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active', 'border-black');
        btn.classList.add('border-transparent');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active', 'border-black');
    document.querySelector(`[data-tab="${tabName}"]`).classList.remove('border-transparent');

    // Show/hide sections
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(`${tabName}-section`).classList.remove('hidden');
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersList = document.getElementById('orders-list');
    const noOrders = document.getElementById('no-orders');

    if (orders.length === 0) {
        ordersList.innerHTML = '';
        noOrders.classList.remove('hidden');
        return;
    }

    noOrders.classList.add('hidden');

    ordersList.innerHTML = orders.map(order => `
        <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-semibold">Commande #${order.id}</h3>
                    <p class="text-gray-600">${new Date(order.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-sm ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'paid' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                }">${order.status === 'pending' ? 'En attente' : order.status === 'paid' ? 'Payé' : 'Annulé'}</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <h4 class="font-semibold mb-2">Client</h4>
                    <p><strong>Nom:</strong> ${order.customer.name}</p>
                    <p><strong>WhatsApp:</strong> <a href="https://wa.me/${order.customer.whatsapp.replace(/\D/g, '')}" class="text-blue-600 hover:underline">${order.customer.whatsapp}</a></p>
                    <p><strong>Adresse:</strong> ${order.customer.address}</p>
                    ${order.customer.instructions ? `<p><strong>Instructions:</strong> ${order.customer.instructions}</p>` : ''}
                </div>

                <div>
                    <h4 class="font-semibold mb-2">Articles</h4>
                    ${order.items.map(item => `
                        <div class="flex justify-between">
                            <span>${item.product.name} x${item.quantity}</span>
                            <span>${item.product.price * item.quantity} FCFA</span>
                        </div>
                    `).join('')}
                    <div class="border-t pt-2 mt-2 font-semibold">
                        <div class="flex justify-between">
                            <span>Total:</span>
                            <span>${order.total} FCFA</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex space-x-2">
                <button onclick="contactCustomer('${order.customer.whatsapp}')" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                    <i class="fab fa-whatsapp mr-2"></i>Contacter
                </button>
                <button onclick="updateStatus(${order.id}, 'paid')" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    Marquer payé
                </button>
                <button onclick="updateStatus(${order.id}, 'cancelled')" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                    Annuler
                </button>
            </div>
        </div>
    `).join('');
}

function contactCustomer(whatsapp) {
    const number = whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${number}`, '_blank');
}

function updateStatus(orderId, status) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
    }
}

// Categories functions
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/categories.php`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const categories = await response.json();

        const categoriesList = document.getElementById('categories-list');
        if (categories.length === 0) {
            categoriesList.innerHTML = '<p class="text-gray-500 text-center py-8">Aucune catégorie trouvée. Ajoutez-en une !</p>';
        } else {
            categoriesList.innerHTML = categories.map(category => `
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <img src="${category.image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${category.name}" class="w-full h-32 object-cover rounded mb-4">
                    <h3 class="text-lg font-semibold mb-2">${category.name}</h3>
                    <p class="text-gray-600 text-sm">${category.description || 'Aucune description'}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        const categoriesList = document.getElementById('categories-list');
        categoriesList.innerHTML = '<p class="text-red-500 text-center py-8">Erreur de connexion à la base de données. Vérifiez la configuration.</p>';
    }
}

async function handleAddCategory(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('category-name').value);
    formData.append('description', document.getElementById('category-description').value);

    const imageFile = document.getElementById('category-image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch(`${API_BASE}/categories.php`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert('Catégorie ajoutée avec succès');
            document.getElementById('category-form').classList.add('hidden');
            document.getElementById('add-category-form').reset();
            loadCategories();
        } else {
            alert(result.error || 'Erreur lors de l\'ajout de la catégorie');
        }
    } catch (error) {
        console.error('Error adding category:', error);
        alert('Erreur lors de l\'ajout de la catégorie');
    }
}

// Products functions
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products.php`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const products = await response.json();

        const productsList = document.getElementById('products-list');
        if (products.length === 0) {
            productsList.innerHTML = '<p class="text-gray-500 text-center py-8">Aucun produit trouvé. Ajoutez-en un !</p>';
        } else {
            productsList.innerHTML = products.map(product => `
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <img src="${product.image || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${product.name}" class="w-full h-32 object-cover rounded mb-4">
                    <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
                    <p class="text-gray-600 text-sm mb-2">${product.description || 'Aucune description'}</p>
                    <p class="text-xl font-bold text-black">${product.price} FCFA</p>
                    <p class="text-sm text-gray-500">Catégorie: ${product.category_name}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        const productsList = document.getElementById('products-list');
        productsList.innerHTML = '<p class="text-red-500 text-center py-8">Erreur de connexion à la base de données. Vérifiez la configuration.</p>';
    }
}

async function loadCategoriesForSelect() {
    try {
        const response = await fetch(`${API_BASE}/categories.php`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const categories = await response.json();

        const select = document.getElementById('product-category');
        select.innerHTML = '<option value="">Sélectionner une catégorie</option>' +
            categories.map(category => `<option value="${category.id}">${category.name}</option>`).join('');
    } catch (error) {
        console.error('Error loading categories for select:', error);
        const select = document.getElementById('product-category');
        select.innerHTML = '<option value="">Erreur de chargement des catégories</option>';
    }
}

async function handleAddProduct(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('product-name').value);
    formData.append('description', document.getElementById('product-description').value);
    formData.append('price', document.getElementById('product-price').value);
    formData.append('category_id', document.getElementById('product-category').value);

    const imageFile = document.getElementById('product-image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        const response = await fetch(`${API_BASE}/products.php`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            alert('Produit ajouté avec succès');
            document.getElementById('product-form').classList.add('hidden');
            document.getElementById('add-product-form').reset();
            loadProducts();
        } else {
            alert(result.error || 'Erreur lors de l\'ajout du produit');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Erreur lors de l\'ajout du produit');
    }
}