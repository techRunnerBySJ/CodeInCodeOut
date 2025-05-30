import React from 'react';
import { FaCommentAlt, FaThumbsUp, FaUser, FaPlus } from 'react-icons/fa';

export default function Discussion() {
  const discussions = [
    {
      title: 'Best approach for Two Sum problem?',
      tags: ['algorithms', 'arrays', 'hash-table'],
      author: 'coding_master',
      time: '2 hours ago',
      comments: 23,
      likes: 45,
    },
    {
      title: 'Dynamic Programming patterns explained',
      tags: ['dynamic-programming', 'tutorial'],
      author: 'dp_expert',
      time: '5 hours ago',
      comments: 67,
      likes: 123,
    },
    {
      title: 'Weekly Contest 375 Discussion',
      tags: ['contest', 'weekly'],
      author: 'contest_fan',
      time: '1 day ago',
      comments: 89,
      likes: 34,
    },
    {
      title: 'Interview preparation roadmap',
      tags: ['interview', 'preparation', 'roadmap'],
      author: 'interview_prep',
      time: '2 days ago',
      comments: 156,
      likes: 234,
    },
  ];

  const popularTags = [
    'algorithms', 'data-structures', 'dynamic-programming',
    'arrays', 'strings', 'trees', 'graphs', 'interview'
  ];

  const guidelines = [
    'Be respectful and constructive',
    'Use clear and descriptive titles',
    'Include relevant code snippets',
    'Search before posting duplicates',
    'Tag your posts appropriately'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white px-6 md:px-20 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">Discuss</h1>
          <p className="text-gray-300">Share knowledge and discuss coding problems with the community</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          <FaPlus />
          New Discussion
        </button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search discussions..."
          className="w-full p-3 rounded bg-[#1e293b] placeholder-gray-400 text-white border border-blue-900"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Discussions List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Recent Discussions</h2>
          {discussions.map((disc, index) => (
            <div key={index} className="bg-[#1e293b] p-4 rounded-lg border border-blue-900">
              <h3 className="text-white text-lg font-medium mb-2">{disc.title}</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {disc.tags.map((tag, i) => (
                  <span key={i} className="bg-blue-800 text-sm text-white px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-gray-400 text-sm flex items-center gap-2 mb-2">
                <FaUser /> {disc.author} • {disc.time}
              </div>
              <div className="flex justify-end items-center gap-6 text-gray-300">
                <div className="flex items-center gap-1">
                  <FaCommentAlt />
                  {disc.comments}
                </div>
                <div className="flex items-center gap-1">
                  <FaThumbsUp />
                  {disc.likes}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Tags */}
          <div className="bg-[#1e293b] p-4 rounded-lg border border-blue-900">
            <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag, i) => (
                <span key={i} className="bg-blue-800 text-sm text-white px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-[#1e293b] p-4 rounded-lg border border-blue-900">
            <h3 className="text-lg font-semibold mb-4">Community Guidelines</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {guidelines.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
