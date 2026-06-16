import { motion } from 'framer-motion';
import { Plane, MapPin, Sparkles } from 'lucide-react';

const DOTS = [
  { id: 0, x: 12, y: 18, size: 4, delay: 0, duration: 3 },
  { id: 1, x: 78, y: 22, size: 5, delay: 0.4, duration: 3.5 },
  { id: 2, x: 45, y: 8, size: 3, delay: 0.8, duration: 2.8 },
  { id: 3, x: 88, y: 55, size: 4, delay: 1.2, duration: 3.2 },
  { id: 4, x: 15, y: 72, size: 6, delay: 0.2, duration: 4 },
  { id: 5, x: 62, y: 85, size: 3, delay: 1.5, duration: 2.5 },
  { id: 6, x: 32, y: 45, size: 4, delay: 0.6, duration: 3.8 },
  { id: 7, x: 92, y: 38, size: 5, delay: 1, duration: 3.3 },
  { id: 8, x: 8, y: 48, size: 3, delay: 1.8, duration: 2.9 },
  { id: 9, x: 55, y: 62, size: 4, delay: 0.3, duration: 3.6 },
  { id: 10, x: 25, y: 88, size: 5, delay: 0.9, duration: 3.1 },
  { id: 11, x: 72, y: 12, size: 3, delay: 1.4, duration: 2.7 },
];

const TITLE_CHARS = 'TrripAi'.split('');

function TitleLine({ tagline }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 mb-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.35, duration: 0.5 }}
    >
      <div className="flex items-center gap-3 w-full max-w-[220px]">
        <motion.div
          className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/70 to-primary/30"
          initial={{ scaleX: 0, originX: 1 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        />
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.55, type: 'spring', stiffness: 400, damping: 18 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-secondary shadow-glow-sm"
            animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/40 blur-sm"
            animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <motion.div
          className="h-px flex-1 bg-gradient-to-l from-transparent via-secondary/70 to-secondary/30"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      {tagline && (
        <motion.p
          className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-text-muted"
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.28em' }}
          transition={{ delay: 0.65, duration: 0.7 }}
        >
          {tagline}
        </motion.p>
      )}
    </motion.div>
  );
}

export default function AppLoader({
  title = 'TrripAi',
  tagline = 'AI Travel Planner',
  subtitle = 'Preparing your intelligent travel experience',
  fullScreen = true,
}) {
  const chars = title.split('');
  const wrapperClass = fullScreen
    ? 'fixed inset-0 z-[100] flex items-center justify-center overflow-hidden'
    : 'relative flex items-center justify-center py-20 overflow-hidden';

  return (
    <div className={wrapperClass} style={{ background: 'rgb(var(--color-bg))' }}>
      {/* Aurora mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-40"
          style={{
            background: 'conic-gradient(from 180deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2), rgba(6,182,212,0.15), rgba(99,102,241,0.25))',
            filter: 'blur(80px)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-1/4 left-1/4 w-[420px] h-[420px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.75, 0.4], x: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[360px] h-[360px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)' }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.35, 0.65, 0.35], x: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        {DOTS.map((d) => (
          <motion.div
            key={d.id}
            className="absolute rounded-full"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: d.size,
              height: d.size,
              background: 'radial-gradient(circle, rgba(99,102,241,0.5), transparent)',
            }}
            animate={{ y: [0, -14, 0], opacity: [0.15, 0.55, 0.15], scale: [1, 1.2, 1] }}
            transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Animated route paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 0 72 Q 30 38, 55 58 T 100 32"
          fill="none"
          stroke="url(#routeGrad)"
          strokeWidth="0.4"
          strokeDasharray="2 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.35, strokeDashoffset: [0, -20] }}
          transition={{
            pathLength: { duration: 2, ease: 'easeInOut' },
            opacity: { duration: 2 },
            strokeDashoffset: { duration: 3, repeat: Infinity, ease: 'linear' },
          }}
        />
        <motion.path
          d="M 5 85 Q 40 55, 70 70 T 95 48"
          fill="none"
          stroke="rgba(6,182,212,0.25)"
          strokeWidth="0.3"
          strokeDasharray="1.5 4"
          animate={{ strokeDashoffset: [0, -15], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            strokeDashoffset: { duration: 4, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 3, repeat: Infinity },
          }}
        />
      </svg>

      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-8 py-10 rounded-3xl border border-white/[0.06] max-w-sm w-full mx-4"
        style={{
          background: 'linear-gradient(135deg, rgba(30,41,59,0.75), rgba(15,23,42,0.85))',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Spinner + logo */}
        <div className="relative w-32 h-32 mb-7">
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 60%, #6366F1 75%, #8B5CF6 85%, #06B6D4 95%, transparent 100%)',
              padding: 2,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-full h-full rounded-full" style={{ background: 'rgb(var(--color-bg))' }} />
          </motion.div>

          {/* Counter-rotating dashed ring */}
          <motion.div
            className="absolute inset-1.5 rounded-full border border-dashed border-primary/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner glass square */}
          <motion.div
            className="absolute inset-4 rounded-2xl border border-primary/20"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))',
            }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-glow"
              animate={{ scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Plane className="w-7 h-7 text-white" style={{ transform: 'rotate(45deg)' }} />
            </motion.div>
          </div>

          {/* Orbiting icons */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-4 text-accent drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: -360 }}
            transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          >
            <MapPin className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 text-secondary drop-shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
          </motion.div>
        </div>

        {/* Staggered brand title */}
        <h1 className="text-4xl sm:text-[2.75rem] font-bold tracking-tight mb-1 flex justify-center">
          {(chars.length ? chars : TITLE_CHARS).map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              className={char === ' ' ? 'w-2' : 'gradient-text inline-block'}
              initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                delay: 0.1 + i * 0.06,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === ' ' ? '' : char}
            </motion.span>
          ))}
        </h1>

        <TitleLine tagline={tagline} />

        <motion.p
          className="text-text-secondary text-sm sm:text-[15px] max-w-[260px] leading-relaxed"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
        >
          {subtitle}
        </motion.p>

        {/* Shimmer progress track */}
        <motion.div
          className="mt-8 w-full max-w-[200px] h-1 rounded-full overflow-hidden bg-surface-2/40 border border-border/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.4 }}
        >
          <motion.div
            className="h-full w-1/3 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #6366F1, #8B5CF6, #06B6D4, transparent)' }}
            animate={{ x: ['-100%', '350%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <div className="flex gap-2 mt-5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
