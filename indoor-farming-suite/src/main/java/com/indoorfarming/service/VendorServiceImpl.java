package com.indoorfarming.service;

import com.indoorfarming.dto.VendorProfileDto;
import com.indoorfarming.entity.Role;
import com.indoorfarming.entity.VendorProfile;
import com.indoorfarming.entity.VendorRequest;
import com.indoorfarming.entity.VendorRequestStatus;
import com.indoorfarming.entity.User;
import com.indoorfarming.repository.VendorProfileRepository;
import com.indoorfarming.repository.VendorRequestRepository;
import com.indoorfarming.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {

    private final VendorProfileRepository repository;
    private final UserRepository userRepository;
    private final VendorRequestRepository vendorRequestRepository;
    private final ModelMapper mapper;

    @Override
    public VendorProfileDto createOrUpdate(VendorProfileDto dto, User vendor) {

        VendorProfile profile = repository.findByUser(vendor)
                .orElse(new VendorProfile());

        mapper.map(dto, profile);
        profile.setUser(vendor);
        profile.setApprovalStatus("PENDING");
        profile.setApprovalStatus("PENDING");

        repository.save(profile);

        return dto;
    }

    @Override
    public VendorProfileDto applyAsVendor(VendorProfileDto dto, User user) {
        
        vendorRequestRepository.findByUserId(user.getId()).ifPresent(existingRequest -> {
            if (existingRequest.getStatus() == VendorRequestStatus.PENDING) {
                throw new RuntimeException("You already have a pending vendor request");
            }
        });
        
        VendorRequest request = mapper.map(dto, VendorRequest.class);
        request.setUser(user);
        request.setStatus(VendorRequestStatus.PENDING);
        request.setRequestedAt(java.time.LocalDateTime.now());
        
        vendorRequestRepository.save(request);
        
        return dto;
    }

    @Override
    public VendorProfileDto getProfile(User vendor) {

        VendorProfile profile = repository.findByUser(vendor)
                .orElseThrow(() -> new RuntimeException("Vendor profile not found"));

        return mapper.map(profile, VendorProfileDto.class);
    }
}
