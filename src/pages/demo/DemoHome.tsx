import { useState, useCallback } from "react";
import { type NodeDef, GROUP_CONFIG } from "./data/graphData";
import { GraphCanvas } from "./components/graphCanvas";
import { Sidebar } from "./components/sidebar";
import { NodePanel } from "./components/nodePanel";
import { Legend } from "./components/legend";
// import DemoGraph from "./graphView/demoGraph";

import DemoGraph from "./graphView/demoGraph";

export function DemoHome() {
    return (
        <div style={{
            display: "flex", flexDirection: "column", height: "100vh", width: "100vw",
            background: "#0b0f14", overflow: "hidden",
            fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
            <div style={{
                height: 42, flexShrink: 0,
                background: "rgba(13,17,23,0.94)", borderBottom: "1px solid #21262d",
                display: "flex", alignItems: "center", padding: "0 14px", gap: 10, zIndex: 10,
            }}>
                <span style={{ color: "#484f58", fontSize: 12 }}>Graph View</span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
                    {([["−", 0.8], ["+", 1.25]] as [string, number][]).map(([label, factor]) => (
                        <button key={label} onClick={() => window.__graphZoom?.(factor)} style={{
                            background: "#21262d", border: "1px solid #30363d", color: "#8b949e",
                            borderRadius: 5, width: 24, height: 24, fontSize: 14, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>{label}</button>
                    ))}
                    <button onClick={() => window.__graphReset?.()} style={{
                        background: "#21262d", border: "1px solid #30363d", color: "#8b949e",
                        borderRadius: 5, padding: "3px 9px", fontSize: 11, cursor: "pointer",
                    }}>Reset</button>
                </div>
            </div>

            <div style={{ flex: 1, overflow: "hidden" }}>
                <DemoGraph />
            </div>
        </div>
    );
}





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
            <Sidebar
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
                    <GraphCanvas selectedNode={selectedNode} onSelectNode={handleSelect} />
                </div>

                <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} />
                <Legend />
            </div>
        </div>
    );
}