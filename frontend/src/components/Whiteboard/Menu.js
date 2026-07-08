import React, { useState } from 'react';
import rectangleIcon from './../../resources/icons/rectangle.svg';
import lineIcon from './../../resources/icons/line.svg';
import rubberIcon from './../../resources/icons/rubber.svg';
import pencilIcon from './../../resources/icons/pencil.svg';
import textIcon from './../../resources/icons/text.svg';
import selectionIcon from './../../resources/icons/selection.svg';
import circleIcon from './../../resources/icons/circle.svg';
import { toolTypes } from './../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setElements, setToolType } from './whiteboardSlice';
import { disconnectSocketConnection, emitClearWhiteboard } from './../../socketConn/socketConn';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarGroup, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchBoardInfo } from '../../services/apiService';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CloseIcon from '@mui/icons-material/Close';

const toolConfig = [
  { src: selectionIcon, type: toolTypes.SELECTION, label: 'Select', shortcut: 'S' },
  { src: pencilIcon,    type: toolTypes.PENCIL,    label: 'Pencil', shortcut: 'P' },
  { src: lineIcon,      type: toolTypes.LINE,       label: 'Line',   shortcut: 'L' },
  { src: rectangleIcon, type: toolTypes.RECTANGLE,  label: 'Rectangle', shortcut: 'R' },
  { src: circleIcon,    type: toolTypes.CIRCLE,     label: 'Circle', shortcut: 'C' },
  { src: textIcon,      type: toolTypes.TEXT,       label: 'Text',   shortcut: 'T' },
];

/* ── Single tool button ── */
const ToolBtn = ({ src, type, label, shortcut }) => {
  const dispatch = useDispatch();
  const selectedToolType = useSelector((state) => state.whiteboard.tool);
  const isActive = selectedToolType === type;

  return (
    <Tooltip title={`${label} (${shortcut})`} arrow placement="bottom">
      <motion.button
        whileTap={{ scale: 0.90 }}
        onClick={() => dispatch(setToolType(type))}
        className={isActive ? 'menu_button_active' : 'menu_button'}
        aria-label={label}
        style={{ position: 'relative' }}
      >
        <img width="56%" height="56%" src={src} alt={label} />
        {isActive && (
          <motion.span
            layoutId="tool-indicator"
            style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'var(--accent)',
            }}
          />
        )}
      </motion.button>
    </Tooltip>
  );
};

/* ── Icon action button ── */
const ActionBtn = ({ icon, label, onClick, danger }) => (
  <Tooltip title={label} arrow placement="bottom">
    <motion.button
      whileTap={{ scale: 0.90 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      aria-label={label}
      style={{
        width: 36, height: 36,
        borderRadius: 10,
        border: 'none',
        background: danger ? 'rgba(239,68,68,.10)' : 'transparent',
        color: danger ? 'var(--danger)' : 'var(--slate)',
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center',
        transition: 'all .18s ease',
        fontSize: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = danger ? 'rgba(239,68,68,.18)' : 'rgba(99,102,241,.10)';
        e.currentTarget.style.color = danger ? 'var(--danger)' : 'var(--accent)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = danger ? 'rgba(239,68,68,.10)' : 'transparent';
        e.currentTarget.style.color = danger ? 'var(--danger)' : 'var(--slate)';
      }}
    >
      {icon}
    </motion.button>
  </Tooltip>
);

/* ── Modal / panel ── */
const Panel = ({ title, open, onClose, children }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.30)', backdropFilter: 'blur(4px)', zIndex: 300 }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -16 }}
          transition={{ duration: 0.22 }}
          style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 301,
            background: 'white',
            borderRadius: 24,
            boxShadow: '0 24px 64px rgba(0,0,0,.20)',
            width: 480,
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid rgba(15,23,42,.07)' }}>
            <h2 style={{ margin: 0, fontWeight: 900, fontSize: '1.2rem', color: 'var(--ink)', letterSpacing: '-0.02em' }}>{title}</h2>
            <button
              onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(15,23,42,.06)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--slate)' }}
            >
              <CloseIcon style={{ fontSize: 18 }} />
            </button>
          </div>
          <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ── Main Menu ── */
const Menu = ({ canvasRef }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const boardMembers = useSelector((state) => state.whiteboard.activeUsers);

  const [showBoardInfo, setShowBoardInfo] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [boardInfo, setBoardInfo] = useState(null);

  const handleOpenBoardInfo = async () => {
    try {
      const response = await fetchBoardInfo(localStorage.getItem('boardId'));
      setBoardInfo(response.board);
      setShowBoardInfo(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBack = () => {
    disconnectSocketConnection();
    localStorage.removeItem('boardId');
    navigate('../../whiteboards');
  };

  const exportToImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'cosketch-canvas.png';
    link.click();
  };

  const exportToPDF = () => {
    html2canvas(canvasRef.current).then((rendered) => {
      const imgData = rendered.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('cosketch-canvas.pdf');
    });
  };

  const handleClearCanvas = () => {
    dispatch(setElements([]));
    emitClearWhiteboard();
  };

  /* Avatar colours for active members */
  const avatarPalette = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="menu_container"
      >
        {/* ── Left: Back + brand ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Tooltip title="Back to boards" arrow placement="bottom">
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={handleBack}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px',
                borderRadius: 50,
                border: 'none',
                background: 'rgba(15,23,42,.07)',
                color: 'var(--slate)',
                fontWeight: 700,
                fontSize: '.8rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all .18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,.12)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,23,42,.07)'; e.currentTarget.style.color = 'var(--slate)'; }}
            >
              <ArrowBackIcon style={{ fontSize: 16 }} /> Back
            </motion.button>
          </Tooltip>

          <span style={{ fontWeight: 900, fontSize: '1rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.02em' }}>
            ✦ CoSketch
          </span>
        </div>

        {/* ── Centre: Drawing tools ── */}
        <div className="toolbar-section">
          {toolConfig.map(({ src, type, label, shortcut }) => (
            <ToolBtn key={type} src={src} type={type} label={label} shortcut={shortcut} />
          ))}

          {/* Divider */}
          <div style={{ width: 1, height: 28, background: 'rgba(15,23,42,.10)', margin: '0 2px' }} />

          <Tooltip title="Clear canvas" arrow placement="bottom">
            <motion.button
              whileTap={{ scale: 0.90 }}
              onClick={handleClearCanvas}
              className="menu_button"
              aria-label="Clear canvas"
            >
              <img width="56%" height="56%" src={rubberIcon} alt="Clear" />
            </motion.button>
          </Tooltip>
        </div>

        {/* ── Right: Actions + members ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Export section */}
          <div className="toolbar-section">
            <ActionBtn icon={<ImageIcon style={{ fontSize: 18 }} />} label="Export PNG" onClick={exportToImage} />
            <ActionBtn icon={<PictureAsPdfIcon style={{ fontSize: 18 }} />} label="Export PDF" onClick={exportToPDF} />
          </div>

          {/* Info + members */}
          <div className="toolbar-section">
            <ActionBtn icon={<InfoOutlinedIcon style={{ fontSize: 18 }} />} label="Board info" onClick={handleOpenBoardInfo} />
            <ActionBtn icon={<PeopleAltIcon style={{ fontSize: 18 }} />} label="Active members" onClick={() => setShowMembers(true)} />
          </div>

          {/* Live members avatars */}
          {boardMembers.length > 0 && (
            <Tooltip title="Active members" arrow>
              <div
                onClick={() => setShowMembers(true)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                {/* Live dot */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.22)', borderRadius: 50, padding: '4px 10px' }}>
                  <div className="live-dot" />
                  <span style={{ fontSize: '.75rem', fontWeight: 800, color: '#059669' }}>{boardMembers.length}</span>
                </div>

                <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 30, height: 30, fontSize: '.75rem', fontWeight: 900, border: '2px solid white' } }}>
                  {boardMembers.map((member, i) => (
                    <Avatar
                      key={i}
                      alt={member.firstName}
                      sx={{ bgcolor: avatarPalette[i % avatarPalette.length] }}
                    >
                      {member.firstName?.charAt(0)}
                    </Avatar>
                  ))}
                </AvatarGroup>
              </div>
            </Tooltip>
          )}
        </div>
      </motion.div>

      {/* ── Board info panel ── */}
      <Panel title="Board Details" open={showBoardInfo} onClose={() => setShowBoardInfo(false)}>
        {boardInfo && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(99,102,241,.08), rgba(139,92,246,.08))', borderRadius: 14 }}>
              <p style={{ margin: 0, fontSize: '.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Title</p>
              <p style={{ margin: '4px 0 0', fontWeight: 900, fontSize: '1.1rem', color: 'var(--ink)' }}>{boardInfo.boardTitle}</p>
            </div>
            <div style={{ padding: '16px', background: 'rgba(241,245,249,0.80)', borderRadius: 14 }}>
              <p style={{ margin: 0, fontSize: '.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Description</p>
              <p style={{ margin: '4px 0 0', fontWeight: 600, color: 'var(--slate)', lineHeight: 1.6 }}>{boardInfo.boardDescription || 'No description.'}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ padding: '14px', background: 'rgba(241,245,249,0.80)', borderRadius: 14 }}>
                <p style={{ margin: 0, fontSize: '.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Members</p>
                <p style={{ margin: '4px 0 0', fontWeight: 900, fontSize: '1.3rem', color: 'var(--ink)' }}>{boardInfo.members?.length}</p>
              </div>
              <div style={{ padding: '14px', background: 'rgba(241,245,249,0.80)', borderRadius: 14 }}>
                <p style={{ margin: 0, fontSize: '.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Created</p>
                <p style={{ margin: '4px 0 0', fontWeight: 700, fontSize: '.85rem', color: 'var(--ink)' }}>{boardInfo.createdAt ? new Date(boardInfo.createdAt).toLocaleDateString() : '—'}</p>
              </div>
            </div>
            {boardInfo.members?.length > 0 && (
              <div>
                <p style={{ margin: '0 0 10px', fontSize: '.72rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Member List</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {boardInfo.members.map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(241,245,249,0.80)', borderRadius: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: '.875rem', color: 'var(--ink)' }}>{m.memberId}</span>
                      <span style={{ fontSize: '.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: 50, background: m.memberRole === 'OWNER' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'rgba(245,158,11,.12)', color: m.memberRole === 'OWNER' ? 'white' : '#d97706' }}>
                        {m.memberRole}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Panel>

      {/* ── Active members panel ── */}
      <Panel title="Active Members" open={showMembers} onClose={() => setShowMembers(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {boardMembers.length === 0 && (
            <p style={{ color: 'var(--muted)', fontWeight: 600, textAlign: 'center', padding: '20px 0' }}>No active members right now.</p>
          )}
          {boardMembers.map((member, i) => {
            const avatarBg = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6'][i % 6];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(241,245,249,0.80)', borderRadius: 14, border: '1px solid rgba(15,23,42,.05)' }}
              >
                <Avatar sx={{ bgcolor: avatarBg, width: 40, height: 40, fontWeight: 900, fontSize: '.9rem', flexShrink: 0 }}>
                  {member.firstName?.charAt(0)}
                </Avatar>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 800, color: 'var(--ink)', fontSize: '.9rem' }}>
                    {member.firstName} {member.lastName}
                  </p>
                  <p style={{ margin: 0, fontSize: '.78rem', color: 'var(--muted)', fontWeight: 600 }}>{member.email}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div className="live-dot" />
                  <span style={{ fontSize: '.75rem', fontWeight: 800, color: '#059669' }}>Live</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Panel>
    </>
  );
};

export default Menu;
