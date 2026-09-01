package com.blog.platform.config;

import com.blog.platform.model.entity.User;
import com.blog.platform.model.enums.Role;
import com.blog.platform.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        ensureUser("admin", "admin@blogplatform.com", "Platform Administrator", Role.ROLE_ADMIN);
        ensureUser("tech_guru", "author@blogplatform.com", "Alex Mercer", Role.ROLE_AUTHOR);
        ensureUser("jane_dev", "jane@example.com", "Jane Doe", Role.ROLE_USER);
        logger.info("Default application users verified and ready for authentication.");
    }

    private void ensureUser(String username, String email, String fullName, Role role) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(email);
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!passwordEncoder.matches("password123", user.getPassword())) {
                user.setPassword(passwordEncoder.encode("password123"));
                user.setEnabled(true);
                userRepository.save(user);
                logger.info("Updated password hash for user: {}", username);
            }
        } else {
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setFullName(fullName);
            newUser.setPassword(passwordEncoder.encode("password123"));
            newUser.setRole(role);
            newUser.setEnabled(true);
            userRepository.save(newUser);
            logger.info("Created default user: {}", username);
        }
    }
}
