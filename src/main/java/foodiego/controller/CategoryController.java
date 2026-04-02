package foodiego.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import foodiego.model.Category;
import foodiego.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

	private final CategoryService categoryService;

	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}

	@GetMapping
	public ResponseEntity<List<Category>> getAll() {
		return ResponseEntity.ok(categoryService.getAll());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Category> getById(@PathVariable Long id) {
		return ResponseEntity.ok(categoryService.getById(id));
	}

	@PostMapping
    public ResponseEntity<Category> create(@RequestBody Category category) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.create(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id,
                                           @RequestBody Category category) {
        return ResponseEntity.ok(categoryService.update(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
