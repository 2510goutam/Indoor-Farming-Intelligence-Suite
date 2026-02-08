package com.indoorfarming.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private double amount;
    private String paymentGateway;
    private String transactionId;
    private String paymentStatus;

    private LocalDateTime paymentDate;
}
