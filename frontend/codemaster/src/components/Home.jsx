import React, { useState, useEffect } from 'react';
import RegisterDialog from './RegisterDialog.jsx';
import { FiCode, FiUser, FiStar } from 'react-icons/fi';
import axios from 'axios';
import { FaAd, FaCode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Home({ onOpenDialog }) {
  const [showDialog, setShowDialog] = useState(false);
  const [categories, setCategories] = useState([]); // State to store categories
  const BASE_API_URL = process.env.REACT_APP_API_URL; // Base API URL
  const navigate = useNavigate();

  const handleStartCoding = async () => {
    const isLoggedIn = await fakeLoginCheck();
    if (!isLoggedIn) {
      onOpenDialog();
    } else {
      // redirect to problems page
    }
  };

  const fakeLoginCheck = async () => {
    // Replace with real login logic
    return false;
  };

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/api/v1/problems/get-problems-by-categories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Add auth token if required
          },
        });
        setCategories(response.data.categories); // Set categories from API response
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] min-h-screen text-white">

      {/* Hero Section */}
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mt-20">
          Master Your{' '}
          <span className="text-gradient bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Coding
          </span>{' '}
          Skills
        </h1>
        <p className="mt-4 text-lg">
          Practice coding problems, compete with others, and unlock premium challenges with our comprehensive learning
          platform.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleStartCoding}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-white font-semibold"
          >
            Start Coding
          </button>
          <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold">Learn More</button>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-32 px-4 md:px-20 text-center">
        <h2 className="text-3xl font-bold mb-10">Everything You Need to Excel</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Code Practice',
              desc: 'Solve hundreds of coding problems with real-time feedback and test cases.',
              icon: <FiCode size={28} />,
            },
            {
              title: 'Admin Dashboard',
              desc: 'Powerful tools for admins to create, edit, and manage coding problems.',
              icon: <FiUser size={28} />,
            },
            {
              title: 'Premium Problems',
              desc: 'Earn coins and unlock premium challenges to advance your skills.',
              icon: <FiStar size={28} className="text-yellow-400" />,
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#1e293b] p-6 rounded-xl text-left">
              <div className="mb-4 text-blue-400">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Problem Categories Section */}
      <div className="mt-24 px-4 md:px-20 text-center mb-20">
        <h2 className="text-3xl font-bold mb-10">Problem Categories</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {categories.length > 0 ? (
            categories.map((cat, i) => (
              <div 
                key={i} 
                className="bg-[#1e293b] p-6 rounded-xl text-left cursor-pointer hover:bg-[#2d3b4f] transition-colors"
                onClick={() => navigate('/problems', { state: { selectedCategory: cat.tag } })}
              >
                <h3 className="text-xl font-bold mb-2 text-white-400"><FaCode className="mr-2 text-blue-400"/>{cat.tag}</h3>
                <p className="text-gray-300 mb-3 text-sm text-gray-400">{cat.count} problems</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Loading categories...</p>
          )}
        </div>
      </div>

      {/* Auth Dialog (Sign Up) */}
      {showDialog && <RegisterDialog onClose={() => setShowDialog(false)} />}
    </div>
  );
}