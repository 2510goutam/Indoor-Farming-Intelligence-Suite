package com.indoorfarming.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequestDto {

    @NotBlank
    @Size(min = 5, message = "Name must be at least 5 characters long")
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{6,}$", 
             message = "Password must be at least 6 characters long, contain one uppercase letter, one digit, and one special character")
    private String password;

    @NotBlank
    @Pattern(regexp = "^[6789]\\d{9}$", message = "Invalid Indian mobile number. Must start with 6-9 and be 10 digits.")
    private String mobileNumber;
}
