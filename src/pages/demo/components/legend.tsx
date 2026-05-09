import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TextSize = "S" | "M" | "L";
const SIZE_MAP: Record<TextSize, number> = { S: 10, M: 11, L: 13 };

// ─── Config ───────────────────────────────────────────────────────────────────

const LEGEND_ITEMS: { key: string; color: string; label: string; border?: boolean }[] = [
    { key: "main", color: "#ffffff", label: "Principal" },
    { key: "folder", color: "#a5b4fc", label: "Domaine" },
    { key: "file", color: "#94a3b8", label: "Concept" },
    { key: "locked", color: "#4b5563", label: "Verrouillé", border: true },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const Legend: React.FC<{ textSize: TextSize }> = ({ textSize }) => {
    const fs = SIZE_MAP[textSize];

    return (
        <div style={{
            position: "absolute", bottom: 16, left: 16, zIndex: 10,
            background: "rgba(22,27,34,0.95)",
            border: "1px solid #21262d",
            borderRadius: 7,
            padding: "9px 12px",
        }}>
            {LEGEND_ITEMS.map(({ key, color, label, border }) => (
                <div key={key} style={{
                    display: "flex", alignItems: "center",
                    gap: 8, marginBottom: 5,
                }}>
                    <div style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: color, flexShrink: 0,
                        border: border ? "1px solid #6b7280" : "none",
                    }} />
                    <span style={{ color: "#6e7681", fontSize: fs - 1 }}>
                        {label}
                    </span>
                </div>
            ))}
        </div>
    );
};