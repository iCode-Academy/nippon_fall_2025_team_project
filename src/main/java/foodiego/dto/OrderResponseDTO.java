package foodiego.dto;

import java.util.List;

public class OrderResponseDTO {
	
	private Long id;
	private Double total;
	private String status;
	private List<OrderItemResponseDTO> items;
	
	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public Double getTotal() {
		return total;
	}
	
	public void setTotal(Double total) {
		this.total = total;
	}
	
	public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	public List<OrderItemResponseDTO> getItems() {
		return items;
	}
	
	public void setItems(List<OrderItemResponseDTO> items) {
		this.items = items;
	}
}
