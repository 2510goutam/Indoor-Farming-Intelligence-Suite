package com.indoorfarming.service;

import com.indoorfarming.entity.OtpVerification;
import com.indoorfarming.repository.OtpVerificationRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final OtpVerificationRepository otpRepository;
    private final MailService mailService;

    @Override
    public void generateOtp(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        OtpVerification verification = new OtpVerification();
        verification.setEmail(email);
        verification.setOtp(otp);
        verification.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        verification.setUsed(false);

        otpRepository.save(verification);
        mailService.sendOtpEmail(email, otp);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        OtpVerification verification = otpRepository
                .findByEmailAndOtp(email, otp)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if (verification.isUsed() || verification.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired or already used");
        }

        verification.setUsed(true);
        otpRepository.save(verification);
        return true;
    }
}
