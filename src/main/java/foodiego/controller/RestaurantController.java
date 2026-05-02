package foodiego.controller;

import foodiego.model.Restaurant;
import foodiego.repository.RestaurantRepository;
import foodiego.service.RestaurantService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private RestaurantService restaurantService;
    
    // Бүх рестораны жагсаалтыг авах
    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }


    @PostMapping("/add")
    public ResponseEntity<Restaurant> add(@RequestBody Restaurant restaurant) {
        // Энд Service-ийг дуудахад ID автоматаар тооцоологдоно
        Restaurant savedRestaurant = restaurantService.addRestaurant(restaurant);
        return ResponseEntity.ok(savedRestaurant);
    }

    // Тухайн id-тай рестораны мэдээллийг авах
    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        return restaurantRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
 // Ресторан устгах функц
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRestaurant(@PathVariable Long id) {
        return restaurantRepository.findById(id)
                .map(restaurant -> {
                    restaurantRepository.delete(restaurant);
                    return ResponseEntity.ok("Ресторан амжилттай устгагдлаа. ID: " + id);
                })
                .orElse(ResponseEntity.status(404).body("Устгах боломжгүй. ID: " + id + " олдсонгүй."));
    }
}