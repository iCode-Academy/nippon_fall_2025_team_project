const API_URL = "http://localhost:8080/api/categories";
let categories = [];
const userRole = localStorage.getItem("userRole"); // admin эсвэл user энийг яаж холбохыг мэдэхгүй байгаа

async function fetchCategories() {
    try {
        const response = await fetch(API_URL);
        categories = await response.json();
        render();
    } catch (err) {
        console.error("Backend алдаа:", err);
    }
}

function render() {
    const display = document.getElementById('catDisplay');
    const manage = document.getElementById('manageList');

    // Category-г зурах
    let html = categories.map(cat => `
        <div class="cat-item">
            <img src="${cat.categoryIcon}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/706/706164.png'">
            <span>${cat.categoryName}</span>
        </div>
    `).join('');

    // Энэ хэсгийг ойлгоогүй AIдсан
    if (userRole === 'ADMIN') {
        html += `
            <div class="admin-add-item admin-only" onclick="openModal()">
                <div class="add-icon-circle"><i class="fas fa-plus"></i></div>
                <span>Нэмэх</span>
            </div>
        `;
    }
    display.innerHTML = html;

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
    }
}

function scrollCats(dir) {
    const slider = document.getElementById('catSlider');
    slider.scrollLeft += dir * 250;
}

function updateArrows() {
    const slider = document.getElementById('catSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!slider) return;

    prevBtn.style.display = slider.scrollLeft > 10 ? "flex" : "none";
    const isAtEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10;
    nextBtn.style.display = isAtEnd ? "none" : "flex";
}

function openModal() { document.getElementById('catModal').style.display = 'block'; }
function closeModal() { document.getElementById('catModal').style.display = 'none'; }

window.onload = () => {
    fetchCategories();
    document.getElementById('catSlider').addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
};