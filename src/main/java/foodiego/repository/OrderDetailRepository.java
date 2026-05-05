package foodiego.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import foodiego.model.OrderDetail;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> { 
   
    // get 1 order all detail
    List<OrderDetail> findByOrderId(Long orderId);
}