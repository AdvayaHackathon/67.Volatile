import React from 'react';
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PatientDashboard from './components/PatientDashboard';
import DigitalTwin from './components/DigitalTwin';
import HealthAlerts from './components/HealthAlerts';
import Recommendations from './components/Recommendations';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 sm:p-8 bg-gray-800 rounded-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">NeuroPulse Login</h1>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            providers={[]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<Dashboard session={session} />}>
          <Route index element={<PatientDashboard session={session} />} />
          <Route path="twin" element={<DigitalTwin isConnected={true} />} />
          <Route path="alerts" element={<HealthAlerts />} />
          <Route path="recommendations" element={<Recommendations />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;