import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit } from 'react-icons/fa';
import axios from 'axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/problems/get-problems`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProblems(response.data.problems);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProblems();
  }, []);

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

      {/* Loader */}
      {loading ? (
        <div className="text-center text-xl font-semibold text-yellow-400">Loading...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-[#1e293b] p-6 rounded-lg shadow text-center">
              <h4 className="text-lg font-semibold text-gray-300">Total Questions</h4>
              <div className="text-3xl font-bold text-yellow-400 mt-2">{problems.length}</div>
            </div>
            <div className="bg-[#1e293b] p-6 rounded-lg shadow text-center">
              <h4 className="text-lg font-semibold text-gray-300">Solved by Users</h4>
              <div className="text-3xl font-bold text-green-400 mt-2">
                {problems.reduce((acc, problem) => acc + (problem.solvedByCount || 0), 0)}
              </div>
            </div>
            <div className="bg-[#1e293b] p-6 rounded-lg shadow text-center">
              <h4 className="text-lg font-semibold text-gray-300">In Progress</h4>
              <div className="text-3xl font-bold text-blue-400 mt-2">
                {problems.reduce((acc, problem) => acc + (problem.inProgressCount || 0), 0)}
              </div>
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
                    <th className="p-3 border border-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem) => (
                    <tr key={problem.id} className="hover:bg-gray-800">
                      <td className="p-3 border border-gray-700">{problem.title}</td>
                      <td className="p-3 border border-gray-700">{problem.difficultyLevel}</td>
                      <td className="p-3 border border-gray-700">{problem.solvedByCount}</td>
                      <td className="p-3 border border-gray-700">{problem.inProgressCount}</td>
                      <td className="p-3 border border-gray-700">{new Date(problem.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 border border-gray-700">
                        <button
                          onClick={() =>
                            navigate(`/create-problem`, {
                              state: { problem: problem, mode: 'view' },
                            })
                          }
                          className="text-blue-500 hover:text-blue-700 mr-3"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/create-problem`, {
                              state: { problem: problem, mode: 'edit' },
                            })
                          }
                          className="text-green-500 hover:text-green-700"
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}