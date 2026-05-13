import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { 
  Lock, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  ShieldAlert,
  Loader2,
  RefreshCw
} from 'lucide-react';

export function ResetPasswordPage() {
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const elements = formRef.current?.querySelectorAll('[data-animate]');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (passwords.newPassword.length < 8) {
      newErrors.newPassword = 'Security key must be at least 8 characters';
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Sequences do not match';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setIsResetting(true);
      setTimeout(() => {
        setSubmitted(true);
        setTimeout(() => {
          navigate('/auth/login');
        }, 2500);
      }, 1500);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10 space-y-6">
        <div className="w-20 h-20 bg-brand-success/10 text-brand-success rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-brand-success/20 animate-bounce-slow">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight">Sequence Updated</h2>
          <p className="text-slate-500  font-medium">Your credentials have been successfully re-encrypted.</p>
        </div>
        <div className="flex justify-center pt-4">
          <Loader2 className="animate-spin text-brand-accent" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div ref={formRef} className="space-y-8">
      <div data-animate>
        <Link
          to="/auth/forgot-password"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-brand-accent transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Recovery
        </Link>
      </div>

      <div className="space-y-6">
        <div data-animate className="text-center">
          <div className="w-16 h-16 bg-brand-accent/10 text-brand-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
            <RefreshCw size={32} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Set New Access Key</h2>
          <p className="text-slate-500  mt-2 font-medium">
            Define a high-entropy sequence for your operator account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div data-animate className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Access Key</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-accent transition-colors" size={18} />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwords.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                placeholder="High-entropy sequence"
                className={`w-full pl-11 pr-12 py-4 bg-slate-50  border rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-medium ${
                  errors.newPassword ? 'border-red-500/50 bg-red-50/50' : 'border-slate-200'
                }`}

              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600  transition-colors"
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                <ShieldAlert size={10} /> {errors.newPassword}
              </p>
            )}
          </div>

          <div data-animate className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Sequence</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-accent transition-colors" size={18} />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwords.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="Verify sequence"
                className={`w-full pl-11 pr-12 py-4 bg-slate-50  border rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-medium ${
                  errors.confirmPassword ? 'border-red-500/50 bg-red-50/50' : 'border-slate-200'
                }`}

              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600  transition-colors"
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                <ShieldAlert size={10} /> {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            data-animate
            type="submit"
            disabled={isResetting}
            className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-accent/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isResetting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Reset Authentication'
            )}
          </button>
        </form>
      </div>

      <div data-animate className="text-center pt-4">
        <p className="text-xs font-bold text-slate-400">
          Remembered your key? <Link to="/auth/login" className="text-brand-accent hover:underline">Access Terminal</Link>
        </p>
      </div>
    </div>
  );
}

