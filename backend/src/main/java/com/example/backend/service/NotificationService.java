package com.example.backend.service;

import com.example.backend.entity.Notification;
import com.example.backend.entity.NotificationType;
import com.example.backend.repository.NotificationRepository;
import com.example.backend.websocket.NotificationWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationWebSocketHandler webSocketHandler;

    public Notification createNotification(String message, NotificationType type) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setType(type);
        notification.setTimestamp(LocalDateTime.now());
        notification.setReadStatus(false);

        Notification saved = notificationRepository.save(notification);
        webSocketHandler.broadcast(saved);
        return saved;
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAllByOrderByTimestampDesc();
    }

    @Transactional
    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setReadStatus(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAllRead() {
        List<Notification> notifications = notificationRepository.findAllByOrderByTimestampDesc();
        notifications.forEach(notification -> notification.setReadStatus(true));
        notificationRepository.saveAll(notifications);
    }
}
