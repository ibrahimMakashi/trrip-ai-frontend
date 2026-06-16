import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  DollarSign,
  Plane,
  Hotel,
  Bus,
  Share2,
  Download,
  Copy,
  MessageCircle,
  Mail,
  ArrowLeft,
  Sun,
  Sunset,
  Moon,
  StickyNote,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { itineraryAPI, shareAPI } from '@/api';
import { AppLayout } from '@/layouts/AppLayout';
import { PageWrapper, fadeInUp, staggerContainer } from '@/components/ui/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { exportItineraryToPDF } from '@/utils/exportPDF';

export default function ItineraryDetailsPage() {
  const { id } = useParams();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['itinerary', id],
    queryFn: async () => {
      const response = await itineraryAPI.getById(id);
      return response.data.data.itinerary;
    },
  });

  const shareMutation = useMutation({
    mutationFn: () => shareAPI.createShareLink(id),
    onSuccess: (response) => {
      setShareUrl(response.data.data.shareUrl);
      setShareDialogOpen(true);
      toast.success('Share link created!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create share link');
    },
  });

  if (isLoading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <p className="text-red-400 mb-4">Itinerary not found</p>
          <Link to="/history">
            <Button variant="outline">Back to History</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const itineraryData = data.itinerary || data;
  const travelInfo = data.travelInfo || {};
  const days = itineraryData.days || [];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out my travel itinerary: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Travel Itinerary: ${data.tripTitle}`);
    const body = encodeURIComponent(`Check out my travel itinerary:\n\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleExportPDF = () => {
    exportItineraryToPDF(data);
    toast.success('PDF downloaded!');
  };

  return (
    <AppLayout>
      <PageWrapper>
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              to="/history"
              className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to History
            </Link>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
              <Button
                variant="gradient"
                onClick={() => shareMutation.mutate()}
                disabled={shareMutation.isPending}
              >
                <Share2 className="h-4 w-4" />
                {shareMutation.isPending ? 'Creating...' : 'Share'}
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl glass-card p-8"
          >
            <div className="absolute inset-0 bg-hero-gradient opacity-5" />
            <div className="relative">
              <Badge className="mb-4">{itineraryData.totalDays || days.length} Days</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {data.tripTitle || itineraryData.tripTitle}
              </h1>
              <div className="flex flex-wrap gap-6 text-muted">
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {data.destination || itineraryData.destination}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-secondary" />
                  {data.startDate} — {data.endDate}
                </span>
                {(data.budget || itineraryData.budget) && (
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    {data.budget || itineraryData.budget}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {(travelInfo.flights?.length > 0 ||
            travelInfo.hotels?.length > 0 ||
            travelInfo.transportation?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {travelInfo.flights?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Plane className="h-5 w-5 text-primary" />
                      Flights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {travelInfo.flights.map((flight, i) => (
                      <p key={i} className="text-sm text-muted p-2 rounded-lg bg-card/50">
                        {typeof flight === 'string' ? flight : JSON.stringify(flight)}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              )}
              {travelInfo.hotels?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Hotel className="h-5 w-5 text-secondary" />
                      Hotels
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {travelInfo.hotels.map((hotel, i) => (
                      <p key={i} className="text-sm text-muted p-2 rounded-lg bg-card/50">
                        {typeof hotel === 'string' ? hotel : JSON.stringify(hotel)}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              )}
              {travelInfo.transportation?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Bus className="h-5 w-5 text-accent" />
                      Transportation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {travelInfo.transportation.map((item, i) => (
                      <p key={i} className="text-sm text-muted p-2 rounded-lg bg-card/50">
                        {typeof item === 'string' ? item : JSON.stringify(item)}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-6">Day-by-Day Timeline</h2>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="relative space-y-0"
            >
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent hidden md:block" />

              {days.map((day, index) => (
                <motion.div key={day.day || index} variants={fadeInUp} className="relative md:pl-16 pb-8">
                  <div className="absolute left-4 top-6 h-4 w-4 rounded-full bg-primary border-4 border-background hidden md:block z-10" />

                  <Card className="hover:border-primary/20 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-hero-gradient flex items-center justify-center text-white font-bold">
                          {day.day}
                        </div>
                        <div>
                          <h3 className="font-semibold">Day {day.day}</h3>
                          {day.date && <p className="text-sm text-muted">{day.date}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {day.morning && (
                          <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                            <div className="flex items-center gap-2 mb-2">
                              <Sun className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm font-medium text-yellow-400">Morning</span>
                            </div>
                            <p className="text-sm text-muted">{day.morning}</p>
                          </div>
                        )}
                        {day.afternoon && (
                          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                            <div className="flex items-center gap-2 mb-2">
                              <Sunset className="h-4 w-4 text-orange-400" />
                              <span className="text-sm font-medium text-orange-400">Afternoon</span>
                            </div>
                            <p className="text-sm text-muted">{day.afternoon}</p>
                          </div>
                        )}
                        {day.evening && (
                          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                            <div className="flex items-center gap-2 mb-2">
                              <Moon className="h-4 w-4 text-indigo-400" />
                              <span className="text-sm font-medium text-indigo-400">Evening</span>
                            </div>
                            <p className="text-sm text-muted">{day.evening}</p>
                          </div>
                        )}
                      </div>

                      {day.notes && (
                        <div className="mt-4 p-3 rounded-xl bg-card/50 flex items-start gap-2">
                          <StickyNote className="h-4 w-4 text-muted shrink-0 mt-0.5" />
                          <p className="text-sm text-muted italic">{day.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Itinerary</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="flex gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 h-10 px-3 rounded-xl border border-border bg-card/50 text-sm"
                />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleWhatsAppShare}>
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleEmailShare}>
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </PageWrapper>
    </AppLayout>
  );
}
