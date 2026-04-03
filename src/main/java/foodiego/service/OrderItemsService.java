package foodiego.service;

import foodiego.model.OrderItems;
import foodiego.repository.OrderItemsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemsService {

    private final OrderItemsRepository orderItemsRepository;

    @Autowired
    public OrderItemsService(OrderItemsRepository orderItemsRepository) {
        this.orderItemsRepository = orderItemsRepository;
    }

    public List<OrderItems> getAllOrderItems() {
        return orderItemsRepository.findAll();
    }

    public Optional<OrderItems> getOrderItemsById(Long id) {
        return orderItemsRepository.findById(id);
    }

    public OrderItems saveOrderItems(OrderItems orderItems) {
        return orderItemsRepository.save(orderItems);
    }

    public void deleteOrderItems(Long id) {
        orderItemsRepository.deleteById(id);
    }
}