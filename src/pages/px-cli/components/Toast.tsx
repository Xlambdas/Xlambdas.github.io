import { usePX } from '../context/PXContext';

export function Toast() {
    const { toast } = usePX();
    return (
        <div style={{
            position: 'fixed',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--px-surface)',
            border: '1px solid var(--px-border)',
            color: 'var(--px-text)',
            padding: '8px 18px',
            borderRadius: '20px',
            fontSize: '13px',
            zIndex: 200,
            opacity: toast ? 1 : 0,
            transition: 'opacity .2s',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
        }}>
            {toast}
        </div>
    );
}