const TYPE_CONFIG: Record<string, { color: string; label: string }> = {
    main: { color: "#ffffff", label: "Main" },
    folder: { color: "#a5b4fc", label: "Folder" },
    file: { color: "#94a3b8", label: "File" },
    locked: { color: "#4b5563", label: "Locked" },
};

export const Legend: React.FC = () => (
    <div style={{
        position: "absolute", bottom: 16, left: 16,
        background: "rgba(22,27,34,0.95)", border: "1px solid #21262d",
        borderRadius: 7, padding: "9px 12px", zIndex: 10,
    }}>
        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: cfg.color,
                    border: key === "locked" ? "1px solid #6b7280" : "none",
                    flexShrink: 0,
                }} />
                <span style={{ color: "#6e7681", fontSize: 10 }}>{cfg.label}</span>
            </div>
        ))}
    </div>
);