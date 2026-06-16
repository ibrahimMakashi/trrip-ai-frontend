import { motion } from 'framer-motion';
import { Plane, MapPin, Sparkles } from 'lucide-react';

/**
 * Spinner visuals derived from `AppLoader`'s top ring:
 * conic gradient ring + dashed ring + rotating sparkles/map pin.
 */
export default function TrripSpinner({ size = 80 }) {
  // `AppLoader` uses a 128x128 spinner. Scale to desired size.
  const base = 128;
  const scale = Math.max(0.2, Math.min(1.25, size / base));

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size, transform: 'translateZ(0)' }}
    >
      <motion.div
        className="relative w-32 h-32"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center',
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 60%, #6366F1 75%, #8B5CF6 85%, #06B6D4 95%, transparent 100%)',
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

        {/* Plane icon */}
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
      </motion.div>
    </div>
  );
}

