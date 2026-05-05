package foodiego.service;

import java.util.List;

import org.springframework.stereotype.Service;

import foodiego.model.Review;
import foodiego.repository.ReviewRepository;

@Service
public class ReviewService {

	private final ReviewRepository reviewRepository;
	
	public ReviewService(ReviewRepository reviewRepository) {
		this.reviewRepository = reviewRepository;
	}
	
//	Create review.
	public Review create(Review review) {
		return reviewRepository.save(review);
	}
	
//	Get reviews by food.
	public List<Review> getReviewsByFood(Long foodId) {
		return reviewRepository.findByFoods_Id(foodId);
	}
}
