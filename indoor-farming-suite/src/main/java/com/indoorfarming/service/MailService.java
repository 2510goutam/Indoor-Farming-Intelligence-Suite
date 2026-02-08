package com.indoorfarming.service;

public interface MailService {

    void sendOtpEmail(String toEmail, String otp);

    void sendInvoiceEmail(String toEmail, String userName, String invoiceNumber, double amount, String itemDetails);
    
    void sendSubscriptionConfirmationEmail(String toEmail, String userName, String planName, double amount);
}
