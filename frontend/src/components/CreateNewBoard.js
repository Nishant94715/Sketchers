import React, { useEffect, useRef, useState } from 'react';
import { Button, TextField, Avatar, Select, MenuItem, Snackbar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { motion } from 'framer-motion';
import { createBoardWithMembers, fetchAllUsersForSystem } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const UserRow = ({ user, action, roleControl }) => (
  <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex min-w-0 items-center gap-3">
      <Avatar sx={{ bgcolor: '#aecbeb', color: '#17324d', fontWeight: 900 }}>
        {user.firstName && user.firstName[0] ? user.firstName[0] : <PersonIcon />}
      </Avatar>
      <div className="min-w-0">
        <p className="m-0 truncate text-base font-black text-sketch-ink">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Unknown User'}</p>
        <p className="m-0 truncate text-sm font-semibold text-sketch-slate">{user.email || 'No email available'}</p>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      {roleControl}
      {action}
    </div>
  </motion.div>
);

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

  const handleSnackbarClose = () => setOpenSnackbar(false);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const responseData = await fetchAllUsersForSystem(userId);
        setAllUsers(responseData.users || []);
      } catch (error) {
        console.log(`error while loading users for board : ${error}`);
      }
    };

    fetchDataAsync();
  }, [userId]);

  const handleRoleChange = (userIdToUpdate, role) => {
    const user = allUsers.find((item) => item._id === userIdToUpdate);
    setSelectedUser({ ...user, role });
  };

  const handleAddMember = () => {
    if (selectedUser) {
      setAddedMembers((prevMembers) => [...prevMembers, selectedUser]);
      setAllUsers((prevUsers) => prevUsers.filter((user) => user._id !== selectedUser._id));
      setSelectedUser(null);
    }
  };

  const handleRemoveMember = (memberId) => {
    const removedUser = addedMembers.find((member) => member._id === memberId);
    if (removedUser) {
      setAddedMembers((prevMembers) => prevMembers.filter((member) => member._id !== memberId));
      setAllUsers((prevUsers) => [...prevUsers, removedUser]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const members = [
      { memberId: userId, role: 'OWNER' },
      ...addedMembers.map((addedMember) => ({ memberId: addedMember._id, role: addedMember.role }))
    ];

    const reqBody = { boardTitle, boardDescription, members };

    try {
      await createBoardWithMembers(reqBody);
      setSnackbarMessage('Board created successfully!');
      setOpenSnackbar(true);
      formRef.current.reset();
      window.location.reload();
      navigate('/whiteboards');
    } catch (error) {
      setSnackbarMessage('Error while creating board.');
      setOpenSnackbar(true);
    }
  };

  return (
    <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="glass-panel rounded-3xl p-6">
        <p className="m-0 text-sm font-black uppercase tracking-[0.18em] text-sketch-slate">New canvas</p>
        <h2 className="m-0 mt-2 text-3xl font-black text-sketch-ink">Create New Board</h2>
        <p className="m-0 mt-2 text-sm leading-6 text-sketch-slate">Name the space, describe the goal, and invite collaborators with the right role.</p>

        <form onSubmit={handleSubmit} ref={formRef} className="mt-6 space-y-4">
          <TextField fullWidth label="Board Title" variant="outlined" value={boardTitle} onChange={(event) => setBoardTitle(event.target.value)} />
          <TextField fullWidth multiline rows={4} label="Board Description" variant="outlined" value={boardDescription} onChange={(event) => setBoardDescription(event.target.value)} />
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outlined" color="error" sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }} onClick={canBtnHandler}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" className="primary-btn">
              Create New Board
            </Button>
          </div>
        </form>

        <div className="mt-8">
          <h3 className="m-0 text-xl font-black text-sketch-ink">Added Members</h3>
          <div className="mt-4 space-y-3">
            {addedMembers.map((member) => (
              <UserRow
                key={member._id}
                user={member}
                roleControl={<span className="rounded-full bg-sketch-cream px-3 py-1 text-xs font-black text-sketch-ink">{member.role}</span>}
                action={<Button variant="outlined" color="error" sx={{ borderRadius: 999, textTransform: 'none', fontWeight: 700 }} onClick={() => handleRemoveMember(member._id)}>Remove</Button>}
              />
            ))}
            {addedMembers.length === 0 && <p className="rounded-2xl bg-white/60 p-4 text-sm font-semibold text-sketch-slate">No members added yet.</p>}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="glass-panel rounded-3xl p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="m-0 text-sm font-black uppercase tracking-[0.18em] text-sketch-slate">People</p>
            <h2 className="m-0 mt-2 text-3xl font-black text-sketch-ink">All Users</h2>
          </div>
          <span className="rounded-full bg-sketch-mist px-3 py-1 text-sm font-black text-sketch-ink">{allUsers.length} available</span>
        </div>

        <div className="mt-6 space-y-3">
          {allUsers.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              roleControl={
                <Select value={selectedUser && selectedUser._id === user._id ? selectedUser.role : ''} onChange={(e) => handleRoleChange(user._id, e.target.value)} variant="outlined" size="small" displayEmpty sx={{ minWidth: 120, borderRadius: 3 }}>
                  <MenuItem value="" disabled>Role</MenuItem>
                  <MenuItem value="EDITOR">Editor</MenuItem>
                  <MenuItem value="VIEWER">Viewer</MenuItem>
                </Select>
              }
              action={<Button variant="contained" className="primary-btn" onClick={handleAddMember}>Add</Button>}
            />
          ))}
          {allUsers.length === 0 && <p className="rounded-2xl bg-white/60 p-4 text-sm font-semibold text-sketch-slate">No additional users found.</p>}
        </div>
      </motion.div>

      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose} message={snackbarMessage} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    </section>
  );
};

export default CreateNewBoard;
