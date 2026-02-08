package com.indoorfarming.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class UserSubscriptionDto {

    private Long subscriptionId;
    private String planName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}
