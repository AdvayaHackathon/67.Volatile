import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { healthAPI } from '../util/api';

interface DocumentScanResult {
  type: 'success' | 'error';
  message: string;
  data?: {
    conditions?: string[];
    medications?: Array<{
      name: string;
      dosage: string;
      frequency: string;
    }>;
    appointments?: Array<{
      type: string;
      date: string;
      notes?: string;
    }>;
    patientInfo?: {
      name?: string;
      age?: number;
      gender?: string;
      height?: string;
      weight?: string;
      bloodType?: string;
    };
  };
}

const DocumentScanner = () => {
  const [scanning, setScanning] = React.useState(false);
  const [results, setResults] = React.useState<DocumentScanResult[]>([]);
  const [overallProgress, setOverallProgress] = React.useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    setScanning(true);
    setResults([]);
    setOverallProgress(0);

    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('documents', file);
    });

    try {
      const response = await healthAPI.scanDocuments(formData);
      setResults(response.results);
      
      // If we have successful results, update the dashboard data
      const successfulResults = response.results.filter(r => r.type === 'success');
      if (successfulResults.length > 0) {
        // Combine all the data from successful scans
        const combinedData = successfulResults.reduce((acc, curr) => {
          if (curr.data) {
            acc.conditions = [...(acc.conditions || []), ...(curr.data.conditions || [])];
            acc.medications = [...(acc.medications || []), ...(curr.data.medications || [])];
            acc.appointments = [...(acc.appointments || []), ...(curr.data.appointments || [])];
            acc.patientInfo = { ...(acc.patientInfo || {}), ...(curr.data.patientInfo || {}) };
          }
          return acc;
        }, {} as DocumentScanResult['data']);

        // Update dashboard data
        await healthAPI.updateDashboardData(combinedData);
      }
    } catch (error) {
      console.error('Error scanning documents:', error);
      setResults([{
        type: 'error',
        message: 'Failed to scan documents. Please try again.'
      }]);
    } finally {
      setScanning(false);
      setOverallProgress(100);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: true
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Document Scanner</h2>
      </div>

      <div className="flex-1 bg-gray-800 rounded-lg p-6">
        {!scanning && results.length === 0 && (
          <div {...getRootProps()} className="h-full flex flex-col items-center justify-center">
            <div className="bg-gray-700 p-8 rounded-lg text-center max-w-md">
              <Upload className="h-12 w-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">Upload Medical Documents</h3>
              <p className="text-gray-400 mb-6">
                {isDragActive
                  ? "Drop the files here..."
                  : "Drag and drop your medical documents here, or click to select files"}
              </p>
              <input {...getInputProps()} />
              <p className="text-sm text-gray-400">
                Supported formats: PDF, JPG, PNG
              </p>
            </div>
          </div>
        )}

        {scanning && (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">Scanning Documents</h3>
              <p className="text-gray-400 mb-6">
                Please wait while we analyze your medical documents...
              </p>
              <div className="w-full max-w-md bg-gray-700 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {!scanning && results.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Scan Results</h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg flex items-start space-x-3 ${
                    result.type === 'success' ? 'bg-green-900/50' : 'bg-red-900/50'
                  }`}
                >
                  {result.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-400 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{result.message}</p>
                    {result.data && (
                      <div className="mt-2 text-sm space-y-1">
                        {result.data.conditions && result.data.conditions.length > 0 && (
                          <p>• Updated {result.data.conditions.length} medical conditions</p>
                        )}
                        {result.data.medications && result.data.medications.length > 0 && (
                          <p>• Added {result.data.medications.length} medications</p>
                        )}
                        {result.data.appointments && result.data.appointments.length > 0 && (
                          <p>• Updated {result.data.appointments.length} appointments</p>
                        )}
                        {result.data.patientInfo && Object.keys(result.data.patientInfo).length > 0 && (
                          <p>• Updated patient information</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setResults([]);
                setOverallProgress(0);
              }}
              className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Scan More Documents</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentScanner;