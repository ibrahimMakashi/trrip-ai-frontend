import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  MapPin, Calendar, Clock, DollarSign, Plane, Hotel, Bus,
  Share2, Mail, Copy, Check, ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getSharedItinerary } from '../api/itinerary';
import AppLoader from '../components/AppLoader';
import TimelineDay from '../components/TimelineDay';

const formatDate = (d) => {
  if (!d) return 'N/A';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
};

export default function SharePage() {
  const { shareId } = useParams();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['shared-itinerary', shareId],
    queryFn: () => getSharedItinerary(shareId),
  });

  const itinerary = data?.itinerary;
  const shareUrl = window.location.href;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied!');
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Check out my travel itinerary: ${itinerary?.tripTitle}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Travel Itinerary: ${itinerary?.tripTitle}`);
    const body = encodeURIComponent(`Hey! Check out my travel itinerary for ${itinerary?.destination}.\n\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  if (isLoading) {
    return (
      <AppLoader
        title="TrripAi"
        tagline="AI Travel Planner"
        subtitle="Loading shared travel itinerary"
      />
    );
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-center px-4">
        <div>
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Itinerary Not Found</h2>
          <p className="text-text-secondary mb-6">
            This itinerary may not exist or sharing has been disabled.
          </p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Create Your Own Itinerary
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-glow-sm">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">TrripAi</span>
          </div>
          <Link to="/register" className="btn-primary text-sm py-2 px-4">
            Plan Your Trip
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-surface to-secondary/20 border border-border p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-3xl shadow-glow flex-shrink-0">
                {itinerary.destination?.substring(0, 1) || '✈'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-1">{itinerary.tripTitle}</h1>
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{itinerary.destination}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 bg-surface/50 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm text-text-secondary border border-border">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {formatDate(itinerary.startDate)} → {formatDate(itinerary.endDate)}
              </span>
              <span className="flex items-center gap-1.5 bg-surface/50 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm text-text-secondary border border-border">
                <Clock className="w-3.5 h-3.5 text-accent" />
                {itinerary.totalDays} days
              </span>
              {itinerary.budget && (
                <span className="flex items-center gap-1.5 bg-surface/50 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm text-text-secondary border border-border">
                  <DollarSign className="w-3.5 h-3.5 text-success" />
                  {itinerary.budget}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        <div className="card">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            Share This Itinerary
          </h3>
          <div className="flex items-center gap-2 p-3 bg-surface-2 rounded-xl border border-border mb-4">
            <span className="flex-1 text-sm text-text-secondary truncate">{shareUrl}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-sm rounded-lg transition-all flex-shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-sm font-medium rounded-xl border border-green-500/20 transition-all"
            >
              <span>📱</span> WhatsApp
            </button>
            <button
              onClick={handleEmail}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-medium rounded-xl border border-blue-500/20 transition-all"
            >
              <Mail className="w-4 h-4" /> Email
            </button>
          </div>
        </div>

        {(itinerary.flights?.length > 0 || itinerary.hotels?.length > 0 || itinerary.transportation?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {itinerary.flights?.length > 0 && (
              <div className="card">
                <div className="flex items-center gap-2 mb-3">
                  <Plane className="w-4 h-4 text-primary" />
                  <h3 className="font-medium text-text-primary text-sm">Flights ({itinerary.flights.length})</h3>
                </div>
                {itinerary.flights.slice(0, 2).map((f, i) => (
                  <div key={i} className="text-xs text-text-secondary p-2 bg-surface-2 rounded-lg mb-2">
                    <p className="font-medium text-text-primary">{f.from} → {f.to}</p>
                    <p>{f.airline} {f.flightNumber}</p>
                  </div>
                ))}
              </div>
            )}
            {itinerary.hotels?.length > 0 && (
              <div className="card">
                <div className="flex items-center gap-2 mb-3">
                  <Hotel className="w-4 h-4 text-secondary" />
                  <h3 className="font-medium text-text-primary text-sm">Hotels ({itinerary.hotels.length})</h3>
                </div>
                {itinerary.hotels.slice(0, 2).map((h, i) => (
                  <div key={i} className="text-xs text-text-secondary p-2 bg-surface-2 rounded-lg mb-2">
                    <p className="font-medium text-text-primary">{h.hotelName}</p>
                    <p>{h.checkIn} → {h.checkOut}</p>
                  </div>
                ))}
              </div>
            )}
            {itinerary.transportation?.length > 0 && (
              <div className="card">
                <div className="flex items-center gap-2 mb-3">
                  <Bus className="w-4 h-4 text-accent" />
                  <h3 className="font-medium text-text-primary text-sm">Transport ({itinerary.transportation.length})</h3>
                </div>
                {itinerary.transportation.slice(0, 2).map((t, i) => (
                  <div key={i} className="text-xs text-text-secondary p-2 bg-surface-2 rounded-lg mb-2">
                    <p className="font-medium text-text-primary capitalize">{t.type}</p>
                    <p>{t.from} → {t.to}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <div className="mb-6">
            <h2 className="section-title">Day-by-Day Itinerary</h2>
          </div>
          {itinerary.days?.map((day, i) => (
            <TimelineDay
              key={day.day}
              day={day}
              isLast={i === itinerary.days.length - 1}
              index={i}
            />
          ))}
        </div>

        <div className="card text-center py-8 border-primary/20 bg-primary/5">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">Plan your own trip with AI</h3>
          <p className="text-text-secondary text-sm mb-5 max-w-sm mx-auto">
            Upload your travel documents and get a personalized itinerary in minutes
          </p>
          <Link to="/register" className="btn-primary inline-flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}
