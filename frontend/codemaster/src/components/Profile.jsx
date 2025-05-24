import React from 'react';
import { FaCoins, FaEdit, FaCode, FaCalendarAlt, FaTrophy, FaCircle, FaFighterJet, FaStar } from 'react-icons/fa';

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white px-4 md:px-20 py-10 space-y-10">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-[#1e293b] p-6 rounded-lg">
            <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full mb-4" />
            <h2 className="text-xl text-center font-semibold">John Doe</h2>
            <p className="text-center text-gray-400">@johndoe</p>
            <p className="text-center mt-2">
              <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">Advanced</span>
            </p>
            <div className="text-center mt-4">
              <button className="flex items-center gap-2 bg-yellow-400 text-black font-medium px-4 py-1 rounded hover:bg-yellow-500">
                <FaEdit /> Edit Profile
              </button>
            </div>
            <div className="mt-4 space-y-1 text-sm text-gray-300">
              <p><FaCoins className="inline mr-1 text-yellow-300" /> Coins: <span className="text-yellow-300 font-semibold">1250</span></p>
              <p><FaCalendarAlt className="inline mr-1" /> Member Since: January 2024</p>
              <p><FaTrophy className="inline mr-1 text-red-500" /> Current Streak: 15 days</p>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-[#1e293b] p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-yellow-400"><FaStar/> Badges</h3>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded-full">
                <FaCode /> Problem Solver
              </div>
              <div className="flex items-center gap-2 bg-green-600 px-3 py-1 rounded-full">
                <FaCalendarAlt /> Streak Master
              </div>
              <div className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 rounded-full">
                <FaTrophy /> Champion
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-2 space-y-6">
          {/* Stats */}
          <div className="bg-[#1e293b] p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Problem Solving Stats</h3>
            <div className="text-3xl font-bold">
              127 <span className="text-base font-normal text-gray-400">Total Solved</span>
            </div>
            <div className="text-gray-300 mt-2">324 Total Submissions</div>
            <div className="text-gray-300 mt-1">78.4% Acceptance Rate</div>

            <div className="mt-4 space-y-2">
              <div className="text-green-400 text-sm">Easy</div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>

              <div className="text-yellow-400 text-sm">Medium</div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>

              <div className="text-red-400 text-sm">Hard</div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div className="bg-red-400 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#1e293b] p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <ul className="space-y-3 text-sm">
              {[
                { icon: 'green', title: 'Two Sum', difficulty: 'Easy', status: 'Solved', time: '2 hours ago' },
                { icon: 'green', title: 'Valid Parentheses', difficulty: 'Easy', status: 'Solved', time: '1 day ago' },
                { icon: 'yellow', title: 'Longest Substring', difficulty: 'Medium', status: 'Attempted', time: '2 days ago' },
                { icon: 'green', title: 'Merge Intervals', difficulty: 'Medium', status: 'Solved', time: '3 days ago' },
              ].map((item, idx) => (
                <li key={idx} className="bg-[#334155] p-4 rounded-md flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <FaCircle className={`text-${item.icon}-400 text-xs`} />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <div className="text-gray-400 text-xs">{item.difficulty} · {item.status}</div>
                  </div>
                  <span className="text-gray-400 text-xs">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
