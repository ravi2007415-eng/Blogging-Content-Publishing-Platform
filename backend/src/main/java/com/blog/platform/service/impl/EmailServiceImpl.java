package com.blog.platform.service.impl;

import com.blog.platform.exception.BadRequestException;
import com.blog.platform.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        if (fromEmail == null || fromEmail.isBlank() || fromEmail.equals("${spring.mail.username:}")) {
            logger.info("=================================================");
            logger.info(">> [LOCAL DEV / TEST MODE] OTP for {}: {} <<", toEmail, otp);
            logger.info("=================================================");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Blog Platform - Email Verification OTP");
            message.setText("Hello,\n\n"
                    + "Your verification OTP for Blogging & Content Publishing Platform is:\n\n"
                    + otp + "\n\n"
                    + "This OTP is valid for 5 minutes.\n\n"
                    + "If you did not request this verification, please ignore this email.\n\n"
                    + "Regards,\n"
                    + "Blogging & Content Publishing Platform");

            mailSender.send(message);
            logger.info("Verification OTP email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage());
            throw new BadRequestException("Unable to send OTP email. Please verify SMTP configuration or try again.");
        }
    }
}
