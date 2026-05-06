// Элемент барьж авах
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const signInBtn = document.getElementById('signIn');
const createAccBtn = document.getElementById('createacc');
document.addEventListener('DOMContentLoaded', () => {
    console.log("FoodieGo үндсэн JS ачаалагдлаа.");
    // 1. Өгөгдөл ачаалах
    loadRestaurants();
    setupSearch();
    // 2. Эрх шалгаж UI-г шинэчлэх (ADMIN, RESTAURANT эсвэл CUSTOMER)
    updateUIBasedOnRole();
    // 3. Эвент сонсогчид (Давхардлыг арилгав)
    const signInBtn = document.getElementById('signIn');
    const createAccBtn = document.getElementById('createacc');
    if (signInBtn) {
        signInBtn.addEventListener('click', openLoginModal);
    }
    if (createAccBtn) {
        createAccBtn.addEventListener('click', openRegisterModal);
    }
});

// --- UI-г эрхээр удирдах функц ---
function updateUIBasedOnRole() {
    const role = localStorage.getItem("userRole");
    console.log("Одоогийн эрх:", role);
    // .admin-only болон .restaurant-only кластай бүх элементүүдийг олох
    const adminElements = document.querySelectorAll('.admin-only');
    const restaurantElements = document.querySelectorAll('.restaurant-only');
    // Эхлээд бүгдийг нууна
    adminElements.forEach(el => el.style.display = 'none');
    restaurantElements.forEach(el => el.style.display = 'none');
    // Эрхийн дагуу харуулна
    if (role === "ADMIN") {
        adminElements.forEach(el => el.style.display = 'block');
    } else if (role === "RESTAURANT") {
        restaurantElements.forEach(el => el.style.display = 'block');
    }
}
// --- Ресторан ачаалах функц ---
async function loadRestaurants() {
    const restaurantList = document.getElementById('restaurantList');
    if (!restaurantList) return;
    try {
        const response = await fetch('http://localhost:8080/api/restaurants');
        const data = await response.json();
        restaurantList.innerHTML = '';
        data.forEach(res => {
            // Энд жишээ нь "Устгах" товч зөвхөн ADMIN-д харагдахаар класс нэмж болно
            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card restaurant-card">
                        <div onclick="location.href='restaurant-detail.html?id=${res.id}'" style="cursor:pointer;">
                            <img src="${res.imageUrl || 'img/default-res.jpg'}" class="card-img-top restaurant-img" alt="${res.name}">
                            <div class="card-body">
                                <h5 class="card-title">${res.name}</h5>
                                <p class="card-text text-muted">${res.description || 'Амттай хоол, тухтай орчин'}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="rating-badge">★ ${res.rating || '5.0'}</span>
                                    <small class="text-muted">${res.address}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            restaurantList.innerHTML += card;
        });
    } catch (error) {
        console.error("Ресторан ачаалахад алдаа гарлаа:", error);
        restaurantList.innerHTML = '<p class="text-danger text-center">Өгөгдөл ачаалахад алдаа гарлаа.</p>';
    }
}
// --- Хайлтын функц ---
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.onkeyup = function() {
            console.log("Хайж байна: " + this.value);
        };
    }
}

// --- Модал удирдах функцууд ---
// const loginModal = document.getElementById('loginModal');
// const registerModal = document.getElementById('registerModal');
function openLoginModal() { if (loginModal) loginModal.style.display = 'flex'; }
function closeLoginModal() { if (loginModal) loginModal.style.display = 'none'; }
function openRegisterModal() { if (registerModal) registerModal.style.display = 'flex'; }
function closeRegisterModal() { if (registerModal) registerModal.style.display = 'none'; }
// // ===============================
// 🛒 CART LOGIC (САГСНЫ ҮНДСЭН ЛОГИК)
// ==================================

// Cart доторх бүх item-ийг хадгалах array
// Жишээ: [{ id: 1, name: "Burger", quantity: 2 }]
let cart = [];

// -------------------------------
// 🔢 CART ДЭЭРХ НИЙТ ТООГ ТООЦООЛОХ
// -------------------------------
function updateCartCount() {

    // Cart доторх бүх item-үүдийн quantity-г нийлүүлнэ
    const totalCount = cart.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);

    // HTML дээрх basketCounter элементийг олж
    const counterELement = document.getElementById("basketCounter");

    // Хэрвээ элемент байвал → текстийг шинэчилнэ
    if (counterELement) {
        counterELement.innerText = totalCount;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log("FoodieGo үндсэн JS ачаалагдлаа.");

    // 1. Рестораны жагсаалтыг ачаалах
    // loadRestaurants();
    // Модол нээх
    signInBtn.onclick = function () {
        loginModal.style.display = "block";
    }

    createAccBtn.onclick = function () {
        registerModal.style.display = "block";
    }

    // Модол хаах 
    function closeLoginModal() {
        loginModal.style.display = "none";
    }

    try {
        const response = await fetch('http://localhost:8080/api/restaurants');
        const data = await response.json();

        // restaurantList.innerHTML = ''; // Уншиж байна гэсэн бичгийг арилгах
    } catch (error) {
        console.error("Fetch error:", error);
    }
});

// Гадна талд дарахад хаах
window.onclick = function(event) {
    if (event.target === loginModal) closeLoginModal();
    if (event.target === registerModal) closeRegisterModal();
};

// Iframe эсвэл бусад хуудаснаас ирэх мессеж сонсох
window.addEventListener('message', function(e) {
    if (e.data === 'openLogin') {
        closeRegisterModal();
        openLoginModal();
    } else if (e.data === 'openRegister') {
        closeLoginModal();
        openRegisterModal();
    }
});

function toggleSortDropdown(event) {
    event.stopPropagation();
    document.getElementById('sortPopup').classList.toggle('open');
}

// Create account товчлуур
document.getElementById('createacc').addEventListener('click', function () {
    openRegisterModal();
});
function cancelSort() {
    document.getElementById('sortPopup').classList.remove('open');
}

function applySort(event) {
    const selected = document.querySelector('input[name="sort"]:checked');
    const labels = {
        recommended: 'Recommended',
        az: 'Alphabetical (A–Z)',
        za: 'Alphabetical (Z–A)',
        distance: 'Distance'
    };
    document.getElementById('sortLabel').textContent = labels[selected.value];
     document.getElementById('sortPopup').classList.remove('open');
};

function cancelSort(event) {
    event.stopPropagation();
    document.getElementById('sortPopup').classList.remove('open');
}
document.querySelectorAll('.stars i').forEach((star, index, stars) => {
    // Hover hiinguut odnuud fill hiigdene
    star.addEventListener('mouseover', () => {
        stars.forEach((s, i) => {
            s.className = i <= index ? 'fas fa-star' : 'far fa-star';
        });
    });

    // Sign in товч → loginModal
    document.getElementById('signIn').addEventListener('click', function () {
        openLoginModal();
    });

    // Create account товч → registerModal
    document.getElementById('createacc').addEventListener('click', function () {
        openRegisterModal();
    });
});

// ===============================
// 🛒 TOGGLE CART POPUP
// ===============================
// Opens or closes the cart popup when user clicks the cart icon
function toggleCart() {
    const popup = document.getElementById("cartPopup");

    if (popup.style.display === "block") {
        popup.style.display = "none"; // hide
    } else {
        renderCart();
        popup.style.display = "block"; // show
    }
}

// function for start ordering button
function startOrdering() {
    // close popup
    document.getElementById("cartPopup").style.display = "none";

    // scroll to category
    const categorySection = document.querySelector(".category-section");

    if (categorySection) {
        categorySection.scrollIntoView({
            behavior: "smooth"
        });
    }
}

// render cart popup
function renderCart() {
    const popup = document.getElementById("cartPopup");

    // empty state
    if (cart.length === 0) {
        popup.classList.add("empty");
        popup.classList.remove("filled");

        popup.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6 20C5.45 20 4.97933 19.8043 4.588 19.413C4.19667 19.0217 4.00067 18.5507 4 18C3.99933 17.4493 4.19533 16.9787 4.588 16.588C4.98067 16.1973 5.45133 16.0013 6 16C6.54867 15.9987 7.01967 16.1947 7.413 16.588C7.80633 16.9813 8.002 17.452 8 18C7.998 18.548 7.80233 19.019 7.413 19.413C7.02367 19.807 6.55267 20.0027 6 20ZM16 20C15.45 20 14.9793 19.8043 14.588 19.413C14.1967 19.0217 14.0007 18.5507 14 18C13.9993 17.4493 14.1953 16.9787 14.588 16.588C14.9807 16.1973 15.4513 16.0013 16 16C16.5487 15.9987 17.0197 16.1947 17.413 16.588C17.8063 16.9813 18.002 17.452 18 18C17.998 18.548 17.8023 19.019 17.413 19.413C17.0237 19.807 16.5527 20.0027 16 20ZM4.2 2H18.95C19.3333 2 19.625 2.171 19.825 2.513C20.025 2.855 20.0333 3.20067 19.85 3.55L16.3 9.95C16.1167 10.2833 15.871 10.5417 15.563 10.725C15.255 10.9083 14.9173 11 14.55 11H7.1L6 13H18V15H6C5.25 15 4.68333 14.671 4.3 14.013C3.91667 13.355 3.9 12.7007 4.25 12.05L5.6 9.6L2 2H0V0H3.25L4.2 2Z"
                    fill="black" />
            </svg>
            <h4>Your cart is empty</h4>
            <p>Add drinks or foods from a restaurant to start a new cart</p>
            <button onclick="event.stopPropagation(); startOrdering()">Start ordering</button>
        `;
        return;
    }

    // filled state
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

        <div class="cart-items">
            ${itemsHTML}
        </div>

        <div class="cart-summary">
            <div><span>Subtotal</span><span>$ ${subtotal.toFixed(2)}</span></div>
            <div><span>Delivery cost </span><span>Free</span></div>
            <div><strong>Total</strong><strong>$ ${subtotal.toFixed(2)}</strong></div>
        </div>

        <button class="checkout-btn">Go to checkout</button>
    `;

    setTimeout(() => {
        const btn = document.querySelector(".checkout-btn");
        if (btn) {
            btn.addEventListener("click", goToCheckout);
        }
    }, 0);
}

// call renderCart on addToCart button
function addToCart(item) {
    const existingItem = cart.find(i => i.id === item.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCartCount();
    renderCart(); // most important
}

function increaseQty(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity++;
    }

    updateCartCount();
    renderCart();
}

function decreaseQty(id) {
    const item = cart.find(i => i.id === id);

    if (!item) return;

    if (item.quantity > 1) {
        item.quantity--;
    } else {
        // if quantity is 1 -> delete
        cart = cart.filter(i => i.id !== id);
    }

    updateCartCount();
    renderCart();
}

// button goToCheckout activation
function goToCheckout() {
    if (cart.length === 0) {
        return;
    }

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // cart data hadgalna
    localStorage.setItem("cart", JSON.stringify(cart));

    if (!isLoggedIn) {
        // login hiisnii daraa checkout ruu butsna
        localStorage.setItem("redirectAfterLogin", "checkout.html");
        window.location.href = "login.html";
    } else {
        // shuud checkout
        window.location.href = "checkout.html";
    }
}

// // // Mouse-aa holduulahaar umnuh saved baisan helberluugee butsna
// // star.addEventListener('mouseout', () => {
// //     const saved = parseInt(document.querySelector('.stars').dataset.rating || 0);
// //     stars.forEach((s, i) => {
// //         s.className = i < saved ? 'fas fa-star' : 'far fa-star';
// //     });
// // });

// // // CLick hiinguut hadgalna
// // star.addEventListener('click', () => {
// //     document.querySelector('.stars').dataset.rating = index + 1;
// //     stars.forEach((s, i) => {
// //         s.className = i <= index ? 'fas fa-star' : 'far fa-star';
// //     });
// // });
//     // CLick hiinguut hadgalna
//     star.addEventListener('click', () => {
//         document.querySelector('.stars').dataset.rating = index + 1;
//         stars.forEach((s, i) => {
//             s.className = i <= index ? 'fas fa-star' : 'far fa-star';
//         });
//     });
// });

window.addEventListener('load', function() {
    const iframe = document.getElementById('restaurantIframe');
    // Iframe ачаалагдаж дуусахад өндрийг нь тохируулах
    iframe.onload = function() {
        const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframe.style.height = innerDoc.body.scrollHeight + 'px';
    };
});

// Хэрэв ресторан нэмэгдэж өндөр нь өөрчлөгдвөл дахин тохируулах функц
function resizeIframe() {
    const iframe = document.getElementById('restaurantIframe');
    if (iframe) {
        const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframe.style.height = innerDoc.body.scrollHeight + 'px';
    }
};

// 2 секунд тутамд өндрийг шалгаж байх (Хэрэв дотор нь динамик өөрчлөлт ордог бол)
// setInterval(resizeIframe, 2000);