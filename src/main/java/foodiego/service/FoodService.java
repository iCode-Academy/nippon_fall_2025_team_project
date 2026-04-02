package foodiego.service;

import java.util.List;

import org.springframework.stereotype.Service;

import foodiego.model.Foods;
import foodiego.repository.CategoryRepository;
import foodiego.repository.FoodRepository;

@Service


public class FoodService {

	private final FoodRepository foodRepository;
    private final CategoryRepository categoryRepository;

    // @RequiredArgsConstructor оронд гараар constructor
    
    public FoodService(FoodRepository foodRepository,
                       CategoryRepository categoryRepository) {
        this.foodRepository = foodRepository;
        this.categoryRepository = categoryRepository;
    }
	

    public List<Foods> getAll() {
        return foodRepository.findAll();
    }

    public Foods getById(Long id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Хоол олдсонгүй: " + id));
    }

    public List<Foods> getByCategory(Long categoryId) {
        return foodRepository.findByCategory_Id(categoryId);
    }
    
    public Foods create(Foods foods) {
        categoryRepository.findById(foods.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Ангилал олдсонгүй"));
        return foodRepository.save(foods);
    }

    public Foods update(Long id, Foods updated) {
        Foods existing = getById(id);
        existing.setName(updated.getName());
        existing.setPrice(updated.getPrice());
        existing.setImage(updated.getImage());
        existing.setDescription(updated.getDescription());
        existing.setCategory(updated.getCategory());
        return foodRepository.save(existing);
    }

    
    public void delete(Long id) {
        foodRepository.deleteById(id);
    }
}
