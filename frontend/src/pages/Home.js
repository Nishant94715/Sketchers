import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gridImg1 from './../resources/images/stick_dash_home.jpg';
import gridImg2 from './../resources/images/white_board_people_sketch.jpg';
import gridImg3 from './../resources/images/white_board_sketch.jpg';
import gridImg4 from './../resources/images/whiteboard_laptop.jpg';

const images = [gridImg1, gridImg2, gridImg3, gridImg4];

const stats = [
  { label: 'Live rooms', value: 'Real-time', icon: '🟢' },
  { label: 'Drawing tools', value: '7 modes', icon: '✏️' },
  { label: 'Exports', value: 'PDF + PNG', icon: '📄' },
];

const features = [
  {
    icon: '👥',
    title: 'Live Collaboration',
    desc: 'See your teammates\' cursors moving in real time. Work side-by-side from anywhere in the world.',
  },
  {
    icon: '🎨',
    title: 'Rich Drawing Tools',
    desc: 'Shapes, freehand, text, lines, selection — everything you need to express your ideas visually.',
  },
  {
    icon: '🔗',
    title: 'Role-based Access',
    desc: 'Invite members as Owners, Editors, or Viewers. You control who sees and who edits.',
  },
  {
    icon: '📤',
    title: 'Instant Export',
    desc: 'Save your canvas as a PNG or a PDF with a single click. Perfect for sharing outside the app.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const Home = () => {
  return (
    <div className="page-bg">
      {/* decorative orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '80px 24px 60px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 56,
            alignItems: 'center',
          }}
          className="hero-section"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
          >
            <motion.div variants={itemVariants}>
              <span className="collab-pill">
                <span className="live-dot" />
                Browser-based real-time whiteboards
              </span>
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 'clamp(2.6rem, 5vw, 4rem)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  color: 'var(--ink)',
                }}
              >
                Sketch together,{' '}
                <span className="text-gradient">in real time</span>
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: '1.125rem',
                  lineHeight: 1.75,
                  color: 'var(--slate)',
                  maxWidth: 500,
                }}
              >
                CoSketch gives your team a shared canvas — with live cursors,
                flexible roles, and one-click export. Ideas become clearer when
                everyone can draw.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/registration" className="btn btn-primary btn-lg">
                Start sketching free →
              </Link>
              <Link to="/login" className="btn btn-ghost btn-lg">
                Sign in
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}
            >
              {stats.map((s) => (
                <div key={s.label} className="stat-card">
                  <p style={{ margin: 0, fontSize: '1.1rem' }}>{s.icon}</p>
                  <p
                    style={{
                      margin: '6px 0 0',
                      fontSize: '.7rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '.12em',
                      color: 'var(--muted)',
                    }}
                  >
                    {s.label}
                  </p>
                  <p style={{ margin: '4px 0 0', fontWeight: 900, color: 'var(--ink)' }}>{s.value}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
          >
            {images.map((img, i) => (
              <motion.div
                key={img}
                whileHover={{ y: -10, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                transition={{ duration: 0.3 }}
                className="hero-img-wrap"
                style={{ marginTop: i === 1 ? 32 : 0, height: i % 2 === 0 ? 260 : 220 }}
              >
                <img src={img} alt={`CoSketch workspace ${i + 1}`} style={{ height: '100%' }} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── Features ─────────────────────────────────────────── */}
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 100px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: 52 }}
          >
            <span className="section-label">Why CoSketch</span>
            <h2
              style={{
                margin: '12px 0 0',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.025em',
                color: 'var(--ink)',
              }}
            >
              Everything your team needs
            </h2>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: 'linear-gradient(135deg, rgba(99,102,241,.12), rgba(139,92,246,.12))',
                    borderRadius: 14,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '1.6rem',
                    marginBottom: 16,
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: 'var(--ink)' }}>
                  {f.title}
                </h3>
                <p style={{ margin: '10px 0 0', fontSize: '.9rem', lineHeight: 1.7, color: 'var(--slate)' }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
