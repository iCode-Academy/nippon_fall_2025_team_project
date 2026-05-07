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
@CrossOrigin(origins = "*")
public class RestaurantController {

    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private RestaurantService restaurantService;
    
    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    @PostMapping("/add")
    public ResponseEntity<Restaurant> add(@RequestBody Restaurant restaurant) {
        // Service дээр ID оноох логик ажиллана
        Restaurant savedRestaurant = restaurantService.addRestaurant(restaurant);
        return ResponseEntity.ok(savedRestaurant);
    }

  @DeleteMapping("/{id}")
public ResponseEntity<String> deleteRestaurant(@PathVariable("id") Long id) {
    return restaurantRepository.findById(id)
            .map(restaurant -> {
                restaurantRepository.delete(restaurant);
                return ResponseEntity.ok("Амжилттай устлаа");
            })
            .orElse(ResponseEntity.status(404).body("Олдсонгүй"));
}
}