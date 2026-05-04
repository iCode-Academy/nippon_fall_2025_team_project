// main.js - Үндсэн логик болон өгөгдөл ачаалах хэсэг

document.addEventListener('DOMContentLoaded', () => {
    console.log("FoodieGo үндсэн JS ачаалагдлаа.");
    
    // 1. Рестораны жагсаалтыг ачаалах
    loadRestaurants();

    // 2. Бусад ерөнхий үйлдэл (Жишээ нь: Хайлт)
    setupSearch();
});

// Ресторан ачаалах функц
async function loadRestaurants() {
    const restaurantList = document.getElementById('restaurantList');
    if (!restaurantList) return;

    try {
        const response = await fetch('http://localhost:8080/api/restaurants');
        const data = await response.json();
        
        restaurantList.innerHTML = ''; // Уншиж байна гэсэн бичгийг арилгах

        data.forEach(res => {
            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card restaurant-card" onclick="location.href='restaurant-detail.html?id=${res.id}'">
                        <img src="${res.imageUrl || 'img/default-res.jpg'}" class="card-img-top restaurant-img" alt="${res.name}">
                        <div class="card-body">
                            <h5 class="card-title">${res.name}</h5>
                            <p class="card-text text-muted">${res.description || 'Амттай хоол, тухтай орчин'}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="rating-badge">★ ${res.rating || '5.0'}</span>
                                <small class="text-muted">${res.address}</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            restaurantList.innerHTML += card;
        });
    } catch (error) {
        console.error("Ресторан ачаалахад алдаа гарлаа:", error);
        restaurantList.innerHTML = '<p class="text-danger text-center">Өгөгдөл ачаалахад алдаа гарлаа.</p>';
    }
}

// Хайлтын функц (Жишээ)
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.onkeyup = function() {
            console.log("Хайж байна: " + this.value);
            // Хайлтын логик энд орно
        };
    }
}

// Create account товчлуур
document.getElementById('createacc').addEventListener('click', function() {
    openRegisterModal();
});

document.addEventListener('DOMContentLoaded', () => {
    console.log("FoodieGo үндсэн JS ачаалагдлаа.");
    loadRestaurants();
    setupSearch();

    // Sign in товч → loginModal
    document.getElementById('signIn').addEventListener('click', function() {
        openLoginModal();
    });

    // Create account товч → registerModal
    document.getElementById('createacc').addEventListener('click', function() {
        openRegisterModal();
    });
});
