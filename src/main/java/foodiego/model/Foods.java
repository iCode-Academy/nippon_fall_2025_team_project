package foodiego.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "foods")
public class Foods {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    private String image;

    private String description;

    // Category холболт — ManyToOne учир нь олон хоол нэг ангилалд байна

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false )
    private Category category;


 // Address холболт — ManyToOne учир нь олон хоол нэг хаягт байна
//    @ManyToOne
//    @JoinColumn(name = "address_id", nullable = false)
//    private Address address;


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }
    public void setPrice(Double price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }
    public void setImage(String image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public Category getCategory() {
    	return category; 
    	}
    
    public void setCategory(Category category) { 
    	this.category = category; 
    	}



}

