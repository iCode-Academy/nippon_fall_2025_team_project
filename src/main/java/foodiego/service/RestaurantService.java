package foodiego.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import foodiego.model.Restaurant;
import foodiego.repository.RestaurantRepository;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository repository;

    public Restaurant addRestaurant(Restaurant restaurant) {
        // 1. Одоо байгаа бүх ID-г жагсаалтаар авна (Жишээ нь: [1, 2, 4, 5])
        List<Long> ids = repository.findAllIdsSorted();
        
        // 2. Хамгийн бага сул байгаа ID-г хайх
        Long availableId = 1L; // 1-ээс эхэлж шалгана
        for (Long currentId : ids) {
            if (!currentId.equals(availableId)) {
                // Хэрэв дараалсан тоо биш байвал дунд нь зай гарсан гэсэн үг
                break; 
            }
            availableId++; // Дараагийн тоо руу шилжинэ
        }

        // 3. Систем АВТОМАТААР олсон ID-г онооно
        restaurant.setId(availableId); 

        // 4. Хадгалах
        return repository.save(restaurant);
    }
}
