const userId = localStorage.getItem("userId");

if (!userId) {
    window.location.href = "login.html";
}

// Одоогийн сонгогдсон үнэлгээг хадгалах
let selectedRating = 0;
let currentOrderId = null;

document.addEventListener("DOMContentLoaded", () => {
    fetchUser();
    renderOrders();
    setupStarRating(); // Одуудын даралтыг тохируулах
});

async function fetchUser() {
    try {
        const response = await fetch(`http://localhost:8080/api/user/${userId}`);
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
    localStorage.clear();
    window.location.href = "index.html";
}

function goHome() {
    window.location.href = "index.html";
}