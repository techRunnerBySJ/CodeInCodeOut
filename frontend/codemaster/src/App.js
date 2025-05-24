import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import RegisterDialog from './components/RegisterDialog.jsx';
import Problems from './components/Problems.jsx';
import Navbar from './components/Navbar.jsx';
import Contests from './components/Contests.jsx';
import Discussion from './components/Discussion.jsx';
import Premium from './components/Premium.jsx';

export default function App() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <Router>
      {/* ✅ Always visible */}
      <Navbar onOpenDialog={() => setShowDialog(true)} />

      {/* ✅ Conditional Dialog */}
      {showDialog && <RegisterDialog onClose={() => setShowDialog(false)} />}

      <Routes>
        <Route
          path="/"
          element={<Home onOpenDialog={() => setShowDialog(true)} />}
        />
        <Route path="/problems" element={<Problems />} />
        <Route path="/contests" element={<Contests />} />
        <Route path="/discussion" element={<Discussion />} />
        <Route path="/premium" element={<Premium />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}
