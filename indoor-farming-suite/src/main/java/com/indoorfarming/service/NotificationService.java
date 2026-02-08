package com.indoorfarming.service;

import com.indoorfarming.dto.NotificationResponseDto;
import com.indoorfarming.entity.User;

import java.util.List;

public interface NotificationService {

    void notify(User user, String title, String message);

    List<NotificationResponseDto> getUserNotifications(User user);
}
