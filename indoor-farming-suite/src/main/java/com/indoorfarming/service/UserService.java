package com.indoorfarming.service;

import com.indoorfarming.dto.RegisterRequestDto;
import com.indoorfarming.dto.UserResponseDto;

import java.util.List;

public interface UserService {

    UserResponseDto register(RegisterRequestDto dto);

    UserResponseDto getUserByEmail(String email);

    List<UserResponseDto> getAllUsers();

    void verifyUser(String email);
}
