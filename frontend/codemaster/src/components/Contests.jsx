import React from 'react';
import { FaCalendarAlt, FaClock, FaUsers, FaTrophy } from 'react-icons/fa';

export default function Contests() {
  const upcomingContests = [
    {
      title: 'Weekly Contest 375',
      date: '2024-01-20 10:30 AM',
      duration: '1h 30m',
    },
    {
      title: 'Biweekly Contest 120',
      date: '2024-01-25 8:00 PM',
      duration: '1h 30m',
    },
  ];

  const pastContests = [
    {
      title: 'Weekly Contest 374',
      date: '2024-01-13 10:30 AM',
      participants: '23,456',
      rank: 1205,
    },
    {
      title: 'Biweekly Contest 119',
      date: '2024-01-11 8:00 PM',
      participants: '18,234',
      rank: 890,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white px-6 md:px-20 py-10">
      <h1 className="text-4xl font-bold mb-2">Contests</h1>
      <p className="text-gray-300 mb-10">
        Compete with programmers worldwide in timed coding challenges
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Upcoming Contests */}
        <div className="bg-[#1e293b] rounded-xl p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <FaCalendarAlt className="text-blue-400" />
            Upcoming Contests
          </h2>

          {upcomingContests.map((contest, index) => (
            <div key={index} className="bg-[#1e293b] mb-6 border border-blue-900 p-4 rounded-lg">
              <h3 className="text-white font-medium text-lg mb-2">{contest.title}</h3>
              <div className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                <FaClock />
                {contest.date}
              </div>
              <div className="text-gray-400 text-sm flex items-center gap-2 mb-4">
                <FaUsers />
                Duration: {contest.duration}
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded font-medium">
                Register
              </button>
            </div>
          ))}
        </div>

        {/* Past Contests */}
        <div className="bg-[#1e293b] rounded-xl p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
            <FaTrophy className="text-yellow-400" />
            Past Contests
          </h2>

          {pastContests.map((contest, index) => (
            <div key={index} className="bg-[#1e293b] mb-6 border border-blue-900 p-4 rounded-lg relative">
              <h3 className="text-white font-medium text-lg mb-2">{contest.title}</h3>
              <div className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                <FaClock />
                {contest.date}
              </div>
              <div className="text-gray-400 text-sm flex items-center gap-2 mb-4">
                <FaUsers />
                {contest.participants} participants
              </div>
              <button className="bg-white text-blue-500 w-full py-2 rounded font-medium">
                View Results
              </button>
              <span className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
                Rank #{contest.rank}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
