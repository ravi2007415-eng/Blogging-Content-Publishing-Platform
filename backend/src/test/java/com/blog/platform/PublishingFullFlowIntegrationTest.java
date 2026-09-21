package com.blog.platform;

import com.blog.platform.dto.BlogRequest;
import com.blog.platform.dto.BlogResponse;
import com.blog.platform.dto.LoginRequest;
import com.blog.platform.dto.LoginResponse;
import com.blog.platform.dto.RegisterRequest;
import com.blog.platform.model.entity.Blog;
import com.blog.platform.model.entity.Category;
import com.blog.platform.model.enums.BlogStatus;
import com.blog.platform.repository.BlogRepository;
import com.blog.platform.repository.CategoryRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PublishingFullFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @MockBean
    private JavaMailSender mailSender;

    private String getAuthToken(String username, String password) throws Exception {
        LoginRequest loginRequest = new LoginRequest(username, password);
        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();
        LoginResponse response = objectMapper.readValue(result.getResponse().getContentAsString(), LoginResponse.class);
        return response.getToken();
    }

    @Test
    @DisplayName("TEST 1: User publishes article -> 201 Created -> Persisted in Database -> Retrieved via /my-blogs and /slug")
    void test1_PublishArticleEndToEndPersistence() throws Exception {
        // 1. Authenticate with seeded author
        String token = getAuthToken("tech_guru", "password123");

        // 2. Fetch category from DB
        Category category = categoryRepository.findBySlug("technology")
                .orElseGet(() -> categoryRepository.findAll().get(0));

        // 3. Build publish request with all required fields
        BlogRequest blogRequest = new BlogRequest();
        String uniqueTitle = "Building Scalable Architecture in 2026 - " + System.currentTimeMillis();
        blogRequest.setTitle(uniqueTitle);
        blogRequest.setSummary("A comprehensive analysis of distributed systems and microservices resiliency patterns.");
        blogRequest.setContent("### Modern Backend Architecture\n\nDesigning resilient distributed systems requires careful planning around event-driven messaging, transaction isolation, and container orchestration.");
        blogRequest.setCoverImageUrl("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80");
        blogRequest.setCategoryId(category.getId());
        blogRequest.setSubCategoryName("Cybersecurity");
        blogRequest.setStatus(BlogStatus.PUBLISHED);
        blogRequest.setTagNames(Set.of("Architecture", "Cloud"));

        // 4. Send POST /api/v1/blogs
        MvcResult publishResult = mockMvc.perform(post("/api/v1/blogs")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(blogRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.title").value(uniqueTitle))
                .andExpect(jsonPath("$.slug").isNotEmpty())
                .andExpect(jsonPath("$.subCategoryName").value("Cybersecurity"))
                .andExpect(jsonPath("$.status").value("PUBLISHED"))
                .andExpect(jsonPath("$.author.username").value("tech_guru"))
                .andExpect(jsonPath("$.category.id").value(category.getId()))
                .andReturn();

        BlogResponse publishedBlog = objectMapper.readValue(publishResult.getResponse().getContentAsString(), BlogResponse.class);
        assertNotNull(publishedBlog.getId());

        // 5. Verify database persistence via repository
        Optional<Blog> dbBlogOpt = blogRepository.findById(publishedBlog.getId());
        assertTrue(dbBlogOpt.isPresent(), "Blog must be persisted in the database");
        Blog dbBlog = dbBlogOpt.get();
        assertEquals(uniqueTitle, dbBlog.getTitle());
        assertEquals("Cybersecurity", dbBlog.getSubCategoryName());
        assertEquals(BlogStatus.PUBLISHED, dbBlog.getStatus());
        assertEquals("tech_guru", dbBlog.getAuthor().getUsername());
        assertEquals(category.getId(), dbBlog.getCategory().getId());

        // 6. Verify GET /api/v1/blogs/my-blogs returns the persisted blog
        mockMvc.perform(get("/api/v1/blogs/my-blogs")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + publishedBlog.getId() + ")].title").value(uniqueTitle))
                .andExpect(jsonPath("$[?(@.id == " + publishedBlog.getId() + ")].subCategoryName").value("Cybersecurity"));

        // 7. Verify GET /api/v1/blogs/slug/{slug} returns the persisted blog
        mockMvc.perform(get("/api/v1/blogs/slug/" + publishedBlog.getSlug())
                .header(HttpHeaders.ORIGIN, "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(uniqueTitle))
                .andExpect(jsonPath("$.subCategoryName").value("Cybersecurity"));
    }

    @Test
    @DisplayName("TEST 2: Registered user (ROLE_USER) can publish articles seamlessly")
    void test2_RegisteredRoleUserCanPublish() throws Exception {
        String uniqueUser = "publisher_" + System.currentTimeMillis();
        String uniqueEmail = uniqueUser + "@example.com";

        // Register new user (defaults to ROLE_USER)
        RegisterRequest regReq = new RegisterRequest(uniqueUser, uniqueEmail, "Password123!", "Content Creator");
        mockMvc.perform(post("/api/v1/auth/register")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isCreated());

        String token = getAuthToken(uniqueUser, "Password123!");

        // Publish article
        BlogRequest blogRequest = new BlogRequest();
        String title = "User Publishing Test - " + System.currentTimeMillis();
        blogRequest.setTitle(title);
        blogRequest.setContent("Article content published by standard platform user.");
        blogRequest.setCategorySlug("web-development");
        blogRequest.setSubCategoryName("React Ecosystem");

        mockMvc.perform(post("/api/v1/blogs")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(blogRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value(title))
                .andExpect(jsonPath("$.author.username").value(uniqueUser));
    }

    @Test
    @DisplayName("TEST 3: Unauthenticated publish request is rejected with 401")
    void test3_UnauthenticatedPublishRejected() throws Exception {
        BlogRequest blogRequest = new BlogRequest();
        blogRequest.setTitle("Unauthorized Article");
        blogRequest.setContent("Should fail");

        mockMvc.perform(post("/api/v1/blogs")
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(blogRequest)))
                .andExpect(status().isUnauthorized());
    }
}
