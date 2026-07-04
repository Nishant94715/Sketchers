import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchBoardsForUser } from '../services/apiService';
import BoardItem from '../components/BoardItem';
import CreateNewBoard from '../components/CreateNewBoard';
import AppHeader from '../components/AppHeader';

export const WhiteBoardsPage = () => {
  const userId = localStorage.getItem('userId');

  const [isCreateNewBoardPage, setIsCreateNewBoardPage] = useState(false);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const responseData = await fetchBoardsForUser(userId);
        setBoards(responseData.respBoard || []);
      } catch (error) {
        console.log(`error while loading boards for user : ${error}`);
      }
    };

    fetchDataAsync();
  }, [userId]);

  function handleToggleNewBoard() {
    setIsCreateNewBoardPage(!isCreateNewBoardPage);
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="m-0 text-sm font-black uppercase tracking-[0.2em] text-sketch-slate">Workspace</p>
            <h1 className="m-0 mt-2 text-4xl font-black text-sketch-ink">Your boards</h1>
            <p className="m-0 mt-2 max-w-2xl text-sketch-slate">Create shared canvases, open active sessions, and manage collaborators from one clean place.</p>
          </div>
          {!isCreateNewBoardPage && (
            <Button variant="contained" className="primary-btn" startIcon={<AddIcon />} onClick={handleToggleNewBoard}>
              Create New Board
            </Button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {!isCreateNewBoardPage ? (
            <motion.section key="boards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {boards.map((board) => (
                <BoardItem
                  key={board._id}
                  boardId={board._id}
                  name={board.boardTitle}
                  description={board.boardDescription}
                  role={board.role}
                  memberCnt={board.members.length}
                  lastAccessedAt={board.lastAccessedAt}
                />
              ))}
              {boards.length === 0 && (
                <div className="glass-panel rounded-3xl p-8 text-center sm:col-span-2 xl:col-span-3">
                  <p className="m-0 text-xl font-black text-sketch-ink">No boards yet</p>
                  <p className="m-0 mt-2 text-sketch-slate">Create your first board to start sketching with others.</p>
                </div>
              )}
            </motion.section>
          ) : (
            <motion.div key="create" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
              <CreateNewBoard canBtnHandler={handleToggleNewBoard} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
