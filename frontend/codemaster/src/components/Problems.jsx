import React, { useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const problemsData = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    acceptance: 49.2,
    isPremium: false,
    isSolved: true,
  },
  {
    id: 2,
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    acceptance: 37.8,
    isPremium: false,
    isSolved: false,
  },
  {
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    acceptance: 33.8,
    isPremium: true,
    isSolved: false,
  },
  {
    id: 4,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    acceptance: 35.2,
    isPremium: false,
    isSolved: false,
  },
];

const difficultyColors = {
  Easy: 'bg-green-600',
  Medium: 'bg-yellow-500',
  Hard: 'bg-red-600',
};

export default function Problems() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');

  const filteredProblems = problemsData.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-4 md:px-20 pt-16">
      <h1 className="text-4xl font-bold mb-2">Problems</h1>
      <p className="text-gray-300 mb-8">Solve coding problems to improve your skills</p>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:flex-1 px-4 py-2 rounded-lg bg-[#1e293b] text-white placeholder-gray-400 focus:outline-none"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#1e293b] text-white"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Problems List */}
      <div className="bg-[#1e293b] rounded-xl p-4 divide-y divide-[#334155]">
        {filteredProblems.map((problem, index) => (
          <div key={problem.id} className="flex items-center justify-between py-4">
            {/* Index + Title + Tags */}
            <div className="flex items-center gap-4">
              <div className="text-gray-400 font-bold">{index + 1}</div>

              <div>
                <div className="flex items-center gap-2 font-semibold">
                  <span className="text-white">{problem.title}</span>
                  {problem.isPremium && (
                    <span className="text-yellow-400 text-xs font-semibold bg-yellow-500 bg-opacity-20 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <BsStars className="text-yellow-400" />
                      Premium
                    </span>
                  )}
                </div>
                <div className="text-sm text-white-700 flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[problem.difficulty]}`}
                  >
                    {problem.difficulty}
                  </span>
                  <span className="text-sm">Acceptance: {problem.acceptance}%</span>
                </div>
              </div>
            </div>

            {/* Status + Button */}
            <div className="flex items-center gap-4">
  {problem.isSolved && <FiCheckCircle className="text-green-400 text-xl" />}
  <Link to={`/problem/${problem.id}`}>
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium">
      Solve
    </button>
  </Link>
</div>
          </div>
        ))}
      </div>
    </div>
  );
}
