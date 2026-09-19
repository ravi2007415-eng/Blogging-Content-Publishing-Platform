import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { AuthLeftBanner } from '../components/AuthLeftBanner';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Loader2,
  User,
  ShieldCheck
} from 'lucide-react';

export const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeDemo, setActiveDemo] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location.state]);

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
    if (!usernameOrEmail.trim() || !password) {
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
      const errMsg = err.response?.data?.message || err.response?.data?.error || 'Invalid username/email or password.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-auth-wrapper">
      <div className="split-auth-container">
        
        {/* LEFT COLUMN: Clean Branding Banner */}
        <AuthLeftBanner />

        {/* RIGHT COLUMN: Clean Auth Panel */}
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
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="split-alert split-alert-success">
                <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{success}</span>
              </div>
            )}

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
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
                    disabled={loading}
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
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="split-toggle-eye"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-600 cursor-pointer select-none">
                  Keep me signed in
                </label>
              </div>

              {/* Primary Submit Button */}
              <button 
                type="submit" 
                className="split-btn-primary" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="spin-icon" />
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
                <Sparkles size={13} className="text-blue-600" />
                <span>Default Test Accounts</span>
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
                      <IconComp size={11} style={{ display: 'inline', marginRight: 4 }} />
                      <span>{acc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legal Footer */}
            <div className="text-center text-xs text-slate-400 mt-6">
              By logging in, you agree to our <Link to="/" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
