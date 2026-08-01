package com.blog.platform;

import com.blog.platform.dto.BlogResponse;
import com.blog.platform.exception.ResourceNotFoundException;
import com.blog.platform.model.entity.Blog;
import com.blog.platform.model.entity.Category;
import com.blog.platform.model.entity.User;
import com.blog.platform.repository.*;
import com.blog.platform.service.impl.BlogServiceImpl;
import com.blog.platform.util.ValidationUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

class BlogServiceTest {

    @Mock private BlogRepository blogRepository;
    @Mock private UserRepository userRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private TagRepository tagRepository;
    @Mock private LikeRepository likeRepository;
    @Mock private CommentRepository commentRepository;
    @Mock private ValidationUtil validationUtil;

    @InjectMocks
    private BlogServiceImpl blogService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getBlogById_Success() {
        Blog blog = new Blog();
        blog.setId(1L);
        blog.setTitle("Test Title");
        blog.setViewsCount(5);
        User author = new User();
        author.setId(1L);
        blog.setAuthor(author);
        Category category = new Category();
        category.setId(1L);
        blog.setCategory(category);

        Mockito.when(blogRepository.findById(1L)).thenReturn(Optional.of(blog));
        Mockito.when(blogRepository.save(Mockito.any(Blog.class))).thenReturn(blog);

        BlogResponse result = blogService.getBlogById(1L);
        Assertions.assertNotNull(result);
        Assertions.assertEquals("Test Title", result.getTitle());
    }

    @Test
    void getBlogById_NotFound() {
        Mockito.when(blogRepository.findById(99L)).thenReturn(Optional.empty());
        Assertions.assertThrows(ResourceNotFoundException.class, () -> blogService.getBlogById(99L));
    }
}
