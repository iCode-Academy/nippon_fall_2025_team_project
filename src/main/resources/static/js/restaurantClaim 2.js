// =========================
// CONFIG
// =========================
const CLAIM_API_URL = "http://localhost:8080/api/restaurants";

// =========================
// CLAIM MODE
// =========================
function isClaimMode() {
    const role = localStorage.getItem("userRole");
    const restaurantId = localStorage.getItem("restaurantId");
    return role === "RESTAURANT" && !restaurantId;
}

// =========================
// BUTTON ADD
// =========================
function injectClaimButtons() {
    if (!isClaimMode()) return;

    const cards = document.querySelectorAll(".res-card");

    cards.forEach((card, index) => {
        // аль хэдийн button байвал дахин нэмэхгүй
        if (card.querySelector(".claim-btn")) return;

        const btn = document.createElement("button");
        btn.innerText = "Become Manager";
        btn.className = "claim-btn";
        btn.style.cssText = `
      background:#ff6b00;
      color:white;
      border:none;
      padding:6px 10px;
      border-radius:6px;
      cursor:pointer;
      margin-top:8px;
    `;

        btn.onclick = () => {
            claimRestaurant(index);
        };

        card.querySelector(".res-info").appendChild(btn);
    });
}

// =========================
// CLAIM FUNCTION
// =========================
async function claimRestaurant(index) {
    const userId = localStorage.getItem("userId");

    // ⚠️ index → restaurant id олно
    const resList = await fetch(API_URL);
    const data = await resList.json();

    const restaurantId = data[index].id;

    const res = await fetch(
        `${API_URL}/claim/${restaurantId}?userId=${userId}`,
        { method: "POST" }
    );

    if (res.ok) {
        
        localStorage.setItem(
            "restaurantId",
            restaurantId
        );

        alert("Та менежер боллоо!");

        window.location.href =
            "restaurant.html";

    } else {
        alert("Энэ ресторан аль хэдийн эзэнтэй байна");
    }
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
    // эхний удаа
    setTimeout(injectClaimButtons, 500);

    // dynamic render-д зориулж
    const observer = new MutationObserver(() => {
        injectClaimButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});