import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Snackbar from '@mui/material/Snackbar';
import { loginUser } from '../services/apiService';

export const Login = () => {
  const formRef = useRef(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleSnackbarClose = () => setOpenSnackbar(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const reqData = {
      email: data.get('email'),
      password: data.get('password')
    };

    try {
      const responseData = await loginUser(reqData);
      setSnackbarMessage('User logged in successfully!');
      setOpenSnackbar(true);
      formRef.current.reset();
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('userId', responseData.userId);
      localStorage.setItem('username', responseData.username);
      localStorage.setItem('fullname', responseData.fullname);
      navigate('/whiteboards');
    } catch (error) {
      setSnackbarMessage('Incorrect username or password!');
      setOpenSnackbar(true);
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-68px)] place-items-center px-4 py-10">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-panel w-full max-w-md rounded-[2rem] p-6 sm:p-8"
      >
        <div className="mb-7 text-center">
          <Avatar sx={{ width: 54, height: 54, margin: '0 auto 14px', bgcolor: '#aecbeb', color: '#17324d' }}>
            <LockOutlinedIcon />
          </Avatar>
          <h1 className="m-0 text-3xl font-black text-sketch-ink">Welcome back</h1>
          <p className="m-0 mt-2 text-sm font-medium text-sketch-slate">Open your boards and keep the collaboration moving.</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
          <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
          <TextField required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Button type="submit" fullWidth variant="contained" className="primary-btn" sx={{ py: 1.35 }}>
            Sign In
          </Button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-bold">
          <span className="text-sketch-slate">Forgot password?</span>
          <Link to="/registration" className="text-sketch-ink no-underline hover:underline">Create an account</Link>
        </div>
      </motion.section>

      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose} message={snackbarMessage} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    </main>
  );
};
