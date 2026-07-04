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
import { motion } from 'framer-motion';
import { Button, Avatar, AvatarGroup, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Tooltip } from '@mui/material';
import { ArrowBack, Info } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchBoardInfo } from '../../services/apiService';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const toolLabels = {
  [toolTypes.RECTANGLE]: 'Rectangle',
  [toolTypes.CIRCLE]: 'Circle',
  [toolTypes.LINE]: 'Line',
  [toolTypes.PENCIL]: 'Pencil',
  [toolTypes.TEXT]: 'Text',
  [toolTypes.SELECTION]: 'Select'
};

const CustomIconButton = ({ src, type, isRubber }) => {
  const dispatch = useDispatch();
  const selectedToolType = useSelector((state) => state.whiteboard.tool);

  const handleToolChange = () => dispatch(setToolType(type));

  const handleClearCanvas = () => {
    dispatch(setElements([]));
    emitClearWhiteboard();
  };

  const label = isRubber ? 'Clear canvas' : toolLabels[type];

  return (
    <Tooltip title={label} arrow>
      <motion.button
        whileTap={{ scale: 0.94 }}
        whileHover={{ y: -2 }}
        onClick={isRubber ? handleClearCanvas : handleToolChange}
        className={selectedToolType === type ? 'menu_button_active' : 'menu_button'}
        aria-label={label}
      >
        <img width="78%" height="78%" src={src} alt="" />
      </motion.button>
    </Tooltip>
  );
};

const Menu = ({ canvasRef }) => {
  const navigate = useNavigate();
  const boardMembers = useSelector((state) => state.whiteboard.activeUsers);

  const [openBoardDetails, setOpenBoardDetails] = useState(false);
  const [openActiveMembers, setOpenActiveMembers] = useState(false);
  const [boardInfo, setBoardInfo] = useState(null);

  const handleClickOpenBoardInfo = async () => {
    try {
      const response = await fetchBoardInfo(localStorage.getItem('boardId'));
      setBoardInfo(response.board);
      setOpenBoardDetails(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBackButtonClick = () => {
    disconnectSocketConnection();
    localStorage.removeItem('boardId');
    navigate('../../whiteboards');
  };

  const exportToImage = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'canvas-image.png';
    link.click();
  };

  const exportToPDF = () => {
    const canvas = canvasRef.current;
    html2canvas(canvas).then((renderedCanvas) => {
      const imgData = renderedCanvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('canvas.pdf');
    });
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="menu_container">
        <Button variant="contained" className="primary-btn" startIcon={<ArrowBack />} onClick={handleBackButtonClick}>
          Back
        </Button>

        <div className="flex items-center gap-2 rounded-2xl bg-white/45 p-1">
          <CustomIconButton src={rectangleIcon} type={toolTypes.RECTANGLE} />
          <CustomIconButton src={circleIcon} type={toolTypes.CIRCLE} />
          <CustomIconButton src={lineIcon} type={toolTypes.LINE} />
          <CustomIconButton src={pencilIcon} type={toolTypes.PENCIL} />
          <CustomIconButton src={textIcon} type={toolTypes.TEXT} />
          <CustomIconButton src={selectionIcon} type={toolTypes.SELECTION} />
          <CustomIconButton src={rubberIcon} isRubber />
        </div>

        <div className="flex items-center gap-1 rounded-2xl bg-white/45 p-1">
          <Tooltip title="Export PNG" arrow>
            <IconButton onClick={exportToImage} aria-label="export to image" sx={{ color: '#17324d' }}>
              <ImageIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export PDF" arrow>
            <IconButton onClick={exportToPDF} aria-label="export to pdf" sx={{ color: '#17324d' }}>
              <PictureAsPdfIcon />
            </IconButton>
          </Tooltip>
        </div>

        <Button variant="outlined" className="secondary-btn" startIcon={<Info />} onClick={handleClickOpenBoardInfo}>
          Info
        </Button>

        <Tooltip title="Active members" arrow>
          <AvatarGroup max={4} onClick={() => setOpenActiveMembers(true)} sx={{ cursor: 'pointer' }}>
            {boardMembers.map((member, index) => (
              <Avatar sx={{ bgcolor: '#17324d' }} alt={member.firstName} key={index}>{member.firstName?.charAt(0)}</Avatar>
            ))}
          </AvatarGroup>
        </Tooltip>
      </motion.div>

      {boardInfo && (
        <Dialog open={openBoardDetails} onClose={() => setOpenBoardDetails(false)} aria-labelledby="board-details-dialog-title" PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle id="board-details-dialog-title" sx={{ fontWeight: 900, color: '#17324d' }}>Board Details</DialogTitle>
          <DialogContent>
            <Typography variant="h6" component="div" sx={{ fontWeight: 900 }}>{boardInfo.boardTitle}</Typography>
            <Typography variant="body2" color="textPrimary" component="div" sx={{ mt: 1 }}>Description: {boardInfo.boardDescription}</Typography>
            <Typography variant="body2" color="textPrimary" component="div" sx={{ mt: 2 }}>Members: {boardInfo.members.length}</Typography>
            {boardInfo.members.map((member, index) => (
              <Typography key={index} variant="body2" color="textPrimary" component="div" sx={{ mt: 0.5 }}>
                {member.memberId} | {member.memberRole} | {member.lastAccessedAt || 'No access yet'}
              </Typography>
            ))}
            <Typography variant="body2" color="textPrimary" component="div" sx={{ mt: 2 }}>Created At: {boardInfo.createdAt}</Typography>
            <Typography variant="body2" color="textPrimary" component="div" sx={{ mt: 0.5 }}>Updated At: {boardInfo.updatedAt}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBoardDetails(false)} className="secondary-btn">Close</Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={openActiveMembers} onClose={() => setOpenActiveMembers(false)} aria-labelledby="active-members-dialog-title" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle id="active-members-dialog-title" sx={{ fontWeight: 900, color: '#17324d' }}>Active Members</DialogTitle>
        <DialogContent>
          {boardMembers && boardMembers.map((member, index) => (
            <Typography key={index} variant="body2" color="textPrimary" component="div" sx={{ mt: 1 }}>
              {member.email} | {member.username} | {member.firstName} | {member.lastName}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenActiveMembers(false)} className="secondary-btn">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Menu;
