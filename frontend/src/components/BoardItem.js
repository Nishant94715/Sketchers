import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditBoardDialog from './EditBoardDialog';
import ConfirmModal from './ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { deleteBoardById } from '../services/apiService';

const roleBadgeClass = {
  OWNER: 'badge badge-owner',
  EDITOR: 'badge badge-editor',
  VIEWER: 'badge badge-viewer',
};

const roleIcon = { OWNER: '👑', EDITOR: '✏️', VIEWER: '👁️' };

const BoardItem = ({ boardId, name, description, role, memberCnt, lastAccessedAt }) => {
  const navigate = useNavigate();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [openOpenBoardConfirmDialog, setOpenOpenBoardConfirmDialog] = useState(false);

  const canManage = role === 'EDITOR' || role === 'OWNER';

  const handleOpenBoardConfirm = () => {
    localStorage.setItem('boardId', boardId);
    navigate(`../whiteboard/${boardId}`);
  };

  const handleDeleteBoardConfirm = async () => {
    try {
      await deleteBoardById(boardId);
      window.location.reload();
      setOpenDeleteConfirmDialog(false);
    } catch (error) {
      console.log(`error while deleting board : ${error}`);
    }
  };

  const lastAccess = lastAccessedAt
    ? new Date(lastAccessedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Never';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.88)',
        borderRadius: 24,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 260,
        boxShadow: '0 4px 16px rgba(0,0,0,.08)',
        transition: 'box-shadow .3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,.16)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,.25)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.88)'; }}
    >
      {/* Subtle gradient accent top */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: 3,
          background: role === 'OWNER'
            ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
            : role === 'EDITOR'
            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
            : 'linear-gradient(90deg, #94a3b8, #cbd5e1)',
          borderRadius: '24px 24px 0 0',
        }}
      />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <span className={roleBadgeClass[role] || 'badge badge-viewer'}>
            {roleIcon[role]} {role}
          </span>
          <h2
            style={{
              margin: '12px 0 0',
              fontSize: '1.2rem',
              fontWeight: 900,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </h2>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: '.875rem',
              lineHeight: 1.65,
              color: 'var(--slate)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description || 'No description provided.'}
          </p>
        </div>

        <div
          style={{
            width: 44, height: 44, flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(99,102,241,.1), rgba(139,92,246,.12))',
            borderRadius: 12, display: 'grid', placeItems: 'center',
            color: 'var(--accent)',
          }}
        >
          <GroupIcon style={{ fontSize: 22 }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
        <div
          style={{
            background: 'rgba(241,245,249,0.80)',
            borderRadius: 12, padding: '10px 14px',
            border: '1px solid rgba(15,23,42,.05)',
          }}
        >
          <p style={{ margin: 0, fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--muted)' }}>
            Members
          </p>
          <p style={{ margin: '5px 0 0', fontWeight: 900, fontSize: '1.4rem', color: 'var(--ink)' }}>
            {memberCnt}
          </p>
        </div>
        <div
          style={{
            background: 'rgba(241,245,249,0.80)',
            borderRadius: 12, padding: '10px 14px',
            border: '1px solid rgba(15,23,42,.05)',
          }}
        >
          <p style={{ margin: 0, fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <AccessTimeIcon style={{ fontSize: 12 }} /> Last access
          </p>
          <p style={{ margin: '5px 0 0', fontWeight: 700, fontSize: '.85rem', color: 'var(--ink)' }}>
            {lastAccess}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setOpenOpenBoardConfirmDialog(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <VisibilityIcon style={{ fontSize: 16 }} /> Open
        </button>

        {canManage && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setOpenEditDialog(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <EditIcon style={{ fontSize: 16 }} /> Edit
          </button>
        )}

        {canManage && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => setOpenDeleteConfirmDialog(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <DeleteIcon style={{ fontSize: 16 }} /> Delete
          </button>
        )}
      </div>

      <EditBoardDialog open={openEditDialog} handleClose={() => setOpenEditDialog(false)} />
      <ConfirmModal
        open={openDeleteConfirmDialog}
        title="Delete Board"
        content={`Are you sure you want to delete "${name}"? This cannot be undone.`}
        onConfirm={handleDeleteBoardConfirm}
        onClose={() => setOpenDeleteConfirmDialog(false)}
      />
      <ConfirmModal
        open={openOpenBoardConfirmDialog}
        title="Open Board"
        content={`Open "${name}"? You'll join the live session.`}
        onConfirm={handleOpenBoardConfirm}
        onClose={() => setOpenOpenBoardConfirmDialog(false)}
      />
    </motion.article>
  );
};

export default BoardItem;
