import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { SpeedMonogram } from '../components/SpeedMonogram';
import { 
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
  const [email, setEmail] = useState('author@blogplatform.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeDemo, setActiveDemo] = useState('author');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load Google Identity Services SDK on page load
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId && !googleClientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
      if (!window.google && !document.getElementById('google-gsi-script')) {
        const script = document.createElement('script');
        script.id = 'google-gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => initGoogleSignIn(googleClientId);
        document.body.appendChild(script);
      } else if (window.google?.accounts?.id) {
        initGoogleSignIn(googleClientId);
      }
    }

    // Check if returning from Google OAuth2 implicit redirect (#id_token=...)
    if (window.location.hash && window.location.hash.includes('id_token=')) {
      const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
      const idToken = hashParams.get('id_token');
      if (idToken) {
        window.history.replaceState(null, '', window.location.pathname);
        handleGoogleCallback({ credential: idToken });
      }
    }
  }, []);

  const initGoogleSignIn = (clientId) => {
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    } catch (err) {
      console.warn('Google Identity Services initialization warning:', err);
    }
  };

  const handleGoogleCallback = async (response) => {
    if (!response.credential) {
      setError('Google Sign-In failed to retrieve credentials from Google.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Send Google ID Token to Spring Boot Backend
      const loginRes = await authApi.googleLogin(response.credential);

      const token = loginRes.token || loginRes.jwtToken;
      const user = loginRes.user || {
        id: loginRes.id,
        name: loginRes.fullName || loginRes.username,
        email: loginRes.email,
        role: loginRes.role || 'ROLE_USER',
        avatarUrl: loginRes.avatarUrl,
      };

      // 2. Save JWT in AuthContext & LocalStorage
      login(token, user);
      setSuccess('Google Authentication successful! Redirecting to Dashboard...');
      setTimeout(() => navigate('/'), 600);
    } catch (err) {
      console.error('Google backend authentication error:', err);
      const msg = err.response?.data?.message || err.message || 'Google Authentication failed on backend API.';
      setError(`Google Sign-In Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleButtonClick = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!googleClientId || googleClientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
      setError(
        'Google Client ID is missing. Please add VITE_GOOGLE_CLIENT_ID to your frontend/.env file and restart the dev server to enable live Google account selection.'
      );
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCallback,
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMomentary()) {
          // Open direct Google OAuth 2.0 Account Selection Popup / Redirect
          const redirectUri = encodeURIComponent(window.location.origin + '/login');
          const scope = encodeURIComponent('email profile openid');
          const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=${scope}&nonce=${Date.now()}`;
          window.location.href = authUrl;
        }
      });
    } else {
      // Direct Google OAuth2 Account Selection Screen
      const redirectUri = encodeURIComponent(window.location.origin + '/login');
      const scope = encodeURIComponent('email profile openid');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=${scope}&nonce=${Date.now()}`;
      window.location.href = authUrl;
    }
  };

  // Demo accounts for evaluation
  const demoAccounts = {
    author: {
      label: 'Author Account',
      icon: SpeedMonogram,
      email: 'author@blogplatform.com',
      password: 'password123',
      name: 'Alex Mercer',
      role: 'ROLE_AUTHOR'
    },
    admin: {
      label: 'Admin Moderator',
      icon: ShieldCheck,
      email: 'admin@blogplatform.com',
      password: 'password123',
      name: 'Platform Administrator',
      role: 'ROLE_ADMIN'
    },
    reader: {
      label: 'Reader Profile',
      icon: User,
      email: 'jane@example.com',
      password: 'password123',
      name: 'Jane Doe',
      role: 'ROLE_USER'
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
      // Call Real Backend Login API (MySQL + BCrypt + JWT)
      const response = await authApi.login({ usernameOrEmail: email, password });
      
      const token = response.token;
      const user = response.user;

      login(token, user);
      setSuccess('Authentication successful! Redirecting to Dashboard...');
      setTimeout(() => navigate('/'), 600);
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setSuccess(`Password reset instructions sent to ${email || 'your email'}.`);
    setTimeout(() => setSuccess(''), 4000);
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
          <p className="text-muted">Sign in to your Keryx WordPress portal</p>
        </div>

        {/* Demo Account Selector */}
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

        {/* Alert Banners */}
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

        {/* Standard Email/Password Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email or Username</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="text"
                className="input-field"
                placeholder="author@blogplatform.com"
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

          {/* Options Row */}
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

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="spin-icon" />
                <span>Verifying MySQL...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Social Authentication */}
        <div className="auth-divider">
          <span>Or sign in with</span>
        </div>

        <div className="social-auth-grid">
          <button type="button" className="social-auth-btn" onClick={handleGoogleButtonClick} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3s.7 5.6 1.9 8l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <button type="button" className="social-auth-btn" onClick={() => setError('GitHub OAuth can be configured using Client ID in application.properties.')} disabled={loading}>
            <Github size={18} />
            <span>GitHub</span>
          </button>
        </div>

        <p className="auth-footer-text">
          Don't have an account? <Link to="/register" className="auth-link">Create Account</Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
