package com.indoorfarming.dto;

import java.time.LocalDateTime;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnvironmentRecordResponseDto {

    private Long id;
    private Double temperature;
    private Double humidity;
    private Double moisture;
    private Double lightIntensity;
    private LocalDateTime recordedAt;
    private String aiSuggestion;
    private String cropType;
}