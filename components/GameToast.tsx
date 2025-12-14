import React from 'react';
import { useToastStore, Toast } from '../store/useToastStore';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const ToastIcon = ({ type }: { type: Toast['type'] }) => {
    switch (type) {
        case 'success': return <CheckCircle size={20} className="text-green-400" />;
        case 'warning': return <AlertTriangle size={20} className="text-yellow-400" />;
        case 'error': return <XCircle size={20} className="text-red-400" />;
        default: return <Info size={20} className="text-blue-400" />;
    }
};

const toastStyles: Record<Toast['type'], string> = {
    info: 'bg-slate-800 border-blue-500',
    success: 'bg-slate-800 border-green-500',
    warning: 'bg-slate-800 border-yellow-500',
    error: 'bg-slate-800 border-red-500',
};

export const GameToast: React.FC = () => {
    const toasts = useToastStore((state) => state.toasts);
    const removeToast = useToastStore((state) => state.removeToast);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        ${toastStyles[toast.type]}
                        border-l-4 rounded-lg shadow-2xl p-4 flex items-center gap-3
                        animate-slide-down pointer-events-auto
                        backdrop-blur-sm
                    `}
                >
                    <ToastIcon type={toast.type} />
                    <p className="flex-1 text-white font-medium text-sm">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};
