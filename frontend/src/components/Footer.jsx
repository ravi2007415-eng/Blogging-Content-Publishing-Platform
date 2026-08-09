import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SpeedMonogram } from './SpeedMonogram';

export const Footer = () => {
  return (
    <footer className="footer-panel glass-panel">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="brand-logo">
            <div className="logo-icon speed-logo-wrapper">
              <SpeedMonogram size={28} />
            </div>
            <span className="logo-text">Keryx<span className="logo-dot">.</span></span>
          </div>
          <p className="footer-description">
            A state-of-the-art blogging & content publishing platform for modern developers, researchers, and tech leaders.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/">Latest Articles</Link>
            <Link to="/explore">Explore Categories</Link>
            <Link to="/explore">Featured Tech</Link>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <Link to="/write">Write a Story</Link>
            <Link to="/register">Join Platform</Link>
            <Link to="/bookmarks">Saved Articles</Link>
          </div>
          <div className="footer-col">
            <h4>Stack</h4>
            <a href="https://spring.io" target="_blank" rel="noreferrer">Spring Boot 3</a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">React 18 & Vite</a>
            <a href="https://postgre.org" target="_blank" rel="noreferrer">PostgreSQL & Redis</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Keryx Publishing Inc. Built with <Heart size={14} className="heart-icon" /> for high performance engineering.</p>
      </div>
    </footer>
  );
};
