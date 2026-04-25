import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Signup from './pages/Signup';
import MerchantDashboard from './pages/merchant/Dashboard';
import ReviewerDashboard from './pages/reviewer/Dashboard';
import ApplicationDetail from './pages/reviewer/ApplicationDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/merchant" element={
            <ProtectedRoute allowedRole="merchant">
              <MerchantDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/reviewer" element={
            <ProtectedRoute allowedRole="reviewer">
              <ReviewerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/reviewer/application/:id" element={
            <ProtectedRoute allowedRole="reviewer">
              <ApplicationDetail />
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
