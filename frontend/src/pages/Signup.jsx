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
      toast.success('Protocol Registry Successful. Please Authenticate.');
      navigate('/login');
    } catch (error) {
      toast.error('Registry Error. Signature already exists.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fcfbf7] overflow-hidden selection:bg-[#f2b759]/30">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-radial from-[#0a4a3c]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-radial from-[#f2b759]/10 to-transparent blur-[100px] pointer-events-none" />

      {/* Left Branding Area */}
      <div className="hidden lg:flex lg:w-3/5 relative flex-col justify-center px-24 z-10">
         <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#0a4a3c]/5 border border-[#0a4a3c]/10 mb-8">
               <div className="w-2 h-2 rounded-full bg-[#f2b759] animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0a4a3c]">Operational Registry Open</span>
            </div>
            <h1 className="text-[120px] font-black text-[#0a4a3c] leading-[0.85] tracking-[-0.06em] uppercase">
               Join the<br/>
               <span className="text-[#f2b759] text-glow-orange">Network</span>
            </h1>
         </div>
         
         <div className="max-w-md animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl font-medium text-slate-500 leading-relaxed">
               Secure your place in the future of decentralized merchant verification. Establish your operational identity today.
            </p>
         </div>

         <div className="mt-24 flex items-center gap-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-12 h-12 rounded-full border-4 border-[#fcfbf7] bg-slate-200" />
               ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
               Trusted by <span className="text-[#0a4a3c]">500+ Verified Entities</span>
            </p>
         </div>
      </div>

      {/* Right Form Area */}
      <div className="w-full lg:w-2/5 relative flex items-center justify-center p-8 z-20">
        <div className="w-full max-w-sm glass-panel p-10 rounded-[40px] shadow-2xl shadow-[#0a4a3c]/5 border border-white/40 animate-slide-up">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#0a4a3c] rounded-2xl mx-auto mb-6 flex items-center justify-center text-[#f2b759] shadow-xl -rotate-3 hover:rotate-0 transition-transform">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            </div>
            <h2 className="text-2xl font-black text-[#0a4a3c] tracking-tight uppercase">Registry Terminal</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Establish New System Credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <input 
                type="text" 
                className="w-full bg-white/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#0a4a3c] focus:border-[#f2b759] focus:ring-4 focus:ring-[#f2b759]/5 outline-none transition-all placeholder:text-slate-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Unique Username"
              />
            </div>

            <div className="space-y-2">
              <input 
                type="password" 
                className="w-full bg-white/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-[#0a4a3c] focus:border-[#f2b759] focus:ring-4 focus:ring-[#f2b759]/5 outline-none transition-all placeholder:text-slate-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Security Key"
              />
            </div>

            <div className="space-y-2">
              <select
                className="w-full bg-white/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-[#0a4a3c] focus:border-[#f2b759] outline-none transition-all appearance-none cursor-pointer uppercase tracking-widest"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="merchant">Merchant Entity</option>
                <option value="reviewer">System Auditor</option>
              </select>
            </div>

            <button className="w-full py-5 bg-[#0a4a3c] hover:bg-[#0a4a3c]/90 text-[#f2b759] rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-xl shadow-[#0a4a3c]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
              Establish Record
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-200/50 text-center">
             <Link to="/login" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#0a4a3c] transition-colors">
               Already Registered? <span className="text-[#0a4a3c] border-b border-[#f2b759]">Access Terminal</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
