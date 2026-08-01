import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  X,
  Loader2,
  ImagePlus,
} from 'lucide-react';

/**
 * Lightbox viewer for vaccination documents with gallery navigation
 */
export default function VaccinationDocumentViewer({
  isOpen,
  onClose,
  documents = [],
  initialIndex = 0,
  onDelete,
  canDelete = false,
  isDeleting = false,
  canUploadMore = false,
  onUploadMore,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  if (!documents || documents.length === 0) {
    return null;
  }

  const currentDoc = documents[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? documents.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === documents.length - 1 ? 0 : prev + 1));
  };

  const handleDownload = () => {
    if (currentDoc?.document_url) {
      const link = document.createElement('a');
      link.href = currentDoc.document_url;
      link.download = currentDoc.file_name || 'vaccination-document.jpg';
      link.click();
    }
  };

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }
    if (onDelete && currentDoc?.id) {
      onDelete(currentDoc.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Vaccination Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div className="w-full bg-black rounded-lg overflow-hidden flex items-center justify-center" style={{ aspectRatio: '4/3' }}>
            {currentDoc?.document_url ? (
              <img
                src={currentDoc.document_url}
                alt="Vaccination document"
                className="w-full h-full object-contain"
              />
            ) : (
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            )}
          </div>

          {/* Info */}
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {currentDoc?.file_name && (
              <p>
                <span className="font-medium">File:</span> {currentDoc.file_name}
              </p>
            )}
            {currentDoc?.document_type && (
              <p>
                <span className="font-medium">Type:</span> {currentDoc.document_type}
              </p>
            )}
            {currentDoc?.uploaded_at && (
              <p>
                <span className="font-medium">Uploaded:</span>{' '}
                {new Date(currentDoc.uploaded_at).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Navigation and actions */}
          <div className="flex items-center justify-between gap-2">
            {/* Previous button */}
            {documents.length > 1 && (
              <Button
                onClick={handlePrevious}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </Button>
            )}

            {/* Counter */}
            {documents.length > 1 && (
              <span className="text-sm text-slate-500">
                {currentIndex + 1} of {documents.length}
              </span>
            )}

            {/* Next button */}
            {documents.length > 1 && (
              <Button
                onClick={handleNext}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Download button */}
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>

            {/* Upload More button */}
            {canUploadMore && onUploadMore && (
              <Button
                onClick={onUploadMore}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <ImagePlus className="w-4 h-4" />
                Add More
              </Button>
            )}

            {/* Delete button */}
            {canDelete && (
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </Button>
            )}

            {/* Close button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
