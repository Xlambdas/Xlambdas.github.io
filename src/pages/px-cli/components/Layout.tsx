import { type ReactNode, useRef } from 'react';
import { CheckSquare, Inbox, Star, FolderOpen, RefreshCw, Settings, Plus } from 'lucide-react';
import { usePX } from '../context/PXContext';
import type { TabId } from '../types';
import { PX_STYLE } from '../PXPage';

type NavEntry = { id: TabId | 'sync'; label: string; icon: ReactNode };

const TABS: NavEntry[] = [
    { id: 'today', label: 'Today', icon: <CheckSquare size={20} /> },
    { id: 'inbox', label: 'Inbox', icon: <Inbox size={20} /> },
    { id: 'focus', label: 'Focus', icon: <Star size={20} /> },
    { id: 'projects', label: 'Projects', icon: <FolderOpen size={20} /> },
    { id: 'sync', label: 'Sync', icon: <RefreshCw size={20} /> },
];

export function Layout({
    children,
    onAdd,
}: {
    children: ReactNode;
    onAdd: (title: string) => void;
}) {
    const { tab, setTab, theme, syncLabel, syncing, triggerSync } = usePX();
    const inputRef = useRef<HTMLInputElement>(null);

    const showAddBar = tab !== 'settings';

    function handleAdd() {
        const val = inputRef.current?.value.trim();
        if (!val) return;
        onAdd(val);
        if (inputRef.current) inputRef.current.value = '';
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') handleAdd();
    }

    // function handleTabClick(id: TabId | 'sync') {
    //     if (id === 'sync') {
    //         triggerSync();
    //         return;
    //     }
    //     setTab(id);
    // }

    return (
        <div
            className={`px-${theme}`}
            style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--px-bg)',
                color: 'var(--px-text)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                overflow: 'hidden',
            }}
        >
            <style>{PX_STYLE}</style>

            {/* Header — always on top */}
            <header style={{
                flexShrink: 0,
                background: 'var(--px-bg)',
                borderBottom: '1px solid var(--px-border)',
                paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
                paddingBottom: '12px',
                paddingLeft: '16px',
                paddingRight: '16px',
                zIndex: 10,
        }}>
                {/* Title row */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: showAddBar ? '10px' : '0',
                }}>
                    <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '0.5px' }}>
                        PX
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {syncing && (
                            <span style={{ fontSize: '11px', color: 'var(--px-muted)' }}>
                                syncing…
                            </span>
                        )}
                        {!syncing && (
                            <span style={{ fontSize: '11px', color: 'var(--px-muted)' }}>
                                {syncLabel}
                            </span>
                        )}
                        <button
                            onClick={() => setTab('settings')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: tab === 'settings' ? 'var(--px-accent)' : 'var(--px-muted)',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Settings size={18} />
                        </button>
                    </div>
                </div>

                {/* Add task bar — top, under title */}
                {showAddBar && (
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                    }}>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={tab === 'today' ? 'Add today task…' : 'Add task to inbox…'}
                            autoComplete="off"
                            onKeyDown={handleKeyDown}
                            style={{
                                flex: 1,
                                background: 'var(--px-surface)',
                                border: '1px solid var(--px-border)',
                                borderRadius: '10px',
                                color: 'var(--px-text)',
                                fontSize: '15px',
                                padding: '9px 14px',
                                outline: 'none',
                            }}
                        />
                        <button
                            onClick={handleAdd}
                            style={{
                                width: '38px',
                                height: '38px',
                                background: 'var(--px-accent)',
                                color: 'var(--px-bg)',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                )}
            </header>

            {/* Scrollable content */}
            <main style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
            }}>
                {children}
                {/* bottom padding so content clears the nav bar */}
                <div style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 72px)' }} />
            </main>

            {/* Bottom nav — always on top */}
            <nav style={{
                flexShrink: 0,
                background: 'var(--px-bg)',
                borderTop: '1px solid var(--px-border)',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                display: 'flex',
            }}>
                {TABS.map((t) => {
                    const isActive = t.id === 'sync' ? syncing : tab === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => {
                                if (t.id === 'sync') {
                                    triggerSync();  // never calls setTab
                                } else {
                                    setTab(t.id as TabId);
                                }
                            }}
                            style={{
                                flex: 1,
                                padding: '10px 4px 8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '3px',
                                fontSize: '10px',
                                color: isActive ? 'var(--px-accent)' : 'var(--px-muted)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            {t.id === 'sync'
                                ? <RefreshCw size={20} style={{ animation: syncing ? 'px-spin 1s linear infinite' : 'none' }} />
                                : t.icon
                            }
                            {t.label}
                        </button>
                    );
                })}
            </nav>

        </div>
    );
}