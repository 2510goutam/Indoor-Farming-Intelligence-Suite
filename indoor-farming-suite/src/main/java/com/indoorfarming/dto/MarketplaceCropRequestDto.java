package com.indoorfarming.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MarketplaceCropRequestDto {

    @NotBlank
    private String cropName;

    private String description;

    @Positive
    private double pricePerKg;

    @Positive
    private double availableQuantityKg;

    private String quality; 
    
    private String harvestDate;


}