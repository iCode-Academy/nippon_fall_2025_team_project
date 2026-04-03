package foodiego.service;

import foodiego.model.User;
import foodiego.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    
 // Шинэ хэрэглэгч бүртгэх
    public User register(User user) {
        // И-мэйл өмнө нь бүртгэгдсэн эсэхийг шалгах
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return null; // Эсвэл тусгай алдаа (Exception) шидэж болно
        }
        // Одоогоор нууц үгийг шууд хадгалж байна (Дараа нь BCrypt нэмнэ)
        return userRepository.save(user);
    }

    public User authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Одоогоор шууд текстээр шалгаж байна. Дараа нь BCrypt нэмнэ.
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        return null; // Хэрэв олдохгүй эсвэл нууц үг буруу бол
    }
}