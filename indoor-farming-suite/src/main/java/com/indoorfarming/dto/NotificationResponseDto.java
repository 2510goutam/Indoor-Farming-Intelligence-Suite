package com.indoorfarming.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class NotificationResponseDto {

    private String title;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
}
