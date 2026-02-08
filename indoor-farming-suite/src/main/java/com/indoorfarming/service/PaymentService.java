package com.indoorfarming.service;

import com.indoorfarming.dto.*;
import com.indoorfarming.entity.User;

public interface PaymentService {

    PaymentResponseDto createOrder(PaymentRequestDto dto, User user);

    void verifyPayment(String razorpayOrderId,
                       String razorpayPaymentId,
                       String razorpaySignature,
                       User user);
    
    AuthResponseDto verifySubscriptionPayment(String razorpayOrderId,
                                   String razorpayPaymentId,
                                   String razorpaySignature,
                                   Long planId,
                                   User user);

    Object getPaymentDetails(String razorpayPaymentId);
}
