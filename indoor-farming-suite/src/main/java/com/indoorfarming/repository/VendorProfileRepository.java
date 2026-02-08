package com.indoorfarming.repository;

import com.indoorfarming.entity.VendorProfile;
import com.indoorfarming.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VendorProfileRepository extends JpaRepository<VendorProfile, Long> {

    Optional<VendorProfile> findByUser(User user);
}
