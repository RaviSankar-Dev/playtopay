import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const res = await api.get(`/reviewer/application/${id}`);
      setAppData(res.data);
    } catch (err) {
      toast.error('Error fetching application');
      navigate('/reviewer');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if ((action === 'rejected' || action === 'more_info_requested') && !reason.trim()) {
      toast.error('Please provide a reason for this action.');
      return;
    }

    try {
      await api.post('/reviewer/action', {
        submission_id: appData.id,
        action,
        reason
      });
      toast.success(`Application marked as ${action.replace('_', ' ')}`);
      fetchApplication();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error performing action');
    }
  };

  if (loading || !appData) return <div className="p-10 text-center">Loading...</div>;

  const getStatusBadge = (status) => {
    const colors = {
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      more_info_requested: 'bg-orange-100 text-orange-800',
    };
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${colors[status] || 'bg-gray-100'}`}>{status.replace('_', ' ')}</span>;
  };

  const isResolved = appData.status === 'approved' || appData.status === 'rejected';

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Review Application</h1>
        <div className="flex items-center gap-4">
          <Link to="/reviewer" className="text-blue-600 hover:underline">Back to Queue</Link>
          <button onClick={logout} className="text-red-500 hover:text-red-700">Logout</button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 shadow rounded-xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{appData.merchant_name}</h2>
            <p className="text-gray-500">Submitted: {new Date(appData.updated_at).toLocaleString()}</p>
          </div>
          <div>{getStatusBadge(appData.status)}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 shadow rounded-xl">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Personal Information</h3>
            <div className="space-y-2">
              <p><span className="font-semibold text-gray-600">Full Name:</span> {appData.full_name || 'N/A'}</p>
              <p><span className="font-semibold text-gray-600">Email:</span> {appData.email || 'N/A'}</p>
              <p><span className="font-semibold text-gray-600">Phone:</span> {appData.phone_number || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-white p-6 shadow rounded-xl">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Business Information</h3>
            <div className="space-y-2">
              <p><span className="font-semibold text-gray-600">Business Name:</span> {appData.business_name || 'N/A'}</p>
              <p><span className="font-semibold text-gray-600">Type:</span> {appData.business_type || 'N/A'}</p>
              <p><span className="font-semibold text-gray-600">Expected Volume:</span> ${appData.expected_monthly_volume || '0'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Uploaded Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['pan_card', 'aadhaar_card', 'bank_statement'].map(doc => (
              <div key={doc} className="border p-4 rounded bg-gray-50 flex flex-col items-center">
                <span className="font-semibold mb-2 capitalize">{doc.replace('_', ' ')}</span>
                {appData[doc] ? (
                  <a href={appData[doc].startsWith('http') ? appData[doc] : `${import.meta.env.VITE_BASE_URL || 'http://localhost:8000'}${appData[doc]}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    View Document
                  </a>
                ) : (
                  <span className="text-red-500 text-sm">Not Uploaded</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {!isResolved && (
          <div className="bg-white p-6 shadow rounded-xl">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Reviewer Actions</h3>
            
            {(appData.status === 'submitted' || appData.status === 'under_review') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Required for Reject / More Info)</label>
                <textarea 
                  className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500" 
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why the application is rejected or what more info is needed..."
                />
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              {appData.status === 'submitted' && (
                <button onClick={() => handleAction('under_review')} className="px-4 py-2 bg-yellow-500 text-white rounded font-semibold hover:bg-yellow-600">
                  Move to Under Review
                </button>
              )}
              
              {appData.status === 'under_review' && (
                <>
                  <button onClick={() => handleAction('approved')} className="px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700">
                    Approve
                  </button>
                  <button onClick={() => handleAction('rejected')} className="px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700">
                    Reject
                  </button>
                  <button onClick={() => handleAction('more_info_requested')} className="px-4 py-2 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600">
                    Request More Info
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
