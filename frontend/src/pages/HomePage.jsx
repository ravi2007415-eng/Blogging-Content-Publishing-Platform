import React, { useState, useEffect } from 'react';
import { MOCK_BLOGS } from '../mockData';
import { INITIAL_CATEGORIES } from '../utils/constants';
import { BlogCard } from '../components/BlogCard';
import { Sparkles, TrendingUp, Filter, SearchX } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const HomePage = ({ searchQuery }) => {
  const [blogs, setBlogs] = useState(MOCK_BLOGS);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || searchQuery || '';

  // Filter blogs based on search query or selected category
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = selectedCategory
      ? blog.category?.slug === selectedCategory
      : true;

    const matchesSearch = urlQuery.trim()
      ? blog.title.toLowerCase().includes(urlQuery.toLowerCase()) ||
        blog.summary.toLowerCase().includes(urlQuery.toLowerCase()) ||
        blog.tags?.some(t => (t.name || t).toLowerCase().includes(urlQuery.toLowerCase()))
      : true;

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section glass-panel">
        <div className="hero-badge badge badge-cyan">
          <Sparkles size={14} />
          <span>The Modern Developer's Publishing Hub</span>
        </div>
        <h1 className="hero-title">
          Architecting Ideas Into <span className="gradient-text">Impactful Insights</span>
        </h1>
        <p className="hero-subtitle">
          Discover high-performance software engineering articles, distributed system deep-dives, artificial intelligence benchmarks, and UI technologist patterns.
        </p>

        {/* Category Pill Filters */}
        <div className="category-pills-row">
          <button
            className={`pill-btn ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Topics
          </button>
          {INITIAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`pill-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Main Feed Section */}
      <section className="feed-section">
        <div className="feed-header">
          <div className="feed-title-wrap">
            <TrendingUp className="accent-icon" size={22} />
            <h2>{urlQuery ? `Search Results for "${urlQuery}"` : 'Featured Engineering Posts'}</h2>
          </div>
          <span className="feed-count">{filteredBlogs.length} Articles</span>
        </div>

        {filteredBlogs.length > 0 ? (
          <div className="blogs-grid">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="empty-state glass-card">
            <SearchX size={48} className="empty-icon" />
            <h3>No matching articles found</h3>
            <p>Try adjusting your search criteria or explore other categories.</p>
            <button className="btn btn-secondary" onClick={() => setSelectedCategory(null)}>
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
