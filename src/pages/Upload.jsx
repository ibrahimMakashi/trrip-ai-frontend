import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import {
  Upload as UploadIcon, FileText, Trash2, Sparkles, CheckCircle, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import UploadDropzone from '../components/UploadDropzone';
import { useGeneration } from '../context/GenerationContext';
import { uploadDocuments } from '../api/upload';
import { generateItinerary } from '../api/itinerary';
import TrripSpinner from '../components/TrripSpinner';

const STEPS = ['Upload Documents', 'Processing', 'Generate Itinerary'];

export default function Upload() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { startGeneration, stopGeneration } = useGeneration();
  const cancelledRef = useRef(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      toast.error('Please select at least one file');
      return;
    }
    setUploading(true);
    setStep(1);
    try {
      const result = await uploadDocuments(selectedFiles, (ev) => {
        const pct = Math.round((ev.loaded * 100) / ev.total);
        setUploadProgress(pct);
      });
      setUploadedDocs(result.documents);
      setStep(2);
      toast.success(`${result.documents.length} document(s) processed!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
      setStep(0);
    } finally {
      setUploading(false);
    }
  };

  const handleCancelGeneration = () => {
    cancelledRef.current = true;
    setIsGenerating(false);
    toast('Generation cancelled — you can try again.', { icon: '⏸️' });
  };

  const handleGenerate = async () => {
    if (!uploadedDocs.length) return;

    cancelledRef.current = false;
    setIsGenerating(true);
    startGeneration(handleCancelGeneration);

    try {
      const docIds = uploadedDocs.map((d) => d._id);
      const result = await generateItinerary(docIds);

      if (cancelledRef.current) return;

      stopGeneration();
      setIsGenerating(false);
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['itineraries'] });
      toast.success('Itinerary generated! ✈️');
      navigate(`/itinerary/${result.itinerary._id}`);
    } catch (err) {
      if (!cancelledRef.current) {
        toast.error(err.response?.data?.message || 'Generation failed. Please try again.');
      }
      stopGeneration();
      setIsGenerating(false);
    }
  };

  const resetUpload = () => {
    setSelectedFiles([]);
    setUploadedDocs([]);
    setStep(0);
    setUploadProgress(0);
  };

  return (
    <div className="page-container py-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Upload Travel Documents</h1>
        <p className="text-text-secondary">
          Upload your flight tickets, hotel bookings, or any travel confirmation
        </p>
      </motion.div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-shrink-0">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300
              ${i < step ? 'bg-success text-white' : i === step ? 'bg-primary text-white shadow-glow-sm' : 'bg-surface-2 text-text-muted'}`}
            >
              {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block whitespace-nowrap ${i === step ? 'text-text-primary' : 'text-text-muted'}`}>
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-8 sm:w-12 mx-1 flex-shrink-0 transition-colors duration-300 ${i < step ? 'bg-success' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="card">
              <UploadDropzone
                onFilesSelected={setSelectedFiles}
                uploading={uploading}
                uploadProgress={uploadProgress}
              />
            </div>

            <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                How it works
              </h4>
              <ol className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold mt-0.5">1.</span>
                  Your documents are securely uploaded to cloud storage
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold mt-0.5">2.</span>
                  AI extracts travel info — dates, destinations, bookings
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-semibold mt-0.5">3.</span>
                  GPT-4o-mini crafts your personalised day-by-day itinerary
                </li>
              </ol>
            </div>

            <button
              onClick={handleUpload}
              disabled={!selectedFiles.length || uploading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base"
            >
              <UploadIcon className="w-5 h-5" />
              Upload &amp; Process Documents
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="card text-center py-12 sm:py-16"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6 relative flex items-center justify-center">
              <TrripSpinner size={64} />
              <FileText className="absolute w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">Processing Documents</h3>
            <p className="text-sm sm:text-base text-text-secondary mb-5 sm:mb-6">Uploading to cloud and extracting text...</p>
            <div className="max-w-xs mx-auto">
              <div className="flex justify-between text-xs text-text-muted mb-2">
                <span>Progress</span><span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="generate"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-success" />
                <h3 className="font-semibold text-text-primary">Documents Processed Successfully</h3>
              </div>
              <div className="space-y-2.5">
                {uploadedDocs.map((doc) => (
                  <div key={doc._id} className="flex items-center gap-3 p-3 bg-surface-2 rounded-xl border border-border">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{doc.fileName}</p>
                      <p className="text-xs text-text-muted capitalize">{doc.fileType} · Processed</p>
                    </div>
                  </div>
                ))}
              </div>
              {uploadedDocs.some((d) => !d.extractedText) && (
                <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-xl mt-3">
                  <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-text-secondary">
                    Some documents had limited text extraction. AI will work with the available data.
                  </p>
                </div>
              )}
            </div>

            <div className="card border-primary/20 bg-primary/5">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Ready to Generate</h3>
                  <p className="text-text-secondary text-sm">
                    Click below to launch the AI and create your personalised day-by-day travel plan.
                    This takes 30–60 seconds — sit back and enjoy the show!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={resetUpload} className="btn-secondary flex items-center gap-2 flex-shrink-0" disabled={isGenerating}>
                <Trash2 className="w-4 h-4" />
                Start Over
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5 text-base"
              >
                <Sparkles className="w-5 h-5" />
                Generate AI Itinerary ✈️
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
