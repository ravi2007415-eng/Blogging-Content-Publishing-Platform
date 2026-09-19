import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SpeedMonogram } from './SpeedMonogram';

export const Footer = () => {
  return (
    <footer className="footer-panel">
      <div className="footer-container">
        {/* Column 1: Keryx Brand */}
        <div className="footer-brand">
          <Link to="/" className="blue-brand-logo">
            <div className="blue-logo-icon">
              <SpeedMonogram size={20} />
            </div>
            <span className="logo-text">Keryx<span className="logo-dot">.</span></span>
          </Link>
          <p className="footer-description">
            A state-of-the-art blogging & digital content publishing platform for modern developers, researchers, and tech leaders.
          </p>
        </div>

        {/* Links Grid: Platform, Community, Stack */}
        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/">Latest Articles</Link>
            <Link to="/explore">Explore Categories</Link>
            <Link to="/news">Breaking News</Link>
            <Link to="/events">Events Hub</Link>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <Link to="/write">Write a Story</Link>
            <Link to="/register">Join Platform</Link>
            <Link to="/bookmarks">Saved Articles</Link>
          </div>
          <div className="footer-col">
            <h4>Stack</h4>
            <a href="https://spring.io" target="_blank" rel="noopener noreferrer">Spring Boot 3</a>
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer">React 18 & Vite</a>
            <a href="https://www.postgresql.org" target="_blank" rel="noopener noreferrer">PostgreSQL & Redis</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Keryx Publishing Inc. Built with <Heart size={14} className="heart-icon" /> for high performance digital publishing.</p>
      </div>
    </footer>
  );
};

export default Footer;
