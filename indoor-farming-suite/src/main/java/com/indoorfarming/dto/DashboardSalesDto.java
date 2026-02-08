package com.indoorfarming.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSalesDto {
    private LocalDate date;
    private Double totalAmount;
    private Integer totalQuantity;
}
