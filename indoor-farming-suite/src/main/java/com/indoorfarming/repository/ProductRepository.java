package com.indoorfarming.repository;

import com.indoorfarming.entity.*;
import com.indoorfarming.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByVendor(User vendor);

    Optional<Product> findByIdAndVendor(Long productId, User vendor);
    
    List<Product> findAll();

    List<Product> findByCategory(ProductCategory category);

    List<Product> findByNameContainingIgnoreCase(String name);
}