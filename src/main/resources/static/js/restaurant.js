const RESTAURANT_API_URL = "http://localhost:8080/api/restaurants";
const FOOD_API_URL = "http://localhost:8080/api/foods";
const CATEGORY_API_URL = "http://localhost:8080/api/categories";

async function loadFoods(restaurantId) {
    try {
        const res = await fetch(
            `${FOOD_API_URL}/restaurant/${restaurantId}`
        );
        const foods = await res.json();
        renderFoods(foods);
    } catch (err) {
        console.error(
            "Food load error:",
            err
        );
    }
}

function renderFoods(foodList) {

    const grid = document.getElementById(
        "foodGrid"
    );
    const groupedFoods = {};
    foodList.forEach(food => {
        const categoryName =
            food.category?.categoryName ||
            "Other";

        if (!groupedFoods[categoryName]) {
            groupedFoods[categoryName] = [];

        }

        groupedFoods[categoryName].push(food);
    });

    grid.innerHTML = Object.entries(
        groupedFoods
    ).map(([categoryName, foods]) => `

<div class="food-category-block">
    <h2 class="food-section-title">
        ${categoryName}
    </h2>
    <div class="food-category-grid">
        ${foods.map(food => {
        const cartItem = cart.find(
            i => i.id === food.id
        );

        const qty = cartItem ?
            cartItem.quantity : 0;
        return `

<div class="food-card">
    <div class="food-info">
        <div class="food-top-row">
            <h3>${food.name}</h3>
            <button
            class="food-delete-btn"
            onclick="deleteFood(${food.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <span class="food-price">
            ₮${food.price || 0}
        </span>
        <p class="food-desc">
            ${food.description || ''}
        </p>
    </div>
    <div class="food-image">
        <img src="${food.image ||
            './picture/Layout/no image.jpg'
            }">
        <div class="food-qty-control">
            <button
            onclick="decreaseFoodQty(${food.id})">
                -
            </button>
            <span id="foodQty-${food.id}">
                ${qty}
            </span>
            <button
            onclick="
            addFoodToCart(
            ${food.id},
            '${food.name.replace(/'/g, "\\'")}',
            ${food.price || 0}
            )
            ">
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
    renderFoodCategories(foodList);
}

async function loadRestaurant() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    try {

        const res = await fetch(`${RESTAURANT_API_URL}/${id}`);
        const restaurant = await res.json();

        document.getElementById("restaurantName").innerText =
            restaurant.name;

        document.getElementById("restaurantCategory").innerText =
            restaurant.category?.categoryName || "No category";

        document.getElementById("restaurantBanner").src =
            restaurant.logoUrl || "./picture/Layout/no image.jpg";

        loadFoods(id);
        loadFoodCategories();

    } catch (err) {

        console.error("Restaurant load error:", err);
    }
}

document.addEventListener(
    "DOMContentLoaded",
    loadRestaurant
);

function toggleFoodModal(show) {
    const modal = document.getElementById(
        "foodModalOverlay"
    );
    modal.style.display =
        show ? "flex" : "none";
    document.body.style.overflow =
        show ? "hidden" : "auto";
}

async function saveFood() {

    const params = new URLSearchParams(
        window.location.search
    );

    const restaurantId = params.get("id");

    const imageInput = document.getElementById(
        "foodImage"
    );

    const imageFile = imageInput.files[0];
    let base64Image = "";
    if (imageFile) {
        base64Image = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => resolve(
                e.target.result
            );
            reader.readAsDataURL(imageFile);
        });
    }

    const foodData = {
        name: document.getElementById(
            "foodName"
        ).value,
        price: parseFloat(
            document.getElementById(
                "foodPrice"
            ).value
        ) || 0,

        description: document.getElementById(
            "foodDescription"
        ).value,
        image: base64Image,
        restaurant: {
            id: restaurantId
        },
        category: {
            id: document.getElementById(
                "foodCategory"
            ).value
        }
    };

    try {
        const res = await fetch(
            FOOD_API_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(foodData)
            }
        );

        if (res.ok) {
            toggleFoodModal(false);
            loadFoods(restaurantId);
            document.getElementById(
                "foodName"
            ).value = "";
            document.getElementById(
                "foodPrice"
            ).value = "";
            document.getElementById(
                "foodDescription"
            ).value = ""
            document.getElementById(
                "foodCategory"
            ).value = "";
            document.getElementById(
                "foodImage"
            ).value = "";
        }

    } catch (err) {
        console.error(
            "Food save error:",
            err
        );
    }
}

async function loadFoodCategories() {
    try {
        const res = await fetch(
            "http://localhost:8080/api/categories"
        );
        const categories = await res.json();
        const select = document.getElementById(
            "foodCategory"
        );
        select.innerHTML =
            '<option value="">Category сонгоно уу</option>';
        select.innerHTML += categories.map(cat => `

<option value="${cat.id}">
${cat.categoryName}
</option>
`).join('');
    } catch (err) {
        console.error(
            "Category load error:",
            err
        );
    }
}

async function deleteFood(id) {

    if (!confirm(
        "Энэ хоолыг устгах уу?"
    )) return;
    try {
        const res = await fetch(
            `${FOOD_API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        if (res.ok) {
            const params = new URLSearchParams(
                window.location.search
            );
            const restaurantId = params.get("id");
            loadFoods(restaurantId);

        }

    } catch (err) {
        console.error(
            "Food delete error:",
            err
        );
    }
}

function addFoodToCart(
    id,
    name,
    price
) {

    addToCart({
        id,
        name,
        price
    });
    updateFoodQty(id);

}

function decreaseFoodQty(foodId) {
    const item = cart.find(
        i => i.id === foodId
    );
    if (!item) return;
    decreaseQty(foodId);
    updateFoodQty(foodId);

}

function updateFoodQty(foodId) {
    const qtyElement = document.getElementById(
        `foodQty-${foodId}`
    );

    if (!qtyElement) return;
    const item = cart.find(
        i => i.id === foodId
    );
    qtyElement.innerText =
        item ? item.quantity : 0;
}

function renderFoodCategories(foodList) {
    const tabs = document.getElementById(
        "foodCategoryTabs"
    );

    const categories = [
        ...new Map(
            foodList.map(food => [
                food.category?.id,
                food.category
            ])
        ).values()
    ];

    tabs.innerHTML = categories.map(cat => `
<button class="food-tab">
${cat.categoryName}
</button>
`).join('');
}

function goHome(){

window.location.href=
"index.html";

}