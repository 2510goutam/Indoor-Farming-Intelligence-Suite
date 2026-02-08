package com.indoorfarming.repository;

import com.indoorfarming.entity.Invoice;
import com.indoorfarming.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByOrder(Order order);
}
