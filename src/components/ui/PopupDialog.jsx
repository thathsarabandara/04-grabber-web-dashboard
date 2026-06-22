import React from 'react';
import { HelpCircle, AlertCircle, CheckCircle, X } from 'lucide-react';

export function PopupDialog({ 
  isOpen, 
  title, 
  message, 
  type = 'info', // 'info', 'success', 'warning', 'confirm'
  onConfirm, 
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel'
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-emerald-500" />;
      case 'warning':
        return <AlertCircle className="w-8 h-8 text-amber-500" />;
      case 'confirm':
        return <HelpCircle className="w-8 h-8 text-blue-500" />;
      default:
        return <AlertCircle className="w-8 h-8 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={type === 'confirm' ? onCancel : onConfirm}
      />
      
      {/* Dialog box */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all duration-300 border border-slate-100 scale-100 flex flex-col gap-4">
        
        {/* Close Button */}
        <button 
          onClick={type === 'confirm' ? onCancel : onConfirm}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 p-2 bg-slate-50 rounded-xl">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-slate-800 tracking-tight leading-6">
              {title}
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-2 whitespace-pre-wrap leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          {type === 'confirm' && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 hover:text-slate-800 transition-all active:scale-95"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-bold text-white rounded-xl shadow-lg transition-all active:scale-95 ${
              type === 'warning' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/10' :
              type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10' :
              'bg-blue-500 hover:bg-blue-600 shadow-blue-500/10'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
