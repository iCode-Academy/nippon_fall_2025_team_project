package foodiego.controller;

import foodiego.model.Address;
import foodiego.model.User;
import foodiego.repository.UserRepository;
import foodiego.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin
public class AddressController {

    private final AddressService addressService;
    private final UserRepository userRepository;

    @Autowired
    public AddressController(
            AddressService addressService,
            UserRepository userRepository) {

        this.addressService =
            addressService;

        this.userRepository =
            userRepository;
    }

    @GetMapping
    public List<Address> getAllAddresses() {
        return addressService
            .getAllAddresses();
    }

    @PostMapping
    public ResponseEntity<?> createAddress(
            @RequestBody Address address,
            @RequestParam Long userId) {

        User user =
            userRepository
                .findById(userId)
                .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        address.setUser(user);
        Address savedAddress =
            addressService
                .saveAddress(address);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedAddress);
    }
}