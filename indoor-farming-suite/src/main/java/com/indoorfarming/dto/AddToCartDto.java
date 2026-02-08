package com.indoorfarming.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddToCartDto {
    
    private String itemType;  // "PRODUCT" or "CROP"
    private Long productId;
    private Long marketplaceCropId;
    private int quantity;
}
