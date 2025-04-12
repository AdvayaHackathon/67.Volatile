import React, { useState, useEffect } from 'react';
import { Heart, Brain, Activity, Weight, Ruler, Calendar, Clock, User, Edit2, X, Check, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { healthDataService } from '../services/supabase';

const mockVitalHistory = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  heartRate: 70 + Math.random() * 10,
  bloodPressureSystolic: 120 + Math.random() * 10,
  bloodPressureDiastolic: 80 + Math.random() * 5,
  temperature: 36.5 + Math.random() * 0.5,
}));

const PatientDashboard = ({ session }) => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingConditions, setEditingConditions] = useState(false);
  const [editingAppointments, setEditingAppointments] = useState(false);
  const [editingMedications, setEditingMedications] = useState(false);
  
  const [patientInfo, setPatientInfo] = useState({
    name: "Rajarshi Datta",
    age: 45,
    gender: "Male",
    height: "180",
    weight: "75",
    bloodType: "O+",
    conditions: ["Hypertension", "Family history of cardiovascular disease","Type 2 Diabetes"]
  });

  const [newCondition, setNewCondition] = useState("");
  
  const [appointments, setAppointments] = useState({
    lastCheckup: "2024-03-15",
    nextAppointment: "2024-04-20"
  });
  
  const [medications, setMedications] = useState([
    { id: 1, name: "Lisinopril", dosage: "10mg", frequency: "Daily" },
    { id: 2, name: "Aspirin", dosage: "81mg", frequency: "Daily" }
  ]);
  
  const [newMedication, setNewMedication] = useState({ name: "", dosage: "", frequency: "" });

  const [vitals, setVitals] = useState({
    heartRate: "72",
    bloodPressure: "145/90",
    temperature: "36.6",
    oxygenSaturation: "98",
    respiratoryRate: "16"
  });

  useEffect(() => {
    const loadPatientData = async () => {
      try {
        const profile = await healthDataService.getProfile();
        if (profile) {
          setPatientInfo(prevInfo => ({
            ...prevInfo,
            ...profile
          }));
        }
      } catch (error) {
        console.error('Error loading patient data:', error);
      }
    };

    if (session?.user?.id) {
      loadPatientData();
    }
  }, [session]);

  const handleProfileSave = async () => {
    try {
      if (!session?.user?.id) {
        throw new Error('No user ID found');
      }

      const profileData = {
        user_id: session.user.id,
        ...patientInfo
      };

      await healthDataService.updateProfile(profileData);
      setEditingProfile(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleConditionAdd = () => {
    if (newCondition.trim()) {
      setPatientInfo(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition.trim()]
      }));
      setNewCondition("");
    }
  };

  const handleConditionRemove = (index: number) => {
    setPatientInfo(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const handleMedicationSave = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
      setMedications([...medications, { ...newMedication, id: Date.now() }]);
      setNewMedication({ name: "", dosage: "", frequency: "" });
    }
    setEditingMedications(false);
  };

  const handleMedicationDelete = (id: number) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Information Card */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Patient Information</h2>
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              {editingProfile ? (
                <Check className="h-5 w-5 text-green-400" onClick={handleProfileSave} />
              ) : (
                <Edit2 className="h-5 w-5 text-blue-400" />
              )}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {editingProfile ? (
              <>
                <div>
                  <p className="text-gray-400">Name</p>
                  <input
                    type="text"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                    className="w-full bg-gray-700 rounded px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <p className="text-gray-400">Age</p>
                  <input
                    type="number"
                    value={patientInfo.age}
                    onChange={(e) => setPatientInfo({ ...patientInfo, age: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 rounded px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <p className="text-gray-400">Gender</p>
                  <select
                    value={patientInfo.gender}
                    onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                    className="w-full bg-gray-700 rounded px-3 py-2 mt-1"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <p className="text-gray-400">Blood Type</p>
                  <select
                    value={patientInfo.bloodType}
                    onChange={(e) => setPatientInfo({ ...patientInfo, bloodType: e.target.value })}
                    className="w-full bg-gray-700 rounded px-3 py-2 mt-1"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-gray-400">Height (cm)</p>
                  <input
                    type="number"
                    value={patientInfo.height}
                    onChange={(e) => setPatientInfo({ ...patientInfo, height: e.target.value })}
                    className="w-full bg-gray-700 rounded px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <p className="text-gray-400">Weight (kg)</p>
                  <input
                    type="number"
                    value={patientInfo.weight}
                    onChange={(e) => setPatientInfo({ ...patientInfo, weight: e.target.value })}
                    className="w-full bg-gray-700 rounded px-3 py-2 mt-1"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-gray-400">Name</p>
                  <p className="font-semibold">{patientInfo.name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Age</p>
                  <p className="font-semibold">{patientInfo.age} years</p>
                </div>
                <div>
                  <p className="text-gray-400">Gender</p>
                  <p className="font-semibold">{patientInfo.gender}</p>
                </div>
                <div>
                  <p className="text-gray-400">Blood Type</p>
                  <p className="font-semibold">{patientInfo.bloodType}</p>
                </div>
                <div>
                  <p className="text-gray-400">Height</p>
                  <p className="font-semibold">{patientInfo.height} cm</p>
                </div>
                <div>
                  <p className="text-gray-400">Weight</p>
                  <p className="font-semibold">{patientInfo.weight} kg</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Current Vitals Card */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Current Vitals</h2>
            <Activity className="h-6 w-6 text-green-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-gray-400">Heart Rate</p>
                <p className="font-semibold">{vitals.heartRate} bpm</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-gray-400">Blood Pressure</p>
                <p className="font-semibold">{vitals.bloodPressure} mmHg</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-gray-400">Temperature</p>
                <p className="font-semibold">{vitals.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-gray-400">O₂ Saturation</p>
                <p className="font-semibold">{vitals.oxygenSaturation}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vitals History Chart */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Vitals History</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockVitalHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
              <Legend />
              <Line type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#ff4560" dot={false} />
              <Line type="monotone" dataKey="bloodPressureSystolic" name="BP Systolic" stroke="#00e396" dot={false} />
              <Line type="monotone" dataKey="bloodPressureDiastolic" name="BP Diastolic" stroke="#775dd0" dot={false} />
              <Line type="monotone" dataKey="temperature" name="Temperature" stroke="#feb019" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medical Conditions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Medical Conditions</h2>
            <button
              onClick={() => setEditingConditions(!editingConditions)}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              {editingConditions ? (
                <Check className="h-5 w-5 text-green-400" onClick={() => setEditingConditions(false)} />
              ) : (
                <Edit2 className="h-5 w-5 text-blue-400" />
              )}
            </button>
          </div>
          <ul className="space-y-2">
            {patientInfo.conditions.map((condition, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-yellow-400" />
                  <span>{condition}</span>
                </div>
                {editingConditions && (
                  <button
                    onClick={() => handleConditionRemove(index)}
                    className="p-1 hover:bg-gray-700 rounded-lg"
                  >
                    <X className="h-4 w-4 text-red-400" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {editingConditions && (
            <div className="mt-4 flex space-x-2">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add new condition"
                className="flex-1 bg-gray-700 rounded px-3 py-2"
              />
              <button
                onClick={handleConditionAdd}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Medications */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Current Medications</h2>
            <button
              onClick={() => setEditingMedications(!editingMedications)}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              {editingMedications ? (
                <Check className="h-5 w-5 text-green-400" onClick={handleMedicationSave} />
              ) : (
                <Edit2 className="h-5 w-5 text-blue-400" />
              )}
            </button>
          </div>
          <div className="space-y-4">
            {medications.map((medication) => (
              <div key={medication.id} className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <Activity className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold">{medication.name}</p>
                    <p className="text-sm text-gray-400">
                      {medication.dosage} - {medication.frequency}
                    </p>
                  </div>
                </div>
                {editingMedications && (
                  <button
                    onClick={() => handleMedicationDelete(medication.id)}
                    className="p-1 hover:bg-gray-700 rounded-lg"
                  >
                    <X className="h-4 w-4 text-red-400" />
                  </button>
                )}
              </div>
            ))}
            {editingMedications && (
              <div className="mt-4 space-y-3 border-t border-gray-700 pt-4">
                <input
                  type="text"
                  placeholder="Medication name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  className="w-full bg-gray-700 rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                  className="w-full bg-gray-700 rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                  className="w-full bg-gray-700 rounded px-3 py-2"
                />
                <button
                  onClick={() => {
                    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
                      setMedications([...medications, { ...newMedication, id: Date.now() }]);
                      setNewMedication({ name: "", dosage: "", frequency: "" });
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 rounded px-3 py-2 flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Medication</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appointments */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Appointments</h2>
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-purple-400" />
            <button
              onClick={() => setEditingAppointments(!editingAppointments)}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              {editingAppointments ? (
                <Check className="h-5 w-5 text-green-400" onClick={() => setEditingAppointments(false)} />
              ) : (
                <Edit2 className="h-5 w-5 text-blue-400" />
              )}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Last Checkup</p>
            {editingAppointments ? (
              <input
                type="date"
                value={appointments.lastCheckup}
                onChange={(e) => setAppointments({ ...appointments, lastCheckup: e.target.value })}
                className="mt-1 bg-gray-700 rounded px-3 py-2 w-full"
              />
            ) : (
              <p className="font-semibold">{appointments.lastCheckup}</p>
            )}
          </div>
          <div>
            <p className="text-gray-400">Next Appointment</p>
            {editingAppointments ? (
              <input
                type="date"
                value={appointments.nextAppointment}
                onChange={(e) => setAppointments({ ...appointments, nextAppointment: e.target.value })}
                className="mt-1 bg-gray-700 rounded px-3 py-2 w-full"
              />
            ) : (
              <p className="font-semibold">{appointments.nextAppointment}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;