import { useEffect, useState } from 'react';
import { usePX } from '../context/PXContext';
import { nowISO } from '../utils';
import type { Task } from '../types';

interface Props {
    task: Task;
    isToday: boolean;
    onClose: () => void;
}

type LinkTab = 'project' | 'task';

export function LinkModal({ task, onClose }: Props) {
    const { data, saveData, showToast } = usePX();
    const [linkTab, setLinkTab] = useState<LinkTab>('project');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        return () => {
            document.body.style.overflow = prev;
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, []);

    const activeProjects = data.projects.filter((p) => p.status === 'active');
    const availableTasks = data.tasks.filter(
        (t) => t.id !== task.id && !t.parentId && t.status === 'todo'
    );

    const filteredProjects = activeProjects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );
    const filteredTasks = availableTasks.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
    );

    async function linkToProject(pid: string) {
        const idx = data.tasks.findIndex((t) => t.id === task.id);
        if (idx === -1) return;

        const already = data.tasks[idx].projectIds.includes(pid);
        const updated = [...data.tasks];
        updated[idx] = {
            ...updated[idx],
            projectIds: already
                ? updated[idx].projectIds.filter((id) => id !== pid)
                : [...updated[idx].projectIds, pid],
            updatedAt: nowISO(),
        };

        await saveData({ ...data, tasks: updated });

        const proj = data.projects.find((p) => p.id === pid);
        showToast(already ? `Unlinked from ${proj?.title}` : `✓ Linked to ${proj?.title}`);
        onClose();
    }

    async function linkToTask(parentId: string) {
        const idx = data.tasks.findIndex((t) => t.id === task.id);
        if (idx === -1) return;

        const updated = [...data.tasks];
        updated[idx] = { ...updated[idx], parentId, updatedAt: nowISO() };

        // Add to parent's subtaskIds
        const parentIdx = updated.findIndex((t) => t.id === parentId);
        if (parentIdx !== -1 && !updated[parentIdx].subtaskIds.includes(task.id)) {
            updated[parentIdx] = {
                ...updated[parentIdx],
                subtaskIds: [...updated[parentIdx].subtaskIds, task.id],
                updatedAt: nowISO(),
            };
        }

        await saveData({ ...data, tasks: updated });
        const parent = data.tasks.find((t) => t.id === parentId);
        showToast(`✓ Linked as subtask of "${parent?.title}"`);
        onClose();
    }

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && onClose()}
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,.7)',
                zIndex: 110,
                display: 'flex',
                alignItems: 'flex-end',
            }}
        >
            <div style={{
                background: 'var(--px-surface)',
                borderRadius: '20px 20px 0 0',
                width: '100%',
                maxHeight: '75dvh',
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}>

                {/* Handle */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
                    <div style={{ width: '36px', height: '4px', background: 'var(--px-border)', borderRadius: '2px' }} />
                </div>

                <div style={{ padding: '0 16px 12px', fontSize: '16px', fontWeight: 600 }}>
                    Link "{task.title.length > 30 ? task.title.slice(0, 30) + '…' : task.title}"
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid var(--px-border)',
                    marginBottom: '8px',
                }}>
                    {(['project', 'task'] as LinkTab[]).map((lt) => (
                        <button
                            key={lt}
                            onClick={() => { setLinkTab(lt); setSearch(''); }}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: 'none',
                                border: 'none',
                                borderBottom: linkTab === lt ? '2px solid var(--px-accent)' : '2px solid transparent',
                                color: linkTab === lt ? 'var(--px-accent)' : 'var(--px-muted)',
                                fontSize: '14px',
                                fontWeight: linkTab === lt ? 600 : 400,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                            }}
                        >
                            {lt === 'project' ? 'To a project' : 'As a subtask'}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div style={{ padding: '0 16px 8px' }}>
                    <input
                        autoFocus
                        placeholder={linkTab === 'project' ? 'Search projects…' : 'Search tasks…'}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'var(--px-bg)',
                            border: '1px solid var(--px-border)',
                            borderRadius: '10px',
                            color: 'var(--px-text)',
                            fontSize: '14px',
                            padding: '9px 14px',
                            outline: 'none',
                        }}
                    />
                </div>

                {/* List */}
                <div style={{ overflowY: 'auto', flex: 1 }}>
                    {linkTab === 'project' && (
                        filteredProjects.length === 0
                            ? <Empty>No projects found.</Empty>
                            : filteredProjects.map((p) => {
                                const linked = task.projectIds.includes(p.id);
                                return (
                                    <div
                                        key={p.id}
                                        onClick={() => linkToProject(p.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '12px 16px',
                                            borderBottom: '1px solid var(--px-border)',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <span style={{ fontSize: '15px' }}>{p.title}</span>
                                        {linked && (
                                            <span style={{ fontSize: '12px', color: 'var(--px-accent)' }}>✓ linked</span>
                                        )}
                                    </div>
                                );
                            })
                    )}

                    {linkTab === 'task' && (
                        filteredTasks.length === 0
                            ? <Empty>No tasks found.</Empty>
                            : filteredTasks.map((t) => {
                                const proj = t.projectIds.length
                                    ? data.projects.find((p) => p.id === t.projectIds[0])?.title
                                    : null;
                                return (
                                    <div
                                        key={t.id}
                                        onClick={() => linkToTask(t.id)}
                                        style={{
                                            padding: '12px 16px',
                                            borderBottom: '1px solid var(--px-border)',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div style={{ fontSize: '15px' }}>{t.title}</div>
                                        {proj && (
                                            <div style={{ fontSize: '12px', color: 'var(--px-muted)', marginTop: '2px' }}>
                                                {proj}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                    )}
                </div>

                {/* Cancel */}
                <div style={{ padding: '12px 16px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            background: 'var(--px-bg)',
                            color: 'var(--px-muted)',
                            border: '1px solid var(--px-border)',
                            borderRadius: '10px',
                            padding: '11px',
                            fontSize: '15px',
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
}

function Empty({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ textAlign: 'center', color: 'var(--px-muted)', padding: '24px 16px', fontSize: '14px' }}>
            {children}
        </div>
    );
}