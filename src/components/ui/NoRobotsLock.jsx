import React from 'react';
import { Bot, ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BsRobot } from 'react-icons/bs';
import { SiRobotframework } from 'react-icons/si';

export function NoRobotsLock({ 
  title = "Device Authentication Required", 
  message = "No physical robotic devices are currently paired with your profile. To access live streams, telemetry diagnostics, and AI control models, please pair a device first." 
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center bg-white/80 border border-slate-200/50 shadow-glass rounded-3xl max-w-2xl mx-auto my-12 relative overflow-hidden group">
      {/* Background neon glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-accent/5 rounded-full blur-[80px] group-hover:bg-brand-accent/10 transition-colors duration-500 pointer-events-none"></div>
      
      {/* Icon with glowing ring */}
      <div className="relative mb-8 z-10">
        <div className="absolute inset-0 bg-brand-accent/20 blur-xl rounded-full scale-125 animate-pulse"></div>
        <div className="relative p-6 bg-gradient-to-br from-brand-accent/10 to-brand-secondary/10 text-brand-accent rounded-3xl border border-brand-accent/20 shadow-inner group-hover:scale-105 transition-transform duration-300">
          <SiRobotframework size={48}/>
        </div>
        <div className="absolute -bottom-1 -right-1 p-1.5 bg-rose-500 text-white rounded-lg border-2 border-white shadow-md">
          <ShieldAlert size={14} />
        </div>
      </div>

      {/* Text details */}
      <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-3 z-10">
        {title}
      </h2>
      <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-md mb-8 z-10">
        {message}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center relative z-10">
        <Link
          to="/dashboard/registration"
          className="px-6 py-3.5 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold rounded-2xl shadow-lg shadow-brand-accent/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Pair Robotic Device
          <ArrowRight size={16} />
        </Link>
        <Link
          to="/blog"
          className="px-6 py-3.5 bg-slate-50 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all text-sm"
        >
          View Documentation
        </Link>
      </div>
    </div>
  );
}
