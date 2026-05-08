import { useState, useCallback, useRef } from "react";
import { type NodeDef, GROUP_CONFIG, type NodeType, getVisibleIds, initialNodes } from "./data/graphData";
import { Sidebar } from "./components/sidebar";
import { NodePanel, SIZE_MAP } from "./components/nodePanel";
import { Legend } from "./components/legend";
import DemoGraph from "./graphView/demoGraph";
import { NodePreviewPanel } from "./components/nodePreviewPanel";
import { SettingsPanel } from "./components/settings";

const SHOW_FUN_FACT = true;
const SHOW_STRENGTHEN = true;

export function DemoHome() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
    const [mobileSearch, setMobileSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<typeof initialNodes>([]);
    const [previewNode, setPreviewNode] = useState<NodeType | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [textSize, setTextSize] = useState<"S" | "M" | "L">(() =>
        (localStorage.getItem("demo_textSize") as "S" | "M" | "L") ?? "M");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const fs = SIZE_MAP[textSize];

    const visibleIds = getVisibleIds(initialNodes);
    const visibleNodes = initialNodes.filter(n => visibleIds.has(n.id));

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f14] font-sans">
            <div className="hidden sm:block">
                <Sidebar
                    collapsed={collapsed}
                    onCollapse={() => setCollapsed(true)}
                    onSelectNode={setSelectedNode}
                    textSize={textSize}
                />
            </div>

            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                <div className="h-10.5 shrink-0 bg-[rgba(13,17,23,0.94)] border-b border-[#21262d] flex items-center px-3.5 gap-2.5 z-10">
                    {collapsed && (
                        <button
                            onClick={() => setCollapsed(false)}
                            className="bg-[#21262d] border border-[#30363d] text-[#8b949e] rounded px-2 py-0.5 text-xs cursor-pointer hover:bg-[#30363d] transition-colors"
                        >≡</button>
                    )}
                    <span className="text-[#484f58] text-xs">Graph View</span>

                    {/* mobile search */}
                    <div className="flex sm:hidden ml-auto items-center gap-2 relative">
                        {mobileSearch ? (
                            <div className="relative">
                                <input
                                    ref={searchInputRef}
                                    autoFocus
                                    value={searchQuery}
                                    onChange={e => {
                                        const q = e.target.value;
                                        setSearchQuery(q);
                                        window.__graphSearch?.(q);
                                        setSuggestions(
                                            q.length > 0
                                                ? visibleNodes.filter(n =>
                                                    n.title.toLowerCase().includes(q.toLowerCase())
                                                ).slice(0, 5)
                                                : []
                                        );
                                    }}
                                    onBlur={() => {
                                        setTimeout(() => {
                                            if (!searchQuery) setMobileSearch(false);
                                            setSuggestions([]);
                                        }, 150);
                                    }}
                                    placeholder="Rechercher…"
                                    className="bg-[#21262d] border border-[#30363d] text-[#c9d1d9] rounded-lg px-3 py-1.5 text-xs outline-none w-48"
                                />
                                {suggestions.length > 0 && (
                                    <div style={{
                                        position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                                        background: "#161b22", border: "1px solid #30363d",
                                        borderRadius: 8, zIndex: 50, overflow: "hidden",
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                                    }}>
                                        {suggestions.map(n => (
                                            <div
                                                key={n.id}
                                                onMouseDown={() => {
                                                    setSearchQuery(n.title);
                                                    window.__graphSearch?.(n.title);
                                                    window.__graphFocus?.(n.id);
                                                    setPreviewNode(n);
                                                    setSuggestions([]);
                                                    setMobileSearch(false);
                                                }}
                                                style={{
                                                    display: "flex", alignItems: "center", gap: 8,
                                                    padding: "8px 12px", cursor: "pointer",
                                                    borderBottom: "1px solid #21262d",
                                                }}
                                            >
                                                <div style={{
                                                    width: 6, height: 6, borderRadius: "50%",
                                                    background: n.isUnlocked
                                                        ? n.type === "main" ? "#ffffff"
                                                            : n.type === "folder" ? "#a5b4fc" : "#94a3b8"
                                                        : "#4b5563",
                                                    flexShrink: 0,
                                                }} />
                                                <span style={{ color: n.isUnlocked ? "#c9d1d9" : "#4b5563", fontSize: 12 }}>{n.title}</span>
                                                {!n.isUnlocked && <span style={{ color: "#30363d", fontSize: 10, marginLeft: "auto" }}>🔒</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => { setMobileSearch(true); setTimeout(() => searchInputRef.current?.focus(), 50); }}
                                className="text-[#8b949e] flex items-center justify-center w-8 h-8 bg-[#21262d] border border-[#30363d] rounded-lg"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="ml-auto hidden sm:flex gap-1.5 items-center">
                        {([["−", 0.8], ["+", 1.25]] as [string, number][]).map(([label, factor]) => (
                            <button
                                key={label}
                                onClick={() => window.__graphZoom?.(factor)}
                                className="bg-[#21262d] border border-[#30363d] text-[#8b949e] rounded w-6 h-6 text-sm cursor-pointer flex items-center justify-center hover:bg-[#30363d] transition-colors"
                            >{label}</button>
                        ))}
                        <button
                            onClick={() => window.__graphReset?.()}
                            className="bg-[#21262d] border border-[#30363d] text-[#8b949e] rounded px-2 py-0.5 text-[11px] cursor-pointer hover:bg-[#30363d] transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            onClick={() => setSettingsOpen(v => !v)}
                            className="bg-[#21262d] border border-[#30363d] text-[#8b949e] rounded w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-[#30363d] transition-colors"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div style={{
                    position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
                    display: "flex", gap: 8, zIndex: 20,
                }}>
                    {SHOW_FUN_FACT && (
                        <button style={{
                            background: "rgba(124, 106, 247, 0.15)", border: "1px solid rgba(124,106,247,0.4)",
                            color: "#a39af7", borderRadius: 8, padding: "8px 16px",
                            fontSize: fs+1, cursor: "pointer", display: "flex", alignItems: "center",
                            gap: 6, backdropFilter: "blur(8px)", boxShadow: "0 2px 12px rgba(124,106,247,0.2)",
                        }}>Le saviez-vous ?</button>
                    )}
                    {SHOW_STRENGTHEN && (
                        <button style={{
                            background: "rgba(124, 106, 247, 0.15)", border: "1px solid rgba(124,106,247,0.4)",
                            color: "#a39af7", borderRadius: 8, padding: "8px 16px",
                            fontSize: fs+1, cursor: "pointer", display: "flex", alignItems: "center",
                            gap: 6, backdropFilter: "blur(8px)", boxShadow: "0 2px 12px rgba(124,106,247,0.2)",
                        }}>S'entraîner</button>
                    )}
                </div>
                <NodePreviewPanel node={previewNode} onClose={() => setPreviewNode(null)} />

                <div className="flex-1 overflow-hidden relative">
                    <DemoGraph onSelectNode={(node) => {setSelectedNode(node); setPreviewNode(node); }} />
                    <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} textSize={textSize} />
                    <Legend textSize={textSize} />
                    {settingsOpen && (
                        <SettingsPanel
                            onClose={() => setSettingsOpen(false)}
                            textSize={textSize}
                            onTextSizeChange={setTextSize}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}


import { Sidebar_save } from "./components/sidebar";
// ------------------------------
export function DemoHome_save() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedNode, setSelectedNode] = useState<NodeDef | null>(null);

    const handleSelect = useCallback((node: NodeDef | null) => {
        setSelectedNode(prev => (prev?.id === node?.id ? null : node));
    }, []);

    const cfg = selectedNode ? GROUP_CONFIG[selectedNode.group] : null;

    return (
        <div style={{
            display: "flex", height: "100vh", width: "100vw",
            background: "#0d1117", overflow: "hidden",
            fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
            <Sidebar_save
                collapsed={collapsed}
                onCollapse={() => setCollapsed(true)}
                selectedNode={selectedNode}
                onSelectNode={handleSelect}
            />

            <div style={{ flex: 1, position: "relative", overflow: "hidden", minWidth: 0 }}>
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 42,
                    background: "rgba(13,17,23,0.94)", borderBottom: "1px solid #21262d",
                    display: "flex", alignItems: "center", padding: "0 14px", gap: 10, zIndex: 10,
                }}>
                    {collapsed && (
                        <button onClick={() => setCollapsed(false)} style={{
                            background: "#21262d", border: "1px solid #30363d", color: "#8b949e",
                            borderRadius: 5, padding: "3px 9px", fontSize: 12, cursor: "pointer",
                        }}>≡</button>
                    )}
                    <span style={{ color: "#484f58", fontSize: 12 }}>Graph View</span>
                    {selectedNode && cfg && (
                        <>
                            <span style={{ color: "#21262d" }}>/</span>
                            <span style={{ color: cfg.fill, fontSize: 12 }}>{selectedNode.label}</span>
                        </>
                    )}
                    <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
                        {([["−", 0.8], ["+", 1.25]] as [string, number][]).map(([label, factor]) => (
                            <button key={label} onClick={() => window.__graphZoom?.(factor)} style={{
                                background: "#21262d", border: "1px solid #30363d", color: "#8b949e",
                                borderRadius: 5, width: 24, height: 24, fontSize: 14, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>{label}</button>
                        ))}
                        <button onClick={() => { window.__graphReset?.(); setSelectedNode(null); }} style={{
                            background: "#21262d", border: "1px solid #30363d", color: "#8b949e",
                            borderRadius: 5, padding: "3px 9px", fontSize: 11, cursor: "pointer",
                        }}>Reset</button>
                    </div>
                </div>

                <div style={{ position: "absolute", inset: 0, paddingTop: 42 }}>
                </div>

                {/* <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} /> */}
                <Legend textSize="M" />
            </div>
        </div>
    );
}