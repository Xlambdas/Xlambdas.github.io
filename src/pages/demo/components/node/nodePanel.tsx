import React from "react";
import { type NodeType } from "../../data/graphData";

// --- Types ---

type TextSize = "S" | "M" | "L";
export const SIZE_MAP: Record<TextSize, number> = { S: 11, M: 13, L: 15 };

// --- Config ---

const TYPE_COLOR: Record<NodeType["type"], string> = {
    main: "#ffffff",
    folder: "#a5b4fc",
    file: "#94a3b8",
};

// --- Props ---

interface NodePanelProps {
    node: NodeType | null;
    onClose: () => void;
    textSize: TextSize;
}

// --- Component ---

export const NodePanel: React.FC<NodePanelProps> = ({ node, onClose, textSize }) => {
    const fs = SIZE_MAP[textSize];
    if (!node) return null;

    const rows: [string, React.ReactNode][] = [
        ["Type", <span style={{ textTransform: "capitalize" }}>{node.type}</span>],
        ["Statut", node.isUnlocked ? "Débloqué" : "Verrouillé"],
        ["Liens", node.links.length],
    ];

    return (
        <div style={{
            position: "absolute", bottom: 16, right: 16,
            width: 218, zIndex: 10,
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: 8,
            padding: 14,
        }}>
            {/* header */}
            <div style={{
                display: "flex", alignItems: "center",
                gap: 8, marginBottom: 10,
            }}>
                <div style={{
                    width: 9, height: 9, borderRadius: "50%",
                    background: TYPE_COLOR[node.type], flexShrink: 0,
                }} />
                <span style={{
                    color: "#c9d1d9", fontSize: fs + 1,
                    fontWeight: 500, flex: 1,
                }}>
                    {node.title}
                </span>
                <button
                    onClick={onClose}
                    style={{
                        background: "none", border: "none",
                        color: "#484f58", fontSize: fs + 4,
                        cursor: "pointer", lineHeight: 1, padding: 0,
                    }}
                >×</button>
            </div>

            {/* rows */}
            {rows.map(([label, value], i) => (
                <div key={i} style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "5px 0",
                    borderTop: "1px solid #21262d",
                    gap: 8,
                }}>
                    <span style={{ color: "#484f58", fontSize: fs, flexShrink: 0 }}>
                        {label}
                    </span>
                    <span style={{
                        color: "#c9d1d9", fontSize: fs,
                        textAlign: "right", wordBreak: "break-word",
                    }}>
                        {value}
                    </span>
                </div>
            ))}
        </div>
    );
};