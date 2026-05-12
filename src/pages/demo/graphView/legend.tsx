import React from 'react';
import { LEGEND_ITEMS, SIZE_MAP } from '../constants/config';
import { type TextSize } from '../types/types';

// --- Component ---

export const Legend: React.FC<{ textSize: TextSize }> = ({ textSize }) => {
    const fs = SIZE_MAP[textSize];

    return (
        <div
            className="hidden sm:block"
            style={{
                position: "absolute", bottom: 16, left: 16, zIndex: 10,
                background: "rgba(22,27,34,0.95)",
                border: "1px solid #21262d",
                borderRadius: 7,
                padding: "9px 12px",
            }}
        >
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