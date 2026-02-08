package com.indoorfarming.service;

import com.indoorfarming.dto.*;
import com.indoorfarming.entity.EnvironmentRecord;
import com.indoorfarming.entity.User;
import com.indoorfarming.repository.EnvironmentRecordRepository;
import com.indoorfarming.service.EnvironmentService;
import com.indoorfarming.service.SubscriptionCheckService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnvironmentServiceImpl implements EnvironmentService {

    private final EnvironmentRecordRepository repository;
    private final SubscriptionCheckService subscriptionCheck;
    private final ModelMapper mapper;


    @Override
    public EnvironmentRecordResponseDto save(EnvironmentRecordRequestDto dto, User user) {

        subscriptionCheck.requireActiveSubscription(user);

        String aiSuggestion = dto.getAiSuggestion();
        if (aiSuggestion == null || aiSuggestion.trim().isEmpty()) {
            aiSuggestion = "No AI suggestions available. Please ensure the frontend is properly configured.";
        }

        EnvironmentRecord record = mapper.map(dto, EnvironmentRecord.class);
        record.setUser(user);
        record.setAiSuggestion(aiSuggestion);
        record.setRecordedAt(LocalDateTime.now());

        EnvironmentRecord saved = repository.save(record);

        return toResponse(saved);
    }

    @Override
    public List<EnvironmentRecordResponseDto> getUserRecords(User user) {
        
        subscriptionCheck.requireActiveSubscription(user);

        return repository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void deleteRecord(Long id, User user) {
        EnvironmentRecord record = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
        
        if (!record.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You can only delete your own records");
        }
        
        repository.delete(record);
    }

    private EnvironmentRecordResponseDto toResponse(EnvironmentRecord record) {
        return mapper.map(record, EnvironmentRecordResponseDto.class);
    }
}