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

    const role = localStorage.getItem("userRole");

    if (!canManage) {

        document.querySelectorAll(".food-delete-btn").forEach((btn) => {
            btn.style.visibility = "hidden";
            btn.style.pointerEvents = "none";
        });

    }

    if (canManage) {

        document.querySelectorAll(".food-qty-control").forEach((el) => {
            el.remove();
        });
    }

    renderFoodCategories(foodList);
}

async function loadRestaurant() {

    const id =
        new URLSearchParams(window.location.search)
            .get("id")
        ||
        localStorage.getItem("restaurantId");

    try {

        const res = await fetch(`${RESTAURANT_API_URL}/${id}`);
        const restaurant = await res.json();

        document.getElementById("restaurantName").innerText =
            restaurant.name;

        document.getElementById("restaurantCategory").innerText =
            restaurant.category?.categoryName || "No category";

        // Batja written code START here
        const ratingElement =
            document.querySelector(
                ".restaurant-meta .fa-star"
            ).parentElement;

        ratingElement.innerHTML = `
        <i class="fas fa-star"></i>
        ${restaurant.rating || 0}
        `;
        // Batja written code END here

        const bannerEl = document.getElementById("restaurantBanner");
        const rawUrl = (restaurant.bannerUrl || restaurant.logoUrl || "").replace(/\s+/g, '');

        if (rawUrl) {
            bannerEl.src = rawUrl;
        } else {
            bannerEl.src = "./picture/Layout/no image.jpg";
        }

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

    const restaurantId =
        new URLSearchParams(window.location.search)
            .get("id")
        ||
        localStorage.getItem("restaurantId");

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

            const restaurantId =
                new URLSearchParams(window.location.search)
                    .get("id")
                ||
                localStorage.getItem("restaurantId");

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
    ].filter(Boolean);

    tabs.innerHTML = categories.map(cat => `
        <button
            class="food-tab"
            onclick="filterFoods('${cat.categoryName}')"
        >
            ${cat.categoryName}
        </button>
    `).join('');
}
function filterFoods(categoryName) {
    const blocks = document.querySelectorAll(
        ".food-category-block"
    );

    blocks.forEach(block => {
        const title = block.querySelector(
            ".food-section-title"
        ).innerText.trim();

        block.style.display =
            title === categoryName ? "block" : "none";
    });

    document.querySelectorAll(".food-tab").forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.innerText.trim() === categoryName
        );
    });
}


function goHome() {

    window.location.href =
        "index.html";

}

const role = localStorage.getItem("userRole");

const managedRestaurantId =
    localStorage.getItem("restaurantId");

const currentRestaurantId =
    new URLSearchParams(window.location.search)
        .get("id")
    ||
    localStorage.getItem("restaurantId");

const canManage =
    role === "ADMIN" ||
    (
        role === "RESTAURANT" &&
        managedRestaurantId === currentRestaurantId
    );

document.addEventListener("DOMContentLoaded", () => {

    if (!canManage) {

        const addFoodBtn =
            document.getElementById("addFoodBtn");

        if (addFoodBtn) {
            addFoodBtn.remove();
        }

    }

});

// Batja written code START here

const stars = document.querySelectorAll(".star");

function updateStars(ratingValue) {

    stars.forEach((s, index) => {

        if (index < ratingValue) {

            s.classList.remove("fa-regular");
            s.classList.add("fa-solid");

        } else {

            s.classList.remove("fa-solid");
            s.classList.add("fa-regular");

        }

    });

}

stars.forEach((star) => {

    star.addEventListener("mouseover", () => {

        const hoverValue = star.dataset.value;

        updateStars(hoverValue);

    });

    star.addEventListener("mouseleave", () => {

        const savedRating =
            document.querySelector(".rating-stars")
                .dataset.selected || 0;

        updateStars(savedRating);

    });

    star.addEventListener("click", () => {

        const isLoggedIn =
            localStorage.getItem("isLoggedIn") === "true";

        if (!isLoggedIn) {

            alert("Please login to rate this restaurant");
            return;

        }

        const ratingValue = star.dataset.value;

        document.querySelector(
            ".rating-stars"
        ).dataset.selected = ratingValue;

        updateStars(ratingValue);

        showRatingMessage();

        console.log(
            `Rated: ${ratingValue} stars`
        );

        const restaurantId =
            new URLSearchParams(window.location.search)
                .get("id")
            ||
            localStorage.getItem("restaurantId");

        const userId =
            localStorage.getItem("userId");

        fetch(
            "http://localhost:8080/api/ratings",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    ratingValue: Number(ratingValue),

                    userId: Number(userId),

                    restaurant: {
                        id: Number(restaurantId)
                    }

                })

            }
        )
            .then(res => res.json())
            .then(data => {

                console.log(
                    "Rating saved:",
                    data
                );

                loadRestaurant();

            })
            .catch(err => {

                console.error(
                    "Rating save error:",
                    err
                );

            });

    });

});

function showRatingMessage() {

    let message =
        document.getElementById("ratingMessage");

    if (!message) {

        message = document.createElement("div");

        message.id = "ratingMessage";

        message.innerText =
            "Thanks for rating us!";

        document.body.appendChild(message);

    }

    message.classList.add("show");

    setTimeout(() => {

        message.classList.remove("show");

    }, 1500);

}

// Batja written code END here
async function validateAndSaveFood() {
    const foodNameEl = document.getElementById("foodName");
    const foodPriceEl = document.getElementById("foodPrice");
    const foodCategoryEl = document.getElementById("foodCategory");

    document.querySelectorAll(".field-error").forEach(el => el.remove());
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

    let valid = true;

    if (!foodNameEl.value.trim()) {
        showFieldError(foodNameEl, "Хоолны нэр оруулна уу");
        valid = false;
    }
    if (!foodPriceEl.value || parseFloat(foodPriceEl.value) <= 0) {
        showFieldError(foodPriceEl, "Үнэ оруулна уу");
        valid = false;
    }
    if (!foodCategoryEl.value) {
        showFieldError(foodCategoryEl, "Категори сонгоно уу");
        valid = false;
    }

    if (!valid) return;

    return saveFood();
}

function showFieldError(input, message) {
    input.classList.add("input-error");
    const err = document.createElement("span");
    err.className = "field-error";
    err.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    input.parentNode.appendChild(err);
    input.addEventListener("input", () => {
        err.remove();
        input.classList.remove("input-error");
    }, { once: true });
    input.addEventListener("change", () => {
        err.remove();
        input.classList.remove("input-error");
    }, { once: true });
}
