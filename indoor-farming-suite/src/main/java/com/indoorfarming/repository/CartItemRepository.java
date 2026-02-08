package com.indoorfarming.repository;

import com.indoorfarming.entity.Cart;
import com.indoorfarming.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    List<CartItem> findByCart(Cart cart);
    
    void deleteByCartAndId(Cart cart, Long id);
}
