import { useState } from 'react';
import { usePX } from '../context/PXContext';
import { ProjectItem } from '../components/ProjectItem';
import { TaskItem } from '../components/TaskItem';
import { TaskModal } from '../components/Modal';
import { nowISO } from '../utils';
import type { Task } from '../types';

export function FocusView() {
    const { data, saveData } = usePX();
    const [modal, setModal] = useState<{ task: Task } | null>(null);

    const focused = data.projects.filter((p) => data.focus.includes(p.id));

    async function toggleFocus(pid: string) {
        const focus = data.focus.includes(pid)
            ? data.focus.filter((f) => f !== pid)
            : [...data.focus, pid];
        await saveData({ ...data, focus });
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

    return (
        <>
            <SectionTitle>Focused projects</SectionTitle>
            {focused.length === 0
                ? <Empty>No focused projects.<br />Tap a project to focus it.</Empty>
                : focused.map((p) => {
                    const tasks = data.tasks.filter(
                        (t) => t.projectIds.includes(p.id) && !t.parentId && t.status === 'todo'
                    );
                    return (
                        <div key={p.id}>
                            <ProjectItem
                                project={p} data={data} focused
                                onClick={() => toggleFocus(p.id)}
                            />
                            {tasks.map((t) => (
                                <TaskItem
                                    key={t.id} task={t} isToday={false} data={data}
                                    onToggleDone={() => toggleDone(t)}
                                    onOpenModal={() => setModal({ task: t })}
                                />
                            ))}
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

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            fontSize: '11px', fontWeight: 600, color: 'var(--px-muted)',
            textTransform: 'uppercase', letterSpacing: '.8px',
            padding: '16px 16px 6px',
        }}>
            {children}
        </div>
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