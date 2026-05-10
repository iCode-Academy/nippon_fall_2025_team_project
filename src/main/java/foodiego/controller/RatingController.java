package foodiego.controller;

import foodiego.model.Rating;
import foodiego.model.Restaurant;
import foodiego.repository.RatingRepository;
import foodiego.repository.RestaurantRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin("*")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @PostMapping
    public Rating saveRating(
            @RequestBody Rating rating
    ) {

        Rating savedRating =
                ratingRepository.save(rating);

        Long restaurantId =
                rating.getRestaurant().getId();

        Double averageRating =
                ratingRepository
                .getAverageRatingByRestaurantId(
                        restaurantId
                );
        Long totalRatings =
                ratingRepository
                .getRatingCountByRestaurantId(
                        restaurantId
                );

        Restaurant restaurant =
                restaurantRepository
                .findById(restaurantId)
                .orElseThrow();

        restaurant.setRating(
                Math.round(
                        averageRating * 10.0
                ) / 10.0
        );
        restaurant.setTotalRatings(
                totalRatings.intValue()
        );

        restaurantRepository.save(restaurant);

        return savedRating;
    }    
}