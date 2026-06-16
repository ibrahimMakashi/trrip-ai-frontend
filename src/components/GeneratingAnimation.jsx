import { useEffect, useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Sparkles, X, AlertTriangle,
  FileSearch, Brain, Map, CheckCircle, Wand2, Lightbulb,
} from 'lucide-react';
import TrripSpinner from './TrripSpinner';

/* ─── Steps ─────────────────────────────────────────────────────────── */
const STEPS = [
  {
    icon: FileSearch,
    label: 'Reading Documents',
    desc: 'Scanning your flight tickets, hotel bookings & travel confirmations',
    gradient: 'from-blue-500 to-cyan-400',
    glow: 'rgba(6,182,212,0.3)',
    ring: '#06B6D4',
  },
  {
    icon: Brain,
    label: 'Extracting Details',
    desc: 'Identifying destinations, dates, check-in & departure times',
    gradient: 'from-violet-500 to-purple-500',
    glow: 'rgba(139,92,246,0.3)',
    ring: '#8B5CF6',
  },
  {
    icon: Wand2,
    label: 'AI Crafting Your Plan',
    desc: 'GPT-4o-mini is designing your perfect day-by-day schedule',
    gradient: 'from-indigo-500 to-primary',
    glow: 'rgba(99,102,241,0.3)',
    ring: '#6366F1',
  },
  {
    icon: Map,
    label: 'Organising Itinerary',
    desc: 'Sequencing activities, meals & experiences for each day',
    gradient: 'from-orange-500 to-rose-500',
    glow: 'rgba(249,115,22,0.3)',
    ring: '#F97316',
  },
  {
    icon: CheckCircle,
    label: 'Finishing Touches',
    desc: 'Polishing your personalised travel plan — almost ready!',
    gradient: 'from-emerald-500 to-teal-400',
    glow: 'rgba(16,185,129,0.3)',
    ring: '#10B981',
  },
];

/* ─── Travel facts / precautions ─────────────────────────────────────── */
const FACTS = [
  { emoji: '✈️', type: 'Tip', text: 'Always carry a portable charger — airports can drain your battery fast.' },
  { emoji: '🗺️', type: 'Tip', text: 'Download offline maps before you fly. Connectivity is never guaranteed abroad.' },
  { emoji: '💊', type: 'Safety', text: 'A small first-aid kit weighs almost nothing but is priceless in emergencies.' },
  { emoji: '📸', type: 'Fun Fact', text: 'The best travel photos happen when you wander 2 streets off the tourist trail.' },
  { emoji: '💳', type: 'Precaution', text: 'Notify your bank before travelling internationally to avoid card blocks.' },
  { emoji: '🌐', type: 'Tip', text: 'A local SIM card is usually 3× cheaper than your carrier\'s roaming rates.' },
  { emoji: '🎒', type: 'Tip', text: 'Roll your clothes instead of folding — saves up to 30% more packing space.' },
  { emoji: '🕐', type: 'Precaution', text: 'Arrive 2 hours early for domestic flights — security lines are unpredictable.' },
  { emoji: '🍜', type: 'Fun Fact', text: 'Eating where locals eat is almost always tastier and half the price.' },
  { emoji: '☀️', type: 'Safety', text: 'Travel insurance costs ~3% of trip value but can save you thousands.' },
  { emoji: '🔒', type: 'Precaution', text: 'Use a VPN on public airport Wi-Fi — they\'re prime targets for data theft.' },
  { emoji: '🌙', type: 'Fun Fact', text: 'The world\'s most punctual airline is Japan\'s ANA, averaging 1-min delays.' },
];

const TYPE_COLORS = {
  'Tip': 'text-primary bg-primary/10 border-primary/20',
  'Safety': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'Precaution': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Fun Fact': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
};

/* ─── Floating dots (deterministic so no hydration issues) ───────────── */
const DOTS = [
  { id: 0, x: 8,  y: 15, size: 4, delay: 0,   dur: 3.2 },
  { id: 1, x: 80, y: 20, size: 5, delay: 0.4, dur: 3.8 },
  { id: 2, x: 45, y: 6,  size: 3, delay: 0.9, dur: 2.7 },
  { id: 3, x: 90, y: 58, size: 4, delay: 1.3, dur: 3.5 },
  { id: 4, x: 12, y: 75, size: 6, delay: 0.2, dur: 4.1 },
  { id: 5, x: 65, y: 88, size: 3, delay: 1.6, dur: 2.5 },
  { id: 6, x: 30, y: 50, size: 4, delay: 0.7, dur: 3.9 },
  { id: 7, x: 93, y: 35, size: 5, delay: 1.1, dur: 3.3 },
];

export default function GeneratingAnimation({ visible = true, onCancel, contained = false }) {
  const gradId = useId().replace(/:/g, '');
  const [stepIdx, setStepIdx] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    if (!visible) {
      setStepIdx(0);
      setShowCancel(false);
      return undefined;
    }

    const stepTimer = setInterval(() => {
      setStepIdx((i) => (i < STEPS.length - 1 ? i + 1 : i));
    }, 4500);

    const factTimer = setInterval(() => {
      setFactIdx((i) => (i + 1) % FACTS.length);
    }, 5500);

    return () => {
      clearInterval(stepTimer);
      clearInterval(factTimer);
    };
  }, [visible]);

  const step = STEPS[stepIdx];
  const fact = FACTS[factIdx];
  const StepIcon = step.icon;

  const handleConfirm = () => {
    setShowCancel(false);
    onCancel?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="gen-overlay"
          className={`${contained ? 'absolute' : 'fixed'} inset-0 z-30 flex items-center justify-center overflow-hidden`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          {/* Glassmorphic backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: 'rgba(15,23,42,0.45)',
              backdropFilter: 'blur(22px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(22px) saturate(1.4)',
            }}
          />

          {/* Aurora orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-35"
              style={{
                background: `conic-gradient(from 180deg, ${step.glow}, rgba(139,92,246,0.2), rgba(6,182,212,0.12), ${step.glow})`,
                filter: 'blur(70px)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute top-1/3 left-1/4 w-[380px] h-[380px] rounded-full"
              style={{ background: `radial-gradient(circle, ${step.glow} 0%, transparent 70%)` }}
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              key={`orb-${stepIdx}`}
            />
          </div>

          {/* Floating dots */}
          {DOTS.map((d) => (
            <motion.div
              key={d.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: d.size,
                height: d.size,
                background: `radial-gradient(circle, ${step.ring}80, transparent)`,
              }}
              animate={{ y: [0, -14, 0], opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* Route path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={step.ring} stopOpacity="0" />
                <stop offset="50%" stopColor={step.ring} />
                <stop offset="100%" stopColor={step.ring} stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0 70 Q 28 40, 52 58 T 100 30"
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="0.5"
              strokeDasharray="2.5 4"
              animate={{ strokeDashoffset: [0, -25] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </svg>

          {/* ── Main card ── */}
          <motion.div
            className="relative z-10 w-full max-w-[360px] sm:max-w-[420px] mx-3 sm:mx-4 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.07]"
            style={{
              background: 'linear-gradient(145deg, rgba(30,41,59,0.85) 0%, rgba(15,23,42,0.92) 100%)',
              backdropFilter: 'blur(24px)',
              boxShadow: `0 30px 60px -16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 40px -8px ${step.glow}`,
            }}
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* ── Header: brand + spinner ── */}
            <div className="flex items-center justify-between px-5 sm:px-7 pt-5 sm:pt-7 pb-4 sm:pb-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                {/* Top spinner (same ring animation as AppLoader) */}
                <div className="flex-shrink-0">
                  <TrripSpinner size={34} />
                </div>

                <div>
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-text-muted mb-0.5">TrripAi</p>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-bold gradient-text leading-none">Generating Itinerary</h2>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-1 rounded-full bg-primary"
                          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {onCancel && (
                <button
                  type="button"
                  onClick={() => setShowCancel(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-text-muted hover:text-text-secondary hover:bg-surface-2/50 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* ── Active step ── */}
            <div className="px-5 sm:px-7 py-5 sm:py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stepIdx}
                  className="flex items-start gap-3 sm:gap-4"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.38, ease: 'easeOut' }}
                >
                  {/* Step icon */}
                  <div className="relative flex-shrink-0">
                    <motion.div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <StepIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.div>
                    <motion.div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient}`}
                      style={{ opacity: 0.4 }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  {/* Step text */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-text-primary font-semibold text-[13px] sm:text-[15px] leading-snug mb-1">{step.label}</p>
                    <p className="text-text-secondary text-[11px] sm:text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Step progress dots ── */}
            <div className="px-5 sm:px-7 pb-4 sm:pb-5">
              <div className="flex items-center gap-2">
                {STEPS.map((s, i) => {
                  const done = i < stepIdx;
                  const active = i === stepIdx;
                  const SIcon = s.icon;
                  return (
                    <motion.div
                      key={i}
                      className="relative"
                      animate={active ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-500 border
                          ${done   ? 'bg-success/15 border-success/25'
                          : active ? `bg-gradient-to-br ${s.gradient} border-transparent shadow-md`
                                   : 'bg-surface-2/50 border-border/50'}`}
                      >
                        {done
                          ? <CheckCircle className="w-3.5 h-3.5 text-success" />
                          : <SIcon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${active ? 'text-white' : 'text-text-muted'}`} />}
                      </div>
                      {active && (
                        <motion.div
                          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${s.gradient} opacity-30`}
                          animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  );
                })}

                {/* Progress bar fills remaining space */}
                <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-surface-2/40 border border-border/30 ml-1">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${step.ring}, #8B5CF6)` }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            {/* ── Travel fact ── */}
            <div className="px-5 sm:px-7 pb-5 sm:pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={factIdx}
                  className="rounded-2xl p-3 sm:p-4 border"
                  style={{
                    background: 'rgba(51,65,85,0.35)',
                    borderColor: 'rgba(51,65,85,0.6)',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${TYPE_COLORS[fact.type]}`}>
                        <Lightbulb className="w-2.5 h-2.5" />
                        {fact.type}
                      </div>
                    </div>
                    <p className="text-text-secondary text-[11px] sm:text-xs leading-relaxed flex-1">
                      <span className="mr-1.5">{fact.emoji}</span>
                      {fact.text}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            <div
              className="px-5 sm:px-7 py-3 border-t border-white/[0.05] flex items-center justify-between"
              style={{ background: 'rgba(15,23,42,0.4)' }}
            >
              <div className="flex items-center gap-1.5 text-text-muted text-[10px] sm:text-[11px]">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span>Stay on this page · 30–60 seconds</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-text-muted text-[11px]">
                <Sparkles className="w-3 h-3 text-accent" />
                <span>Powered by GPT-4o</span>
              </div>
            </div>
          </motion.div>

          {/* ── Cancel confirm ── */}
          <AnimatePresence>
            {showCancel && (
              <motion.div
                className="absolute inset-0 z-40 flex items-center justify-center px-4 sm:px-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)' }}
              >
                <motion.div
                  className="w-full max-w-sm rounded-2xl sm:rounded-3xl border border-border p-6 sm:p-8 text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30,41,59,0.98), rgba(15,23,42,0.99))',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
                  }}
                  initial={{ scale: 0.94, y: 14 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.94, y: 14 }}
                >
                  <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                    <AlertTriangle className="w-7 h-7 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Cancel generation?</h3>
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    The AI is still working on your itinerary. Cancelling now will return you to step 2 — you can try again anytime.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button type="button" onClick={() => setShowCancel(false)} className="btn-secondary text-sm py-2 px-5">
                      Keep Waiting
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-all"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
