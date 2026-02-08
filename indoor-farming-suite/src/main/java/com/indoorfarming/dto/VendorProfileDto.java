package com.indoorfarming.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorProfileDto {

    @JsonProperty("shopName")
    private String shopName;

    @JsonProperty("gstNumber")
    private String gstNumber;

    @JsonProperty("address")
    private String address;

    @JsonProperty("description")
    private String description;

    @JsonProperty("contactEmail")
    private String contactEmail;

    @JsonProperty("contactPhone")
    private String contactPhone;
}
