package com.blog.platform.service.impl;

import com.blog.platform.exception.BadRequestException;
import com.blog.platform.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${app.mail.from:${spring.mail.username:}}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        String cleanUser = mailUsername != null ? mailUsername.trim() : "";
        String cleanPass = mailPassword != null ? mailPassword.trim().replace("\"", "").replace("'", "") : "";
        if (cleanPass.contains(" ")) {
            cleanPass = cleanPass.replaceAll("\\s+", "");
        }

        if (cleanUser.isBlank() || cleanUser.startsWith("${") ||
            cleanUser.equalsIgnoreCase("your-email@gmail.com") || cleanUser.equalsIgnoreCase("your_gmail_address@gmail.com") ||
            cleanPass.isBlank() || cleanPass.startsWith("${") ||
            cleanPass.equalsIgnoreCase("your-gmail-app-password") || cleanPass.equalsIgnoreCase("your_gmail_app_password")) {
            logger.error("Email sending failed for recipient {}: SMTP credentials not configured or using placeholders", toEmail);
            throw new BadRequestException("SMTP authentication failed. Check MAIL_USERNAME and MAIL_PASSWORD. MAIL_PASSWORD must be a valid Gmail App Password.");
        }

        String senderAddress = (fromEmail != null && !fromEmail.isBlank() && !fromEmail.startsWith("${")) 
                ? fromEmail.trim() 
                : cleanUser;

        logger.info("OTP generated for recipient email: {}", toEmail);
        logger.info("Email sending started for recipient: {}", toEmail);

        try {
            // Validate SMTP connection beforehand (Step 5)
            if (mailSender instanceof org.springframework.mail.javamail.JavaMailSenderImpl impl) {
                impl.testConnection();
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderAddress);
            message.setTo(toEmail);
            message.setSubject("Keryx Blog Platform - Email Verification Code");
            message.setText("Hello,\n\n"
                    + "Your 6-digit verification code for Keryx Blogging Platform is:\n\n"
                    + otp + "\n\n"
                    + "This code is valid for 5 minutes.\n\n"
                    + "If you did not request this verification code, please ignore this email.\n\n"
                    + "Best regards,\n"
                    + "Keryx Publishing Platform");

            mailSender.send(message);
            logger.info("Email sending successful for recipient: {}", toEmail);
        } catch (MailAuthenticationException e) {
            logger.error("Email sending failed for recipient {}: SMTP authentication failed ({})", toEmail, e.getMessage());
            throw new BadRequestException("SMTP authentication failed. Check MAIL_USERNAME and MAIL_PASSWORD. MAIL_PASSWORD must be a valid Gmail App Password.");
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "";
            if (msg.contains("Authentication failed") || msg.contains("535") || 
                msg.contains("Username and Password not accepted") || msg.contains("BadCredentials") ||
                msg.toLowerCase().contains("authenticat")) {
                logger.error("Email sending failed for recipient {}: SMTP authentication error ({})", toEmail, msg);
                throw new BadRequestException("SMTP authentication failed. Check MAIL_USERNAME and MAIL_PASSWORD. MAIL_PASSWORD must be a valid Gmail App Password.");
            }
            logger.error("Email sending failed for recipient {}: {}", toEmail, msg);
            throw new BadRequestException("Unable to send verification email: " + msg);
        }
    }
}

