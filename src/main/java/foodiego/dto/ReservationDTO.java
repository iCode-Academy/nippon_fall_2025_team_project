package foodiego.dto;

import java.time.LocalDateTime;


public class ReservationDTO {
    private Long id;
    private LocalDateTime reservationDate;
    private Integer numberOfGuests;
    private String status;
    private UserDTO user; 
    
   
    public ReservationDTO() {}

    
    public Long getId() {return id;}

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(LocalDateTime reservationDate) {
        this.reservationDate = reservationDate;
    }

    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }
  
}