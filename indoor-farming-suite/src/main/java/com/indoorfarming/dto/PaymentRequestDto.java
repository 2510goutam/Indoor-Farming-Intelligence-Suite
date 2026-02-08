package com.indoorfarming.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequestDto {

    private Long orderId;
    private double amount;
    private String orderType; // "MARKETPLACE" or "SUBSCRIPTION"
}
