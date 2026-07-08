import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import GridViewIcon from '@mui/icons-material/GridView';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchBoardsForUser } from '../services/apiService';
import BoardItem from '../components/BoardItem';
import CreateNewBoard from '../components/CreateNewBoard';
import AppHeader from '../components/AppHeader';

export const WhiteBoardsPage = () => {
  const userId = localStorage.getItem('userId');
  const fullname = localStorage.getItem('fullname');

  const [isCreateNewBoardPage, setIsCreateNewBoardPage] = useState(false);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const responseData = await fetchBoardsForUser(userId);
        setBoards(responseData.respBoard || []);
      } catch (error) {
        console.log(`error while loading boards for user : ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAsync();
  }, [userId]);

  function handleToggleNewBoard() {
    setIsCreateNewBoardPage(!isCreateNewBoardPage);
  }

  const ownedBoards  = boards.filter(b => b.role === 'OWNER');
  const sharedBoards = boards.filter(b => b.role !== 'OWNER');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ede9fe 0%, #e0e7ff 30%, #dbeafe 60%, #f0fdf4 100%)' }}>
      <div className="orb orb-1" style={{ position: 'fixed' }} />
      <div className="orb orb-2" style={{ position: 'fixed' }} />

      <AppHeader />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ marginBottom: 36, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}
        >
          <div>
            <span className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <GridViewIcon style={{ fontSize: 14 }} /> Workspace
            </span>
            <h1 style={{ margin: '8px 0 0', fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.025em' }}>
              {fullname ? `${fullname.split(' ')[0]}'s boards` : 'Your boards'}
            </h1>
            <p style={{ margin: '8px 0 0', color: 'var(--slate)', fontSize: '.95rem' }}>
              {boards.length > 0
                ? `${boards.length} board${boards.length > 1 ? 's' : ''} · ${ownedBoards.length} owned · ${sharedBoards.length} shared`
                : 'Create your first board to start collaborating'}
            </p>
          </div>

          {!isCreateNewBoardPage && (
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn btn-primary"
              onClick={handleToggleNewBoard}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.9rem' }}
            >
              <AddIcon style={{ fontSize: 20 }} />
              New Board
            </motion.button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {!isCreateNewBoardPage ? (
            <motion.div key="boards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Loading skeleton */}
              {loading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ height: 260, borderRadius: 24, background: 'rgba(255,255,255,.55)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  ))}
                </div>
              )}

              {/* Boards grid */}
              {!loading && boards.length > 0 && (
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                  {boards.map((board, i) => (
                    <motion.div
                      key={board._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <BoardItem
                        boardId={board._id}
                        name={board.boardTitle}
                        description={board.boardDescription}
                        role={board.role}
                        memberCnt={board.members.length}
                        lastAccessedAt={board.lastAccessedAt}
                      />
                    </motion.div>
                  ))}
                </section>
              )}

              {/* Empty state */}
              {!loading && boards.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="empty-state"
                >
                  <div className="empty-state-icon">✦</div>
                  <h2 style={{ margin: 0, fontWeight: 900, fontSize: '1.35rem', color: 'var(--ink)' }}>
                    No boards yet
                  </h2>
                  <p style={{ margin: '10px 0 24px', color: 'var(--slate)', fontSize: '.95rem', maxWidth: 360, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
                    Create your first board to start sketching, planning, and collaborating with your team.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={handleToggleNewBoard}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  >
                    <AddIcon style={{ fontSize: 20 }} /> Create your first board
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
            >
              <CreateNewBoard canBtnHandler={handleToggleNewBoard} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
