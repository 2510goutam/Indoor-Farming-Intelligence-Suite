package com.indoorfarming.controller;

import com.indoorfarming.dto.*;
import com.indoorfarming.entity.User;
import com.indoorfarming.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @PostMapping
    public OrderResponseDto place(
            @RequestBody OrderRequestDto dto,
            @AuthenticationPrincipal User user) {
        return service.placeOrder(dto, user);
    }

    @PostMapping("/checkout")
    public OrderResponseDto checkout(
            @AuthenticationPrincipal User user) {
        return service.checkoutFromCart(user);
    }

    @GetMapping
    public List<OrderResponseDto> myOrders(
            @AuthenticationPrincipal User user) {
        return service.getUserOrders(user);
    }
}
