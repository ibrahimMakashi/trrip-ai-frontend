import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Image, X, CheckCircle, Loader2 } from 'lucide-react';

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp'],
};

const MAX_SIZE = 10 * 1024 * 1024;

const FileIcon = ({ type }) => {
  if (type === 'application/pdf') return <FileText className="w-5 h-5 text-red-400" />;
  return <Image className="w-5 h-5 text-blue-400" />;
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function UploadDropzone({ onFilesSelected, uploading = false, uploadProgress = 0 }) {
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setFiles((prev) => {
      const newFiles = acceptedFiles.filter(
        (f) => !prev.some((p) => p.name === f.name && p.size === f.size)
      );
      const updated = [...prev, ...newFiles];
      onFilesSelected(updated);
      return updated;
    });
    setRejected(rejectedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    disabled: uploading,
  });

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesSelected(updated);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300
          ${isDragActive
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border hover:border-primary/50 hover:bg-surface-2/30'
          }
          ${uploading ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-colors
            ${isDragActive ? 'bg-primary/20' : 'bg-surface-2'}`}
          >
            <Upload className={`w-8 h-8 ${isDragActive ? 'text-primary' : 'text-text-muted'}`} />
          </div>
        </motion.div>

        {isDragActive ? (
          <p className="text-primary font-semibold text-lg">Drop your files here!</p>
        ) : (
          <>
            <p className="text-text-primary font-semibold text-lg mb-1">
              Drag & drop your travel documents
            </p>
            <p className="text-text-secondary text-sm mb-4">
              or click to browse files
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['PDF', 'PNG', 'JPG', 'JPEG', 'WEBP'].map((type) => (
                <span key={type} className="px-3 py-1 bg-surface-2 rounded-full text-xs text-text-secondary border border-border">
                  {type}
                </span>
              ))}
            </div>
            <p className="text-text-muted text-xs mt-3">Maximum file size: 10MB per file</p>
          </>
        )}
      </div>

      {rejected.length > 0 && (
        <div className="space-y-2">
          {rejected.map(({ file, errors }) => (
            <div key={file.name} className="flex items-center gap-3 p-3 bg-error/10 border border-error/20 rounded-xl text-sm">
              <X className="w-4 h-4 text-error flex-shrink-0" />
              <span className="text-text-primary font-medium">{file.name}</span>
              <span className="text-error text-xs">{errors[0]?.message}</span>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-text-secondary">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </p>
            {files.map((file, i) => (
              <motion.div
                key={`${file.name}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 p-3 bg-surface-2 rounded-xl border border-border group"
              >
                <FileIcon type={file.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
                  <p className="text-xs text-text-muted">{formatBytes(file.size)}</p>
                </div>
                {uploading ? (
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-error/10 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4 text-text-muted hover:text-error" />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading and processing documents...</span>
            </div>
            <span className="text-text-secondary">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
