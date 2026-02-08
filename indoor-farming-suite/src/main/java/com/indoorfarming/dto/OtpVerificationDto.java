package com.indoorfarming.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
public class OtpVerificationDto {

    @NotBlank
    private String email;

    @NotBlank
    private String otp;
}
