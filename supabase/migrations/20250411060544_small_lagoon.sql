/*
  # Patient Data Schema

  1. New Tables
    - `patient_profiles`
      - `user_id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `age` (integer)
      - `gender` (text)
      - `height` (text)
      - `weight` (text)
      - `bloodType` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `vital_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `timestamp` (timestamptz)
      - `heartRate` (float)
      - `bloodPressureSystolic` (float)
      - `bloodPressureDiastolic` (float)
      - `temperature` (float)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create patient_profiles table
CREATE TABLE IF NOT EXISTS patient_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  name text,
  age integer,
  gender text,
  height text,
  weight text,
  bloodType text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vital_history table
CREATE TABLE IF NOT EXISTS vital_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  timestamp timestamptz DEFAULT now(),
  heartRate float,
  bloodPressureSystolic float,
  bloodPressureDiastolic float,
  temperature float
);

-- Enable RLS
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_history ENABLE ROW LEVEL SECURITY;

-- Policies for patient_profiles
CREATE POLICY "Users can view their own profile"
  ON patient_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON patient_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON patient_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for vital_history
CREATE POLICY "Users can view their own vital history"
  ON vital_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vital history"
  ON vital_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update the updated_at column
CREATE TRIGGER update_patient_profiles_updated_at
    BEFORE UPDATE ON patient_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();