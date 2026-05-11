const userId = localStorage.getItem("userId");

if (!userId) {
    window.location.href = "login.html";
}

// Одоогийн сонгогдсон үнэлгээг хадгалах
let selectedRating = 0;
let currentOrderId = null;

document.addEventListener("DOMContentLoaded", () => {

    const role =
        localStorage.getItem("userRole");

    const customerOnly =
        document.querySelector(".customer-only");

    if (customerOnly) {

        customerOnly.style.display =
            role === "CUSTOMER"
                ? "block"
                : "none";


    }
    const restaurantOnly =
        document.querySelector(
            ".restaurant-only"
        );

    if (restaurantOnly) {
        restaurantOnly.style.display =
            role === "RESTAURANT"
                ? "block"
                : "none";

    }
    fetchUser();
    if (role === "RESTAURANT") {
        renderRestaurantOrders();
    }
    renderOrders();
    setupStarRating(); // Одуудын даралтыг тохируулах
});

async function fetchUser() {
    try {
        const response = await fetch(`/api/user/${userId}`);
        const user = await response.json();

        document.getElementById("profileName").innerText = user.name || "-";
        document.getElementById("profileEmail").innerText = user.email || "-";

        // ЗАСВАР: savedPhone-г localStorage-аас авсан
        const savedPhone = localStorage.getItem("checkoutPhone");
        const savedAddress = localStorage.getItem("checkoutAddress");

        document.getElementById("profilePhone").innerText = user.phone || savedPhone || "-";

        const addrElem = document.getElementById("profileAddress");
        if (addrElem) addrElem.innerText = savedAddress || "-";

    } catch (error) {
        console.error(error);
    }
}

// МОДАЛ НЭЭХ ФУНКЦ (Энийг нэмсэн)
function openReviewModal(orderId, restaurantName) {
    currentOrderId = orderId;
    document.getElementById("reviewResName").innerText = restaurantName;
    document.getElementById("reviewModal").style.display = "flex";
    resetStars();
}

function closeReviewModal() {
    document.getElementById("reviewModal").style.display = "none";
}

// ОДУУДЫН ЛОГИК (Энийг нэмсэн)
function setupStarRating() {
    const stars = document.querySelectorAll("#starRating i");
    stars.forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = parseInt(star.getAttribute("data-value"));
            updateStars(selectedRating);
        });
    });
}

function updateStars(rating) {
    const stars = document.querySelectorAll("#starRating i");
    stars.forEach(star => {
        const val = parseInt(star.getAttribute("data-value"));
        if (val <= rating) {
            star.classList.replace("far", "fas"); // Дүүрэн од
            star.style.color = "#ffc107";
        } else {
            star.classList.replace("fas", "far"); // Хоосон од
            star.style.color = "#ccc";
        }
    });
}

function resetStars() {
    selectedRating = 0;
    updateStars(0);
}

function submitReview() {
    if (selectedRating === 0) {
        alert("Please select a rating!");
        return;
    }
    // Review хадгалах логик энд орно...
    closeReviewModal();
}

function logout() {
    localStorage.removeItem(
        "isLoggedIn"
    );
    localStorage.removeItem(
        "userId"
    );
    localStorage.removeItem(
        "userName"
    );
    localStorage.removeItem(
        "userEmail"
    );
    localStorage.removeItem(
        "userRole"
    );
    localStorage.removeItem(
        "restaurantId"
    );
    window.location.href =
        "index.html";
}

function goHome() {
    window.location.href = "index.html";
}

function renderRestaurantOrders() {
    const list = document.getElementById("restaurantOrdersList");
    if (!list) return;

    const currentRestaurantId = localStorage.getItem("restaurantId");

    // Идэвхтэй захиалгууд — myOrdersList-с
    const allOrders = JSON.parse(localStorage.getItem("myOrdersList")) || [];
    const activeOrders = allOrders.filter(o =>
        String(o.restaurantId) === String(currentRestaurantId)
    );

    // Дууссан захиалгууд — orderHistory-с  ← ШИНЭ
    const historyOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const myHistory = historyOrders.filter(o =>
        String(o.restaurantId) === String(currentRestaurantId)
    );

    let html = "";

    // ── Идэвхтэй захиалгууд ──────────────────
    if (activeOrders.length === 0) {
        html += "<p>No active orders.</p>";
    } else {
        activeOrders.forEach(order => {
            html += `
            <div class="order-card">
                <div class="order-info">
                    <h4>${order.restaurantName}</h4>
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Customer:</strong> ${order.receiverName}</p>
                    <p><strong>Phone:</strong> ${order.receiverPhone}</p>
                    <p><strong>Address:</strong> ${order.address}</p>
                    <p><strong>Items:</strong> ${order.items}</p>
                    <span class="order-status">
                        ${order.status || "Pending"}
                        ${order.status !== "Shipped" ? `
                            <button class="ship-btn"
                                onclick="markAsShipped('${order.id}')">
                                Mark as shipped
                            </button>` : ""}
                    </span>
                </div>
                <div class="order-actions">
                    <div class="order-total">
                        $${order.total?.toFixed(2)}
                    </div>
                </div>
            </div>`;
        });
    }

    // ── Order History хэсэг ──────────────────  ← ШИНЭ
    if (myHistory.length > 0) {
        html += `
        <div class="history-section">
            <h2>Order History</h2>
            ${myHistory.map(order => `
                <div class="order-card history-card">
                    <div class="order-info">
                        <h4>${order.restaurantName || "-"}</h4>
                        <p><strong>Order ID:</strong> ${order.id || "-"}</p>
                        <p><strong>Customer:</strong> ${order.receiverName || "-"}</p>
                        <p><strong>Phone:</strong> ${order.receiverPhone || "-"}</p>
                        <p><strong>Address:</strong> ${order.address || "-"}</p>
                        <p><strong>Items:</strong> ${order.items || "-"}</p>
                        <p><strong>Date:</strong> ${order.date || "-"}</p>
                    </div>
                    <div class="order-actions">
                        <div class="order-total">
                            $${order.total?.toFixed(2)}
                        </div>
                        <span class="history-badge">Completed</span>
                    </div>
                </div>`).join("")}
        </div>`;
    }

    list.innerHTML = html;
}

function markAsShipped(orderId) {
    let orders =
        JSON.parse(
            localStorage.getItem(
                "myOrdersList"
            )
        ) || [];
    orders = orders.map(order => {
        if (order.id === orderId) {
            return {
                ...order,
                status: "Shipped"
            };
        }
        return order;
    });
    localStorage.setItem(
        "myOrdersList",
        JSON.stringify(orders)
    );
    renderRestaurantOrders();
}