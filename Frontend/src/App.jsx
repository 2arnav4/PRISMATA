import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import Dashboard from './pages/Dashboard';
import UploadDocuments from './pages/UploadDocuments';
import SmartSearch from './pages/SmartSearch';
import History from './pages/History';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import Login from './pages/Login';

const ProtectedLayout = () => {
  const { user, loading } = useUser();

  if (loading) {
    // You can replace this with a more sophisticated loading spinner
    return <div>Loading...</div>;
  }

  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <main className="ml-64">
        <Outlet />
      </main>
    </>
  );
};

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
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadDocuments />} />
              <Route path="/search" element={<SmartSearch />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;