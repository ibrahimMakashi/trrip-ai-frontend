import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, Clock, DollarSign, Plane, Hotel,
  Bus, Share2, Download, Trash2, Loader2, Copy, Check,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getItinerary, deleteItinerary, shareItinerary } from '../api/itinerary';
import TimelineDay from '../components/TimelineDay';
import { TimelineSkeleton } from '../components/LoadingSkeleton';

const InfoBadge = ({ icon: Icon, label, value, color = 'text-primary' }) => (
  <div className="flex items-center gap-3 p-4 bg-surface-2 rounded-xl border border-border">
    <div className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div>
      <p className="text-text-muted text-xs">{label}</p>
      <p className="text-text-primary font-medium text-sm">{value || 'N/A'}</p>
    </div>
  </div>
);

const formatDate = (d) => {
  if (!d) return 'N/A';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
};

export default function ItineraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['itinerary', id],
    queryFn: () => getItinerary(id),
  });

  const itinerary = data?.itinerary;

  const handleDelete = async () => {
    if (!window.confirm('Delete this itinerary? This cannot be undone.')) return;
    try {
      await deleteItinerary(id);
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Itinerary deleted');
      navigate('/history');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleShare = async () => {
    try {
      const result = await shareItinerary(id);
      const url = `${window.location.origin}/share/${result.shareId}`;
      await navigator.clipboard.writeText(url);
      queryClient.invalidateQueries({ queryKey: ['itinerary', id] });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Share link copied!');
    } catch {
      toast.error('Failed to create share link');
    }
  };

  const handleExportPDF = async () => {
    if (!itinerary) return;
    setExporting(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 20;
      let y = margin;

      doc.setFillColor(99, 102, 241);
      doc.rect(0, 0, pageW, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(itinerary.tripTitle || 'Travel Itinerary', margin, 20);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(itinerary.destination || '', margin, 30);
      y = 55;

      doc.setTextColor(60, 60, 80);
      doc.setFontSize(10);
      const infoRows = [
        ['Destination', itinerary.destination || 'N/A'],
        ['Start Date', formatDate(itinerary.startDate)],
        ['End Date', formatDate(itinerary.endDate)],
        ['Total Days', String(itinerary.totalDays || 0)],
        ['Budget', itinerary.budget || 'N/A'],
      ];
      doc.autoTable({
        startY: y,
        head: [['Field', 'Details']],
        body: infoRows,
        theme: 'striped',
        headStyles: { fillColor: [99, 102, 241] },
        margin: { left: margin, right: margin },
      });
      y = doc.lastAutoTable.finalY + 10;

      if (itinerary.days?.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(99, 102, 241);
        doc.text('Day-by-Day Itinerary', margin, y);
        y += 8;

        for (const day of itinerary.days) {
          // If we're near the bottom, start the day on a new page for cleaner splits.
          if (y > 255) {
            doc.addPage();
            y = margin;
          }

          // Day title (separate from the table so columns stay consistent)
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 41, 59);
          doc.text(`Day ${day.day}${day.date ? ` — ${day.date}` : ''}`, margin, y);
          y += 6;

          const rows = [
            day.morning ? ['Morning', day.morning] : null,
            day.afternoon ? ['Afternoon', day.afternoon] : null,
            day.evening ? ['Evening', day.evening] : null,
            day.notes ? ['Notes', day.notes] : null,
          ].filter(Boolean);

          doc.autoTable({
            startY: y,
            head: [['Time', 'Details']],
            body: rows.length ? rows : [['—', 'No details provided']],
            theme: 'grid',
            margin: { left: margin, right: margin },
            headStyles: { fillColor: [30, 41, 59], textColor: [248, 250, 252] },
            styles: { fontSize: 9.5, cellPadding: 3, overflow: 'linebreak' },
            columnStyles: {
              0: { fontStyle: 'bold', cellWidth: 32 },
              1: { cellWidth: 'auto' },
            },
            pageBreak: 'auto',
          });

          y = doc.lastAutoTable.finalY + 8;
        }
      }

      doc.save(`${itinerary.tripTitle || 'itinerary'}.pdf`);
      toast.success('PDF exported successfully!');
    } catch (err) {
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container py-8">
        <div className="h-8 bg-surface-2 rounded w-48 mb-6 animate-pulse" />
        <div className="h-32 bg-surface-2 rounded-2xl mb-6 animate-pulse" />
        <TimelineSkeleton />
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="page-container py-8 text-center">
        <p className="text-error">Failed to load itinerary.</p>
        <button onClick={() => navigate('/history')} className="btn-secondary mt-4">Go Back</button>
      </div>
    );
  }

  return (
    <div className="page-container py-8 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button onClick={() => navigate('/history')} className="btn-ghost flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleShare} className="btn-secondary flex items-center gap-2 text-sm">
            {copied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Share'}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export PDF
          </button>
          <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-xl border border-error/20 transition-all">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-surface to-secondary/20 border border-border p-8"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="relative z-10">
          <div className="flex items-start gap-4">
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
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoBadge icon={Calendar} label="Start Date" value={formatDate(itinerary.startDate)} color="text-primary" />
        <InfoBadge icon={Calendar} label="End Date" value={formatDate(itinerary.endDate)} color="text-secondary" />
        <InfoBadge icon={Clock} label="Total Days" value={`${itinerary.totalDays} days`} color="text-accent" />
        <InfoBadge icon={DollarSign} label="Budget" value={itinerary.budget} color="text-success" />
      </div>

      {(itinerary.flights?.length > 0 || itinerary.hotels?.length > 0 || itinerary.transportation?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {itinerary.flights?.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Plane className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-text-primary">Flights</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{itinerary.flights.length}</span>
              </div>
              <div className="space-y-3">
                {itinerary.flights.map((f, i) => (
                  <div key={i} className="p-3 bg-surface-2 rounded-xl border border-border text-sm">
                    <div className="flex items-center gap-2 font-medium text-text-primary mb-1">
                      <span>{f.from || '?'}</span>
                      <ArrowRight className="w-3 h-3 text-text-muted" />
                      <span>{f.to || '?'}</span>
                    </div>
                    <p className="text-text-muted text-xs">{f.airline || ''} {f.flightNumber || ''}</p>
                    <p className="text-text-muted text-xs">{f.date || ''} {f.time || ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {itinerary.hotels?.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Hotel className="w-5 h-5 text-secondary" />
                <h3 className="font-semibold text-text-primary">Hotels</h3>
                <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">{itinerary.hotels.length}</span>
              </div>
              <div className="space-y-3">
                {itinerary.hotels.map((h, i) => (
                  <div key={i} className="p-3 bg-surface-2 rounded-xl border border-border text-sm">
                    <p className="font-medium text-text-primary mb-1">{h.hotelName || 'Hotel'}</p>
                    <p className="text-text-muted text-xs">Check-in: {h.checkIn || 'N/A'}</p>
                    <p className="text-text-muted text-xs">Check-out: {h.checkOut || 'N/A'}</p>
                    {h.roomType && <p className="text-text-muted text-xs">{h.roomType}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {itinerary.transportation?.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Bus className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-text-primary">Transportation</h3>
                <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{itinerary.transportation.length}</span>
              </div>
              <div className="space-y-3">
                {itinerary.transportation.map((t, i) => (
                  <div key={i} className="p-3 bg-surface-2 rounded-xl border border-border text-sm">
                    <p className="font-medium text-text-primary capitalize mb-1">{t.type || 'Transport'}</p>
                    <p className="text-text-muted text-xs">{t.from} → {t.to}</p>
                    <p className="text-text-muted text-xs">{t.date || ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <div className="mb-6">
          <h2 className="section-title">Day-by-Day Itinerary</h2>
          <p className="section-subtitle">Your complete travel schedule</p>
        </div>

        {itinerary.days?.length > 0 ? (
          <div>
            {itinerary.days.map((day, i) => (
              <TimelineDay
                key={day.day}
                day={day}
                isLast={i === itinerary.days.length - 1}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-10 text-text-muted">
            No day-by-day schedule was generated.
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowRight({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}
