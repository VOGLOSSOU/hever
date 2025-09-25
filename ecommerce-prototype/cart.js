let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    displayCart();
    updateCartCount();
});

function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItems.innerHTML = '';
        emptyCart.classList.remove('hidden');
        cartTotal.classList.add('hidden');
        return;
    }

    emptyCart.classList.add('hidden');
    cartTotal.classList.remove('hidden');

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="flex items-center bg-white p-4 rounded-lg shadow">
            <img src="${item.product.image}" alt="${item.product.name}" class="w-20 h-20 object-cover rounded mr-4">
            <div class="flex-1">
                <h3 class="text-lg font-semibold">${item.product.name}</h3>
                <p class="text-gray-600">${item.product.price} FCFA</p>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="changeQuantity(${index}, -1)" class="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">-</button>
                <span class="px-3">${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)" class="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">+</button>
            </div>
            <div class="ml-4 text-right">
                <p class="font-semibold">${item.product.price * item.quantity} FCFA</p>
                <button onclick="removeItem(${index})" class="text-red-500 hover:text-red-700 mt-1">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    updateTotal();
}

function changeQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    displayCart();
    updateCartCount();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    displayCart();
    updateCartCount();
}

function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    document.getElementById('total-price').textContent = `${total} FCFA`;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}