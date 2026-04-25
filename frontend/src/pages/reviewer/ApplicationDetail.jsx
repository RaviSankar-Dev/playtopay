import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/reviewer/application/${id}`);
      setSubmission(res.data);
    } catch (err) {
      toast.error('Dossier Retrieval Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status) => {
    if ((status === 'rejected' || status === 'more_info_requested') && !reason) {
      toast.error('Operational rationale required');
      return;
    }
    setActionLoading(true);
    try {
      await api.post('/reviewer/action', { submission_id: id, action: status, reason });
      toast.success(`Protocol Updated: ${status.replace('_', ' ')}`);
      navigate('/reviewer');
    } catch (err) {
      toast.error('Action Transmission Error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-slate-100 border-t-[#0a4a3c] rounded-full animate-spin" />
    </div>
  );

  if (!submission) return (
    <div className="min-h-screen bg-[#fcfbf7] flex flex-col items-center justify-center p-12">
       <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mb-8">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
       </div>
       <h2 className="text-3xl font-black text-[#0a4a3c] uppercase tracking-tighter mb-4">Dossier Missing</h2>
       <p className="text-slate-400 font-medium mb-12 text-center max-w-sm">The requested case profile is either offline or has been purged from the active operations database.</p>
       <button onClick={() => navigate('/reviewer')} className="px-10 py-4 bg-[#0a4a3c] text-[#f2b759] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95">Return to Command Center</button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#fcfbf7] selection:bg-[#f2b759]/30">
      {/* Subject Information Area */}
      <div className="flex-1 overflow-y-auto pb-32">
        <nav className="h-20 border-b border-slate-200/40 flex items-center px-12 bg-white/50 sticky top-0 z-50 backdrop-blur-md">
           <Link to="/reviewer" className="group flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0a4a3c] transition-colors">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Return to Ops
           </Link>
           <div className="ml-auto flex items-center gap-8">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Case ID: {id.slice(-8).toUpperCase()}</span>
              <div className="h-8 w-px bg-slate-100" />
              <button onClick={logout} className="p-2 text-slate-300 hover:text-rose-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
           </div>
        </nav>

        <div className="max-w-4xl mx-auto mt-16 px-12 animate-slide-up">
           <header className="mb-20">
              <div className="flex justify-between items-start gap-10">
                 <div>
                    <h1 className="text-6xl font-black text-[#0a4a3c] tracking-tighter uppercase leading-[0.9] mb-4">Subject<br/><span className="text-[#f2b759] text-glow-orange">Profile</span></h1>
                    <p className="text-slate-500 font-medium text-lg">Comprehensive audit of entity credentials and identity assets.</p>
                 </div>
                 <div className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border-2 shadow-sm ${submission?.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : submission?.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-[#f2b759]/10 text-[#0a4a3c] border-[#f2b759]/20'}`}>
                    {submission?.status.replace('_', ' ')}
                 </div>
              </div>
           </header>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
              <div className="premium-card p-10 rounded-[40px]">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 border-b border-slate-50 pb-4">Identification</h4>
                 <div className="space-y-6">
                    <div>
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Full Legal Name</p>
                       <p className="text-xl font-black text-[#0a4a3c] uppercase">{submission.full_name}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Electronic Mail</p>
                       <p className="text-sm font-bold text-slate-600">{submission.email}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Communication Sequence</p>
                       <p className="text-sm font-bold text-slate-600">{submission.phone_number}</p>
                    </div>
                 </div>
              </div>

              <div className="premium-card p-10 rounded-[40px]">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 border-b border-slate-50 pb-4">Entity Profile</h4>
                 <div className="space-y-6">
                    <div>
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Registered Entity</p>
                       <p className="text-xl font-black text-[#0a4a3c] uppercase">{submission.business_name || 'N/A'}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Industry Segment</p>
                       <p className="text-sm font-bold text-slate-600">{submission.business_type || 'N/A'}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Projected Volume</p>
                       <p className="text-sm font-black text-[#f2b759]">${Number(submission.expected_monthly_volume).toLocaleString()}/mo</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-8 mb-20">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Cryptographic Assets</h4>
              <div className="grid grid-cols-1 gap-6">
                 {['pan_card', 'aadhaar_card', 'bank_statement'].map(doc => (
                    <div key={doc} className="premium-card p-8 rounded-[32px] flex justify-between items-center bg-white/40 group hover:bg-white transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-[#0a4a3c]/5 flex items-center justify-center text-[#0a4a3c] group-hover:bg-[#0a4a3c] group-hover:text-[#f2b759] transition-all">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h10l5 5v11a2 2 0 01-2 2z" /></svg>
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-[#0a4a3c] uppercase tracking-widest">{doc.replace('_', ' ')}</p>
                             <p className="text-[10px] font-bold text-slate-400">Security Verification Document</p>
                          </div>
                       </div>
                       {submission[doc] ? (
                          <a href={submission[doc].startsWith('http') ? submission[doc] : `${import.meta.env.VITE_BASE_URL || 'http://localhost:8000'}${submission[doc]}`} target="_blank" rel="noreferrer" className="px-8 py-3 bg-[#0a4a3c] text-[#f2b759] rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-[#0a4a3c]/10 hover:scale-105 transition-all">Execute View</a>
                       ) : (
                          <span className="text-[10px] font-black text-rose-300 uppercase tracking-widest">Asset Missing</span>
                       )}
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Control Terminal Sidebar */}
      <div className="w-[450px] bg-[#0a4a3c] relative flex flex-col p-12 overflow-hidden shadow-2xl">
         <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-[#f2b759]/10 rounded-full blur-[120px] pointer-events-none" />
         
         <div className="relative z-10 flex flex-col h-full">
            <div className="mb-12">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/60">Ready for Execution</span>
               </div>
               <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Audit<br/>Decision</h2>
               <p className="text-emerald-100/40 font-black uppercase text-[10px] tracking-[0.3em]">Final Operational Determination</p>
            </div>

            <div className="space-y-6 flex-1">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#f2b759] uppercase tracking-widest">Rationale / Review Notes</label>
                  <textarea 
                    className="w-full h-40 bg-black/20 border border-white/10 rounded-3xl p-6 text-sm font-bold text-emerald-50 focus:border-[#f2b759]/50 outline-none transition-all placeholder:text-white/10"
                    placeholder="Enter technical rationale for the decision sequence..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
               </div>

               <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => handleAction('approved')}
                    disabled={actionLoading}
                    className="w-full py-5 bg-[#f2b759] text-[#0a4a3c] rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                  >
                    Execute Approval
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                     <button 
                       onClick={() => handleAction('more_info_requested')}
                       disabled={actionLoading}
                       className="py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-[0.98]"
                     >
                       Request Details
                     </button>
                     <button 
                       onClick={() => handleAction('rejected')}
                       disabled={actionLoading}
                       className="py-5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-[0.98]"
                     >
                       Reject Entity
                     </button>
                  </div>
               </div>
            </div>

            <div className="mt-12 pt-12 border-t border-white/5 opacity-40">
               <p className="text-[8px] font-black text-white uppercase tracking-[0.4em] text-center">Protocol V4 Audit Layer Security Active</p>
            </div>
         </div>
      </div>
    </div>
  );
}
