package com.blog.platform.config;

import com.blog.platform.model.entity.Category;
import com.blog.platform.model.entity.User;
import com.blog.platform.model.enums.Role;
import com.blog.platform.repository.CategoryRepository;
import com.blog.platform.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, CategoryRepository categoryRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        ensureUser("admin", "admin@blogplatform.com", "Platform Administrator", Role.ROLE_ADMIN);
        ensureUser("tech_guru", "author@blogplatform.com", "Alex Mercer", Role.ROLE_AUTHOR);
        ensureUser("jane_dev", "jane@example.com", "Jane Doe", Role.ROLE_USER);
        logger.info("Default application users verified and ready for authentication.");

        ensureCategories();
    }

    private void ensureCategories() {
        List<CategorySeed> defaultCategories = List.of(
            new CategorySeed("Technology", "technology", "Hardware, software architecture, emerging tech trends, and cybersecurity."),
            new CategorySeed("AI & Machine Learning", "ai-ml", "Generative AI, Large Language Models, deep learning, and intelligent agents."),
            new CategorySeed("Programming", "programming", "Languages, design patterns, clean code, and developer tooling."),
            new CategorySeed("Web Development", "web-development", "Frontend frameworks, responsive UI, CSS architecture, and web performance."),
            new CategorySeed("Cloud & DevOps", "cloud-devops", "Container orchestration, CI/CD pipelines, cloud platforms, and site reliability."),
            new CategorySeed("Education", "education", "Learning techniques, student success guides, academic research, and online education."),
            new CategorySeed("Business", "business", "Startups, venture capital, enterprise leadership, and digital transformation."),
            new CategorySeed("Finance", "finance", "FinTech, markets, algorithmic trading, personal wealth, and decentralized finance."),
            new CategorySeed("Travel", "travel", "Digital nomad guides, cultural insights, and global journeys."),
            new CategorySeed("Lifestyle", "lifestyle", "Productivity, wellness, habit formation, and mindful living."),
            new CategorySeed("Science", "science", "Astrophysics, quantum computing, renewable energy, and biological breakthroughs."),
            new CategorySeed("Sports", "sports", "Tournament coverage, athlete features, and sports analytics."),
            new CategorySeed("Entertainment", "entertainment", "Film, cinema analysis, interactive media, and music tech."),
            new CategorySeed("Cars", "cars", "Electric vehicles, automotive engineering, and autonomous transport."),
            new CategorySeed("Gaming", "gaming", "Game development, esports, engine design, and interactive media."),
            new CategorySeed("Software Engineering", "software-engineering", "Architecture, backend design, clean code, and engineering patterns.")
        );

        for (CategorySeed seed : defaultCategories) {
            if (!categoryRepository.existsBySlug(seed.slug) && !categoryRepository.existsByName(seed.name)) {
                Category cat = new Category(null, seed.name, seed.slug, seed.description);
                categoryRepository.save(cat);
                logger.info("Initialized default category: {}", seed.name);
            }
        }
    }

    private static class CategorySeed {
        final String name;
        final String slug;
        final String description;

        CategorySeed(String name, String slug, String description) {
            this.name = name;
            this.slug = slug;
            this.description = description;
        }
    }

    private void ensureUser(String username, String email, String fullName, Role role) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(email);
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            boolean needsUpdate = false;
            if (!passwordEncoder.matches("password123", user.getPassword())) {
                user.setPassword(passwordEncoder.encode("password123"));
                needsUpdate = true;
            }
            if (!Boolean.TRUE.equals(user.getEmailVerified())) {
                user.setEmailVerified(true);
                needsUpdate = true;
            }
            if (!Boolean.TRUE.equals(user.getEnabled())) {
                user.setEnabled(true);
                needsUpdate = true;
            }
            if (needsUpdate) {
                userRepository.save(user);
                logger.info("Updated default user credentials/status for: {}", username);
            }
        } else {
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setFullName(fullName);
            newUser.setPassword(passwordEncoder.encode("password123"));
            newUser.setRole(role);
            newUser.setEnabled(true);
            newUser.setEmailVerified(true);
            userRepository.save(newUser);
            logger.info("Created default user: {}", username);
        }
    }
}

