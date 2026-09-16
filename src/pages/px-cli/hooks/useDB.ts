import { useEffect, useRef, useCallback } from 'react';

const DB_NAME = 'px-pwa';
const DB_VERSION = 1;

export function useDB() {
    const dbRef = useRef<IDBDatabase | null>(null);

    useEffect(() => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('store')) {
                db.createObjectStore('store');
            }
        };
        req.onsuccess = (e) => {
            dbRef.current = (e.target as IDBOpenDBRequest).result;
        };
    }, []);

    const get = useCallback(<T>(key: string): Promise<T | null> => {
        return new Promise((resolve) => {
            if (!dbRef.current) { resolve(null); return; }
            const tx = dbRef.current.transaction('store', 'readonly');
            const req = tx.objectStore('store').get(key);
            req.onsuccess = () => resolve(req.result ?? null);
            req.onerror = () => resolve(null);
        });
    }, []);

    const set = useCallback(<T>(key: string, value: T): Promise<void> => {
        return new Promise((resolve) => {
            if (!dbRef.current) { resolve(); return; }
            const tx = dbRef.current.transaction('store', 'readwrite');
            tx.objectStore('store').put(value, key);
            tx.oncomplete = () => resolve();
        });
    }, []);

    return { get, set };
}