package com.indoorfarming.service;

import com.indoorfarming.dto.AuthResponseDto;
import com.indoorfarming.dto.LoginRequestDto;
import com.indoorfarming.dto.UserResponseDto;
import com.indoorfarming.entity.User;
import com.indoorfarming.repository.UserRepository;
import com.indoorfarming.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ModelMapper mapper;

    @Override
    public AuthResponseDto login(LoginRequestDto dto) {

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.isVerified()) {
            throw new RuntimeException("Account not verified. Please verify your email first.");
        }

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);

        UserResponseDto userDto = mapper.map(user, UserResponseDto.class);
        userDto.setRole(user.getRole().name());
        userDto.setVerified(user.isVerified());

        AuthResponseDto response = AuthResponseDto.builder()
                .token(token)
                .user(userDto)
                .build();
        System.out.println("============================================");
        System.out.println("🚀 [V2] LOGIN SUCCESSFUL - RETURNING NESTED USER");
        System.out.println("📦 Response Data: " + response);
        System.out.println("============================================");
        
        return response;
    }
}
