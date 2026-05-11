const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
if (!isLoggedIn) { localStorage.setItem("redirectAfterLogin", "checkout.html"); window.location.href = "login.html"; }
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");

function renderCart() {
    if (cart.length === 0) { cartItemsContainer.innerHTML = "<p>Your cart is empty</p>"; totalPriceEl.innerText = "Total: $ 0.00"; return; }
    let html = cart.map(item => `<div class="cart-item">${item.quantity}x ${item.name} - $ ${(item.price * item.quantity).toFixed(2)}</div>`).join("");
    cartItemsContainer.innerHTML = html;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalPriceEl.innerText = "Total: $ " + total.toFixed(2);
}

renderCart();

const userId = localStorage.getItem("userId");

async function fetchUser() {
    const res = await fetch(`/api/user/${userId}`);
    const user = await res.json();
    const receiverNameEl = document.getElementById("receiverName");
    if (receiverNameEl) { receiverNameEl.value = user.name; }
}

fetchUser();

if (!localStorage.getItem("userId")) { window.location.href = "login.html"; }

document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);

async function placeOrder() {
    const userId = localStorage.getItem("userId");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) { alert("Cart хоосон байна!"); return; }

    const receiverName = document.getElementById("receiverName").value;
    const receiverPhone = document.getElementById("receiverPhone").value;

    if (!receiverName || !receiverPhone) { alert("Receiver info оруулна уу!"); return; }

    const city = document.getElementById("city").value;
    const district = document.getElementById("district").value;
    const apartment = document.getElementById("apartment").value;
    const roomNumber = document.getElementById("roomNumber").value;

    if (!city || !district || !apartment || !roomNumber) { alert("Address мэдээллээ бүрэн оруулна уу!"); return; }

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = {
        userId: Number(userId),
        totalPrice: totalPrice,
        orderDetails: cart.map(item => ({
            product: { id: item.id },
            quantity: item.quantity,
            price: item.price


        }))
    };

    try {

        await fetch(`/api/addresses?userId=${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                city,
                district,
                apartment,
                roomNumber,
                receiverName,
                receiverPhone
            })
        });

        await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        });

        let pastOrders = JSON.parse(localStorage.getItem("myOrdersList")) || [];

        const newOrderRecord = {
            id: "ORD-" + Math.floor(Math.random() * 10000),

            date: new Date().toISOString().split('T')[0],
            restaurantId: cart[0].restaurantId,
            restaurantName: cart[0].restaurantName,
            receiverName: receiverName,
            receiverPhone: receiverPhone,
            address: `${city}, ${district}, ${apartment}, ${roomNumber}`,
            items: cart.map(
                i => `${i.quantity}x ${i.name}`
            ).join(", "),
            total: totalPrice,
            status: "Pending",
            isReviewed: false
        };

        pastOrders.unshift(newOrderRecord);
        localStorage.setItem("myOrdersList", JSON.stringify(pastOrders));
        localStorage.setItem("checkoutPhone", receiverPhone);
        localStorage.setItem("checkoutAddress", `${city}, ${district}, ${apartment}, ${roomNumber}`);
        localStorage.removeItem("cart");
        alert("Order амжилттай!");
        window.location.href = "profile.html";
    } catch (err) {
        console.error("Захиалга илгээхэд алдаа гарлаа:", err);
        alert("Order failed!");
    }
}