package com.indoorfarming.dto;

import java.time.LocalDateTime;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponseDto {
    private Long id;
    private String userName;
    private String userRole;
    private String message;
    private int rating;
    private LocalDateTime createdAt;
}
