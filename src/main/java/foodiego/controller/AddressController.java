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
@CrossOrigin(origins = "*")
public class AddressController {

    private final AddressService addressService;
    private final UserRepository userRepository;

    @Autowired
    public AddressController(AddressService addressService, UserRepository userRepository) {
        this.addressService = addressService;
        this.userRepository = userRepository;
    }

    // Бүх хаягийг авах
    @GetMapping
    public List<Address> getAllAddresses() {
        return addressService.getAllAddresses();
    }

    // ID-аар хаяг авах
    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(@PathVariable Long id) {
        return addressService.getAddressById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Шинэ хаяг үүсгэх (User-тэй холбож)
    @PostMapping
    public ResponseEntity<?> createAddress(@RequestBody Address address, @RequestParam Long userId) {
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        address.setUser(user);
        Address savedAddress = addressService.saveAddress(address);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAddress);
    }

    // Хаяг шинэчлэх
    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable Long id, @RequestBody Address addressDetails) {
        return addressService.getAddressById(id).map(existingAddress -> {
            // BUG 1 FIX: Модель дээр 'name' биш 'receiverName' болсон тул түүнийг засах
            existingAddress.setReceiverName(addressDetails.getReceiverName());
            existingAddress.setDistrict(addressDetails.getDistrict());

            // BUG 2 FIX: Шинэ талбаруудыг нэмж шинэчлэх (city, apartment г.м)
            existingAddress.setCity(addressDetails.getCity());
            existingAddress.setApartment(addressDetails.getApartment());
            existingAddress.setRoomNumber(addressDetails.getRoomNumber());
            existingAddress.setReceiverPhone(addressDetails.getReceiverPhone());

            Address updatedAddress = addressService.saveAddress(existingAddress);
            return ResponseEntity.ok(updatedAddress);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Хаяг устгах
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        if (addressService.getAddressById(id).isPresent()) {
            addressService.deleteAddress(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}