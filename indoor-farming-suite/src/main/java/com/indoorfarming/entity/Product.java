package com.indoorfarming.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "vendor_products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private User vendor;

    private String name;
    private String description;
    private double price;
    private int stockQuantity;
    
    @Enumerated(EnumType.STRING)
    private ProductCategory category;
}
