package com.indoorfarming.controller;

import com.indoorfarming.dto.DashboardSalesDto;
import com.indoorfarming.dto.DashboardStatsDto;
import com.indoorfarming.entity.User;
import com.indoorfarming.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public DashboardStatsDto getStats(@AuthenticationPrincipal User user) {
        return dashboardService.getUserStats(user);
    }

    @GetMapping("/sales")
    public List<DashboardSalesDto> getSales(@AuthenticationPrincipal User user) {
        return dashboardService.getUserSalesLast30Days(user);
    }
}
