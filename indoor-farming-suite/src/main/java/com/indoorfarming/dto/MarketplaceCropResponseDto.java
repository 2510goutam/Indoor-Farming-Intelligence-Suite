package com.indoorfarming.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class MarketplaceCropResponseDto {

    private Long id;
    private String cropName;
    private String description;
    private double pricePerKg;
    private double availableQuantityKg;
    private String quality;
    private String farmerName;
    private String harvestDate;
    private LocalDateTime listedAt;
}