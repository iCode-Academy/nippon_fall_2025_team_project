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
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
function openLoginModal() { if (loginModal) loginModal.style.display = 'flex'; }
function closeLoginModal() { if (loginModal) loginModal.style.display = 'none'; }
function openRegisterModal() { if (registerModal) registerModal.style.display = 'flex'; }
function closeRegisterModal() { if (registerModal) registerModal.style.display = 'none'; }

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

    // Mouse-aa holduulahaar umnuh saved baisan helberluugee butsna
    star.addEventListener('mouseout', () => {
        const saved = parseInt(document.querySelector('.stars').dataset.rating || 0);
        stars.forEach((s, i) => {
            s.className = i < saved ? 'fas fa-star' : 'far fa-star';
        });
    });

    // CLick hiinguut hadgalna
    star.addEventListener('click', () => {
        document.querySelector('.stars').dataset.rating = index + 1;
        stars.forEach((s, i) => {
            s.className = i <= index ? 'fas fa-star' : 'far fa-star';
        });
    });
});

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
}

// 2 секунд тутамд өндрийг шалгаж байх (Хэрэв дотор нь динамик өөрчлөлт ордог бол)
setInterval(resizeIframe, 2000);


