import { useState } from 'react';
import { usePX } from '../context/PXContext';
import { TaskItem } from '../components/TaskItem';
import { TaskModal } from '../components/Modal';
import { nowISO } from '../utils';
import type { Task } from '../types';

export function TodayView() {
    const { data, saveData } = usePX();
    const [modal, setModal] = useState<{ task: Task } | null>(null);

    // Resolve today tasks by ID from the single tasks array
    const todayTasks = data.todayIds
        .map((id) => data.tasks.find((t) => t.id === id))
        .filter((t): t is Task => t !== undefined);

    const focusTasks = data.tasks.filter(
        (t) =>
            t.projectIds.some((pid) => data.focus.includes(pid)) &&
            t.status === 'todo' &&
            !t.parentId &&
            !data.todayIds.includes(t.id) // avoid duplicate if already in today
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

    async function removeFromToday(task: Task) {
        await saveData({
            ...data,
            todayIds: data.todayIds.filter((id) => id !== task.id),
        });
    }

    return (
        <>
            <SectionTitle>Today</SectionTitle>
            {todayTasks.length === 0
                ? <Empty>No tasks for today. Add one above or use + on a project task.</Empty>
                : todayTasks.map((t) => (
                    <TaskItem
                        key={t.id}
                        task={t}
                        isToday
                        data={data}
                        onToggleDone={() => toggleDone(t)}
                        onOpenModal={() => setModal({ task: t, isToday: true } as any)}
                        onRemoveFromToday={() => removeFromToday(t)}
                    />
                ))
            }

            <SectionTitle>Focus</SectionTitle>
            {focusTasks.length === 0
                ? <Empty>No focus tasks.</Empty>
                : focusTasks.map((t) => (
                    <TaskItem
                        key={t.id}
                        task={t}
                        isToday={false}
                        data={data}
                        onToggleDone={() => toggleDone(t)}
                        onOpenModal={() => setModal({ task: t, isToday: false } as any)}
                        onAddToToday={() => addToToday(t)}
                    />
                ))
            }

            {modal && (
                <TaskModal
                    task={(modal as any).task}
                    isToday={(modal as any).isToday}
                    onClose={() => setModal(null)}
                />
            )}
        </>
    );

    async function addToToday(task: Task) {
        if (data.todayIds.includes(task.id)) return;
        await saveData({ ...data, todayIds: [...data.todayIds, task.id] });
    }
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