package com.indoorfarming.service;

import com.indoorfarming.dto.AdminStatsDto;
import com.indoorfarming.dto.UserRegistrationDto;
import com.indoorfarming.dto.UserResponseDto;
import com.indoorfarming.dto.VendorRequestDto;
import com.indoorfarming.entity.Role;
import com.indoorfarming.entity.User;
import com.indoorfarming.entity.VendorRequest;
import com.indoorfarming.entity.VendorRequestStatus;
import com.indoorfarming.repository.ProductRepository;
import com.indoorfarming.repository.UserRepository;
import com.indoorfarming.repository.VendorRequestRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final VendorRequestRepository vendorRequestRepository;
    private final ModelMapper mapper;

    @Override
    public void deleteProduct(Long productId, User admin) {

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied");
        }

        productRepository.deleteById(productId);
    }
    
    @Override
    public void approveVendor(Long userId, User admin) {
        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admin can approve vendors");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(Role.VENDOR);
        userRepository.save(user);
    }

    @Override
    public List<UserResponseDto> getAllUsers(User admin) {
        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admin can view all users");
        }

        return userRepository.findByRoleNot(Role.ADMIN).stream()
                .map(this::mapToUserResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public AdminStatsDto getAdminStats(User admin) {
        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admin can view statistics");
        }

        long totalUsers = userRepository.countByRoleNot(Role.ADMIN);
        long subscribedUsers = userRepository.countByRole(Role.SUBSCRIBED_USER);
        long totalVendors = userRepository.countByRole(Role.VENDOR);
        long subscribedVendors = userRepository.countByRole(Role.SUBSCRIBED_VENDOR);

        AdminStatsDto stats = new AdminStatsDto(totalUsers, subscribedUsers, totalVendors, subscribedVendors);
        
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<User> recentUsers = userRepository.findByCreatedAtAfter(thirtyDaysAgo).stream()
                .filter(u -> u.getRole() != Role.ADMIN)
                .collect(Collectors.toList());
        
        Map<LocalDate, Long> registrationsByDate = recentUsers.stream()
                .collect(Collectors.groupingBy(
                    u -> u.getCreatedAt().toLocalDate(),
                    Collectors.counting()
                ));
        
        List<UserRegistrationDto> registrations = registrationsByDate.entrySet().stream()
                .map(entry -> new UserRegistrationDto(entry.getKey(), entry.getValue().intValue()))
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(Collectors.toList());
        
        stats.setUserRegistrations(registrations);
        
        return stats;
    }

    @Override
    public List<VendorRequestDto> getPendingVendorRequests(User admin) {
        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admin can view vendor requests");
        }

        return vendorRequestRepository.findByStatus(VendorRequestStatus.PENDING).stream()
                .map(this::mapToVendorRequestDto)
                .collect(Collectors.toList());
    }

    @Override
    public void approveVendorRequest(Long requestId, User admin) {
        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admin can approve vendor requests");
        }

        VendorRequest request = vendorRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Vendor request not found"));

        if (request.getStatus() != VendorRequestStatus.PENDING) {
            throw new RuntimeException("Request has already been processed");
        }

        User user = request.getUser();
        Role currentRole = user.getRole();
        
        if (currentRole == Role.SUBSCRIBED_USER) {
            user.setRole(Role.SUBSCRIBED_VENDOR);
        } else {
            user.setRole(Role.VENDOR);
        }
        
        userRepository.save(user);

        // Update request status
        request.setStatus(VendorRequestStatus.APPROVED);
        vendorRequestRepository.save(request);
    }

    @Override
    public void rejectVendorRequest(Long requestId, User admin) {
        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admin can reject vendor requests");
        }

        VendorRequest request = vendorRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Vendor request not found"));

        if (request.getStatus() != VendorRequestStatus.PENDING) {
            throw new RuntimeException("Request has already been processed");
        }

        request.setStatus(VendorRequestStatus.REJECTED);
        vendorRequestRepository.save(request);
    }

    @Override
    public void updateUser(Long userId, UserResponseDto dto, User admin) {
        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admin can update users");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setMobileNumber(dto.getMobileNumber());
        user.setRole(Role.valueOf(dto.getRole()));

        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId, User admin) {
        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admin can delete users");
        }

        userRepository.deleteById(userId);
    }

    private UserResponseDto mapToUserResponseDto(User user) {
        UserResponseDto dto = mapper.map(user, UserResponseDto.class);
        dto.setRole(user.getRole().name());
        dto.setVerified(user.isVerified());
        return dto;
    }

    private VendorRequestDto mapToVendorRequestDto(VendorRequest request) {
        VendorRequestDto dto = mapper.map(request, VendorRequestDto.class);
        dto.setUserId(request.getUser().getId());
        dto.setUserName(request.getUser().getName());
        dto.setUserEmail(request.getUser().getEmail());
        dto.setStatus(request.getStatus().name());
        return dto;
    }
}
