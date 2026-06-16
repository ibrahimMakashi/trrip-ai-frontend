import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSearch, Brain, Sparkles, Map, CheckCircle,
  Plane, Globe, X, AlertTriangle,
} from 'lucide-react';

const STEPS = [
  {
    icon: FileSearch,
    title: 'Reading your documents',
    subtitle: 'Scanning flight tickets, hotel bookings & travel confirmations...',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'rgba(6,182,212,0.25)',
  },
  {
    icon: Brain,
    title: 'Extracting travel details',
    subtitle: 'Identifying destinations, dates, check-ins & departures...',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.25)',
  },
  {
    icon: Sparkles,
    title: 'AI is crafting your plan',
    subtitle: 'GPT-4o-mini is designing your perfect day-by-day schedule...',
    gradient: 'from-indigo-500 to-primary',
    glow: 'rgba(99,102,241,0.25)',
  },
  {
    icon: Map,
    title: 'Organising your itinerary',
    subtitle: 'Sequencing activities, meals & experiences for each day...',
    gradient: 'from-orange-500 to-rose-500',
    glow: 'rgba(249,115,22,0.25)',
  },
  {
    icon: CheckCircle,
    title: 'Adding finishing touches',
    subtitle: 'Polishing your personalised travel plan — almost ready!',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.25)',
  },
];

const TRAVEL_TIPS = [
  '✈️  Always carry a portable charger — it could save your entire day.',
  '🗺️  Download offline maps before you fly. Connectivity is never guaranteed.',
  '💊  A small first-aid kit weighs almost nothing and is priceless.',
  '📸  The best photos happen when you wander off the tourist trail.',
  '💳  Notify your bank before travelling internationally.',
  '🌐  A local SIM card is usually cheaper than roaming charges.',
  '🎒  Roll your clothes to save space and reduce wrinkles.',
  '🕐  Arrive at airports at least 2 hours before domestic flights.',
  '🍜  Eat where the locals eat — always better and often cheaper.',
  '☀️  Travel insurance is worth every single penny.',
];

const DOT_COUNT = 20;

function FloatingDot({ delay, duration, x, y, size }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/10 pointer-events-none"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      animate={{ y: [0, -18, 0], opacity: [0.15, 0.45, 0.15], scale: [1, 1.25, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

function FlyingPlane() {
  return (
    <div className="absolute inset-x-0 top-[30%] pointer-events-none overflow-hidden">
      <motion.div
        initial={{ x: '-8%' }}
        animate={{ x: '108%' }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8 }}
        className="absolute flex items-center"
      >
        <Plane
          className="w-6 h-6 text-primary drop-shadow-lg"
          style={{ transform: 'rotate(45deg)' }}
        />
        <div
          className="ml-0.5 h-px w-14"
          style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.5), transparent)' }}
        />
      </motion.div>
      <div
        className="w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.12), transparent)' }}
      />
    </div>
  );
}

export default function GeneratingAnimation({ visible = true, onCancel, contained = false }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [dots] = useState(() =>
    Array.from({ length: DOT_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 14 + 5,
      delay: Math.random() * 3,
      duration: Math.random() * 3 + 2,
    }))
  );

  useEffect(() => {
    if (!visible) {
      setStepIndex(0);
      setShowCancelConfirm(false);
      return;
    }
    const stepTimer = setInterval(() => {
      setStepIndex((i) => (i < STEPS.length - 1 ? i + 1 : i));
    }, 4500);
    const tipTimer = setInterval(() => {
      setTipIndex((i) => (i + 1) % TRAVEL_TIPS.length);
    }, 5000);
    return () => { clearInterval(stepTimer); clearInterval(tipTimer); };
  }, [visible]);

  const step = STEPS[stepIndex];
  const StepIcon = step.icon;

  const handleCancelClick = () => setShowCancelConfirm(true);
  const handleConfirmCancel = () => { setShowCancelConfirm(false); onCancel?.(); };
  const handleDismissCancel = () => setShowCancelConfirm(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`${contained ? 'absolute' : 'fixed'} inset-0 z-30 flex items-center justify-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          {/* ── Glassmorphic backdrop — website is visible beneath ── */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'rgb(var(--color-bg) / 0.35)',
              backdropFilter: 'blur(20px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
            }}
          />

          {/* ── Subtle noise / texture to reinforce glass effect ── */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* ── Floating dots ── */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {dots.map((d) => <FloatingDot key={d.id} {...d} />)}
          </div>

          {/* ── Coloured glow behind card ── */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
              style={{ background: `radial-gradient(circle, ${step.glow} 0%, transparent 70%)` }}
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* ── Flying plane across the screen ── */}
          <FlyingPlane />

          {/* ── Main card ── */}
          <div
            className="relative z-10 w-full max-w-md mx-6 rounded-3xl border overflow-hidden"
            style={{
              background: 'rgb(var(--color-surface) / 0.6)',
              backdropFilter: 'blur(24px)',
              borderColor: 'rgb(var(--color-border) / 0.5)',
              boxShadow: `0 24px 64px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)`,
            }}
          >
            {/* Cancel confirm overlay inside the card */}
            <AnimatePresence>
              {showCancelConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl"
                  style={{ background: 'rgb(var(--color-bg) / 0.85)', backdropFilter: 'blur(8px)' }}
                >
                  <div className="text-center px-8">
                    <div className="w-14 h-14 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-warning/20">
                      <AlertTriangle className="w-7 h-7 text-warning" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">Cancel generation?</h3>
                    <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                      The AI is still working on your itinerary. If you cancel, you'll return to step 2 and can try again.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={handleDismissCancel}
                        className="btn-secondary text-sm py-2 px-5"
                      >
                        Keep Waiting
                      </button>
                      <button
                        onClick={handleConfirmCancel}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-error border border-error/30 rounded-xl hover:bg-error/10 transition-all"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Card content ── */}
            <div className="p-8 text-center">
              {/* Step icon */}
              <motion.div
                key={`icon-${stepIndex}`}
                initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                className="relative inline-block mb-5"
              >
                <div
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl mx-auto`}
                >
                  <StepIcon className="w-10 h-10 text-white" />
                </div>
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient}`}
                  style={{ opacity: 0.35 }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.35, 0, 0.35] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Title */}
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`title-${stepIndex}`}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-2xl font-bold text-text-primary mb-2"
                >
                  {step.title}
                </motion.h2>
              </AnimatePresence>

              {/* Subtitle */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`sub-${stepIndex}`}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.35, delay: 0.06 }}
                  className="text-text-secondary text-sm mb-7 leading-relaxed"
                >
                  {step.subtitle}
                </motion.p>
              </AnimatePresence>

              {/* Step dots */}
              <div className="flex items-center justify-center gap-3 mb-7">
                {STEPS.map((s, i) => {
                  const done   = i < stepIndex;
                  const active = i === stepIndex;
                  const SIcon  = s.icon;
                  return (
                    <motion.div
                      key={i}
                      className="relative"
                      title={s.title}
                      animate={active ? { scale: [1, 1.12, 1] } : {}}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500
                          ${done   ? 'bg-success/20 border border-success/30'
                          : active ? `bg-gradient-to-br ${s.gradient}`
                                   : 'bg-surface-2 border border-border'}`}
                      >
                        {done
                          ? <CheckCircle className="w-3.5 h-3.5 text-success" />
                          : <SIcon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-text-muted'}`} />
                        }
                      </div>
                      {active && (
                        <motion.div
                          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${step.gradient}`}
                          style={{ opacity: 0.4 }}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Pulsing dots loader */}
              <div className="flex gap-1.5 justify-center mb-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.22 }}
                  />
                ))}
              </div>

              {/* Travel tip */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`tip-${tipIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45 }}
                  className="px-4 py-3 rounded-2xl mb-5"
                  style={{
                    background: 'rgb(var(--color-surface-2) / 0.5)',
                    border: '1px solid rgb(var(--color-border) / 0.5)',
                  }}
                >
                  <p className="text-text-secondary text-xs leading-relaxed">
                    {TRAVEL_TIPS[tipIndex]}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Footer row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-text-muted text-xs">
                  <Globe className="w-3 h-3 flex-shrink-0" />
                  <span>Stay on this page • 30–60 secs</span>
                </div>
                {onCancel && (
                  <button
                    onClick={handleCancelClick}
                    className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors px-2 py-1 rounded-lg hover:bg-surface-2"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
