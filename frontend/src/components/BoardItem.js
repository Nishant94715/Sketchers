import React, { useState } from 'react';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import GroupIcon from '@mui/icons-material/Group';
import { motion } from 'framer-motion';
import EditBoardDialog from './EditBoardDialog';
import ConfirmModal from './ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { deleteBoardById } from '../services/apiService';

const roleStyles = {
  OWNER: 'bg-sketch-ink text-white',
  EDITOR: 'bg-sketch-cream text-sketch-ink',
  VIEWER: 'bg-sketch-mist text-sketch-ink'
};

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

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28 }}
      className="glass-panel flex min-h-64 flex-col rounded-3xl p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${roleStyles[role] || roleStyles.VIEWER}`}>{role}</span>
          <h2 className="m-0 mt-4 truncate text-2xl font-black text-sketch-ink">{name}</h2>
          <p className="m-0 mt-2 line-clamp-3 text-sm leading-6 text-sketch-slate">{description}</p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sketch-mist text-sketch-ink shadow-sm">
          <GroupIcon />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-white/65 p-3">
          <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-sketch-slate">Members</p>
          <p className="m-0 mt-1 text-xl font-black text-sketch-ink">{memberCnt}</p>
        </div>
        <div className="rounded-2xl bg-white/65 p-3">
          <p className="m-0 text-xs font-bold uppercase tracking-[0.14em] text-sketch-slate">Last access</p>
          <p className="m-0 mt-1 truncate text-sm font-black text-sketch-ink">{lastAccessedAt === null ? 'Not yet' : new Date(lastAccessedAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        <Button variant="contained" className="primary-btn" startIcon={<VisibilityIcon />} onClick={() => setOpenOpenBoardConfirmDialog(true)}>
          Open
        </Button>
        {canManage && (
          <Button variant="outlined" className="secondary-btn" startIcon={<EditIcon />} onClick={() => setOpenEditDialog(true)}>
            Edit
          </Button>
        )}
        {canManage && (
          <Button variant="outlined" color="error" sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }} startIcon={<DeleteIcon />} onClick={() => setOpenDeleteConfirmDialog(true)}>
            Delete
          </Button>
        )}
      </div>

      <EditBoardDialog open={openEditDialog} handleClose={() => setOpenEditDialog(false)} />
      <ConfirmModal open={openDeleteConfirmDialog} title="Delete Confirmation" content="Are you sure you want to delete this board?" onConfirm={handleDeleteBoardConfirm} onClose={() => setOpenDeleteConfirmDialog(false)} />
      <ConfirmModal open={openOpenBoardConfirmDialog} title="Open Board Confirmation" content="Are you sure you want to open this board?" onConfirm={handleOpenBoardConfirm} onClose={() => setOpenOpenBoardConfirmDialog(false)} />
    </motion.article>
  );
};

export default BoardItem;
