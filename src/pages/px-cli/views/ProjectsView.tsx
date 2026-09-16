import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { usePX } from '../context/PXContext';
import { ProjectItem } from '../components/ProjectItem';
import { TaskItem } from '../components/TaskItem';
import { TaskModal } from '../components/Modal';
import { shortId, nowISO } from '../utils';
import type { Task } from '../types';

export function ProjectsView() {
    const { data, saveData, showToast } = usePX();
    const [creating, setCreating] = useState(false);
    const [name, setName] = useState('');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [modal, setModal] = useState<{ task: Task } | null>(null);

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

    async function toggleDone(task: Task) {
        const idx = data.tasks.findIndex((t) => t.id === task.id);
        if (idx === -1) return;
        const n = nowISO();
        const isDone = data.tasks[idx].status === 'done';
        const updated = [...data.tasks];
        updated[idx] = {
            ...updated[idx],
            status: isDone ? 'todo' : 'done',
            completedAt: isDone ? undefined : n,
            updatedAt: n,
        };
        await saveData({ ...data, tasks: updated });
    }

    async function addToToday(task: Task) {
        if (data.todayIds.includes(task.id)) {
            showToast('Already in today');
            return;
        }
        await saveData({ ...data, todayIds: [...data.todayIds, task.id] });
        showToast(`✓ "${task.title}" added to today`);
    }

    return (
        <>
            {/* Header */}
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
                <div style={{ margin: '0 16px 12px', display: 'flex', gap: '8px' }}>
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
                : active.map((p) => {
                    const isExpanded = expanded === p.id;
                    const tasks = data.tasks.filter(
                        (t) => t.projectIds.includes(p.id) && !t.parentId && t.status === 'todo'
                    );
                    return (
                        <div key={p.id}>
                            {/* Project row — left side toggles focus, right chevron expands */}
                            <div style={{ display: 'flex', alignItems: 'stretch' }}>
                                <div style={{ flex: 1 }}>
                                    <ProjectItem
                                        project={p} data={data}
                                        focused={data.focus.includes(p.id)}
                                        onClick={() => toggleFocus(p.id)}
                                    />
                                </div>
                                <button
                                    onClick={() => setExpanded(isExpanded ? null : p.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        borderLeft: '1px solid var(--px-border)',
                                        borderBottom: '1px solid var(--px-border)',
                                        color: 'var(--px-muted)',
                                        cursor: 'pointer',
                                        padding: '0 14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    {isExpanded
                                        ? <ChevronDown size={16} />
                                        : <ChevronRight size={16} />
                                    }
                                </button>
                            </div>

                            {/* Tasks */}
                            {isExpanded && (
                                <div style={{ background: 'var(--px-surface)' }}>
                                    {tasks.length === 0
                                        ? <div style={{
                                            fontSize: '13px', color: 'var(--px-muted)',
                                            padding: '10px 16px 10px 32px',
                                        }}>
                                            No tasks yet.
                                        </div>
                                        : tasks.map((t) => (
                                            <TaskItem
                                                key={t.id} task={t} isToday={false} data={data}
                                                onToggleDone={() => toggleDone(t)}
                                                onOpenModal={() => setModal({ task: t })}
                                                onAddToToday={() => addToToday(t)}
                                            />
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                    );
                })
            }

            {modal && (
                <TaskModal
                    task={modal.task} isToday={false}
                    onClose={() => setModal(null)}
                />
            )}
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