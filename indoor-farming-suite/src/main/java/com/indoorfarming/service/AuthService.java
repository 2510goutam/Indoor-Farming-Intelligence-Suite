package com.indoorfarming.service;

import com.indoorfarming.dto.AuthResponseDto;
import com.indoorfarming.dto.LoginRequestDto;

public interface AuthService {

    AuthResponseDto login(LoginRequestDto dto);
}
