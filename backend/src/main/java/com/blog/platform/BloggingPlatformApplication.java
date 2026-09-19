package com.blog.platform;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
public class BloggingPlatformApplication {

    private static final Logger logger = LoggerFactory.getLogger(BloggingPlatformApplication.class);

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(BloggingPlatformApplication.class, args);
    }

    private static void loadDotEnv() {
        Path currentDir = Paths.get("").toAbsolutePath();
        java.util.LinkedHashSet<Path> candidatePaths = new java.util.LinkedHashSet<>();

        Path searchDir = currentDir;
        for (int i = 0; i < 4 && searchDir != null; i++) {
            candidatePaths.add(searchDir.resolve(".env"));
            candidatePaths.add(searchDir.resolve(".env.local"));
            candidatePaths.add(searchDir.resolve("backend").resolve(".env"));
            candidatePaths.add(searchDir.resolve("backend").resolve(".env.local"));
            searchDir = searchDir.getParent();
        }

        for (Path path : candidatePaths) {
            if (Files.exists(path) && Files.isRegularFile(path)) {
                try {
                    List<String> lines = Files.readAllLines(path);
                    for (String line : lines) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#") || !line.contains("=")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        String key = line.substring(0, eqIdx).trim();
                        String value = line.substring(eqIdx + 1).trim();
                        if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
                            value = value.substring(1, value.length() - 1);
                        }

                        // Normalize password (remove surrounding quotes and internal spaces)
                        if ("MAIL_PASSWORD".equalsIgnoreCase(key) || "SMTP_PASSWORD".equalsIgnoreCase(key) || "SPRING_MAIL_PASSWORD".equalsIgnoreCase(key)) {
                            String cleanPw = value.trim().replace("\"", "").replace("'", "");
                            if (cleanPw.contains(" ")) {
                                cleanPw = cleanPw.replaceAll("\\s+", "");
                            }
                            value = cleanPw;
                        }

                        // Do not overwrite an existing non-placeholder property with a placeholder value
                        String existingVal = System.getProperty(key);
                        boolean isPlaceholder = isPlaceholderValue(value);
                        if (existingVal != null && !existingVal.isBlank() && !isPlaceholderValue(existingVal) && isPlaceholder) {
                            continue;
                        }

                        System.setProperty(key, value);

                        if ("MAIL_PASSWORD".equalsIgnoreCase(key) || "SMTP_PASSWORD".equalsIgnoreCase(key) || "SPRING_MAIL_PASSWORD".equalsIgnoreCase(key)) {
                            System.setProperty("MAIL_PASSWORD", value);
                            System.setProperty("spring.mail.password", value);
                        } else if ("SMTP_HOST".equalsIgnoreCase(key) || "MAIL_HOST".equalsIgnoreCase(key) || "SPRING_MAIL_HOST".equalsIgnoreCase(key)) {
                            System.setProperty("MAIL_HOST", value);
                            System.setProperty("spring.mail.host", value);
                        } else if ("SMTP_PORT".equalsIgnoreCase(key) || "MAIL_PORT".equalsIgnoreCase(key) || "SPRING_MAIL_PORT".equalsIgnoreCase(key)) {
                            System.setProperty("MAIL_PORT", value);
                            System.setProperty("spring.mail.port", value);
                        } else if ("SMTP_USERNAME".equalsIgnoreCase(key) || "MAIL_USERNAME".equalsIgnoreCase(key) || "SPRING_MAIL_USERNAME".equalsIgnoreCase(key)) {
                            System.setProperty("MAIL_USERNAME", value);
                            System.setProperty("spring.mail.username", value);
                        } else if ("SMTP_FROM".equalsIgnoreCase(key) || "MAIL_FROM".equalsIgnoreCase(key) || "APP_MAIL_FROM".equalsIgnoreCase(key)) {
                            System.setProperty("MAIL_FROM", value);
                            System.setProperty("app.mail.from", value);
                        }
                    }
                    logger.info("Loaded environment properties from: {}", path.toAbsolutePath());
                } catch (Exception e) {
                    logger.warn("Failed to parse .env file at {}: {}", path, e.getMessage());
                }
            }
        }
    }

    private static boolean isPlaceholderValue(String val) {
        if (val == null || val.isBlank() || val.startsWith("${")) return true;
        String lower = val.toLowerCase(java.util.Locale.ROOT);
        return lower.equals("your-email@gmail.com")
                || lower.equals("your_email@gmail.com")
                || lower.equals("your_gmail_address@gmail.com")
                || lower.equals("your-gmail-app-password")
                || lower.equals("your_gmail_app_password")
                || lower.equals("your_google_client_id")
                || lower.equals("your_google_client_secret");
    }
}

