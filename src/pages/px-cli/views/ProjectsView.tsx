import { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePX } from '../context/PXContext';
import { ProjectItem } from '../components/ProjectItem';
import { shortId, nowISO } from '../utils';

export function ProjectsView() {
    const { data, saveData, showToast } = usePX();
    const [creating, setCreating] = useState(false);
    const [name, setName] = useState('');

    const active = data.projects.filter((p) => p.status === 'active');

    async function toggleFocus(pid: string) {
        const focus = data.focus.includes(pid)
            ? data.focus.filter((f) => f !== pid)
            : [...data.focus, pid];
        await saveData({ ...data, focus });
    }

    async function createProject() {
        if (!name.trim()) return;
        const n = nowISO();
        const project = {
            id: shortId(), displayId: '',
            title: name.trim(),
            status: 'active' as const,
            createdAt: n, updatedAt: n,
        };
        await saveData({ ...data, projects: [...data.projects, project] });
        showToast(`✓ "${project.title}" created`);
        setName('');
        setCreating(false);
    }

    return (
        <>
            {/* Section header with create button */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 16px 6px',
            }}>
                <span style={{
                    fontSize: '11px', fontWeight: 600, color: 'var(--px-muted)',
                    textTransform: 'uppercase', letterSpacing: '.8px',
                }}>
                    Projects
                </span>
                <button
                    onClick={() => setCreating((v) => !v)}
                    style={{
                        background: 'none', border: 'none',
                        color: creating ? 'var(--px-accent)' : 'var(--px-muted)',
                        cursor: 'pointer', padding: '4px',
                        display: 'flex', alignItems: 'center',
                    }}
                >
                    <Plus size={16} />
                </button>
            </div>

            {/* Create form */}
            {creating && (
                <div style={{
                    margin: '0 16px 12px',
                    display: 'flex', gap: '8px',
                }}>
                    <input
                        autoFocus
                        placeholder="Project name…"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && createProject()}
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
                        onClick={createProject}
                        style={{
                            width: '38px', height: '38px',
                            background: 'var(--px-accent)',
                            color: 'var(--px-bg)',
                            border: 'none', borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <Plus size={18} />
                    </button>
                </div>
            )}

            {active.length === 0
                ? <Empty>No projects yet.<br />Tap + to create one.</Empty>
                : active.map((p) => (
                    <ProjectItem
                        key={p.id} project={p} data={data}
                        focused={data.focus.includes(p.id)}
                        onClick={() => toggleFocus(p.id)}
                    />
                ))
            }
        </>
    );
}

function Empty({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            textAlign: 'center', color: 'var(--px-muted)',
            padding: '32px 16px', fontSize: '14px', lineHeight: 1.6,
        }}>
            {children}
        </div>
    );
}