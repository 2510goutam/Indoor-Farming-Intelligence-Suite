package com.indoorfarming.repository;

import com.indoorfarming.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findByEmailAndOtp(String email, String otp);

    void deleteByEmail(String email);
}
