package com.indoorfarming.repository;

import com.indoorfarming.entity.VendorRequest;
import com.indoorfarming.entity.VendorRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VendorRequestRepository extends JpaRepository<VendorRequest, Long> {
    
    List<VendorRequest> findByStatus(VendorRequestStatus status);
    
    Optional<VendorRequest> findByUserId(Long userId);
    
    long countByStatus(VendorRequestStatus status);
}
