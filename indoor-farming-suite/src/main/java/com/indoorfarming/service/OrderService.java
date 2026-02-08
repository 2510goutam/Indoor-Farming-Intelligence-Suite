package com.indoorfarming.service;

import com.indoorfarming.dto.OrderRequestDto;
import com.indoorfarming.dto.OrderResponseDto;
import com.indoorfarming.entity.User;

import java.util.List;

public interface OrderService {

    OrderResponseDto placeOrder(OrderRequestDto dto, User user);
    
    OrderResponseDto checkoutFromCart(User user);
    
    void confirmOrder(Long orderId);

    List<OrderResponseDto> getUserOrders(User user);
}
