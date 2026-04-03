package foodiego.controller;

import foodiego.dto.LoginRequest;
import foodiego.model.User;
import foodiego.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
    	User newUser = authService.register(user);
    	if(newUser != null) {
    		return ResponseEntity.ok("Хэрэглэгч амжилттай бүртгэгдлээ");
    	} else {
    		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Энэ и-мэйл хаяг аль хэдийн бүртгэгдсэн байна.");
    	}
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = authService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
        
        if (user != null) {
            // Нэвтрэлт амжилттай бол хэрэглэгчийн мэдээллийг (нууц үггүйгээр) буцаах нь тохиромжтой
            return ResponseEntity.ok("Амжилттай нэвтэрлээ. Тавтай морил, " + user.getName());
        } else {
            // Амжилтгүй бол 401 Unauthorized алдаа буцаана
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("И-мэйл эсвэл нууц үг буруу байна.");
        }
    }
}