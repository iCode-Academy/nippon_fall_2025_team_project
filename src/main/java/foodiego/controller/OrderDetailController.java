package foodiego.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import foodiego.model.OrderDetail;
import foodiego.repository.OrderDetailRepository;

@RestController
@RequestMapping("/order-details")
public class OrderDetailController {
    
    @Autowired
    private OrderDetailRepository orderDetailRepository;

    // Шинэ дэлгэрэнгүй үүсгэх
    @PostMapping
    public OrderDetail create(@RequestBody OrderDetail detail) {
        return orderDetailRepository.save(detail);
    }

    // Бүх дэлгэрэнгүйг авах
    @GetMapping
    public List<OrderDetail> getAll() {
        return orderDetailRepository.findAll();
    }

    // Нэгийг ID-аар авах
    @GetMapping("/{id}")
    public OrderDetail getById(@PathVariable("id") Long id) { // ЗАСВАР: ("id") нэмсэн
        return orderDetailRepository.findById(id).orElse(null);
    }

    // Засварлах
    @PutMapping("/{id}")
    public OrderDetail update(@PathVariable("id") Long id, @RequestBody OrderDetail newDetail) { // ЗАСВАР: ("id") нэмсэн
        OrderDetail detail = orderDetailRepository.findById(id).orElse(null);

        if (detail == null) {
            throw new RuntimeException("OrderDetail not found");
        }

        detail.setFoodId(newDetail.getFoodId());
        detail.setQuantity(newDetail.getQuantity());
        detail.setPrice(newDetail.getPrice());

        return orderDetailRepository.save(detail);
    }

    // Устгах
    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") Long id) { // ЗАСВАР: ("id") нэмсэн
        orderDetailRepository.deleteById(id);
        return "Deleted successfully";
    }
}