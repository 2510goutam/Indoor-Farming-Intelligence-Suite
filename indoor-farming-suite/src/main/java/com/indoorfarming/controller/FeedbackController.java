package com.indoorfarming.controller;

import com.indoorfarming.dto.FeedbackResponseDto;
import com.indoorfarming.entity.Role;
import com.indoorfarming.entity.Feedback;
import com.indoorfarming.entity.User;
import com.indoorfarming.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;

    @PostMapping
    public Feedback submitFeedback(
            @RequestBody Feedback feedback,
            @AuthenticationPrincipal User user) {
        feedback.setUser(user);
        return feedbackRepository.save(feedback);
    }

    @GetMapping("/all")
    public List<FeedbackResponseDto> getAllFeedbacks(@AuthenticationPrincipal User admin) {
        if (admin == null || admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied: Admins only");
        }
        return feedbackRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/positive")
    public List<FeedbackResponseDto> getPositiveFeedbacks() {
        return feedbackRepository.findAll().stream()
                .filter(f -> f.getRating() > 2)
                .map(this::mapToResponseDto)
                .limit(5)
                .collect(Collectors.toList());
    }

    private FeedbackResponseDto mapToResponseDto(Feedback feedback) {
        FeedbackResponseDto dto = new FeedbackResponseDto();
        dto.setId(feedback.getId());
        
        if (feedback.getUser() != null) {
            dto.setUserName(feedback.getUser().getName());
            dto.setUserRole(feedback.getUser().getRole() != null ? feedback.getUser().getRole().name() : "REGISTERED_USER");
        } else {
            dto.setUserName("Anonymous");
            dto.setUserRole("USER");
        }
        
        dto.setMessage(feedback.getMessage());
        dto.setRating(feedback.getRating());
        dto.setCreatedAt(feedback.getCreatedAt());
        return dto;
    }
}
