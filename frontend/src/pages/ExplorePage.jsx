import React, { useState } from 'react';
import { INITIAL_CATEGORIES } from '../utils/constants';
import { MOCK_BLOGS } from '../mockData';
import { BlogCard } from '../components/BlogCard';
import { Layers, Hash, BookOpen } from 'lucide-react';

export const ExplorePage = () => {
  const [activeCategory, setActiveCategory] = useState(INITIAL_CATEGORIES[0].slug);

  const activeCatObj = INITIAL_CATEGORIES.find((c) => c.slug === activeCategory) || INITIAL_CATEGORIES[0];
  const categoryBlogs = MOCK_BLOGS.filter(
    (b) => b.category?.slug === activeCategory
  );

  return (
    <div className="explore-page-container">
      <div className="explore-header glass-panel">
        <div className="badge badge-primary">
          <Layers size={14} />
          <span>Topic Directory</span>
        </div>
        <h2>Explore Knowledge Domains</h2>
        <p className="text-muted">Browse top technology streams, curated articles, and engineering insights.</p>

        {/* Grid of Category cards */}
        <div className="categories-card-grid">
          {INITIAL_CATEGORIES.map((cat) => {
            const count = MOCK_BLOGS.filter((b) => b.category?.slug === cat.slug).length;
            const isActive = activeCategory === cat.slug;
            return (
              <div
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`category-select-card glass-card ${isActive ? 'active' : ''}`}
              >
                <div className="cat-card-header">
                  <h4>{cat.name}</h4>
                  <span className="badge badge-cyan">{count} Posts</span>
                </div>
                <p className="cat-card-desc">{cat.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Category Articles */}
      <section className="feed-section">
        <div className="feed-header">
          <div className="feed-title-wrap">
            <BookOpen className="accent-icon" size={22} />
            <h3>Articles in {activeCatObj.name}</h3>
          </div>
        </div>

        <div className="blogs-grid">
          {categoryBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>
    </div>
  );
};
