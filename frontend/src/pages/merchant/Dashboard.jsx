import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function MerchantDashboard() {
  const { user, logout } = useAuthStore();
  const [kycData, setKycData] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    full_name: '', email: '', phone_number: '',
    business_name: '', business_type: '', expected_monthly_volume: ''
  });

  const [files, setFiles] = useState({ pan_card: null, aadhaar_card: null, bank_statement: null });

  useEffect(() => {
    fetchKYC();
  }, []);

  const fetchKYC = async () => {
    try {
      const res = await api.get('/my-kyc');
      setKycData(res.data);
      setFormData({
        full_name: res.data.full_name || '',
        email: res.data.email || '',
        phone_number: res.data.phone_number || '',
        business_name: res.data.business_name || '',
        business_type: res.data.business_type || '',
        expected_monthly_volume: res.data.expected_monthly_volume || ''
      });
    } catch (err) {
      toast.error('Error fetching KYC data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size cannot exceed 5MB');
        e.target.value = null;
        return;
      }
      setFiles({ ...files, [e.target.name]: file });
    }
  };

  const saveDraft = async () => {
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    Object.keys(files).forEach(key => { if (files[key]) data.append(key, files[key]) });

    try {
      await api.post('/kyc/save-draft', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Draft saved successfully');
      fetchKYC();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving draft');
    }
  };

  const submitKyc = async () => {
    // Save draft first to ensure everything is saved
    await saveDraft();
    try {
      await api.post('/kyc/submit');
      toast.success('KYC Submitted Successfully');
      fetchKYC();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error submitting KYC');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  const isEditable = kycData?.status === 'draft' || kycData?.status === 'more_info_requested';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Merchant Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user.username}</span>
          <button onClick={logout} className="text-red-500 hover:text-red-700">Logout</button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">KYC Application</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${kycData?.status === 'approved' ? 'bg-green-100 text-green-800' : kycData?.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {kycData?.status.replace('_', ' ')}
          </span>
        </div>

        {kycData?.rejection_reason && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
            <strong>Reviewer Note: </strong> {kycData.rejection_reason}
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`flex-1 text-center py-2 border-b-2 ${step === s ? 'border-blue-600 text-blue-600 font-bold' : 'border-gray-200 text-gray-400'}`}>
              Step {s}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Personal Details</h3>
              <input disabled={!isEditable} className="w-full border p-2 rounded mb-3" name="full_name" value={formData.full_name} onChange={handleInputChange} placeholder="Full Name" />
              <input disabled={!isEditable} className="w-full border p-2 rounded mb-3" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />
              <input disabled={!isEditable} className="w-full border p-2 rounded mb-3" name="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder="Phone Number" />
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Business Details</h3>
              <input disabled={!isEditable} className="w-full border p-2 rounded mb-3" name="business_name" value={formData.business_name} onChange={handleInputChange} placeholder="Business Name" />
              <input disabled={!isEditable} className="w-full border p-2 rounded mb-3" name="business_type" value={formData.business_type} onChange={handleInputChange} placeholder="Business Type" />
              <input disabled={!isEditable} className="w-full border p-2 rounded mb-3" type="number" name="expected_monthly_volume" value={formData.expected_monthly_volume} onChange={handleInputChange} placeholder="Expected Monthly Volume ($)" />
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Document Upload</h3>
              <div className="mb-3">
                <label className="block mb-1">PAN Card (PDF/JPG/PNG)</label>
                {kycData?.pan_card && <a href={kycData.pan_card.startsWith('http') ? kycData.pan_card : `${import.meta.env.VITE_BASE_URL || 'http://localhost:8000'}${kycData.pan_card}`} target="_blank" rel="noreferrer" className="text-blue-500 block mb-2 text-sm">View Current PAN</a>}
                <input disabled={!isEditable} type="file" name="pan_card" onChange={handleFileChange} className="w-full border p-2 rounded" />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Aadhaar Card (PDF/JPG/PNG)</label>
                {kycData?.aadhaar_card && <a href={kycData.aadhaar_card.startsWith('http') ? kycData.aadhaar_card : `${import.meta.env.VITE_BASE_URL || 'http://localhost:8000'}${kycData.aadhaar_card}`} target="_blank" rel="noreferrer" className="text-blue-500 block mb-2 text-sm">View Current Aadhaar</a>}
                <input disabled={!isEditable} type="file" name="aadhaar_card" onChange={handleFileChange} className="w-full border p-2 rounded" />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Bank Statement (PDF/JPG/PNG)</label>
                {kycData?.bank_statement && <a href={kycData.bank_statement.startsWith('http') ? kycData.bank_statement : `${import.meta.env.VITE_BASE_URL || 'http://localhost:8000'}${kycData.bank_statement}`} target="_blank" rel="noreferrer" className="text-blue-500 block mb-2 text-sm">View Current Statement</a>}
                <input disabled={!isEditable} type="file" name="bank_statement" onChange={handleFileChange} className="w-full border p-2 rounded" />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50">Previous</button>
          
          <div className="space-x-3">
            {isEditable && <button onClick={saveDraft} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">Save Draft</button>}
            
            {step < 3 ? (
              <button onClick={() => setStep(s => Math.min(3, s + 1))} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Next</button>
            ) : (
              isEditable && <button onClick={submitKyc} className="px-6 py-2 bg-green-600 text-white font-bold rounded shadow hover:bg-green-700">Submit KYC</button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
