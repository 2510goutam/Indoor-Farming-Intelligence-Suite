package com.indoorfarming.service;

import com.indoorfarming.dto.NotificationResponseDto;
import com.indoorfarming.entity.Notification;
import com.indoorfarming.entity.User;
import com.indoorfarming.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;

    @Override
    public void notify(User user, String title, String message) {

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType("SYSTEM");
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        repository.save(notification);
    }

    @Override
    public List<NotificationResponseDto> getUserNotifications(User user) {

        return repository.findByUser(user)
                .stream()
                .map(n -> {
                    NotificationResponseDto dto = new NotificationResponseDto();
                    dto.setTitle(n.getTitle());
                    dto.setMessage(n.getMessage());
                    dto.setRead(n.isRead());
                    dto.setCreatedAt(n.getCreatedAt());
                    return dto;
                })
                .toList();
    }
}
