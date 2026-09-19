import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { AuthLeftBanner } from '../components/AuthLeftBanner';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2
} from 'lucide-react';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (!username && val.includes('@')) {
      setUsername(val.split('@')[0].replace(/[^a-zA-Z0-9_]/g, ''));
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!username.trim() || username.trim().length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      setSuccess('Account created successfully. Please login.');
      setTimeout(() => {
        navigate('/login', { state: { message: 'Account created successfully. Please login.' } });
      }, 1000);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please check your details and try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-auth-wrapper">
      <div className="split-auth-container">
        
        {/* LEFT COLUMN: Clean Branding Panel */}
        <AuthLeftBanner />

        {/* RIGHT COLUMN: Clean Auth Panel */}
        <div className="split-auth-right">
          
          {/* Top Switch Link */}
          <div className="split-right-top-link">
            Already have an account? <Link to="/login">Log in</Link>
          </div>

          <div className="split-right-inner">
            <h2 className="split-right-heading">Create your account</h2>
            <p className="split-right-subtitle">Start writing, publishing, and growing your readership.</p>

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

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-3.5">
              
              {/* Full Name */}
              <div className="split-form-group">
                <label className="split-form-label">Full name</label>
                <div className="split-input-wrapper">
                  <input
                    type="text"
                    className="split-input"
                    placeholder="e.g. Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Username */}
              <div className="split-form-group">
                <label className="split-form-label">Username</label>
                <div className="split-input-wrapper">
                  <input
                    type="text"
                    className="split-input"
                    placeholder="janedoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="split-form-group">
                <label className="split-form-label">Email address</label>
                <div className="split-input-wrapper">
                  <input
                    type="email"
                    className="split-input"
                    placeholder="jane@company.com"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="split-form-group">
                <label className="split-form-label">Password</label>
                <div className="split-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="split-input"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div className="split-form-group">
                <label className="split-form-label">Confirm password</label>
                <div className="split-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="split-input"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Primary Submit Button */}
              <button 
                type="submit" 
                className="split-btn-primary" 
                disabled={loading}
                style={{ marginTop: 12 }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="spin-icon" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            {/* Legal Footer */}
            <div className="text-center text-xs text-slate-400 mt-6">
              By creating an account, you agree to our <Link to="/" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
