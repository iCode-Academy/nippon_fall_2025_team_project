package foodiego.repository;

import foodiego.model.Restaurant;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    // Баазад байгаа бүх ID-г багаас нь их рүү эрэмбэлж авах
    @Query("SELECT r.id FROM Restaurant r ORDER BY r.id ASC")
    List<Long> findAllIdsSorted();
}