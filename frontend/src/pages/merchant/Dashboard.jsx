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
      toast.error('Session expired');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setFiles({ ...files, [e.target.name]: file });
    } else if (file) {
      toast.error('File exceeds 5MB');
    }
  };

  const saveDraft = async () => {
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    Object.keys(files).forEach(key => { if (files[key]) data.append(key, files[key]) });

    try {
      await api.post('/kyc/save-draft', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Sync Successful');
      fetchKYC();
    } catch (err) {
      toast.error('Sync failed');
    }
  };

  const submitKyc = async () => {
    await saveDraft();
    try {
      await api.post('/kyc/submit');
      toast.success('KYC Transmitted');
      fetchKYC();
    } catch (err) {
      toast.error('Transmission failed');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-slate-100 border-t-[#0a4a3c] rounded-full animate-spin" />
    </div>
  );

  const isEditable = kycData?.status === 'draft' || kycData?.status === 'more_info_requested';

  const steps = [
    { id: 1, title: 'Identity', desc: 'Personal Record', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { id: 2, title: 'Business', desc: 'Entity Profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
    { id: 3, title: 'Review', desc: 'Asset Upload', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h10l5 5v11a2 2 0 01-2 2z" /></svg> },
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf7] selection:bg-[#f2b759]/30">
      <div className="absolute top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-[#0a4a3c]/5 to-transparent pointer-events-none" />
      
      <nav className="glass-panel border-b border-slate-200/40 h-20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-10 h-full flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0a4a3c] rounded-2xl flex items-center justify-center text-[#f2b759] font-black text-xl shadow-lg shadow-[#0a4a3c]/10">P</div>
              <div className="flex flex-col">
                <span className="font-black text-[#0a4a3c] uppercase tracking-tighter text-lg leading-none">Playto</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Merchant Hub</span>
              </div>
           </div>
           <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-[#0a4a3c] uppercase tracking-widest">{user.username}</span>
                <span className="text-[8px] font-black text-[#f2b759] uppercase tracking-tighter">Verified Account</span>
              </div>
              <button onClick={logout} className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
           </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto mt-16 px-10 relative z-10 pb-32">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20 animate-slide-up">
           <div className="max-w-xl">
              <h1 className="text-6xl font-black text-[#0a4a3c] tracking-tighter uppercase leading-[0.9] mb-4">Merchant<br/><span className="text-[#f2b759] text-glow-orange">Onboarding</span></h1>
              <p className="text-slate-500 font-medium text-lg">Secure your enterprise presence on the Playto network. Complete the three-stage verification to unlock full operational capabilities.</p>
           </div>
           <div className="flex flex-col items-end">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Verification Phase</p>
              <div className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border-2 shadow-sm flex items-center gap-3 ${kycData?.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : kycData?.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-[#f2b759]/10 text-[#0a4a3c] border-[#f2b759]/20'}`}>
                <div className={`w-2 h-2 rounded-full ${kycData?.status === 'approved' ? 'bg-emerald-500' : kycData?.status === 'rejected' ? 'bg-rose-500' : 'bg-[#f2b759] animate-pulse'}`} />
                {kycData?.status.replace('_', ' ')}
              </div>
           </div>
        </div>

        {kycData?.rejection_reason && (
          <div className="mb-12 p-8 bg-rose-50/50 border border-rose-100 rounded-[32px] glass-panel animate-slide-up flex gap-6 items-center">
             <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             </div>
             <div>
                <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-widest mb-1">Operational Feedback Received</h4>
                <p className="text-lg font-bold text-rose-900 tracking-tight">{kycData.rejection_reason}</p>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Progress Sidebar */}
          <div className="lg:col-span-4 space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
             {steps.map((s, idx) => (
               <div 
                 key={s.id} 
                 onClick={() => setStep(s.id)}
                 className={`premium-card p-8 rounded-[32px] cursor-pointer group flex items-center gap-6 ${step === s.id ? 'border-[#f2b759] ring-4 ring-[#f2b759]/5' : 'bg-white/40 opacity-60 hover:opacity-100'}`}
               >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${step >= s.id ? 'bg-[#0a4a3c] text-[#f2b759] shadow-xl' : 'bg-slate-100 text-slate-300'}`}>
                     {s.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-[#0a4a3c]' : 'text-slate-300'}`}>{s.title}</span>
                    <span className="text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors">{s.desc}</span>
                  </div>
               </div>
             ))}
          </div>

          {/* Form Content */}
          <div className="lg:col-span-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="premium-card p-12 rounded-[40px] shadow-2xl shadow-[#0a4a3c]/5 min-h-[500px] flex flex-col">
               {step === 1 && (
                 <div className="space-y-12 animate-slide-up">
                    <div className="border-b border-slate-100 pb-8">
                       <h3 className="text-2xl font-black text-[#0a4a3c] tracking-tight uppercase">Identity Record</h3>
                       <p className="text-slate-400 text-sm font-medium mt-1">Provide legal identification as documented in government records.</p>
                    </div>
                    <div className="space-y-8">
                      {['full_name', 'email', 'phone_number'].map(field => (
                        <div key={field} className="group space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-[#0a4a3c] transition-colors">{field.replace('_', ' ')}</label>
                          <input 
                            disabled={!isEditable} 
                            name={field} 
                            value={formData[field]} 
                            onChange={handleInputChange}
                            className="w-full bg-slate-50/50 border-2 border-transparent p-5 rounded-[24px] text-base font-bold text-[#0a4a3c] focus:bg-white focus:border-[#f2b759] focus:ring-8 focus:ring-[#f2b759]/5 outline-none transition-all disabled:opacity-40" 
                            placeholder={`Enter ${field.replace('_', ' ')}`}
                          />
                        </div>
                      ))}
                    </div>
                 </div>
               )}

               {step === 2 && (
                 <div className="space-y-12 animate-slide-up">
                    <div className="border-b border-slate-100 pb-8">
                       <h3 className="text-2xl font-black text-[#0a4a3c] tracking-tight uppercase">Entity Profile</h3>
                       <p className="text-slate-400 text-sm font-medium mt-1">Document the operational specifics of your business entity.</p>
                    </div>
                    <div className="space-y-8">
                      {['business_name', 'business_type', 'expected_monthly_volume'].map(field => (
                        <div key={field} className="group space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-[#0a4a3c] transition-colors">{field.replace('_', ' ')}</label>
                          <input 
                            disabled={!isEditable} 
                            name={field} 
                            type={field.includes('volume') ? 'number' : 'text'}
                            value={formData[field]} 
                            onChange={handleInputChange}
                            className="w-full bg-slate-50/50 border-2 border-transparent p-5 rounded-[24px] text-base font-bold text-[#0a4a3c] focus:bg-white focus:border-[#f2b759] focus:ring-8 focus:ring-[#f2b759]/5 outline-none transition-all disabled:opacity-40" 
                            placeholder={`Enter ${field.replace('_', ' ')}`}
                          />
                        </div>
                      ))}
                    </div>
                 </div>
               )}

               {step === 3 && (
                 <div className="space-y-12 animate-slide-up">
                    <div className="border-b border-slate-100 pb-8">
                       <h3 className="text-2xl font-black text-[#0a4a3c] tracking-tight uppercase">Asset Transmission</h3>
                       <p className="text-slate-400 text-sm font-medium mt-1">Upload cryptographic proofs and verification documents.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {['pan_card', 'aadhaar_card', 'bank_statement'].map(doc => (
                        <div key={doc} className="group p-8 bg-slate-50/50 rounded-[32px] border-2 border-transparent hover:border-[#f2b759]/30 transition-all">
                           <div className="flex justify-between items-center mb-6">
                              <span className="text-[10px] font-black text-[#0a4a3c] uppercase tracking-widest">{doc.replace('_', ' ')}</span>
                              {kycData?.[doc] && (
                                <a href={kycData[doc].startsWith('http') ? kycData[doc] : `${import.meta.env.VITE_BASE_URL || 'http://localhost:8000'}${kycData[doc]}`} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-[#0a4a3c] hover:bg-[#0a4a3c] hover:text-white transition-all shadow-sm">Review Link</a>
                              )}
                           </div>
                           <input 
                             disabled={!isEditable} 
                             type="file" 
                             name={doc} 
                             onChange={handleFileChange} 
                             className="w-full text-xs font-bold text-slate-400 file:mr-6 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#0a4a3c] file:text-[#f2b759] file:shadow-lg file:shadow-[#0a4a3c]/10 cursor-pointer disabled:opacity-40" 
                           />
                        </div>
                      ))}
                    </div>
                 </div>
               )}

               <div className="mt-auto pt-16 flex justify-between items-center border-t border-slate-100">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setStep(s => Math.max(1, s - 1))} 
                      disabled={step === 1}
                      className="px-10 py-4 bg-white border-2 border-slate-100 text-[#0a4a3c] rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:bg-slate-50 transition-all active:scale-95"
                    >
                      Back
                    </button>
                    {isEditable && (
                      <button 
                        onClick={saveDraft}
                        className="px-10 py-4 bg-[#0a4a3c]/5 text-[#0a4a3c] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0a4a3c]/10 transition-all active:scale-95"
                      >
                        Sync Data
                      </button>
                    )}
                  </div>

                  {step < 3 ? (
                    <button 
                      onClick={() => setStep(s => Math.min(3, s + 1))}
                      className="px-12 py-4 bg-[#0a4a3c] text-[#f2b759] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#0a4a3c]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                      Next Phase
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  ) : (
                    isEditable && (
                      <button 
                        onClick={submitKyc}
                        className="px-16 py-5 bg-[#f2b759] text-[#0a4a3c] rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-[#f2b759]/30 hover:scale-105 active:scale-95 transition-all"
                      >
                        Transmit Application
                      </button>
                    )
                  )}
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
