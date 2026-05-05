package foodiego.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import foodiego.model.Restaurant;
import foodiego.repository.RestaurantRepository;

@Service
public class RestaurantService {
    @Autowired
    private RestaurantRepository restaurantRepository;

    public Restaurant addRestaurant(Restaurant restaurant) {
        List<Long> ids = restaurantRepository.findAllIdsSorted();
        long nextId = 1;

        if (ids != null && !ids.isEmpty()) {
            for (Long id : ids) {
                if (id == nextId) {
                    nextId++;
                } else if (id > nextId) {
                    break;
                }
            }
        }
        
        restaurant.setId(nextId);
        return restaurantRepository.save(restaurant);
    }
}
