import AppHeader from '../components/AppHeader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getUserInfoByUserId, resetPassword } from '../services/apiService';

export const Profile = () => {
  const userId = localStorage.getItem('userId');
  const [userInfo, setUserInfo] = useState({});
  const [toast, setToast] = useState({ open: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, open: false })), 4000);
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const responseData = await getUserInfoByUserId(userId);
        setUserInfo(responseData.user);
      } catch (error) {
        console.log(`error while loading profile : ${error}`);
      }
    };
    fetchDataAsync();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      showToast('New password and confirm password do not match.', 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await resetPassword(userId, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      showToast(response.message || 'Password updated successfully!', 'success');
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      showToast(error.response?.data?.message || 'Password reset failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const initials = userInfo.firstName && userInfo.lastName
    ? `${userInfo.firstName[0]}${userInfo.lastName[0]}`.toUpperCase()
    : (userInfo.username?.[0] || '?').toUpperCase();

  const profileFields = [
    { label: 'Email', value: userInfo.email, icon: <EmailIcon style={{ fontSize: 16 }} /> },
    { label: 'First Name', value: userInfo.firstName, icon: <PersonIcon style={{ fontSize: 16 }} /> },
    { label: 'Last Name', value: userInfo.lastName, icon: <PersonIcon style={{ fontSize: 16 }} /> },
    { label: 'Role', value: userInfo.role, icon: <AdminPanelSettingsIcon style={{ fontSize: 16 }} /> },
    {
      label: 'Member Since',
      value: userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null,
      icon: <CalendarTodayIcon style={{ fontSize: 16 }} />,
    },
  ];

  const passwordFields = [
    { name: 'currentPassword', label: 'Current Password', placeholder: '••••••••' },
    { name: 'newPassword', label: 'New Password', placeholder: '••••••••' },
    { name: 'confirmNewPassword', label: 'Confirm New Password', placeholder: '••••••••' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ede9fe 0%, #e0e7ff 30%, #dbeafe 60%, #f0fdf4 100%)' }}>
      <div className="orb orb-1" style={{ position: 'fixed' }} />
      <div className="orb orb-2" style={{ position: 'fixed' }} />
      <AppHeader isProfilePage />

      {/* Toast */}
      {toast.open && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
            background: toast.type === 'success'
              ? 'linear-gradient(135deg,#10b981,#059669)'
              : 'linear-gradient(135deg,#ef4444,#dc2626)',
            color: 'white', padding: '14px 22px', borderRadius: 16,
            fontWeight: 700, fontSize: '.9rem', boxShadow: '0 8px 32px rgba(0,0,0,.18)',
          }}
        >
          {toast.type === 'success' ? '✓' : '✕'} {toast.message}
        </motion.div>
      )}

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px 80px', position: 'relative', zIndex: 1 }}>
        {/* Back button */}
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => window.history.back()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28 }}
        >
          <ArrowBackIcon style={{ fontSize: 17 }} /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}
        >
          {/* ── Left: Profile info ── */}
          <section
            style={{
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.88)',
              borderRadius: 24,
              padding: 28,
              boxShadow: '0 4px 16px rgba(0,0,0,.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 72, height: 72,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: 20,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(99,102,241,.40)',
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--muted)' }}>
                  Profile
                </p>
                <h1 style={{ margin: '4px 0 0', fontSize: '1.55rem', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.025em' }}>
                  {userInfo.username || 'User'}
                </h1>
              </div>
            </div>

            {/* Fields */}
            <dl style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: 0 }}>
              {profileFields.map(({ label, value, icon }) => (
                <div
                  key={label}
                  style={{
                    padding: '14px 16px',
                    background: 'rgba(241,245,249,0.80)',
                    borderRadius: 14,
                    border: '1px solid rgba(15,23,42,.05)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                  }}
                >
                  <span style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }}>{icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <dt style={{ fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--muted)' }}>
                      {label}
                    </dt>
                    <dd style={{ margin: '4px 0 0', fontWeight: 700, color: 'var(--ink)', fontSize: '.9rem', wordBreak: 'break-word' }}>
                      {value || <span style={{ color: 'var(--muted)', fontWeight: 500 }}>Not available</span>}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          {/* ── Right: Security / Password reset ── */}
          <section
            style={{
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.88)',
              borderRadius: 24,
              padding: 28,
              boxShadow: '0 4px 16px rgba(0,0,0,.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div
                style={{
                  width: 48, height: 48,
                  background: 'linear-gradient(135deg, rgba(99,102,241,.12), rgba(139,92,246,.12))',
                  borderRadius: 14, display: 'grid', placeItems: 'center',
                  color: 'var(--accent)',
                }}
              >
                <LockIcon />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--muted)' }}>
                  Security
                </p>
                <h2 style={{ margin: '4px 0 0', fontSize: '1.4rem', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                  Reset Password
                </h2>
              </div>
            </div>

            <p style={{ margin: '0 0 24px', fontSize: '.875rem', color: 'var(--slate)', lineHeight: 1.7 }}>
              Choose a strong password with at least 8 characters. You'll need to confirm your current password to make the change.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {passwordFields.map((f) => (
                <div key={f.name}>
                  <label
                    htmlFor={f.name}
                    style={{ display: 'block', fontWeight: 700, fontSize: '.78rem', color: 'var(--slate)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em' }}
                  >
                    {f.label}
                  </label>
                  <input
                    id={f.name}
                    name={f.name}
                    type="password"
                    placeholder={f.placeholder}
                    value={formData[f.name]}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              ))}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ justifyContent: 'center', marginTop: 8, padding: '13px 24px', fontSize: '.95rem' }}
              >
                {loading ? 'Updating…' : '🔒 Update Password'}
              </button>
            </form>
          </section>
        </motion.div>
      </main>
    </div>
  );
};
