package foodiego.controller;

import foodiego.model.Address;
<<<<<<< HEAD
import foodiego.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
=======
import foodiego.model.User;
import foodiego.repository.UserRepository;
import foodiego.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
>>>>>>> 52e9f9da86d677b8899e3a082221be26899efcb1
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
<<<<<<< HEAD
public class AddressController {

    private final AddressService addressService;

    @Autowired
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
=======
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
>>>>>>> 52e9f9da86d677b8899e3a082221be26899efcb1
    }

    @GetMapping
    public List<Address> getAllAddresses() {
<<<<<<< HEAD
        return addressService.getAllAddresses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(@PathVariable Long id) {
        return addressService.getAddressById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Address createAddress(@RequestBody Address address) {
        return addressService.saveAddress(address);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable Long id, @RequestBody Address addressDetails) {
        return addressService.getAddressById(id).map(existingAddress -> {
            existingAddress.setName(addressDetails.getName());
            existingAddress.setDistrict(addressDetails.getDistrict());
            Address updatedAddress = addressService.saveAddress(existingAddress);
            return ResponseEntity.ok(updatedAddress);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        if (addressService.getAddressById(id).isPresent()) {
            addressService.deleteAddress(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
=======
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
>>>>>>> 52e9f9da86d677b8899e3a082221be26899efcb1
    }
}