package com.indoorfarming.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("OTP Verification - Indoor Farming Suite");
        message.setText(
                "Welcome to Indoor Farming Intelligence Suite!\n\n" +
                "Your OTP is: " + otp +
                "\nThis OTP is valid for 5 minutes.\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Indoor Farming Suite Team"
        );
        mailSender.send(message);
    }

    @Override
    public void sendInvoiceEmail(String toEmail, String userName, String invoiceNumber, double amount, String itemDetails) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Payment Invoice - Indoor Farming Suite #" + invoiceNumber);
        
        String invoiceDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));
        
        message.setText(String.format(
            "INDOOR FARMING INTELLIGENCE SUITE\n" +
            "========================================\n\n" +
            "INVOICE\n\n" +
            "Invoice Number: %s\n" +
            "Date: %s\n" +
            "Customer: %s\n" +
            "Email: %s\n\n" +
            "========================================\n\n" +
            "ORDER DETAILS:\n" +
            "%s\n\n" +
            "========================================\n\n" +
            "TOTAL AMOUNT PAID: ₹%.2f\n\n" +
            "Payment Method: Razorpay\n" +
            "Payment Status: SUCCESS\n\n" +
            "========================================\n\n" +
            "Thank you for your purchase!\n\n" +
            "Best regards,\n" +
            "Indoor Farming Suite Team",
            invoiceNumber,
            invoiceDate,
            userName,
            toEmail,
            itemDetails != null ? itemDetails : "Marketplace Purchase",
            amount
        ));
        
        mailSender.send(message);
    }

    @Override
    public void sendSubscriptionConfirmationEmail(String toEmail, String userName, String planName, double amount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Subscription Activated - Indoor Farming Suite");
        
        String activationDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));
        
        message.setText(String.format(
            "INDOOR FARMING INTELLIGENCE SUITE\n" +
            "========================================\n\n" +
            "SUBSCRIPTION CONFIRMATION\n\n" +
            "Dear %s,\n\n" +
            "Your subscription has been successfully activated!\n\n" +
            "Plan: %s\n" +
            "Amount Paid: ₹%.2f\n" +
            "Activation Date: %s\n\n" +
            "You now have access to:\n" +
            "✓ Real-time Environment Monitoring\n" +
            "✓ AI-Powered Optimization Suggestions\n" +
            "✓ Advanced Crop Management Tools\n\n" +
            "========================================\n\n" +
            "Thank you for choosing Indoor Farming Suite!\n\n" +
            "Best regards,\n" +
            "Indoor Farming Suite Team",
            userName,
            planName,
            amount,
            activationDate
        ));
        
        mailSender.send(message);
    }
}
