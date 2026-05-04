import { type NodeDef, GROUP_CONFIG, ADJACENCY } from "../data/graphData";

interface NodePanelProps {
    node: NodeDef | null;
    onClose: () => void;
}

export const NodePanel: React.FC<NodePanelProps> = ({ node, onClose }) => {
    if (!node) return null;
    const cfg = GROUP_CONFIG[node.group];
    const links = ADJACENCY.get(node.id) ?? [];

    const rows: [string, React.ReactNode][] = [
        ["Type", <span style={{ textTransform: "capitalize" }}>{node.group}</span>],
        ["Links", links.length],
        ["Connected to", links.join(", ") || "—"],
    ];

    return (
        <div style={{
            position: "absolute", bottom: 16, right: 16, width: 218,
            background: "#161b22", border: "1px solid #30363d",
            borderRadius: 8, padding: 14, zIndex: 10,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: cfg.fill, flexShrink: 0 }} />
                <span style={{ color: "#c9d1d9", fontSize: 12, fontWeight: 500, flex: 1 }}>{node.label}</span>
                <button onClick={onClose} style={{
                    background: "none", border: "none", color: "#484f58",
                    cursor: "pointer", fontSize: 15, lineHeight: 1, padding: 0,
                }}>×</button>
            </div>
            {rows.map(([k, v], i) => (
                <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    padding: "5px 0", borderTop: "1px solid #21262d", gap: 8,
                }}>
                    <span style={{ color: "#484f58", fontSize: 11, flexShrink: 0 }}>{k}</span>
                    <span style={{ color: "#c9d1d9", fontSize: 11, textAlign: "right", wordBreak: "break-word" }}>{v}</span>
                </div>
            ))}
        </div>
    );
};