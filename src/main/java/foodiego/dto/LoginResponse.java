package foodiego.dto;

import foodiego.model.Role;

public class LoginResponse {
    private Long id;
    private String email;
    private Role role;
    private Long restaurantId; // RESTAURANT үед л утгатай

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }
}