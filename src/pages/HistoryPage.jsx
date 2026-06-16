import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  Trash2,
  Eye,
  Plane,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { itineraryAPI } from '@/api';
import { AppLayout } from '@/layouts/AppLayout';
import { PageWrapper, staggerContainer, fadeInUp } from '@/components/ui/PageTransition';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { formatShortDate } from '@/utils/cn';

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [destination, setDestination] = useState('');
  const [sort, setSort] = useState('latest');
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['itineraries', search, destination, sort],
    queryFn: async () => {
      const response = await itineraryAPI.getAll({ search, destination, sort });
      return response.data.data.itineraries;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => itineraryAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Itinerary deleted');
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete');
    },
  });

  const itineraries = data || [];

  const uniqueDestinations = [...new Set(itineraries.map((i) => i.destination))].filter(Boolean);

  return (
    <AppLayout>
      <PageWrapper>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Trip History</h1>
            <p className="text-muted mt-2">Browse and manage all your generated itineraries</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                placeholder="Search itineraries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-11 pl-10 pr-8 rounded-xl border border-border bg-card/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none min-w-[180px]"
              >
                <option value="">All Destinations</option>
                {uniqueDestinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 px-4 rounded-xl border border-border bg-card/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[140px]"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="destination">By Destination</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400">Failed to load itineraries</p>
            </div>
          ) : itineraries.length === 0 ? (
            <div className="text-center py-20">
              <Plane className="h-16 w-16 text-muted mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold">No itineraries found</h3>
              <p className="text-muted mt-2">
                {search || destination
                  ? 'Try adjusting your filters'
                  : 'Upload travel documents to create your first itinerary'}
              </p>
              <Link to="/upload" className="inline-block mt-6">
                <Button variant="gradient">Upload Documents</Button>
              </Link>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {itineraries.map((itinerary) => (
                <motion.div key={itinerary._id} variants={fadeInUp}>
                  <Card className="group hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant={itinerary.isShared ? 'accent' : 'default'}>
                          {itinerary.isShared ? 'Shared' : 'Private'}
                        </Badge>
                        <span className="text-xs text-muted">
                          {formatShortDate(itinerary.createdAt)}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {itinerary.tripTitle}
                      </h3>

                      <div className="space-y-2 text-sm text-muted mb-6 flex-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          {itinerary.destination}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-secondary" />
                          {itinerary.startDate || 'N/A'} — {itinerary.endDate || 'N/A'}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link to={`/itinerary/${itinerary._id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => setDeleteId(itinerary._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Itinerary</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this itinerary? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 justify-end mt-4">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageWrapper>
    </AppLayout>
  );
}
