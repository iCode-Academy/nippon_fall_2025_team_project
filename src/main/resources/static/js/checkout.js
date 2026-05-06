// login hamgaalalt
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

if (!isLoggedIn) {
    localStorage.setItem("redirectAfterLogin", "checkout.html");
    window.location.href = "login.html";
}

// cart data awah
const cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsContainer = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");

// cart render
function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty</p>";
        totalPriceEl.innerText = "Total: $ 0.00";
        return;
    }

    let html = cart.map(item => `
        <div class="cart-item">
            ${item.quantity}x ${item.name} - $ ${(item.price * item.quantity).toFixed(2)}
        </div>
    `).join("");

    cartItemsContainer.innerHTML = html;

    // total tootsooloh
    const total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    totalPriceEl.innerText = "Total: $ " + total.toFixed(2);
}

// render ajilluulah
renderCart();

const userId = localStorage.getItem("userId");
console.log(userId); // ali user login hiisen baigaag console deerees harj ID aar n medeh

// user fetch
async function fetchUser() {
    const userId = localStorage.getItem("userId");

    const res = await fetch(`http://localhost:8080/api/user/${userId}`);
    const user = await res.json();

    console.log(user);

    document.getElementById("name").value = user.name;
}

fetchUser();

console.log(cart); // cart check

if (!localStorage.getItem("userId")) {
    window.location.href = "login.html";
}

document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);

async function placeOrder() {
    const userId = localStorage.getItem("userId");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Cart хоосон байна!");
        return;
    }

    const phone = document.getElementById("phone").value;

    if (!phone) {
        alert("Phone number оруулна уу!");
        return;
    }

    const address = document.getElementById("address").value;

    if (!address) {
        alert("Address оруулна уу!");
        return;
    }

    const totalPrice = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    const order = {
        userId: Number(userId),
        totalPrice: totalPrice,
        orderDetails: cart.map(item => ({
            product: {
                id: item.id
            },
            quantity: item.quantity,
            price: item.price
        }))
    };

    try {
        const res = await fetch("http://localhost:8080/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });

        if (!res.ok) {
            throw new Error("Order failed");
        }

        alert("Order амжилттай!");

        // cart tsewerleh
        localStorage.removeItem("cart");

        // order page
        window.location.href = "orders.html";

    } catch (err) {
        console.error(err);
        alert("Алдаа гарлаа!");
    }
}