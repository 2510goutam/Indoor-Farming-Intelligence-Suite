package com.indoorfarming.service;

import com.indoorfarming.dto.UserSubscriptionDto;
import com.indoorfarming.entity.User;

public interface SubscriptionService {

    UserSubscriptionDto subscribe(User user, Long planId);

    UserSubscriptionDto getUserSubscription(User user);
}
