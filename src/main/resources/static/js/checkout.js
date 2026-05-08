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
            product: { id: item.id },
            quantity: item.quantity,
            price: item.price
        }))
    };

    // Энэ мөрийг байгаа эсэхийг шалгаарай
document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);

async function placeOrder() {
    // 1. isLoggedIn хувьсагчийг энд заавал тодорхойлно (АЛДААГ ЗАССАН ХЭСЭГ)
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userId = localStorage.getItem("userId");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Cart хоосон байна!");
        return;
    }

    // Input-үүдийг шалгах
    const phoneEl = document.getElementById("phone");
    const addressEl = document.getElementById("address");

    if (!phoneEl || !addressEl || !phoneEl.value || !addressEl.value) {
        alert("Утасны дугаар болон хаягаа бүрэн оруулна уу!");
        return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Backend-рүү явуулах объект
    const orderData = {
        userId: Number(userId),
        totalPrice: totalPrice,
        orderDetails: cart.map(item => ({
            product: { id: item.id },
            quantity: item.quantity,
            price: item.price
        }))
    };

    try {
        // 2. Бэкэнд рүү илгээх хүсэлт
        const res = await fetch("http://localhost:8080/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        // 3. Захиалгыг локал түүхэнд хадгалах (orders.html-д харуулахын тулд)
        let pastOrders = JSON.parse(localStorage.getItem("myOrdersList")) || [];
        const newOrderRecord = {
            id: "ORD-" + Math.floor(Math.random() * 10000),
            date: new Date().toISOString().split('T')[0],
            restaurantName: "Foodie Go Delivery", 
            items: cart.map(i => `${i.quantity}x ${i.name}`).join(", "),
            total: totalPrice,
            status: "Delivered", 
            isReviewed: false
        };

        pastOrders.unshift(newOrderRecord);
        localStorage.setItem("myOrdersList", JSON.stringify(pastOrders));

        alert("Order амжилттай!");

        // 4. Сагс цэвэрлэх ба шилжих
        localStorage.removeItem("cart");
        window.location.href = "order.html";

    } catch (err) {
        console.error("Захиалга илгээхэд алдаа гарлаа:", err);
        // Бэкэнд ажиллахгүй байсан ч туршилтын журмаар orders.html руу шилжүүлэх хэсэг:
        localStorage.removeItem("cart");
        window.location.href = "order.html";
    }
}
}