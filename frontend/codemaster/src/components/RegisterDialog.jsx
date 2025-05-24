import React, { useState } from 'react';

export default function RegisterDialog({ onClose }) {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1e293b] rounded-2xl p-6 w-full max-w-md shadow-xl relative border border-blue-900/40">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-xl font-bold hover:text-gray-300">
          &times;
        </button>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-white">Welcome to CodeMaster</h2>

        {/* Tabs */}
        <div className="flex mb-4 bg-[#2c3e50] rounded-lg overflow-hidden">
          <button
            onClick={() => setIsSignUp(false)}
            className={`w-1/2 py-2 font-semibold text-sm transition ${
              !isSignUp ? 'bg-[#334155] text-white' : 'bg-[#1e293b] text-gray-400'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`w-1/2 py-2 font-semibold text-sm transition ${
              isSignUp ? 'bg-[#334155] text-white' : 'bg-[#1e293b] text-gray-400'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md bg-[#334155] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 rounded-md bg-[#334155] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full px-4 py-2 rounded-md bg-[#334155] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-semibold transition"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
