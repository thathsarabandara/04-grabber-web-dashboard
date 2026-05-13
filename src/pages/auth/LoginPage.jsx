import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../store/slices/authSlice';
import gsap from 'gsap';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2,
} from 'lucide-react';
import { RiShieldKeyholeFill } from 'react-icons/ri';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const formRef = useRef(null);

  useEffect(() => {
    const elements = formRef.current?.querySelectorAll('input, button, a, label, h2, p, .logo-icon');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (result.payload) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center sm:text-left relative">
        <div className="logo-icon w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-slate-900/20 relative group overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
           <RiShieldKeyholeFill className="text-brand-accent group-hover:text-white transition-colors relative z-10" size={28} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Operator Access
        </h2>
        <p className="text-slate-500 mt-2 font-medium">
          Initialize secure connection to the control core.
        </p>
        
        {/* HUD Decorative Element */}
        <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-brand-accent/20 rounded-tr-xl pointer-events-none"></div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
            System Identifier
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-accent transition-colors">
              <Mail size={18} />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all font-black text-sm text-slate-800 placeholder:font-medium"
              placeholder="operator@grabber-x.io"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Access Key
            </label>
            <Link 
              to="/auth/forgot-password" 
              className="text-[10px] font-black uppercase tracking-widest text-brand-accent hover:underline decoration-2 underline-offset-4"
            >
              Recover
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-accent transition-colors">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all font-black text-sm text-slate-800 placeholder:font-medium"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[11px] font-black uppercase tracking-widest animate-shake">
            Authentication Error: {error}
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 group transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/20 via-transparent to-brand-secondary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span className="relative z-10">Authorize Connection</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform relative z-10" />
            </>
          )}
        </button>
      </form>

      {/* Footer Links */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
          <span className="bg-white px-6 text-slate-400">Neural Network Entry</span>
        </div>
      </div>

      <Link
        to="/auth/register"
        className="block w-full text-center py-5 px-4 rounded-2xl border-2 border-slate-100 font-black uppercase tracking-widest text-[10px] text-slate-500 hover:bg-slate-50 hover:text-brand-accent hover:border-brand-accent/20 transition-all active:scale-[0.98]"
      >
        Request New Credentials
      </Link>
    </div>
  );
}
