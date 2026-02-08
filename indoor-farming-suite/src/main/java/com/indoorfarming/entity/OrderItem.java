package com.indoorfarming.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = true)
    private Product product;  

    @ManyToOne
    @JoinColumn(name = "marketplace_crop_id")
    private MarketplaceCrop marketplaceCrop;  

    private int quantity; 
    private double pricePerUnit;
    private double totalPrice;
}