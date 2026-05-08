import { SIZE_MAP } from "./nodePanel";


interface SettingsPanelProps {
    onClose: () => void;
    textSize: "S" | "M" | "L";
    onTextSizeChange: (size: "S" | "M" | "L") => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, textSize, onTextSizeChange }) => {
    const fs = SIZE_MAP[textSize];

    return (
        <div style={{
            position: "absolute", top: 50, right: 16, width: 220,
            background: "#161b22", border: "1px solid #30363d",
            borderRadius: 8, padding: 16, zIndex: 20,
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ color: "#c9d1d9", fontSize: fs + 1, fontWeight: 500 }}>Settings</span>
                <button onClick={onClose} style={{
                    background: "none", border: "none", color: "#484f58",
                    cursor: "pointer", fontSize: fs + 5, lineHeight: 1, padding: 0,
                }}>×</button>
            </div>

            <div style={{ marginBottom: 14 }}>
                <span style={{ color: "#484f58", fontSize: fs, display: "block", marginBottom: 8 }}>Text size</span>
                <div style={{ display: "flex", gap: 6 }}>
                    {(["S", "M", "L"] as const).map(size => (
                        <button key={size} onClick={() => {
                            onTextSizeChange(size);
                            localStorage.setItem("graph_textSize", size);
                        }} style={{
                            flex: 1,
                            background: textSize === size ? "#30363d" : "#21262d",
                            border: `1px solid ${textSize === size ? "#8b949e" : "#30363d"}`,
                            color: textSize === size ? "#c9d1d9" : "#8b949e",
                            borderRadius: 5, padding: "4px 0", fontSize: fs, cursor: "pointer",
                        }}>{size}</button>
                    ))}
                </div>
            </div>

            <div>
                <span style={{ color: "#484f58", fontSize: fs, display: "block", marginBottom: 8 }}>Language</span>
                <div style={{ display: "flex", gap: 6 }}>
                    {(["EN", "FR"] as const).map(lang => (
                        <button key={lang} style={{
                            flex: 1, background: "#21262d", border: "1px solid #30363d",
                            color: "#8b949e", borderRadius: 5, padding: "4px 0",
                            fontSize: fs, cursor: "pointer",
                        }}>{lang}</button>
                    ))}
                </div>
            </div>
        </div>
    );
};