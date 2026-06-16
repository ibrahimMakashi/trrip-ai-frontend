import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Trash2, Share2, Eye } from 'lucide-react';

const destinationGradients = [
  'from-blue-500/20 to-cyan-500/20',
  'from-purple-500/20 to-pink-500/20',
  'from-orange-500/20 to-yellow-500/20',
  'from-green-500/20 to-teal-500/20',
  'from-red-500/20 to-orange-500/20',
  'from-indigo-500/20 to-blue-500/20',
];

const getGradient = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return destinationGradients[Math.abs(hash) % destinationGradients.length];
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

export default function ItineraryCard({ itinerary, onDelete, onShare, index = 0 }) {
  const navigate = useNavigate();
  const gradient = getGradient(itinerary.destination || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="card-hover group overflow-hidden"
    >
      <div className={`h-2 w-full bg-gradient-to-r ${gradient} mb-4 -mx-6 -mt-6 px-6 pt-6`} />

      <div className={`h-24 -mx-6 -mt-4 mb-4 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <div className="text-4xl">
          {itinerary.destination?.substring(0, 2).toUpperCase() || '✈️'}
        </div>
      </div>

      <h3 className="font-semibold text-text-primary text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
        {itinerary.tripTitle}
      </h3>

      <div className="flex items-center gap-1.5 text-text-secondary text-sm mb-3">
        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span className="truncate">{itinerary.destination}</span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-1.5 text-text-muted text-xs">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{formatDate(itinerary.startDate)} → {formatDate(itinerary.endDate)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted text-xs">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{itinerary.totalDays || 0} days planned</span>
        </div>
      </div>

      {itinerary.isShared && (
        <div className="mb-3">
          <span className="text-xs px-2 py-0.5 bg-success/10 text-success border border-success/20 rounded-full">
            Shared
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <button
          onClick={() => navigate(`/itinerary/${itinerary._id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-primary
          hover:bg-primary/10 rounded-lg transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </button>
        <button
          onClick={() => onShare?.(itinerary._id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-text-secondary
          hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
        <button
          onClick={() => onDelete?.(itinerary._id)}
          className="flex items-center justify-center p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
