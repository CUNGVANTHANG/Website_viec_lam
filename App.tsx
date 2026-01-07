import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { JobList } from './pages/JobList';
import { JobDetail } from './pages/JobDetail';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { CandidateSearch } from './pages/CandidateSearch';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ToastProvider } from './components/ui/Toast';
import { Role } from './types';

// Simple Auth Context simulation using local state in App
const App: React.FC = () => {
  // Default role is Guest for demonstration
  const [currentRole, setCurrentRole] = useState<Role>(Role.GUEST);

  return (
    <ToastProvider>
      <Router>
        <Layout currentRole={currentRole} onSwitchRole={setCurrentRole}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/job/:id" element={<JobDetail />} />
            
            {/* Public Route but with restricted view inside */}
            <Route path="/candidates" element={<CandidateSearch currentRole={currentRole} />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login onLogin={setCurrentRole} />} />
            <Route path="/register" element={<Register onLogin={setCurrentRole} />} />
            
            {/* Protected Routes (Conceptual) */}
            <Route path="/candidate" element={<CandidateDashboard />} />
            <Route path="/employer" element={<EmployerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
};

export default App;