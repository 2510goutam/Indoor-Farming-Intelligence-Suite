package com.indoorfarming.service;

import com.indoorfarming.dto.*;
import com.indoorfarming.entity.PaymentTransaction;
import com.indoorfarming.entity.SubscriptionPlan;
import com.indoorfarming.entity.User;
import com.indoorfarming.repository.PaymentTransactionRepository;
import com.indoorfarming.repository.SubscriptionPlanRepository;
import com.indoorfarming.service.MailService;
import com.indoorfarming.service.PaymentService;
import com.indoorfarming.service.SubscriptionService;
import com.indoorfarming.security.JwtService;
import com.razorpay.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private final PaymentTransactionRepository repository;
    private final MailService mailService;
    private final OrderService orderService;
    private final com.indoorfarming.repository.OrderRepository orderRepository;
    private final SubscriptionService subscriptionService;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final JwtService jwtService;
    private final ModelMapper mapper;

 
    @Override
    public PaymentResponseDto createOrder(PaymentRequestDto dto, User user) {

        try {
            RazorpayClient client =
                    new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            long amountInPaise = Math.round(dto.getAmount() * 100);
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1);

            com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);

            if (!"SUBSCRIPTION".equalsIgnoreCase(dto.getOrderType())) {
                com.indoorfarming.entity.Order internalOrder = orderRepository.findById(dto.getOrderId())
                        .orElseThrow(() -> new RuntimeException("Order not found"));

                internalOrder.setRazorpayOrderId(razorpayOrder.get("id"));
                orderRepository.save(internalOrder);

                PaymentTransaction transaction = new PaymentTransaction();
                transaction.setUser(user);
                transaction.setOrder(internalOrder);
                transaction.setAmount(dto.getAmount());
                transaction.setPaymentGateway("RAZORPAY");
                transaction.setTransactionId(razorpayOrder.get("id"));
                transaction.setPaymentStatus("PENDING");
                transaction.setPaymentDate(LocalDateTime.now());
                repository.save(transaction);
            }
            
            PaymentResponseDto response = PaymentResponseDto.builder()
                    .razorpayOrderId(razorpayOrder.get("id"))
                    .paymentStatus("ORDER_CREATED")
                    .amount(amountInPaise)
                    .currency("INR")
                    .keyId(this.keyId)
                    .build();

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Failed to create Razorpay order: " + e.getMessage(), e);
        }
    }

    @Override
    public void verifyPayment(String razorpayOrderId,
                              String razorpayPaymentId,
                              String razorpaySignature,
                              User user) {

        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_signature", razorpaySignature);

            boolean isValid = Utils.verifyPaymentSignature(attributes, keySecret);

            if (!isValid) {
                throw new RuntimeException("Payment verification failed");
            }

            PaymentTransaction transaction =
                    repository.findByTransactionId(razorpayOrderId)
                            .orElseThrow(() ->
                                    new RuntimeException("Transaction not found"));

            transaction.setPaymentStatus("SUCCESS");
            transaction.setTransactionId(razorpayPaymentId);
            repository.save(transaction);

            orderService.confirmOrder(transaction.getOrder().getId());

            com.indoorfarming.entity.Order order = transaction.getOrder();
            order.setRazorpayPaymentId(razorpayPaymentId);
            orderRepository.save(order);
         
            mailService.sendInvoiceEmail(
                    user.getEmail(),
                    user.getName(),
                    razorpayPaymentId,
                    transaction.getAmount(),
                    "Order #" + order.getId()
            );

        } catch (Exception e) {
            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        }
    }
    
    @Override
    public AuthResponseDto verifySubscriptionPayment(String razorpayOrderId,
                                           String razorpayPaymentId,
                                           String razorpaySignature,
                                           Long planId,
                                           User user) {
        
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", razorpayOrderId);
            attributes.put("razorpay_payment_id", razorpayPaymentId);
            attributes.put("razorpay_signature", razorpaySignature);

            boolean isValid = Utils.verifyPaymentSignature(attributes, keySecret);
            
            if (!isValid) {
                throw new RuntimeException("Payment verification failed");
            }
            
            subscriptionService.subscribe(user, planId);
            
            SubscriptionPlan plan = subscriptionPlanRepository.findById(planId)
                    .orElseThrow(() -> new RuntimeException("Plan not found"));
            
            mailService.sendSubscriptionConfirmationEmail(
                    user.getEmail(),
                    user.getName(),
                    plan.getName(),
                    plan.getPrice()
            );

            String newToken = jwtService.generateToken(user);
            UserResponseDto userDto = mapper.map(user, UserResponseDto.class);
            userDto.setRole(user.getRole().name());
            userDto.setVerified(user.isVerified());

            return AuthResponseDto.builder()
                    .token(newToken)
                    .user(userDto)
                    .build();
            
        } catch (Exception e) {
            throw new RuntimeException("Subscription payment verification failed: " + e.getMessage());
        }
    }

    @Override
    public Object getPaymentDetails(String razorpayPaymentId) {
        try {
            RazorpayClient client = new RazorpayClient(keyId, keySecret);
            Payment payment = client.payments.fetch(razorpayPaymentId);
            return payment.toString();
        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to fetch payment details: " + e.getMessage());
        }
    }
}
