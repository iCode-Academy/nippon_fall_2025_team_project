package foodiego.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import foodiego.dto.ReviewRequestDTO;
import foodiego.model.Review;
import foodiego.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
// ЗАСВАР: Фронтендээс ирэх хүсэлтийг зөвшөөрөх анотаци нэмэв
@CrossOrigin(origins = "*") 
public class ReviewController {

	private final ReviewService reviewService;
	
	public ReviewController(ReviewService reviewService) {
		this.reviewService = reviewService;
	}
	
	// Create review.
	@PostMapping("/add")
	public Review addReview(@RequestBody ReviewRequestDTO dto) {
		Review review = new Review();
		review.setRating(dto.getRating());
		review.setComment(dto.getComment());
		
		// Сервис рүү 4 параметр дамжуулж байна
		return reviewService.createReview(
			dto.getUserId(), 
			dto.getFoodId(), 
			dto.getRestaurantId(), 
			review
		);
	}
	
	// Get reviews by food.
	@GetMapping("/food/{foodId}")
	public List<Review> getByFood(@PathVariable("foodId") Long foodId) {
		return reviewService.getReviewsByFood(foodId);
	}
}