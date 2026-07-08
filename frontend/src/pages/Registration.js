import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser } from '../services/apiService';

export const Registration = () => {
  const formRef = useRef(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [loading, setLoading] = useState(false);

  const showNotification = (message, type = 'success') => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setOpenSnackbar(true);
    setTimeout(() => setOpenSnackbar(false), 5000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const requestData = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
      role: 'USER',
    };
    setLoading(true);
    try {
      await registerUser(requestData);
      showNotification('Account created! Please sign in to continue.', 'success');
      formRef.current.reset();
    } catch {
      showNotification('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'firstName', label: 'First Name', placeholder: 'Jane', type: 'text', autoComplete: 'given-name', half: true },
    { name: 'lastName', label: 'Last Name', placeholder: 'Doe', type: 'text', autoComplete: 'family-name', half: true },
    { name: 'email', label: 'Email', placeholder: 'jane@example.com', type: 'email', autoComplete: 'email' },
    { name: 'username', label: 'Username', placeholder: 'janedoe', type: 'text' },
    { name: 'password', label: 'Password', placeholder: '••••••••', type: 'password', autoComplete: 'new-password' },
  ];

  return (
    <div className="page-bg" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '40px 16px' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Toast */}
      {openSnackbar && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
            background: snackbarType === 'success'
              ? 'linear-gradient(135deg,#10b981,#059669)'
              : 'linear-gradient(135deg,#ef4444,#dc2626)',
            color: 'white', padding: '14px 22px', borderRadius: 16,
            fontWeight: 700, fontSize: '.9rem', boxShadow: '0 8px 32px rgba(0,0,0,.18)',
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
        style={{ width: '100%', maxWidth: 520, position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64, height: 64,
              background: 'linear-gradient(135deg, var(--accent2), #a78bfa)',
              borderRadius: 18, display: 'grid', placeItems: 'center',
              margin: '0 auto 20px', fontSize: '1.8rem',
              boxShadow: '0 4px 20px rgba(139,92,246,.40)',
            }}
          >
            🎨
          </div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.025em' }}>
            Create your account
          </h1>
          <p style={{ margin: '10px 0 0', color: 'var(--slate)', fontSize: '.9rem' }}>
            Set up your profile and start building boards with teammates.
          </p>
        </div>

        <form
          ref={formRef}
          noValidate
          onSubmit={handleSubmit}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
        >
          {fields.map((f) => (
            <div key={f.name} style={{ gridColumn: f.half ? 'span 1' : 'span 2' }}>
              <label
                htmlFor={f.name}
                style={{ display: 'block', fontWeight: 700, fontSize: '.8rem', color: 'var(--slate)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em' }}
              >
                {f.label}
              </label>
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                placeholder={f.placeholder}
                autoComplete={f.autoComplete}
                required
                className="input"
              />
            </div>
          ))}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ gridColumn: 'span 2', justifyContent: 'center', padding: '13px 24px', fontSize: '1rem' }}
          >
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: '.875rem', color: 'var(--slate)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      </motion.section>
    </div>
  );
};
