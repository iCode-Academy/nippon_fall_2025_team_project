package foodiego.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import foodiego.model.Foods;
import foodiego.service.FoodService;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins="*")
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @GetMapping
    public ResponseEntity<List<Foods>> getAll() {
        return ResponseEntity.ok(foodService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Foods> getById(@PathVariable("id") Long id) { // ЗАСВАР: ("id") нэмсэн
        return ResponseEntity.ok(foodService.getById(id));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Foods>> getByRestaurant(@PathVariable("restaurantId") Long restaurantId) {
        return ResponseEntity.ok(foodService.getByRestaurant(restaurantId));
    }

    @PostMapping
    public ResponseEntity<Foods> create(@RequestBody Foods food) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(foodService.create(food));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Foods> update(@PathVariable("id") Long id, // ЗАСВАР: ("id") нэмсэн
                                       @RequestBody Foods food) {
        return ResponseEntity.ok(foodService.update(id, food));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) { // ЗАСВАР: ("id") нэмсэн
        foodService.delete(id);
        return ResponseEntity.noContent().build();
    }
}