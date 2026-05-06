package foodiego.service;

import foodiego.model.Role;
import foodiego.model.User;
import foodiego.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import at.favre.lib.crypto.bcrypt.BCrypt;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Хэрэглэгч бүртгэх
    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return null; 
        }
        
        // Нууц үг шифрлэх
        String bcryptHashString = BCrypt.withDefaults().hashToString(12, user.getPassword().toCharArray());
        user.setPassword(bcryptHashString);
        
        // Роль оноогоогүй бол CUSTOMER болгох
        if (user.getRole() == null) {
            user.setRole(Role.CUSTOMER);
        }
        return userRepository.save(user);
    }

    // Нэвтрэх эрх шалгах
    public User authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Шифрлэсэн нууц үгийг шалгах
            BCrypt.Result result = BCrypt.verifyer().verify(password.toCharArray(), user.getPassword());
            if (result.verified) {
                return user;
            }
        }
        return null;
    }

    // Бүх хэрэглэгчийг авах
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    // ID-аар хайх (UserController-д зориулсан хувилбар)
    public User findUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // Устгах
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}