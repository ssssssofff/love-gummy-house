// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {

    // --- Функции для работы с корзиной в localStorage ---
    function getCart() {
        let cart = localStorage.getItem('cart');
        if (cart) {
            return JSON.parse(cart);
        } else {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Обновление счетчика в шапке
    function updateCartCount() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const countElements = document.querySelectorAll('#cart-count');
        countElements.forEach(el => {
            el.textContent = totalItems;
        });
    }

    // --- Добавление товара в корзину ---
    const addButtons = document.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card');
            if (!card) return;

            const id = card.dataset.id;
            const name = card.dataset.name;
            const price = parseInt(card.dataset.price);
            const imgSrc = card.querySelector('.product-img')?.src || '';

            let cart = getCart();
            // Проверяем, есть ли уже такой товар в корзине
            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: id,
                    name: name,
                    price: price,
                    quantity: 1,
                    img: imgSrc
                });
            }
            saveCart(cart);
            alert(`✅ "${name}" добавлен в корзину!`);
        });
    });

    // --- Отображение корзины на странице cart.html ---
    const cartContainer = document.getElementById('cart-items-container');
    const totalPriceSpan = document.getElementById('total-price');

    if (cartContainer) {
        function renderCart() {
            const cart = getCart();
            cartContainer.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                cartContainer.innerHTML = `<div class="bento-item" style="text-align:center; grid-column:1/-1;"><h3>Ваша корзина пуста 😢</h3><p>Перейдите в <a href="catalog.html">каталог</a>, чтобы выбрать сладости!</p></div>`;
                totalPriceSpan.textContent = '0';
                return;
            }

            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item bento-item';
                itemDiv.innerHTML = `
                    <div class="cart-item-info">
                        <img src="${item.img || 'images/placeholder.png'}" alt="${item.name}" class="cart-item-img">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">${item.price} ₽ x ${item.quantity}</span>
                    </div>
                    <div>
                        <span style="font-weight:700; margin-right:15px;">${item.price * item.quantity} ₽</span>
                        <button class="remove-item-btn" data-index="${index}">Удалить</button>
                    </div>
                `;
                cartContainer.appendChild(itemDiv);
            });

            totalPriceSpan.textContent = total;

            // Добавляем обработчики для кнопок "Удалить"
            document.querySelectorAll('.remove-item-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    let cart = getCart();
                    cart.splice(index, 1);
                    saveCart(cart);
                    renderCart(); // Перерисовываем корзину
                });
            });
        }

        renderCart();

        // Очистка корзины
        const clearBtn = document.getElementById('clear-cart-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                if (confirm('Вы уверены, что хотите очистить корзину?')) {
                    saveCart([]);
                    renderCart();
                }
            });
        }
    }

    // Обновляем счетчик при загрузке любой страницы
    updateCartCount();

});