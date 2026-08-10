package com.blog.platform.config;

import com.blog.platform.model.entity.*;
import com.blog.platform.model.enums.BlogStatus;
import com.blog.platform.model.enums.Role;
import com.blog.platform.repository.*;
import com.blog.platform.util.ValidationUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final BlogRepository blogRepository;
    private final NewsRepository newsRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;
    private final ValidationUtil validationUtil;

    public DatabaseSeeder(UserRepository userRepository,
                          CategoryRepository categoryRepository,
                          SubCategoryRepository subCategoryRepository,
                          BlogRepository blogRepository,
                          NewsRepository newsRepository,
                          EventRepository eventRepository,
                          PasswordEncoder passwordEncoder,
                          ValidationUtil validationUtil) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.subCategoryRepository = subCategoryRepository;
        this.blogRepository = blogRepository;
        this.newsRepository = newsRepository;
        this.eventRepository = eventRepository;
        this.passwordEncoder = passwordEncoder;
        this.validationUtil = validationUtil;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedTaxonomy();
        seedBlogs();
        seedNews();
        seedEvents();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User admin = new User(null, "admin", "admin@keryx.dev", passwordEncoder.encode("admin123"), "Admin Editor", "Chief Editor at KERYX Publishing Platform", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400", Role.ROLE_ADMIN, true);
            User author = new User(null, "author", "author@keryx.dev", passwordEncoder.encode("author123"), "Alex Rivera", "Senior Sports & Technology Journalist", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", Role.ROLE_AUTHOR, true);
            User user = new User(null, "user", "user@keryx.dev", passwordEncoder.encode("user123"), "John Reader", "Passionate reader & tech enthusiast", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400", Role.ROLE_USER, true);

            userRepository.saveAll(List.of(admin, author, user));
        }
    }

    private void seedTaxonomy() {
        if (categoryRepository.count() == 0) {
            createCategoryWithSubs("Sports", "Live scores, tournament highlights, athlete profiles, and upcoming matches across all sports.", List.of(
                    "Cricket", "Volleyball", "Football", "Basketball", "Tennis", "Badminton"
            ));

            createCategoryWithSubs("Politics", "In-depth policy analysis, election coverage, and geopolitical developments.", List.of(
                    "National", "State", "International"
            ));

            createCategoryWithSubs("Technology", "Cutting-edge innovation, software engineering, hardware reviews, and AI research.", List.of(
                    "AI & ML", "Software", "Gadgets", "Cyber Security", "Cloud"
            ));

            createCategoryWithSubs("Entertainment", "Movie reviews, music releases, streaming shows, gaming, and celebrity updates.", List.of(
                    "Movies", "Music", "OTT", "Celebrities", "Gaming"
            ));

            createCategoryWithSubs("Comedy", "Humor, viral memes, stand-up comedy specials, and satirical commentary.", List.of(
                    "Memes", "Stand-up", "Viral Content"
            ));

            createCategoryWithSubs("Events", "Upcoming conferences, tournaments, campus festivals, and cultural gatherings.", List.of(
                    "Sports Events", "College Events", "Cultural Events", "Conferences", "Upcoming Events"
            ));
        }
    }

    private void createCategoryWithSubs(String name, String description, List<String> subNames) {
        String slug = validationUtil.toSlug(name);
        Category category = new Category(null, name, slug, description);
        Category savedCategory = categoryRepository.save(category);

        for (String subName : subNames) {
            String subSlug = validationUtil.toSlug(subName);
            SubCategory subCategory = new SubCategory(null, subName, subSlug, subName + " coverage", savedCategory);
            subCategoryRepository.save(subCategory);
        }
    }

    private void seedBlogs() {
        if (blogRepository.count() == 0) {
            User author = userRepository.findByUsername("author").orElse(userRepository.findAll().get(0));
            Category sports = categoryRepository.findBySlug("sports").orElse(null);
            Category tech = categoryRepository.findBySlug("technology").orElse(null);

            if (sports != null) {
                Blog b1 = new Blog();
                b1.setTitle("National Volleyball Championship 2026 Announced");
                b1.setSlug("national-volleyball-championship-2026-announced");
                b1.setSummary("State teams gather for the premier national volleyball tournament featuring top athletes.");
                b1.setContent("The National Volleyball Championship is set to kick off next month with over 24 state teams competing for the coveted trophy. Fans can expect thrilling serve and spike action as defending champions take the court.");
                b1.setCoverImageUrl("https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1000");
                b1.setStatus(BlogStatus.PUBLISHED);
                b1.setViewsCount(1420);
                b1.setAuthor(author);
                b1.setCategory(sports);
                b1.setSubCategoryName("Volleyball");
                blogRepository.save(b1);

                Blog b2 = new Blog();
                b2.setTitle("Cricket World Cup 2026: Team Strategy Breakdown");
                b2.setSlug("cricket-world-cup-2026-strategy");
                b2.setSummary("Analyzing top team rosters, spin bowler selections, and pitch conditions for the tournament.");
                b2.setContent("With the Cricket World Cup around the corner, analysts break down middle-order strategies and powerplay batting tactics crucial for securing victory on subcontinental pitches.");
                b2.setCoverImageUrl("https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1000");
                b2.setStatus(BlogStatus.PUBLISHED);
                b2.setViewsCount(2850);
                b2.setAuthor(author);
                b2.setCategory(sports);
                b2.setSubCategoryName("Cricket");
                blogRepository.save(b2);
            }

            if (tech != null) {
                Blog b3 = new Blog();
                b3.setTitle("Generative AI in 2026: Reasoning Models & Autonomous Agents");
                b3.setSlug("generative-ai-2026-reasoning-models");
                b3.setSummary("How next-generation reasoning architectures are transforming enterprise automation and software design.");
                b3.setContent("Reasoning models have surpassed early zero-shot LLM benchmarks by introducing test-time computation and deep chain-of-thought verification. Enterprise platforms are rapidly integrating autonomous agents capable of end-to-end task resolution.");
                b3.setCoverImageUrl("https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1000");
                b3.setStatus(BlogStatus.PUBLISHED);
                b3.setViewsCount(3900);
                b3.setAuthor(author);
                b3.setCategory(tech);
                b3.setSubCategoryName("AI & ML");
                blogRepository.save(b3);
            }
        }
    }

    private void seedNews() {
        if (newsRepository.count() == 0) {
            News n1 = new News(null, "Global Tech Summit 2026 Commences Today", "global-tech-summit-2026-commences",
                    "Keynotes from industry leaders focus on sustainable computing and AI policy frameworks.",
                    "Industry titans, policymakers, and researchers assembled for the opening keynote of the Global Tech Summit. Key topics include eco-friendly data centers and international guidelines for safe AI deployment.",
                    "Technology", "AI & ML", "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000",
                    true, true, true, "KERYX Newsdesk", 1500, LocalDateTime.now());
            newsRepository.save(n1);
        }
    }

    private void seedEvents() {
        if (eventRepository.count() == 0) {
            Event e1 = new Event(null, "Inter-State Volleyball League Finals",
                    "Final championship clash between Top 4 regional teams.",
                    "Sports", "Volleyball", "2026-09-15", "18:00 IST", "National Sports Arena",
                    "https://keryx.dev/register/volleyball-finals", "UPCOMING", "Volleyball Association",
                    "https://images.unsplash.com/photo-1592656094267-764a45160876?w=1000");
            eventRepository.save(e1);
        }
    }
}
