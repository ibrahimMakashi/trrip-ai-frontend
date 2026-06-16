import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Share2,
  Sparkles,
  Upload,
  ArrowRight,
  Plane,
} from 'lucide-react';
import { authAPI } from '@/api';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/layouts/AppLayout';
import { PageWrapper, staggerContainer, fadeInUp } from '@/components/ui/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { formatShortDate } from '@/utils/cn';

const statCards = [
  { key: 'totalTrips', label: 'Total Trips', icon: Plane, color: 'from-primary to-primary/50' },
  { key: 'sharedTrips', label: 'Shared Trips', icon: Share2, color: 'from-secondary to-secondary/50' },
  {
    key: 'generatedItineraries',
    label: 'Generated Itineraries',
    icon: Sparkles,
    color: 'from-accent to-accent/50',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await authAPI.getDashboard();
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <p className="text-red-400">Failed to load dashboard</p>
        </div>
      </AppLayout>
    );
  }

  const recentItineraries = data?.recentItineraries || [];

  return (
    <AppLayout>
      <PageWrapper>
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
          <motion.div variants={fadeInUp} className="relative overflow-hidden rounded-2xl glass-card p-8">
            <div className="absolute inset-0 bg-hero-gradient opacity-10" />
            <div className="relative">
              <h1 className="text-3xl font-bold">
                Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
              </h1>
              <p className="text-muted mt-2 text-lg">
                Upload your travel documents and let AI craft your perfect itinerary
              </p>
              <Link to="/upload" className="inline-block mt-6">
                <Button variant="gradient" size="lg">
                  <Upload className="h-5 w-5" />
                  Upload Documents
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.key}
                  className="group hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted">{stat.label}</p>
                        <p className="text-3xl font-bold mt-1">{data?.[stat.key] || 0}</p>
                      </div>
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:border-primary/20 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Recent Itineraries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentItineraries.length === 0 ? (
                  <div className="text-center py-8">
                    <Plane className="h-12 w-12 text-muted mx-auto mb-3 opacity-50" />
                    <p className="text-muted">No itineraries yet</p>
                    <p className="text-sm text-muted/70 mt-1">Upload documents to generate your first trip</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentItineraries.map((itinerary) => (
                      <Link
                        key={itinerary._id}
                        to={`/itinerary/${itinerary._id}`}
                        className="flex items-center justify-between p-4 rounded-xl bg-card/50 hover:bg-card border border-transparent hover:border-primary/20 transition-all group"
                      >
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors">
                            {itinerary.tripTitle}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {itinerary.destination}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatShortDate(itinerary.createdAt)}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="gradient-border hover:shadow-lg hover:shadow-primary/10 transition-all">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[280px]">
                <div className="h-16 w-16 rounded-2xl bg-hero-gradient flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Travel Documents</h3>
                <p className="text-muted text-sm mb-6 max-w-xs">
                  Drop your flight tickets, hotel bookings, and travel confirmations. Our AI will
                  create a complete itinerary.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  <Badge>PDF</Badge>
                  <Badge variant="secondary">PNG</Badge>
                  <Badge variant="accent">JPG</Badge>
                  <Badge>WEBP</Badge>
                </div>
                <Link to="/upload">
                  <Button variant="gradient">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </PageWrapper>
    </AppLayout>
  );
}
