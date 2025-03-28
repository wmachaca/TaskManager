import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col md:flex-row items-center justify-center p-4">
      {/* Left side - Content */}
      <div className="md:w-1/2 flex flex-col items-center md:items-start space-y-8 p-8">
        <h1 className="text-5xl font-bold text-gray-800">Task Manager</h1>
        <p className="text-xl text-gray-600 max-w-md text-center md:text-left">
          Organize your work and life with our simple yet powerful task management tool.
        </p>
        
        <div 
          className="bg-white p-6 rounded-lg shadow-xl cursor-pointer transform hover:scale-105 transition-transform"
          onClick={() => setShowLoginPrompt(true)}
        >
          <h2 className="text-2xl font-semibold text-gray-700">Get Started</h2>
          <p className="text-gray-500 mt-2">Click here to begin managing your tasks</p>
        </div>

        {showLoginPrompt && (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <p className="text-gray-700 mb-4">Please log in to view your tasks</p>
            <div className="flex space-x-4">
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Right side - Illustration */}
      <div className="md:w-1/2 flex justify-center p-8">
        <img 
          src="https://illustrations.popsy.co/amber/digital-nomad.svg" 
          alt="Task management illustration" 
          className="max-w-md w-full"
        />
      </div>
    </div>
  );
}