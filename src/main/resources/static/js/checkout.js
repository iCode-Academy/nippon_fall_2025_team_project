// 1. Нэвтрэлт болон хэрэглэгчийн төлөвийг шалгах
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
const userId = localStorage.getItem("userId");

if (!isLoggedIn || !userId) {
    localStorage.setItem("redirectAfterLogin", "checkout.html");
    window.location.href = "login.html";
}

// 2. Сагсны мэдээлэл болон DOM элементүүд
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");

// Сагсыг дэлгэцэнд харуулах функц
function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Таны сагс хоосон байна.</p>";
        totalPriceEl.innerText = "Нийт: ₮0.00";
        return;
    }
    
    let html = cart.map(item => `
        <div class="cart-item">
            ${item.quantity}x ${item.name} - ₮${(item.price * item.quantity).toLocaleString()}
        </div>`).join("");
    
    cartItemsContainer.innerHTML = html;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalPriceEl.innerText = "Нийт: ₮" + total.toLocaleString();
}

renderCart();

// 3. Хэрэглэгчийн мэдээллийг серверээс авах (Хүлээн авагчийн нэрийг автоматаар бөглөх)
async function fetchUser() {
    try {
        const res = await fetch(`http://localhost:8080/api/user/${userId}`);
        const user = await res.json();
        const receiverNameEl = document.getElementById("receiverName");
        if (receiverNameEl && user.name) {
            receiverNameEl.value = user.name;
        }
    } catch (err) {
        console.error("User fetch error:", err);
    }
}

fetchUser();

// 4. Захиалга хийх функц
document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);

async function placeOrder() {
    if (cart.length === 0) {
        alert("Сагс хоосон байна!");
        return;
    }

    // Input утгуудыг авах
    const receiverName = document.getElementById("receiverName").value.trim();
    const receiverPhone = document.getElementById("receiverPhone").value.trim();
    const city = document.getElementById("city").value;
    const district = document.getElementById("district").value;
    const apartment = document.getElementById("apartment").value;
    const roomNumber = document.getElementById("roomNumber").value;

    if (!receiverName || !receiverPhone || !city || !district || !apartment || !roomNumber) {
        alert("Мэдээллээ бүрэн оруулна уу!");
        return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Backend-рүү явуулах Order объект
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
        // А. Хаяг хадгалах хүсэлт
        await fetch(`http://localhost:8080/api/addresses?userId=${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                city, district, apartment, roomNumber, receiverName, receiverPhone
            })
        });

        // Б. Захиалга үүсгэх хүсэлт
        const orderRes = await fetch("http://localhost:8080/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        if (orderRes.ok) {
            // В. Локал түүхэнд (myOrdersList) хадгалах
            // Review бичихэд хэрэгтэй restaurantId болон foodId-г сагснаас авч байна
            let pastOrders = JSON.parse(localStorage.getItem("myOrdersList")) || [];
            
            const resId = cart.length > 0 ? cart[0].restaurantId : null;
            const fId = cart.length > 0 ? cart[0].id : null;

            const newOrderRecord = {
                id: "ORD-" + Math.floor(Math.random() * 10000),
                date: new Date().toISOString().split('T')[0],
                restaurantName: "Foodie Go Delivery",
                restaurantId: resId, // Profile-аас Review бичихэд ашиглагдана
                foodId: fId,         // Review бичихэд ашиглагдана
                receiverName: receiverName,
                address: `${city}, ${district}, ${apartment}, ${roomNumber}`,
                items: cart.map(i => `${i.quantity}x ${i.name}`).join(", "),
                total: totalPrice,
                status: "Delivered",
                isReviewed: false
            };

            pastOrders.unshift(newOrderRecord);
            localStorage.setItem("myOrdersList", JSON.stringify(pastOrders));

            // Г. Сагсыг цэвэрлэх болон шилжих
            localStorage.removeItem("cart");
            alert("Захиалга амжилттай хийгдлээ!");
            window.location.href = "profile.html"; // Эсвэл таны хүссэн хуудас
        } else {
            const errorMsg = await orderRes.text();
            alert("Захиалга илгээхэд алдаа гарлаа: " + errorMsg);
        }

    } catch (err) {
        console.error("Order process error:", err);
        alert("Сервертэй холбогдоход алдаа гарлаа!");
    }
}