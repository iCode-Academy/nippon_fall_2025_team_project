package foodiego.controller;

import foodiego.model.User;
import foodiego.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List; // Энийг нэмэх шаардлагатай

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*") 
public class UserController {

    @Autowired
    private UserService userService; // Нэрийг нь authService-ээс userService болгож жигдлэв

    // 1. Бүх хэрэглэгчдийг авах
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    // 2. ID-аар хэрэглэгч авах
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.findUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
    
    // 5. Устгах
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        boolean isDeleted = userService.deleteUser(id);
        
        if (isDeleted) {
            return ResponseEntity.ok("Хэрэглэгч амжилттай устгагдлаа.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Устгах боломжгүй. Хэрэглэгч олдсонгүй.");
        }
    }
}