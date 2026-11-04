import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[90vw] animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-[#191F28] text-white rounded-xl shadow-xl text-xs font-medium border border-gray-700/50">
        {toast.type === 'success' && (
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
        )}
        {toast.type === 'error' && (
          <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
        )}
        {toast.type === 'info' && (
          <Info className="w-4 h-4 text-[#3B82F6] shrink-0" />
        )}
        <span className="leading-snug">{toast.text}</span>
      </div>
    </div>
  );
};
