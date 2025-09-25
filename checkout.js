let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    displayOrderSummary();
    updateCartCount();

    document.getElementById('place-order').addEventListener('click', placeOrder);
});

function displayOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    let total = 0;

    const itemsHtml = cart.map(item => {
        const itemTotal = item.product.price * item.quantity;
        total += itemTotal;
        return `
            <div class="flex justify-between items-center py-2 border-b border-gray-200">
                <div>
                    <span class="font-medium">${item.product.name}</span>
                    <span class="text-gray-600"> x${item.quantity}</span>
                </div>
                <span>${itemTotal} FCFA</span>
            </div>
        `;
    }).join('');

    orderSummary.innerHTML = `
        ${itemsHtml}
        <div class="flex justify-between items-center py-4 font-bold text-lg">
            <span>Total:</span>
            <span>${total} FCFA</span>
        </div>
    `;
}

function placeOrder() {
    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const orderData = {
        id: Date.now(),
        customer: {
            name: document.getElementById('full-name').value,
            whatsapp: document.getElementById('whatsapp').value,
            address: document.getElementById('address').value,
            instructions: document.getElementById('instructions').value
        },
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'pending'
    };

    // Save order
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem('cart');
    cart = [];

    // Show success message and redirect
    alert('Commande passée avec succès ! Vous serez contacté via WhatsApp pour le paiement.');
    window.location.href = 'index.html';
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}