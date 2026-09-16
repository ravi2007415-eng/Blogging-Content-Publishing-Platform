import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { AuthLeftBanner } from '../components/AuthLeftBanner';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Github, 
  Loader2,
  User,
  ShieldCheck,
  Send
} from 'lucide-react';

export const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('author@blogplatform.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeDemo, setActiveDemo] = useState('author');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Preset demo accounts initialized in the database
  const demoAccounts = {
    author: {
      label: 'Author',
      icon: User,
      usernameOrEmail: 'author@blogplatform.com',
      password: 'password123',
    },
    admin: {
      label: 'Admin',
      icon: ShieldCheck,
      usernameOrEmail: 'admin@blogplatform.com',
      password: 'password123',
    },
    reader: {
      label: 'Reader',
      icon: Sparkles,
      usernameOrEmail: 'jane@example.com',
      password: 'password123',
    }
  };

  const handleDemoSelect = (accountKey) => {
    setActiveDemo(accountKey);
    const acc = demoAccounts[accountKey];
    if (acc) {
      setUsernameOrEmail(acc.usernameOrEmail);
      setPassword(acc.password);
      setError('');
      setSuccess(`Filled credentials for ${acc.label}. Click "Log in" to authenticate.`);
      setTimeout(() => setSuccess(''), 2500);
    }
  };

  // Standard username/email + password login through backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authApi.login({
        usernameOrEmail: usernameOrEmail.trim(),
        password: password
      });

      if (!response || !response.token) {
        throw new Error('Authentication failed: no token returned.');
      }

      login(response.token, response.user);
      setSuccess('Authentication successful! Welcome back.');
      setTimeout(() => navigate('/'), 400);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Invalid credentials. Please verify your email/username and password.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth 2.0 / OpenID Connect authentication
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    setSuccess('');

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      setError('Google Sign-In requires VITE_GOOGLE_CLIENT_ID to be configured in your environment variables (.env).');
      setGoogleLoading(false);
      return;
    }

    if (window.google) {
      try {
        /* global google */
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            try {
              if (response.credential) {
                const apiRes = await authApi.loginWithGoogle(response.credential);
                login(apiRes.token, apiRes.user);
                setSuccess('Signed in with Google successfully!');
                setTimeout(() => navigate('/'), 400);
              } else {
                setError('Google did not return an ID token.');
              }
            } catch (err) {
              const errMsg = err.response?.data?.message || err.response?.data?.error || 'Google authentication failed on server.';
              setError(errMsg);
            } finally {
              setGoogleLoading(false);
            }
          }
        });
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setGoogleLoading(false);
          }
        });
      } catch (err) {
        setError('Failed to initialize Google Sign-In SDK.');
        setGoogleLoading(false);
      }
    } else {
      setError('Google Sign-In SDK is still loading. Please try again in a moment.');
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setSuccess(`Password recovery instructions have been dispatched to ${usernameOrEmail || 'your email'}.`);
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="split-auth-wrapper">
      <div className="split-auth-container">
        
        {/* LEFT COLUMN: Dark Navy Gradient Banner */}
        <AuthLeftBanner />

        {/* RIGHT COLUMN: Clean White Auth Panel */}
        <div className="split-auth-right">
          
          {/* Top Switch Link */}
          <div className="split-right-top-link">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>

          <div className="split-right-inner">
            
            {/* Header */}
            <h2 className="split-right-heading">Log in to Keryx</h2>
            <p className="split-right-subtitle">Welcome back. Continue to your account.</p>

            {/* Notification Alerts */}
            {error && (
              <div className="split-alert split-alert-danger">
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="split-alert split-alert-success">
                <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{success}</span>
              </div>
            )}

            {/* Social Logins Stack */}
            <div className="social-auth-vertical">
              {/* 1. Google OAuth Button */}
              <button 
                type="button" 
                className="social-btn-row" 
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
              >
                {googleLoading ? (
                  <Loader2 size={18} className="spin-icon" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" className="social-btn-icon">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              {/* 2. GitHub OAuth Button */}
              <button 
                type="button" 
                className="social-btn-row" 
                onClick={() => setError('GitHub OAuth integration can be enabled by configuring GitHub Client credentials.')}
                disabled={loading || googleLoading}
              >
                <Github size={18} className="social-btn-icon" />
                <span>Continue with GitHub</span>
              </button>
            </div>

            {/* OR Divider */}
            <div className="social-divider-or">OR</div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit}>
              
              {/* Email / Username Input */}
              <div className="split-form-group">
                <label className="split-form-label">Email address or username</label>
                <div className="split-input-wrapper">
                  <input
                    type="text"
                    className="split-input"
                    placeholder="name@company.com or username"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    required
                    disabled={loading || googleLoading}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="split-form-group">
                <label className="split-form-label">Password</label>
                <div className="split-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="split-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || googleLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="split-toggle-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="split-form-options">
                <label className="split-checkbox-label">
                  <input
                    type="checkbox"
                    className="split-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Keep me signed in</span>
                </label>

                <button 
                  type="button" 
                  className="split-forgot-link" 
                  onClick={handleForgotPassword}
                >
                  Forgot your password?
                </button>
              </div>

              {/* Primary Submit Button */}
              <button 
                type="submit" 
                className="split-btn-primary" 
                disabled={loading || googleLoading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="spin-icon" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Log in</span>
                )}
              </button>
            </form>

            {/* Quick Demo Selector for Instant Verification */}
            <div className="split-demo-box">
              <div className="split-demo-header">
                <Sparkles size={13} style={{ color: '#2563eb' }} />
                <span>Default Accounts</span>
              </div>
              <div className="split-demo-pills">
                {Object.keys(demoAccounts).map((key) => {
                  const acc = demoAccounts[key];
                  const IconComp = acc.icon;
                  const isActive = activeDemo === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`split-demo-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleDemoSelect(key)}
                    >
                      <IconComp size={12} style={{ display: 'inline', marginRight: 4 }} />
                      <span>{acc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legal Footer */}
            <div className="split-legal-footer">
              By logging in, you agree to our <Link to="/">Terms of Service</Link> and <Link to="/">Privacy Policy</Link>.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
