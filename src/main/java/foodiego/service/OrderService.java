package foodiego.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import foodiego.model.Order;
import foodiego.model.OrderDetail;
import foodiego.repository.OrderRepository;

@Service
public class OrderService {

	@Autowired
	private OrderRepository orderRepository;

	public Order createOrder(Order order) {

		// check null
		if (order.getOrderDetails() == null || order.getOrderDetails().isEmpty()) {
			throw new RuntimeException("Order must contain at least 1 item");
		}

		order.setTotalPrice(0);
		double total = 0;

		// works on every OrderDetail
		for (OrderDetail detail : order.getOrderDetails()) {

			if (detail == null) continue;

			if (detail.getQuantity() <= 0) {
				throw new RuntimeException("Quantity must be greater then 0");
			}

			detail.setOrder(order);
			total += detail.getPrice() * detail.getQuantity();
		}

		// total price
		order.setTotalPrice(total);

		// status
		if (order.getStatus() == null) {
			order.setStatus("pending");
		}

		return orderRepository.save(order);
	}
}