package foodiego.repository;

import java.util.Optional;;
import foodiego.model.User; // Өөрийн үүсгэсэн User моделийг энд зааж өгнө
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);
}
