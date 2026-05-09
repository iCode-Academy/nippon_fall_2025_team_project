package foodiego.controller;

import foodiego.model.User;
import foodiego.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*") 
public class UserController {

    @Autowired
    private UserService userService; 

    // 1. Бүх хэрэглэгчдийг авах
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    // 2. ID-аар хэрэглэгч авах
    @GetMapping("/{id}")
    // ЗАСВАР: ("id") нэмэгдсэн
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) { 
        User user = userService.findUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }
    
    // 5. Устгах
    @DeleteMapping("/delete/{id}")
    // ЗАСВАР: ("id") нэмэгдсэн
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        boolean isDeleted = userService.deleteUser(id);
        
        if (isDeleted) {
            return ResponseEntity.ok("Хэрэглэгч амжилттай устгагдлаа.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Устгах боломжгүй. Хэрэглэгч олдсонгүй.");
        }
    }
}