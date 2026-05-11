const API_URL = "/api/addresses";

// 1. Хуудас ачаалагдах үед хаягуудыг татаж харуулах
document.addEventListener("DOMContentLoaded", fetchAddresses);

// 2. Хаяг татаж харуулах функц
function fetchAddresses() {
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById("addressBody");
        if (!tbody) return;

        tbody.innerHTML = ""; // Хуучин мэдээллийг цэвэрлэх

        data.forEach(addr => {
            // Java болон JSON-той яг ижил нэртэй талбаруудыг ашиглана
            const row = `
                <tr>
                    <td>${addr.userName || 'Хоосон'}</td>
                    <td>${addr.city || 'Хоосон'}</td>
                    <td>${addr.district || 'Хоосон'}</td>
                    <td>${addr.apartment || 'Хоосон'}</td>
                    <td>${addr.roomNumber || 'Хоосон'}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    })
    .catch(error => console.error("Жагсаалт авахад алдаа гарлаа:", error));
}

// 3. Форм илгээх (Хаяг нэмэх)
const addressForm = document.getElementById("addressForm");
if (addressForm) {
    addressForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Формоос утгуудыг авах
        const addressData = {
            userName: document.getElementById("userName").value,
            city: document.getElementById("city").value,
            district: document.getElementById("district").value,
            apartment: document.getElementById("apartment").value,
            roomNumber: document.getElementById("roomNumber").value
        };

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addressData)
        })
        .then(response => {
            if (!response.ok) throw new Error("Сүлжээний алдаа");
            return response.json();
        })
        .then(data => {
            alert("Амжилттай хадгалагдлаа!");
            addressForm.reset(); // Формыг цэвэрлэх
            fetchAddresses(); // Шинэ хаягийг шууд жагсаалтад нэмж хэвлэнэ
        })
        .catch(error => {
            console.error("Хадгалахад алдаа гарлаа:", error);
            alert("Алдаа гарлаа. Консол шалгана уу.");
        });
    });
}