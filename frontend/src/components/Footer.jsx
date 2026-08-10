import React from 'react';
import { Heart, Globe, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="wp-footer">
      <div className="wp-footer-container">
        {/* Left Column: WordPress Branding */}
        <div className="wp-footer-brand">
          <Link to="/" className="brand-logo wp-brand">
            <div className="wp-logo-icon">
              <span className="wp-mark">W</span>
            </div>
            <div className="wp-logo-text">
              <span className="wp-main-name">WordPress</span>
              <span className="wp-sub-name">.com</span>
            </div>
          </Link>
          <p className="wp-footer-desc">
            WordPress powers over 43% of the web. From personal blogs to enterprise news outlets, create and grow your site with built-in speed, security, and freedom.
          </p>
          <div className="wp-footer-badge-pill">
            <Globe size={14} />
            <span>English (US)</span>
          </div>
        </div>

        {/* Right Columns: Category Links */}
        <div className="wp-footer-columns">
          <div className="wp-footer-col">
            <h4>Products</h4>
            <Link to="/">WordPress Reader</Link>
            <Link to="/explore">Block Editor</Link>
            <Link to="/explore">Themes & Templates</Link>
            <Link to="/events">Tech Events</Link>
          </div>
          <div className="wp-footer-col">
            <h4>Resources</h4>
            <Link to="/news">News Desk</Link>
            <Link to="/explore">Topic Taxonomy</Link>
            <Link to="/write">Start Writing</Link>
            <Link to="/register">Create Account</Link>
          </div>
          <div className="wp-footer-col">
            <h4>Technology</h4>
            <a href="https://spring.io" target="_blank" rel="noreferrer">
              Spring Boot 3 <ArrowUpRight size={12} />
            </a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">
              React 18 & Vite <ArrowUpRight size={12} />
            </a>
            <a href="https://h2database.com" target="_blank" rel="noreferrer">
              H2 & JPA Storage <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>

      <div className="wp-footer-bottom">
        <div className="wp-footer-copyright">
          <span className="wp-footer-bold">Powered by WordPress.com</span> • &copy; {new Date().getFullYear()} Keryx Publishing Engine. All rights reserved.
        </div>
        <div className="wp-footer-bottom-links">
          <Link to="/explore">Privacy</Link>
          <Link to="/explore">Terms of Service</Link>
          <Link to="/explore">Security</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
