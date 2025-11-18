// Данные меню с уникальными изображениями
const menuItems = [
    {
        id: 1,
        name: "Эспрессо",
        description: "Классический крепкий кофе",
        price: 120,
        image: "https://avatars.mds.yandex.net/i?id=50fe039f71660364dbe7cea63610c080f4c570f5-2424415-images-thumbs&n=13",
        category: "coffee"
    },
    {
        id: 2,
        name: "Капучино",
        description: "Кофе с молочной пенкой",
        price: 150,
        image: "https://avatars.mds.yandex.net/i?id=7a98ed4b196daff77239a06441d1b6dcfd46e69c-9245081-images-thumbs&n=13",
        category: "coffee"
    },
    {
        id: 3,
        name: "Латте",
        description: "Нежный кофе с молоком",
        price: 160,
        image: "https://avatars.mds.yandex.net/get-entity_search/1710928/1177644094/SUx182_2x",
        category: "coffee"
    },
    {
        id: 4,
        name: "Чизкейк",
        description: "Классический нью-йоркский чизкейк",
        price: 200,
        image: "https://avatars.mds.yandex.net/i?id=daabf097aa5f3aec5b607ab13d8fbdbd78d4a174-2466101-images-thumbs&n=13",
        category: "desserts"
    },
    {
        id: 5,
        name: "Круассан",
        description: "Свежий французский круассан",
        price: 80,
        image: "https://avatars.mds.yandex.net/i?id=39f8e5345ed2b5bac01a778657eab8d5895d78df-16473773-images-thumbs&n=13",
        category: "desserts"
    },
    {
        id: 6,
        name: "Горячий шоколад",
        description: "Насыщенный горячий шоколад",
        price: 140,
        image: "https://avatars.mds.yandex.net/i?id=281404a63fcbb7d211921c8ecaa3a778a7ab660b-10767243-images-thumbs&n=13",
        category: "other"
    }
];

// Глобальные переменные
let cart = [];
let orderModal = null;
let successModal = null;

// Функция для отображения меню
function displayMenu() {
    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = '';
    
    menuItems.forEach(item => {
        const menuItemHTML = `
            <div class="col-md-4 mb-4">
                <div class="card menu-card h-100">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text flex-grow-1">${item.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <span class="price">${item.price} руб.</span>
                            <button class="btn btn-outline-primary btn-sm" onclick="addToCart(${item.id})">
                                <i class="fa fa-plus"></i> В корзину
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        menuContainer.innerHTML += menuItemHTML;
    });
}

// Корзина
function addToCart(itemId) {
    const item = menuItems.find(menuItem => menuItem.id === itemId);
    if (item) {
        // Проверяем, есть ли уже такой товар в корзине
        const existingItem = cart.find(cartItem => cartItem.id === itemId);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            item.quantity = 1;
            cart.push(item);
        }
        updateCartCounter();
        showAlert(`${item.name} добавлен в корзину!`, 'success');
    }
}

function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart.splice(itemIndex, 1);
        }
        updateCartCounter();
        showAlert(`${item.name} удален из корзины`, 'warning');
    }
}

function updateCartCounter() {
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCounter.textContent = totalItems;
    }
}

// Функция показа уведомлений
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.top = '100px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '1050';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 3000);
}

// Функции для модального окна заказа
function openOrderModal() {
    if (cart.length === 0) {
        showAlert('Добавьте товары в корзину перед оформлением заказа!', 'warning');
        return;
    }
    
    updateOrderSummary();
    const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
    orderModal.show();
}

function updateOrderSummary() {
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * (item.quantity || 1);
        total += itemTotal;
        itemsHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <strong>${item.name}</strong>
                    <br>
                    <small>${item.price} руб. × ${item.quantity || 1}</small>
                </div>
                <div class="d-flex align-items-center">
                    <span class="me-2">${itemTotal} руб.</span>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id}); updateOrderSummary();">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    orderItems.innerHTML = itemsHTML || '<p class="text-muted">Корзина пуста</p>';
    orderTotal.textContent = total + ' руб.';
}

function submitOrder() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
    const address = document.getElementById('address').value;
    const time = document.getElementById('order-time').value;
    const comment = document.getElementById('comment').value;
    
    // Валидация
    if (!name || !phone) {
        showAlert('Пожалуйста, заполните имя и телефон', 'warning');
        return;
    }
    
    if (deliveryType === 'delivery' && !address) {
        showAlert('Пожалуйста, укажите адрес доставки', 'warning');
        return;
    }
    
    // Формируем сообщение о заказе
    let successMessage = `
        <strong>${name}</strong>, ваш заказ принят!<br><br>
        <strong>Способ получения:</strong> ${deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}<br>
    `;
    
    if (deliveryType === 'delivery') {
        successMessage += `<strong>Адрес доставки:</strong> ${address}<br>`;
    }
    
    successMessage += `
        <strong>Телефон:</strong> ${phone}<br>
        <strong>Время:</strong> ${getTimeText(time)}<br>
        <strong>Сумма заказа:</strong> ${document.getElementById('order-total').textContent}
    `;
    
    if (comment) {
        successMessage += `<br><strong>Комментарий:</strong> ${comment}`;
    }
    
    // Показываем модальное окно успеха
    document.getElementById('success-message').innerHTML = successMessage;
    
    // Закрываем модальное окно заказа
    const orderModal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
    orderModal.hide();
    
    // Показываем модальное окно успеха
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Очищаем корзину после успешного заказа
    cart = [];
    updateCartCounter();
    
    // Очищаем форму
    document.getElementById('order-form').reset();
    document.getElementById('address-field').style.display = 'none';
}

function getTimeText(timeValue) {
    const times = {
        'asap': 'Как можно скорее',
        '10:00': '10:00 - 11:00',
        '11:00': '11:00 - 12:00',
        '12:00': '12:00 - 13:00',
        '13:00': '13:00 - 14:00',
        '14:00': '14:00 - 15:00',
        '15:00': '15:00 - 16:00',
        '16:00': '16:00 - 17:00',
        '17:00': '17:00 - 18:00',
        '18:00': '18:00 - 19:00'
    };
    return times[timeValue] || timeValue;
}

// Функция показа корзины
function showCart() {
    if (cart.length === 0) {
        showAlert('Корзина пуста!', 'warning');
        return;
    }
    
    openOrderModal();
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', function() {
    displayMenu();
    
    // Создание счетчика корзины в навигации
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav) {
        const cartItem = document.createElement('li');
        cartItem.className = 'nav-item';
        cartItem.innerHTML = `
            <a class="nav-link" href="#" onclick="showCart()">
                <i class="fa fa-shopping-cart"></i>
                Корзина <span id="cart-counter" class="badge bg-primary">0</span>
            </a>
        `;
        navbarNav.appendChild(cartItem);
    }
    
    // Обработчик изменения способа доставки
    document.querySelectorAll('input[name="deliveryType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const addressField = document.getElementById('address-field');
            if (this.value === 'delivery') {
                addressField.style.display = 'block';
            } else {
                addressField.style.display = 'none';
            }
        });
    });
    
    // Обработчик формы обратной связи
    document.getElementById('contact-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        showAlert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
        this.reset();
    });
    
    // Плавная прокрутка для навигационных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});