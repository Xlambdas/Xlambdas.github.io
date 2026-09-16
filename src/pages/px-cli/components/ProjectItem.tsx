import { Star } from 'lucide-react';
import type { Project, AppData } from '../types';
import { projectPct } from '../utils';

interface Props {
    project: Project;
    data: AppData;
    focused: boolean;
    onClick: () => void;
}

export function ProjectItem({ project, data, focused, onClick }: Props) {
    const pct = projectPct(data, project.id);
    const taskCount = data.tasks.filter(
        (t) => t.projectIds.includes(project.id) && !t.parentId && t.status === 'todo'
    ).length;

    return (
        <div
            onClick={onClick}
            style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--px-border)',
                cursor: 'pointer',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {focused && (
                        <Star
                            size={14}
                            fill="var(--px-accent)"
                            color="var(--px-accent)"
                        />
                    )}
                    <span style={{ fontSize: '15px', fontWeight: 500 }}>{project.title}</span>
                </div>
                <span style={{ fontSize: '13px', color: 'var(--px-muted)' }}>{pct}%</span>
            </div>
            <div style={{
                marginTop: '8px',
                height: '3px',
                background: 'var(--px-border)',
                borderRadius: '2px',
                overflow: 'hidden',
            }}>
                <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: 'var(--px-accent)',
                    borderRadius: '2px',
                    transition: 'width .3s',
                }} />
            </div>
            <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--px-muted)' }}>
                {taskCount} task{taskCount !== 1 ? 's' : ''} remaining
            </div>
        </div>
    );
}