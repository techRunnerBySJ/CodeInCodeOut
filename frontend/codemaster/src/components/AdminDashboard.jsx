import React from 'react';
import { useNavigate } from 'react-router-dom';

const mockProblems = [
  {
    id: '1',
    title: 'Two Sum',
    difficultyLevel: 'Easy',
    solvedBy: 125,
    inProgress: 10,
    createdAt: '2024-11-12',
  },
  {
    id: '2',
    title: 'Longest Substring Without Repeating Characters',
    difficultyLevel: 'Medium',
    solvedBy: 98,
    inProgress: 15,
    createdAt: '2024-11-13',
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white px-4 md:px-20 py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <button
          onClick={() => navigate('/create-problem')}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded text-white font-semibold"
        >
          + Create Problem
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#1e293b] p-6 rounded-lg shadow text-center">
          <h4 className="text-lg font-semibold text-gray-300">Total Questions</h4>
          <div className="text-3xl font-bold text-yellow-400 mt-2">22</div>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-lg shadow text-center">
          <h4 className="text-lg font-semibold text-gray-300">Solved by Users</h4>
          <div className="text-3xl font-bold text-green-400 mt-2">563</div>
        </div>
        <div className="bg-[#1e293b] p-6 rounded-lg shadow text-center">
          <h4 className="text-lg font-semibold text-gray-300">In Progress</h4>
          <div className="text-3xl font-bold text-blue-400 mt-2">45</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1e293b] p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Problems Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 border border-gray-700">Title</th>
                <th className="p-3 border border-gray-700">Difficulty</th>
                <th className="p-3 border border-gray-700">Solved</th>
                <th className="p-3 border border-gray-700">In Progress</th>
                <th className="p-3 border border-gray-700">Created At</th>
              </tr>
            </thead>
            <tbody>
              {mockProblems.map((problem) => (
                <tr key={problem.id} className="hover:bg-gray-800">
                  <td className="p-3 border border-gray-700">{problem.title}</td>
                  <td className="p-3 border border-gray-700">{problem.difficultyLevel}</td>
                  <td className="p-3 border border-gray-700">{problem.solvedBy}</td>
                  <td className="p-3 border border-gray-700">{problem.inProgress}</td>
                  <td className="p-3 border border-gray-700">{problem.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
