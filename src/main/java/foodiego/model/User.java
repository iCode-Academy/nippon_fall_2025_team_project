package foodiego.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "И-мэйл хоосон байж болохгүй")
    @Email(message = "Зөв и-мэйл хаяг оруулна уу")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "Нууц үг заавал байх ёстой")
    @Column(nullable = false)
    private String password;
    
    @NotBlank(message = "Нэр заавал байх ёстой")
    @Column(nullable = false)
    private String name;

    // Хоосон байгуулагч (JPA-д зайлшгүй хэрэгтэй)
    public User() {}

    // Getter болон Setter-үүд
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}