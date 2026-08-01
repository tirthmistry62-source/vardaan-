import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, ImagePlus, Loader2 } from 'lucide-react';

/**
 * Modal for uploading vaccination documents/photos
 */
export default function VaccinationDocumentUpload({
  isOpen,
  onClose,
  onUpload,
  vaccineeName,
  isUploading = false,
  maxDocuments = 2,
  currentDocuments = 0,
}) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const canUpload = currentDocuments < maxDocuments;

  const getCurrentFile = () => selectedFiles[currentFileIndex] || null;
  const getCurrentPreview = () => {
    const file = getCurrentFile();
    if (!file) return null;
    return file.preview;
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process all selected files - create previews for all
    const filesArray = Array.from(files).slice(0, maxDocuments - currentDocuments);
    const processedFiles = filesArray.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            file,
            preview: event.target.result,
            name: file.name,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(processedFiles).then((files) => {
      setSelectedFiles(files);
      setCurrentFileIndex(0);
    });
  };

  const handleUploadCurrent = async () => {
    const current = getCurrentFile();
    if (!current) return;

    const result = await onUpload(current.file, 'photo');
    if (result) {
      // Move to next file or close
      const nextIndex = currentFileIndex + 1;
      if (nextIndex < selectedFiles.length) {
        setCurrentFileIndex(nextIndex);
      } else {
        // All files uploaded, close and reset
        setSelectedFiles([]);
        setCurrentFileIndex(0);
        onClose();
      }
    }
  };

  const hasMoreFiles = currentFileIndex < selectedFiles.length - 1;
  const currentFile = getCurrentFile();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Vaccination Documents</DialogTitle>
          <DialogDescription>
            Upload photos of {vaccineeName} certificate, receipt, or proof
            <br />
            <span className="text-xs text-slate-500 mt-1 inline-block">
              {currentDocuments}/{maxDocuments} documents
            </span>
          </DialogDescription>
        </DialogHeader>

        {!canUpload && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-200">
            Maximum {maxDocuments} documents per vaccine reached. Delete a document to upload another.
          </div>
        )}

        <div className="space-y-4">
          {/* Preview */}
          {getCurrentPreview() ? (
            <div className="relative w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={getCurrentPreview()}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-48 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600">
              <div className="text-center text-slate-500">
                <ImagePlus className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No images selected</p>
              </div>
            </div>
          )}

          {/* File counter when multiple files selected */}
          {selectedFiles.length > 1 && (
            <div className="text-sm text-slate-600 dark:text-slate-400 text-center">
              Showing image {currentFileIndex + 1} of {selectedFiles.length}
            </div>
          )}

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleGalleryClick}
              variant="outline"
              disabled={isUploading}
              className="gap-2"
            >
              <ImagePlus className="w-4 h-4" />
              Gallery
            </Button>
            <Button
              onClick={handleCameraClick}
              variant="outline"
              disabled={isUploading}
              className="gap-2"
            >
              <Camera className="w-4 h-4" />
              Camera
            </Button>
          </div>

          {/* Hidden file inputs - allow multiple selection */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Navigation buttons for multiple files */}
          {selectedFiles.length > 1 && (
            <div className="flex gap-2 justify-between">
              <Button
                onClick={() => setCurrentFileIndex(Math.max(0, currentFileIndex - 1))}
                variant="outline"
                disabled={isUploading || currentFileIndex === 0}
                className="text-xs"
              >
                ← Previous
              </Button>
              <Button
                onClick={() => setCurrentFileIndex(Math.min(selectedFiles.length - 1, currentFileIndex + 1))}
                variant="outline"
                disabled={isUploading || currentFileIndex === selectedFiles.length - 1}
                className="text-xs"
              >
                Next →
              </Button>
            </div>
          )}

          {/* Upload button */}
          <Button
            onClick={handleUploadCurrent}
            disabled={!currentFile || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : hasMoreFiles ? (
              `Upload & Next (${currentFileIndex + 1}/${selectedFiles.length})`
            ) : (
              `Upload Document${selectedFiles.length > 1 ? ' (Last)' : ''}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
