import {
  createContext, useContext, useEffect, useState,
  useCallback, useRef, type ReactNode
} from 'react';
import type { AppData, GitHubConfig, TabId } from '../types';
import { emptyData } from '../utils';
import { useGitHub } from '../hooks/useGitHub';
import { mergeData } from '../hooks/useSync';
import { dbGet, dbSet } from '../hooks/useDB';

interface PXContextValue {
  data: AppData;
  setData: (d: AppData) => void;
  saveData: (d: AppData) => Promise<void>;
  cfg: GitHubConfig | null;
  setCfg: (c: GitHubConfig) => void;
  tab: TabId;
  setTab: (t: TabId) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  toast: string;
  showToast: (msg: string) => void;
  syncing: boolean;
  syncLabel: string;
  triggerSync: () => Promise<void>;
  triggerPull: () => Promise<void>;
  ready: boolean;
}

const PXContext = createContext<PXContextValue | null>(null);

function migrateTodayTasks(data: any): AppData {
  if (data.todayTasks && !data.todayIds) {
    const todayIds = (data.todayTasks as any[]).map((t: any) => t.id);
    const existingIds = new Set((data.tasks as any[]).map((t: any) => t.id));
    const newTasks = [...(data.tasks as any[])];
    for (const t of data.todayTasks as any[]) {
      if (!existingIds.has(t.id)) newTasks.push(t);
    }
    return {
      ...data,
      tasks: newTasks,
      todayIds,
      deletedIds: data.deletedIds ?? [],
      todayTasks: undefined,
    };
  }
  if (!data.todayIds || !Array.isArray(data.todayIds)) {
    return { ...data, todayIds: [], deletedIds: data.deletedIds ?? [] };
  }
  if (!data.deletedIds || !Array.isArray(data.deletedIds)) {
    return { ...data, deletedIds: [] };
  }
  return data;
}

export function PXProvider({ children }: { children: ReactNode }) {
  const { ghRead, ghWrite } = useGitHub();

  const [data, setDataState]      = useState<AppData>(emptyData());
  const [cfg, setCfgState]        = useState<GitHubConfig | null>(null);
  const [tab, setTab]             = useState<TabId>('today');
  const [theme, setTheme]         = useState<'dark' | 'light'>('dark');
  const [toast, setToast]         = useState('');
  const [syncing, setSyncing]     = useState(false);
  const [syncLabel, setSyncLabel] = useState('never synced');
  const [ready, setReady]         = useState(false);
  const toastTimer                = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateSyncLabel(lastSyncAt: string) {
    if (!lastSyncAt) { setSyncLabel('never synced'); return; }
    const diff = Math.floor((Date.now() - new Date(lastSyncAt).getTime()) / 60000);
    if (diff < 1)       setSyncLabel('synced now');
    else if (diff < 60) setSyncLabel(`${diff}m ago`);
    else setSyncLabel(new Date(lastSyncAt).toLocaleDateString());
  }

  useEffect(() => {
    async function boot() {
      // 1. Load config first
      let loadedCfg: GitHubConfig | null = null;
      try {
        const saved = localStorage.getItem('px-cfg');
        if (saved) {
          loadedCfg = JSON.parse(saved);
          setCfgState(loadedCfg);
        }
      } catch {}

      // 2. Load theme
      const savedTheme = localStorage.getItem('px-theme') as 'dark' | 'light' | null;
      if (savedTheme) setTheme(savedTheme);

      // 3. Load local data from IndexedDB
      const stored = await dbGet<AppData>('data');
      const localData = stored ? migrateTodayTasks(stored) : emptyData();
      setDataState(localData);
      updateSyncLabel(localData.syncMeta?.lastSyncAt ?? '');

      // 4. Register service worker for notifications
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/px-sw.js', {
            scope: '/sandbox/px/',
          });
        } catch (e) {
          console.warn('PX SW registration failed:', e);
        }
      }

      setReady(true);

      // 5. Auto-pull silently in background
      if (loadedCfg) {
        try {
          const remote = await ghRead(loadedCfg);
          if (remote) {
            const migratedRemote = migrateTodayTasks(remote.data);
            const remoteWithDeletions = {
              ...migratedRemote,
              deletedIds: Array.from(new Set([
                ...(localData.deletedIds ?? []),
                ...(migratedRemote.deletedIds ?? []),
              ])),
            };
            const { merged } = mergeData(localData, remoteWithDeletions);
            setDataState(merged);
            await dbSet('data', merged);
            updateSyncLabel(merged.syncMeta?.lastSyncAt ?? '');
          }
        } catch {
          // Offline — continue with local data silently
        }
      }
    }
    boot();
  }, []);

  const saveData = useCallback(async (d: AppData) => {
    setDataState(d);
    await dbSet('data', d);
    updateSyncLabel(d.syncMeta?.lastSyncAt ?? '');
  }, []);

  const setCfg = useCallback((c: GitHubConfig) => {
    setCfgState(c);
    localStorage.setItem('px-cfg', JSON.stringify(c));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('px-theme', next);
      return next;
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2500);
  }, []);

  const triggerSync = useCallback(async () => {
    if (!cfg?.token) { showToast('Configure GitHub in Settings first'); setTab('settings'); return; }
    setSyncing(true);
    try {
      const remote = await ghRead(cfg);
      if (!remote) {
        await ghWrite(cfg, data, null, 'px sync: initial push (pwa)');
        showToast('✓ Initial sync done');
      } else {
        const migratedRemote = migrateTodayTasks(remote.data);
        const remoteWithDeletions = {
          ...migratedRemote,
          deletedIds: Array.from(new Set([
            ...(data.deletedIds ?? []),
            ...(migratedRemote.deletedIds ?? []),
          ])),
        };
        const { merged, added, updated } = mergeData(data, remoteWithDeletions);
        setDataState(merged);
        await dbSet('data', merged);
        updateSyncLabel(merged.syncMeta?.lastSyncAt ?? '');
        await ghWrite(cfg, merged, remote.sha, 'px sync (pwa)');
        showToast(added + updated > 0 ? `✓ ↓${added} received` : '✓ Up to date');
      }
    } catch (e: any) {
      showToast('✗ ' + e.message);
    } finally {
      setSyncing(false);
    }
  }, [cfg, data, ghRead, ghWrite, showToast]);

  const triggerPull = useCallback(async () => {
    if (!cfg?.token) { showToast('Configure GitHub in Settings first'); return; }
    setSyncing(true);
    try {
      const remote = await ghRead(cfg);
      if (!remote) { showToast('Nothing on remote yet'); return; }
      const migratedRemote = migrateTodayTasks(remote.data);
      const remoteWithDeletions = {
        ...migratedRemote,
        deletedIds: Array.from(new Set([
          ...(data.deletedIds ?? []),
          ...(migratedRemote.deletedIds ?? []),
        ])),
      };
      const { merged, added, updated } = mergeData(data, remoteWithDeletions);
      setDataState(merged);
      await dbSet('data', merged);
      updateSyncLabel(merged.syncMeta?.lastSyncAt ?? '');
      showToast(added + updated > 0 ? `✓ ↓${added + updated} pulled` : '✓ Already up to date');
    } catch (e: any) {
      showToast('✗ ' + e.message);
    } finally {
      setSyncing(false);
    }
  }, [cfg, data, ghRead, showToast]);

  return (
    <PXContext.Provider value={{
      data, setData: setDataState, saveData,
      cfg, setCfg,
      tab, setTab,
      theme, toggleTheme,
      toast, showToast,
      syncing, syncLabel,
      triggerSync, triggerPull,
      ready,
    }}>
      {children}
    </PXContext.Provider>
  );
}

export function usePX() {
  const ctx = useContext(PXContext);
  if (!ctx) throw new Error('usePX must be used inside PXProvider');
  return ctx;
}