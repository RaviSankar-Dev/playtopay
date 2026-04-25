import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('merchant');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/signup', { username, password, role });
      toast.success('Account created successfully. Please login.');
      navigate('/login');
    } catch (error) {
      toast.error('Error creating account');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-xl w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800">Create an account</h3>
        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="username">Username</label>
            <input 
              type="text" 
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
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="role">Role</label>
            <select
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="merchant">Merchant</option>
              <option value="reviewer">Reviewer</option>
            </select>
          </div>
          <div className="flex items-baseline justify-between mt-6">
            <button className="w-full px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none transition-colors">
              Sign Up
            </button>
          </div>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
