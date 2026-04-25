import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === 'merchant') navigate('/merchant');
      else navigate('/reviewer');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-xl w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800">Login to your account</h3>
        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="username">Username</label>
            <input 
              type="text" 
              placeholder="Username"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input 
              type="password" 
              placeholder="Password"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-baseline justify-between mt-6">
            <button className="w-full px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none transition-colors">
              Login
            </button>
          </div>
          <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
