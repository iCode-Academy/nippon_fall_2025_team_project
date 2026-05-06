// Элемент барьж авах
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const signInBtn = document.getElementById('signIn');
const createAccBtn = document.getElementById('createacc');

// ===============================
// 🛒 CART LOGIC
// ===============================
let cart = [];

function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counterELement = document.getElementById("basketCounter");
    if (counterELement) {
        counterELement.innerText = totalCount;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("FoodieGo үндсэн JS ачаалагдлаа.");

    loadRestaurants();

    signInBtn.onclick = function() {
        loginModal.style.display = "flex";
    }

    createAccBtn.onclick = function() {
        registerModal.style.display = "flex";
    }

    window.onclick = function(event) {
        if (event.target == loginModal) {
            loginModal.style.display = "none";
        }
        if (event.target == registerModal) {
            registerModal.style.display = "none";
        }
        if (typeof catModal !== 'undefined' && event.target == catModal) {
            catModal.style.display = "none";
        }
    }

    // Stars rating
    document.querySelectorAll('.stars i').forEach((star, index, stars) => {
        star.addEventListener('mouseover', () => {
            stars.forEach((s, i) => {
                s.className = i <= index ? 'fas fa-star' : 'far fa-star';
            });
        });

        star.addEventListener('mouseout', () => {
            const saved = parseInt(document.querySelector('.stars').dataset.rating || 0);
            stars.forEach((s, i) => {
                s.className = i < saved ? 'fas fa-star' : 'far fa-star';
            });
        });

        star.addEventListener('click', () => {
            document.querySelector('.stars').dataset.rating = index + 1;
            stars.forEach((s, i) => {
                s.className = i <= index ? 'fas fa-star' : 'far fa-star';
            });
        });
    });
});

// ===============================
// 🔍 MODAL FUNCTIONS
// ===============================
function closeLoginModal() {
    loginModal.style.display = "none";
}

function closeRegisterModal() {
    registerModal.style.display = "none";
}

// ===============================
// 🔍 SORT DROPDOWN
// ===============================
function toggleSortDropdown(event) {
    event.stopPropagation();
    document.getElementById('sortPopup').classList.toggle('open');
}

function cancelSort(event) {
    event.stopPropagation();
    document.getElementById('sortPopup').classList.remove('open');
}

function applySort(event) {
    event.stopPropagation();
    const selected = document.querySelector('input[name="sort"]:checked');
    const labels = {
        recommended: 'Recommended',
        az: 'Alphabetical (A–Z)',
        za: 'Alphabetical (Z–A)',
        distance: 'Distance'
    };
    document.getElementById('sortLabel').textContent = labels[selected.value];
    document.getElementById('sortPopup').classList.remove('open');
}

// ===============================
// 🍽️ LOAD RESTAURANTS
// ===============================
async function loadRestaurants() {
    try {
        const response = await fetch('http://localhost:8080/api/restaurants');
        const data = await response.json();
        const restaurantList = document.getElementById('restaurantList');
        if (restaurantList) {
            restaurantList.innerHTML = '';
        }
    } catch(e) {
        console.error('Restaurant ачаалахад алдаа гарлаа:', e);
    }
}

// ===============================
// 🛒 TOGGLE CART POPUP
// ===============================
function toggleCart() {
    const popup = document.getElementById("cartPopup");
    if (popup.style.display === "block") {
        popup.style.display = "none";
    } else {
        renderCart();
        popup.style.display = "block";
    }
}

function startOrdering() {
    document.getElementById("cartPopup").style.display = "none";
    const categorySection = document.querySelector(".category-section");
    if (categorySection) {
        categorySection.scrollIntoView({ behavior: "smooth" });
    }
}

function renderCart() {
    const popup = document.getElementById("cartPopup");

    if (cart.length === 0) {
        popup.classList.add("empty");
        popup.classList.remove("filled");
        popup.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 20C5.45 20 4.97933 19.8043 4.588 19.413C4.19667 19.0217 4.00067 18.5507 4 18C3.99933 17.4493 4.19533 16.9787 4.588 16.588C4.98067 16.1973 5.45133 16.0013 6 16C6.54867 15.9987 7.01967 16.1947 7.413 16.588C7.80633 16.9813 8.002 17.452 8 18C7.998 18.548 7.80233 19.019 7.413 19.413C7.02367 19.807 6.55267 20.0027 6 20ZM16 20C15.45 20 14.9793 19.8043 14.588 19.413C14.1967 19.0217 14.0007 18.5507 14 18C13.9993 17.4493 14.1953 16.9787 14.588 16.588C14.9807 16.1973 15.4513 16.0013 16 16C16.5487 15.9987 17.0197 16.1947 17.413 16.588C17.8063 16.9813 18.002 17.452 18 18C17.998 18.548 17.8023 19.019 17.413 19.413C17.0237 19.807 16.5527 20.0027 16 20ZM4.2 2H18.95C19.3333 2 19.625 2.171 19.825 2.513C20.025 2.855 20.0333 3.20067 19.85 3.55L16.3 9.95C16.1167 10.2833 15.871 10.5417 15.563 10.725C15.255 10.9083 14.9173 11 14.55 11H7.1L6 13H18V15H6C5.25 15 4.68333 14.671 4.3 14.013C3.91667 13.355 3.9 12.7007 4.25 12.05L5.6 9.6L2 2H0V0H3.25L4.2 2Z" fill="black" />
            </svg>
            <h4>Your cart is empty</h4>
            <p>Add drinks or foods from a restaurant to start a new cart</p>
            <button onclick="event.stopPropagation(); startOrdering()">Start ordering</button>
        `;
        return;
    }

    popup.classList.remove("empty");
    popup.classList.add("filled");

    let itemsHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                ${item.quantity}x <strong>${item.name}</strong>
                <div>$ ${item.price.toFixed(2)}</div>
            </div>
            <div class="qty-control">
                <button onclick="event.stopPropagation(); decreaseQty(${item.id})">-</button>
                <span>${item.quantity}</span>
                <button onclick="event.stopPropagation(); increaseQty(${item.id})">+</button>
            </div>
        </div>
        <hr/>
    `).join("");

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    popup.innerHTML = `
        <h4>Your order</h4>
        <div class="cart-items">${itemsHTML}</div>
        <div class="cart-summary">
            <div><span>Subtotal</span><span>$ ${subtotal.toFixed(2)}</span></div>
            <div><span>Delivery cost </span><span>Free</span></div>
            <div><strong>Total</strong><strong>$ ${subtotal.toFixed(2)}</strong></div>
        </div>
        <button class="checkout-btn">Go to checkout</button>
    `;

    setTimeout(() => {
        const btn = document.querySelector(".checkout-btn");
        if (btn) btn.addEventListener("click", goToCheckout);
    }, 0);
}

function addToCart(item) {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartCount();
    renderCart();
}

function increaseQty(id) {
    const item = cart.find(i => i.id === id);
    if (item) item.quantity++;
    updateCartCount();
    renderCart();
}

function decreaseQty(id) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart = cart.filter(i => i.id !== id);
    }
    updateCartCount();
    renderCart();
}

function goToCheckout() {
    if (cart.length === 0) return;
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "checkout.html";
}


function closeResModal() {
    document.getElementById('resModalOverlay').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function saveRestaurantFromParent() {
    const iframe = document.getElementById('restaurantIframe');
    iframe.contentWindow.saveRestaurant();
}
