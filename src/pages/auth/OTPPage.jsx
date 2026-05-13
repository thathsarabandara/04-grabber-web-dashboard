import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  ArrowLeft,
  Loader2
} from 'lucide-react';

export function OTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verified, setVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      inputsRef.current,
      { opacity: 0, y: 10, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
    );
  }, []);

  useEffect(() => {
    if (resendTimer > 0 && !canResend) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, canResend]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setIsVerifying(true);
      setTimeout(() => {
        setVerified(true);
        setTimeout(() => navigate('/auth/login'), 2000);
      }, 1500);
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setResendTimer(30);
    setCanResend(false);
    inputsRef.current[0]?.focus();
  };

  if (verified) {
    return (
      <div className="text-center py-10 space-y-6">
        <div className="w-20 h-20 bg-brand-success/10 text-brand-success rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-brand-success/20 animate-bounce-slow">
          <CheckCircle2 size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Access Granted</h2>
          <p className="text-slate-500  mt-2 font-medium">Security sequence synchronized.</p>
        </div>
        <div className="flex justify-center">
          <Loader2 className="animate-spin text-brand-accent" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-brand-accent/10 text-brand-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-black tracking-tight">Security Check</h2>
        <p className="text-slate-500  mt-2 font-medium">
          A 6-digit verification code has been sent to your registered operator email
        </p>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-full aspect-square text-center text-2xl font-black bg-slate-50  border-2 border-slate-100  rounded-2xl focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 outline-none transition-all"
              inputMode="numeric"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={otp.join('').length < 6 || isVerifying}
          className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-accent/25 flex items-center justify-center gap-2 group transition-all disabled:opacity-50 active:scale-[0.98]"
        >
          {isVerifying ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            'Verify Credentials'
          )}
        </button>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Code expires in:</span>
            <span className={`font-mono ${resendTimer < 10 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
              00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
            </span>

          </div>

          <button
            onClick={handleResend}
            disabled={!canResend}
            className={`flex items-center gap-2 text-sm font-bold transition-all ${
              canResend
                ? 'text-brand-accent hover:underline'
                : 'text-slate-400 cursor-not-allowed'
            }`}
          >
            <RotateCcw size={16} className={!canResend ? 'opacity-50' : ''} />
            Resend Sequence
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 ">
        <Link
          to="/auth/login"
          className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-brand-accent transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Identification
        </Link>
      </div>
    </div>
  );
}

