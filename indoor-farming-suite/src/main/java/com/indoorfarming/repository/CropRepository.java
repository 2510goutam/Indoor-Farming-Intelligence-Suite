package com.indoorfarming.repository;

import com.indoorfarming.entity.Crop;
import com.indoorfarming.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CropRepository extends JpaRepository<Crop, Long> {

    List<Crop> findByUser(User user);
}
