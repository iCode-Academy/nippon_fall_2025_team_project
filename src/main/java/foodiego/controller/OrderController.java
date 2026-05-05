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

	// 1. create order
	@PostMapping
	public Order createOrder(@RequestBody Order order) {
		User user = userRepository.findById(order.getUserId())
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		order.setUser(user); // end holbono
		
		return orderService.createOrder(order);
	}

	// 2. get all orders
	@GetMapping
	public List<Order> getAllOrders() {
		return orderRepository.findAll();
	}

	// 3. get 1 order
	@GetMapping("/{id}")
	public Order getOrderById(@PathVariable Long id) {
		return orderRepository.findById(id).orElse(null);
	}

	// 4. get user orders
	@GetMapping("/user/{userId}")
	public List<Order> getOrdersByUser(@PathVariable Long userId) {
		return orderRepository.findByUser_Id(userId);
	}
}
