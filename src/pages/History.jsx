import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Filter, History as HistoryIcon, SortAsc, SortDesc, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { getItineraries, deleteItinerary, shareItinerary } from '../api/itinerary';
import ItineraryCard from '../components/ItineraryCard';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/LoadingSkeleton';
import useDebounce from '../hooks/useDebounce';

export default function History() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [destination, setDestination] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const limit = 9;

  const debouncedSearch = useDebounce(search, 350);
  const debouncedDestination = useDebounce(destination, 350);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedDestination, sort]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['itineraries', { search: debouncedSearch, destination: debouncedDestination, sort, page, limit }],
    queryFn: () => getItineraries({ search: debouncedSearch, destination: debouncedDestination, sort, page, limit }),
    keepPreviousData: true,
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this itinerary?')) return;
    try {
      await deleteItinerary(id);
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Itinerary deleted successfully');
    } catch {
      toast.error('Failed to delete itinerary');
    }
  };

  const handleShare = async (id) => {
    try {
      const result = await shareItinerary(id);
      const url = `${window.location.origin}/share/${result.shareId}`;
      await navigator.clipboard.writeText(url);
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Share link copied to clipboard!');
    } catch {
      toast.error('Failed to create share link');
    }
  };

  const itineraries = data?.itineraries || [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? itineraries.length;
  const pages = pagination?.pages ?? 1;

  return (
    <div className="page-container py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-text-primary mb-1">My Itineraries</h1>
        <p className="text-text-secondary">Browse, search, and manage all your AI-generated travel plans</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by title or destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 h-11"
          />
        </div>

        <div className="relative sm:w-56">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Filter by destination..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="input-field pl-10 h-11"
          />
        </div>

        <button
          onClick={() => setSort((s) => s === 'latest' ? 'oldest' : 'latest')}
          className="btn-secondary flex items-center gap-2 h-11 px-4 whitespace-nowrap"
        >
          {sort === 'latest' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
          {sort === 'latest' ? 'Newest First' : 'Oldest First'}
        </button>
      </motion.div>

      {!isLoading && itineraries.length > 0 && (
        <p className="text-text-muted text-sm">
          {total} itiner{total === 1 ? 'ary' : 'aries'} found
        </p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="card text-center py-10 text-error">
          Failed to load itineraries. Please refresh the page.
        </div>
      ) : itineraries.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title={search || destination ? 'No results found' : 'No itineraries yet'}
          description={
            search || destination
              ? 'Try adjusting your search or filter criteria'
              : 'Upload your travel documents to generate your first AI itinerary'
          }
          actionLabel={search || destination ? undefined : 'Upload Documents'}
          actionPath="/upload"
        />
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {itineraries.map((it, i) => (
              <ItineraryCard
                key={it._id}
                itinerary={it}
                onDelete={handleDelete}
                onShare={handleShare}
                index={i}
              />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-text-muted">
                Page <span className="text-text-primary font-semibold">{page}</span> of{' '}
                <span className="text-text-primary font-semibold">{pages}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="btn-secondary px-3 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                {/* Page numbers (compact) */}
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: pages }, (_, idx) => idx + 1)
                    .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) => (
                      p === '…' ? (
                        <span key={`dots-${i}`} className="px-2 text-text-muted">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-xl border transition-all text-sm font-medium
                            ${p === page
                              ? 'bg-primary/15 border-primary/30 text-primary'
                              : 'bg-surface-2 border-border text-text-secondary hover:text-text-primary hover:bg-surface'
                            }`}
                        >
                          {p}
                        </button>
                      )
                    ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page >= pages}
                  className="btn-secondary px-3 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
