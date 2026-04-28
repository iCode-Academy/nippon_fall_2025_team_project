package foodiego.controller;

import foodiego.dto.LoginRequest;
import foodiego.model.User;
import foodiego.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") 
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User newUser = userService.register(user);
        if (newUser != null) {
            return ResponseEntity.ok("Хэрэглэгч амжилттай бүртгэгдлээ. Түр хүлээнэ үү...");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Энэ и-мэйл хаяг аль хэдийн бүртгэгдсэн байна.");
        }
    }

   
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        if (user != null) {
            return ResponseEntity.ok("Амжилттай нэвтэрлээ. Тавтай морил, " + user.getName());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("И-мэйл эсвэл нууц үг буруу байна.");
        }
    }
}