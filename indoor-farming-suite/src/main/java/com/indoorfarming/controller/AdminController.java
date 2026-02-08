package com.indoorfarming.controller;

import com.indoorfarming.dto.AdminStatsDto;
import com.indoorfarming.dto.UserResponseDto;
import com.indoorfarming.dto.VendorRequestDto;
import com.indoorfarming.entity.User;
import com.indoorfarming.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDto> getAdminStats(@AuthenticationPrincipal User admin) {
        return ResponseEntity.ok(adminService.getAdminStats(admin));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDto>> getAllUsers(@AuthenticationPrincipal User admin) {
        return ResponseEntity.ok(adminService.getAllUsers(admin));
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<Void> updateUser(@PathVariable Long userId,
                                           @RequestBody UserResponseDto dto,
                                           @AuthenticationPrincipal User admin) {
        adminService.updateUser(userId, dto, admin);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId,
                                           @AuthenticationPrincipal User admin) {
        adminService.deleteUser(userId, admin);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/vendor-requests")
    public ResponseEntity<List<VendorRequestDto>> getPendingVendorRequests(@AuthenticationPrincipal User admin) {
        return ResponseEntity.ok(adminService.getPendingVendorRequests(admin));
    }

    @PostMapping("/vendor-requests/{requestId}/approve")
    public ResponseEntity<Void> approveVendorRequest(@PathVariable Long requestId,
                                                      @AuthenticationPrincipal User admin) {
        adminService.approveVendorRequest(requestId, admin);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/vendor-requests/{requestId}/reject")
    public ResponseEntity<Void> rejectVendorRequest(@PathVariable Long requestId,
                                                     @AuthenticationPrincipal User admin) {
        adminService.rejectVendorRequest(requestId, admin);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/product/{productId}")
    public void deleteProduct(@PathVariable Long productId,
                              @AuthenticationPrincipal User admin) {
        adminService.deleteProduct(productId, admin);
    }

    @PostMapping("/approve-vendor/{vendorId}")
    public void approveVendor(@PathVariable Long vendorId,
                              @AuthenticationPrincipal User admin) {
        adminService.approveVendor(vendorId, admin);
    }
}
