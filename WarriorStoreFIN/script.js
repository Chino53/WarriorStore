// Base de datos de productos
const products = [
    {
        id: 1,
        title: "Remera Básica Blanca",
        price: 29.99,
        category: "remeras",
        image: "img/RemeraBlanca.png"
    },
    {
        id: 2,
        title: "Short Deportivo Negro",
        price: 34.99,
        category: "shorts",
        image: "img/ShortNegro.png"
    },
    {
        id: 3,
        title: "Campera Jeans",
        price: 89.99,
        category: "camperas",
        image: "img/CamperaJean.png"
    },
    {
        id: 4,
        title: "Pantalón Chino Beige",
        price: 49.99,
        category: "pantalones",
        image: "img/PantalonBeige.png"
    },
    {
        id: 5,
        title: "Remera Estampada",
        price: 39.99,
        category: "remeras",
        image: "img/RemeraEstampada.png"
    },
    {
        id: 6,
        title: "Short de Baño Azul",
        price: 24.99,
        category: "shorts",
        image: "img/ShortBanio.png"
    },
    {
        id: 7,
        title: "Campera de Cuero",
        price: 199.99,
        category: "camperas",
        image: "img/CamperaCuero.png"
    },
    {
        id: 8,
        title: "Jeans Slim Fit",
        price: 59.99,
        category: "pantalones",
        image: "img/JeanSlimFit.png"
    }
];

// Variables globales
let cart = [];
let currentUser = null;

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items-container');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const closeLogin = document.getElementById('close-login');
const closeRegister = document.getElementById('close-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.getElementById('close-checkout');
const checkoutForm = document.getElementById('checkout-form');

const confirmationModal = document.getElementById('confirmation-modal');
const closeConfirmation = document.getElementById('close-confirmation');
const confirmationClose = document.getElementById('confirmation-close');
const confirmationMessage = document.getElementById('confirmation-message');

// Mostrar productos
function displayProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}">Agregar al Carrito</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Funciones del Carrito
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.title} agregado al carrito`);
}

function updateCart() {
    // Actualizar contador
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    img="img/WarriorStoreLogo.jpg"
    // Actualizar modal del carrito si está abierto
    if (cartModal.style.display === 'flex') {
        renderCartItems();
    }
}

function renderCartItems() {
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartItemsContainer.innerHTML = '';
        cartTotal.textContent = '0';
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn plus">+</button>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                <div class="remove-item">🗑️</div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = itemsHTML;
    cartTotal.textContent = total.toFixed(2);
    
    // Agregar event listeners
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
}

function decreaseQuantity(e) {
    const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
    const item = cart.find(item => item.id === itemId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== itemId);
    }
    
    updateCart();
}

function increaseQuantity(e) {
    const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
    const item = cart.find(item => item.id === itemId);
    
    item.quantity += 1;
    updateCart();
}

function removeItem(e) {
    const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Funciones de autenticación
function loginUser(email, password) {
    // En una aplicación real, esto haría una llamada al servidor
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Actualizar UI
        loginBtn.textContent = user.name;
        registerBtn.style.display = 'none';
        
        showNotification(`Bienvenido, ${user.name}`);
        closeModal(loginModal);
        return true;
    }
    
    return false;
}

function registerUser(userData) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verificar si el usuario ya existe
    if (users.some(u => u.email === userData.email)) {
        return false;
    }
    
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Iniciar sesión automáticamente
    loginUser(userData.email, userData.password);
    return true;
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Actualizar UI
    loginBtn.textContent = 'Iniciar Sesión';
    registerBtn.style.display = 'block';
}

// Funciones de compra
function processCheckout(formData) {
    // En una aplicación real, esto enviaría los datos a un servidor
    const order = {
        user: currentUser ? {
            name: currentUser.name,
            email: currentUser.email
        } : {
            name: formData.name,
            email: formData.email
        },
        items: cart,
        total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        shippingAddress: formData.address,
        phone: formData.phone,
        date: new Date().toISOString(),
        orderId: 'ORD-' + Math.floor(Math.random() * 1000000)
    };
    
    // Enviar correo (simulado)
    sendEmail(order);
    
    // Limpiar carrito
    cart = [];
    updateCart();
    
    // Mostrar confirmación
    confirmationMessage.textContent = `Gracias por tu compra, ${order.user.name}. Hemos enviado un correo a ${order.user.email} con los detalles de tu pedido (Orden #${order.orderId}).`;
    closeModal(checkoutModal);
    openModal(confirmationModal);
    
    // Guardar orden en historial
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function sendEmail(order) {
    // Simulación de envío de correo
    const emailContent = `
        Asunto: Confirmación de pedido #${order.orderId}
        
        Hola ${order.user.name},
        
        Gracias por tu compra en Warrior Store. Aquí están los detalles de tu pedido:
        
        ${order.items.map(item => `- ${item.title} (${item.quantity} x $${item.price.toFixed(2)})`).join('\n')}
        
        Total: $${order.total.toFixed(2)}
        
        Dirección de envío: ${order.shippingAddress}
        
        Tu pedido será procesado y enviado pronto.
        
        Gracias,
        El equipo de Warrior Store
    `;
    
    console.log('Correo enviado:', emailContent);
    // En una aplicación real, usarías un servicio como EmailJS o una API de backend
}

// Funciones de UI
function openModal(modal) {
    modal.style.display = 'flex';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#2ecc71';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    
    // Cargar carrito desde localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
    
    // Cargar usuario desde localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        loginBtn.textContent = currentUser.name;
        registerBtn.style.display = 'none';
    }
});

// Carrito
cartIcon.addEventListener('click', () => {
    renderCartItems();
    openModal(cartModal);
});

closeCart.addEventListener('click', () => {
    closeModal(cartModal);
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    
    closeModal(cartModal);
    
    // Si el usuario está logueado, rellenar automáticamente
    if (currentUser) {
        document.getElementById('checkout-name').value = currentUser.name;
        document.getElementById('checkout-email').value = currentUser.email;
        document.getElementById('checkout-address').value = currentUser.address;
        document.getElementById('checkout-phone').value = currentUser.phone;
    }
    
    openModal(checkoutModal);
});

// Autenticación
loginBtn.addEventListener('click', (e) => {
    if (currentUser) {
        logoutUser();
    } else {
        openModal(loginModal);
    }
});

registerBtn.addEventListener('click', () => {
    openModal(registerModal);
});

closeLogin.addEventListener('click', () => {
    closeModal(loginModal);
});

closeRegister.addEventListener('click', () => {
    closeModal(registerModal);
});

showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    openModal(registerModal);
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(registerModal);
    openModal(loginModal);
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (loginUser(email, password)) {
        loginForm.reset();
    } else {
        alert('Email o contraseña incorrectos');
    }
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('register-name').value,
        email: document.getElementById('register-email').value,
        password: document.getElementById('register-password').value,
        address: document.getElementById('register-address').value,
        phone: document.getElementById('register-phone').value
    };
    
    if (registerUser(userData)) {
        registerForm.reset();
    } else {
        alert('El email ya está registrado');
    }
});

// Checkout
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('checkout-name').value,
        email: document.getElementById('checkout-email').value,
        address: document.getElementById('checkout-address').value,
        phone: document.getElementById('checkout-phone').value,
        card: document.getElementById('checkout-card').value,
        expiry: document.getElementById('checkout-expiry').value,
        cvv: document.getElementById('checkout-cvv').value
    };
    
    // Validación básica
    if (!formData.name || !formData.email || !formData.address || !formData.phone) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }
    
    processCheckout(formData);
    checkoutForm.reset();
});

// Confirmación
closeConfirmation.addEventListener('click', () => {
    closeModal(confirmationModal);
});

confirmationClose.addEventListener('click', () => {
    closeModal(confirmationModal);
});

// Cerrar modales al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeModal(cartModal);
    }
    if (e.target === loginModal) {
        closeModal(loginModal);
    }
    if (e.target === registerModal) {
        closeModal(registerModal);
    }
    if (e.target === checkoutModal) {
        closeModal(checkoutModal);
    }
    if (e.target === confirmationModal) {
        closeModal(confirmationModal);
    }
});