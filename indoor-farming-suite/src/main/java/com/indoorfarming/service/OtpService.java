package com.indoorfarming.service;

public interface OtpService {

    void generateOtp(String email);

    boolean verifyOtp(String email, String otp);
}
