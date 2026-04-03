package foodiego.controller;

import foodiego.model.OrderItems;
import foodiego.service.OrderItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemsController {

    private final OrderItemsService orderItemsService;

    @Autowired
    public OrderItemsController(OrderItemsService orderItemsService) {
        this.orderItemsService = orderItemsService;
    }

    @GetMapping
    public List<OrderItems> getAllOrderItems() {
        return orderItemsService.getAllOrderItems();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItems> getOrderItemsById(@PathVariable Long id) {
        return orderItemsService.getOrderItemsById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OrderItems createOrderItems(@RequestBody OrderItems orderItems) {
        return orderItemsService.saveOrderItems(orderItems);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderItems> updateOrderItems(@PathVariable Long id, @RequestBody OrderItems orderItemsDetails) {
        return orderItemsService.getOrderItemsById(id).map(existingItem -> {
            existingItem.setQuantity(orderItemsDetails.getQuantity());
            existingItem.setPrice(orderItemsDetails.getPrice());
            OrderItems updatedItem = orderItemsService.saveOrderItems(existingItem);
            return ResponseEntity.ok(updatedItem);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItems(@PathVariable Long id) {
        if (orderItemsService.getOrderItemsById(id).isPresent()) {
            orderItemsService.deleteOrderItems(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}