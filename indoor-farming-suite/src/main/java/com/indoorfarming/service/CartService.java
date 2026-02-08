package com.indoorfarming.service;

import com.indoorfarming.dto.AddToCartDto;
import com.indoorfarming.dto.CartResponseDto;
import com.indoorfarming.entity.User;

public interface CartService {
    
    CartResponseDto addToCart(AddToCartDto dto, User user);
    
    CartResponseDto getCart(User user);
    
    CartResponseDto updateCartItemQuantity(Long cartItemId, int quantity, User user);
    
    void removeCartItem(Long cartItemId, User user);
    
    void clearCart(User user);
}
