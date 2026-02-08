package com.indoorfarming.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;

    private String shopName;
    private String gstNumber;
    private String address;
    private String description;
    private String contactEmail;
    private String contactPhone;
    private String approvalStatus;
}
