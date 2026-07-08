import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ open, title, content, onConfirm, onClose }) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(15,23,42,.35)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              zIndex: 1300,
            }}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1301,
              background: 'white',
              borderRadius: 22,
              boxShadow: '0 24px 64px rgba(0,0,0,.20), 0 4px 12px rgba(0,0,0,.08)',
              width: 380,
              maxWidth: 'calc(100vw - 32px)',
              overflow: 'hidden',
            }}
          >
            {/* Accent bar */}
            <div style={{ height: 4, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />

            <div style={{ padding: '24px 24px 20px' }}>
              <h2 style={{ margin: '0 0 10px', fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
                {title}
              </h2>
              <p style={{ margin: 0, color: 'var(--slate)', fontSize: '.9rem', lineHeight: 1.65, fontWeight: 500 }}>
                {content}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, padding: '0 24px 24px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={onConfirm}
                autoFocus
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
