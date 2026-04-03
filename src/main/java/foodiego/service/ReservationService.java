package foodiego.service;

import foodiego.model.Reservation;
import foodiego.model.ReservationStatus;
import foodiego.model.User;
import foodiego.repository.ReservationRepository;
import foodiego.repository.UserRepository; // Нэмсэн
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;
    public Reservation createReservation(Reservation reservation) {
       
        User user = userRepository.findById(reservation.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Хэрэглэгч олдсонгүй!"));
        reservation.setUser(user);
        if (reservation.getStatus() == null) {
            reservation.setStatus(ReservationStatus.PENDING);
        }

        return reservationRepository.save(reservation);
    }

    public List<Reservation> getUserReservations(Long userId) {
        return reservationRepository.findByUserId(userId);
    }
    public boolean deleteReservation(Long id) {
        if (reservationRepository.existsById(id)) {
            reservationRepository.deleteById(id);
            return true;
        }
        return false; 
    }
}