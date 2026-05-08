package foodiego.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import foodiego.model.Foods;

public interface FoodRepository extends JpaRepository<Foods, Long> {

	List<Foods> findByCategory_Id(Long categoryId);
	
	List<Foods> findByRestaurantId(Long restaurantId);
	}
