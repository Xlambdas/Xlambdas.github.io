import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { usePX } from '../context/PXContext';
import { TaskItem } from '../components/TaskItem';
import { TaskModal } from '../components/Modal';
import { nowISO } from '../utils';
import type { Task } from '../types';

export function TodayView() {
  const { data, saveData, showToast } = usePX();
  const [modal, setModal] = useState<{ task: Task; isToday: boolean } | null>(null);

  const todayTasks = data.todayIds
    .map((id) => data.tasks.find((t) => t.id === id))
    .filter((t): t is Task => t !== undefined);

  const focusTasks = data.tasks.filter(
    (t) =>
      t.projectIds.some((pid) => data.focus.includes(pid)) &&
      t.status === 'todo' &&
      !t.parentId &&
      !data.todayIds.includes(t.id)
  );

  const doneCount = todayTasks.filter((t) => t.status === 'done').length;

  async function toggleDone(task: Task) {
    const idx = data.tasks.findIndex((t) => t.id === task.id);
    if (idx === -1) return;
    const n      = nowISO();
    const isDone = data.tasks[idx].status === 'done';
    const updated = [...data.tasks];
    updated[idx] = {
      ...updated[idx],
      status:      isDone ? 'todo' : 'done',
      completedAt: isDone ? undefined : n,
      updatedAt:   n,
    };
    await saveData({ ...data, tasks: updated });
  }

  // Fully delete task — tombstone it everywhere
  async function deleteTask(task: Task) {
    const deletedIds = [...(data.deletedIds ?? []), task.id];
    const tasks      = data.tasks.filter((t) => t.id !== task.id);
    const todayIds   = data.todayIds.filter((id) => id !== task.id);
    await saveData({ ...data, tasks, todayIds, deletedIds });
    showToast('Task deleted');
  }

  // Clean — remove done tasks from todayIds only, keep in project as done
  async function cleanToday() {
    const doneIds  = todayTasks.filter((t) => t.status === 'done').map((t) => t.id);
    if (!doneIds.length) { showToast('Nothing to clean'); return; }
    const todayIds = data.todayIds.filter((id) => !doneIds.includes(id));
    await saveData({ ...data, todayIds });
    showToast(`✓ ${doneIds.length} done task${doneIds.length > 1 ? 's' : ''} cleared`);
  }

  async function addToToday(task: Task) {
    if (data.todayIds.includes(task.id)) return;
    await saveData({ ...data, todayIds: [...data.todayIds, task.id] });
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
              onOpenModal={() => setModal({ task: t, isToday: true })}
              onDelete={() => deleteTask(t)}
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
              onOpenModal={() => setModal({ task: t, isToday: false })}
              onAddToToday={() => addToToday(t)}
            />
          ))
      }

      {/* Clean button — only shown when there are done tasks */}
      {doneCount > 0 && (
        <div style={{
          padding: '16px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <button
            onClick={cleanToday}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--px-surface)',
              border: '1px solid var(--px-border)',
              borderRadius: '20px',
              color: 'var(--px-muted)',
              fontSize: '13px',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={13} />
            Clear {doneCount} done task{doneCount > 1 ? 's' : ''}
          </button>
        </div>
      )}

      {modal && (
        <TaskModal
          task={modal.task}
          isToday={modal.isToday}
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