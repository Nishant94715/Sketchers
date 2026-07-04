import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Snackbar from '@mui/material/Snackbar';
import { registerUser } from '../services/apiService';

export const Registration = () => {
  const formRef = useRef(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => setOpenSnackbar(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const requestData = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
      role: 'USER'
    };

    try {
      await registerUser(requestData);
      setSnackbarMessage('User registered successfully! Please continue with login.');
      setOpenSnackbar(true);
      formRef.current.reset();
    } catch (error) {
      setSnackbarMessage('Error while registering user.');
      setOpenSnackbar(true);
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-68px)] place-items-center px-4 py-10">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-panel w-full max-w-2xl rounded-[2rem] p-6 sm:p-8"
      >
        <div className="mb-7 text-center">
          <Avatar sx={{ width: 54, height: 54, margin: '0 auto 14px', bgcolor: '#E8D5C4', color: '#17324d' }}>
            <LockOutlinedIcon />
          </Avatar>
          <h1 className="m-0 text-3xl font-black text-sketch-ink">Create workspace access</h1>
          <p className="m-0 mt-2 text-sm font-medium text-sketch-slate">Set up your profile and start building boards with teammates.</p>
        </div>

        <form ref={formRef} noValidate onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <TextField required fullWidth id="firstName" label="First Name" name="firstName" autoComplete="given-name" autoFocus />
          <TextField required fullWidth id="lastName" label="Last Name" name="lastName" autoComplete="family-name" />
          <TextField className="sm:col-span-2" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />
          <TextField className="sm:col-span-2" required fullWidth id="username" label="Username" name="username" />
          <TextField className="sm:col-span-2" required fullWidth id="password" label="Password" name="password" type="password" autoComplete="new-password" />
          <Button type="submit" fullWidth variant="contained" className="primary-btn sm:col-span-2" sx={{ py: 1.35 }}>
            Sign Up
          </Button>
        </form>

        <div className="mt-5 text-right text-sm font-bold">
          <Link to="/login" className="text-sketch-ink no-underline hover:underline">Already have an account? Sign in</Link>
        </div>
      </motion.section>

      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose} message={snackbarMessage} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    </main>
  );
};
