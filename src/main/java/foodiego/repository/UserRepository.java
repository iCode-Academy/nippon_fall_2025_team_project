package foodiego.repository;

import java.util.Optional;
import foodiego.repository.UserRepository;
import foodiego.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);
}
