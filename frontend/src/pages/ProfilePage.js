import AppHeader from '../components/AppHeader';
import { Button, TextField, Snackbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BadgeIcon from '@mui/icons-material/Badge';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getUserInfoByUserId, resetPassword } from '../services/apiService';

export const Profile = () => {
  const userId = localStorage.getItem('userId');
  const [userInfo, setUserInfo] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

  const handleSnackbarClose = () => setOpenSnackbar(false);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const responseData = await getUserInfoByUserId(userId);
        setUserInfo(responseData.user);
      } catch (error) {
        console.log(`error while loading profile for user : ${error}`);
      }
    };

    fetchDataAsync();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      setSnackbarMessage('New password and confirm password are not matching.');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await resetPassword(userId, { currentPassword: formData.currentPassword, newPassword: formData.newPassword });
      setSnackbarMessage(response.message);
      setOpenSnackbar(true);
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || 'Password reset failed.');
      setOpenSnackbar(true);
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader isProfilePage />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Button onClick={() => window.history.back()} variant="contained" className="primary-btn" startIcon={<ArrowBackIcon />}>
          Back
        </Button>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="glass-panel rounded-3xl p-6">
            <div className="mb-6 flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sketch-blue text-sketch-ink shadow-sm"><BadgeIcon /></span>
              <div>
                <p className="m-0 text-sm font-black uppercase tracking-[0.18em] text-sketch-slate">Profile</p>
                <h1 className="m-0 text-3xl font-black text-sketch-ink">{userInfo.username || 'User'}</h1>
              </div>
            </div>

            <dl className="grid gap-3">
              {[
                ['Email', userInfo.email],
                ['First Name', userInfo.firstName],
                ['Last Name', userInfo.lastName],
                ['Role', userInfo.role],
                ['Created At', userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleString() : 'Unavailable']
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/65 p-4">
                  <dt className="text-xs font-black uppercase tracking-[0.16em] text-sketch-slate">{label}</dt>
                  <dd className="m-0 mt-1 break-words text-base font-black text-sketch-ink">{value || 'Unavailable'}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="glass-panel rounded-3xl p-6">
            <p className="m-0 text-sm font-black uppercase tracking-[0.18em] text-sketch-slate">Security</p>
            <h2 className="m-0 mt-2 text-3xl font-black text-sketch-ink">Reset password</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <TextField fullWidth type="password" label="Current Password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required />
              <TextField fullWidth type="password" label="New Password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
              <TextField fullWidth type="password" label="Confirm New Password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} required />
              <Button type="submit" variant="contained" className="primary-btn">
                Reset Password
              </Button>
            </form>
          </section>
        </motion.div>
      </main>

      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose} message={snackbarMessage} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    </div>
  );
};
