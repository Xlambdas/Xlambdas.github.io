import { useState, useMemo } from "react";
import { type NodeDef, GROUP_CONFIG, NODES, ADJACENCY, type Group } from "../data/graphData";
import { Stat } from "./stat";
import { EDGES } from "../data/graphData";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
    collapsed: boolean;
    onCollapse: () => void;
    selectedNode: NodeDef | null;
    onSelectNode: (node: NodeDef | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse, selectedNode, onSelectNode }) => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<Group | "all">("all");

    const filtered = useMemo(() => NODES.filter(n =>
        n.label.toLowerCase().includes(search.toLowerCase()) &&
        (filter === "all" || n.group === filter)
    ), [search, filter]);

    if (collapsed) return null;

    return (
        <div style={{
            width: 252, background: "#161b22", borderRight: "1px solid #21262d",
            display: "flex", flexDirection: "column", flexShrink: 0,
        }}>
            <div style={{ padding: "13px 14px 10px", borderBottom: "1px solid #21262d" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="3.5" fill="#7c6af7" />
                            <circle cx="3" cy="5" r="2" fill="#4ecdc4" />
                            <circle cx="17" cy="5" r="2" fill="#4ecdc4" />
                            <circle cx="3" cy="15" r="2" fill="#8b949e" />
                            <circle cx="17" cy="15" r="2" fill="#8b949e" />
                            <line x1="10" y1="10" x2="3" y2="5" stroke="#30363d" strokeWidth="1" />
                            <line x1="10" y1="10" x2="17" y2="5" stroke="#30363d" strokeWidth="1" />
                            <line x1="10" y1="10" x2="3" y2="15" stroke="#30363d" strokeWidth="1" />
                            <line x1="10" y1="10" x2="17" y2="15" stroke="#30363d" strokeWidth="1" />
                        </svg>
                        <span style={{ color: "#c9d1d9", fontSize: 12, fontWeight: 500 }}>Knowledge Graph</span>
                    </div>
                    <button onClick={onCollapse} style={{
                        background: "none", border: "none", color: "#484f58",
                        cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "2px 4px",
                    }}>‹</button>
                </div>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search nodes…"
                    style={{
                        width: "100%", background: "#0d1117", border: "1px solid #21262d",
                        borderRadius: 5, padding: "5px 9px", color: "#c9d1d9",
                        fontSize: 11, outline: "none", boxSizing: "border-box",
                    }}
                />
            </div>

            <div style={{ padding: "8px 14px", borderBottom: "1px solid #21262d", display: "flex", gap: 4, flexWrap: "wrap" }}>
                {(["all", "hub", "folder", "skill", "note"] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        background: filter === f ? "#21262d" : "transparent",
                        border: `1px solid ${filter === f ? "#30363d" : "transparent"}`,
                        color: filter === f ? "#c9d1d9" : "#484f58",
                        borderRadius: 4, padding: "3px 8px", fontSize: 11,
                        cursor: "pointer", textTransform: "capitalize",
                    }}>{f}</button>
                ))}
            </div>

            <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#21262d transparent", padding: "4px 0" }}>
                {filtered.map(node => {
                    const cfg = GROUP_CONFIG[node.group];
                    const active = selectedNode?.id === node.id;
                    const links = (ADJACENCY.get(node.id) ?? []).length;
                    return (
                        <div key={node.id} onClick={() => { onSelectNode(node); window.__graphFocus?.(node.id); }}
                            style={{
                                display: "flex", alignItems: "center", gap: 9,
                                padding: "5px 14px", cursor: "pointer",
                                background: active ? "#21262d" : "transparent",
                                borderLeft: `2px solid ${active ? cfg.fill : "transparent"}`,
                            }}
                        >
                            <div style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.fill, flexShrink: 0 }} />
                            <span style={{ color: active ? "#c9d1d9" : "#8b949e", fontSize: 11, flex: 1 }}>{node.label}</span>
                            <span style={{ color: "#30363d", fontSize: 10 }}>{links}</span>
                        </div>
                    );
                })}
            </div>

            <div style={{ padding: "10px 14px", borderTop: "1px solid #21262d", display: "flex" }}>
                <Stat value={NODES.length} label="Nodes" />
                <div style={{ width: 1, background: "#21262d" }} />
                <Stat value={EDGES.length} label="Links" />
                <div style={{ width: 1, background: "#21262d" }} />
                <Stat value={4} label="Groups" />
                <a onClick={()=>navigate("/demoGraph")}>Graph</a>
            </div>
        </div>
    );
};