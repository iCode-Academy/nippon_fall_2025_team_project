package foodiego.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import foodiego.model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

//	Get all reviews for a specific food.
	List<Review> findByFoods_Id(Long foodId);
	
//	Get all reviews for a specific user.
	List<Review> findByUserId(Long userId);
}
