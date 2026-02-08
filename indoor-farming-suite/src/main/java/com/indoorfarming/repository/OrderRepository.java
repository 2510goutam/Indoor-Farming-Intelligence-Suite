package com.indoorfarming.repository;

import com.indoorfarming.entity.Order;
import com.indoorfarming.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

	List<Order> findByBuyer(User buyer);
	
	List<Order> findByBuyerAndOrderDateAfter(User buyer, LocalDateTime orderDate);
}
