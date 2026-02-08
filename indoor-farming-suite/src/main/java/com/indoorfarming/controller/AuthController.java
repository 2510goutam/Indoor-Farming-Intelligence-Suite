package com.indoorfarming.controller;

import com.indoorfarming.dto.*;
import com.indoorfarming.service.AuthService;
import com.indoorfarming.service.OtpService;
import com.indoorfarming.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDto dto) {
        userService.register(dto);
        otpService.generateOtp(dto.getEmail());
        return ResponseEntity.ok("Registration successful. OTP sent.");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpVerificationDto dto) {
        otpService.verifyOtp(dto.getEmail(), dto.getOtp());
        userService.verifyUser(dto.getEmail());
        return ResponseEntity.ok("Account verified successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(
            @Valid @RequestBody LoginRequestDto dto) {
        return ResponseEntity.ok(authService.login(dto));
    }
}
