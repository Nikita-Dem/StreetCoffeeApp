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

// Настройки Telegram бота
const TELEGRAM_CONFIG = {
    botToken: '8229025232:AAGrLS2hUOeaDDgqm4pfwV_Ouh_bU5nx5P8',
    chatId: '6394893190'
};

// Обновите настройки EmailJS (замените на ваши реальные ключи)
const EMAIL_CONFIG = {
    serviceId: 'your_service_id',
    templateId: 'your_template_id', 
    publicKey: 'your_public_key',
    toEmail: 'nikitadem220@gmail.com'
};

// Остальной код JavaScript остается таким же, как у вас
// [Весь ваш существующий JavaScript код]

// Глобальные настройки приложения
const APP_CONFIG = {
    defaultPhone: '+79240031858', // Номер по умолчанию для формы
    companyName: 'Street Coffee',
    supportEmail: 'nikitadem220@gmail.com'
};

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
            cart.push({
                ...item,
                quantity: 1
            });
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
        
        // Обновляем корзину в модальном окне, если оно открыто
        if (document.getElementById('orderModal').classList.contains('show')) {
            updateOrderSummary();
        }
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
    // Удаляем существующие уведомления
    const existingAlerts = document.querySelectorAll('.alert.position-fixed');
    existingAlerts.forEach(alert => alert.remove());
    
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
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        itemsHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <strong>${item.name}</strong>
                    <br>
                    <small>${item.price} руб. × ${item.quantity}</small>
                </div>
                <div class="d-flex align-items-center">
                    <span class="me-2">${itemTotal} руб.</span>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    orderItems.innerHTML = itemsHTML || '<p class="text-muted">Корзина пуста</p>';
    orderTotal.textContent = total + ' руб.';
}

// Функция отправки сообщения в Telegram
async function sendTelegramMessage(message) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();
        
        if (!result.ok) {
            throw new Error(result.description || 'Unknown Telegram error');
        }
        
        return result;
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        throw new Error(`Не удалось отправить сообщение в Telegram: ${error.message}`);
    }
}

// Функция отправки email через EmailJS (ОБНОВЛЕННАЯ)
async function sendEmail(emailData) {
    try {
        // Проверяем, подключена ли библиотека EmailJS
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS не подключен. Добавьте script в HTML: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>');
        }

        // Инициализируем EmailJS
        emailjs.init(EMAIL_CONFIG.publicKey);
        
        // Добавляем email получателя в данные
        const emailDataWithRecipient = {
            ...emailData,
            to_email: EMAIL_CONFIG.toEmail // Добавляем получателя
        };
        
        // Отправляем email
        const response = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateId,
            emailDataWithRecipient
        );
        
        return response;
    } catch (error) {
        console.error('Ошибка отправки email:', error);
        throw new Error(`Не удалось отправить email: ${error.message}`);
    }
}

// Функция формирования сообщения о заказе для Telegram
function formatOrderForTelegram(orderData) {
    const emojis = {
        new: '🆕',
        coffee: '☕',
        dessert: '🍰',
        bread: '🥐',
        tea: '🍵',
        money: '💰',
        phone: '📞',
        location: '📍',
        time: '⏰',
        warning: '⚠️',
        success: '✅',
        person: '👤'
    };

    let message = `${emojis.new} <b>НОВЫЙ ЗАКАЗ STREET COFFEE</b>\n\n`;
    
    // Информация о клиенте
    message += `${emojis.person} <b>Клиент:</b> ${orderData.customerName}\n`;
    message += `${emojis.phone} <b>Телефон:</b> ${orderData.phone}\n`;
    message += `${emojis.location} <b>Способ получения:</b> ${orderData.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}\n`;
    
    if (orderData.deliveryType === 'delivery' && orderData.address) {
        message += `${emojis.location} <b>Адрес доставки:</b> ${orderData.address}\n`;
    }
    
    message += `${emojis.time} <b>Время:</b> ${orderData.orderTime}\n\n`;
    
    // Детали заказа
    message += `<b>📦 СОСТАВ ЗАКАЗА:</b>\n`;
    message += '────────────────────\n';
    
    orderData.items.forEach((item, index) => {
        const itemEmoji = getEmojiForCategory(item.category);
        message += `${itemEmoji} <b>${item.name}</b>\n`;
        message += `   Количество: ${item.quantity} × ${item.price} руб. = <b>${item.total} руб.</b>\n`;
        
        if (index < orderData.items.length - 1) {
            message += '\n';
        }
    });
    
    message += '\n────────────────────\n';
    message += `${emojis.money} <b>ИТОГО: ${orderData.totalAmount} руб.</b>\n\n`;
    
    // Комментарий
    if (orderData.comment && orderData.comment.trim() !== '') {
        message += `${emojis.warning} <b>КОММЕНТАРИЙ КЛИЕНТА:</b>\n`;
        message += `${orderData.comment}\n\n`;
    }
    
    // Время заказа
    const now = new Date();
    const orderTime = now.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    message += `🕒 <i>Заказ создан: ${orderTime}</i>`;
    
    return message;
}

// Функция формирования данных для email (ОБНОВЛЕННАЯ)
function formatOrderForEmail(orderData) {
    const orderDetails = orderData.items.map(item => 
        `${item.name} - ${item.quantity} × ${item.price} руб. = ${item.total} руб.`
    ).join('\n');

    return {
        to_name: "Street Coffee",
        to_email: EMAIL_CONFIG.toEmail, // Email получателя
        from_name: orderData.customerName,
        from_phone: orderData.phone,
        delivery_type: orderData.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка',
        delivery_address: orderData.deliveryType === 'delivery' ? orderData.address : 'Самовывоз',
        order_time: orderData.orderTime,
        order_details: orderDetails,
        total_amount: orderData.totalAmount,
        customer_comment: orderData.comment || 'Без комментариев',
        order_date: new Date().toLocaleString('ru-RU'),
        subject: `Новый заказ от ${orderData.customerName} - Street Coffee`
    };
}

// Функция для получения эмодзи по категории
function getEmojiForCategory(category) {
    const emojiMap = {
        'coffee': '☕',
        'desserts': '🍰',
        'bread': '🥐',
        'tea': '🍵',
        'other': '📦'
    };
    
    return emojiMap[category] || '📦';
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

// Функция выбора способа отправки
async function chooseDeliveryMethod() {
    return new Promise((resolve) => {
        const modalHTML = `
            <div class="modal fade" id="deliveryMethodModal" tabindex="-1">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Выберите способ уведомления</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <p>Куда отправить уведомление о заказе?</p>
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary" onclick="selectDeliveryMethod('telegram')">
                                    <i class="fa fa-paper-plane"></i> Telegram
                                </button>
                                <button class="btn btn-success" onclick="selectDeliveryMethod('email')">
                                    <i class="fa fa-envelope"></i> Email
                                </button>
                                <button class="btn btn-secondary" onclick="selectDeliveryMethod('both')">
                                    <i class="fa fa-paper-plane"></i> <i class="fa fa-envelope"></i> Оба способа
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем модальное окно в DOM
        if (!document.getElementById('deliveryMethodModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
        const modal = new bootstrap.Modal(document.getElementById('deliveryMethodModal'));
        
        // Обработчики для кнопок
        window.selectDeliveryMethod = function(method) {
            modal.hide();
            resolve(method);
        };
        
        modal.show();
        
        // Если модальное окно закрыто без выбора
        document.getElementById('deliveryMethodModal').addEventListener('hidden.bs.modal', () => {
            if (!window.deliveryMethodSelected) {
                resolve(null);
            }
        });
    });
}

// Основная функция отправки заказа (ОБНОВЛЕННАЯ ВАЛИДАЦИЯ)
async function submitOrder() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
    const address = document.getElementById('address').value.trim();
    const time = document.getElementById('order-time').value;
    const comment = document.getElementById('comment').value.trim();
    
    // Валидация
    if (!name) {
        showAlert('Пожалуйста, введите ваше имя', 'warning');
        document.getElementById('name').focus();
        return;
    }
    
    if (!phone) {
        showAlert('Пожалуйста, введите ваш телефон', 'warning');
        document.getElementById('phone').focus();
        return;
    }
    
    // Обновленная валидация телефона (поддерживает российские номера)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phoneRegex.test(phone) || cleanPhone.length < 10) {
        showAlert('Пожалуйста, введите корректный номер телефона (минимум 10 цифр)', 'warning');
        document.getElementById('phone').focus();
        return;
    }
    
    if (deliveryType === 'delivery' && !address) {
        showAlert('Пожалуйста, укажите адрес доставки', 'warning');
        document.getElementById('address').focus();
        return;
    }
    
    // Формируем данные заказа
    const orderItems = cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        category: item.category
    }));
    
    const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);
    
    const orderData = {
        customerName: name,
        phone: phone,
        deliveryType: deliveryType,
        address: deliveryType === 'delivery' ? address : 'Самовывоз',
        orderTime: getTimeText(time),
        items: orderItems,
        totalAmount: totalAmount + ' руб.',
        comment: comment || 'Без комментариев'
    };
    
    // Выбираем способ отправки
    const deliveryMethod = await chooseDeliveryMethod();
    
    if (!deliveryMethod) {
        showAlert('Выбор способа отправки отменен', 'info');
        return;
    }
    
    // Показываем индикатор загрузки
    const submitBtn = document.querySelector('#orderModal .btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    
    try {
        let telegramSuccess = false;
        let emailSuccess = false;
        
        // Отправляем в выбранные способы
        if (deliveryMethod === 'telegram' || deliveryMethod === 'both') {
            submitBtn.innerHTML = '<i class="fa fa-paper-plane"></i> Отправка в Telegram...';
            const telegramMessage = formatOrderForTelegram(orderData);
            await sendTelegramMessage(telegramMessage);
            telegramSuccess = true;
        }
        
        if (deliveryMethod === 'email' || deliveryMethod === 'both') {
            submitBtn.innerHTML = '<i class="fa fa-envelope"></i> Отправка на Email...';
            const emailData = formatOrderForEmail(orderData);
            await sendEmail(emailData);
            emailSuccess = true;
        }
        
        // Показываем успешное сообщение
        showSuccessMessage(orderData, deliveryMethod, telegramSuccess, emailSuccess);
        
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
        
    } catch (error) {
        console.error('Ошибка отправки заказа:', error);
        showAlert(error.message || 'Ошибка при отправке заказа. Пожалуйста, попробуйте еще раз или позвоните нам.', 'danger');
    } finally {
        // Восстанавливаем кнопку
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function showSuccessMessage(orderData, deliveryMethod, telegramSuccess, emailSuccess) {
    let successMessage = `
        <strong>${orderData.customerName}</strong>, ваш заказ принят!<br><br>
        <strong>Способ получения:</strong> ${orderData.deliveryType === 'pickup' ? 'Самовывоз' : 'Доставка'}<br>
    `;
    
    if (orderData.deliveryType === 'delivery') {
        successMessage += `<strong>Адрес доставки:</strong> ${orderData.address}<br>`;
    }
    
    successMessage += `
        <strong>Телефон:</strong> ${orderData.phone}<br>
        <strong>Время:</strong> ${orderData.orderTime}<br>
        <strong>Сумма заказа:</strong> ${orderData.totalAmount}
    `;
    
    if (orderData.comment !== 'Без комментариев') {
        successMessage += `<br><strong>Комментарий:</strong> ${orderData.comment}`;
    }
    
    // Добавляем информацию о способах отправки
    successMessage += `<br><br><strong>Уведомление отправлено:</strong><br>`;
    
    if (deliveryMethod === 'telegram' || deliveryMethod === 'both') {
        successMessage += `<i class="fa fa-paper-plane text-primary"></i> Telegram ${telegramSuccess ? '✅' : '❌'}<br>`;
    }
    
    if (deliveryMethod === 'email' || deliveryMethod === 'both') {
        successMessage += `<i class="fa fa-envelope text-success"></i> Email на ${EMAIL_CONFIG.toEmail} ${emailSuccess ? '✅' : '❌'}<br>`;
    }
    
    document.getElementById('success-message').innerHTML = successMessage;
}

// Функция показа корзины
function showCart() {
    if (cart.length === 0) {
        showAlert('Корзина пуста!', 'warning');
        return;
    }
    
    openOrderModal();
}

// Функция для тестирования подключения к Telegram боту
async function testTelegramConnection() {
    try {
        const testMessage = `🔧 <b>ТЕСТОВОЕ СООБЩЕНИЕ ОТ STREET COFFEE</b>\n\n` +
                           `Бот успешно подключен и готов к приему заказов! ✅\n\n` +
                           `📊 <b>Информация о подключении:</b>\n` +
                           `🤖 Бот: @street_coffee_orders_bot\n` +
                           `🆔 Chat ID: ${TELEGRAM_CONFIG.chatId}\n` +
                           `📧 Email для уведомлений: ${EMAIL_CONFIG.toEmail}\n` +
                           `📞 Контактный номер: ${APP_CONFIG.defaultPhone}\n` +
                           `🕒 Время: ${new Date().toLocaleString('ru-RU')}\n\n` +
                           `Теперь все заказы будут приходить в этот чат! 🎉`;
        
        await sendTelegramMessage(testMessage);
        showAlert('✅ Тестовое сообщение отправлено успешно! Бот работает корректно.', 'success');
    } catch (error) {
        let errorMessage = '❌ Ошибка подключения к Telegram боту.\n\n';
        
        if (error.message.includes('Chat ID')) {
            errorMessage += 'Проблема с Chat ID:\n';
            errorMessage += '1. Напишите боту в Telegram\n';
            errorMessage += '2. Убедитесь что бот не заблокирован\n';
            errorMessage += '3. Проверьте правильность Chat ID';
        } else if (error.message.includes('токен')) {
            errorMessage += 'Проблема с токеном бота:\n';
            errorMessage += '1. Проверьте токен от @BotFather\n';
            errorMessage += '2. Убедитесь что токен правильный\n';
        } else {
            errorMessage += error.message;
        }
        
        showAlert(errorMessage, 'danger');
    }
}

// Функция для тестирования подключения к EmailJS (ОБНОВЛЕННАЯ)
async function testEmailConnection() {
    try {
        const testEmailData = {
            to_name: "Street Coffee",
            to_email: EMAIL_CONFIG.toEmail, // Используем новый email
            from_name: "Тестовый клиент",
            from_phone: APP_CONFIG.defaultPhone, // Используем новый номер
            delivery_type: "Самовывоз",
            delivery_address: "Тестовый адрес",
            order_time: "Как можно скорее",
            order_details: "Тестовый заказ - 1 × 100 руб. = 100 руб.",
            total_amount: "100 руб.",
            customer_comment: "Тестовое сообщение для проверки отправки на email " + EMAIL_CONFIG.toEmail,
            order_date: new Date().toLocaleString('ru-RU'),
            subject: "Тестовое сообщение от Street Coffee"
        };
        
        await sendEmail(testEmailData);
        showAlert(`✅ Тестовое email отправлено на ${EMAIL_CONFIG.toEmail}! EmailJS работает корректно.`, 'success');
    } catch (error) {
        let errorMessage = '❌ Ошибка подключения к EmailJS.\n\n';
        
        if (error.message.includes('EmailJS не подключен')) {
            errorMessage += 'Добавьте в HTML перед script.js:\n';
            errorMessage += '<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>';
        } else if (error.message.includes('Public Key')) {
            errorMessage += 'Проблема с настройками EmailJS:\n';
            errorMessage += '1. Зарегистрируйтесь на https://emailjs.com\n';
            errorMessage += '2. Создайте сервис и шаблон\n';
            errorMessage += '3. Обновите EMAIL_CONFIG в script.js';
        } else {
            errorMessage += error.message;
        }
        
        showAlert(errorMessage, 'danger');
    }
}

// Обработчики событий (ОБНОВЛЕННЫЕ)
document.addEventListener('DOMContentLoaded', function() {
    displayMenu();
    
    // Устанавливаем номер по умолчанию в форму
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.value = APP_CONFIG.defaultPhone;
        phoneField.placeholder = APP_CONFIG.defaultPhone;
    }
    
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
    
    // Обновляем контактную информацию в футере
    const contactInfo = document.querySelector('#contact .container');
    if (contactInfo) {
        const phoneElement = contactInfo.querySelector('a[href^="tel:"]');
        if (phoneElement) {
            phoneElement.href = `tel:${APP_CONFIG.defaultPhone}`;
            phoneElement.textContent = APP_CONFIG.defaultPhone;
        }
        
        const emailElement = contactInfo.querySelector('a[href^="mailto:"]');
        if (emailElement) {
            emailElement.href = `mailto:${APP_CONFIG.supportEmail}`;
            emailElement.textContent = APP_CONFIG.supportEmail;
        }
    }
    
    // Обработчик изменения способа доставки
    document.querySelectorAll('input[name="deliveryType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const addressField = document.getElementById('address-field');
            if (this.value === 'delivery') {
                addressField.style.display = 'block';
                addressField.querySelector('input').required = true;
            } else {
                addressField.style.display = 'none';
                addressField.querySelector('input').required = false;
            }
        });
    });
    
    // Обработчик формы обратной связи
    document.getElementById('contact-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        if (!name || !email || !message) {
            showAlert('Пожалуйста, заполните все поля формы', 'warning');
            return;
        }
        
        // Показываем индикатор загрузки
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;

        // Имитация отправки (в реальном проекте здесь был бы AJAX запрос)
        setTimeout(() => {
            showAlert('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
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
    
    // Добавляем кнопки тестирования в футер
    const footer = document.querySelector('footer .container');
    
    const testTelegramButton = document.createElement('button');
    testTelegramButton.className = 'btn btn-outline-light btn-sm mt-3 me-2';
    testTelegramButton.innerHTML = '<i class="fa fa-paper-plane"></i> Тест Telegram';
    testTelegramButton.onclick = testTelegramConnection;
    testTelegramButton.title = 'Проверить подключение к Telegram боту';
    footer.appendChild(testTelegramButton);
    
    const testEmailButton = document.createElement('button');
    testEmailButton.className = 'btn btn-outline-light btn-sm mt-3';
    testEmailButton.innerHTML = '<i class="fa fa-envelope"></i> Тест Email';
    testEmailButton.onclick = testEmailConnection;
    testEmailButton.title = `Проверить отправку на ${EMAIL_CONFIG.toEmail}`;
    footer.appendChild(testEmailButton);
    
    // Автоматически тестируем подключение при загрузке страницы
    setTimeout(() => {
        testTelegramConnection();
    }, 2000);
});
