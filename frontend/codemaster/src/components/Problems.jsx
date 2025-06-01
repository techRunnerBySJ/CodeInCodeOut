import React, { useState, useEffect } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const difficultyColors = {
  EASY: 'bg-emerald-500 text-white',
  MEDIUM: 'bg-amber-500 text-white',
  HARD: 'bg-rose-600 text-white',
};

const tagColors = {
  Array: 'bg-blue-500',
  String: 'bg-purple-500',
  'Dynamic Programming': 'bg-pink-500',
  Graph: 'bg-indigo-500',
  Tree: 'bg-green-500',
  'Binary Search': 'bg-orange-500',
  default: 'bg-gray-500'
};

export default function Problems() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [category, setCategory] = useState('All');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const currentUserId = localStorage.getItem('userId');
  const location = useLocation();

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Set selected category from navigation state if available
    if (location.state?.selectedCategory) {
      setCategory(location.state.selectedCategory);
    }
  }, [location]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/problems/get-problems-by-categories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.categories) {
          setCategories(response.data.categories.map(cat => cat.tag));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/problems/get-problems`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.success) {
          const transformedProblems = response.data.problems.map(problem => {
            const totalAttempts = (problem.solvedByCount || 0) + (problem.inProgressCount || 0);
            const acceptanceRate = totalAttempts > 0 
              ? ((problem.solvedByCount || 0) / totalAttempts) * 100 
              : 0;
            const isSolved = problem.solvedBy?.some(solution => solution.userId === currentUserId) || false;
            return {
              id: problem.id,
              title: problem.title,
              difficulty: problem.difficultyLevel || 'Easy',
              category: problem.category || 'Uncategorized',
              acceptance: acceptanceRate,
              isPremium: problem.isPremium || false,
              isSolved: isSolved,
              solvedByCount: problem.solvedByCount || 0,
              inProgressCount: problem.inProgressCount || 0,
              tags: problem.tags || [],
              description: problem.description,
              examples: problem.examples,
              constraints: problem.constraints,
              testcases: problem.testcases,
              codeSnippets: problem.codeSnippets,
              referenceSolutions: problem.referenceSolutions,
              hints: problem.hints,
              discussion: problem.discussion
            };
          });
          setProblems(transformedProblems);
        } else {
          setError('Failed to fetch problems');
        }
      } catch (err) {
        setError('Error fetching problems: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [currentUserId]);

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficulty === 'All' || problem.difficulty.toUpperCase() === difficulty.toUpperCase();
    const matchesCategory = category === 'All' || problem.category === category;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-4 md:px-20 pt-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading problems...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-4 md:px-20 pt-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-red-500">{error}</div>
        </div>
      </div>
    );
  }

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
          className="w-full md:flex-1 px-4 py-2 rounded-lg bg-[#1e293b] placeholder-gray-400 focus:outline-none"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#1e293b] placeholder-gray-400 focus:outline-none"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded-lg bg-[#1e293b] placeholder-gray-400 focus:outline-none"
        >
          <option value="All">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Problems List */}
      <div className="bg-[#1e293b] rounded-xl p-4 divide-y divide-[#334155]">
        {filteredProblems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-2xl text-gray-400 mb-2">No Problems Found</div>
            <p className="text-gray-500 text-sm">
              {search ? `No problems match your search "${search}"` : 'Try adjusting your search or filter criteria'}
            </p>
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <div key={problem.id} className="flex items-center justify-between py-4">
              {/* Title + Tags */}
              <div className="flex-1">
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <span className="text-white">{problem.title}</span>
                  {problem.isPremium && (
                    <span className="text-yellow-400 text-xs font-semibold bg-yellow-500 bg-opacity-20 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <BsStars className="text-yellow-400" />
                      Premium
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${difficultyColors[problem.difficulty] || difficultyColors.EASY}`}
                  >
                    {problem.difficulty}
                  </span>
                  <span className="text-sm text-gray-400">Category: {problem.category}</span>
                  <span className="text-sm text-gray-400">Acceptance: {problem.acceptance.toFixed(1)}%</span>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(problem.tags) && problem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[tag] || tagColors.default} bg-opacity-20`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status + Button */}
              <div className="flex items-center gap-4 ml-4">
                {problem.isSolved ? (
                  <>
                    <FiCheckCircle className="text-green-400 text-xl" />
                    <Link 
                      to={`/problem/${problem.id}`}
                      state={{ 
                        problemData: {
                          id: problem.id,
                          title: problem.title,
                          difficulty: problem.difficulty,
                          category: problem.category,
                          description: problem.description,
                          examples: problem.examples,
                          constraints: problem.constraints,
                          testcases: problem.testcases,
                          codeSnippets: problem.codeSnippets,
                          referenceSolutions: problem.referenceSolutions,
                          hints: problem.hints,
                          discussion: problem.discussion,
                          isSolved: true
                        }
                      }}
                    >
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1.5 rounded-lg font-medium">
                        View
                      </button>
                    </Link>
                  </>
                ) : (
                  <Link 
                    to={`/problem/${problem.id}`}
                    state={{ 
                      problemData: {
                        id: problem.id,
                        title: problem.title,
                        difficulty: problem.difficulty,
                        category: problem.category,
                        description: problem.description,
                        examples: problem.examples,
                        constraints: problem.constraints,
                        testcases: problem.testcases,
                        codeSnippets: problem.codeSnippets,
                        referenceSolutions: problem.referenceSolutions,
                        hints: problem.hints,
                        discussion: problem.discussion,
                        isSolved: false
                      }
                    }}
                  >
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium">
                      Solve
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
