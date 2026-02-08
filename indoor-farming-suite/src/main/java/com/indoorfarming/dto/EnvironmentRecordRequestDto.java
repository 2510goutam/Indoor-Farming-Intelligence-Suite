package com.indoorfarming.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnvironmentRecordRequestDto {

    private String cropType;

    @NotNull
    private Double temperature;

    @NotNull
    private Double humidity;

    @NotNull
    private Double moisture;

    @NotNull
    private Double lightIntensity;

    private String aiSuggestion;
}
