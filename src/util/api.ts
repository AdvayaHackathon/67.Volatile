import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface VitalData {
  timestamp: number;
  value: number;
  isAnomaly: boolean;
  anomalyContext?: {
    previous: VitalData;
    next: VitalData;
    deviation: number;
  };
}

export interface EEGData {
  timestamp: number;
  alpha: number;
  beta: number;
  theta: number;
  delta: number;
  isAnomaly: boolean;
  anomalyContext?: {
    previous: EEGData;
    next: EEGData;
    deviation: number;
  };
}

export interface ChatResponse {
  success: boolean;
  response: string;
  type: 'text' | 'error';
}

export interface HealthAnalysisResponse {
  success: boolean;
  analysis: string;
  type: 'analysis' | 'error';
}

export interface HealthRecommendation {
  id: string;
  category: 'Cardiac' | 'Neurological' | 'Combined';
  title: string;
  description: string;
  confidence: number;
  recommendations: string[];
  timestamp: string;
}

class HealthAPI {
  private static instance: HealthAPI;
  private axiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  static getInstance(): HealthAPI {
    if (!HealthAPI.instance) {
      HealthAPI.instance = new HealthAPI();
    }
    return HealthAPI.instance;
  }

  async getECGData(): Promise<VitalData[]> {
    const response = await this.axiosInstance.get('/ecg');
    return response.data;
  }

  async getEEGData(): Promise<EEGData[]> {
    const response = await this.axiosInstance.get('/eeg');
    return response.data;
  }

  async chat(message: string, patientProfile?: any): Promise<ChatResponse> {
    const response = await this.axiosInstance.post('/chat', {
      message,
      patientProfile
    });
    return response.data;
  }

  async analyzeHealth(data: {
    vitals?: any,
    conditions?: string[],
    medications?: any[]
  }): Promise<HealthAnalysisResponse> {
    const response = await this.axiosInstance.post('/analyze-health', data);
    return response.data;
  }

  async scanDocuments(formData: FormData): Promise<any> {
    const response = await this.axiosInstance.post('/scan-documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
}

export const healthAPI = HealthAPI.getInstance();