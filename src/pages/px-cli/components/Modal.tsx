import { useEffect, useRef, useState } from 'react';
import { X, Link } from 'lucide-react';
import type { Task } from '../types';
import { usePX } from '../context/PXContext';
import { nowISO } from '../utils';
import { LinkModal } from './LinkModal';

interface Props {
    task: Task;
    isToday: boolean;
    onClose: () => void;
}

export function TaskModal({ task, isToday, onClose }: Props) {
    const { data, saveData, showToast } = usePX();
    const titleRef = useRef<HTMLInputElement>(null);
    const [linking, setLinking] = useState(false);
    const [duration, setDuration] = useState(String(task.duration ?? ''));
    const [deadline, setDeadline] = useState(task.deadline ?? '');

    useEffect(() => { titleRef.current?.focus(); }, []);

    useEffect(() => {
        // Lock background scroll
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

    async function handleSave() {
        const title = titleRef.current?.value.trim();
        if (!title) return;

        const idx = data.tasks.findIndex((t) => t.id === task.id);
        if (idx === -1) return;

        const updated = [...data.tasks];
        updated[idx] = {
            ...updated[idx],
            title,
            duration: duration ? parseInt(duration, 10) : undefined,
            deadline: deadline || undefined,
            updatedAt: nowISO(),
        };

        await saveData({ ...data, tasks: updated });
        showToast('✓ Saved');
        onClose();
    }

    const project = task.projectIds.length
        ? data.projects.find((p) => p.id === task.projectIds[0])?.title ?? ''
        : '';

    return (
        <>
            {/* Overlay */}
            <div
                onClick={(e) => e.target === e.currentTarget && onClose()}
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(0,0,0,.6)',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                }}
            >
                {/* Card — centered */}
                <div style={{
                    background: 'var(--px-surface)',
                    borderRadius: '16px',
                    padding: '20px',
                    width: '100%',
                    maxWidth: '420px',
                    maxHeight: '85dvh',
                    overflowY: 'auto',
                    boxShadow: '0 20px 60px rgba(0,0,0,.4)',
                }}>

                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                    }}>
                        <span style={{ fontSize: '16px', fontWeight: 600 }}>Edit task</span>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'none', border: 'none',
                                color: 'var(--px-muted)', cursor: 'pointer',
                                padding: '4px', display: 'flex', alignItems: 'center',
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Title */}
                    <FieldLabel>Title</FieldLabel>
                    <input
                        ref={titleRef}
                        defaultValue={task.title}
                        style={inputStyle}
                        placeholder="Task title"
                    />

                    {/* Project */}
                    {project && (
                        <>
                            <FieldLabel>Project</FieldLabel>
                            <div style={{
                                fontSize: '14px',
                                color: 'var(--px-muted)',
                                padding: '8px 0 12px',
                            }}>
                                📁 {project}
                            </div>
                        </>
                    )}

                    {/* Duration + Deadline row */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '4px' }}>
                        <div style={{ flex: 1 }}>
                            <FieldLabel>Duration (min)</FieldLabel>
                            <input
                                type="number"
                                placeholder="e.g. 30"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <FieldLabel>Deadline</FieldLabel>
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                style={{
                                    ...inputStyle,
                                    colorScheme: 'dark',
                                }}
                            />
                        </div>
                    </div>

                    {/* Link button */}
                    <button
                        onClick={() => setLinking(true)}
                        style={{
                            width: '100%',
                            background: 'transparent',
                            color: 'var(--px-text)',
                            border: '1px solid var(--px-border)',
                            borderRadius: '10px',
                            padding: '10px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                        }}
                    >
                        <Link size={14} />
                        {project ? 'Change project / link as subtask' : 'Link to project or task'}
                    </button>

                    {/* Actions */}
                    <button
                        onClick={handleSave}
                        style={{
                            width: '100%',
                            background: 'var(--px-accent)',
                            color: 'var(--px-bg)',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '12px',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            marginBottom: '8px',
                        }}
                    >
                        Save
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            width: '100%',
                            background: 'none',
                            color: 'var(--px-muted)',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px',
                            fontSize: '14px',
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>

                </div>
            </div>

            {linking && (
                <LinkModal
                    task={task}
                    isToday={isToday}
                    onClose={() => { setLinking(false); onClose(); }}
                />
            )}
        </>
    );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--px-muted)',
            textTransform: 'uppercase',
            letterSpacing: '.6px',
            marginBottom: '6px',
        }}>
            {children}
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--px-bg)',
    border: '1px solid var(--px-border)',
    borderRadius: '10px',
    color: 'var(--px-text)',
    fontSize: '15px',
    padding: '10px 14px',
    outline: 'none',
    marginBottom: '12px',
    display: 'block',
};