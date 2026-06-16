import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Image,
  X,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadAPI, itineraryAPI } from '@/api';
import { AppLayout } from '@/layouts/AppLayout';
import { PageWrapper } from '@/components/ui/PageTransition';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export default function UploadPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [step, setStep] = useState('upload');

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadAPI.uploadFiles(files, setUploadProgress);
      const documents = response.data.data.documents;
      setUploadedDocs(documents);
      setStep('generate');
      toast.success(`${documents.length} document(s) uploaded successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (uploadedDocs.length === 0) {
      toast.error('No documents to process');
      return;
    }

    setGenerating(true);
    try {
      const documentIds = uploadedDocs.map((doc) => doc._id);
      const response = await itineraryAPI.generate(documentIds);
      const itinerary = response.data.data.itinerary;
      toast.success('Itinerary generated successfully!');
      navigate(`/itinerary/${itinerary._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate itinerary');
    } finally {
      setGenerating(false);
    }
  };

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return FileText;
    return Image;
  };

  return (
    <AppLayout>
      <PageWrapper>
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Upload Documents</h1>
            <p className="text-muted mt-2">
              Upload your travel bookings and let AI create your itinerary
            </p>
          </div>

          <div className="flex items-center gap-4">
            {['upload', 'generate'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    step === s || (step === 'generate' && s === 'upload')
                      ? 'bg-primary text-white'
                      : 'bg-card text-muted'
                  )}
                >
                  {step === 'generate' && s === 'upload' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={cn('text-sm', step === s ? 'text-foreground' : 'text-muted')}>
                  {s === 'upload' ? 'Upload Files' : 'Generate Itinerary'}
                </span>
                {i === 0 && <div className="w-12 h-px bg-border mx-2" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Travel Documents</CardTitle>
                    <CardDescription>
                      Drag and drop your files or click to browse. Supports PDF, PNG, JPG, WEBP
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div
                      {...getRootProps()}
                      className={cn(
                        'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300',
                        isDragActive
                          ? 'border-primary bg-primary/10 scale-[1.02]'
                          : 'border-border hover:border-primary/50 hover:bg-card/50'
                      )}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center">
                        <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        {isDragActive ? (
                          <p className="text-primary font-medium">Drop files here...</p>
                        ) : (
                          <>
                            <p className="font-medium">Drag & drop files here</p>
                            <p className="text-sm text-muted mt-1">or click to select files</p>
                          </>
                        )}
                        <p className="text-xs text-muted mt-3">Max 10MB per file • Up to 10 files</p>
                      </div>
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{files.length} file(s) selected</p>
                        {files.map((file, index) => {
                          const Icon = getFileIcon(file.type);
                          return (
                            <div
                              key={`${file.name}-${index}`}
                              className="flex items-center justify-between p-3 rounded-xl bg-card/50 border border-border/50"
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                                  <p className="text-xs text-muted">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => removeFile(index)}
                                className="p-1 hover:text-red-400 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {uploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-2 bg-card rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-hero-gradient"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      variant="gradient"
                      className="w-full"
                      onClick={handleUpload}
                      disabled={files.length === 0 || uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload Documents'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'generate' && (
              <motion.div
                key="generate"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Ready to Generate
                    </CardTitle>
                    <CardDescription>
                      Your documents have been processed. Click below to generate your AI itinerary.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      {uploadedDocs.map((doc) => (
                        <div
                          key={doc._id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                        >
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{doc.fileName}</p>
                            <p className="text-xs text-muted">
                              {doc.extractedText
                                ? 'Text extracted successfully'
                                : 'Uploaded (limited text extraction)'}
                            </p>
                          </div>
                          <Badge variant="accent">Ready</Badge>
                        </div>
                      ))}
                    </div>

                    {uploadedDocs.some((d) => !d.extractedText) && (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                        <AlertCircle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-200/80">
                          Some documents had limited text extraction. Results may vary based on
                          document quality.
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setStep('upload')} className="flex-1">
                        Upload More
                      </Button>
                      <Button
                        variant="gradient"
                        onClick={handleGenerate}
                        disabled={generating}
                        className="flex-1"
                      >
                        {generating ? (
                          <>
                            <Sparkles className="h-4 w-4 animate-pulse" />
                            Generating Itinerary...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Generate Itinerary
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageWrapper>
    </AppLayout>
  );
}
