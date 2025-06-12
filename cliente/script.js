document.addEventListener('DOMContentLoaded', function() {
    // Productos de kiosko
    const products = [
        { 
            id: 1, 
            name: 'Gaseosa Personal', 
            price: 1.50, 
            oldPrice: 1.75,
            image: 'https://via.placeholder.com/300', 
            badge: 'Oferta',
            stock: 50
        },
        { 
            id: 2, 
            name: 'Papas Fritas', 
            price: 2.00, 
            image: 'https://via.placeholder.com/300', 
            stock: 30
        },
        { 
            id: 3, 
            name: 'Chocolate', 
            price: 1.25, 
            oldPrice: 1.50,
            image: 'https://via.placeholder.com/300', 
            badge: 'Popular',
            stock: 40
        },
        { 
            id: 4, 
            name: 'Galletas', 
            price: 1.80, 
            image: 'https://via.placeholder.com/300', 
            stock: 25
        },
        { 
            id: 5, 
            name: 'Jugo en Caja', 
            price: 1.20, 
            image: 'https://via.placeholder.com/300', 
            stock: 35
        },
        { 
            id: 6, 
            name: 'Barra de Cereal', 
            price: 1.00, 
            image: 'https://via.placeholder.com/300', 
            stock: 45
        },
        { 
            id: 7, 
            name: 'Chicles', 
            price: 0.75, 
            image: 'https://via.placeholder.com/300', 
            stock: 60
        },
        { 
            id: 8, 
            name: 'Agua Mineral', 
            price: 1.00, 
            image: 'https://via.placeholder.com/300', 
            stock: 40
        }
    ];
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let currentSort = 'default';
    
    // Elementos del DOM
    const productGrid = document.getElementById('product-grid');
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotal = document.getElementById('cart-total');
    
    // Mostrar productos
    function displayProducts() {
        productGrid.innerHTML = '';
        
        let sortedProducts = [...products];
        
        switch(currentSort) {
            case 'price-asc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }
        
        sortedProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            const badgeHTML = product.badge 
                ? `<span class="product-badge">${product.badge}</span>` 
                : '';
            
            const oldPriceHTML = product.oldPrice 
                ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` 
                : '';
            
            productCard.innerHTML = `
                ${badgeHTML}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${oldPriceHTML}
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Añadir al carrito
                    </button>
                </div>
            `;
            
            productGrid.appendChild(productCard);
        });
        
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }
    
    // Añadir producto al carrito
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
            } else {
                showToast('No hay suficiente stock disponible');
                return;
            }
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        updateCart();
        showToast(`${product.name} añadido al carrito`);
    }
    
    // Actualizar el carrito
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (cartModal.style.display === 'block') {
            displayCartItems();
        }
    }
    
    // Mostrar items del carrito
    function displayCartItems() {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
            cartSubtotal.textContent = '0.00';
            cartTotal.textContent = '0.00';
            return;
        }
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} c/u</p>
                        <div class="cart-item-controls">
                            <button class="decrease-item" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-item" data-id="${item.id}">+</button>
                            <span class="remove-item" data-id="${item.id}">Eliminar</span>
                        </div>
                    </div>
                </div>
                <div class="cart-item-price">
                    <p>$${itemTotal.toFixed(2)}</p>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        const shipping = parseFloat(cartShipping.textContent);
        const total = subtotal + shipping;
        
        cartSubtotal.textContent = subtotal.toFixed(2);
        cartTotal.textContent = total.toFixed(2);
        
        document.querySelectorAll('.increase-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                changeCartItemQuantity(productId, 1);
            });
        });
        
        document.querySelectorAll('.decrease-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                changeCartItemQuantity(productId, -1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeCartItem(productId);
            });
        });
    }
    
    // Cambiar cantidad de items
    function changeCartItemQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (!item) return;
        
        const product = products.find(p => p.id === productId);
        
        if (change > 0 && item.quantity >= product.stock) {
            showToast('No hay suficiente stock disponible');
            return;
        }
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        
        updateCart();
    }
    
    // Eliminar item del carrito
    function removeCartItem(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }
    
    // Mostrar notificación
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Inicializar la aplicación
    updateCart();
    displayProducts();
    
    // Resto del código para manejar modales y eventos...
    // (Mantener el mismo código para los modales, ordenamiento, etc.)
});