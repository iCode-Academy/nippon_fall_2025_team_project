package foodiego.service;



import java.util.List;

import org.springframework.stereotype.Service;

import foodiego.model.Category;
import foodiego.repository.CategoryRepository;


@Service

public class CategoryService {

	 private final CategoryRepository categoryRepository;

	    // @RequiredArgsConstructor оронд гараар constructor
	 
	    public CategoryService(CategoryRepository categoryRepository) {
	        this.categoryRepository = categoryRepository;
	    }

	    public List<Category> getAll() {
	        return categoryRepository.findAll();
	    }
	    
	    public Category getById(Long id) {
	        return categoryRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Ангилал олдсонгүй: " + id));
	    }

	    public Category create(Category category) {
	        return categoryRepository.save(category);
	    }

	    public Category update(Long id, Category updated) {
	        Category existing = getById(id);
	        existing.setCategoryName(updated.getCategoryName());
	        existing.setCategoryIcon(updated.getCategoryIcon());
	        existing.setCategoryDescription(updated.getCategoryDescription());
	        return categoryRepository.save(existing);
	    }
	    
	    public void delete(Long id) {
	        categoryRepository.deleteById(id);
	    }
	    
	    
	    
}
