package com.indoorfarming.controller;

import com.indoorfarming.dto.VendorProfileDto;
import com.indoorfarming.entity.User;
import com.indoorfarming.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendor")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @PostMapping("/apply")
    public VendorProfileDto applyAsVendor(
            @RequestBody VendorProfileDto dto,
            @AuthenticationPrincipal User user) {
        return vendorService.applyAsVendor(dto, user);
    }

    @PostMapping("/profile")
    public VendorProfileDto createOrUpdate(
            @RequestBody VendorProfileDto dto,
            @AuthenticationPrincipal User vendor) {
        return vendorService.createOrUpdate(dto, vendor);
    }

    @GetMapping("/profile")
    public VendorProfileDto getProfile(
            @AuthenticationPrincipal User vendor) {
        return vendorService.getProfile(vendor);
    }
}
