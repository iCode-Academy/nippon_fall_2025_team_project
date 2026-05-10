const RESTAURANT_API_URL = "http://localhost:8080/api/restaurants";

// restaurantlist.js
function toggleModal(show) {
    const modal = window.parent.document.getElementById('resModalOverlay');
    if (modal) {
        modal.style.display = show ? 'flex' : 'none';
        window.parent.document.body.style.overflow = show ? 'hidden' : 'auto';
    }
}

function resetForm() {
    const doc = window.parent.document;
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
    const doc = window.parent.document;

    const name = doc.getElementById('resName').value.trim();
    const address = doc.getElementById('resAddress').value.trim();

    if (!name) {
        showValidationPopup("Рестораны нэр оруулна уу!");
        return;
    }
    if (!address) {
        showValidationPopup("Хаяг оруулна уу!");
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
        logoUrl: base64Image
    };

    try {
        const response = await fetch(`${RESTAURANT_API_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(restaurantData)
        });
        if (response.ok) {
            toggleModal(false);
            resetForm();
            loadRestaurants();
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
    <div class="res-card">
        <img src="${imgSource}" class="res-img" onerror="this.src='./picture/Layout/Foodie Go.png'">
        <div class="res-info">
            <h3>${item.name}</h3>
            <p class="category">${item.description || 'Sushi, Asian'}</p>
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
    const modal = document.getElementById('modalOverlay');
    // Хэрэв дарагдсан элемент нь модал өөрөө (overlay) мөн бол хаана
    if (event.target == modal) {
        toggleModal(false);
    }
}

function showValidationPopup(msg, isSuccess = false) {
    const doc = window.parent.document;
    const popup = doc.getElementById('validationPopup');
    const msgEl = doc.getElementById('validationMsg');
    msgEl.innerText = msg;
    popup.classList.remove('show', 'success');
    if (isSuccess) popup.classList.add('success');
    popup.classList.add('show');
    setTimeout(() => popup.classList.remove('show', 'success'), 3000);
}