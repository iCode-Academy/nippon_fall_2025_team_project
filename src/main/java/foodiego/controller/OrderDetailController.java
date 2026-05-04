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

    // create
    @PostMapping
    public OrderDetail create(@RequestBody OrderDetail detail) {
        return orderDetailRepository.save(detail);
    }

    // read all
    @GetMapping
    public List<OrderDetail> getAll() {
        return orderDetailRepository.findAll();
    }

    // read 1
    @GetMapping("/{id}")
    public OrderDetail getById(@PathVariable Long id) {
        return orderDetailRepository.findById(id).orElse(null);
    }

    // update
    @PutMapping("/{id}")
    public OrderDetail update(@PathVariable Long id, @RequestBody OrderDetail newDetail) {

        OrderDetail detail = orderDetailRepository.findById(id).orElse(null);

        if (detail == null) {
            throw new RuntimeException("OrderDetail not found");
        }

        detail.setFoodId(newDetail.getFoodId());
        detail.setQuantity(newDetail.getQuantity());
        detail.setPrice(newDetail.getPrice());

        return orderDetailRepository.save(detail);
    }

    // delete
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {

        orderDetailRepository.deleteById(id);

        return "Deleted successfully";
    }
}
