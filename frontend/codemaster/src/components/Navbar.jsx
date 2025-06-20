import React, { useState, useEffect } from 'react';
import { FiCode } from 'react-icons/fi';
import { FaStar, FaCoins, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      setUser(null);
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <nav className="bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] shadow-md py-4 px-6 md:px-20 text-white flex justify-between items-center border-b border-blue-900/40">
      <NavLink to="/" className="font-bold text-xl flex items-center gap-2 cursor-pointer">
        <FiCode size={28} /> CodeMaster
      </NavLink>

      <ul className="flex gap-6 items-center text-sm font-medium">
        <li>
          <NavLink
            to="/problems"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-white"
            }
          >
            Problems
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contests"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-white"
            }
          >
            Contest
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/discussion"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-white"
            }
          >
            Discuss
          </NavLink>
        </li>
        <li className="flex items-center gap-1 text-yellow-400">
          <FaStar size={14} />
          <NavLink
            to="/premium"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-yellow-400"
            }
          >
            Premium
          </NavLink>
        </li>
      </ul>

      <div className="flex items-center space-x-4 relative">
        {user && (
          <>
            <div className="flex items-center gap-1 text-yellow-300 font-semibold">
              <FaCoins size={16} />
              <span>{user.coins}</span>
            </div>

            <div className="relative">
              <button
                className="bg-gray-200 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90"
                onClick={toggleDropdown}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#1e293b] border border-blue-800 text-white text-sm rounded shadow-lg z-50">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 hover:bg-blue-800 flex items-center gap-2"
                  >
                    <FaUser /> Profile
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className="block px-4 py-2 hover:bg-blue-800 flex items-center gap-2"
                  >
                    <FaCog /> Settings
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-blue-800 flex items-center gap-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}