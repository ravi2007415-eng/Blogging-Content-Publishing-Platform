import React from 'react';
import { Link } from 'react-router-dom';
import { SpeedMonogram } from './SpeedMonogram';
import { 
  PenTool, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Eye, 
  Heart 
} from 'lucide-react';

export const AuthLeftBanner = () => {
  return (
    <div className="split-auth-left">
      <div className="split-left-content">
        {/* Top Logo */}
        <Link to="/" className="split-brand-header">
          <div className="split-logo-badge">
            <SpeedMonogram size={22} />
          </div>
          <span className="split-brand-name">KERYX</span>
        </Link>

        {/* Hero Section */}
        <div className="mb-6">
          <div className="split-badge-pill">
            <Sparkles size={12} />
            <span>DIGITAL PUBLISHING PLATFORM</span>
          </div>

          <h1 className="split-main-headline">
            Share your stories with the <span className="text-highlight-blue">world.</span>
          </h1>

          <p className="split-subtitle">
            Write. Publish. Inspire. Join a global community of engineers, creators, researchers, and thinkers.
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-4 mb-8">
          <div className="split-feature-item">
            <div className="feature-icon-wrapper">
              <PenTool size={16} />
            </div>
            <div className="feature-text-group">
              <h4>Create & Publish</h4>
              <p>Distraction-free Markdown & rich block editor with instant cloud deployment.</p>
            </div>
          </div>

          <div className="split-feature-item">
            <div className="feature-icon-wrapper">
              <Users size={16} />
            </div>
            <div className="feature-text-group">
              <h4>Engage Community</h4>
              <p>Connect directly with readers through real-time notifications and discussions.</p>
            </div>
          </div>

          <div className="split-feature-item">
            <div className="feature-icon-wrapper">
              <TrendingUp size={16} />
            </div>
            <div className="feature-text-group">
              <h4>Readership Analytics</h4>
              <p>Track article reads, views, and engagement metrics seamlessly.</p>
            </div>
          </div>
        </div>

        {/* Elegant Preview Card */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                alt="Elena Vance" 
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Elena Vance</span>
                <span className="text-[11px] text-slate-400">Staff Engineer • 5 min read</span>
              </div>
            </div>
            <span className="badge badge-primary text-[10px]">Trending</span>
          </div>

          <p className="text-xs font-semibold text-slate-800 line-clamp-2 mb-3 leading-snug">
            Architecting High-Throughput Event Streams in Modern Cloud Runtimes
          </p>

          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            <span className="text-blue-600 font-semibold">#CloudArchitecture</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><Eye size={12} /> 3.4k</span>
              <span className="flex items-center gap-1"><Heart size={12} className="text-rose-500" /> 482</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLeftBanner;
