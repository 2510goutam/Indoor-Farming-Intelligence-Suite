package com.indoorfarming.controller;

import com.indoorfarming.dto.EnvironmentRecordRequestDto;
import com.indoorfarming.dto.EnvironmentRecordResponseDto;
import com.indoorfarming.entity.User;
import com.indoorfarming.service.EnvironmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/environment")
@RequiredArgsConstructor
public class EnvironmentController {

    private final EnvironmentService service;

    @PostMapping
    public EnvironmentRecordResponseDto save(
            @RequestBody EnvironmentRecordRequestDto dto,
            @AuthenticationPrincipal User user) {
        return service.save(dto, user);
    }

    @GetMapping
    public List<EnvironmentRecordResponseDto> history(
            @AuthenticationPrincipal User user) {
        return service.getUserRecords(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        service.deleteRecord(id, user);
    }
}
