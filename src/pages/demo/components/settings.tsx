import { SIZE_MAP } from "../constants";
import type { SettingsPanelProps } from "../types";

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
    onClose,
    textSize,
    onTextSizeChange,
    // isTeacher,
    // onTeacherToggle,
    // teacherName
}) => {
    const fs = SIZE_MAP[textSize];

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 19,
                }}
            />

            {/* Panel */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "absolute",
                    top: 66,
                    right: 16,
                    width: 240,
                    background: "#161b22",
                    border: "1px solid #30363d",
                    borderRadius: 10,
                    padding: 16,
                    zIndex: 20,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ color: "#c9d1d9", fontSize: fs + 1, fontWeight: 600 }}>Paramètres</span>
                    <button onClick={onClose} style={{
                        background: "none", border: "none", color: "#484f58",
                        cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 0,
                    }}>×</button>
                </div>

                <div style={{ marginBottom: 14 }}>
                    <span style={{ color: "#8b949e", fontSize: fs - 1, display: "block", marginBottom: 8 }}>Taille du texte</span>
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
                                borderRadius: 6, padding: "6px 0", fontSize: fs, cursor: "pointer",
                                fontWeight: textSize === size ? 600 : 400,
                            }}>{size}</button>
                        ))}
                    </div>
                </div>

                {/* <div style={{ marginBottom: 14 }}>
                    <span style={{ color: "#8b949e", fontSize: fs - 1, display: "block", marginBottom: 8 }}>Langue</span>
                    <div style={{ display: "flex", gap: 6 }}>
                        {(["FR", "EN"] as const).map(lang => (
                            <button key={lang} style={{
                                flex: 1, background: lang === "FR" ? "#30363d" : "#21262d",
                                border: `1px solid ${lang === "FR" ? "#8b949e" : "#30363d"}`,
                                color: lang === "FR" ? "#c9d1d9" : "#8b949e",
                                borderRadius: 6, padding: "6px 0",
                                fontSize: fs, cursor: "pointer",
                                fontWeight: lang === "FR" ? 600 : 400,
                            }}>{lang}</button>
                        ))}
                    </div>
                </div> */}

                {/* <div style={{ paddingTop: 14, borderTop: "1px solid #21262d" }}>
                    <span style={{ color: "#8b949e", fontSize: fs - 1, display: "block", marginBottom: 8 }}>
                        Mode enseignant
                    </span>
                    {isTeacher ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{
                                background: "rgba(124,106,247,0.08)",
                                border: "1px solid rgba(124,106,247,0.2)",
                                borderRadius: 8, padding: "10px 12px",
                                color: "#a39af7", fontSize: fs - 1,
                            }}>
                                ✓ Connecté : {teacherName}
                            </div>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("teacher_mode");
                                    localStorage.removeItem("teacher_name");
                                    onTeacherToggle();
                                }}
                                style={{
                                    padding: "8px 0", background: "transparent",
                                    border: "1px solid #30363d", color: "#8b949e",
                                    borderRadius: 8, fontSize: fs - 1, cursor: "pointer",
                                }}
                            >
                                Se déconnecter
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onTeacherToggle}
                            style={{
                                width: "100%", padding: "8px 0",
                                background: "rgba(124,106,247,0.1)",
                                border: "1px solid rgba(124,106,247,0.3)",
                                color: "#a39af7", borderRadius: 8,
                                fontSize: fs - 1, cursor: "pointer",
                            }}
                        >
                            Accéder au mode enseignant
                        </button>
                    )}
                </div> */}
            </div>
        </>
    );
};