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

function PXInner() {
    const { data, saveData, tab, theme } = usePX();

    async function handleAdd(title: string) {
        const n = nowISO();
        const task = {
            id: shortId(), displayId: '', title,
            projectIds: [], subtaskIds: [], conditionIds: [],
            status: 'todo' as const, createdAt: n, updatedAt: n,
        };

        if (tab === 'today') {
            await saveData({
                ...data,
                tasks: [...data.tasks, task],
                todayIds: [...data.todayIds, task.id],
            });
        } else {
            await saveData({ ...data, tasks: [...data.tasks, task] });
        }
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
            {/* <style>{PX_STYLE}</style> */}
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