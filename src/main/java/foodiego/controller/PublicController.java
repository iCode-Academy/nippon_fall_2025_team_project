package foodiego.controller;

import foodiego.dto.LoginRequest;
import foodiego.model.Role;
import foodiego.model.User;
import foodiego.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {

    @Autowired
    private UserService userService;

    // Register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (user.getRole() == null) {
            user.setRole(Role.CUSTOMER);
        }

        User newUser = userService.register(user);

        if (newUser != null) {
            return ResponseEntity.ok(newUser);
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Email already exists");
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        User user = userService.authenticate(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (user != null) {
            return ResponseEntity.ok(user);
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password");
    }
}