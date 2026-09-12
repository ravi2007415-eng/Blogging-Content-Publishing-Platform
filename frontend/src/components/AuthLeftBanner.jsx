import React from 'react';
import { Link } from 'react-router-dom';
import { SpeedMonogram } from './SpeedMonogram';
import { 
  PenTool, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Eye, 
  Heart, 
  Bookmark,
  CheckCircle2
} from 'lucide-react';

export const AuthLeftBanner = () => {
  return (
    <div className="split-auth-left">
      {/* Ambient background glow effects */}
      <div className="auth-ambient-glow auth-glow-1"></div>
      <div className="auth-ambient-glow auth-glow-2"></div>

      <div className="split-left-content">
        {/* Top Logo */}
        <Link to="/" className="split-brand-header">
          <div className="speed-logo-wrapper split-logo-badge">
            <SpeedMonogram size={26} />
          </div>
          <span className="split-brand-name">KERYX</span>
        </Link>

        {/* Hero Section */}
        <div className="split-hero-section">
          <div className="split-badge-pill">
            <Sparkles size={13} className="pill-sparkle" />
            <span>A BLOGGING PLATFORM FOR EVERYONE</span>
          </div>

          <h1 className="split-main-headline">
            Share your stories with the <span className="text-highlight-blue">world.</span>
          </h1>

          <p className="split-subtitle">
            Write. Publish. Inspire. Join a global community of creators, engineers, readers, and thinkers.
          </p>
        </div>

        {/* Feature List */}
        <div className="split-features-list">
          <div className="split-feature-item">
            <div className="feature-icon-wrapper">
              <PenTool size={18} />
            </div>
            <div className="feature-text-group">
              <h4>Create & Publish</h4>
              <p>Distraction-free Markdown & rich block editor with instant cloud deployment.</p>
            </div>
          </div>

          <div className="split-feature-item">
            <div className="feature-icon-wrapper">
              <Users size={18} />
            </div>
            <div className="feature-text-group">
              <h4>Join a Community</h4>
              <p>Engage in meaningful discussions, leave thoughts, and collaborate with peers.</p>
            </div>
          </div>

          <div className="split-feature-item">
            <div className="feature-icon-wrapper">
              <TrendingUp size={18} />
            </div>
            <div className="feature-text-group">
              <h4>Grow Your Audience</h4>
              <p>Built-in SEO tools, newsletter distribution, and real-time readership analytics.</p>
            </div>
          </div>
        </div>

        {/* Elegant Preview Card at the bottom */}
        <div className="split-bottom-preview-card">
          <div className="preview-card-header">
            <div className="preview-author-avatar">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                alt="Elena Vance" 
              />
            </div>
            <div className="preview-author-meta">
              <h5>Elena Vance</h5>
              <span>Staff Engineer • 5 min read</span>
            </div>
            <div className="preview-live-pill">
              <span className="live-dot"></span>
              <span>Trending</span>
            </div>
          </div>

          <p className="preview-article-title">
            Architecting High-Throughput Event Streams in Modern Cloud Runtimes
          </p>

          <div className="preview-card-footer">
            <div className="preview-tags">
              <span className="preview-tag">#DistributedSystems</span>
              <span className="preview-tag">#Architecture</span>
            </div>
            <div className="preview-metrics">
              <span><Eye size={13} /> 3.4k</span>
              <span><Heart size={13} /> 482</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
