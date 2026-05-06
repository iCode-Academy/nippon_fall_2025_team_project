package foodiego.controller;

import foodiego.dto.LoginRequest;
import foodiego.model.User;
import foodiego.service.UserService;

import java.util.Optional;

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
    
    // 3. Бүртгүүлэх
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Хэрэв роль ирээгүй бол анхдагч утга оноох логик Service дээр байх ёстой
        User newUser = userService.register(user);
        if(newUser != null) {
            return ResponseEntity.ok(newUser); // Мессеж биш объектыг нь буцаавал илүү сайн
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Энэ и-мэйл хаяг аль хэдийн бүртгэгдсэн байна.");
        }
    }

    // 4. Нэвтрэх (Role-ийг заавал буцаах ёстой)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        
        if (user != null) {
            // Frontend-д ролийг нь таньж товч харуулахад user объектыг бүтнээр нь буцаах хэрэгтэй
            return ResponseEntity.ok(user); 
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("И-мэйл эсвэл нууц үг буруу байна.");
        }
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