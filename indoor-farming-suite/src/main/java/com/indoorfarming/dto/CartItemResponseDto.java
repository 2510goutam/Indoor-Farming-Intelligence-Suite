package com.indoorfarming.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemResponseDto {
    
    private Long cartItemId;
    private String itemType;  // "PRODUCT" or "CROP"
    private String itemName;
    private int quantity;
    private double pricePerUnit;
    private double totalPrice;
}
