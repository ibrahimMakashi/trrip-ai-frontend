import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Map, Share2, Zap, Upload, ArrowRight, Plane } from 'lucide-react';
import { getDashboardStats } from '../api/itinerary';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/StatsCard';
import ItineraryCard from '../components/ItineraryCard';
import EmptyState from '../components/EmptyState';
import { StatsSkeleton, CardSkeleton } from '../components/LoadingSkeleton';
import { deleteItinerary, shareItinerary } from '../api/itinerary';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this itinerary?')) return;
    try {
      await deleteItinerary(id);
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Itinerary deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleShare = async (id) => {
    try {
      const result = await shareItinerary(id);
      const url = `${window.location.origin}/share/${result.shareId}`;
      await navigator.clipboard.writeText(url);
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Share link copied to clipboard!');
    } catch {
      toast.error('Failed to create share link');
    }
  };

  const stats = [
    { icon: Map, label: 'Total Trips', value: data?.totalTrips, gradient: 'from-primary to-secondary', delay: 0 },
    { icon: Share2, label: 'Shared Trips', value: data?.sharedTrips, gradient: 'from-accent to-blue-500', delay: 0.05 },
    { icon: Zap, label: 'Generated Itineraries', value: data?.generatedItineraries, gradient: 'from-orange-400 to-pink-500', delay: 0.1 },
  ];

  return (
    <div className="page-container py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-text-secondary mt-1">Here's an overview of your travel plans</p>
        </div>
        <button onClick={() => navigate('/upload')} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Upload className="w-4 h-4" />
          Plan New Trip
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading
          ? [1, 2, 3].map((i) => <StatsSkeleton key={i} />)
          : stats.map((s) => <StatsCard key={s.label} {...s} />)
        }
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card border-dashed border-primary/30 hover:border-primary/60 transition-colors cursor-pointer group"
        onClick={() => navigate('/upload')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
              <Upload className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary text-lg">Upload Travel Documents</h3>
              <p className="text-text-secondary text-sm">
                Upload PDFs or images of flight tickets, hotel bookings, and more
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </motion.div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="section-title">Recent Itineraries</h2>
            <p className="section-subtitle">Your latest AI-generated travel plans</p>
          </div>
          {(data?.recentItineraries?.length ?? 0) > 0 && (
            <button onClick={() => navigate('/history')} className="btn-ghost flex items-center gap-1 text-sm">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="card text-center py-8 text-error">Failed to load data. Please refresh.</div>
        ) : (data?.recentItineraries?.length ?? 0) === 0 ? (
          <EmptyState
            icon={Plane}
            title="No itineraries yet"
            description="Upload your first travel documents to generate an AI-powered itinerary"
            actionLabel="Upload Documents"
            actionPath="/upload"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.recentItineraries.map((it, i) => (
              <ItineraryCard
                key={it._id}
                itinerary={it}
                onDelete={handleDelete}
                onShare={handleShare}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
