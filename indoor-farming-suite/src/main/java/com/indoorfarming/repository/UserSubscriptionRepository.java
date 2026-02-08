package com.indoorfarming.repository;

import com.indoorfarming.entity.User;
import com.indoorfarming.entity.UserSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSubscriptionRepository extends JpaRepository<UserSubscription, Long> {

    java.util.List<UserSubscription> findByUser(User user);
}
