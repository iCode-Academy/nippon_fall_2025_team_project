package foodiego.controller;

import foodiego.dto.LoginRequest;
import foodiego.dto.LoginResponse;
import foodiego.model.Role;
import foodiego.model.User;
import foodiego.model.Restaurant;
import foodiego.service.UserService;
import foodiego.repository.RestaurantRepository;
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
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user
    ) {
        // Default role
        if (user.getRole() == null) {
            user.setRole(Role.CUSTOMER);
        }
        // Password validation
        if (
                user.getPassword() == null ||
                user.getPassword().isBlank()
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("Password is required");
        }
        // Email validation
        if (
                user.getEmail() == null ||
                user.getEmail().isBlank()
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("Email is required");
        }
        // Name validation
        if (
                user.getName() == null ||
                user.getName().isBlank()
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("Name is required");
        }
        User newUser =
                userService.register(user);
        if (newUser != null) {
            return ResponseEntity.ok(
                    newUser
            );
        }
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Email already exists");
    }
    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest
    ) {
    	
        // Email validation
        if (
                loginRequest.getEmail() == null ||
                loginRequest.getEmail().isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body("Email is required");
        }
        // Password validation
        if (
                loginRequest.getPassword() == null ||
                loginRequest.getPassword().isBlank()
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("Password is required");
        }
        User user =
                userService.authenticate(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                );
        
        if (user != null) {
			
        	LoginResponse response = 
        			new LoginResponse();
        	
        	response.setId(user.getId());
        	response.setName(user.getName());
        	response.setEmail(user.getEmail());
        	response.setRole(user.getRole());
        	
        	Restaurant restaurant =
        			restaurantRepository
        			.findByManagerUserId(user.getId())
        			.orElse(null);
        	
        	if (restaurant != null) {
				response.setRestaurantId(
						restaurant.getId()
						);
			}
        	
        	return ResponseEntity.ok(response);
		}
        
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password");
    }
}