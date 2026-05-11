const RESTAURANT_API_URL = "/api/restaurants";
const CATEGORY_API_URL = "/api/categories";

// restaurantlist.js

//Search
let allRestaurants = [];

function toggleModal(show) {
    const modal = document.getElementById('resModalOverlay');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
        document.body.style.overflow = show ? 'hidden' : 'auto';
    }
}

function resetForm() {
    const doc = document;
    const ids = ['resName', 'resPhone', 'resAddress', 'resOpen', 'resClose', 'resTime', 'resFee', 'resDesc', 'resImage'];
    ids.forEach(id => {
        const el = doc.getElementById(id);
        if (el) el.value = '';
    });
}

// Зургийг жижигсгэж шахах функц
async function compressImage(file, maxWidth, maxHeight) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        };
    });
}

// login uyd
async function saveRestaurant() {
    const doc = document;
    const name = doc.getElementById('resName').value.trim();
    const address = doc.getElementById('resAddress').value.trim();
    const categoryId = doc.getElementById('resCategory').value;

    if (!name) {
        showValidationPopup("Рестораны нэр оруулна уу!");
        return;
    }
    if (!address) {
        showValidationPopup("Хаяг оруулна уу!");
        return;
    }
    if (!categoryId) {
        showValidationPopup("Category сонгоно уу!");
        return;
    }
    const openTime = doc.getElementById('resOpen').value;
const closeTime = doc.getElementById('resClose').value;

if (!openTime || !closeTime) {
    showValidationPopup("Ажиллах цагаа оруулна уу!");
    return;
}

    const imageInput = doc.getElementById('resImage');
    const imageFile = imageInput ? imageInput.files[0] : null;
    let base64Image = "";
    if (imageFile) {
        try {
            base64Image = await compressImage(imageFile, 800, 800);
        } catch (e) {
            console.error("Зураг боловсруулахад алдаа:", e);
        }
    }

    const restaurantData = {
        name: name,
        phoneNumber: doc.getElementById('resPhone').value,
        address: address,
        workingHours: `${doc.getElementById('resOpen').value}-${doc.getElementById('resClose').value}`,
        rating: 0,
        deliveryTime: parseInt(doc.getElementById('resTime').value) || 0,
        deliveryFee: parseFloat(doc.getElementById('resFee').value) || 0,
        description: doc.getElementById('resDesc').value,
        logoUrl: base64Image,
        category: { id: parseInt(categoryId) }
    };

    try {
        const response = await fetch(`${RESTAURANT_API_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(restaurantData)
        });
        if (response.ok) {
            await loadRestaurants();
            toggleModal(false);
            resetForm();
            if (window.parent.resizeIframe) {
                window.parent.resizeIframe();
            }
            showValidationPopup("Амжилттай хадгаллаа!", true);  // ← isSuccess: true
        } else {
            showValidationPopup("Хадгалахад алдаа гарлаа!");
        }
    } catch (err) {
        console.error("Алдаа:", err);
        showValidationPopup("Сервертэй холбогдоход алдаа гарлаа!");
    }
}


async function loadRestaurants() {
    try {
        const res = await fetch(RESTAURANT_API_URL);
        const data = await res.json();

        data.sort((a, b) => a.id - b.id);

        //Search
        allRestaurants = data;
        document.getElementById('resCount').innerText = data.length;
        const list = document.getElementById('restaurantList');

        const role =
            localStorage.getItem("userRole");

        // loadRestaurants функц доторх map хэсэг
        list.innerHTML = data.map(item => {
            let imgSource = "";
            // Баазаас logoUrl эсвэл logo_url нэрээр ирж байгааг шалгана
            const rawUrl = item.logoUrl || item.logo_url;
            if (rawUrl) {
                if (rawUrl.startsWith('/')) {
                    // 1. Root-relative зам (Жишээ нь: /picture/Restaurants/demo_1.jpg)
                    imgSource = rawUrl;
                } else if (rawUrl.startsWith('http')) {
                    // 2. Интернэт линк байвал (https://...)
                    imgSource = rawUrl;
                } else if (rawUrl.startsWith('data:image')) {
                    // 3. Base64 текст байвал
                    imgSource = rawUrl;
                } else {
                    // 4. Зөвхөн файлын нэр байвал (Жишээ нь: asiana_logo.png)
                    imgSource = `./picture/${rawUrl}`;
                }
            } else {
                // 5. Зураг огт байхгүй бол default зураг
                imgSource = './picture/Layout/no%20image.jpg';
            }

            const canShowManage =
                role === "RESTAURANT" &&
                item.managerUserId == null;

            return `
            <div class="res-card"
            onclick="goToRestaurant(${item.id})">

                <img src="${imgSource}" class="res-img" 
                onerror="this.src='./picture/Layout/no%20image.jpg'">

                <div class="res-info">

                    <h3>${item.name}</h3>

                    <p class="category">
                        ${item.category?.categoryName || 'No category'}
                    </p>

                    <div class="res-details">

                        <span>
                            <i class="fas fa-star star-icon"></i>
                            <b>
                                ${item.rating
                                    ? item.rating.toFixed(1)
                                    : "-"}
                                (${item.totalRatings || 0})
                            </b>
                        </span>

                        <span class="dot">●</span>

                        <span>
                            <i class="fas fa-clock time-icon"></i>
                            ${item.deliveryTime || 0} мин
                        </span>

                        <span class="dot">●</span>

                        <span style="color: #00b22d; font-weight: 600;">
                            <i class="fas fa-motorcycle delivery-icon"></i>
                            ${item.deliveryFee == 0 ? 'Free' : '₮' + item.deliveryFee}
                        </span>
            
                    </div>
                </div>

                ${role === "ADMIN" ? `

                    <button class="btn-delete"
                    onclick="event.stopPropagation(); 
                    deleteRestaurant(${item.id})">

                        <i class="fas fa-trash"></i>

                    </button>

                ` : ""}

                ${canShowManage ? `
                    <button class="manage-btn"
                    onclick="
                    event.stopPropagation();
                    manageRestaurant(${item.id})
                    ">
                        Manage Restaurant
                    </button>
                ` : ''}

            </div>
            `;
        }).join('');

        if (window.parent.resizeIframe) {
            window.parent.resizeIframe();
        }
    } catch (err) {
        console.error("Мэдээлэл ачаалахад алдаа:", err);
    }
}

async function deleteRestaurant(id) {
    if (!confirm("Устгахдаа итгэлтэй байна уу?")) return;
    try {
        const res = await fetch(`${RESTAURANT_API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) loadRestaurants();
    } catch (err) {
        alert("Устгахад алдаа гарлаа.");
    }
}

document.addEventListener("DOMContentLoaded", loadRestaurants);

window.addEventListener(
    "focus",
    () => {
        loadRestaurants();
    }
);

// Модалын гадна (overlay) дарахад хаах логик
window.onclick = function (event) {
    const modal = document.getElementById('resModalOverlay');
    if (event.target == modal) {
        toggleModal(false);
    }
}

function showValidationPopup(msg, isSuccess = false) {
    const doc = document;
    const popup = doc.getElementById('validationPopup');
    const msgEl = doc.getElementById('validationMsg');
    msgEl.innerText = msg;
    popup.classList.remove('show', 'success');
    if (isSuccess) popup.classList.add('success');
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show', 'success'), 3000);
}

async function loadCategories() {
    try {
        const res = await fetch(CATEGORY_API_URL);
        const categories = await res.json();
        const select = document.getElementById('resCategory');
        select.innerHTML = '<option value="">Category сонгоно уу</option>';
        categories.forEach(cat => {
            select.innerHTML += `<option value="${cat.id}">${cat.categoryName}</option>`;
        });
    } catch (err) {
        console.error("Category load error:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadRestaurants();
    loadCategories();
    //Search
    const searchInput = window.parent.document.querySelector('.custom-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            if (!query) {
                renderList(allRestaurants);
            } else {
                const filtered = allRestaurants.filter(item =>
                    item.name.toLowerCase().includes(query) ||
                    (item.description && item.description.toLowerCase().includes(query))
                );
                renderList(filtered);
            }
        });
    }
    //switch ajillagaa
    const toggles = window.parent.document.querySelectorAll('.switch input[type="checkbox"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', applyFilters);
    });
});


window.loadCategories = loadCategories;

function goToRestaurant(id) {

    window.parent.location.href =
        `restaurant.html?id=${id}`;

}

// Batja:

const role = localStorage.getItem("userRole");

console.log("ROLE =", role);

if (role !== "ADMIN") {

    const addBtn = document.getElementById("addRestaurantBtn");

    if (addBtn) {
        addBtn.remove();
    }

}

async function manageRestaurant(id) {

    const userId =
        localStorage.getItem("userId");

    try {

        const response = await fetch(
            `/api/restaurants/${id}/claim`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userId
                })
            }
        );

        if (!response.ok) {
            alert("This restaurant already has a manager.");
            return;
        }

        localStorage.setItem(
            "restaurantId",
            id
        );

        window.parent.location.href =
            `restaurant.html?id=${id}`;

    } catch (error) {

        console.error(
            "Restaurant claim error:",
            error
        );

    }

}

//Search 
function renderList(data) {
    document.getElementById('resCount').innerText = data.length;
    const list = document.getElementById('restaurantList');

    if (data.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:40px; color:#999;">
                <i class="fas fa-search" style="font-size:40px; margin-bottom:10px; display:block;"></i>
                <p>Илэрц олдсонгүй</p>
            </div>`;
        return;
    }

    list.innerHTML = data.map(item => {
        let imgSource = "";
        const rawUrl = item.logoUrl || item.logo_url;
        if (rawUrl) {
            if (rawUrl.startsWith('/')) imgSource = rawUrl;
            else if (rawUrl.startsWith('http')) imgSource = rawUrl;
            else if (rawUrl.startsWith('data:image')) imgSource = rawUrl;
            else imgSource = `./picture/${rawUrl}`;
        } else {
            imgSource = './picture/Layout/no%20image.jpg';
        }
        return `
            <div class="res-card" onclick="goToRestaurant(${item.id})">
                <img src="${imgSource}" class="res-img" onerror="this.src='./picture/Layout/no%20image.jpg'">
                <div class="res-info">
                    <h3>${item.name}</h3>
                    <p class="category">${item.category?.categoryName || 'No category'}</p>
                    <div class="res-details">
                        <span><i class="fas fa-star star-icon"></i> <b>
                                ${item.rating
                                            ? item.rating.toFixed(1)
                                            : "-"}

                                (${item.totalRatings || 0})
                            </b>
                        </span>
                        <span class="dot">●</span>
                        <span><i class="fas fa-clock time-icon"></i> ${item.deliveryTime || 0} мин</span>
                        <span class="dot">●</span>
                        <span style="color: #00b22d; font-weight: 600;">
                            <i class="fas fa-motorcycle delivery-icon"></i>
                            ${item.deliveryFee == 0 ? 'Free' : '₮' + item.deliveryFee}
                        </span>
                    </div>
                </div>
                ${role === "ADMIN" ? `

                    <button class="btn-delete"
                    onclick="event.stopPropagation(); 
                    deleteRestaurant(${item.id})">

                        <i class="fas fa-trash"></i>

                    </button>

                ` : ""}
            </div>
        `;
    }).join('');

    if (window.parent.resizeIframe) window.parent.resizeIframe();
}

//Dropdown sort hiihiin tuld
function sortRestaurants(type) {
    let sorted = [...allRestaurants];
    if (type === 'az') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (type === 'za') {
        sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else if (type === 'recommended') {
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    renderList(sorted);
}

function applyFilters() {

    const toggles =
    window.parent.document.querySelectorAll(
        '.switch input[type="checkbox"]'
    );

    const openNow =
    toggles[0]?.checked;

    const freeDelivery =
    toggles[1]?.checked;

    let filtered =
    [...allRestaurants];

    // FREE DELIVERY FILTER

    if (freeDelivery) {

        filtered =
        filtered.filter(
            item => item.deliveryFee == 0
        );

    } else {

        filtered =
        filtered.filter(
            item => item.deliveryFee > 0
        );
    }

    // OPEN NOW FILTER

    if (openNow) {

        const now =
        new Date();

        const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();

        filtered =
        filtered.filter(item => {

            if (!item.workingHours)
                return true;

            const parts =
            item.workingHours.split('-');

            if (parts.length < 2)
                return true;

            const [openH, openM] =
            parts[0]
            .trim()
            .split(':')
            .map(Number);

            const [closeH, closeM] =
            parts[1]
            .trim()
            .split(':')
            .map(Number);

            const open =
            openH * 60 + openM;

            const close =
            closeH * 60 + closeM;

            return currentMinutes >= open &&
                   currentMinutes <= close;
        });
    }

    renderList(filtered);
}

function filterRestaurantsByCategory(categoryId) {
    // allRestaurants ачаалагдаагүй бол хүлээ
    if (!allRestaurants || allRestaurants.length === 0) {
        setTimeout(() => filterRestaurantsByCategory(categoryId), 300);
        return;
    }

    if (!categoryId) {
        renderList(allRestaurants);
        return;
    }

    const filtered = allRestaurants.filter(item =>
        String(item.category?.id) === String(categoryId)
    );
    renderList(filtered);
}

window.filterRestaurantsByCategory = filterRestaurantsByCategory;

async function validateAndSaveRestaurant() {
    const phone = document.getElementById('resPhone').value.trim();
    const time = document.getElementById('resTime').value;
    const fee = document.getElementById('resFee').value;

    if (!phone) {
        showValidationPopup("Утасны дугаар оруулна уу!");
        return;
    }
    if (!time || parseInt(time) <= 0) {
        showValidationPopup("Хүргэлтийн хугацаа оруулна уу!");
        return;
    }
    if (fee === '' || parseFloat(fee) < 0) {
        showValidationPopup("Хүргэлтийн үнэ оруулна уу!");
        return;
    }

    return saveRestaurant();
}