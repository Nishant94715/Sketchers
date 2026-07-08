import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Select, MenuItem, Snackbar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleIcon from '@mui/icons-material/People';
import { motion, AnimatePresence } from 'framer-motion';
import { createBoardWithMembers, fetchAllUsersForSystem } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const roleColors = { EDITOR: '#f59e0b', VIEWER: '#94a3b8' };

const UserRow = ({ user, action, roleControl, isAdded }) => {
  const initials = user.firstName ? user.firstName[0] : '?';
  const fullName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Unknown User';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: isAdded ? -12 : 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.22 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.75)',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.90)',
        boxShadow: '0 1px 4px rgba(0,0,0,.05)',
      }}
    >
      <Avatar
        sx={{
          bgcolor: isAdded ? 'rgba(99,102,241,.2)' : 'rgba(15,23,42,.08)',
          color: isAdded ? '#6366f1' : 'var(--slate)',
          fontWeight: 900,
          width: 38,
          height: 38,
          fontSize: '.9rem',
          flexShrink: 0,
        }}
      >
        {initials || <PersonIcon />}
      </Avatar>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 800, fontSize: '.9rem', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {fullName}
        </p>
        <p style={{ margin: 0, fontSize: '.78rem', color: 'var(--muted)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.email || 'No email'}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {roleControl}
        {action}
      </div>
    </motion.div>
  );
};

const CreateNewBoard = ({ canBtnHandler }) => {
  const userId = localStorage.getItem('userId');
  const formRef = useRef(null);
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [boardTitle, setBoardTitle] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [addedMembers, setAddedMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const responseData = await fetchAllUsersForSystem(userId);
        setAllUsers(responseData.users || []);
      } catch (error) {
        console.log(`error while loading users : ${error}`);
      }
    };
    fetchDataAsync();
  }, [userId]);

  const handleRoleChange = (userIdToUpdate, role) => {
    const user = allUsers.find((item) => item._id === userIdToUpdate);
    setSelectedUser({ ...user, role });
  };

  const handleAddMember = (user) => {
    const role = selectedUser && selectedUser._id === user._id ? selectedUser.role : 'VIEWER';
    const memberToAdd = { ...user, role };
    setAddedMembers((prev) => [...prev, memberToAdd]);
    setAllUsers((prev) => prev.filter((u) => u._id !== user._id));
    setSelectedUser(null);
  };

  const handleRemoveMember = (memberId) => {
    const removedUser = addedMembers.find((m) => m._id === memberId);
    if (removedUser) {
      setAddedMembers((prev) => prev.filter((m) => m._id !== memberId));
      setAllUsers((prev) => [...prev, removedUser]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!boardTitle.trim()) return;
    setLoading(true);

    const members = [
      { memberId: userId, role: 'OWNER' },
      ...addedMembers.map((m) => ({ memberId: m._id, role: m.role })),
    ];

    try {
      await createBoardWithMembers({ boardTitle, boardDescription, members });
      setSnackbarMessage('Board created successfully!');
      setOpenSnackbar(true);
      setTimeout(() => { window.location.reload(); navigate('/whiteboards'); }, 1200);
    } catch {
      setSnackbarMessage('Error creating board. Please try again.');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = allUsers.filter((u) => {
    const q = searchQuery.toLowerCase();
    return !q || u.firstName?.toLowerCase().includes(q) || u.lastName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>

      {/* ── Left panel: Board details + added members ── */}
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.88)',
          borderRadius: 24,
          padding: 28,
          boxShadow: '0 4px 16px rgba(0,0,0,.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div>
          <span className="section-label">New canvas</span>
          <h2 style={{ margin: '8px 0 6px', fontWeight: 900, fontSize: '1.6rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            Create a Board
          </h2>
          <p style={{ margin: 0, fontSize: '.875rem', color: 'var(--slate)', lineHeight: 1.65 }}>
            Name the space, describe the goal, then invite collaborators with the right role.
          </p>
        </div>

        <form onSubmit={handleSubmit} ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '.78rem', color: 'var(--slate)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em' }}>
              Board Title *
            </label>
            <input
              className="input"
              placeholder="e.g. Product Roadmap Q3"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '.78rem', color: 'var(--slate)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em' }}>
              Description
            </label>
            <textarea
              className="input"
              placeholder="What will this board be used for?"
              value={boardDescription}
              onChange={(e) => setBoardDescription(e.target.value)}
              rows={3}
              style={{ resize: 'vertical', minHeight: 80 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={canBtnHandler}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <ArrowBackIcon style={{ fontSize: 16 }} /> Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !boardTitle.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' }}
            >
              {loading ? 'Creating…' : '✦ Create Board'}
            </button>
          </div>
        </form>

        {/* Added members list */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: 'var(--ink)' }}>
              Added Members
            </h3>
            {addedMembers.length > 0 && (
              <span
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,.12), rgba(139,92,246,.12))',
                  color: 'var(--accent)',
                  borderRadius: 50,
                  padding: '3px 10px',
                  fontSize: '.78rem',
                  fontWeight: 800,
                }}
              >
                {addedMembers.length}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AnimatePresence>
              {addedMembers.map((member) => (
                <UserRow
                  key={member._id}
                  user={member}
                  isAdded
                  roleControl={
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 50,
                        fontSize: '.75rem',
                        fontWeight: 800,
                        background: member.role === 'EDITOR' ? 'rgba(245,158,11,.12)' : 'rgba(148,163,184,.12)',
                        color: roleColors[member.role] || 'var(--muted)',
                        border: `1px solid ${member.role === 'EDITOR' ? 'rgba(245,158,11,.25)' : 'rgba(148,163,184,.25)'}`,
                      }}
                    >
                      {member.role}
                    </span>
                  }
                  action={
                    <button
                      className="btn btn-danger btn-sm btn-icon"
                      onClick={() => handleRemoveMember(member._id)}
                      title="Remove member"
                    >
                      <RemoveIcon style={{ fontSize: 16 }} />
                    </button>
                  }
                />
              ))}
            </AnimatePresence>

            {addedMembers.length === 0 && (
              <div
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  borderRadius: 14,
                  background: 'rgba(241,245,249,0.70)',
                  border: '1.5px dashed rgba(99,102,241,.15)',
                }}
              >
                <PeopleIcon style={{ color: 'var(--muted)', fontSize: 28, marginBottom: 6 }} />
                <p style={{ margin: 0, fontSize: '.85rem', color: 'var(--muted)', fontWeight: 600 }}>
                  No collaborators added yet
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Right panel: All users ── */}
      <motion.div
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        style={{
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.88)',
          borderRadius: 24,
          padding: 28,
          boxShadow: '0 4px 16px rgba(0,0,0,.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxHeight: 680,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="section-label">Collaborators</span>
            <h2 style={{ margin: '6px 0 0', fontWeight: 900, fontSize: '1.35rem', color: 'var(--ink)' }}>
              Invite People
            </h2>
          </div>
          <span
            style={{
              background: 'rgba(99,102,241,.10)',
              color: 'var(--accent)',
              borderRadius: 50,
              padding: '4px 12px',
              fontSize: '.8rem',
              fontWeight: 800,
            }}
          >
            {allUsers.length} available
          </span>
        </div>

        {/* Search */}
        <input
          className="input"
          placeholder="🔍  Search by name or email…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ fontSize: '.875rem' }}
        />

        {/* Users list */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <AnimatePresence>
            {filteredUsers.map((user) => (
              <UserRow
                key={user._id}
                user={user}
                roleControl={
                  <Select
                    value={selectedUser && selectedUser._id === user._id ? selectedUser.role : ''}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    size="small"
                    displayEmpty
                    sx={{ minWidth: 100, borderRadius: 3, fontSize: '.8rem', fontWeight: 700 }}
                  >
                    <MenuItem value="" disabled sx={{ fontSize: '.8rem' }}>Role</MenuItem>
                    <MenuItem value="EDITOR" sx={{ fontSize: '.8rem' }}>✏️ Editor</MenuItem>
                    <MenuItem value="VIEWER" sx={{ fontSize: '.8rem' }}>👁️ Viewer</MenuItem>
                  </Select>
                }
                action={
                  <button
                    className="btn btn-primary btn-sm btn-icon"
                    onClick={() => handleAddMember(user)}
                    title="Add member"
                    style={{ display: 'grid', placeItems: 'center' }}
                  >
                    <AddIcon style={{ fontSize: 18 }} />
                  </button>
                }
              />
            ))}
          </AnimatePresence>

          {filteredUsers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--muted)' }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '.9rem' }}>
                {searchQuery ? 'No users match your search.' : 'No additional users available.'}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </div>
  );
};

export default CreateNewBoard;
