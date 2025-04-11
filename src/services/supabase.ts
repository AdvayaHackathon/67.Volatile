import { supabase } from '../lib/supabase';

export interface PatientProfile {
  user_id: string;
  name: string;
  age: number;
  gender: string;
  height: string;
  weight: string;
  bloodType: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface Appointment {
  id: string;
  type: string;
  date: string;
  notes?: string;
}

export interface Anomaly {
  id: string;
  type: 'ECG' | 'EEG' | 'Combined';
  data: any;
  severity: 'low' | 'medium' | 'high';
  description: string;
  created_at: string;
  status: 'active' | 'resolved';
  indicators: string[];
}

export interface HealthPrediction {
  id: string;
  anomaly_id: string;
  prediction_type: 'short_term' | 'long_term' | 'risk_analysis';
  prediction_data: any;
  confidence: number;
  created_at: string;
}

// Mock data for when Supabase operations fail
const mockProfile = {
  user_id: '123',
  name: 'John Doe',
  age: 45,
  gender: 'Male',
  height: '180',
  weight: '75',
  bloodType: 'O+'
};

const mockMedications = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Daily'
  },
  {
    id: '2',
    name: 'Aspirin',
    dosage: '81mg',
    frequency: 'Daily'
  }
];

const mockAppointments = [
  {
    id: '1',
    type: 'Checkup',
    date: '2025-05-15',
    notes: 'Regular checkup'
  },
  {
    id: '2',
    type: 'Cardiology',
    date: '2025-06-01',
    notes: 'Follow-up appointment'
  }
];

export const healthDataService = {
  async getProfile() {
    try {
      const { data, error } = await supabase
        .from('patient_profiles')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return mockProfile;
      }
      return data;
    } catch (error) {
      console.error('Error in getProfile:', error);
      return mockProfile;
    }
  },

  async updateProfile(profile: Partial<PatientProfile>) {
    try {
      const { data: existingProfile } = await supabase
        .from('patient_profiles')
        .select('user_id')
        .eq('user_id', profile.user_id)
        .single();

      if (!existingProfile) {
        const { data, error } = await supabase
          .from('patient_profiles')
          .insert([profile])
          .select()
          .single();

        if (error) {
          console.error('Error creating profile:', error);
          return mockProfile;
        }
        return data;
      } else {
        const { data, error } = await supabase
          .from('patient_profiles')
          .update(profile)
          .eq('user_id', profile.user_id)
          .select()
          .single();

        if (error) {
          console.error('Error updating profile:', error);
          return mockProfile;
        }
        return data;
      }
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return mockProfile;
    }
  },

  async getMedications() {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching medications:', error);
        return mockMedications;
      }
      return data;
    } catch (error) {
      console.error('Error in getMedications:', error);
      return mockMedications;
    }
  },

  async addMedication(medication: Omit<Medication, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('medications')
        .insert([medication])
        .select()
        .single();

      if (error) {
        console.error('Error adding medication:', error);
        return { ...medication, id: Date.now().toString() };
      }
      return data;
    } catch (error) {
      console.error('Error in addMedication:', error);
      return { ...medication, id: Date.now().toString() };
    }
  },

  async updateMedication(id: string, medication: Partial<Medication>) {
    try {
      const { data, error } = await supabase
        .from('medications')
        .update(medication)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating medication:', error);
        return { ...medication, id };
      }
      return data;
    } catch (error) {
      console.error('Error in updateMedication:', error);
      return { ...medication, id };
    }
  },

  async deleteMedication(id: string) {
    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error in deleteMedication:', error);
    }
  },

  async getAppointments() {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error);
        return mockAppointments;
      }
      return data;
    } catch (error) {
      console.error('Error in getAppointments:', error);
      return mockAppointments;
    }
  },

  async addAppointment(appointment: Omit<Appointment, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointment])
        .select()
        .single();

      if (error) {
        console.error('Error adding appointment:', error);
        return { ...appointment, id: Date.now().toString() };
      }
      return data;
    } catch (error) {
      console.error('Error in addAppointment:', error);
      return { ...appointment, id: Date.now().toString() };
    }
  },

  async updateAppointment(id: string, appointment: Partial<Appointment>) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(appointment)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating appointment:', error);
        return { ...appointment, id };
      }
      return data;
    } catch (error) {
      console.error('Error in updateAppointment:', error);
      return { ...appointment, id };
    }
  },

  async deleteAppointment(id: string) {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error in deleteAppointment:', error);
    }
  },

  async storeAnomaly(anomaly: Omit<Anomaly, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('anomalies')
        .insert([anomaly])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in storeAnomaly:', error);
      return { ...anomaly, id: Date.now().toString(), created_at: new Date().toISOString() };
    }
  },

  async getAnomalies() {
    try {
      const { data, error } = await supabase
        .from('anomalies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getAnomalies:', error);
      return [];
    }
  },

  async storePrediction(prediction: Omit<HealthPrediction, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('health_predictions')
        .insert([prediction])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in storePrediction:', error);
      return { ...prediction, id: Date.now().toString(), created_at: new Date().toISOString() };
    }
  },

  async getPredictions() {
    try {
      const { data, error } = await supabase
        .from('health_predictions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getPredictions:', error);
      return [];
    }
  },

  async getLatestPredictions(type: HealthPrediction['prediction_type']) {
    try {
      const { data, error } = await supabase
        .from('health_predictions')
        .select('*')
        .eq('prediction_type', type)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getLatestPredictions:', error);
      return null;
    }
  }
};