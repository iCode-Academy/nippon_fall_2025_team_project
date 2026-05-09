const userId = localStorage.getItem("userId");

if (!userId) {
    window.location.href = "login.html";
}

let currentOrderId = null;
let selectedRating = 0;

document.addEventListener("DOMContentLoaded", () => {
    fetchUser();
    renderOrders();
    setupStarRating(); // Одуудыг ажиллагаанд оруулах функц
});

async function fetchUser() {
    try {
        const response = await fetch(`http://localhost:8080/api/user/${userId}`);
        const user = await response.json();

        document.getElementById("profileName").innerText = user.name || "-";
        document.getElementById("profileEmail").innerText = user.email || "-";
        
        // ЗАСВАР: savedPhone-г localStorage-аас авдаг болгосон
        const savedPhone = localStorage.getItem("checkoutPhone");
        const savedAddress = localStorage.getItem("checkoutAddress");

        document.getElementById("profilePhone").innerText = user.phone || savedPhone || "-";
        
        // HTML-д profileAddress ID-тай элемент байгаа эсэхийг шалгана
        const addrElem = document.getElementById("profileAddress");
        if(addrElem) addrElem.innerText = savedAddress || "-";

    } catch (error) {
        console.error(error);
    }
}

function renderOrders() {
    const list = document.getElementById("ordersList");
    // ЗАСВАР: myOrders-г localStorage-аас авна
    const myOrders = JSON.parse(localStorage.getItem("myOrdersList")) || [];

    if (myOrders.length === 0) {
        list.innerHTML = "<p>You have no past orders.</p>";
        return;
    }

    let html = "";
    myOrders.forEach(order => {
        const btnClass = order.isReviewed ? "review-btn done" : "review-btn";
        const btnText = order.isReviewed ? "Reviewed ✓" : "Leave a Review";
        const btnAction = order.isReviewed ? "" : `onclick="openReviewModal('${order.id}','${order.restaurantName}')"`;

        // Үнэлгээ өгсөн бол одыг харуулах хэсэг
        let starsHtml = "";
        if (order.isReviewed && order.rating) {
            starsHtml = `<div style="color: #ffc107; margin-bottom: 10px;">${"★".repeat(order.rating)}${"☆".repeat(5 - order.rating)}</div>`;
        }

        html += `
            <div class="order-card">
                <div class="order-info">
                    <h4>${order.restaurantName}</h4>
                    ${starsHtml}
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Date:</strong> ${order.date}</p>
                    <p><strong>Items:</strong> ${order.items}</p>
                    <p><strong>Receiver:</strong> ${order.receiverName || "-"}</p>
                    <p><strong>Phone:</strong> ${order.receiverPhone || "-"}</p>
                    <p><strong>Address:</strong> ${order.address || "-"}</p>
                    <span class="order-status">${order.status}</span>
                </div>
                <div class="order-actions">
                    <div class="order-total">$${order.total.toFixed(2)}</div>
                    <button class="${btnClass}" ${btnAction}>${btnText}</button>
                </div>
            </div>
        `;
    });
    list.innerHTML = html;
}

// МОДАЛ НЭЭХ ФУНКЦ
function openReviewModal(orderId, resName) {
    currentOrderId = orderId;
    document.getElementById("reviewResName").innerText = resName;
    document.getElementById("reviewModal").style.display = "flex";
    resetStars();
}

function closeReviewModal() {
    document.getElementById("reviewModal").style.display = "none";
}

// ОДНЫ ЛОГИК
function setupStarRating() {
    const stars = document.querySelectorAll("#starRating i");
    stars.forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = parseInt(star.getAttribute("data-value"));
            updateStars(selectedRating);
            document.getElementById("ratingText").innerText = `Rating: ${selectedRating} stars`;
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
    document.getElementById("ratingText").innerText = "Select stars";
    document.getElementById("reviewComment").value = "";
}

function submitReview() {
    if (selectedRating === 0) {
        alert("Please select a star rating!");
        return;
    }

    let myOrders = JSON.parse(localStorage.getItem("myOrdersList")) || [];
    const index = myOrders.findIndex(o => o.id === currentOrderId);
    
    if (index !== -1) {
        myOrders[index].isReviewed = true;
        myOrders[index].rating = selectedRating;
        myOrders[index].comment = document.getElementById("reviewComment").value;
        
        localStorage.setItem("myOrdersList", JSON.stringify(myOrders));
        closeReviewModal();
        renderOrders();
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

function goHome() {
    window.location.href = "index.html";
}