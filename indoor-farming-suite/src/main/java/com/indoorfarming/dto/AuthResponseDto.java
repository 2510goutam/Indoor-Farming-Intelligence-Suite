package com.indoorfarming.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDto {

    @JsonProperty("token")
    private String token;

    @JsonProperty("user")
    private UserResponseDto user;

    @Override
    public String toString() {
        return "AuthResponseDto{token='[PROTECTED]', user=" + user + "}";
    }
}
