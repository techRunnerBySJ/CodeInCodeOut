import React, { useEffect, useState } from 'react';
import { FaCoins, FaEdit, FaCode, FaCalendarAlt, FaTrophy, FaCircle, FaFighterJet, FaStar } from 'react-icons/fa';
import axios from 'axios';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  const { user, stats, recentActivity } = profile;

  // Helper for badge rendering
  const badgeColors = {
    'Problem Solver': 'bg-blue-600',
    'Streak Master': 'bg-green-600',
    'Champion': 'bg-yellow-400 text-black',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white px-4 md:px-20 py-10 space-y-10">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-[#1e293b] p-6 rounded-lg">
            <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full mb-4" />
            <h2 className="text-xl text-center font-semibold">{user.name}</h2>
            <p className="text-center text-gray-400">@{user.email.split('@')[0]}</p>
            <p className="text-center mt-2">
              <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">{user.role}</span>
            </p>
            <div className="text-center mt-4">
              <button className="flex items-center gap-2 bg-yellow-400 text-black font-medium px-4 py-1 rounded hover:bg-yellow-500">
                <FaEdit /> Edit Profile
              </button>
            </div>
            <div className="mt-4 space-y-1 text-sm text-gray-300">
              <p><FaCoins className="inline mr-1 text-yellow-300" /> Coins: <span className="text-yellow-300 font-semibold">{user.coins}</span></p>
              <p><FaCalendarAlt className="inline mr-1" /> Member Since: {new Date(user.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
              <p><FaTrophy className="inline mr-1 text-red-500" /> Current Streak: {user.streak} days</p>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-[#1e293b] p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-yellow-400"><FaStar/> Badges</h3>
            <div className="flex flex-wrap gap-3 text-sm">
              {user.badges && user.badges.map((badge, idx) => (
                <div key={idx} className={`flex items-center gap-2 px-3 py-1 rounded-full ${badgeColors[badge] || 'bg-gray-500'}`}>
                  {badge === 'Problem Solver' && <FaCode />}
                  {badge === 'Streak Master' && <FaCalendarAlt />}
                  {badge === 'Champion' && <FaTrophy />}
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-2 space-y-6">
          {/* Stats */}
          <div className="bg-[#1e293b] p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Problem Solving Stats</h3>
            <div className="text-3xl font-bold">
              {stats.totalSolved} <span className="text-base font-normal text-gray-400">Total Solved</span>
            </div>
            <div className="text-gray-300 mt-2">{stats.totalSubmissions} Total Submissions</div>
            <div className="text-gray-300 mt-1">{stats.acceptanceRate}% Acceptance Rate</div>

            <div className="mt-4 space-y-2">
              <div className="text-green-400 text-sm">Easy</div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: `${(stats.difficultyStats.EASY / stats.totalSolved) * 100 || 0}%` }}></div>
              </div>

              <div className="text-yellow-400 text-sm">Medium</div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${(stats.difficultyStats.MEDIUM / stats.totalSolved) * 100 || 0}%` }}></div>
              </div>

              <div className="text-red-400 text-sm">Hard</div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div className="bg-red-400 h-2 rounded-full" style={{ width: `${(stats.difficultyStats.HARD / stats.totalSolved) * 100 || 0}%` }}></div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#1e293b] p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <ul className="space-y-3 text-sm">
              {recentActivity.map((item, idx) => (
                <li key={idx} className="bg-[#334155] p-4 rounded-md flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <FaCircle className={`text-${item.difficulty === 'EASY' ? 'green' : item.difficulty === 'MEDIUM' ? 'yellow' : 'red'}-400 text-xs`} />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <div className="text-gray-400 text-xs">{item.difficulty} · {item.status}</div>
                  </div>
                  <span className="text-gray-400 text-xs">{new Date(item.solvedAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
