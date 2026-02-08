package com.indoorfarming.service;

import com.indoorfarming.dto.UserSubscriptionDto;
import com.indoorfarming.entity.Role;
import com.indoorfarming.entity.SubscriptionPlan;
import com.indoorfarming.entity.User;
import com.indoorfarming.entity.UserSubscription;
import com.indoorfarming.repository.SubscriptionPlanRepository;
import com.indoorfarming.repository.UserSubscriptionRepository;
import com.indoorfarming.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionPlanRepository planRepository;
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final UserRepository userRepository;
    private final ModelMapper mapper;

    @Override
    public UserSubscriptionDto subscribe(User user, Long planId) {

        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        UserSubscription subscription = new UserSubscription();
        subscription.setUser(user);
        subscription.setSubscriptionPlan(plan);
        subscription.setStartDate(LocalDate.now());
        subscription.setEndDate(LocalDate.now().plusDays(plan.getDurationInDays()));
        subscription.setStatus("ACTIVE");

        userSubscriptionRepository.save(subscription);

        Role currentRole = user.getRole();
        
        if (currentRole == Role.VENDOR) {
            user.setRole(Role.SUBSCRIBED_VENDOR);
        } else if (currentRole == Role.REGISTERED_USER) {
            user.setRole(Role.SUBSCRIBED_USER);
        }
        
        userRepository.save(user);

        UserSubscriptionDto dto = mapper.map(subscription, UserSubscriptionDto.class);
        dto.setPlanName(plan.getName());

        return dto;
    }

    @Override
    public UserSubscriptionDto getUserSubscription(User user) {

        java.util.List<UserSubscription> subscriptions = userSubscriptionRepository.findByUser(user);

        if (subscriptions.isEmpty()) {
            throw new RuntimeException("No active subscription");
        }

        UserSubscription bestSubscription = subscriptions.stream()
                .filter(s -> "ACTIVE".equals(s.getStatus()))
                .max(java.util.Comparator.comparing(UserSubscription::getEndDate))
                .orElse(subscriptions.get(0)); // Fallback to first if none active

        UserSubscriptionDto dto = mapper.map(bestSubscription, UserSubscriptionDto.class);
        dto.setPlanName(bestSubscription.getSubscriptionPlan().getName());

        return dto;
    }
}
