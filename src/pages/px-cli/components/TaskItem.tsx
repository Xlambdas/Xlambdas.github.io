import { MoreHorizontal } from 'lucide-react';
import type { Task, AppData } from '../types';
import { isBlocked } from '../utils';

interface Props {
    task: Task;
    isToday: boolean;
    data: AppData;
    onToggleDone: () => void;
    onOpenModal: () => void;
}

export function TaskItem({ task, isToday, data, onToggleDone, onOpenModal }: Props) {
    const blocked = isBlocked(data, task);
    const done = task.status === 'done';
    const project = !isToday && task.projectIds.length
        ? data.projects.find((p) => p.id === task.projectIds[0])
        : null;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            borderBottom: '1px solid var(--px-border)',
            opacity: done ? 0.45 : 1,
        }}>

            {/* Edit button — left side */}
            <button
                onClick={(e) => { e.stopPropagation(); onOpenModal(); }}
                style={{
                    flexShrink: 0,
                    width: '44px',
                    alignSelf: 'stretch',
                    background: 'none',
                    border: 'none',
                    borderRight: '1px solid var(--px-border)',
                    color: 'var(--px-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <MoreHorizontal size={16} />
            </button>

            {/* Row — tap to toggle done */}
            <div
                onClick={onToggleDone}
                style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 16px 12px 12px',
                    cursor: 'pointer',
                    minWidth: 0,
                }}
            >
                {/* Circle */}
                <div style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: `2px solid ${done ? 'var(--px-accent)' :
                            blocked ? 'var(--px-red)' :
                                'var(--px-border)'
                        }`,
                    background: done ? 'var(--px-accent)' : 'transparent',
                    flexShrink: 0,
                    marginTop: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    color: 'var(--px-bg)',
                    transition: 'all .15s',
                }}>
                    {done ? '✓' : ''}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        fontSize: '15px',
                        lineHeight: 1.3,
                        wordBreak: 'break-word',
                        textDecoration: done ? 'line-through' : 'none',
                        color: done ? 'var(--px-muted)' : 'var(--px-text)',
                    }}>
                        {task.title}
                    </div>
                    <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {task.duration && <Tag>{task.duration}m</Tag>}
                        {task.deadline && <Tag>📅 {task.deadline}</Tag>}
                        {blocked && <Tag red>blocked</Tag>}
                        {task.recurrence && <Tag>🔁 {task.recurrence}</Tag>}
                        {project && <Tag accent>{project.title}</Tag>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Tag({ children, red, accent }: {
    children: React.ReactNode;
    red?: boolean;
    accent?: boolean;
}) {
    return (
        <span style={{
            background: 'var(--px-surface)',
            border: `1px solid ${red ? 'var(--px-red)' : accent ? 'var(--px-accent-dim)' : 'var(--px-border)'}`,
            color: red ? 'var(--px-red)' : accent ? 'var(--px-accent)' : 'var(--px-muted)',
            borderRadius: '4px',
            padding: '1px 6px',
            fontSize: '11px',
        }}>
            {children}
        </span>
    );
}