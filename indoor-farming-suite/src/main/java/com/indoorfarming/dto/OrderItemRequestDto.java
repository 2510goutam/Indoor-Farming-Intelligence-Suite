package com.indoorfarming.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemRequestDto {

    private Long productId;  // For vendor products
    private Long marketplaceCropId;  // For farmer crops
    private String itemType;  // "PRODUCT" or "CROP"
    private int quantity;
}
