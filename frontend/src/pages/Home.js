import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gridImg1 from './../resources/images/stick_dash_home.jpg';
import gridImg2 from './../resources/images/white_board_people_sketch.jpg';
import gridImg3 from './../resources/images/white_board_sketch.jpg';
import gridImg4 from './../resources/images/whiteboard_laptop.jpg';

const images = [gridImg1, gridImg2, gridImg3, gridImg4];

const stats = [
  { label: 'Live rooms', value: 'Real-time' },
  { label: 'Tools', value: '7 drawing modes' },
  { label: 'Exports', value: 'PDF + PNG' }
];

export const Home = () => {
  return (
    <main className="overflow-hidden">
      <section className="mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="space-y-7"
        >
          <div className="inline-flex rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-bold text-sketch-slate shadow-sm backdrop-blur">
            Browser-based collaborative whiteboards
          </div>
          <div className="space-y-4">
            <h1 className="m-0 max-w-3xl text-5xl font-black leading-[1.04] tracking-normal text-sketch-ink sm:text-6xl">
              CoSketch
            </h1>
            <p className="m-0 max-w-2xl text-lg leading-8 text-sketch-slate">
              Sketch ideas together, manage shared boards, invite collaborators, and export the canvas when the work is ready to leave the room.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/registration" className="rounded-full bg-sketch-ink px-6 py-3 text-sm font-black text-white no-underline shadow-lift transition hover:-translate-y-0.5">
              Start sketching
            </Link>
            <Link to="/login" className="rounded-full border border-white/80 bg-white/75 px-6 py-3 text-sm font-black text-sketch-ink no-underline shadow-sm transition hover:-translate-y-0.5 hover:bg-sketch-mist">
              Sign in
            </Link>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-panel rounded-2xl px-4 py-3">
                <p className="m-0 text-xs font-bold uppercase tracking-[0.16em] text-sketch-slate">{stat.label}</p>
                <p className="m-0 mt-1 text-base font-black text-sketch-ink">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: 'easeOut', delay: 0.12 }}
          className="grid grid-cols-2 gap-4"
        >
          {images.map((image, index) => (
            <motion.div
              key={image}
              whileHover={{ y: -8, rotate: index % 2 === 0 ? -1 : 1 }}
              className={`overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/70 p-2 shadow-soft ${index === 1 ? 'translate-y-8' : ''}`}
            >
              <img className="h-56 w-full rounded-[1.25rem] object-cover sm:h-72" src={image} alt={`CoSketch workspace ${index + 1}`} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
};
