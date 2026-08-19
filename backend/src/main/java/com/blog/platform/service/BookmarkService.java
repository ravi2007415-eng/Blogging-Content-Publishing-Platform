package com.blog.platform.service;

import com.blog.platform.dto.BlogResponse;
import java.util.List;

public interface BookmarkService {
    boolean toggleBookmark(Long blogId, String currentUsername);
    List<BlogResponse> getUserBookmarks(String currentUsername);
    boolean isBookmarkedByUser(Long blogId, String currentUsername);
}
