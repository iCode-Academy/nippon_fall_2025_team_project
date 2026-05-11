package foodiego.config;

import foodiego.model.Category;
import foodiego.model.Foods;
import foodiego.model.Restaurant;
import foodiego.repository.CategoryRepository;
import foodiego.repository.FoodRepository;
import foodiego.repository.RestaurantRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class DemoDataSeeder {
        private final CategoryRepository categoryRepository;
        private final RestaurantRepository restaurantRepository;
        private final FoodRepository foodRepository;

        public DemoDataSeeder(
                        CategoryRepository categoryRepository,
                        RestaurantRepository restaurantRepository,
                        FoodRepository foodRepository) {
                this.categoryRepository = categoryRepository;
                this.restaurantRepository = restaurantRepository;
                this.foodRepository = foodRepository;
        }

        @PostConstruct
        public void seed() {
                if (categoryRepository.count() > 0) {
                        return;
                }
                List<Category> categories = createCategories();
                List<Restaurant> restaurants = createRestaurants(categories);
                createFoods(categories, restaurants);
                System.out.println(
                                "DEMO DATA CREATED");
        }

        private List<Category> createCategories() {
                String[] names = {
                                "Burger",
                                "Pizza",
                                "Sushi",
                                "Korean",
                                "Chinese",
                                "Dessert",
                                "Healthy",
                                "Indian",
                                "Breakfast",
                                "Drinks",
                                "Italian",
                                "Asian",
                                "Fast Food",
                                "Vegan",
                                "BBQ"
                };
                List<Category> list = new ArrayList<>();
                for (String name : names) {
                        Category c = new Category();
                        c.setCategoryName(name);
                        c.setCategoryDescription(
                                        name + " foods");
                        c.setCategoryIcon(
                                        "/picture/Category/" +
                                                        name.replace(" ", "") +
                                                        ".png");
                        list.add(
                                        categoryRepository.save(c));
                }
                return list;
        }

        private List<Restaurant> createRestaurants(
                        List<Category> categories) {
                List<Restaurant> list = new ArrayList<>();
                for (int i = 1; i <= 15; i++) {
                        Category category = categories.get(
                                        i % categories.size());
                        Restaurant r = new Restaurant();
                        r.setCategory(category);
                        r.setName(
                                        category.getCategoryName() +
                                                        " House " + i);
                        r.setAddress(
                                        "Ulaanbaatar District " + i);
                        r.setPhoneNumber(
                                        "991100" + i);
                        r.setDescription(
                                        "Best " +
                                                        category.getCategoryName() +
                                                        " restaurant.");
                        r.setLogoUrl(
                                        "/picture/Restaurants/demo_" +
                                                        i +
                                                        ".jpg");
                        r.setBannerUrl(
                                        "/picture/Restaurants/demo_" +
                                                        i +
                                                        ".jpg");
                        r.setRating(4.5);
                        r.setWorkingHours(
                                        "09:00 - 23:00");
                        r.setDeliveryTime(25);
                        r.setDeliveryFee(0.0);
                        list.add(
                                        restaurantRepository.save(r));
                }
                return list;
        }

        private void createFoods(
                        List<Category> categories,
                        List<Restaurant> restaurants) {
                int imageIndex = 1;
                for (Restaurant restaurant : restaurants) {
                        for (Category category : categories) {
                                for (int i = 1; i <= 4; i++) {
                                        Foods food = new Foods();
                                        food.setRestaurant(
                                                        restaurant);
                                        food.setCategory(
                                                        category);
                                        food.setName(
                                                        category.getCategoryName() +
                                                                        " Special " + i);
                                        food.setDescription(
                                                        "Fresh delicious " +
                                                                        category.getCategoryName());
                                        food.setPrice(
                                                        10.0 + i);
                                        food.setImage(
                                                        "/picture/Foods/food_" +
                                                                        imageIndex +
                                                                        ".jpg");
                                        foodRepository.save(food);
                                        imageIndex++;
                                        if (imageIndex > 20) {
                                                imageIndex = 1;
                                        }
                                }
                        }
                }
        }
}