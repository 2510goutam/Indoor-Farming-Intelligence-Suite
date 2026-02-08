package com.indoorfarming.config;

import com.indoorfarming.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
                config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(Arrays.asList("*"));
                config.setAllowCredentials(true);
                return config;
            }))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/",
                        "/api/public/**",
                        "/api/auth/register",
                        "/api/auth/verify-otp",
                        "/api/auth/login",
                        "/api/vendor/apply",
                        "/swagger-ui/**",
                        "/v3/api-docs/**"
                ).permitAll()

                .requestMatchers("/api/feedback/**")
                    .hasAnyRole("REGISTERED_USER", "SUBSCRIBED_USER", "VENDOR", "ADMIN", "SUBSCRIBED_VENDOR")

                .requestMatchers("/api/environment/**", "/api/plant-health/**")
                    .hasAnyRole("SUBSCRIBED_USER", "ADMIN", "SUBSCRIBED_VENDOR")

                .requestMatchers("/api/farmer/**")
                    .hasAnyRole("ADMIN", "SUBSCRIBED_USER", "SUBSCRIBED_VENDOR")

                .requestMatchers("/api/vendor/apply")
                    .hasAnyRole("REGISTERED_USER", "SUBSCRIBED_USER", "VENDOR", "ADMIN", "SUBSCRIBED_VENDOR")

                .requestMatchers("/api/vendor/**")
                    .hasAnyRole("VENDOR", "ADMIN", "SUBSCRIBED_VENDOR")

                .requestMatchers("/api/marketplace/**", "/api/cart/**", "/api/orders/**", "/api/payment/**", "/api/products/**")
                    .hasAnyRole("REGISTERED_USER", "SUBSCRIBED_USER", "VENDOR", "ADMIN", "SUBSCRIBED_VENDOR")

                .requestMatchers("/api/admin/**")
                    .hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}