let myOrders = JSON.parse(localStorage.getItem("myOrdersList")) || [];
let currentReviewOrderId = null;
let currentRating = 0;

document.addEventListener("DOMContentLoaded", () => {
    renderOrders();
    setupStars();
});

function renderOrders() {
    const list = document.getElementById("ordersList");
    if (!list) return;

    if (myOrders.length === 0) {
        list.innerHTML = "<p>You have no past orders.</p>";
        return;
    }

    let html = "";
    myOrders.forEach(order => {
        const btnClass = order.isReviewed ? "review-btn done" : "review-btn";
        const btnText = order.isReviewed ? "Reviewed ✓" : "Leave a Review";
        const btnAction = order.isReviewed ? "" : `onclick="openReviewModal('${order.id}', '${order.restaurantName}')"`;

        html += `
            <div class="order-card">
                <div class="order-info">
                    <h4>${order.restaurantName}</h4>
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Date:</strong> ${order.date}</p>
                    <p><strong>Items:</strong> ${order.items}</p>
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

const reviewModal = document.getElementById("reviewModal");

function openReviewModal(orderId, resName) {
    currentReviewOrderId = orderId;
    currentRating = 0;
    document.getElementById("reviewResName").innerText = `Review: ${resName}`;
    document.getElementById("reviewComment").value = "";
    resetStars();
    document.getElementById("ratingText").innerText = "Select stars";
    reviewModal.style.display = "flex";
}

function closeReviewModal() {
    reviewModal.style.display = "none";
}

function setupStars() {
    const stars = document.querySelectorAll(".review-stars i");
    const texts = ["Terrible", "Bad", "Okay", "Good", "Excellent"];

    stars.forEach(star => {
        star.addEventListener("mouseover", function() {
            const val = parseInt(this.getAttribute("data-value"));
            stars.forEach((s, index) => {
                s.classList.toggle("hovered", index < val);
            });
            document.getElementById("ratingText").innerText = texts[val - 1];
        });

        star.addEventListener("mouseout", function() {
            stars.forEach(s => s.classList.remove("hovered"));
            document.getElementById("ratingText").innerText = currentRating === 0 ? "Select stars" : texts[currentRating - 1];
        });

        star.addEventListener("click", function() {
            currentRating = parseInt(this.getAttribute("data-value"));
            stars.forEach((s, index) => {
                if (index < currentRating) {
                    s.classList.add("active", "fas"); s.classList.remove("far");
                } else {
                    s.classList.remove("active", "fas"); s.classList.add("far");
                }
            });
        });
    });
}

function resetStars() {
    document.querySelectorAll(".review-stars i").forEach(s => {
        s.classList.remove("active", "hovered", "fas");
        s.classList.add("far");
    });
}

async function submitReview() {
    if (currentRating === 0) {
        alert("Please select a star rating!");
        return;
    }

    const comment = document.getElementById("reviewComment").value;
    const order = myOrders.find(o => o.id === currentReviewOrderId);

    if (!order) {
        alert("Order not found!");
        return;
    }

    if (!order.restaurantId) {
        alert("Алдаа: Рестораны ID олдсонгүй! LocalStorage-оо шалгана уу.");
        return;
    }

    const reviewData = {
        userId: 1, 
        foodId: order.foodId || 1, 
        restaurantId: order.restaurantId, 
        rating: currentRating,
        comment: comment
    };

    try {
        // ЧУХАЛ: Endpoint хаягийг '/api/reviews/add' болгож нэгтгэв
        const response = await fetch('http://localhost:8080/api/reviews/add', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });

        if (response.ok) {
            alert("Сэтгэгдэл амжилттай хадгалагдлаа!");
            
            // Төлөвийг шинэчилж хадгалах
            order.isReviewed = true;
            localStorage.setItem("myOrdersList", JSON.stringify(myOrders));
            
            closeReviewModal();
            renderOrders(); 
        } else {
            const errorText = await response.text();
            alert("Сервер дээр алдаа гарлаа: " + errorText);
        }
    } catch (error) {
        console.error("Error submitting review:", error);
        alert("Backend сервертэй холбогдоход алдаа гарлаа. Таны сервер (8080 порт) ажиллаж байгаа эсэхийг шалгана уу.");
    }
}