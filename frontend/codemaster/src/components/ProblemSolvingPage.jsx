import React from 'react';
import { FaPlay, FaPaperPlane } from 'react-icons/fa';

export default function ProblemSolvingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white px-6 md:px-20 py-10 space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Problem */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Two Sum <span className="bg-green-700 text-xs px-2 py-1 rounded-full ml-2">Easy</span></h2>
              <p className="text-sm text-gray-400">45.2% acceptance</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mt-4 mb-6 text-sm">
              <button className="bg-blue-600 px-3 py-1 rounded text-white font-medium">Description</button>
              <button className="bg-gray-700 px-3 py-1 rounded text-gray-400">Hints</button>
              <button className="bg-gray-700 px-3 py-1 rounded text-gray-400">Solutions</button>
              <button className="bg-gray-700 px-3 py-1 rounded text-gray-400">Discuss</button>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Problem</h3>
              <p className="text-sm text-gray-300 mb-4">
                Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
                You may assume that each input would have exactly one solution, and you may not use the same element twice.
              </p>

              {/* Examples */}
              <div className="space-y-4 text-sm">
                <div className="bg-[#334155] p-4 rounded">
                  <p className="font-medium text-white mb-1">Example 1:</p>
                  <p className="text-gray-300"><strong>Input:</strong> nums = [2,7,11,15], target = 9</p>
                  <p className="text-gray-300"><strong>Output:</strong> [0,1]</p>
                  <p className="text-gray-400"><strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</p>
                </div>

                <div className="bg-[#334155] p-4 rounded">
                  <p className="font-medium text-white mb-1">Example 2:</p>
                  <p className="text-gray-300"><strong>Input:</strong> nums = [3,2,4], target = 6</p>
                  <p className="text-gray-300"><strong>Output:</strong> [1,2]</p>
                  <p className="text-gray-400"><strong>Explanation:</strong> Because nums[1] + nums[2] == 6, we return [1, 2].</p>
                </div>
              </div>

              {/* Constraints */}
              <div className="mt-6">
                <h4 className="font-semibold mb-1">Constraints</h4>
                <ul className="list-disc ml-5 text-sm text-gray-300 space-y-1">
                  <li>2 ≤ nums.length ≤ 10⁴</li>
                  <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
                  <li>-10⁹ ≤ target ≤ 10⁹</li>
                  <li>Only one valid answer exists.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Editor + Test Cases */}
        <div className="space-y-6">
          {/* Code Editor */}
          <div className="bg-[#1e293b] p-6 rounded-lg">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">Code Editor</h3>
              <select className="bg-gray-700 text-sm px-2 py-1 rounded text-white">
                <option>JavaScript</option>
              </select>
            </div>
            <textarea
              className="w-full h-48 bg-gray-900 text-sm p-3 rounded-md text-white font-mono resize-none"
              defaultValue={`function twoSum(nums, target) {\n  // Write your solution here\n}`}
            />
            <div className="mt-4 flex gap-4">
              <button className="bg-gray-600 px-4 py-2 rounded flex items-center gap-2 text-sm text-white hover:bg-gray-500">
                <FaPlay /> Run Code
              </button>
              <button className="bg-green-600 px-4 py-2 rounded flex items-center gap-2 text-sm text-white hover:bg-green-500">
                <FaPaperPlane /> Submit
              </button>
            </div>
          </div>

          {/* Test Cases */}
          <div className="bg-[#1e293b] p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Test Cases</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-[#334155] p-4 rounded">
                <p className="font-medium">Case 1: Basic case with solution at beginning</p>
                <p className="text-gray-300">Input: nums = [2,7,11,15], target = 9</p>
                <p className="text-green-400">Expected: [0,1]</p>
              </div>
              <div className="bg-[#334155] p-4 rounded">
                <p className="font-medium">Case 2: Solution not at beginning</p>
                <p className="text-gray-300">Input: nums = [3,2,4], target = 6</p>
                <p className="text-green-400">Expected: [1,2]</p>
              </div>
              <div className="bg-[#334155] p-4 rounded">
                <p className="font-medium">Case 3: Duplicate numbers</p>
                <p className="text-gray-300">Input: nums = [3,3], target = 6</p>
                <p className="text-green-400">Expected: [0,1]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
