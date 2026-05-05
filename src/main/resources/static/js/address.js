const ADDRESS_API = '/api/addresses';

async function fetchAddresses() {
    try {
        const response = await fetch(ADDRESS_API);
        if (response.ok) {
            const addresses = await response.json();
            renderAddresses(addresses);
        }
    } catch (error) {
        console.error("Хаяг татахад алдаа гарлаа:", error);
    }
}

function renderAddresses(addresses) {
    const list = document.getElementById('address-list');
    if (!list) return;
    
    list.innerHTML = '';
    addresses.forEach(addr => {
        const li = document.createElement('li');
        li.textContent = `Хот: ${addr.city}, Гудамж: ${addr.street}`; 
        list.appendChild(li);
    });
}

async function saveAddress(event) {
    event.preventDefault(); 
    
    const newAddress = {
        city: document.getElementById('cityInput').value,
        street: document.getElementById('streetInput').value
    };

    try {
        const response = await fetch(ADDRESS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAddress)
        });

        if (response.ok) {
            alert('Хаяг амжилттай нэмэгдлээ!');
            fetchAddresses(); 
            document.getElementById('address-form').reset(); 
        }
    } catch (error) {
        console.error("Хаяг хадгалахад алдаа гарлаа:", error);
    }
}

// Хуудас ачаалж дуусахад функцүүдийг холбох
document.addEventListener('DOMContentLoaded', () => {
    fetchAddresses();
    const form = document.getElementById('address-form');
    if (form) form.addEventListener('submit', saveAddress);
});