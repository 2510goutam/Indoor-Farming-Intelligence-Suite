package com.indoorfarming.repository;

import com.indoorfarming.entity.Cart;
import com.indoorfarming.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    Optional<Cart> findByUser(User user);
    
    Optional<Cart> findByUserAndIsActiveTrue(User user);
}
