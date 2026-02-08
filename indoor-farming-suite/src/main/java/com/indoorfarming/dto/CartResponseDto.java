package com.indoorfarming.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class CartResponseDto {
    
    private Long cartId;
    private List<CartItemResponseDto> items;
    private int totalItems;
    private double totalAmount;
}
