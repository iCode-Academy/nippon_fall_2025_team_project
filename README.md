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
FoodieGo/
├── .classpath                      // Eclipse-ийн төслийн тохиргоо
├── .gitignore                      // Git-рүү оруулахгүй файлуудын жагсаалт
├── pom.xml                         // Maven-ийн хамаарал болон сангуудын тохиргоо
├── README.md                       // Төслийн ерөнхий танилцуулга (Documentation)
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── foodiego/
│   │   │       ├── App.java        // Spring Boot аппликейшнийг эхлүүлэх үндсэн класс
│   │   │       ├── controller/     // Frontend-ээс ирэх HTTP хүсэлтүүдийг зохицуулах давхарга
│   │   │       │   ├── CategoryController.java    // Хоолны төрлүүдийг удирдах
│   │   │       │   ├── FoodController.java        // Хоолны мэдээллийг удирдах
│   │   │       │   ├── UserController.java        // Хэрэглэгчийн бүртгэл, нэвтрэлт
│   │   │       │   ├── ReservationController.java // Ширээ захиалгын үйлдлүүд
│   │   │       │   ├── PageController.java        // HTML хуудсуудын шилжилтийг удирдах
│   │   │       │   ├── RestaurantController.java  // [НЭМЭЛТ] Ресторануудын жагсаалт, шүүлтүүр
│   │   │       │   ├── CartController.java        // [НЭМЭЛТ] Сагсанд хоол нэмэх, хасах
│   │   │       │   └── OrderController.java       // [НЭМЭЛТ] Захиалга баталгаажуулах, түүх
│   │   │       ├── dto/            // Өгөгдөл дамжуулах объектууд (Data Transfer Objects)
│   │   │       │   ├── FoodResponseDTO.java       // Хоолны мэдээллийг хэрэглэгчид харуулах загвар
│   │   │       │   ├── LoginRequest.java          // Нэвтрэх хүсэлтийн өгөгдөл (Email, Password)
│   │   │       │   ├── RestaurantDTO.java         // [НЭМЭЛТ] Рестораны мэдээлэл харуулах загвар
│   │   │       │   └── OrderRequest.java          // [НЭМЭЛТ] Захиалга өгөх үеийн өгөгдөл
│   │   │       ├── model/          // Өгөгдлийн сангийн хүснэгтүүд (Entities)
│   │   │       │   ├── User.java                  // Хэрэглэгчийн хүснэгт
│   │   │       │   ├── Role.java                  // Эрх (USER, ADMIN, OWNER)
│   │   │       │   ├── Restaurant.java            // [НЭМЭЛТ] Рестораны хүснэгт
│   │   │       │   ├── Category.java              // Хоолны үндсэн төрлүүд
│   │   │       │   ├── MenuCategory.java          // [НЭМЭЛТ] Ресторан доторх ангилал (Lunch г.м)
│   │   │       │   ├── Foods.java                 // Хоолны мэдээлэл
│   │   │       │   ├── Address.java               // [НЭМЭЛТ] Хэрэглэгч болон рестораны хаяг
│   │   │       │   ├── Cart.java                  // [НЭМЭЛТ] Хэрэглэгчийн идэвхтэй сагс
│   │   │       │   ├── CartItem.java              // [НЭМЭЛТ] Сагсан дахь хоолнууд
│   │   │       │   ├── Order.java                 // [НЭМЭЛТ] Нийт захиалга
│   │   │       │   ├── OrderItem.java             // [НЭМЭЛТ] Захиалга дахь хоолнууд
│   │   │       │   ├── OrderStatus.java           // [НЭМЭЛТ] Захиалгын төлөв (Enum)
│   │   │       │   ├── Reservation.java           // Захиалгын хүснэгт
│   │   │       │   └── ReservationStatus.java     // Захиалгын төлөв (Enum)
│   │   │       ├── repository/     // Database-тэй шууд харилцах давхарга (JPA)
│   │   │       │   ├── UserRepository.java        // Хэрэглэгчийн Query-нүүд
│   │   │       │   ├── RestaurantRepository.java  // [НЭМЭЛТ] Рестораны Query-нүүд
│   │   │       │   ├── CategoryRepository.java    // Ангиллын Query-нүүд
│   │   │       │   ├── FoodRepository.java        // Хоолны Query-нүүд
│   │   │       │   ├── CartRepository.java        // [НЭМЭЛТ] Сагсны Query-нүүд
│   │   │       │   ├── OrderRepository.java       // [НЭМЭЛТ] Захиалгын Query-нүүд
│   │   │       │   └── ReservationRepository.java // Ширээ захиалгын Query-нүүд
│   │   │       └── service/        // Бизнес логик боловсруулах давхарга
│   │   │           ├── UserService.java           // Бүртгэл баталгаажуулах, нууц үг шифрлэх
│   │   │           ├── RestaurantService.java     // [НЭМЭЛТ] Нээлттэй байгаа эсэхийг шалгах
│   │   │           ├── CategoryService.java       // Ангиллын логик
│   │   │           ├── FoodService.java           // Хоолны үнэ, төрлийн шүүлт
│   │   │           ├── CartService.java           // [НЭМЭЛТ] Сагсны тооцоолол
│   │   │           ├── OrderService.java          // [НЭМЭЛТ] Захиалга баталгаажуулах логик
│   │   │           └── ReservationService.java    // Ширээ захиалгын логик
│   │   └── resources/
│   │       ├── application.properties             // DB холболт болон серверийн тохиргоо
│   │       └── static/             // Вэб интерфейсийн статик файлууд
│   │           ├── index.html                     // Нүүр хуудас

│   │           ├── login.html                     // Нэвтрэх хуудас
│   │           ├── register.html                  // Бүртгүүлэх хуудас
│   │           ├── category_module.html           // Ангиллаар шүүх хуудас
│   │           ├── restaurant_detail.html         // [НЭМЭЛТ] Ресторан доторх цэсний хуудас
│   │           ├── checkout.html                  // [НЭМЭЛТ] Захиалга баталгаажуулах хуудас
│   │           ├── css/            // Загварын файлууд
│   │           │   ├── main.css                   // Ерөнхий загвар
│   │           │   ├── styles.css                 // Нэмэлт загварууд
│   │           │   ├── category.css               // Ангиллын хуудасны загвар
│   │           │   └── checkout.css               // [НЭМЭЛТ] Захиалгын хуудасны загвар
│   │           ├── js/             // Frontend-ийн логик файлууд
│   │           │   ├── foodiego.js                // Үндсэн JS үйлдлүүд
│   │           │   ├── main.js                    // Хуудасны ажиллагаа
│   │           │   ├── category.js                // Шүүлтүүрийн логик
│   │           │   └── cart_manager.js            // [НЭМЭЛТ] Сагсны үйлдлийг удирдах JS
│   │           └── picture/        // Зургийн сан
│   │               ├── Category/                  // Хоолны төрлийн иконууд (Sushi, Burger г.м)
│   │               ├── Layout/                    // Вэб бүтцийн иконууд (Location, Basket г.м)
│   │               ├── main/                      // Нүүр хуудасны баннер, дэвсгэр зураг
│   │               └── Restaurants/               // [НЭМЭЛТ] Ресторануудын хавтас зургууд
│   └── test/                       // Тест кодууд (Unit testing)
└── target/                         // Проектыг Build хийхэд үүсдэг түр файлууд


