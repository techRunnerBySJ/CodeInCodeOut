import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home.jsx';
import RegisterDialog from './components/RegisterDialog.jsx';
import Problems from './components/Problems.jsx';
import Navbar from './components/Navbar.jsx';
import Contests from './components/Contests.jsx';
import Discussion from './components/Discussion.jsx';
import Premium from './components/Premium.jsx';
import Profile from './components/Profile.jsx';
import ProblemSolvingPage from './components/ProblemSolvingPage.jsx';
import CreateProblem from './components/CreateProblem.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

export default function App() {
  const [showDialog, setShowDialog] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      setIsLoading(true); // Start loading
      try {
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
      } catch (error) {
        console.error('Error fetching role:', error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchRole();
  }, []);

  if (isLoading) {
    // Show a loading indicator while the role is being fetched
    return <div className="text-center text-xl font-semibold text-yellow-400">Loading...</div>;
  }

  return (
    <Router>
      <Navbar onOpenDialog={() => setShowDialog(true)} />
      {showDialog && <RegisterDialog onClose={() => setShowDialog(false)} />}
      <Routes>
        <Route path="/" element={<Home onOpenDialog={() => setShowDialog(true)} />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/discussion" element={<Discussion />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/problem/:id" element={<ProblemSolvingPage />} />
        <Route path="/create-problem" element={<CreateProblem />} />
        <Route
          path="/admin-dashboard"
          element={role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}