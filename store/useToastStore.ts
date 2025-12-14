import { create } from 'zustand';

export interface Toast {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
}

const activeTimers = new Map<string, number>();

interface ToastStoreState {
    toasts: Toast[];
    addToast: (message: string, type?: Toast['type'], duration?: number) => void;
    removeToast: (id: string) => void;
    clearAllToasts: () => void;
}

export const useToastStore = create<ToastStoreState>((set, get) => ({
    toasts: [],
    addToast: (message, type = 'info', duration = 3000) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        set((state) => ({ toasts: [...state.toasts, { id, message, type, duration }] }));
        if (duration > 0) {
            const timerId = window.setTimeout(() => {
                const currentToasts = get().toasts;
                if (currentToasts.some(t => t.id === id)) {
                    set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
                }
                activeTimers.delete(id);
            }, duration);
            activeTimers.set(id, timerId);
        }
    },
    removeToast: (id) => {
        const timerId = activeTimers.get(id);
        if (timerId) {
            window.clearTimeout(timerId);
            activeTimers.delete(id);
        }
        set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    },
    clearAllToasts: () => {
        activeTimers.forEach((timerId) => window.clearTimeout(timerId));
        activeTimers.clear();
        set({ toasts: [] });
    }
}));

export const showToast = (message: string, type: Toast['type'] = 'info', duration = 3000) => {
    useToastStore.getState().addToast(message, type, duration);
};
