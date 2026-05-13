import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { 
  Mail, 
  ArrowLeft, 
  Send, 
  CheckCircle2,
  KeyRound,
  Loader2
} from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const elements = formRef.current?.querySelectorAll('[data-animate]');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.includes('@')) {
      setIsSending(true);
      setTimeout(() => {
        setSubmitted(true);
        setTimeout(() => {
          navigate('/auth/reset-password');
        }, 2500);
      }, 1500);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10 space-y-6">
        <div className="w-20 h-20 bg-brand-success/10 text-brand-success rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-brand-success/20 animate-bounce-slow">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight">Transmission Sent</h2>
          <p className="text-slate-500  font-medium">
            Reset link dispatched to <span className="text-slate-800  font-bold">{email}</span>
          </p>
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
          to="/auth/login"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-brand-accent transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Terminal
        </Link>
      </div>

      <div className="space-y-6">
        <div data-animate className="text-center">
          <div className="w-16 h-16 bg-brand-accent/10 text-brand-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
            <KeyRound size={32} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Recover Access</h2>
          <p className="text-slate-500  mt-2 font-medium">
            Enter your operator email to receive recovery instructions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div data-animate className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Operator Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-accent transition-colors" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@grabber-x.io"
                className="w-full pl-11 pr-4 py-4 bg-slate-50  border border-slate-200  rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-medium"
                required
              />
            </div>
          </div>

          <button
            data-animate
            type="submit"
            disabled={isSending}
            className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-accent/25 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Send size={18} />
                Dispatched Link
              </>
            )}
          </button>
        </form>
      </div>

      <div data-animate className="text-center pt-4">
        <p className="text-xs font-bold text-slate-400">
          Need technical assistance? <a href="#" className="text-brand-accent hover:underline">Contact System Admin</a>
        </p>
      </div>
    </div>
  );
}

