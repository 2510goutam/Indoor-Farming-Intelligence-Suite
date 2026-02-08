package com.indoorfarming.service;

import com.indoorfarming.dto.AdminStatsDto;
import com.indoorfarming.dto.UserResponseDto;
import com.indoorfarming.dto.VendorRequestDto;
import com.indoorfarming.entity.User;

import java.util.List;

public interface AdminService {
    
    void deleteProduct(Long productId, User admin);
    
    void approveVendor(Long userId, User admin);
    
    List<UserResponseDto> getAllUsers(User admin);
    
    AdminStatsDto getAdminStats(User admin);
    
    // New methods for vendor request workflow
    List<VendorRequestDto> getPendingVendorRequests(User admin);
    
    void approveVendorRequest(Long requestId, User admin);
    
    void rejectVendorRequest(Long requestId, User admin);
    
    // User management methods
    void updateUser(Long userId, UserResponseDto dto, User admin);
    
    void deleteUser(Long userId, User admin);
}
