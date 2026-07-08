import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Person2Icon from '@mui/icons-material/Person2';
import LogoutIcon from '@mui/icons-material/Logout';
import ConfirmationModal from './ConfirmModal';

const AppHeader = ({ isProfilePage }) => {
  const fullname = localStorage.getItem('fullname');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogoutConfirm, setLogoutConfirm] = useState(false);

  const initials = fullname ? fullname.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '?';

  const handleLogoutConfirm = () => {
    setLogoutConfirm(false);
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          height: 68,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.85)',
          boxShadow: '0 1px 20px rgba(99,102,241,.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          gap: 16,
        }}
      >
        {/* Brand */}
        <Link
          to="/whiteboards"
          style={{
            flex: 1,
            fontSize: '1.35rem',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
          }}
        >
          ✦ CoSketch
        </Link>

        {!isProfilePage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* User info */}
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '.85rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.2 }}>
                {fullname || 'User'}
              </span>
              <span style={{ fontSize: '.75rem', color: 'var(--muted)', fontWeight: 600 }}>
                @{username || ''}
              </span>
            </div>

            {/* Avatar button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setAnchorEl(anchorEl ? null : 'open')}
                style={{
                  width: 40, height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: '2.5px solid white',
                  boxShadow: '0 2px 10px rgba(99,102,241,.35)',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '.875rem',
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center',
                  transition: 'transform .2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {initials}
              </button>

              {/* Dropdown */}
              {anchorEl && (
                <>
                  {/* Backdrop */}
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 200 }}
                    onClick={() => setAnchorEl(null)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: .94, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: 0,
                      zIndex: 201,
                      background: 'white',
                      borderRadius: 16,
                      boxShadow: '0 12px 40px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.08)',
                      border: '1px solid rgba(15,23,42,.08)',
                      overflow: 'hidden',
                      minWidth: 180,
                    }}
                  >
                    <div
                      style={{
                        padding: '16px 18px 12px',
                        borderBottom: '1px solid rgba(15,23,42,.06)',
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: 800, fontSize: '.9rem', color: 'var(--ink)' }}>{fullname}</p>
                      <p style={{ margin: '2px 0 0', fontWeight: 600, fontSize: '.78rem', color: 'var(--muted)' }}>@{username}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setAnchorEl(null)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '12px 18px',
                        color: 'var(--ink)', textDecoration: 'none',
                        fontWeight: 700, fontSize: '.875rem',
                        transition: 'background .15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Person2Icon style={{ fontSize: 18, color: 'var(--accent)' }} />
                      Profile
                    </Link>

                    <button
                      onClick={() => { setAnchorEl(null); setLogoutConfirm(true); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '12px 18px',
                        color: 'var(--danger)', background: 'transparent', border: 'none',
                        fontWeight: 700, fontSize: '.875rem', cursor: 'pointer',
                        textAlign: 'left', fontFamily: 'inherit',
                        transition: 'background .15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogoutIcon style={{ fontSize: 18 }} />
                      Logout
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        )}
      </motion.header>

      <ConfirmationModal
        open={isLogoutConfirm}
        title="Logout"
        content="Are you sure you want to sign out?"
        onConfirm={handleLogoutConfirm}
        onClose={() => setLogoutConfirm(false)}
      />
    </>
  );
};

export default AppHeader;
