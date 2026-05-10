package foodiego.model;

<<<<<<< HEAD
import jakarta.persistence.*;

@Entity
@Table(name = "address")
=======
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
>>>>>>> 52e9f9da86d677b8899e3a082221be26899efcb1
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
<<<<<<< HEAD

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String district;

    // Хоосон байгуулагч (Default constructor)
    public Address() {}

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
=======
    private String city;
    private String district;
    private String apartment;
    private String roomNumber;
    private String receiverName;
    private String receiverPhone;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Address() {}
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }
    public String getDistrict() {
        return district;
    }
    public void setDistrict(String district) {
        this.district = district;
    }
    public String getApartment() {
        return apartment;
    }
    public void setApartment(String apartment) {
        this.apartment = apartment;
    }
    public String getRoomNumber() {
        return roomNumber;
    }
    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(
            String receiverName) {

        this.receiverName =
            receiverName;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public void setReceiverPhone(
            String receiverPhone) {

        this.receiverPhone =
            receiverPhone;
    }
>>>>>>> 52e9f9da86d677b8899e3a082221be26899efcb1
}