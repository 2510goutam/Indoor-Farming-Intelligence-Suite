package com.indoorfarming.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VendorRequestDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String shopName;
    private String description;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String gstNumber;
    private String status;
    private LocalDateTime requestedAt;
}
