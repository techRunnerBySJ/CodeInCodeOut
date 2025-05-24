import React, { useState } from 'react';

export default function CreateProblem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficultyLevel: 'Easy',
    tags: [],
    userId: '',
    examples: JSON.stringify([{ input: '', output: '', explanation: '' }], null, 2),
    constraints: [''],
    hints: [],
    editorial: '',
    discussion: JSON.stringify([], null, 2),
    testcases: [{ input: '', output: '' }],
    codeSnippets: JSON.stringify([{ language: 'JavaScript', code: '' }], null, 2),
    referenceSolutions: JSON.stringify({}, null, 2),
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    handleChange(field, updated);
  };

  const addToArray = (field, defaultValue = '') => {
    handleChange(field, [...formData[field], defaultValue]);
  };

  const handleTestCaseChange = (index, key, value) => {
    const updated = [...formData.testcases];
    updated[index][key] = value;
    handleChange('testcases', updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting Problem:', formData);
    // API call here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white px-4 md:px-20 py-10">
      <div className="max-w-4xl mx-auto bg-[#1e293b] p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Create New Problem</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />

          <textarea
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            placeholder="Description"
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          <select
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={formData.difficultyLevel}
            onChange={(e) => handleChange('difficultyLevel', e.target.value)}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <input
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            type="text"
            placeholder="User ID"
            value={formData.userId}
            onChange={(e) => handleChange('userId', e.target.value)}
          />

          {/* Tags */}
          <div>
            <label className="block mb-1">Tags</label>
            {formData.tags.map((tag, index) => (
              <input
                key={index}
                className="w-full mb-2 p-2 rounded bg-gray-800 text-white border border-gray-600"
                placeholder={`Tag ${index + 1}`}
                value={tag}
                onChange={(e) => handleArrayChange('tags', index, e.target.value)}
              />
            ))}
            <button type="button" className="bg-blue-600 px-3 py-1 rounded" onClick={() => addToArray('tags')}>+ Add Tag</button>
          </div>

          {/* Hints */}
          <div>
            <label className="block mb-1">Hints</label>
            {formData.hints.map((hint, index) => (
              <input
                key={index}
                className="w-full mb-2 p-2 rounded bg-gray-800 text-white border border-gray-600"
                placeholder={`Hint ${index + 1}`}
                value={hint}
                onChange={(e) => handleArrayChange('hints', index, e.target.value)}
              />
            ))}
            <button type="button" className="bg-blue-600 px-3 py-1 rounded" onClick={() => addToArray('hints')}>+ Add Hint</button>
          </div>

          {/* Constraints */}
          <div>
            <label className="block mb-1">Constraints</label>
            {formData.constraints.map((constraint, index) => (
              <input
                key={index}
                className="w-full mb-2 p-2 rounded bg-gray-800 text-white border border-gray-600"
                placeholder={`Constraint ${index + 1}`}
                value={constraint}
                onChange={(e) => handleArrayChange('constraints', index, e.target.value)}
              />
            ))}
            <button type="button" className="bg-blue-600 px-3 py-1 rounded" onClick={() => addToArray('constraints')}>+ Add Constraint</button>
          </div>

          {/* Editorial */}
          <textarea
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            placeholder="Editorial (optional)"
            rows={3}
            value={formData.editorial}
            onChange={(e) => handleChange('editorial', e.target.value)}
          />

          {/* Testcases */}
          <div>
            <label className="block mb-1">Test Cases</label>
            {formData.testcases.map((testcase, index) => (
              <div key={index} className="mb-3 space-y-2">
                <input
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder={`Input ${index + 1}`}
                  value={testcase.input}
                  onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                />
                <input
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder={`Output ${index + 1}`}
                  value={testcase.output}
                  onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-600 px-3 py-1 rounded"
              onClick={() => addToArray('testcases', { input: '', output: '' })}
            >
              + Add Test Case
            </button>
          </div>

          {/* JSON Fields */}
          {['examples', 'discussion', 'codeSnippets', 'referenceSolutions'].map((field) => (
            <div key={field}>
              <label className="block mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <textarea
                className="w-full p-2 font-mono rounded bg-gray-800 text-white border border-gray-600"
                rows={field === 'referenceSolutions' ? 6 : 4}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
              />
            </div>
          ))}

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white font-semibold"
          >
            Create Problem
          </button>
        </form>
      </div>
    </div>
  );
}
