import React from 'react';
import { FiCode } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FaStar, FaCoins } from 'react-icons/fa';

export default function Navbar({ onOpenDialog }) {
  return (
    <nav className="bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] shadow-md py-4 px-6 md:px-20 text-white flex justify-between items-center border-b border-blue-900/40">
      <div className="font-bold text-xl flex items-center gap-2">
        <FiCode size={28} /> CodeMaster
      </div>

      <ul className="flex gap-6 items-center text-sm font-medium">
        <li><Link to="/problems">Problems</Link></li>
        <li><Link to="/contests">Contest</Link></li>
        <li><Link to="/discussion">Discuss</Link></li>
        <li className="flex items-center gap-1 text-yellow-400">
          <FaStar size={14} />
          <Link to="/premium">Premium</Link>
        </li>
      </ul>

      <div className="flex items-center space-x-4">
        {/* Simulated user coin count */}
        <div className="flex items-center gap-1 text-yellow-300 font-semibold">
          <FaCoins size={16} />
          <span>1,250</span>
        </div>

        <button className="text-sm" onClick={onOpenDialog}>Sign In</button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-sm px-4 py-1 rounded"
          onClick={onOpenDialog}
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
}
