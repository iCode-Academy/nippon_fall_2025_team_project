package foodiego.controller;

import foodiego.dto.LoginRequest;
import foodiego.model.User;
import foodiego.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService authService;
    
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
         
            return ResponseEntity.ok("Амжилттай нэвтэрлээ. Тавтай морил, " + user.getName());
        } else {
         
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("И-мэйл эсвэл нууц үг буруу байна.");
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        boolean isDeleted = authService.deleteUser(id);
        
        if (isDeleted) {
            return ResponseEntity.ok("Хэрэглэгч амжилттай устгагдлаа.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Устгах боломжгүй. Хэрэглэгч олдсонгүй.");
        }
    }
}