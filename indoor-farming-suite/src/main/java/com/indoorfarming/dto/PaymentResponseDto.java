package com.indoorfarming.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDto {

    @JsonProperty("razorpayOrderId")
    private String razorpayOrderId;

    @JsonProperty("paymentStatus")
    private String paymentStatus;

    @JsonProperty("amount")
    private long amount; // amount in paise

    @JsonProperty("currency")
    private String currency;

    @JsonProperty("keyId")
    private String keyId; // Razorpay Key ID for client initialization
}
