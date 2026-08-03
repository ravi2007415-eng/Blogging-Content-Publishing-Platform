import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Feather, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('alex@nexus.dev');
  const [password, setPassword] = useState('password123');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate authentication
    const fakeToken = 'nexus_jwt_token_sample_123';
    const fakeUser = {
      id: 1,
      name: 'Alex Rivera',
      email: email,
      role: 'ROLE_AUTHOR',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    };
    login(fakeToken, fakeUser);
    navigate('/');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="logo-icon">
            <Feather className="icon-feather" />
          </div>
          <h2>Welcome Back</h2>
          <p className="text-muted">Sign in to your Nexus author portal</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="input-field"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn">
            <span>Sign In</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/register" className="auth-link">Create Account</Link>
        </p>
      </div>
    </div>
  );
};
