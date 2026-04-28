package foodiego.model;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Future;

@Entity
@Table(name = "reservations")

public class Reservation {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "userId")
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
  private User user;
  
  @Future(message = "Захиалгын огноо заавал ирээдүйн цаг хугацаа байх ёстой")
  private LocalDate date;
  private LocalTime time;
  private Integer guests;

  @Enumerated(EnumType.STRING)
  private ReservationStatus status; // PENDING | CONFIRMED | CANCELLED

  public Reservation() {}
  
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }

  public LocalDate getDate() { return date; }
  public void setDate(LocalDate date) { this.date = date; }

  public LocalTime getTime() { return time; }
  public void setTime(LocalTime time) { this.time = time; }

  public Integer getGuests() { return guests; }
  public void setGuests(Integer guests) { this.guests = guests; }

  public ReservationStatus getStatus() { return status; }
  public void setStatus(ReservationStatus status) { this.status = status;}

}

