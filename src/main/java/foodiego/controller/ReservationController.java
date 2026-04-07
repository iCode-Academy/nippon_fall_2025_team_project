package foodiego.controller;

import foodiego.model.Reservation;
import foodiego.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/reservation")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;
    @PostMapping("/create")
    public ResponseEntity<Reservation> create(@RequestBody Reservation reservation) {
        Reservation created = reservationService.createReservation(reservation);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getByUserId(@PathVariable Long userId) {
        List<Reservation> list = reservationService.getUserReservations(userId);
        return ResponseEntity.ok(list);
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