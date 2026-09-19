package com.blog.platform;

import com.blog.platform.exception.BadRequestException;
import com.blog.platform.service.impl.EmailServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmailServiceTest {

    private JavaMailSender mailSender;
    private EmailServiceImpl emailService;

    @BeforeEach
    void setUp() {
        mailSender = Mockito.mock(JavaMailSender.class);
        emailService = new EmailServiceImpl(mailSender);
    }

    @Test
    @DisplayName("Should throw BadRequestException when SMTP username or password is missing")
    void testMissingCredentialsThrowsBadRequest() {
        ReflectionTestUtils.setField(emailService, "mailUsername", "");
        ReflectionTestUtils.setField(emailService, "mailPassword", "");

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            emailService.sendOtpEmail("user@example.com", "123456");
        });

        assertEquals("SMTP authentication failed. Check MAIL_USERNAME and MAIL_PASSWORD. MAIL_PASSWORD must be a valid Gmail App Password.", ex.getMessage());
        verifyNoInteractions(mailSender);
    }

    @Test
    @DisplayName("Should throw BadRequestException when placeholder credentials are used")
    void testPlaceholderCredentialsThrowsBadRequest() {
        ReflectionTestUtils.setField(emailService, "mailUsername", "your-email@gmail.com");
        ReflectionTestUtils.setField(emailService, "mailPassword", "${MAIL_PASSWORD:}");

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            emailService.sendOtpEmail("user@example.com", "123456");
        });

        assertEquals("SMTP authentication failed. Check MAIL_USERNAME and MAIL_PASSWORD. MAIL_PASSWORD must be a valid Gmail App Password.", ex.getMessage());
        verifyNoInteractions(mailSender);
    }

    @Test
    @DisplayName("Should throw BadRequestException with clear guidance when MailAuthenticationException is thrown")
    void testMailAuthenticationExceptionThrowsClearMessage() {
        ReflectionTestUtils.setField(emailService, "mailUsername", "myaccount@gmail.com");
        ReflectionTestUtils.setField(emailService, "mailPassword", "someinvalidapppassword");

        doThrow(new org.springframework.mail.MailAuthenticationException("535-5.7.8 Username and Password not accepted"))
                .when(mailSender).send(any(SimpleMailMessage.class));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            emailService.sendOtpEmail("recipient@example.com", "123456");
        });

        assertEquals("SMTP authentication failed. Check MAIL_USERNAME and MAIL_PASSWORD. MAIL_PASSWORD must be a valid Gmail App Password.", ex.getMessage());
    }

    @Test
    @DisplayName("Should successfully send email when valid SMTP credentials are configured")
    void testSuccessfulEmailDispatch() {
        ReflectionTestUtils.setField(emailService, "mailUsername", "keryx.official@gmail.com");
        ReflectionTestUtils.setField(emailService, "mailPassword", "abcd efgh ijkl mnop");
        ReflectionTestUtils.setField(emailService, "fromEmail", "keryx.official@gmail.com");

        assertDoesNotThrow(() -> {
            emailService.sendOtpEmail("recipient@example.com", "654321");
        });

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender, times(1)).send(captor.capture());

        SimpleMailMessage sentMsg = captor.getValue();
        assertNotNull(sentMsg);
        assertEquals("keryx.official@gmail.com", sentMsg.getFrom());
        assertArrayEquals(new String[]{"recipient@example.com"}, sentMsg.getTo());
        assertTrue(sentMsg.getSubject().contains("Verification Code"));
        assertTrue(sentMsg.getText().contains("654321"));
    }

    @Test
    @DisplayName("Should fail with BadRequestException if JavaMailSender throws exception during transmission")
    void testSmtpTransmissionFailureThrowsBadRequest() {
        ReflectionTestUtils.setField(emailService, "mailUsername", "keryx.official@gmail.com");
        ReflectionTestUtils.setField(emailService, "mailPassword", "realpassword");

        doThrow(new RuntimeException("Connection timed out to smtp.gmail.com:587"))
                .when(mailSender).send(any(SimpleMailMessage.class));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            emailService.sendOtpEmail("recipient@example.com", "999999");
        });

        assertTrue(ex.getMessage().contains("Unable to send verification email"));
    }

    @Test
    @DisplayName("Should test connection and throw clear error when JavaMailSenderImpl testConnection fails")
    void testJavaMailSenderImplTestConnectionFailure() throws Exception {
        org.springframework.mail.javamail.JavaMailSenderImpl implMock = Mockito.mock(org.springframework.mail.javamail.JavaMailSenderImpl.class);
        EmailServiceImpl serviceWithImpl = new EmailServiceImpl(implMock);
        ReflectionTestUtils.setField(serviceWithImpl, "mailUsername", "myaccount@gmail.com");
        ReflectionTestUtils.setField(serviceWithImpl, "mailPassword", "someinvalidapppassword");

        doThrow(new org.springframework.mail.MailAuthenticationException("535-5.7.8 Username and Password not accepted"))
                .when(implMock).testConnection();

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            serviceWithImpl.sendOtpEmail("recipient@example.com", "123456");
        });

        assertEquals("SMTP authentication failed. Check MAIL_USERNAME and MAIL_PASSWORD. MAIL_PASSWORD must be a valid Gmail App Password.", ex.getMessage());
    }
}
