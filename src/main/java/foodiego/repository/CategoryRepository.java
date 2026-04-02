package foodiego.repository;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import foodiego.model.Category;

public interface CategoryRepository  extends JpaRepository<Category, Long>{


	Optional<Category> findByCategoryName(String categoryName);
}
