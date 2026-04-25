import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';

const StatCard = ({ title, value, icon, colorHex }) => (
  <div className="premium-card p-8 rounded-[32px] flex items-center justify-between group">
    <div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
      <p className="text-4xl font-black text-[#0a4a3c] tracking-tight">{value}</p>
    </div>
    <div 
      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
      style={{ backgroundColor: colorHex }}
    >
      {icon}
    </div>
  </div>
);

export default function ReviewerDashboard() {
  const { user, logout } = useAuthStore();
  const [data, setData] = useState({ metrics: { total_count: 0, avg_time_hours: 0, approval_rate: 0, at_risk: 0 }, queue: [] });
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
    const configs = {
      submitted: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', label: 'In Queue' },
      under_review: { bg: 'bg-[#f2b759]/10', text: 'text-[#0a4a3c]', border: 'border-[#f2b759]/30', label: 'Auditing' },
      approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', label: 'Cleared' },
      rejected: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', label: 'Declined' },
      more_info_requested: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', label: 'Action Req.' },
    };
    const config = configs[status] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-100', label: status };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${config.bg} ${config.text} ${config.border}`}>
        {config.label}
      </span>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fcfbf7] flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-slate-100 border-t-[#0a4a3c] rounded-full animate-spin" />
    </div>
  );

  const { metrics, queue } = data;

  return (
    <div className="min-h-screen bg-[#fcfbf7] selection:bg-[#f2b759]/30">
      <nav className="glass-panel border-b border-slate-200/40 h-20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-10 h-full flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0a4a3c] rounded-2xl flex items-center justify-center text-[#f2b759] font-black text-xl shadow-lg shadow-[#0a4a3c]/10">A</div>
              <div className="flex flex-col">
                <span className="font-black text-[#0a4a3c] uppercase tracking-tighter text-lg leading-none">Playto</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Audit Command</span>
              </div>
           </div>
           <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-[#0a4a3c] uppercase tracking-widest">{user.username}</span>
                <span className="text-[8px] font-black text-[#f2b759] uppercase tracking-tighter">System Auditor</span>
              </div>
              <button onClick={logout} className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
           </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-16 px-10 pb-32">
        <div className="mb-20 animate-slide-up">
           <h1 className="text-6xl font-black text-[#0a4a3c] tracking-tighter uppercase leading-[0.9] mb-4">Pipeline<br/><span className="text-[#f2b759] text-glow-orange">Operations</span></h1>
           <p className="text-slate-500 font-medium text-lg max-w-2xl">Monitor real-time merchant submissions and manage the audit lifecycle across the Playto infrastructure.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
           <StatCard title="Active Queue" value={metrics.total_count} colorHex="#0a4a3c" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>} />
           <StatCard title="Avg Response" value={`${metrics.avg_time_hours}h`} colorHex="#f2b759" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
           <StatCard title="Audit Rate" value={`${metrics.approval_rate}%`} colorHex="#0a4a3c" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} />
           <StatCard title="SLA Alerts" value={metrics.at_risk} colorHex="#f2b759" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} />
        </div>

        {/* Data Table */}
        <div className="premium-card rounded-[40px] overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 className="text-xl font-black text-[#0a4a3c] tracking-tight uppercase">Audit Queue</h3>
             <div className="flex gap-4 items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Stream Active</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity Name</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission</th>
                  <th className="px-10 py-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queue.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#0a4a3c]/5 flex items-center justify-center font-black text-[#0a4a3c] text-sm group-hover:bg-[#0a4a3c] group-hover:text-[#f2b759] transition-all">
                             {app.merchant_name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                             <span className="font-black text-[#0a4a3c] uppercase tracking-tight">{app.merchant_name}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified ID</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{app.business_name || 'N/A'}</span>
                    </td>
                    <td className="px-10 py-8">
                       {getStatusBadge(app.status)}
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex flex-col">
                          <span className="text-[11px] font-black text-[#0a4a3c]">{new Date(app.updated_at).toLocaleDateString()}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase">{new Date(app.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <button 
                        onClick={() => navigate(`/reviewer/application/${app.id}`)}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-[#0a4a3c] text-[#f2b759] rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-[#0a4a3c]/10 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                       >
                         Execute Audit
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                       </button>
                    </td>
                  </tr>
                ))}
                {queue.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-10 py-32 text-center text-slate-300 italic text-[10px] font-black uppercase tracking-widest">
                       No pending operations detected in current pipeline.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
