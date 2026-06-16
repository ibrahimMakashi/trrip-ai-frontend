import { motion } from 'framer-motion';
import { Sun, Sunset, Moon, StickyNote } from 'lucide-react';

const slots = [
  { key: 'morning', label: 'Morning', icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
  { key: 'afternoon', label: 'Afternoon', icon: Sunset, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
  { key: 'evening', label: 'Evening', icon: Moon, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
];

export default function TimelineDay({ day, isLast = false, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="relative pl-8"
    >
      <div className="absolute left-0 top-0 flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold shadow-glow-sm flex-shrink-0">
          {day.day}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/40 to-transparent min-h-full absolute top-8" />}
      </div>

      <div className="pb-8">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="font-semibold text-text-primary text-lg">Day {day.day}</h3>
          {day.date && (
            <span className="text-sm text-text-muted bg-surface-2 px-3 py-0.5 rounded-full border border-border">
              {day.date}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          {slots.map(({ key, label, icon: Icon, color, bg }) => (
            day[key] ? (
              <div key={key} className={`p-4 rounded-xl border ${bg}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className={`text-xs font-semibold ${color}`}>{label}</span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{day[key]}</p>
              </div>
            ) : null
          ))}
        </div>

        {day.notes && (
          <div className="flex gap-2 p-4 bg-primary/5 border border-primary/10 rounded-xl">
            <StickyNote className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary leading-relaxed">{day.notes}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
