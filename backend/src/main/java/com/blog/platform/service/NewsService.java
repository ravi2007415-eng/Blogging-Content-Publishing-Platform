package com.blog.platform.service;

import com.blog.platform.dto.NewsRequest;
import com.blog.platform.dto.NewsResponse;

import java.util.List;

public interface NewsService {
    List<NewsResponse> getAllNews(String category, String subCategory, String sort);
    List<NewsResponse> getLatestNews(int limit);
    List<NewsResponse> getBreakingNews();
    List<NewsResponse> getTrendingNews();
    List<NewsResponse> getTopStories();
    NewsResponse getNewsByIdOrSlug(String idOrSlug);
    NewsResponse createNews(NewsRequest request);
    NewsResponse updateNews(Long id, NewsRequest request);
    void deleteNews(Long id);
    List<NewsResponse> searchNews(String query);
}
