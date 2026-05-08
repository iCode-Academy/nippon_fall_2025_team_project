package foodiego.service;

import java.util.List;

import org.springframework.stereotype.Service;

import foodiego.model.Foods;
import foodiego.model.Review;
import foodiego.model.User;
import foodiego.repository.FoodRepository;
import foodiego.repository.ReviewRepository;
import foodiego.repository.UserRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;
    
    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository, FoodRepository foodRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
    }
    
    // Сэтгэгдэл үүсгэх (ID-гаар нь холбож өгөх)
    public Review createReview(Long userId, Long foodId, Review reviewDetails) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Foods food = foodRepository.findById(foodId)
            .orElseThrow(() -> new RuntimeException("Food not found"));
            
        reviewDetails.setUser(user);
        reviewDetails.setFoods(food);
        
        return reviewRepository.save(reviewDetails);
    }
    
    public List<Review> getReviewsByFood(Long foodId) {
        return reviewRepository.findByFoods_Id(foodId);
    }
}