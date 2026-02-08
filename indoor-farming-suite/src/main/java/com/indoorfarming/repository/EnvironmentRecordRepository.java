package com.indoorfarming.repository;

import com.indoorfarming.entity.EnvironmentRecord;
import com.indoorfarming.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnvironmentRecordRepository extends JpaRepository<EnvironmentRecord, Long> {

    List<EnvironmentRecord> findByUser(User user);
}
