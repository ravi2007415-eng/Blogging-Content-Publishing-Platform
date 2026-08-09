package com.blog.platform.service.impl;

import com.blog.platform.dto.NewsRequest;
import com.blog.platform.dto.NewsResponse;
import com.blog.platform.exception.ResourceNotFoundException;
import com.blog.platform.model.entity.News;
import com.blog.platform.repository.NewsRepository;
import com.blog.platform.service.NewsService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsServiceImpl implements NewsService {

    private final NewsRepository newsRepository;

    public NewsServiceImpl(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    @Override
    public List<NewsResponse> getAllNews(String category, String subCategory, String sort) {
        List<News> newsList;
        if (category != null && subCategory != null) {
            newsList = newsRepository.findByCategoryNameIgnoreCaseAndSubCategoryNameIgnoreCaseOrderByPublishedAtDesc(category, subCategory);
        } else if (category != null) {
            newsList = newsRepository.findByCategoryNameIgnoreCaseOrderByPublishedAtDesc(category);
        } else {
            newsList = newsRepository.findAllByOrderByPublishedAtDesc();
        }

        if ("oldest".equalsIgnoreCase(sort)) {
            newsList.sort(Comparator.comparing(News::getPublishedAt));
        } else if ("popular".equalsIgnoreCase(sort)) {
            newsList.sort(Comparator.comparing(News::getViewsCount).reversed());
        }

        return newsList.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<NewsResponse> getLatestNews(int limit) {
        return newsRepository.findAllByOrderByPublishedAtDesc()
                .stream()
                .limit(limit > 0 ? limit : 10)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NewsResponse> getBreakingNews() {
        return newsRepository.findByIsBreakingTrueOrderByPublishedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NewsResponse> getTrendingNews() {
        return newsRepository.findByIsTrendingTrueOrderByPublishedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NewsResponse> getTopStories() {
        return newsRepository.findByIsTopStoryTrueOrderByPublishedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public NewsResponse getNewsByIdOrSlug(String idOrSlug) {
        News news;
        try {
            Long id = Long.parseLong(idOrSlug);
            news = newsRepository.findById(id)
                    .orElseGet(() -> newsRepository.findBySlug(idOrSlug)
                            .orElseThrow(() -> new ResourceNotFoundException("News article not found with identifier: " + idOrSlug)));
        } catch (NumberFormatException e) {
            news = newsRepository.findBySlug(idOrSlug)
                    .orElseThrow(() -> new ResourceNotFoundException("News article not found with slug: " + idOrSlug));
        }

        news.setViewsCount(news.getViewsCount() + 1);
        newsRepository.save(news);
        return mapToResponse(news);
    }

    @Override
    public NewsResponse createNews(NewsRequest request) {
        News news = new News();
        news.setTitle(request.getTitle());
        news.setSlug(request.getTitle().toLowerCase().replaceAll("[^a-z0-9\\s-]", "").replaceAll("\\s+", "-"));
        news.setSummary(request.getSummary());
        news.setContent(request.getContent());
        news.setCategoryName(request.getCategoryName());
        news.setSubCategoryName(request.getSubCategoryName());
        news.setImageUrl(request.getImageUrl());
        news.setIsBreaking(request.getIsBreaking() != null ? request.getIsBreaking() : false);
        news.setIsTrending(request.getIsTrending() != null ? request.getIsTrending() : false);
        news.setIsTopStory(request.getIsTopStory() != null ? request.getIsTopStory() : false);
        news.setAuthorName(request.getAuthorName() != null ? request.getAuthorName() : "Keryx Newsdesk");
        news.setViewsCount(0);
        news.setPublishedAt(LocalDateTime.now());

        News saved = newsRepository.save(news);
        return mapToResponse(saved);
    }

    @Override
    public NewsResponse updateNews(Long id, NewsRequest request) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));

        if (request.getTitle() != null) news.setTitle(request.getTitle());
        if (request.getSummary() != null) news.setSummary(request.getSummary());
        if (request.getContent() != null) news.setContent(request.getContent());
        if (request.getCategoryName() != null) news.setCategoryName(request.getCategoryName());
        if (request.getSubCategoryName() != null) news.setSubCategoryName(request.getSubCategoryName());
        if (request.getImageUrl() != null) news.setImageUrl(request.getImageUrl());
        if (request.getIsBreaking() != null) news.setIsBreaking(request.getIsBreaking());
        if (request.getIsTrending() != null) news.setIsTrending(request.getIsTrending());
        if (request.getIsTopStory() != null) news.setIsTopStory(request.getIsTopStory());

        News updated = newsRepository.save(news);
        return mapToResponse(updated);
    }

    @Override
    public void deleteNews(Long id) {
        if (!newsRepository.existsById(id)) {
            throw new ResourceNotFoundException("News article not found with ID: " + id);
        }
        newsRepository.deleteById(id);
    }

    @Override
    public List<NewsResponse> searchNews(String query) {
        return newsRepository.searchNews(query)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private NewsResponse mapToResponse(News news) {
        NewsResponse res = new NewsResponse();
        res.setId(news.getId());
        res.setTitle(news.getTitle());
        res.setSlug(news.getSlug());
        res.setSummary(news.getSummary());
        res.setContent(news.getContent());
        res.setCategoryName(news.getCategoryName());
        res.setSubCategoryName(news.getSubCategoryName());
        res.setImageUrl(news.getImageUrl());
        res.setIsBreaking(news.getIsBreaking());
        res.setIsTrending(news.getIsTrending());
        res.setIsTopStory(news.getIsTopStory());
        res.setAuthorName(news.getAuthorName());
        res.setViewsCount(news.getViewsCount());
        res.setPublishedAt(news.getPublishedAt());
        res.setCreatedAt(news.getCreatedAt());
        return res;
    }
}
