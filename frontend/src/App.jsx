import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { WpAdminBar } from './components/WpAdminBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastNotification } from './components/ToastNotification';
import { HomePage } from './pages/HomePage';
import { CategorySubDashboardPage } from './pages/CategorySubDashboardPage';
import { EventsPage } from './pages/EventsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthorDashboardPage } from './pages/AuthorDashboardPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ExplorePage } from './pages/ExplorePage';
import { ProfilePage } from './pages/ProfilePage';
import './App.css';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="app-layout">
      <WpAdminBar />
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ToastNotification />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:idOrSlug" element={<NewsDetailPage />} />
          <Route path="/category/:categorySlug" element={<CategorySubDashboardPage />} />
          <Route path="/category/:categorySlug/:subCategorySlug" element={<CategorySubDashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/dashboard" element={<AuthorDashboardPage />} />
          <Route path="/author" element={<AuthorDashboardPage />} />
          <Route path="/write" element={<AuthorDashboardPage />} />
          <Route path="/user" element={<UserDashboardPage />} />
          <Route path="/blog/:idOrSlug" element={<BlogDetailPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bookmarks" element={<UserDashboardPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
