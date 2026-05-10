package foodiego.model;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "category")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String categoryName;

    @Column(length=500000)
    private String categoryIcon;
    
    @JsonIgnore
    @OneToMany(mappedBy="category")
    private List<Foods> foods;

    private String categoryDescription;
    
    
    public Long getId() {
		return id;
	}
    public void setId(Long id) {
		this.id = id;
	}
    public String getCategoryName() {
		return categoryName;
	}
    public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
    public String getCategoryIcon() {
		return categoryIcon;
	}
    public void setCategoryIcon(String categoryIcon) {
		this.categoryIcon = categoryIcon;
	}
    public String getCategoryDescription() {
		return categoryDescription;
	}
    public void setCategoryDescription(String categoryDescription) {
		this.categoryDescription = categoryDescription;
	}
    
    
    
}
