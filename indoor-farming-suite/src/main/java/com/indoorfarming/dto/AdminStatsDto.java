package com.indoorfarming.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminStatsDto {
    private long totalUsers;
    private long subscribedUsers;
    private long totalVendors;
    private long subscribedVendors;
    private List<UserRegistrationDto> userRegistrations;

    public AdminStatsDto() {}

    public AdminStatsDto(long totalUsers, long subscribedUsers, long totalVendors, long subscribedVendors) {
        this.totalUsers = totalUsers;
        this.subscribedUsers = subscribedUsers;
        this.totalVendors = totalVendors;
        this.subscribedVendors = subscribedVendors;
    }

}
