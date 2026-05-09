package foodiego.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import foodiego.model.Order;
import foodiego.model.User;
import foodiego.service.OrderService;
import foodiego.repository.OrderRepository;
import foodiego.repository.UserRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;

    // 1. Захиалга үүсгэх
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        User user = userRepository.findById(order.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        order.setUser(user);
        return orderService.createOrder(order);
    }

    // 2. Бүх захиалгыг авах
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // 3. Нэг захиалгыг ID-аар авах
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable("id") Long id) { // ЗАСВАР: ("id") нэмсэн
        return orderRepository.findById(id).orElse(null);
    }

    // 4. Тухайн хэрэглэгчийн захиалгуудыг авах
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable("userId") Long userId) { // ЗАСВАР: ("userId") нэмсэн
        return orderRepository.findByUser_Id(userId);
    }
}