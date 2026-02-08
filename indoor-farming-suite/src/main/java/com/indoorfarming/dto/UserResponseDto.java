package com.indoorfarming.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("name")
    private String name;

    @JsonProperty("email")
    private String email;

    @JsonProperty("role")
    private String role;

    @JsonProperty("mobileNumber")
    private String mobileNumber;

    @JsonProperty("verified")
    private boolean verified;

    @JsonProperty("createdAt")
    private java.time.LocalDateTime createdAt;

    @Override
    public String toString() {
        return "UserResponseDto{id=" + id + ", name='" + name + "', email='" + email + "', role='" + role + "', verified=" + verified + "}";
    }
}
