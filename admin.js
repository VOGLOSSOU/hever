const ADMIN_PASSWORD = 'hever2025'; // Simple password for demo

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
            loadOrders();
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