import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Navbar = () => {
  return (
    <motion.nav
      className="navbar"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ position: 'sticky', top: 0, zIndex: 100 }}
    >
      <Link to="/" className="navbar-brand">
        ✦ CoSketch
      </Link>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Sign In</Link>
        <Link to="/registration" className="nav-link-primary">Get Started</Link>
      </div>
    </motion.nav>
  );
};
