import React, { useState, useEffect } from 'react';
import { FaPlay, FaPaperPlane } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from '@monaco-editor/react';

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function ProblemSolvingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { problemData } = location.state || {};
  const [activeTab, setActiveTab] = useState('description');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    if (!problemData) {
      navigate('/problems');
      return;
    }
    // Set initial code from codeSnippets if available
    if (problemData.codeSnippets && problemData.codeSnippets[language]) {
      setCode(problemData.codeSnippets[language]);
    }
    // Set solved status
    setIsSolved(problemData.isSolved || false);
    console.log(problemData.isSolved);
  }, [problemData, language, navigate]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/submissions/run`,
        {
          problemId: problemData.id,
          source_code: code,
          language: language.toUpperCase()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        setTestResults(response.data.results.map(result => ({
          passed: result.passed,
          input: result.input,
          expected: result.expected_output,
          output: result.actual_output,
          error: result.error
        })));
      } else {
        setError(response.data.error || 'Failed to run code');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error running code');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const requestData = {
        problemId: problemData.id,
        source_code: code,
        language: language.toUpperCase()
      };
      console.log('Submitting solution with data:', requestData);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/submissions/submit`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        // Show success message with coins earned and streak
        alert(`Congratulations! Problem solved successfully!\nYou earned ${response.data.coinsEarned} coins!\nYour current streak: ${response.data.streak}`);
        navigate('/problems');
      } else {
        setError(response.data.error || 'Failed to submit solution');
        // If there are test results in the error response, show them
        if (response.data.results) {
          setTestResults(response.data.results.map(result => ({
            passed: result.passed,
            input: result.input,
            expected: result.expected_output,
            output: result.actual_output,
            error: result.error
          })));
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error submitting solution');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!problemData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white px-6 md:px-20 py-10 space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Problem */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {problemData.title}{' '}
                <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
                  problemData.difficulty === 'Easy' ? 'bg-green-600' :
                  problemData.difficulty === 'Medium' ? 'bg-yellow-500' :
                  'bg-red-600'
                }`}>
                  {problemData.difficulty}
                </span>
                <span className="text-xs px-2 py-1 rounded-full ml-2 bg-blue-600">
                  {problemData.category}
                </span>
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mt-4 mb-6 text-sm">
              <button 
                className={`px-3 py-1 rounded font-medium ${
                  activeTab === 'description' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`px-3 py-1 rounded font-medium ${
                  activeTab === 'hints' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}
                onClick={() => setActiveTab('hints')}
              >
                Hints
              </button>
              <button 
                className={`px-3 py-1 rounded font-medium ${
                  activeTab === 'solutions' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}
                onClick={() => setActiveTab('solutions')}
              >
                Solutions
              </button>
              <button 
                className={`px-3 py-1 rounded font-medium ${
                  activeTab === 'discuss' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}
                onClick={() => setActiveTab('discuss')}
              >
                Discuss
              </button>
            </div>

            {/* Content based on active tab */}
            <div className="space-y-4">
              {activeTab === 'description' && (
                <>
                  <h3 className="font-semibold mb-2">Problem</h3>
                  <p className="text-sm text-gray-300 mb-4">{problemData.description}</p>

                  {/* Examples */}
                  <div className="space-y-4 text-sm">
                    {problemData.examples?.map((example, index) => (
                      <div key={index} className="bg-[#334155] p-4 rounded">
                        <p className="font-medium text-white mb-1">Example {index + 1}:</p>
                        <p className="text-gray-300"><strong>Input:</strong> {example.input}</p>
                        <p className="text-gray-300"><strong>Output:</strong> {example.output}</p>
                        {example.explanation && (
                          <p className="text-gray-400"><strong>Explanation:</strong> {example.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-1">Constraints</h4>
                    <ul className="list-disc ml-5 text-sm text-gray-300 space-y-1">
                      {problemData.constraints?.map((constraint, index) => (
                        <li key={index}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {activeTab === 'hints' && (
                <div className="space-y-4">
                  {problemData.hints?.map((hint, index) => (
                    <div key={index} className="bg-[#334155] p-4 rounded">
                      <p className="text-gray-300">Hint {index + 1}: {hint}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'solutions' && (
                <div className="space-y-4">
                  {Object.entries(problemData.referenceSolutions || {}).map(([lang, solution]) => (
                    <div key={lang} className="bg-[#334155] p-4 rounded">
                      <h4 className="font-semibold mb-2">{lang}</h4>
                      <pre className="text-sm text-gray-300 overflow-x-auto">
                        <code>{solution}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'discuss' && (
                <div className="space-y-4">
                  {problemData.discussion?.map((comment, index) => (
                    <div key={index} className="bg-[#334155] p-4 rounded">
                      <p className="text-gray-300">{comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Editor + Test Cases */}
        <div className="space-y-6">
          {/* Code Editor */}
          <div className="bg-[#1e293b] p-6 rounded-lg">
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">Code Editor</h3>
              <select 
                className="bg-gray-700 text-sm px-2 py-1 rounded text-white"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                {/* <option value="C">C</option>
                <option value="cpp">C++</option> */}
              </select>
            </div>
            <div className="h-[400px]">
              <CodeEditor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={setCode}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  readOnly: isSolved
                }}
              />
            </div>
            <div className="mt-4 flex gap-4">
              <button 
                className={`px-4 py-2 rounded flex items-center gap-2 text-sm text-white disabled:opacity-50 ${
                  isSolved ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500'
                }`}
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting || isSolved}
              >
                <FaPlay /> {isRunning ? 'Running...' : 'Run Code'}
              </button>
              <button 
                className={`px-4 py-2 rounded flex items-center gap-2 text-sm text-white disabled:opacity-50 ${
                  isSolved ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'
                }`}
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting || isSolved}
              >
                <FaPaperPlane /> {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>

          {/* Test Cases */}
          <div className="bg-[#1e293b] p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Test Cases</h3>
            {error && (
              <div className="bg-red-500 bg-opacity-20 text-red-200 p-4 rounded mb-4">
                {error}
              </div>
            )}
            <div className="space-y-3 text-sm">
              {testResults.length > 0 ? (
                testResults.map((result, index) => (
                  <div key={index} className={`p-4 rounded ${
                    result.passed ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'
                  }`}>
                    <p className="font-medium">Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}</p>
                    <p className="text-gray-300">Input: {result.input}</p>
                    <p className="text-gray-300">Expected: {result.expected}</p>
                    <p className="text-gray-300">Output: {result.output}</p>
                    {!result.passed && result.error && (
                      <p className="text-red-400">Error: {result.error}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center py-4">
                  Run your code to see test results
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
