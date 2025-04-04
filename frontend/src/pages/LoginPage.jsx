import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    // Check attempt limit
    if (attempts >= 2) {
      setError('Maximum attempts reached. Please register or try again later.');
      return;
    }
    try {
      setError('');
      setLoading(true);
      const result = await login(email, password);

      if (result.success) {
        navigate('/tasks');
      } else {
        setAttempts(prev => prev + 1);

        // Custom message for unregistered users
        if (result.code === 'USER_NOT_FOUND') {
          setError('Account not found. Please register first.');
        }
        // Custom message for invalid credentials
        else if (result.code === 'INVALID_CREDENTIALS') {
          const remainingAttempts = 2 - attempts;
          setError(
            `Invalid credentials. ${
              remainingAttempts > 0
                ? `${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`
                : 'Please register or try again later.'
            }`,
          );
        }
        // Default error message
        else {
          setError(result.message || 'Login failed');
        }
      }
    } catch (err) {
      setError('Failed to log in: ' + err.message);
      setAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    //const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${baseURL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md transition-colors disabled:opacity-70"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google logo" className="w-5 h-5" />
            Continue with Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Do&apos;t have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
