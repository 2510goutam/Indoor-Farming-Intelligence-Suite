package com.indoorfarming.service;

import com.indoorfarming.dto.VendorProfileDto;
import com.indoorfarming.entity.User;

public interface VendorService {

    VendorProfileDto createOrUpdate(VendorProfileDto dto, User vendor);

    VendorProfileDto getProfile(User vendor);
    
    VendorProfileDto applyAsVendor(VendorProfileDto dto, User user);
}
