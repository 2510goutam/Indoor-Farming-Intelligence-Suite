package com.indoorfarming.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponseDto {

    private String itemType;  // "PRODUCT" or "CROP"
    private String itemName;  // Generic name for both products and crops
    private int quantity;
    private double price;
}
