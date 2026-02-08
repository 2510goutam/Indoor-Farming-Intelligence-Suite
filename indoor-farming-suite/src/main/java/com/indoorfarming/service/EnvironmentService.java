package com.indoorfarming.service;

import com.indoorfarming.dto.EnvironmentRecordRequestDto;
import com.indoorfarming.dto.EnvironmentRecordResponseDto;
import com.indoorfarming.entity.User;

import java.util.List;

public interface EnvironmentService {

    EnvironmentRecordResponseDto save(EnvironmentRecordRequestDto dto, User user);

    List<EnvironmentRecordResponseDto> getUserRecords(User user);

    void deleteRecord(Long id, User user);
}
