package com.indoorfarming.service;

import com.indoorfarming.dto.RegisterRequestDto;
import com.indoorfarming.dto.UserResponseDto;
import com.indoorfarming.entity.Role;
import com.indoorfarming.entity.User;
import com.indoorfarming.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper mapper;

    @Override
    public UserResponseDto register(RegisterRequestDto dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = mapper.map(dto, User.class);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.REGISTERED_USER);
        user.setVerified(false);

        User saved = userRepository.save(user);

        return toUserResponse(saved);
    }

    @Override
    public UserResponseDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toUserResponse(user);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toUserResponse)
                .toList();
    }

    @Override
    public void verifyUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setVerified(true);
        userRepository.save(user);
    }

    private UserResponseDto toUserResponse(User user) {
        UserResponseDto resp = mapper.map(user, UserResponseDto.class);
        resp.setRole(user.getRole().name());
        resp.setVerified(user.isVerified());
        return resp;
    }
}
