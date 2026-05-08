import { useState, useCallback, useRef } from "react";
import { type NodeDef, GROUP_CONFIG, type NodeType } from "./data/graphData";
import { Sidebar } from "./components/sidebar";
import { NodePanel } from "./components/nodePanel";
import { Legend } from "./components/legend";
import DemoGraph from "./graphView/demoGraph";


export function DemoHome() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
    const [mobileSearch, setMobileSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f14] font-sans">
            <Sidebar
                collapsed={collapsed}
                onCollapse={() => setCollapsed(true)}
                onSelectNode={setSelectedNode}
            />

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
                    <div className="flex sm:hidden ml-auto items-center gap-2">
                        {mobileSearch ? (
                            <input
                                ref={searchInputRef}
                                autoFocus
                                value={searchQuery}
                                onChange={e => {
                                    setSearchQuery(e.target.value);
                                    window.__graphSearch?.(e.target.value);
                                }}
                                onBlur={() => { if (!searchQuery) setMobileSearch(false); }}
                                placeholder="Search…"
                                className="bg-[#21262d] border border-[#30363d] text-[#c9d1d9] rounded px-2 py-0.5 text-xs outline-none w-36"
                            />
                        ) : (
                            <button
                                onClick={() => { setMobileSearch(true); setTimeout(() => searchInputRef.current?.focus(), 50); }}
                                className="text-[#8b949e] flex items-center justify-center w-6 h-6"
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
                        >Reset</button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <DemoGraph onSelectNode={setSelectedNode} />
                    <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} />
                    <Legend />
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
                <Legend />
            </div>
        </div>
    );
}