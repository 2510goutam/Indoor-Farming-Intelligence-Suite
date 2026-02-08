package com.indoorfarming.repository;

import com.indoorfarming.entity.PaymentTransaction;
import com.indoorfarming.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    List<PaymentTransaction> findByUser(User user);
    Optional<PaymentTransaction> findByTransactionId(String transactionId);
}
