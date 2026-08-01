package com.blog.platform;

import com.blog.platform.controller.BlogController;
import com.blog.platform.dto.BlogResponse;
import com.blog.platform.service.BlogService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BlogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BlogService blogService;

    @Test
    void getBlogById_ReturnsOk() throws Exception {
        BlogResponse blogResponse = new BlogResponse();
        blogResponse.setId(1L);
        blogResponse.setTitle("Test Title");

        Mockito.when(blogService.getBlogById(1L)).thenReturn(blogResponse);

        mockMvc.perform(get("/api/v1/blogs/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
