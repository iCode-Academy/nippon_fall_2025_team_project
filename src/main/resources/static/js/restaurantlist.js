const RESTAURANT_API_URL = "http://localhost:8080/api/restaurants";
const CATEGORY_API_URL = "http://localhost:8080/api/categories";

// restaurantlist.js
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
        workingHours: doc.getElementById('resHours').value,
        deliveryTime: parseInt(doc.getElementById('resTime').value) || 0,
        deliveryFee: parseFloat(doc.getElementById('resFee').value) || 0,
        rating: parseFloat(doc.getElementById('resRating').value) || 0,
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
        document.getElementById('resCount').innerText = data.length;
        const list = document.getElementById('restaurantList');
        // loadRestaurants функц доторх map хэсэг
        list.innerHTML = data.map(item => {
            let imgSource = "";
            // Баазаас logoUrl эсвэл logo_url нэрээр ирж байгааг шалгана
            const rawUrl = item.logoUrl || item.logo_url;
            if (rawUrl) {
                if (rawUrl.startsWith('http')) {
                    // 1. Интернэт линк байвал (https://...)
                    imgSource = rawUrl;
                } else if (rawUrl.startsWith('data:image')) {
                    // 2. Base64 текст байвал
                    imgSource = rawUrl;
                } else {
                    // 3. Зөвхөн файлын нэр байвал (Жишээ нь: asiana_logo.png)
                    // Төслийнхөө зургууд хадгалагдаж буй үндсэн фолдерыг энд зааж өгнө
                    imgSource = `./picture/${rawUrl}`;
                }
            } else {
                // 4. Зураг огт байхгүй бол default зураг
                imgSource = './picture/Layout/no image.jpg';
            }

            return `
         <div class="res-card"
        onclick="goToRestaurant(${item.id})">
        <img src="${imgSource}" class="res-img" onerror="this.src='./picture/Layout/Foodie Go.png'">
        <div class="res-info">
            <h3>${item.name}</h3>
            <p class="category">${item.category?.categoryName || 'No category'}</p>
            <div class="res-details">
                <span><i class="fas fa-star star-icon"></i> <b>${item.rating || 0} (120+)</b></span>
                <span class="dot">●</span>
                <span><i class="fas fa-clock time-icon"></i> ${item.deliveryTime || 0} мин</span>
                <span class="dot">●</span>
                <span style="color: #00b22d; font-weight: 600;">
                    <i class="fas fa-motorcycle delivery-icon"></i>
                    ${item.deliveryFee == 0 ? 'Free' : '₮' + item.deliveryFee}
                </span>
            </div>
        </div>
<button class="btn-delete"
onclick="event.stopPropagation(); deleteRestaurant(${item.id})">
    <i class="fas fa-trash"></i>
</button>

${(() => {

    const role =
    localStorage.getItem("userRole");

    const currentUserId =
    localStorage.getItem("userId");

    const isOwner =
    String(item.managerUserId) ===
    String(currentUserId);

    const canShowManage =
    role === "RESTAURANT" &&
    (
        item.managerUserId == null ||
        isOwner
    );

    return canShowManage ? `
<button class="manage-btn"
onclick="
event.stopPropagation();
manageRestaurant(${item.id})
">
    Manage Restaurant
</button>
` : '';

})()}

    </div>
`;
        }).join('');

        if (role !== "ADMIN") {

            document.querySelectorAll(".btn-delete").forEach((btn) => {
                btn.style.visibility = "hidden";
                btn.style.pointerEvents = "none";
            });

        }

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
});

window.loadCategories = loadCategories;

function goToRestaurant(id) {

    window.parent.location.href =
        `restaurant.html?id=${id}`;

}

// Batja:

const role = localStorage.getItem("userRole");

if (role !== "ADMIN") {

    const addBtn = document.getElementById("addRestaurantBtn");

    if (addBtn) {
        addBtn.remove();
    }

}

if (role !== "ADMIN") {

    document.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.style.visibility = "hidden";
        btn.style.pointerEvents = "none";
    });

}

async function manageRestaurant(id) {

    const userId =
    localStorage.getItem("userId");

    try {

        const response = await fetch(
            `http://localhost:8080/api/restaurants/${id}/claim`,
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
            "managedRestaurantId",
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