import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { usePX } from '../context/PXContext';
import type { GitHubConfig } from '../types';
import { useGitHub } from '../hooks/useGitHub';

export function SettingsView() {
    const { cfg, setCfg, theme, toggleTheme, showToast, triggerSync } = usePX();
    const { ghRead } = useGitHub();

    const [token, setToken] = useState(cfg?.token ?? '');
    const [owner, setOwner] = useState(cfg?.owner ?? '');
    const [repo, setRepo] = useState(cfg?.repo ?? '');
    const [branch, setBranch] = useState(cfg?.branch ?? 'main');

    async function saveSettings() {
        if (!token || !owner || !repo) { showToast('Token, owner and repo are required'); return; }
        const newCfg: GitHubConfig = { token, owner, repo, branch: branch || 'main', path: 'data.json' };
        setCfg(newCfg);
        showToast('✓ Saved — testing connection…');
        try {
            const result = await ghRead(newCfg);
            showToast(result !== null ? '✓ Connected!' : '✓ Connected (repo empty)');
        } catch (e: any) {
            showToast('✗ ' + e.message);
        }
    }

    function exportData() {
        const { data } = usePX();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `px-data-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('✓ Exported');
    }

    return (
        <div style={{ padding: '16px' }}>

            {/* Theme */}
            <Group label="Appearance">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span style={{ fontSize: '14px' }}>Theme</span>
                    <button
                        onClick={toggleTheme}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: 'var(--px-surface)',
                            border: '1px solid var(--px-border)',
                            borderRadius: '8px',
                            color: 'var(--px-text)',
                            padding: '6px 12px',
                            fontSize: '13px',
                            cursor: 'pointer',
                        }}
                    >
                        {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                        {theme === 'dark' ? 'Dark' : 'Light'}
                    </button>
                </div>
            </Group>

            {/* GitHub */}
            <Group label="GitHub Sync">
                <Input type="password" placeholder="Personal Access Token" value={token} onChange={setToken} />
                <Input placeholder="GitHub username" value={owner} onChange={setOwner} />
                <Input placeholder="Data repo (e.g. px-data)" value={repo} onChange={setRepo} />
                <Input placeholder="Branch (default: main)" value={branch} onChange={setBranch} />
                <Btn primary onClick={saveSettings}>Save & test connection</Btn>
                <Btn onClick={triggerSync}>Sync now</Btn>
                <p style={{ fontSize: '12px', color: 'var(--px-muted)', lineHeight: 1.6, marginTop: '8px' }}>
                    Create a token at github.com/settings/tokens<br />
                    Required scope: <strong>repo</strong><br />
                    Stored only on this device.
                </p>
            </Group>

            {/* Data */}
            <Group label="Data">
                <Btn onClick={exportData}>Export data.json</Btn>
            </Group>

        </div>
    );
}

// ── Sub-components ─────────────────────────────────────────

function Group({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '28px' }}>
            <div style={{
                fontSize: '11px', fontWeight: 600, color: 'var(--px-muted)',
                textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: '12px',
            }}>
                {label}
            </div>
            {children}
        </div>
    );
}

function Input({ type = 'text', placeholder, value, onChange }: {
    type?: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                width: '100%',
                background: 'var(--px-surface)',
                border: '1px solid var(--px-border)',
                borderRadius: '10px',
                color: 'var(--px-text)',
                fontSize: '14px',
                padding: '10px 14px',
                outline: 'none',
                marginBottom: '8px',
                display: 'block',
            }}
        />
    );
}

function Btn({ children, onClick, primary }: {
    children: React.ReactNode;
    onClick: () => void;
    primary?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                width: '100%',
                background: primary ? 'var(--px-accent)' : 'var(--px-surface)',
                color: primary ? '#fff' : 'var(--px-text)',
                border: primary ? 'none' : '1px solid var(--px-border)',
                borderRadius: '10px',
                padding: '11px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '8px',
            }}
        >
            {children}
        </button>
    );
}