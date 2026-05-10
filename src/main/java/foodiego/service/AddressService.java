package foodiego.service;

import foodiego.model.Address;
import foodiego.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
<<<<<<< HEAD
import java.util.Optional;
=======
>>>>>>> 52e9f9da86d677b8899e3a082221be26899efcb1

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    @Autowired
    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

<<<<<<< HEAD
    public Optional<Address> getAddressById(Long id) {
        return addressRepository.findById(id);
    }

    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }

    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);
    }
=======
    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }
>>>>>>> 52e9f9da86d677b8899e3a082221be26899efcb1
}