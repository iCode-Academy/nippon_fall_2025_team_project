const RESTAURANT_API_URL = "http://localhost:8080/api/restaurants";
const FOOD_API_URL = "http://localhost:8080/api/foods";
const CATEGORY_API_URL = "http://localhost:8080/api/categories";
const params = new URLSearchParams(window.location.search);
const currentResId = params.get("id");

async function loadFoods(restaurantId) {
    try {
        const res = await fetch(
            `${FOOD_API_URL}/restaurant/${restaurantId}`
        );
        const foods = await res.json();
        renderFoods(foods);
    } catch (err) {
        console.error("Food load error:", err);
    }
}

function renderFoods(foodList) {
    const grid = document.getElementById("foodGrid");
    const params = new URLSearchParams(window.location.search);
    const currentResId = params.get("id");

    const groupedFoods = {};
    foodList.forEach(food => {
        const categoryName = food.category?.categoryName || "Other";
        if (!groupedFoods[categoryName]) {
            groupedFoods[categoryName] = [];
        }
        groupedFoods[categoryName].push(food);
    });

    grid.innerHTML = Object.entries(groupedFoods).map(([categoryName, foods]) => `
        <div class="food-category-block">
            <h2 class="food-section-title">${categoryName}</h2>
            <div class="food-category-grid">
                ${foods.map(food => {
                    const cartItem = cart.find(i => i.id === food.id);
                    const qty = cartItem ? cartItem.quantity : 0;
                    
                    return `
                        <div class="food-card">
                            <div class="food-info">
                                <div class="food-top-row">
                                    <h3>${food.name}</h3>
                                    <button class="food-delete-btn" onclick="deleteFood(${food.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                                <span class="food-price">₮${food.price || 0}</span>
                                <p class="food-desc">${food.description || ''}</p>
                            </div>
                            <div class="food-image">
                                <img src="${food.image || './picture/Layout/no image.jpg'}">
                                <div class="food-qty-control">
                                    <button onclick="decreaseFoodQty(${food.id})">-</button>
                                    <span id="foodQty-${food.id}">${qty}</span>
                                    <button onclick="addFoodToCart(${food.id}, '${food.name.replace(/'/g, "\\'")}', ${food.price || 0}, ${currentResId})">
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');

    const role = localStorage.getItem("userRole");
    if (!canManage) {
        document.querySelectorAll(".food-delete-btn").forEach((btn) => {
            btn.style.visibility = "hidden";
            btn.style.pointerEvents = "none";
        });
    } else {
        document.querySelectorAll(".food-qty-control").forEach((el) => {
            el.remove();
        });
    }

    renderFoodCategories(foodList);
}

async function loadRestaurant() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    try {
        const res = await fetch(`${RESTAURANT_API_URL}/${id}`);
        const restaurant = await res.json();

        // Үндсэн мэдээллийг оноох
        document.getElementById("restaurantName").innerText = restaurant.name;
        document.getElementById("restaurantCategory").innerText = restaurant.category?.categoryName || "No category";
        
        // Зургийн хаягийг шинэчлэх (Cache-busting нэмэв)
        const bannerImg = restaurant.logoUrl || "./picture/Layout/no image.jpg";
        document.getElementById("restaurantBanner").src = bannerImg + (bannerImg.includes('?') ? '&' : '?') + 't=' + new Date().getTime();

        // Үнэлгээ болон Сэтгэгдлийн тоог шинэчлэх
        if (document.getElementById("avgRatingText")) {
            document.getElementById("avgRatingText").innerText = restaurant.averageRating ? restaurant.averageRating.toFixed(1) : "0.0";
        }
        
        if (document.getElementById("reviewCountText")) {
            const count = restaurant.reviewCount !== undefined ? restaurant.reviewCount : (restaurant.reviews ? restaurant.reviews.length : 0);
            document.getElementById("reviewCountText").innerText = count;
        }

        loadFoods(id);
        loadFoodCategories();
    } catch (err) {
        console.error("Restaurant load error:", err);
    }
}

function displayRestaurantInfo(restaurant) {
    document.getElementById('restaurantName').innerText = restaurant.name;
    document.getElementById('avgRatingText').innerText = restaurant.averageRating || "0.0";
    document.getElementById('reviewCountText').innerText = restaurant.reviewCount || "0";
    if(restaurant.bannerUrl) {
        document.getElementById('restaurantBanner').src = restaurant.bannerUrl;
    }
}

document.addEventListener("DOMContentLoaded", loadRestaurant);

function toggleFoodModal(show) {
    const modal = document.getElementById("foodModalOverlay");
    modal.style.display = show ? "flex" : "none";
    document.body.style.overflow = show ? "hidden" : "auto";
}

async function saveFood() {
    const params = new URLSearchParams(window.location.search);
    const restaurantId = params.get("id");
    const imageInput = document.getElementById("foodImage");
    const imageFile = imageInput.files[0];
    let base64Image = "";
    if (imageFile) {
        base64Image = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.readAsDataURL(imageFile);
        });
    }

    const foodData = {
        name: document.getElementById("foodName").value,
        price: parseFloat(document.getElementById("foodPrice").value) || 0,
        description: document.getElementById("foodDescription").value,
        image: base64Image,
        restaurant: { id: restaurantId },
        category: { id: document.getElementById("foodCategory").value }
    };

    try {
        const res = await fetch(FOOD_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(foodData)
        });

        if (res.ok) {
            toggleFoodModal(false);
            loadFoods(restaurantId);
            document.getElementById("foodName").value = "";
            document.getElementById("foodPrice").value = "";
            document.getElementById("foodDescription").value = "";
            document.getElementById("foodCategory").value = "";
            document.getElementById("foodImage").value = "";
        }
    } catch (err) {
        console.error("Food save error:", err);
    }
}

async function loadFoodCategories() {
    try {
        const res = await fetch(CATEGORY_API_URL);
        const categories = await res.json();
        const select = document.getElementById("foodCategory");
        select.innerHTML = '<option value="">Category сонгоно уу</option>';
        select.innerHTML += categories.map(cat => `
            <option value="${cat.id}">${cat.categoryName}</option>
        `).join('');
    } catch (err) {
        console.error("Category load error:", err);
    }
}

async function deleteFood(id) {
    if (!confirm("Энэ хоолыг устгах уу?")) return;
    try {
        const res = await fetch(`${FOOD_API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) {
            const params = new URLSearchParams(window.location.search);
            const restaurantId = params.get("id");
            loadFoods(restaurantId);
        }
    } catch (err) {
        console.error("Food delete error:", err);
    }
}

function addFoodToCart(id, name, price, restaurantId) {
    addToCart({ id: id, name: name, price: price, restaurantId: restaurantId });
    updateFoodQty(id);
}

function decreaseFoodQty(foodId) {
    const item = cart.find(i => i.id === foodId);
    if (!item) return;
    decreaseQty(foodId);
    updateFoodQty(foodId);
}

function updateFoodQty(foodId) {
    const qtyElement = document.getElementById(`foodQty-${foodId}`);
    if (!qtyElement) return;
    const item = cart.find(i => i.id === foodId);
    qtyElement.innerText = item ? item.quantity : 0;
}

function renderFoodCategories(foodList) {
    const tabs = document.getElementById("foodCategoryTabs");
    const categories = [...new Map(foodList.map(food => [food.category?.id, food.category])).values()];
    tabs.innerHTML = categories.map(cat => `
        <button class="food-tab">${cat?.categoryName || "Other"}</button>
    `).join('');
}

function goHome() { window.location.href = "index.html"; }

const role = localStorage.getItem("userRole");
const managedRestaurantId = localStorage.getItem("managedRestaurantId");
const currentRestaurantId = new URLSearchParams(window.location.search).get("id");
const canManage = role === "ADMIN" || (role === "RESTAURANT" && managedRestaurantId === currentRestaurantId);

document.addEventListener("DOMContentLoaded", () => {
    if (!canManage) {
        const addFoodBtn = document.getElementById("addFoodBtn");
        if (addFoodBtn) { addFoodBtn.remove(); }
    }
});