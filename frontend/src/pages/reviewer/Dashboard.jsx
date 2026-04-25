import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';

export default function ReviewerDashboard() {
  const { user, logout } = useAuthStore();
  const [data, setData] = useState({ metrics: {}, queue: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await api.get('/reviewer/queue');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      more_info_requested: 'bg-orange-100 text-orange-800',
    };
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status] || 'bg-gray-100'}`}>{status.replace('_', ' ')}</span>;
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  const { metrics, queue } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Reviewer Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Reviewer: {user.username}</span>
          <button onClick={logout} className="text-red-500 hover:text-red-700">Logout</button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto mt-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-500">
            <h3 className="text-sm text-gray-500 font-semibold uppercase">Total Queue</h3>
            <p className="text-3xl font-bold mt-2">{metrics.total_count}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-t-4 border-yellow-500">
            <h3 className="text-sm text-gray-500 font-semibold uppercase">Avg Time in Queue</h3>
            <p className="text-3xl font-bold mt-2">{metrics.avg_time_hours} hrs</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-t-4 border-green-500">
            <h3 className="text-sm text-gray-500 font-semibold uppercase">Approval Rate (7D)</h3>
            <p className="text-3xl font-bold mt-2">{metrics.approval_rate}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-t-4 border-red-500">
            <h3 className="text-sm text-gray-500 font-semibold uppercase">At Risk (&gt;24h)</h3>
            <p className="text-3xl font-bold mt-2 text-red-600">{metrics.at_risk}</p>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm border-b">
                <th className="p-4">Merchant</th>
                <th className="p-4">Business</th>
                <th className="p-4">Status</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map(app => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{app.merchant_name}</td>
                  <td className="p-4">{app.business_name || '-'}</td>
                  <td className="p-4">{getStatusBadge(app.status)}</td>
                  <td className="p-4">{new Date(app.updated_at).toLocaleString()}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => navigate(`/reviewer/application/${app.id}`)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {queue.length === 0 && (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">No applications in queue</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
