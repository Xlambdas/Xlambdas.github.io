import { useState } from 'react';
import { usePX } from '../context/PXContext';
import { TaskItem } from '../components/TaskItem';
import { TaskModal } from '../components/Modal';
import { nowISO } from '../utils';
import type { Task } from '../types';

export function InboxView() {
    const { data, saveData } = usePX();
    const [modal, setModal] = useState<{ task: Task } | null>(null);

    const inbox = data.tasks.filter(
        (t) => t.projectIds.length === 0 && !t.parentId
    );

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
            <SectionTitle>Inbox</SectionTitle>
            {inbox.length === 0
                ? <Empty>Inbox is empty.</Empty>
                : inbox.map((t) => (
                    <TaskItem
                        key={t.id} task={t} isToday={false} data={data}
                        onToggleDone={() => toggleDone(t)}
                        onOpenModal={() => setModal({ task: t })}
                    />
                ))
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
            padding: '32px 16px', fontSize: '14px',
        }}>
            {children}
        </div>
    );
}