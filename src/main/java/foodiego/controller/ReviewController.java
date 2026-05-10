package foodiego.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import foodiego.dto.ReviewRequestDTO;

import foodiego.model.Review;
import foodiego.service.ReviewService;
	
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

	private final ReviewService reviewService;
	
	public ReviewController(ReviewService reviewService) {
		this.reviewService = reviewService;
	}
	
//	Create review.
	@PostMapping("/add")
	public Review addReview(@RequestBody ReviewRequestDTO dto) {
	    Review review = new Review();
	    review.setRating(dto.getRating());
	    review.setComment(dto.getComment());
	    
	    return reviewService.createReview(dto.getUserId(), dto.getFoodId(), review);
	}
	
//	Create reviews by food.
	@GetMapping("/food/{foodId}")
	public List<Review> getByFood(@PathVariable Long foodId) {
		return reviewService.getReviewsByFood(foodId);
	}
	
	
	
}
