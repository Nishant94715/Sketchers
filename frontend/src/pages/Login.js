import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '../services/apiService';

export const Login = () => {
  const formRef = useRef(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showNotification = (message, type = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setOpenSnackbar(true);
    setTimeout(() => setOpenSnackbar(false), 4000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const reqData = { email: data.get('email'), password: data.get('password') };
    setLoading(true);
    try {
      const responseData = await loginUser(reqData);
      showNotification('Welcome back! Redirecting…', 'success');
      formRef.current.reset();
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('userId', responseData.userId);
      localStorage.setItem('username', responseData.username);
      localStorage.setItem('fullname', responseData.fullname);
      setTimeout(() => navigate('/whiteboards'), 900);
    } catch {
      showNotification('Incorrect email or password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '40px 16px' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Toast */}
      {openSnackbar && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 9999,
            background: snackbarType === 'success'
              ? 'linear-gradient(135deg,#10b981,#059669)'
              : 'linear-gradient(135deg,#ef4444,#dc2626)',
            color: 'white',
            padding: '14px 22px',
            borderRadius: 16,
            fontWeight: 700,
            fontSize: '.9rem',
            boxShadow: '0 8px 32px rgba(0,0,0,.18)',
          }}
        >
          {snackbarType === 'success' ? '✓' : '✕'} {snackbarMessage}
        </motion.div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="card-elevated"
        style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              borderRadius: 18,
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 20px',
              fontSize: '1.8rem',
              boxShadow: '0 4px 20px rgba(99,102,241,.40)',
            }}
          >
            ✦
          </div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.025em' }}>
            Welcome back
          </h1>
          <p style={{ margin: '10px 0 0', color: 'var(--slate)', fontSize: '.9rem' }}>
            Sign in to your boards and keep the collaboration moving.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '.8rem', color: 'var(--slate)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              required
              autoFocus
              className="input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '.8rem', color: 'var(--slate)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="input"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.875rem', fontWeight: 600, color: 'var(--slate)', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
              Remember me
            </label>
            <span style={{ fontSize: '.875rem', color: 'var(--muted)', fontWeight: 600 }}>Forgot password?</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: 4, padding: '13px 24px', fontSize: '1rem' }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: '.875rem', color: 'var(--slate)' }}>
          Don't have an account?{' '}
          <Link to="/registration" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
            Create one free
          </Link>
        </div>
      </motion.section>
    </div>
  );
};
