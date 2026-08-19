package com.blog.platform.model.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "blog_tags")
@IdClass(BlogTag.BlogTagId.class)
public class BlogTag {

    @Id
    @Column(name = "blog_id")
    private Long blogId;

    @Id
    @Column(name = "tag_id")
    private Long tagId;

    public BlogTag() {}

    public BlogTag(Long blogId, Long tagId) {
        this.blogId = blogId;
        this.tagId = tagId;
    }

    public Long getBlogId() { return blogId; }
    public void setBlogId(Long blogId) { this.blogId = blogId; }

    public Long getTagId() { return tagId; }
    public void setTagId(Long tagId) { this.tagId = tagId; }

    public static class BlogTagId implements Serializable {
        private Long blogId;
        private Long tagId;

        public BlogTagId() {}
        public BlogTagId(Long blogId, Long tagId) {
            this.blogId = blogId;
            this.tagId = tagId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            BlogTagId blogTagId = (BlogTagId) o;
            return Objects.equals(blogId, blogTagId.blogId) && Objects.equals(tagId, blogTagId.tagId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(blogId, tagId);
        }
    }
}
