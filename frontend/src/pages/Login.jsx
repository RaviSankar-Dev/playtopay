import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      const user = JSON.parse(localStorage.getItem('user'));
      toast.success('Access Granted: Integrity Verified');
      if (user.role === 'merchant') navigate('/merchant');
      else navigate('/reviewer');
    } catch (error) {
      toast.error('Authentication Error: Credential Mismatch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fcfbf7] overflow-hidden selection:bg-[#f2b759]/30">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-radial from-[#f2b759]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-radial from-[#0a4a3c]/10 to-transparent blur-[100px] pointer-events-none" />

      {/* Left Branding Area */}
      <div className="hidden lg:flex lg:w-3/5 relative flex-col justify-center px-24 z-10">
         <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#0a4a3c]/5 border border-[#0a4a3c]/10 mb-8">
               <div className="w-2 h-2 rounded-full bg-[#0a4a3c] animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0a4a3c]">System Core Active</span>
            </div>
            <h1 className="text-[120px] font-black text-[#0a4a3c] leading-[0.85] tracking-[-0.06em] uppercase">
               Playto<br/>
               <span className="text-[#f2b759] text-glow-orange">Integrity</span>
            </h1>
         </div>
         
         <div className="max-w-md animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl font-medium text-slate-500 leading-relaxed">
               The global standard for decentralized identity verification and merchant operational compliance.
            </p>
         </div>

         <div className="mt-24 grid grid-cols-2 gap-12 border-t border-slate-200 pt-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div>
               <p className="text-3xl font-black text-[#0a4a3c]">99.9%</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Audit Precision</p>
            </div>
            <div>
               <p className="text-3xl font-black text-[#0a4a3c]">0.2s</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Latency Peak</p>
            </div>
         </div>
      </div>

      {/* Right Form Area */}
      <div className="w-full lg:w-2/5 relative flex items-center justify-center p-8 z-20">
        <div className="w-full max-w-sm glass-panel p-10 rounded-[40px] shadow-2xl shadow-[#0a4a3c]/5 border border-white/40 animate-slide-up">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#0a4a3c] rounded-2xl mx-auto mb-6 flex items-center justify-center text-[#f2b759] shadow-xl rotate-3 hover:rotate-0 transition-transform">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h2 className="text-2xl font-black text-[#0a4a3c] tracking-tight uppercase">Security Vault</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Authenticated Access Required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <input 
                type="text" 
                className="w-full bg-white/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#0a4a3c] focus:border-[#f2b759] focus:ring-4 focus:ring-[#f2b759]/5 outline-none transition-all placeholder:text-slate-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Operational ID"
              />
            </div>

            <div className="space-y-2">
              <input 
                type="password" 
                className="w-full bg-white/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#0a4a3c] focus:border-[#f2b759] focus:ring-4 focus:ring-[#f2b759]/5 outline-none transition-all placeholder:text-slate-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Access Secret"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full py-5 bg-[#0a4a3c] hover:bg-[#0a4a3c]/90 text-[#f2b759] rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-xl shadow-[#0a4a3c]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#f2b759] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Decrypt & Access
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-200/50 text-center">
             <Link to="/signup" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0a4a3c] transition-colors">
               Not Registered? <span className="text-[#0a4a3c] border-b border-[#f2b759]">Establish Identity</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
