package com.indoorfarming.service;

import com.indoorfarming.dto.DashboardSalesDto;
import com.indoorfarming.dto.DashboardStatsDto;
import com.indoorfarming.entity.User;

import java.util.List;

public interface DashboardService {
    DashboardStatsDto getUserStats(User user);
    List<DashboardSalesDto> getUserSalesLast30Days(User user);
}
