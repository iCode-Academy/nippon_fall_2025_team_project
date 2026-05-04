package foodiego.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import foodiego.model.Order;
import foodiego.service.OrderService;
import foodiego.repository.OrderRepository;

@RestController
@RequestMapping("/orders")
public class OrderController {

	@Autowired
	private OrderService orderService;

	@Autowired
	private OrderRepository orderRepository;

	// 1. create order
	@PostMapping
	public Order createOrder(@RequestBody Order order) {
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
