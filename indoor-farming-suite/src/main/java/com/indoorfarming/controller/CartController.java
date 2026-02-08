package com.indoorfarming.controller;

import com.indoorfarming.dto.AddToCartDto;
import com.indoorfarming.dto.CartResponseDto;
import com.indoorfarming.entity.User;
import com.indoorfarming.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public CartResponseDto addToCart(
            @RequestBody AddToCartDto dto,
            @AuthenticationPrincipal User user) {
        return cartService.addToCart(dto, user);
    }

    @GetMapping
    public CartResponseDto getCart(@AuthenticationPrincipal User user) {
        return cartService.getCart(user);
    }

    @PutMapping("/item/{cartItemId}")
    public CartResponseDto updateQuantity(
            @PathVariable Long cartItemId,
            @RequestParam int quantity,
            @AuthenticationPrincipal User user) {
        return cartService.updateCartItemQuantity(cartItemId, quantity, user);
    }

    @DeleteMapping("/item/{cartItemId}")
    public void removeItem(
            @PathVariable Long cartItemId,
            @AuthenticationPrincipal User user) {
        cartService.removeCartItem(cartItemId, user);
    }

    @DeleteMapping("/clear")
    public void clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user);
    }
}
