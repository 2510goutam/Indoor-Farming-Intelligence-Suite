package com.indoorfarming.repository;

import com.indoorfarming.entity.OrderItem;
import com.indoorfarming.entity.OrderStatus;
import com.indoorfarming.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT oi FROM OrderItem oi LEFT JOIN oi.product p LEFT JOIN oi.marketplaceCrop mc WHERE (p.vendor = :user OR mc.farmer = :user) AND oi.order.orderDate >= :since AND oi.order.orderStatus = :status")
    List<OrderItem> findSalesByVendorAndDateAfter(@Param("user") User user, @Param("since") LocalDateTime since, @Param("status") OrderStatus status);
}
