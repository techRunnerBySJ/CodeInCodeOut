import React from 'react';
import { FaCrown, FaTags, FaChartLine, FaBolt, FaCheck } from 'react-icons/fa';

export default function Premium() {
  const features = [
    { icon: <FaCrown className="text-yellow-400" />, title: 'Premium Problems', desc: 'Access to 500+ exclusive premium problems from top companies' },
    { icon: <FaTags className="text-yellow-400" />, title: 'Company Tags', desc: 'See which companies ask specific problems in interviews' },
    { icon: <FaChartLine className="text-yellow-400" />, title: 'Advanced Analytics', desc: 'Detailed progress tracking and performance analytics' },
    { icon: <FaBolt className="text-yellow-400" />, title: 'Solution Videos', desc: 'High-quality video explanations for complex problems' },
  ];

  const plans = [
    {
      title: 'Monthly',
      price: '$9.99',
      subtitle: '/month',
      features: [
        'All premium problems',
        'Company interview insights',
        'Advanced analytics',
        'Video solutions',
        'Priority support'
      ],
      buttonStyle: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      title: 'Annual',
      price: '$99.99',
      subtitle: '/year',
      highlight: 'Most Popular',
      save: 'Save 17%',
      features: [
        'All premium problems',
        'Company interview insights',
        'Advanced analytics',
        'Video solutions',
        'Priority support'
      ],
      buttonStyle: 'bg-yellow-400 hover:bg-yellow-500 text-black border border-yellow-500',
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white px-6 py-12 md:px-24">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex justify-center items-center gap-2">
          <span className="text-yellow-400"><FaCrown size={24} /></span> CodeMaster Premium
        </h1>
        <p className="text-gray-300">Unlock your full coding potential with premium features</p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 text-center">
        {features.map((feature, i) => (
          <div key={i} className="bg-[#1e293b] p-6 rounded-lg border border-blue-800">
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Plans */}
      <h2 className="text-2xl font-semibold text-center mb-8">Choose Your Plan</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative w-full md:w-96 bg-[#1e293b] p-6 rounded-xl border ${
              plan.highlight ? 'border-yellow-500' : 'border-blue-800'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {plan.highlight}
              </div>
            )}
            <h3 className="text-xl font-semibold text-center mb-2">{plan.title}</h3>
            <div className="text-center text-3xl font-bold mb-1">{plan.price}</div>
            <p className="text-center text-sm text-gray-300 mb-4">{plan.subtitle}</p>
            {plan.save && (
              <div className="text-center mb-4">
                <span className="text-green-400 bg-green-800 text-xs font-semibold px-2 py-1 rounded">
                  {plan.save}
                </span>
              </div>
            )}
            <ul className="space-y-2 text-sm mb-6 text-gray-200">
              {plan.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <FaCheck className="text-green-400" /> {feat}
                </li>
              ))}
            </ul>
            <button className={`w-full py-2 rounded ${plan.buttonStyle} font-semibold`}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
