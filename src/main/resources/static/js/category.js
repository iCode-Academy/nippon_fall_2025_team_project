const API_URL = "http://localhost:8080/api/categories";
let categories = [];

// 1. Backend-ээс категориудаа татах
async function fetchCategories() {
    try {
        const response = await fetch(API_URL);
        categories = await response.json();
        render();
    } catch (err) {
        console.error("Backend алдаа:", err);
    }
}

// 2. Дэлгэцэнд зурах
function render() {
    const display = document.getElementById('catDisplay');
    const manage = document.getElementById('manageList');
    const userRole = localStorage.getItem("userRole"); // LocalStorage-аас авах

    if (!display) return;

    // Категориудыг зурах
    let html = categories.map(cat => `
        <div class="cat-item">
            <img src="${cat.categoryIcon}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/706/706164.png'">
            <span>${cat.categoryName}</span>
        </div>
    `).join('');

    // Хэрэв ADMIN бол "Нэмэх" товчийг жагсаалтын төгсгөлд нэмэх
    if (userRole === 'ADMIN') {
        html += `
            <div class="admin-add-item" onclick="openModal()">
                <div class="add-icon-circle"><i class="fas fa-plus"></i></div>
                <span>Нэмэх</span>
            </div>
        `;
    }
    
    display.innerHTML = html;

<<<<<<< Updated upstream
    // 2. МОДол доторх дизайн
    manage.innerHTML = categories.map(cat => `
        <div class="manage-item">
            <img src="${cat.categoryIcon}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/706/706164.png'">
            <span>${cat.categoryName}</span>
            <i class="fas fa-trash-alt del-icon" onclick="handleDelete(${cat.id})" title="Устгах"></i>
        </div>
    `).join('');

    updateArrows();
}

async function saveCategory() {
    const name = document.getElementById('nameInput').value;
    const file = document.getElementById('fileInput').files[0];

    if (!name || !file) return alert("Мэдээллээ бүрэн оруулна уу!");

    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = { categoryName: name, categoryIcon: e.target.result, categoryDescription: "" };
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {

            document.getElementById('nameInput').value = '';
            document.getElementById('fileInput').value = '';

            fetchCategories();
            const iframe = document.getElementById('restaurantIframe');

            if (iframe) {
                iframe.contentWindow.loadCategories();
            }
            closeModal();
        }
    };
    reader.readAsDataURL(file);
}

async function handleDelete(id) {
    if (confirm("Устгах уу?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchCategories();
=======
    // Модал доторх устгах жагсаалт
    if (manage) {
        manage.innerHTML = categories.map(cat => `
            <div class="manage-item">
                <div>
                    <img src="${cat.categoryIcon}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/706/706164.png'">
                    <span>${cat.categoryName}</span>
                </div>
                <i class="fas fa-trash-alt del-icon" onclick="handleDelete(${cat.id})" title="Устгах"></i>
            </div>
        `).join('');
>>>>>>> Stashed changes
    }

    setTimeout(updateArrows, 100);
}

// 3. Гүйлгэх функц
function scrollCats(direction) {
    const slider = document.getElementById('catSlider');
    const scrollAmount = 250; 
    slider.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// 4. Сумнуудыг харуулах/нуух
function updateArrows() {
    const slider = document.getElementById('catSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
<<<<<<< Updated upstream

    if (!slider) return;

=======
    
    if (!slider || !prevBtn || !nextBtn) return;
    
>>>>>>> Stashed changes
    prevBtn.style.display = slider.scrollLeft > 10 ? "flex" : "none";
    const isAtEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10;
    nextBtn.style.display = isAtEnd ? "none" : "flex";
}

// --- Бусад функцууд (saveCategory, handleDelete, openModal, closeModal) хэвээрээ байна ---

// Хуудас ачаалагдахад
window.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    const slider = document.getElementById('catSlider');
    if (slider) {
        slider.addEventListener('scroll', updateArrows);
    }
    window.addEventListener('resize', updateArrows);
});