import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const elements = formRef.current?.querySelectorAll('input, button, a, label, h2, p');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email';
    if (formData.password.length < 6) newErrors.password = 'Too short';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mismatched';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Accept terms';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        setSubmitted(true);
        setTimeout(() => {
          navigate('/auth/otp');
        }, 1500);
      }, 1000);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10 space-y-6">
        <div className="w-20 h-20 bg-brand-success/10 text-brand-success rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-brand-success/20 animate-bounce-slow">
          <CheckCircle2 size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Operator Registered</h2>
          <p className="text-slate-500  mt-2 font-medium">Redirecting to security verification...</p>
        </div>
        <div className="flex justify-center">
          <Loader2 className="animate-spin text-brand-accent" size={24} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl font-black tracking-tight text-slate-800 ">
          Create Account
        </h2>
        <p className="text-slate-500  mt-1 font-medium">
          Join the Grabber-X operator network
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-accent transition-colors">
                <User size={16} />
              </div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`block w-full pl-10 pr-4 py-3.5 bg-slate-50  border rounded-2xl outline-none transition-all font-medium text-sm ${
                  errors.firstName ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200  focus:ring-brand-accent/10 focus:border-brand-accent'
                }`}
                placeholder="John"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-accent transition-colors">
                <User size={16} />
              </div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`block w-full pl-10 pr-4 py-3.5 bg-slate-50  border rounded-2xl outline-none transition-all font-medium text-sm ${
                  errors.lastName ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200  focus:ring-brand-accent/10 focus:border-brand-accent'
                }`}
                placeholder="Doe"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-accent transition-colors">
              <Mail size={18} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50  border rounded-2xl outline-none transition-all font-medium text-sm ${
                errors.email ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200  focus:ring-brand-accent/10 focus:border-brand-accent'
              }`}
              placeholder="operator@grabber.local"
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-accent transition-colors">
              <Phone size={18} />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full pl-11 pr-4 py-3.5 bg-slate-50  border border-slate-200  rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all font-medium text-sm"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-accent transition-colors">
                <Lock size={16} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-10 pr-4 py-3.5 bg-slate-50  border rounded-2xl outline-none transition-all font-medium text-sm ${
                  errors.password ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200  focus:ring-brand-accent/10 focus:border-brand-accent'
                }`}
                placeholder="••••••"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-accent transition-colors">
                <Lock size={16} />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full pl-10 pr-4 py-3.5 bg-slate-50  border rounded-2xl outline-none transition-all font-medium text-sm ${
                  errors.confirmPassword ? 'border-red-400 focus:ring-red-400/10' : 'border-slate-200  focus:ring-brand-accent/10 focus:border-brand-accent'
                }`}
                placeholder="••••••"
              />
            </div>
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-center gap-3 cursor-pointer group ml-1">
          <div className="relative">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="peer h-5 w-5 opacity-0 absolute cursor-pointer"
            />
            <div className={`h-5 w-5 border-2 rounded-lg transition-all peer-checked:bg-brand-accent peer-checked:border-brand-accent ${errors.agreeTerms ? 'border-red-400' : 'border-slate-200'}`}>
              <div className="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform">
                <CheckCircle2 size={12} />
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500 ">
            Accept <a href="#" className="text-brand-accent hover:underline">Terms of Service</a>
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-brand-accent/25 flex items-center justify-center gap-2 group transition-all disabled:opacity-70 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Register Account
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100 "></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
          <span className="bg-white  px-4 text-slate-400">Already a Member?</span>
        </div>
      </div>

      <Link
        to="/auth/login"
        className="block w-full text-center py-4 px-4 rounded-2xl border-2 border-slate-100  font-bold text-slate-600  hover:bg-slate-50  transition-all active:scale-[0.98]"
      >
        Sign In Instead
      </Link>
    </div>
  );
}

