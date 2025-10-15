// Custom hooks for Opal file processing
import { useState, useCallback } from 'react';
import { apiService } from '../services/apiService.js';

export function useFileUpload() {
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processing, completed, error
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const uploadFiles = useCallback(async (files) => {
    try {
      setUploadStatus('uploading');
      setProgress(0);
      setError(null);
      setResults(null);

      // Start upload process
      const response = await apiService.uploadFiles(files);
      setSessionId(response.sessionId);
      setResults(response.results);
      
      setUploadStatus('completed');
      setProgress(100);
      
      return response;
    } catch (err) {
      setError(err.message);
      setUploadStatus('error');
      setProgress(0);
      throw err;
    }
  }, []);

  const getProcessingStatus = useCallback(async () => {
    if (!sessionId) return null;
    
    try {
      const status = apiService.getProcessingStatus(sessionId);
      setProgress(status.progress || 0);
      return status;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [sessionId]);

  const reset = useCallback(() => {
    setUploadStatus('idle');
    setProgress(0);
    setResults(null);
    setError(null);
    setSessionId(null);
  }, []);

  return {
    uploadFiles,
    getProcessingStatus,
    reset,
    uploadStatus,
    progress,
    results,
    error,
    sessionId,
    isUploading: uploadStatus === 'uploading' || uploadStatus === 'processing',
    isCompleted: uploadStatus === 'completed',
    hasError: uploadStatus === 'error'
  };
}

export function usePrivacyDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async (sessionId) => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.getPrivacyDashboard(sessionId);
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDashboard = useCallback(async (sessionId) => {
    await loadDashboard(sessionId);
  }, [loadDashboard]);

  return {
    dashboardData,
    loading,
    error,
    loadDashboard,
    refreshDashboard
  };
}

export function useBusinessReport() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateReport = useCallback(async (sessionId) => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.getBusinessReport(sessionId);
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reportData,
    loading,
    error,
    generateReport
  };
}