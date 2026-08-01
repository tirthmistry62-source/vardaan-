import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Calendar,
  Droplets,
  Building2,
  Phone,
  User,
  Plus,
} from 'lucide-react';
import VaccinationDocumentUpload from './VaccinationDocumentUpload';
import VaccinationDocumentViewer from './VaccinationDocumentViewer';
import { useVaccinationDocuments } from '@/hooks/useVaccinationDocuments';

/**
 * Vaccine card component with document upload and viewing support
 * Displays vaccine details with integrated document management
 * Used in child profile pages (both parent and doctor views)
 */
export default function VaccineCardWithDocuments({
  vaccine,
  canUpload = false,
  onDocumentAdded,
}) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [documents, setDocuments] = useState(vaccine.documents || []);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);

  const { uploadDocument, deleteDocument, uploading } = useVaccinationDocuments();

  // Update documents when vaccine changes
  useEffect(() => {
    setDocuments(vaccine.documents || []);
  }, [vaccine.documents]);

  const handleUpload = async (file, docType) => {
    const result = await uploadDocument(vaccine.id, file, docType);
    if (result) {
      // Add to local documents
      setDocuments((prev) => [
        ...prev,
        {
          id: result.id,
          document_url: result.document_url,
          document_type: docType,
          file_name: file.name,
          uploaded_at: new Date().toISOString(),
        },
      ]);
      if (onDocumentAdded) {
        onDocumentAdded(vaccine.id);
      }
    }
  };

  const handleDelete = async (docId) => {
    if (confirm('Delete this document?')) {
      await deleteDocument(docId, vaccine.id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
    }
  };

  const handleViewDocument = (index) => {
    setSelectedDocIndex(index);
    setShowViewerModal(true);
  };

  const dateGiven = vaccine.date_given
    ? new Date(vaccine.date_given).toLocaleDateString()
    : 'Not recorded';

  return (
    <>
      <Card className="p-4 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {vaccine.vaccine_name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {vaccine.dose}
            </p>
          </div>
          {vaccine.is_historical && (
            <Badge variant="secondary" className="shrink-0">
              Historical
            </Badge>
          )}
        </div>

        {/* Date and weight */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>{dateGiven}</span>
          </div>
          {vaccine.weight_kg && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Droplets className="w-4 h-4" />
              <span>{vaccine.weight_kg} kg</span>
            </div>
          )}
        </div>

        {/* Doctor info (if available) */}
        {vaccine.doctor_name && (
          <div className="space-y-1 mb-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {vaccine.doctor_name}
              </span>
            </div>
            {vaccine.clinic_name && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Building2 className="w-3.5 h-3.5" />
                <span>{vaccine.clinic_name}</span>
              </div>
            )}
            {vaccine.doctor_phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Phone className="w-3.5 h-3.5" />
                <span>{vaccine.doctor_phone}</span>
              </div>
            )}
          </div>
        )}

        {vaccine.remarks && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 italic">
            {vaccine.remarks}
          </p>
        )}

        {/* Documents section */}
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="w-4 h-4" />
              <span>
                Documents {documents.length > 0 && `(${documents.length})`}
              </span>
            </div>
            {canUpload && (
              <Button
                onClick={() => setShowUploadModal(true)}
                size="sm"
                variant="outline"
                className="gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </Button>
            )}
          </div>

          {/* Document thumbnails */}
          {documents.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {documents.map((doc, idx) => (
                <div
                  key={doc.id}
                  className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer hover:opacity-80 transition-opacity group"
                  onClick={() => handleViewDocument(idx)}
                >
                  <img
                    src={doc.document_url}
                    alt={`Document ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100">
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {canUpload
                ? 'No documents uploaded yet. Click Add to upload.'
                : 'No documents available.'}
            </p>
          )}
        </div>
      </Card>

      {/* Upload modal */}
      <VaccinationDocumentUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        vaccineeName={vaccine.vaccine_name}
        isUploading={uploading}
      />

      {/* Viewer modal */}
      <VaccinationDocumentViewer
        isOpen={showViewerModal}
        onClose={() => setShowViewerModal(false)}
        documents={documents}
        initialIndex={selectedDocIndex}
        onDelete={canUpload ? handleDelete : undefined}
        canDelete={canUpload}
      />
    </>
  );
}
