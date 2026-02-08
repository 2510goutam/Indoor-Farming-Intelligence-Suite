package com.indoorfarming.controller;

import com.indoorfarming.dto.*;
import com.indoorfarming.entity.User;
import com.indoorfarming.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    
    @PostMapping("/create-order")
    public ResponseEntity<PaymentResponseDto> createOrder(
            @Valid @RequestBody PaymentRequestDto dto,
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                paymentService.createOrder(dto, user)
        );
    }

    
    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @RequestParam String razorpayOrderId,
            @RequestParam String razorpayPaymentId,
            @RequestParam String razorpaySignature,
            @AuthenticationPrincipal User user) {

        paymentService.verifyPayment(
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature,
                user
        );

        return ResponseEntity.ok("Payment verified successfully");
    }
    
    @PostMapping("/verify-subscription")
    public ResponseEntity<AuthResponseDto> verifySubscriptionPayment(
            @RequestParam String razorpayOrderId,
            @RequestParam String razorpayPaymentId,
            @RequestParam String razorpaySignature,
            @RequestParam Long planId,
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
            paymentService.verifySubscriptionPayment(
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature,
                planId,
                user
            )
        );
    }

    @GetMapping("/details/{paymentId}")
    public ResponseEntity<Object> getPaymentDetails(@PathVariable String paymentId) {
        return ResponseEntity.ok(paymentService.getPaymentDetails(paymentId));
    }
}
