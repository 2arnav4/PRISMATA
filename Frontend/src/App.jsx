import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import Dashboard from './pages/Dashboard';
import UploadDocuments from './pages/UploadDocuments';
import SmartSearch from './pages/SmartSearch';
import History from './pages/History';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import Login from './pages/Login';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen relative">
          <AnimatedBackground />
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <div className="ml-64">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/upload" element={<UploadDocuments />} />
                      <Route path="/search" element={<SmartSearch />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </div>
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;