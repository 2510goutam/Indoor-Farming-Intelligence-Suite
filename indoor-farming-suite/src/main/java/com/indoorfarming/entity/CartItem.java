package com.indoorfarming.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "marketplace_crop_id")
    private MarketplaceCrop marketplaceCrop;

    @Enumerated(EnumType.STRING)
    private ItemType itemType;

    private int quantity;
    
    // Price snapshot at time of adding to cart
    private double pricePerUnit;
}
