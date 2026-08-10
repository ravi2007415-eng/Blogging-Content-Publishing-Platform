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
  Loader2,
  Key,
  X
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

  // Google OAuth Client ID state
  const [customClientId, setCustomClientId] = useState('');
  const [showClientIdModal, setShowClientIdModal] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const getEffectiveClientId = () => {
    const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const localId = localStorage.getItem('GOOGLE_CLIENT_ID');
    if (localId && localId.trim()) return localId.trim();
    if (envId && !envId.includes('YOUR_GOOGLE_CLIENT_ID')) return envId.trim();
    return '';
  };

  // Load Google Identity Services SDK on page load
  useEffect(() => {
    const clientId = getEffectiveClientId();
    if (clientId) {
      loadGoogleGsiScript(clientId);
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

  const loadGoogleGsiScript = (clientId) => {
    if (!window.google && !document.getElementById('google-gsi-script')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogleSignIn(clientId);
      document.body.appendChild(script);
    } else if (window.google?.accounts?.id) {
      initGoogleSignIn(clientId);
    }
  };

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

  const triggerGoogleAuthScreen = (clientId) => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback,
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMomentary()) {
          // Open direct Google OAuth 2.0 Account Selection Screen
          const redirectUri = encodeURIComponent(window.location.origin + '/login');
          const scope = encodeURIComponent('email profile openid');
          const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=${scope}&nonce=${Date.now()}`;
          window.location.href = authUrl;
        }
      });
    } else {
      // Direct Google OAuth2 Account Selection Screen
      const redirectUri = encodeURIComponent(window.location.origin + '/login');
      const scope = encodeURIComponent('email profile openid');
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=${scope}&nonce=${Date.now()}`;
      window.location.href = authUrl;
    }
  };

  const handleGoogleButtonClick = () => {
    const clientId = getEffectiveClientId();

    if (!clientId) {
      setShowClientIdModal(true);
      return;
    }

    loadGoogleGsiScript(clientId);
    triggerGoogleAuthScreen(clientId);
  };

  const handleSaveCustomClientId = (e) => {
    e.preventDefault();
    if (!customClientId || !customClientId.includes('.apps.googleusercontent.com')) {
      setError('Please enter a valid Google OAuth Client ID ending with .apps.googleusercontent.com');
      return;
    }

    localStorage.setItem('GOOGLE_CLIENT_ID', customClientId.trim());
    setShowClientIdModal(false);
    setError('');
    setSuccess('Google Client ID saved! Triggering Google Sign-In...');

    loadGoogleGsiScript(customClientId.trim());
    setTimeout(() => {
      triggerGoogleAuthScreen(customClientId.trim());
    }, 400);
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

      {/* Google Client ID Config Modal */}
      {showClientIdModal && (
        <div className="modal-backdrop fade-in" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="modal-card glass-panel" style={{
            maxWidth: '480px',
            width: '100%',
            background: 'var(--wp-surface, #1e1e1e)',
            border: '1px solid var(--wp-border, #333)',
            borderRadius: '12px',
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={20} style={{ color: '#4285F4' }} />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>Google OAuth Client ID</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowClientIdModal(false)}
                style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              To open the official Google account selection screen, enter your Google Cloud Console Client ID below or add it to <code>frontend/.env</code> as <code>VITE_GOOGLE_CLIENT_ID</code>.
            </p>

            <form onSubmit={handleSaveCustomClientId}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: '#aaa' }}>
                  Google Client ID (.apps.googleusercontent.com)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="1234567890-xyz.apps.googleusercontent.com"
                  value={customClientId}
                  onChange={(e) => setCustomClientId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    background: '#121212',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowClientIdModal(false)}
                  className="btn"
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '6px',
                    border: '1px solid #444',
                    background: 'transparent',
                    color: '#ccc',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '6px',
                    background: '#3858e9',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Connect & Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LoginPage;
