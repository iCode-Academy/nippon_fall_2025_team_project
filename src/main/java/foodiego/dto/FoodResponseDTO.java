package foodiego.dto;



public class FoodResponseDTO {

	private Long id;
    private String name;
    private Double price;
    private String image;
    private String description;
    private String categoryName;
    private String categoryIcon;
    private String addressName;
    private String district;

    // 1. Хоосон конструктор (Default Constructor)
    
    public FoodResponseDTO() {
    }

    // 2. Бүх талбартай конструктор (All-args Constructor)
    
    public FoodResponseDTO(Long id, String name, Double price, String image, String description, 
                           String categoryName, String categoryIcon, String addressName, String district) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
        this.categoryName = categoryName;
        this.categoryIcon = categoryIcon;
        this.addressName = addressName;
        this.district = district;
    }
    
 // 3. Getter болон Setter-үүд
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getCategoryIcon() { return categoryIcon; }
    public void setCategoryIcon(String categoryIcon) { this.categoryIcon = categoryIcon; }

    public String getAddressName() { return addressName; }
    public void setAddressName(String addressName) { this.addressName = addressName; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

	
}
