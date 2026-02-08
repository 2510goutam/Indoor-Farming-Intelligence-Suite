package com.indoorfarming.service;

import com.indoorfarming.entity.*;
import com.indoorfarming.repository.UserSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;


@Service
@RequiredArgsConstructor
public class SubscriptionCheckService {

    private final UserSubscriptionRepository subscriptionRepository;

    public void requireActiveSubscription(User user) {
        
        if (user.getRole() == Role.VENDOR || 
            user.getRole() == Role.ADMIN ||
            user.getRole() == Role.SUBSCRIBED_VENDOR) {
            return;
        }


        java.util.List<UserSubscription> subscriptions = subscriptionRepository.findByUser(user);
        
        if (subscriptions.isEmpty()) {
            throw new RuntimeException("Subscription required. Please subscribe to access this feature.");
        }

        // Find if any subscription is active and not expired
        boolean hasActive = subscriptions.stream()
                .anyMatch(s -> "ACTIVE".equals(s.getStatus()) && !s.getEndDate().isBefore(LocalDate.now()));

        if (!hasActive) {
            // Check if there are any expired subscriptions to provide a better error message
            boolean hasExpired = subscriptions.stream()
                    .anyMatch(s -> "ACTIVE".equals(s.getStatus()) && s.getEndDate().isBefore(LocalDate.now()));
            
            if (hasExpired) {
                throw new RuntimeException("Subscription expired. Please renew.");
            } else {
                throw new RuntimeException("Subscription not active.");
            }
        }
    }

    public boolean hasActiveSubscription(User user) {
        try {
            requireActiveSubscription(user);
            return true;
        } catch (RuntimeException e) {
            return false;
        }
    }
}