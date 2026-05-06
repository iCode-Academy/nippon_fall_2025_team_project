package foodiego.repository;

import java.util.Optional;
import foodiego.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Энэ нь Spring-д энэ классыг Repository гэдгийг таниулна
public interface UserRepository extends JpaRepository<User, Long> {
    
    // И-мэйлээр хэрэглэгчийг хайх (Нэвтрэх болон бүртгэл шалгахад ашиглагдана)
    Optional<User> findByEmail(String email);
}