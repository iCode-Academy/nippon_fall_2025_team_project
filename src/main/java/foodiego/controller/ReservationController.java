package foodiego.controller;

import foodiego.model.Reservation;
import foodiego.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservation") 
@CrossOrigin(origins = "*")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

   
    @PostMapping("/create")
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {
        return ResponseEntity.ok(reservationService.createReservation(reservation));
    }

  
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getUserReservations(userId));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        boolean isDeleted = reservationService.deleteReservation(id);
        if (isDeleted) {
            return ResponseEntity.ok("Захиалга амжилттай устгагдлаа.");
        } else {
            return ResponseEntity.status(404).body("Устгах захиалга олдсонгүй.");
        }
    }
}