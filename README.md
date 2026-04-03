# nippon_fall_2025_team_project

Database загвар (Entities)

ХүснэгтТалбарууд
users : id, name, email, password, role
foods : id, name, price, image, description, category_id(foreign key connect), address_id(to foreign key address)
address: id, name. district
category : id, category_name, category_icon, category_description
orders : id, userId, items, total, status, createdAt
order_items : id, orderId, menuItemId, quantity, price
reservations : id, userId, date, time, guests, status
reviews : id, userId, menuItemId, rating, comment



1. Authentification (Нэвтрэх систем)
POST /api/auth/register     ← Бүртгүүлэх
POST /api/auth/login        ← Нэвтрэх
POST /api/auth/logout       ← Гарах
GET  /api/auth/me           ← Өөрийн мэдээлэл




🍽️ 2. Меню
GET    /api/menu                ← Бүх хоол жагсаах
GET    /api/menu/:id            ← Нэг хоолны дэлгэрэнгүй
GET    /api/menu/category/:cat  ← Ангиллаар шүүх
POST   /api/menu                ← Хоол нэмэх (admin)
PUT    /api/menu/:id            ← Хоол засах (admin)
DELETE /api/menu/:id            ← Хоол устгах (admin)

🛒 3. Захиалга (Order)

POST   /api/orders              ← Захиалга үүсгэх
GET    /api/orders/:id          ← Захиалга харах
GET    /api/orders/user/:userId ← Хэрэглэгчийн захиалгууд
PUT    /api/orders/:id/status   ← Статус өөрчлөх (admin)
DELETE /api/orders/:id          ← Захиалга цуцлах


🪑 4. Ширээ захиалах (Reservation)
POST   /api/reservations        ← Ширээ захиалах
GET    /api/reservations/:id    ← Захиалга шалгах
PUT    /api/reservations/:id    ← Засах
DELETE /api/reservations/:id    ← Цуцлах


⭐ 5. Үнэлгээ & Сэтгэгдэл (Review)
POST   /api/reviews             ← Сэтгэгдэл бичих
GET    /api/reviews/menu/:id    ← Хоолны сэтгэгдлүүд
DELETE /api/reviews/:id         ← Устгах (admin)



👤 6. Хэрэглэгч (User)
GET    /api/users/profile       ← Профайл харах
PUT    /api/users/profile       ← Профайл засах
GET    /api/users               ← Бүх хэрэглэгч (admin)

![alt text](image.png)

src/main/java/com/foodiego/
├── entity/
│   ├── User.java
│   ├── Foods.java
│   ├── Category.java
│   ├── Address.java
│   ├── Order.java
│   ├── OrderItem.java
│   ├── Reservation.java
│   ├── Review.java
│   └── Role.java, OrderStatus.java, ReservationStatus.java
├── repository/
│   ├── UserRepository.java
│   ├── FoodRepository.java
│   ├── OrderRepository.java
│   ├── ReservationRepository.java
│   └── ReviewRepository.java
├── dto/
│   ├── UserDTO.java
│   ├── FoodDTO.java
│   ├── OrderDTO.java
│   ├── ReservationDTO.java
│   └── ReviewDTO.java
├── service/
│   ├── UserService.java
│   ├── FoodService.java
│   ├── OrderService.java
│   ├── ReservationService.java
│   └── ReviewService.java
└── controller/
    ├── UserController.java
    ├── FoodController.java
    ├── OrderController.java
    ├── ReservationController.java
    └── ReviewController.java


