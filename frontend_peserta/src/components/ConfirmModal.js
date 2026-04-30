'use client';

export default function ConfirmModal({
    open = false,
    message = 'Apakah Anda yakin?',
    confirmLabel = 'Hapus',
    confirmColor = '#dc2626',
    onConfirm,
    onCancel,
}) {
    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onCancel}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(15,23,42,.5)',
                    backdropFilter: 'blur(3px)',
                    zIndex: 9000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'modalFadeIn .18s ease',
                }}
            >
                {/* Modal box */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: '#fff',
                        borderRadius: '20px',
                        boxShadow: '0 24px 64px rgba(0,0,0,.20)',
                        padding: '32px',
                        maxWidth: '420px',
                        width: '90%',
                        animation: 'modalSlideUp .22s cubic-bezier(.22,.61,.36,1)',
                    }}
                >
                    {/* Warning icon */}
                    <div style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        background: '#fff7ed',
                        border: '1.5px solid #fed7aa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '18px',
                    }}>
                        <svg style={{ width: 26, height: 26, color: '#ea580c' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                        Konfirmasi Tindakan
                    </h3>
                    <p style={{ margin: '0 0 28px', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
                        {message}
                    </p>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={onCancel}
                            style={{
                                padding: '10px 22px',
                                borderRadius: '10px',
                                background: '#f1f5f9',
                                color: '#475569',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: '13.5px',
                                cursor: 'pointer',
                                transition: 'background .15s',
                            }}
                            onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
                            onMouseOut={(e) => e.target.style.background = '#f1f5f9'}
                        >
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            style={{
                                padding: '10px 22px',
                                borderRadius: '10px',
                                background: confirmColor,
                                color: '#fff',
                                border: 'none',
                                fontWeight: 600,
                                fontSize: '13.5px',
                                cursor: 'pointer',
                                opacity: 1,
                                transition: 'opacity .15s',
                            }}
                            onMouseOver={(e) => e.target.style.opacity = '0.85'}
                            onMouseOut={(e) => e.target.style.opacity = '1'}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes modalFadeIn  { from { opacity: 0; } to { opacity: 1; } }
                @keyframes modalSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </>
    );
}
