import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { CreateEditBlogPage } from './pages/CreateEditBlogPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ExplorePage } from './pages/ExplorePage';
import { ProfilePage } from './pages/ProfilePage';
import './App.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app-layout">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
          <Route path="/blog/:idOrSlug" element={<BlogDetailPage />} />
          <Route path="/write" element={<CreateEditBlogPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<ProfilePage />} />
          <Route path="/bookmarks" element={<ProfilePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
