package foodiego.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Шинээр нэмэгдсэн

import foodiego.model.Foods;
import foodiego.model.Restaurant;
import foodiego.model.Review;
import foodiego.model.User;
import foodiego.repository.FoodRepository;
import foodiego.repository.RestaurantRepository;
import foodiego.repository.ReviewRepository;
import foodiego.repository.UserRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;
    private final RestaurantRepository restaurantRepository;
    
    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository, 
                         FoodRepository foodRepository, RestaurantRepository restaurantRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
        this.restaurantRepository = restaurantRepository;
    }
    
    /**
     * Сэтгэгдэл үүсгэх болон Рестораны статистикийг шинэчлэх
     */
    @Transactional // ЗАСВАР: Энэ анотаци нь бааз руу хадгалах үйлдлийг баталгаажуулна
    public Review createReview(Long userId, Long foodId, Long restaurantId, Review reviewDetails) {
        // 1. Хэрэглэгчийг шалгах
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        reviewDetails.setUser(user);

        // 2. Хэрэв хоолонд хамааралтай бол холбох
        if (foodId != null) {
            Foods food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found"));
            reviewDetails.setFoods(food);
        }

        // 3. Ресторантай холбох
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        reviewDetails.setRestaurant(restaurant);
        
        // 4. Сэтгэгдлийг хадгалах (saveAndFlush ашигласнаар баазад шууд харагдана)
        Review savedReview = reviewRepository.saveAndFlush(reviewDetails);

        // 5. РЕСТОРАНЫ ҮНЭЛГЭЭ БОЛОН ТООГ ШИНЭЧЛЭХ ЛОГИК
        List<Review> allReviews = reviewRepository.findByRestaurant_Id(restaurantId);
        
        if (!allReviews.isEmpty()) {
            double totalScore = 0;
            for (Review r : allReviews) {
                totalScore += r.getRating();
            }
            
            // Дундаж үнэлгээ бодох
            double averageRating = totalScore / allReviews.size();
            // 1 орны нарийвчлалтай тоймлох
            averageRating = Math.round(averageRating * 10.0) / 10.0;
            
            // Рестораны мэдээллийг шинэчлэх
            restaurant.setRating(averageRating);
            restaurant.setReviewCount(allReviews.size());
            
            restaurantRepository.save(restaurant);
        }
        
        return savedReview;
    }
    
    public List<Review> getReviewsByFood(Long foodId) {
        return reviewRepository.findByFoods_Id(foodId);
    }

    public List<Review> getReviewsByRestaurant(Long restaurantId) {
        return reviewRepository.findByRestaurant_Id(restaurantId);
    }
}