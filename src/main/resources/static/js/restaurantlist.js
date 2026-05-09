const RESTAURANT_API_URL = "http://localhost:8080/api/restaurants";
const CATEGORY_API_URL = "http://localhost:8080/api/categories";

// Search
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
    const ids = ['resName', 'resPhone', 'resAddress', 'resHours', 'resTime', 'resFee', 'resRating', 'resDesc', 'resImage'];
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

async function saveRestaurant() {
    const doc = document;
    const name = doc.getElementById('resName').value.trim();
    const address = doc.getElementById('resAddress').value.trim();
    const categoryId = doc.getElementById('resCategory').value;

    if (!name || !address || !categoryId) {
        showValidationPopup("Мэдээллээ бүрэн бөглөнө үү!");
        return;
    }

    const imageInput = doc.getElementById('resImage');
    const imageFile = imageInput ? imageInput.files[0] : null;
    let base64Image = "";
    if (imageFile) {
        base64Image = await compressImage(imageFile, 800, 800);
    }

    const restaurantData = {
        name: name,
        phoneNumber: doc.getElementById('resPhone').value,
        address: address,
        workingHours: doc.getElementById('resHours').value,
        deliveryTime: parseInt(doc.getElementById('resTime').value) || 0,
        deliveryFee: parseFloat(doc.getElementById('resFee').value) || 0,
        rating: parseFloat(doc.getElementById('resRating').value) || 0.0,
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
            showValidationPopup("Амжилттай хадгаллаа!", true);
        }
    } catch (err) {
        console.error("Алдаа:", err);
    }
}

async function loadRestaurants() {
    try {
        const res = await fetch(RESTAURANT_API_URL);
        const data = await res.json();
        allRestaurants = data;  
        renderList(data);
    } catch (err) {
        console.error("Мэдээлэл ачаалахад алдаа:", err);
    }
}

function renderList(data) {
    const countEl = document.getElementById('resCount');
    if (countEl) countEl.innerText = data.length;
    
    const list = document.getElementById('restaurantList');
    if (!list) return;

    if (data.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:40px; color:#999;"><p>Илэрц олдсонгүй</p></div>`;
        return;
    }

    list.innerHTML = data.map(item => {
        let imgSource = "";
        const rawUrl = item.logoUrl || item.logo_url;
        if (rawUrl) {
            if (rawUrl.startsWith('http')) imgSource = rawUrl;
            else if (rawUrl.startsWith('data:image')) imgSource = rawUrl;
            else imgSource = `./picture/${rawUrl}`;
        } else {
            imgSource = './picture/Layout/no image.jpg';
        }

        const role = localStorage.getItem("userRole");
        const currentUserId = localStorage.getItem("userId");
        const isOwner = String(item.managerUserId) === String(currentUserId);
        const canShowManage = role === "RESTAURANT" && (item.managerUserId == null || isOwner);

        return `
            <div class="res-card" onclick="goToRestaurant(${item.id})">
                <img src="${imgSource}" class="res-img" onerror="this.src='./picture/Layout/Foodie Go.png'">
                <div class="res-info">
                    <h3>${item.name}</h3>
                    <p class="category">${item.category?.categoryName || 'No category'}</p>
                    <div class="res-details">
                        <span><i class="fas fa-star star-icon"></i> <b>${item.rating || '0.0'} (${item.reviewCount || 0}+)</b></span>
                        <span class="dot">●</span>
                        <span><i class="fas fa-clock time-icon"></i> ${item.deliveryTime || 0} мин</span>
                        <span class="dot">●</span>
                        <span style="color: #00b22d; font-weight: 600;">
                            <i class="fas fa-motorcycle delivery-icon"></i>
                            ${item.deliveryFee == 0 ? 'Free' : '₮' + item.deliveryFee}
                        </span>
                    </div>
                </div>
                <button class="btn-delete" style="visibility: ${role === 'ADMIN' ? 'visible' : 'hidden'}" onclick="event.stopPropagation(); deleteRestaurant(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
                ${canShowManage ? `<button class="manage-btn" onclick="event.stopPropagation(); manageRestaurant(${item.id})">Manage Restaurant</button>` : ''}
            </div>`;
    }).join('');

    if (window.parent.resizeIframe) window.parent.resizeIframe();
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

document.addEventListener("DOMContentLoaded", () => {
    loadRestaurants();
    loadCategories();
    
    const searchInput = window.parent.document.querySelector('.custom-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
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
});

function goToRestaurant(id) {
    window.parent.location.href = `restaurant.html?id=${id}`;
}

async function loadCategories() {
    try {
        const res = await fetch(CATEGORY_API_URL);
        const categories = await res.json();
        const select = document.getElementById('resCategory');
        if (select) {
            select.innerHTML = '<option value="">Category сонгоно уу</option>';
            categories.forEach(cat => {
                select.innerHTML += `<option value="${cat.id}">${cat.categoryName}</option>`;
            });
        }
    } catch (err) {
        console.error("Category load error:", err);
    }
}

function showValidationPopup(msg, isSuccess = false) {
    const popup = document.getElementById('validationPopup');
    const msgEl = document.getElementById('validationMsg');
    if (popup && msgEl) {
        msgEl.innerText = msg;
        popup.classList.remove('show', 'success');
        if (isSuccess) popup.classList.add('success');
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show', 'success'), 3000);
    }
}

// Эрэмбэлэх функц
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

// Шүүлтүүр функц
function applyFilters() {
    const toggles = window.parent.document.querySelectorAll('.switch input[type="checkbox"]');
    const openNow = toggles[0]?.checked;
    const freeDelivery = toggles[1]?.checked;

    let filtered = [...allRestaurants];

    if (freeDelivery) {
        filtered = filtered.filter(item => item.deliveryFee == 0);
    }

    if (openNow) {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        filtered = filtered.filter(item => {
            if (!item.workingHours) return true;
            const parts = item.workingHours.split('-');
            if (parts.length < 2) return true;
            const [openH, openM] = parts[0].trim().split(':').map(Number);
            const [closeH, closeM] = parts[1].trim().split(':').map(Number);
            const open = openH * 60 + openM;
            const close = closeH * 60 + closeM;
            return currentMinutes >= open && currentMinutes <= close;
        });
    }
    renderList(filtered);
}