package com.indoorfarming.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnvironmentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    private String cropType;
    private double temperature;
    private double humidity;
    private double moisture;
    private double lightIntensity;
    @Column(length = 2000)
    private String aiSuggestion;

    private LocalDateTime recordedAt;
}

