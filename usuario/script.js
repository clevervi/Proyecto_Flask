document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo
    const sampleOrders = [
        { id: 1001, customer: "Juan Pérez", date: "2023-05-15", total: 125.99, status: "pending", items: [
            { product: "Camiseta", price: 29.99, quantity: 2 },
            { product: "Pantalón", price: 49.99, quantity: 1 },
            { product: "Zapatos", price: 45.99, quantity: 1 }
        ]},
        { id: 1002, customer: "María García", date: "2023-05-16", total: 89.97, status: "processing", items: [
            { product: "Sombrero", price: 19.99, quantity: 3 }
        ]},
        { id: 1003, customer: "Carlos López", date: "2023-05-17", total: 199.95, status: "completed", items: [
            { product: "Chaqueta", price: 99.99, quantity: 2 }
        ]}
    ];

    const sampleProducts = [
        { id: 1, name: "Camiseta", price: 29.99, stock: 50 },
        { id: 2, name: "Pantalón", price: 49.99, stock: 30 },
        { id: 3, name: "Zapatos", price: 45.99, stock: 20 },
        { id: 4, name: "Sombrero", price: 19.99, stock: 15 },
        { id: 5, name: "Chaqueta", price: 99.99, stock: 10 }
    ];

    const sampleCustomers = [
        { id: 1, name: "Juan Pérez", email: "juan@example.com", phone: "555-1234", orders: 3 },
        { id: 2, name: "María García", email: "maria@example.com", phone: "555-5678", orders: 5 },
        { id: 3, name: "Carlos López", email: "carlos@example.com", phone: "555-9012", orders: 2 }
    ];

    // Elementos del DOM
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.content-section');
    const ordersTable = document.getElementById('orders-table').querySelector('tbody');
    const productsTable = document.getElementById('products-table').querySelector('tbody');
    const customersTable = document.getElementById('customers-table').querySelector('tbody');
    const orderModal = document.getElementById('order-modal');
    const productModal = document.getElementById('product-modal');
    const closeButtons = document.querySelectorAll('.close');
    const filterOrdersBtn = document.getElementById('filter-orders');
    const orderStatusFilter = document.getElementById('order-status');
    const addProductBtn = document.getElementById('add-product');
    const productForm = document.getElementById('product-form');
    const orderForm = document.getElementById('order-form');

    // Variables de estado
    let currentOrder = null;
    let currentProduct = null;

    // Inicialización
    loadOrders();
    loadProducts();
    loadCustomers();

    // Navegación entre secciones
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            
            // Actualizar navegación activa
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${sectionId}-section`) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Cerrar modales
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            orderModal.style.display = 'none';
            productModal.style.display = 'none';
        });
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === orderModal) {
            orderModal.style.display = 'none';
        }
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
    });

    // Filtrar pedidos
    filterOrdersBtn.addEventListener('click', function() {
        loadOrders();
    });

    // Añadir producto
    addProductBtn.addEventListener('click', function() {
        currentProduct = null;
        document.getElementById('product-modal-title').textContent = 'Añadir Producto';
        document.getElementById('product-form').reset();
        productModal.style.display = 'block';
    });

    // Manejar formulario de producto
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productData = {
            id: document.getElementById('product-id').value || (sampleProducts.length + 1),
            name: document.getElementById('product-name').value,
            price: parseFloat(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            description: document.getElementById('product-description').value,
            image: document.getElementById('product-image').value
        };
        
        if (currentProduct) {
            // Editar producto existente
            const index = sampleProducts.findIndex(p => p.id === currentProduct.id);
            sampleProducts[index] = productData;
        } else {
            // Añadir nuevo producto
            sampleProducts.push(productData);
        }
        
        loadProducts();
        productModal.style.display = 'none';
    });

    // Manejar formulario de pedido
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newStatus = document.getElementById('order-status-select').value;
        const index = sampleOrders.findIndex(o => o.id === currentOrder.id);
        sampleOrders[index].status = newStatus;
        
        loadOrders();
        orderModal.style.display = 'none';
    });

    // Cargar pedidos
    function loadOrders() {
        ordersTable.innerHTML = '';
        const statusFilter = orderStatusFilter.value;
        
        const filteredOrders = statusFilter === 'all' 
            ? sampleOrders 
            : sampleOrders.filter(order => order.status === statusFilter);
        
        filteredOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td><span class="status-${order.status}">${getStatusText(order.status)}</span></td>
                <td>
                    <button class="btn btn-edit" data-id="${order.id}">Editar</button>
                </td>
            `;
            ordersTable.appendChild(row);
        });
        
        // Agregar eventos a los botones de editar
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = parseInt(this.getAttribute('data-id'));
                currentOrder = sampleOrders.find(o => o.id === orderId);
                openOrderModal(currentOrder);
            });
        });
    }

    // Cargar productos
    function loadProducts() {
        productsTable.innerHTML = '';
        
        sampleProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-edit" data-id="${product.id}">Editar</button>
                    <button class="btn btn-delete" data-id="${product.id}">Eliminar</button>
                </td>
            `;
            productsTable.appendChild(row);
        });
        
        // Agregar eventos a los botones de editar y eliminar
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                currentProduct = sampleProducts.find(p => p.id === productId);
                openProductModal(currentProduct);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                    const index = sampleProducts.findIndex(p => p.id === productId);
                    sampleProducts.splice(index, 1);
                    loadProducts();
                }
            });
        });
    }

    // Cargar clientes
    function loadCustomers() {
        customersTable.innerHTML = '';
        
        sampleCustomers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.orders}</td>
            `;
            customersTable.appendChild(row);
        });
    }

    // Abrir modal de pedido
    function openOrderModal(order) {
        document.getElementById('order-id').textContent = order.id;
        document.getElementById('order-customer').value = order.customer;
        document.getElementById('order-date').value = order.date;
        document.getElementById('order-total').value = `$${order.total.toFixed(2)}`;
        document.getElementById('order-status-select').value = order.status;
        
        const orderItems = document.getElementById('order-items');
        orderItems.innerHTML = '';
        
        order.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item';
            itemDiv.innerHTML = `
                <span>${item.quantity} x ${item.product}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderItems.appendChild(itemDiv);
        });
        
        orderModal.style.display = 'block';
    }

    // Abrir modal de producto
    function openProductModal(product) {
        document.getElementById('product-modal-title').textContent = 'Editar Producto';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-image').value = product.image || '';
        
        productModal.style.display = 'block';
    }

    // Obtener texto del estado
    function getStatusText(status) {
        const statusTexts = {
            'pending': 'Pendiente',
            'processing': 'En proceso',
            'completed': 'Completado',
            'cancelled': 'Cancelado'
        };
        return statusTexts[status] || status;
    }

    // Cerrar sesión
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            // Redirigir a la página de login (simulado)
            window.location.href = 'login.html';
        }
    });
});