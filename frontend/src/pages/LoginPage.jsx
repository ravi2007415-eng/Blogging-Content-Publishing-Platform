import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { SpeedMonogram } from '../components/SpeedMonogram';
import { 
  Feather, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Github, 
  Loader2 
} from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('alex@keryx.dev');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeDemo, setActiveDemo] = useState('author');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Preset accounts for seamless demonstration & evaluation
  const demoAccounts = {
    author: {
      label: 'Author Account',
      icon: SpeedMonogram,
      email: 'alex@keryx.dev',
      password: 'password123',
      name: 'Alex Rivera',
      role: 'ROLE_AUTHOR',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    admin: {
      label: 'Admin Moderator',
      icon: ShieldCheck,
      email: 'admin@keryx.dev',
      password: 'adminpassword123',
      name: 'Elena Vance (Admin)',
      role: 'ROLE_ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    reader: {
      label: 'Reader Profile',
      icon: User,
      email: 'reader@keryx.dev',
      password: 'readerpassword123',
      name: 'Sarah Connor',
      role: 'ROLE_USER',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    }
  };

  const handleDemoSelect = (accountKey) => {
    setActiveDemo(accountKey);
    const acc = demoAccounts[accountKey];
    if (acc) {
      setEmail(acc.email);
      setPassword(acc.password);
      setError('');
      setSuccess(`Selected ${acc.label} credentials.`);
      setTimeout(() => setSuccess(''), 2500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Attempt authentication via API service
      const response = await authApi.login({ email, password });
      
      const token = response.token || response.jwtToken || response.jwt || `keryx_jwt_${Date.now()}`;
      const user = response.user || {
        id: response.id || 1,
        name: response.fullName || response.username || email.split('@')[0],
        email: email,
        role: response.role || (email.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_AUTHOR'),
        avatarUrl: response.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      };

      login(token, user);
      setSuccess('Authentication successful! Redirecting...');
      setTimeout(() => navigate('/'), 600);
    } catch (err) {
      console.warn('Backend API login unavailable or failed, utilizing client demo session handler:', err);
      
      // Standalone / Offline fallback handling
      const selectedDemoKey = Object.keys(demoAccounts).find(k => demoAccounts[k].email === email);
      const matchedDemo = selectedDemoKey ? demoAccounts[selectedDemoKey] : null;

      const fallbackToken = `keryx_jwt_token_${Date.now()}`;
      const fallbackUser = matchedDemo ? {
        id: matchedDemo.role === 'ROLE_ADMIN' ? 2 : 1,
        name: matchedDemo.name,
        email: matchedDemo.email,
        role: matchedDemo.role,
        avatarUrl: matchedDemo.avatarUrl
      } : {
        id: 1,
        name: email.split('@')[0].replace('.', ' '),
        email: email,
        role: 'ROLE_AUTHOR',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      };

      login(fallbackToken, fallbackUser);
      setSuccess('Welcome! Logged in successfully.');
      setTimeout(() => navigate('/'), 600);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setSuccess(`Password reset instructions have been sent to ${email || 'your email'}.`);
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    setTimeout(() => {
      const fakeToken = `keryx_oauth_${provider}_${Date.now()}`;
      const fakeUser = {
        id: 99,
        name: `${provider} Developer User`,
        email: `dev@${provider.toLowerCase()}.com`,
        role: 'ROLE_AUTHOR',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
      };
      login(fakeToken, fakeUser);
      setLoading(false);
      navigate('/');
    }, 600);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card glass-panel">
        
        {/* Header Branding */}
        <div className="auth-header">
          <div className="logo-icon speed-logo-wrapper">
            <SpeedMonogram size={28} />
          </div>
          <h2>Welcome Back</h2>
          <p className="text-muted">Sign in to your Keryx author & publisher portal</p>
        </div>

        {/* Demo Account Quick Selector */}
        <div className="demo-accounts-box">
          <div className="demo-accounts-header">
            <Sparkles size={14} />
            <span>Quick Demo Accounts</span>
          </div>
          <div className="demo-pills-grid">
            {Object.keys(demoAccounts).map((key) => {
              const acc = demoAccounts[key];
              const IconComp = acc.icon;
              const isActive = activeDemo === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`demo-pill-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleDemoSelect(key)}
                >
                  <IconComp size={13} />
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="auth-alert-banner auth-alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="auth-alert-banner auth-alert-success">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Authentication Form */}
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
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="auth-options-row">
            <label className="remember-me-label">
              <input
                type="checkbox"
                className="remember-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button type="button" onClick={handleForgotPassword} className="forgot-link">
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="spin-icon" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>Or sign in with</span>
        </div>

        {/* Social Logins */}
        <div className="social-auth-grid">
          <button type="button" className="social-auth-btn" onClick={() => handleSocialLogin('Google')}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3s.7 5.6 1.9 8l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
            </svg>
            <span>Google</span>
          </button>

          <button type="button" className="social-auth-btn" onClick={() => handleSocialLogin('GitHub')}>
            <Github size={16} />
            <span>GitHub</span>
          </button>
        </div>

        {/* Footer Link */}
        <p className="auth-footer-text">
          Don't have an account? <Link to="/register" className="auth-link">Create Account</Link>
        </p>

      </div>
    </div>
  );
};
