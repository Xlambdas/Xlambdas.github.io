import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { usePX } from '../context/PXContext';
import type { GitHubConfig } from '../types';
import { useGitHub } from '../hooks/useGitHub';

const NOTIF_KEY = 'px-notif-settings';

interface NotifSettings {
    enabled: boolean;
    morningTime: string;
    eveningTime: string;
    deadlineWarning: boolean;
}

function defaultNotifSettings(): NotifSettings {
    return { enabled: false, morningTime: '09:00', eveningTime: '19:00', deadlineWarning: true };
}

export function SettingsView() {
    const { data, cfg, setCfg, theme, toggleTheme, showToast, triggerSync } = usePX();
    const { ghRead } = useGitHub();

    const [token, setToken] = useState(cfg?.token ?? '');
    const [owner, setOwner] = useState(cfg?.owner ?? '');
    const [repo, setRepo] = useState(cfg?.repo ?? '');
    const [branch, setBranch] = useState(cfg?.branch ?? 'main');

    const [notif, setNotif] = useState<NotifSettings>(defaultNotifSettings);
    const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        // Load saved notif settings
        try {
            const saved = localStorage.getItem(NOTIF_KEY);
            if (saved) setNotif({ ...defaultNotifSettings(), ...JSON.parse(saved) });
        } catch { }
        // Check current permission
        if ('Notification' in window) {
            setNotifPermission(Notification.permission);
        }
    }, []);

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

    async function toggleNotif() {
        if (notif.enabled) {
            const updated = { ...notif, enabled: false };
            setNotif(updated);
            localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
            return;
        }
        if (!('Notification' in window)) {
            showToast('Notifications not supported on this browser');
            return;
        }
        const permission = await Notification.requestPermission();
        setNotifPermission(permission);
        if (permission !== 'granted') {
            showToast('Permission denied — enable in phone Settings');
            return;
        }
        const updated = { ...notif, enabled: true };
        setNotif(updated);
        localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
        showToast('✓ Notifications enabled');
    }

    function saveNotifSettings() {
        localStorage.setItem(NOTIF_KEY, JSON.stringify(notif));
        scheduleNotifications(notif, data);
        showToast('✓ Notification settings saved');
    }

    async function testNotif() {
        if (!('Notification' in window)) {
            showToast('❌ Notification API not available');
            return;
        }

        showToast(`Permission: ${Notification.permission}`);
        await new Promise(r => setTimeout(r, 800));

        if (Notification.permission !== 'granted') {
            showToast('❌ Not granted — enable in Settings');
            return;
        }

        const reg = await navigator.serviceWorker.getRegistration('/sandbox/px/');
        if (!reg) {
            showToast('❌ No SW registered — try reopening the app');
            return;
        }

        showToast(`SW: ${reg.active?.state ?? 'no active worker'}`);
        await new Promise(r => setTimeout(r, 800));

        try {
            await reg.showNotification('PX test ✓', {
                body: 'Notifications working',
                tag: 'px-test',
                icon: '/px/icon.svg',
            });
            showToast('✓ Sent');
        } catch (e: any) {
            showToast('❌ ' + e.message);
        }
    }

    function exportData() {
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

            {/* Notifications */}
            <Group label="Notifications">
                {/* Enable toggle */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                }}>
                    <span style={{ fontSize: '14px' }}>Enable notifications</span>
                    <Toggle checked={notif.enabled} onChange={toggleNotif} />
                </div>

                {notif.enabled && (
                    <>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ flex: 1 }}>
                                <FieldLabel>Morning</FieldLabel>
                                <Input
                                    type="time"
                                    placeholder=""
                                    value={notif.morningTime}
                                    onChange={(v) => setNotif((n) => ({ ...n, morningTime: v }))}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <FieldLabel>Evening</FieldLabel>
                                <Input
                                    type="time"
                                    placeholder=""
                                    value={notif.eveningTime}
                                    onChange={(v) => setNotif((n) => ({ ...n, eveningTime: v }))}
                                />
                            </div>
                        </div>

                        <div style={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '16px',
                        }}>
                            <span style={{ fontSize: '14px' }}>Deadline warnings</span>
                            <Toggle
                                checked={notif.deadlineWarning}
                                onChange={() => setNotif((n) => ({ ...n, deadlineWarning: !n.deadlineWarning }))}
                            />
                        </div>

                        <Btn primary onClick={saveNotifSettings}>Save notification settings</Btn>
                        <Btn onClick={testNotif}>Test notification</Btn>
                    </>
                )}

                {notifPermission === 'denied' && (
                    <p style={{ fontSize: '12px', color: 'var(--px-red)', marginTop: '8px', lineHeight: 1.5 }}>
                        Notifications blocked. Enable them in your phone Settings → Notifications.
                    </p>
                )}

                <p style={{ fontSize: '12px', color: 'var(--px-muted)', marginTop: '8px', lineHeight: 1.5 }}>
                    Must be added to home screen on iOS for notifications to work.
                </p>
            </Group>

            {/* Data */}
            <Group label="Data">
                <Btn onClick={exportData}>Export data.json</Btn>
            </Group>

        </div>
    );
}

// ── Notification scheduling ─────────────────────────────────

function scheduleNotifications(settings: NotifSettings, data: any) {
    if (!settings.enabled || Notification.permission !== 'granted') return;

    const focusCount = data.tasks.filter(
        (t: any) => t.projectIds.some((pid: string) => data.focus.includes(pid)) && t.status === 'todo'
    ).length;

    scheduleAt(settings.morningTime, 'PX — Good morning',
        focusCount > 0 ? `You have ${focusCount} focus task${focusCount > 1 ? 's' : ''} today`
            : 'What are you focusing on today?',
        'px-morning'
    );

    scheduleAt(settings.eveningTime, 'PX — End of day',
        "Don't forget to sync your tasks", 'px-evening'
    );

    if (settings.deadlineWarning) {
        const today = new Date().toISOString().slice(0, 10);
        const due = data.tasks.filter((t: any) => t.status === 'todo' && t.deadline === today);
        if (due.length > 0) {
            const names = due.slice(0, 3).map((t: any) => t.title).join(', ');
            scheduleNotif({
                title: `PX — ${due.length} task${due.length > 1 ? 's' : ''} due today`,
                body: names + (due.length > 3 ? ` +${due.length - 3} more` : ''),
                delayMs: 5000,
                tag: 'px-deadline',
            });
        }
    }
}

async function scheduleAt(timeStr: string, title: string, body: string, tag: string) {
    const [h, m] = timeStr.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);
    if (target <= new Date()) target.setDate(target.getDate() + 1);
    scheduleNotif({ title, body, delayMs: target.getTime() - Date.now(), tag });
}

async function scheduleNotif({ title, body, delayMs, tag }: {
    title: string; body: string; delayMs: number; tag: string;
}) {
    if (Notification.permission !== 'granted') return;
    setTimeout(async () => {
        try {
            const reg = await navigator.serviceWorker.getRegistration('/sandbox/px/');
            if (!reg) return;
            await reg.showNotification(title, {
                body,
                tag,
                icon: '/px/icon.svg',
            });
        } catch {
            try { new Notification(title, { body, tag }); } catch { }
        }
    }, delayMs);
}



// ── Sub-components ──────────────────────────────────────────

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

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            fontSize: '11px', color: 'var(--px-muted)',
            marginBottom: '4px', fontWeight: 500,
        }}>
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
                colorScheme: 'dark',
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
                color: primary ? 'var(--px-bg)' : 'var(--px-text)',
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

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <div
            onClick={onChange}
            style={{
                width: '44px', height: '26px',
                borderRadius: '13px',
                background: checked ? 'var(--px-accent)' : 'var(--px-border)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background .2s',
                flexShrink: 0,
            }}
        >
            <div style={{
                position: 'absolute',
                width: '20px', height: '20px',
                borderRadius: '50%',
                background: checked ? 'var(--px-bg)' : '#fff',
                top: '3px',
                left: checked ? '21px' : '3px',
                transition: 'left .2s',
            }} />
        </div>
    );
}