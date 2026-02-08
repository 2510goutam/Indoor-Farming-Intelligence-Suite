package com.indoorfarming.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class ProductRequestDto {

    @NotBlank
    private String name;

    private String description;

    @Positive
    private double price;

    @Positive
    private int stockQuantity;

    private String category;
}
