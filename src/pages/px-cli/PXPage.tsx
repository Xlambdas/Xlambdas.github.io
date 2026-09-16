// import { useState } from 'react';
import { PXProvider, usePX } from './context/PXContext';
import { Layout } from './components/Layout';
import { Toast } from './components/Toast';
import { TodayView } from './views/TodayView';
import { InboxView } from './views/InboxView';
import { FocusView } from './views/FocusView';
import { ProjectsView } from './views/ProjectsView';
import { SettingsView } from './views/SettingsView';
import { shortId, nowISO } from './utils';

// CSS variables injected once — PX has its own design system
export const PX_STYLE = `
  .px-dark {
    --px-bg:         #0f0f0f;
    --px-surface:    #1a1a1a;
    --px-border:     #2a2a2a;
    --px-text:       #e8e8e8;
    --px-muted:      #666;
    --px-accent:     #ffffff;
    --px-accent-dim: #2a2a2a;
    --px-red:        #e05555;
  }
  .px-light {
    --px-bg:         #ffffff;
    --px-surface:    #f5f5f5;
    --px-border:     #e0e0e0;
    --px-text:       #111111;
    --px-muted:      #999;
    --px-accent:     #000000;
    --px-accent-dim: #f0f0f0;
    --px-red:        #cc3333;
  }
  @keyframes px-spin {
    to { transform: rotate(360deg); }
  }
`;

function PXInner() {
    const { data, saveData, tab, theme } = usePX();

    async function handleAdd(title: string) {
        const n = nowISO();
        const task = {
            id: shortId(), displayId: '', title,
            projectIds: [], subtaskIds: [], conditionIds: [],
            status: 'todo' as const, createdAt: n, updatedAt: n,
        };
        const newData = tab === 'today'
            ? { ...data, todayTasks: [...data.todayTasks, task] }
            : { ...data, tasks: [...data.tasks, task] };
        await saveData(newData);
    }

    const view = {
        today: <TodayView />,
        inbox: <InboxView />,
        focus: <FocusView />,
        projects: <ProjectsView />,
        settings: <SettingsView />,
    }[tab];

    return (
        <div className={`px-${theme}`}>
            <style>{PX_STYLE}</style>
            <Layout onAdd={handleAdd}>
                {view}
            </Layout>
            <Toast />
        </div>
    );
}

export function PXPage() {
    return (
        <PXProvider>
            <PXInner />
        </PXProvider>
    );
}