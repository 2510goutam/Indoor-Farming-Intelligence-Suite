package com.indoorfarming.repository;

import com.indoorfarming.entity.User;
import com.indoorfarming.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);

    long countByRole(Role role);
    
    long countByRoleNot(Role role);
    
    List<User> findByRoleNot(Role role);
    
    List<User> findByCreatedAtAfter(LocalDateTime date);

    boolean existsByEmail(String email);
}
