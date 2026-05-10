const userId =
    localStorage.getItem("userId");

if (!userId) {

    window.location.href =
        "login.html";
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        fetchUser();
        renderOrders();
    }
);
async function fetchUser() {

    try {

        const response =
            await fetch(
                `http://localhost:8080/api/user/${userId}`
            );

        const user =
            await response.json();

        document.getElementById(
            "profileName"
        ).innerText =
            user.name || "-";

        document.getElementById(
            "profileEmail"
        ).innerText =
            user.email || "-";

        document.getElementById(
            "profilePhone"
        ).innerText =
            user.phone || "-";

    } catch (error) {

        console.error(error);
    }

    // LOCAL STORAGE DATA

    const savedAddress =
        localStorage.getItem("checkoutAddress");

    document.getElementById(
        "profilePhone"
    ).innerText =
        savedPhone || "-";

    document.getElementById(
        "profileAddress"
    ).innerText =
        savedAddress || "-";
}

function renderOrders() {

    const list = document.getElementById("ordersList");

    if (myOrders.length === 0) {

        list.innerHTML = "<p>You have no past orders.</p>";

        return;
    }

    let html = "";

    myOrders.forEach(order => {

        const btnClass = order.isReviewed ? "review-btn done" : "review-btn";

        const btnText = order.isReviewed ? "Reviewed ✓" : "Leave a Review";

        const btnAction = order.isReviewed ? "" : `onclick="openReviewModal('${order.id}','${order.restaurantName}')"`;


        html += `

<div class="order-card">

<div class="order-info">

<h4>
${order.restaurantName}
</h4>

<p>
<strong>Order ID:</strong>
${order.id}
</p>

<p>
<strong>Date:</strong>
${order.date}
</p>

<p>
<strong>Items:</strong>
${order.items}
</p>

<p>
<strong>Receiver:</strong>
${order.receiverName || "-"}
</p>

<p>
<strong>Phone:</strong>
${order.receiverPhone || "-"}
</p>

<p>
<strong>Address:</strong>
${order.address || "-"}
</p>

<span class="order-status">
${order.status}
</span>

</div>

<div class="order-actions">

<div class="order-total">

$${order.total.toFixed(2)}

</div>

<button class="${btnClass}" ${btnAction}>

${btnText}

</button>

</div>

</div>

`;
    });

    list.innerHTML = html;
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
        "myOrdersList"
    );

    localStorage.removeItem(
        "checkoutPhone"
    );

    localStorage.removeItem(
        "checkoutAddress"
    );

    window.location.href =
        "index.html";
}

function goHome() {

    window.location.href =
        "index.html";
}
