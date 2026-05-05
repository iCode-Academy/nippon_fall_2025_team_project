package foodiego.dto;

public class OrderItemResponseDTO {
	
	private Long foodId;
	private String foodName;
	private int quantity;
	private Double price;
	
	public Long getFoodId() {
		return foodId;
	}
	
	public void setFoodId(Long foodId) {
		this.foodId = foodId;
	}
	
	public String getFoodName() {
		return foodName;
	}
	
	public void setFoodName(String foodName) {
		this.foodName = foodName;
	}
	
	public int getQuantity() {
		return quantity;
	}
	
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	
	public Double getPrice() {
		return price;
	}
	
	public void setPrice(Double price) {
		this.price = price;
	}
}
