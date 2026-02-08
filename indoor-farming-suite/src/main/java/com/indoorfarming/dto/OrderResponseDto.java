package com.indoorfarming.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.indoorfarming.entity.OrderStatus;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDto {

    private Long orderId;
    private double totalAmount;
    private String status;
    private LocalDateTime orderDate;
    private List<OrderItemResponseDto> items;
}
