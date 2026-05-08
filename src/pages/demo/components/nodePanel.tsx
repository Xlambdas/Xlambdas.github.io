import { type NodeType } from "../data/graphData";

export const SIZE_MAP = { S: 11, M: 13, L: 15 };

interface NodePanelProps {
    node: NodeType | null;
    onClose: () => void;
    textSize: "S" | "M" | "L";
}

const TYPE_COLOR: Record<NodeType["type"], string> = {
    main: "#ffffff",
    folder: "#a5b4fc",
    file: "#94a3b8",
};

export const NodePanel: React.FC<NodePanelProps> = ({ node, onClose, textSize }) => {
    const fs = SIZE_MAP[textSize];
    if (!node) return null;

    const rows: [string, React.ReactNode][] = [
        ["Type", <span style={{ textTransform: "capitalize" }}>{node.type}</span>],
        ["Status", node.isUnlocked ? "Unlocked" : "Locked"],
        ["Links", node.links.length],
        // ["Connected to", node.links.join(", ") || "—"],
    ];

    return (
        <div style={{
            position: "absolute", bottom: 16, right: 16, width: 218,
            background: "#161b22", border: "1px solid #30363d",
            borderRadius: 8, padding: 14, zIndex: 10,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: TYPE_COLOR[node.type], flexShrink: 0 }} />
                <span style={{ color: "#c9d1d9", fontSize: fs+1, fontWeight: 500, flex: 1 }}>{node.title}</span>
                <button onClick={onClose} style={{
                    background: "none", border: "none", color: "#484f58",
                    cursor: "pointer", fontSize: fs+4, lineHeight: 1, padding: 0,
                }}>×</button>
            </div>
            {rows.map(([k, v], i) => (
                <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    padding: "5px 0", borderTop: "1px solid #21262d", gap: 8,
                }}>
                    <span style={{ color: "#484f58", fontSize: fs, flexShrink: 0 }}>{k}</span>
                    <span style={{ color: "#c9d1d9", fontSize: fs, textAlign: "right", wordBreak: "break-word" }}>{v}</span>
                </div>
            ))}
        </div>
    );
};