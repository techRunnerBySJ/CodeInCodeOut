import React, { useState } from 'react';
import axios from 'axios';

export default function CreateProblem() {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficultyLevel: 'Easy',
    tags: [],
    examples: JSON.stringify([{ input: '', output: '', explanation: '' }], null, 2),
    constraints: [''],
    testcases: [{ input: '', output: '' }],
    codeSnippets: [{ language: 'JavaScript', code: '' }],
    referenceSolutions: {},
    hints: [],
    discussion: JSON.stringify([], null, 2),
  });

  const [errors, setErrors] = useState({});
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    handleChange(field, updated);
  };

  const addToArray = (field, defaultValue = '') => {
    handleChange(field, [...formData[field], defaultValue]);
  };

  const removeFromArray = (field, index) => {
    const updated = [...formData[field]];
    updated.splice(index, 1);
    handleChange(field, updated);
  };

  const handleTestCaseChange = (index, key, value) => {
    const updated = [...formData.testcases];
    updated[index][key] = value;
    handleChange('testcases', updated);
  };

  const handleCodeSnippetChange = (index, key, value) => {
    const updated = [...formData.codeSnippets];
    updated[index][key] = value;
    handleChange('codeSnippets', updated);
  };

  const handleReferenceSolutionChange = (language, value) => {
    setFormData((prev) => ({
      ...prev,
      referenceSolutions: {
        ...prev.referenceSolutions,
        [language]: value, // Add or update the specific language key
      },
    }));
  };

  const removeReferenceSolution = (language) => {
    const updated = { ...formData.referenceSolutions };
    delete updated[language];
    handleChange('referenceSolutions', updated);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.examples.trim()) {
      newErrors.examples = 'Examples are required.';
    } else {
      try {
        JSON.parse(formData.examples); // Ensure valid JSON
      } catch {
        newErrors.examples = 'Examples must be valid JSON.';
      }
    }
    if (!formData.constraints.length || formData.constraints.some((c) => !c.trim())) {
      newErrors.constraints = 'At least one constraint is required.';
    }
    if (!formData.testcases.length || formData.testcases.some((tc) => !tc.input || !tc.output)) {
      newErrors.testcases = 'At least one valid test case is required.';
    }
    if (!formData.codeSnippets.length || formData.codeSnippets.some((cs) => !cs.language || !cs.code)) {
      newErrors.codeSnippets = 'At least one code snippet is required.';
    }
    if (Object.keys(formData.referenceSolutions).length === 0) {
      newErrors.referenceSolutions = 'At least one reference solution is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    // Ensure difficultyLevel is valid
    const validDifficulties = ["Easy", "Medium", "Hard"];
    if (!validDifficulties.includes(formData.difficultyLevel)) {
      setErrors((prev) => ({
        ...prev,
        difficultyLevel: "Invalid difficulty level selected.",
      }));
      return;
    }
  
    // Transform formData to match the desired payload format
    const payload = {
      title: formData.title,
      description: formData.description,
      difficultyLevel: formData.difficultyLevel.toUpperCase(), // Convert to uppercase
      tags: formData.tags,
      examples: JSON.parse(formData.examples), // Parse examples from JSON string
      constraints: formData.constraints,
      testcases: formData.testcases,
      codeSnippets: formData.codeSnippets.map((snippet) => ({
        language: snippet.language.toLowerCase(), // Convert language to lowercase
        code: snippet.code,
      })),
      referenceSolutions: formData.referenceSolutions,
      hints: formData.hints,
      discussion: JSON.parse(formData.discussion), // Parse discussion from JSON string
    };
  
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/problems/create-problem`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error submitting problem:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white px-4 md:px-20 py-10">
      <div className="max-w-4xl mx-auto bg-[#1e293b] p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Create New Problem</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <input
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              type="text"
              placeholder="Title (e.g., Two Sum Problem)"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <textarea
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="Description (e.g., Explain the problem statement)"
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Difficulty Level */}
          <select
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={formData.difficultyLevel}
            onChange={(e) => handleChange('difficultyLevel', e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Tags */}
          <div>
            <label className="block mb-1">Tags</label>
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder={`Tag ${index + 1}`}
                  value={tag}
                  onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                />
                <button
                  type="button"
                  className="bg-red-600 px-2 py-1 rounded text-white"
                  onClick={() => removeFromArray('tags', index)}
                >
                  Delete
                </button>
              </div>
            ))}
            <button type="button" className="bg-blue-600 px-3 py-1 rounded" onClick={() => addToArray('tags')}>
              + Add Tag
            </button>
          </div>

          {/* Examples */}
          <div>
            <label className="block mb-1">Examples</label>
            <textarea
              className="w-full p-2 font-mono rounded bg-gray-800 text-white border border-gray-600"
              placeholder={`Examples in JSON format (e.g., [{"input": "10 20 30 40 50", "output": "30.00", "explanation": "The average of 10, 20, 30, 40, and 50 is (10+20+30+40+50)/5 = 30.00."}] )`}
              rows={6}
              value={formData.examples}
              onChange={(e) => handleChange('examples', e.target.value)}
            />
            {errors.examples && <p className="text-red-500 text-sm">{errors.examples}</p>}
          </div>

          {/* Constraints */}
          <div>
            <label className="block mb-1">Constraints</label>
            {formData.constraints.map((constraint, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder={`Constraint ${index + 1}`}
                  value={constraint}
                  onChange={(e) => handleArrayChange('constraints', index, e.target.value)}
                />
                <button
                  type="button"
                  className="bg-red-600 px-2 py-1 rounded text-white"
                  onClick={() => removeFromArray('constraints', index)}
                >
                  Delete
                </button>
              </div>
            ))}
            <button type="button" className="bg-blue-600 px-3 py-1 rounded" onClick={() => addToArray('constraints')}>
              + Add Constraint
            </button>
            {errors.constraints && <p className="text-red-500 text-sm">{errors.constraints}</p>}
          </div>

          {/* Test Cases */}
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
                <button
                  type="button"
                  className="bg-red-600 px-2 py-1 rounded text-white"
                  onClick={() => removeFromArray('testcases', index)}
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-600 px-3 py-1 rounded"
              onClick={() => addToArray('testcases', { input: '', output: '' })}
            >
              + Add Test Case
            </button>
            {errors.testcases && <p className="text-red-500 text-sm">{errors.testcases}</p>}
          </div>

          {/* Code Snippets */}
          <div>
            <label className="block mb-1">Code Snippets</label>
            {formData.codeSnippets.map((snippet, index) => (
              <div key={index} className="mb-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <select
                    className="w-1/3 p-2 rounded bg-gray-800 text-white border border-gray-600"
                    value={snippet.language}
                    onChange={(e) => handleCodeSnippetChange(index, 'language', e.target.value)}
                  >
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="C++">C++</option>
                    <option value="C#">C#</option>
                  </select>
                  <button
                    type="button"
                    className="bg-red-600 px-2 py-1 rounded text-white"
                    onClick={() => removeFromArray('codeSnippets', index)}
                  >
                    Delete
                  </button>
                </div>
                <textarea
                  className="w-full p-2 font-mono rounded bg-gray-800 text-white border border-gray-600"
                  placeholder={`Code for ${snippet.language}`}
                  rows={4}
                  value={snippet.code}
                  onChange={(e) => handleCodeSnippetChange(index, 'code', e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-600 px-3 py-1 rounded"
              onClick={() => addToArray('codeSnippets', { language: 'JavaScript', code: '' })}
            >
              + Add Code Snippet
            </button>
            {errors.codeSnippets && <p className="text-red-500 text-sm">{errors.codeSnippets}</p>}
          </div>

          {/* Hints */}
          <div>
            <label className="block mb-1">Hints</label>
            {formData.hints.map((hint, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                  placeholder={`Hint ${index + 1}`}
                  value={hint}
                  onChange={(e) => handleArrayChange('hints', index, e.target.value)}
                />
                <button
                  type="button"
                  className="bg-red-600 px-2 py-1 rounded text-white"
                  onClick={() => removeFromArray('hints', index)}
                >
                  Delete
                </button>
              </div>
            ))}
            <button type="button" className="bg-blue-600 px-3 py-1 rounded" onClick={() => addToArray('hints')}>
              + Add Hint
            </button>
          </div>

          {/* Discussion */}
          <div>
            <label className="block mb-1">Discussion (Optional)</label>
            <textarea
              className="w-full p-2 font-mono rounded bg-gray-800 text-white border border-gray-600"
              rows={4}
              value={formData.discussion}
              onChange={(e) => handleChange('discussion', e.target.value)}
            />
          </div>

          {/* Reference Solutions */}
          <div>
            <label className="block mb-1">Reference Solutions (Language-wise)</label>
            {Object.entries(formData.referenceSolutions).map(([language, code], index) => (
              <div key={index} className="mb-3">
                <div className="flex items-center space-x-2">
                <select
  className="w-1/3 p-2 rounded bg-gray-800 text-white border border-gray-600"
  value={language} // Ensure this is the correct language key
  onChange={(e) => {
    const updated = { ...formData.referenceSolutions };
    const newLanguage = e.target.value;

    // Prevent overwriting an existing language key
    if (updated[newLanguage]) {
      alert("This language already exists. Please choose a different one.");
      return;
    }

    updated[newLanguage] = updated[language] || ''; // Move the code to the new language
    delete updated[language]; // Remove the old language key
    setFormData((prev) => ({ ...prev, referenceSolutions: updated }));
  }}
>
  <option value="JavaScript">JavaScript</option>
  <option value="Python">Python</option>
  <option value="Java">Java</option>
  <option value="C++">C++</option>
  <option value="C#">C#</option>
</select>
                  <button
                    type="button"
                    className="bg-red-600 px-2 py-1 rounded text-white"
                    onClick={() => removeReferenceSolution(language)}
                  >
                    Delete
                  </button>
                </div>
                <textarea
                  className="w-full p-2 font-mono rounded bg-gray-800 text-white border border-gray-600 mt-2"
                  placeholder={`Code for ${language}`}
                  rows={4}
                  value={code}
                  onChange={(e) => handleReferenceSolutionChange(language, e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-600 px-3 py-1 rounded"
              onClick={() => handleReferenceSolutionChange('JavaScript', '')} // Default to JavaScript
            >
              + Add Reference Solution
            </button>
            {errors.referenceSolutions && <p className="text-red-500 text-sm">{errors.referenceSolutions}</p>}
          </div>

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