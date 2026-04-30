'use client';

import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3800);
    }, []);

    const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

    const iconMap = {
        success: (
            <svg style={{ width: 18, height: 18, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg style={{ width: 18, height: 18, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        info: (
            <svg style={{ width: 18, height: 18, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    const colorMap = {
        success: { border: '#16a34a', bg: '#f0fdf4', icon: '#16a34a', text: '#14532d' },
        error:   { border: '#dc2626', bg: '#fef2f2', icon: '#dc2626', text: '#7f1d1d' },
        info:    { border: '#2563eb', bg: '#eff6ff', icon: '#2563eb', text: '#1e3a8a' },
    };

    return (
        <ToastContext.Provider value={addToast}>
            {children}

            {/* Toast container */}
            <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                zIndex: 99999,
                maxWidth: '360px',
                width: 'calc(100% - 48px)',
            }}>
                {toasts.map((t) => {
                    const c = colorMap[t.type] || colorMap.info;
                    return (
                        <div
                            key={t.id}
                            onClick={() => dismiss(t.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                background: c.bg,
                                border: `1px solid ${c.border}`,
                                borderLeft: `4px solid ${c.border}`,
                                borderRadius: '12px',
                                padding: '14px 16px',
                                boxShadow: '0 8px 24px rgba(0,0,0,.10)',
                                cursor: 'pointer',
                                animation: 'toastSlideIn .25s cubic-bezier(.22,.61,.36,1)',
                                color: c.text,
                            }}
                        >
                            <span style={{ color: c.icon, marginTop: '1px' }}>{iconMap[t.type]}</span>
                            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.55, fontWeight: 500 }}>
                                {t.message}
                            </p>
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes toastSlideIn {
                    from { opacity: 0; transform: translateX(32px) scale(.95); }
                    to   { opacity: 1; transform: translateX(0) scale(1); }
                }
            `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
