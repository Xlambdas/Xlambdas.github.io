import { useState } from 'react';

const BIN_URL = import.meta.env.VITE_TROMBI_BIN_URL as string;
const API_KEY = import.meta.env.VITE_TROMBI_API_KEY as string;

async function deriveKey(password: string, salt: Uint8Array) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: new Uint8Array(salt) as BufferSource, iterations: 250000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false, ['decrypt']
    );
}

async function decryptData(b64: string, password: string) {
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const salt = bytes.slice(0, 16);
    const iv = bytes.slice(16, 28);
    const ciphertext = bytes.slice(28);
    const key = await deriveKey(password, salt);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return JSON.parse(new TextDecoder().decode(plain));
}

type Person = {
    id: string;
    prenom: string;
    nom?: string;
    photo?: string;
    lieu?: string;
    rencontre?: string;
    dateRencontre?: string;
    contexte?: string;
    tags?: string[];
    notes?: string;
    createdAt?: string;
};

function PersonCard({ p }: { p: Person }) {
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            className="cursor-pointer"
            style={{ perspective: '1000px', height: '280px' }}
            onClick={() => setFlipped(f => !f)}
        >
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.55s cubic-bezier(0.4,0.2,0.2,1)',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* FRONT */}
                <div
                    style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                    {p.photo
                        ? <img src={p.photo} alt={p.prenom} className="w-full object-cover" style={{ height: '180px' }} />
                        : <div className="w-full bg-green-50 flex items-center justify-center text-4xl text-green-700" style={{ height: '180px' }}>
                            {p.prenom[0]}{p.nom?.[0] ?? ''}
                        </div>
                    }
                    <div className="p-3">
                        <p className="font-medium text-sm">{p.prenom} {p.nom ?? ''}</p>
                        {p.rencontre && <p className="text-xs text-stone-400 mt-0.5 truncate">{p.rencontre}</p>}
                        <div className="flex flex-wrap gap-1 mt-2">
                            {(p.tags ?? []).slice(0, 3).map(t => (
                                <span key={t} className="bg-green-50 text-green-800 text-[10px] px-2 py-0.5 rounded-full">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BACK */}
                <div
                    style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0, transform: 'rotateY(180deg)' }}
                    className="bg-green-800 rounded-xl shadow-sm overflow-hidden p-4 flex flex-col justify-between"
                >
                    <div>
                        <p className="text-white font-semibold text-base mb-1">{p.prenom} {p.nom ?? ''}</p>
                        {p.lieu && (
                            <p className="text-green-200 text-xs mb-2">📍 {p.lieu}</p>
                        )}
                        {p.rencontre && (
                            <div className="mb-2">
                                <p className="text-green-400 text-[10px] uppercase tracking-wider mb-0.5">Rencontré via</p>
                                <p className="text-white text-xs">{p.rencontre}</p>
                            </div>
                        )}
                        {p.notes && (
                            <div className="mb-2">
                                <p className="text-green-400 text-[10px] uppercase tracking-wider mb-0.5">Notes</p>
                                <p className="text-green-100 text-xs line-clamp-3">{p.notes}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {(p.tags ?? []).map(t => (
                            <span key={t} className="bg-green-700 text-green-100 text-[10px] px-2 py-0.5 rounded-full">{t}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TrombiPage() {
    const [password, setPassword] = useState('');
    const [people, setPeople] = useState<Person[] | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    async function unlock() {
        setLoading(true); setError('');
        try {
            const res = await fetch(BIN_URL, {
                headers: { 'X-Master-Key': API_KEY, 'X-Bin-Meta': 'false' }
            });
            const json = await res.json();
            const data = await decryptData(json.blob, password);
            setPeople(data);
        } catch (e) {
            console.log('Error:', e);
            setError('Wrong password or data error.');
        } finally { setLoading(false); }
    }

    const filtered = (people ?? []).filter(p =>
        !search ||
        `${p.prenom} ${p.nom ?? ''} ${(p.tags ?? []).join(' ')} ${p.rencontre ?? ''} ${p.lieu ?? ''}`
            .toLowerCase().includes(search.toLowerCase())
    );

    if (!people) return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
                <h1 className="text-2xl font-serif mb-6 text-center">🔒 Trombinoscope</h1>
                <input
                    type="password" placeholder="Password"
                    value={password} onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && unlock()}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 mb-3 text-sm outline-none focus:border-green-700"
                />
                {error && <p className="text-red-600 text-xs mb-3">{error}</p>}
                <button onClick={unlock} disabled={loading}
                    className="w-full bg-green-800 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                    {loading ? 'Unlocking…' : 'Unlock'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-stone-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-serif">Trombinoscope</h1>
                    <input placeholder="🔍 Search…" value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border border-stone-200 rounded-lg px-3 py-2 text-sm w-52 outline-none focus:border-green-700" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filtered.map(p => <PersonCard key={p.id} p={p} />)}
                </div>
            </div>
        </div>
    );
}