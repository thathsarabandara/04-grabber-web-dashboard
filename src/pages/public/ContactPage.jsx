import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Loader2, 
  CheckCircle2,
  Headphones,
  Globe,
  Terminal,
  MessageSquare
} from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const elements = contentRef.current?.querySelectorAll('[data-animate]');
    if (elements) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div ref={contentRef} className="space-y-16 pb-20">
      {/* Header */}
      <div data-animate className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100  border border-slate-200  mb-4">
          <Headphones size={14} className="text-brand-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">24/7 Operator Support</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight">Technical Liaison</h1>
        <p className="text-xl text-slate-500  max-w-2xl mx-auto font-medium">
          Establish a direct uplink with our engineering core.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div data-animate className="glass-card p-8 space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Terminal size={14} /> Global Registry
            </h3>
            
            {[
              {
                icon: Mail,
                title: 'Digital Uplink',
                content: 'ops@grabber-robotics.io',
                sub: 'Response time: < 2h'
              },
              {
                icon: Phone,
                title: 'Emergency Line',
                content: '+1 (888) GRAB-LOG',
                sub: 'For critical failures only'
              },
              {
                icon: MapPin,
                title: 'Primary Node',
                content: 'Sector 7, Innovation Way',
                sub: 'Silicon Valley, CA'
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-5 group">
                <div className="p-3 bg-slate-50  text-slate-400 group-hover:text-brand-accent group-hover:bg-brand-accent/10 rounded-xl transition-all duration-300">
                  <item.icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800  uppercase tracking-tight">{item.title}</h4>
                  <p className="text-slate-500  text-sm font-medium">{item.content}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div data-animate className="glass-card p-8 bg-slate-900 text-white border-none space-y-6">
            <div className="flex items-center gap-3">
              <Globe className="text-brand-accent" size={24} />
              <h3 className="text-lg font-black tracking-tight">Active Nodes</h3>
            </div>
            <div className="space-y-4">
              {['San Francisco', 'Berlin', 'Tokyo', 'Singapore'].map((city) => (
                <div key={city} className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {city} <span className="w-1.5 h-1.5 bg-brand-success rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card p-10 space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="text-brand-accent" size={24} />
              <h2 className="text-2xl font-black tracking-tight">Initiate Transmission</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div data-animate className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Operator Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="w-full px-5 py-4 bg-slate-50  border border-slate-200  rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-medium"
                  required
                />
              </div>

              <div data-animate className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Return Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@domain.com"
                  className="w-full px-5 py-4 bg-slate-50  border border-slate-200  rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div data-animate className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject Header</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Topic of inquiry"
                className="w-full px-5 py-4 bg-slate-50  border border-slate-200  rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-medium"
                required
              />
            </div>

            <div data-animate className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Payload Content</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter detailed message..."
                rows="6"
                className="w-full px-5 py-4 bg-slate-50  border border-slate-200  rounded-2xl outline-none focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent transition-all text-sm font-medium resize-none"
                required
              ></textarea>
            </div>

            <div data-animate className="pt-4">
              <button
                type="submit"
                disabled={isSending || isSuccess}
                className="w-full bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-50 text-white font-bold py-5 rounded-2xl shadow-xl shadow-brand-accent/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {isSending ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Transmitting...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 size={20} />
                    Link Established
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Uplink
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

