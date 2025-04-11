/*
  # Health Data Schema

  1. New Tables
    - `anomalies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text) - ECG, EEG, or Combined
      - `data` (jsonb) - Raw anomaly data
      - `severity` (text) - low, medium, high
      - `description` (text)
      - `created_at` (timestamp)
      - `status` (text) - active, resolved
    
    - `health_predictions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `anomaly_id` (uuid, references anomalies)
      - `prediction_type` (text) - short_term, long_term, risk_analysis
      - `prediction_data` (jsonb)
      - `confidence` (float)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create anomalies table
CREATE TABLE IF NOT EXISTS anomalies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL CHECK (type IN ('ECG', 'EEG', 'Combined')),
  data jsonb NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text NOT NULL CHECK (status IN ('active', 'resolved')),
  indicators text[] DEFAULT '{}'::text[]
);

-- Create health predictions table
CREATE TABLE IF NOT EXISTS health_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  anomaly_id uuid REFERENCES anomalies,
  prediction_type text NOT NULL CHECK (prediction_type IN ('short_term', 'long_term', 'risk_analysis')),
  prediction_data jsonb NOT NULL,
  confidence float NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_predictions ENABLE ROW LEVEL SECURITY;

-- Policies for anomalies
CREATE POLICY "Users can view their own anomalies"
  ON anomalies
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own anomalies"
  ON anomalies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own anomalies"
  ON anomalies
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for health predictions
CREATE POLICY "Users can view their own predictions"
  ON health_predictions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own predictions"
  ON health_predictions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);