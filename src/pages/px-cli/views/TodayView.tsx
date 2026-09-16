import { useState } from 'react';
import { usePX } from '../context/PXContext';
import { TaskItem } from '../components/TaskItem';
import { TaskModal } from '../components/Modal';
import { nowISO } from '../utils';
import type { Task } from '../types';

export function TodayView() {
    const { data, saveData } = usePX();
    const [modal, setModal] = useState<{ task: Task; isToday: boolean } | null>(null);

    const focusTasks = data.tasks.filter(
        (t) => t.projectIds.some((pid) => data.focus.includes(pid)) &&
            t.status === 'todo' && !t.parentId
    );

    async function toggleDone(task: Task, isToday: boolean) {
        const arr = isToday ? data.todayTasks : data.tasks;
        const idx = arr.findIndex((t) => t.id === task.id);
        if (idx === -1) return;
        const n = nowISO();
        const isDone = arr[idx].status === 'done';
        const updated = [...arr];
        updated[idx] = {
            ...updated[idx],
            status: isDone ? 'todo' : 'done',
            completedAt: isDone ? undefined : n,
            updatedAt: n,
        };
        await saveData(isToday
            ? { ...data, todayTasks: updated }
            : { ...data, tasks: updated });
    }

    return (
        <>
            <SectionTitle>Today</SectionTitle>
            {data.todayTasks.length === 0
                ? <Empty>No tasks for today. Add one above.</Empty>
                : data.todayTasks.map((t) => (
                    <TaskItem
                        key={t.id} task={t} isToday data={data}
                        onToggleDone={() => toggleDone(t, true)}
                        onOpenModal={() => setModal({ task: t, isToday: true })}
                    />
                ))
            }

            <SectionTitle>Focus</SectionTitle>
            {focusTasks.length === 0
                ? <Empty>No focus tasks.</Empty>
                : focusTasks.map((t) => (
                    <TaskItem
                        key={t.id} task={t} isToday={false} data={data}
                        onToggleDone={() => toggleDone(t, false)}
                        onOpenModal={() => setModal({ task: t, isToday: false })}
                    />
                ))
            }

            {modal && (
                <TaskModal
                    task={modal.task} isToday={modal.isToday}
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