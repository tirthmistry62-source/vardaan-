import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

/**
 * Hook for managing vaccination document uploads and retrieval
 */
export function useVaccinationDocuments() {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(false);

  /**
   * Upload a document/image for a vaccination
   * @param {string} vaccinationId - ID of the vaccination
   * @param {File} file - Image file to upload
   * @param {string} documentType - Type of document (photo, certificate, receipt, other)
   * @returns {Promise<Object>} Upload result
   */
  const uploadDocument = useCallback(
    async (vaccinationId, file, documentType = 'photo') => {
      if (!file) {
        toast.error('No file selected');
        return null;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return null;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return null;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', documentType);

        const response = await api.post(
          `/parent/vaccinations/${vaccinationId}/upload-document?document_type=${documentType}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        toast.success('Document uploaded successfully');
        
        // Add to local documents state
        if (!documents[vaccinationId]) {
          documents[vaccinationId] = [];
        }
        documents[vaccinationId].push(response.data);

        return response.data;
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error(error?.response?.data?.detail || 'Failed to upload document');
        return null;
      } finally {
        setUploading(false);
      }
    },
    [documents]
  );

  /**
   * Fetch documents for a vaccination
   * @param {string} vaccinationId - ID of the vaccination
   * @returns {Promise<Array>} List of documents
   */
  const fetchDocuments = useCallback(async (vaccinationId) => {
    setLoading(true);
    try {
      const response = await api.get(`/vaccinations/${vaccinationId}/documents`);
      setDocuments((prev) => ({
        ...prev,
        [vaccinationId]: response.data,
      }));
      return response.data;
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete a document
   * @param {string} docId - ID of the document to delete
   * @returns {Promise<void>}
   */
  const deleteDocument = useCallback(
    async (docId) => {
      try {
        await api.delete(`/vaccination-documents/${docId}`);
        return true;
      } catch (error) {
        console.error('Delete failed:', error);
        throw error;
      }
    },
    []
  );

  /**
   * Get documents for a vaccination (from cache or fetch)
   */
  const getDocuments = useCallback(
    (vaccinationId) => {
      return documents[vaccinationId] || [];
    },
    [documents]
  );

  return {
    uploadDocument,
    fetchDocuments,
    deleteDocument,
    getDocuments,
    uploading,
    loading,
  };
}
