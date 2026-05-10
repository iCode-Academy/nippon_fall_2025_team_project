package foodiego.repository;

import foodiego.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RatingRepository
        extends JpaRepository<Rating, Long> {

    @Query("""
        SELECT AVG(r.ratingValue)
        FROM Rating r
        WHERE r.restaurant.id = :restaurantId
    """)
    Double getAverageRatingByRestaurantId(
            Long restaurantId
    );
//    Batja written code START code
    @Query("""
    	    SELECT COUNT(r)
    	    FROM Rating r
    	    WHERE r.restaurant.id = :restaurantId
    	""")
    	Long getRatingCountByRestaurantId(
    	        Long restaurantId
    	);
//    Batja written code END code
}