import React, { useState } from "react";
import { TEACHER_PASSWORD } from "../../data/teacherNotes";

interface TeacherLoginModalProps {
    onSuccess: (name: string) => void;
    onClose: () => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({ onSuccess, onClose }) => {
    const [visible, setVisible] = useState(true);
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        if (name.trim().length === 0) {
            setError("Veuillez entrer votre nom.");
            return;
        }
        if (password !== TEACHER_PASSWORD) {
            setError("Mot de passe incorrect.");
            return;
        }
        localStorage.setItem("teacher_name", name.trim());
        localStorage.setItem("teacher_mode", "true");
        onSuccess(name.trim());
    };

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <>
            <div
                onClick={handleClose}
                style={{
                    position: "fixed", inset: 0, zIndex: 99,
                    backdropFilter: "blur(4px)",
                    background: "rgba(0,0,0,0.5)",
                }}
            />
            <div style={{
                position: "fixed", zIndex: 100,
                left: "50%", top: "50%",
                transform: "translate(-50%, -50%)",
                width: "min(380px, 92vw)",
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: 14, overflow: "hidden",
                boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.3s ease",
            }}>
                <div style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #21262d",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <span style={{ color: "#c9d1d9", fontSize: 13, fontWeight: 500 }}>
                        Mode enseignant
                    </span>
                    <button onClick={handleClose} style={{
                        background: "none", border: "none", color: "#484f58",
                        fontSize: 18, cursor: "pointer", padding: 0,
                    }}>×</button>
                </div>

                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ color: "#6e7681", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                        Ce mode permet d'annoter les nœuds avec des notes visibles par tous les étudiants.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ color: "#484f58", fontSize: 11 }}>Votre nom</label>
                        <input
                            autoFocus
                            value={name}
                            onChange={e => { setName(e.target.value); setError(""); }}
                            placeholder="Prof. Dupont"
                            style={{
                                background: "#0d1117", border: "1px solid #30363d",
                                borderRadius: 7, padding: "9px 12px",
                                color: "#c9d1d9", fontSize: 12, outline: "none",
                                fontFamily: "inherit",
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ color: "#484f58", fontSize: 11 }}>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => { setPassword(e.target.value); setError(""); }}
                            onKeyDown={e => e.key === "Enter" && handleLogin()}
                            placeholder="••••••••"
                            style={{
                                background: "#0d1117", border: "1px solid #30363d",
                                borderRadius: 7, padding: "9px 12px",
                                color: "#c9d1d9", fontSize: 12, outline: "none",
                                fontFamily: "inherit",
                            }}
                        />
                    </div>

                    {error && (
                        <span style={{ color: "#ef4444", fontSize: 11 }}>{error}</span>
                    )}

                    <button
                        onClick={handleLogin}
                        style={{
                            padding: "10px 0", marginTop: 4,
                            background: "rgba(124,106,247,0.15)",
                            border: "1px solid rgba(124,106,247,0.4)",
                            color: "#a39af7", borderRadius: 8,
                            fontSize: 13, fontWeight: 500, cursor: "pointer",
                        }}
                    >
                        Accéder au mode enseignant
                    </button>
                </div>
            </div>
        </>
    );
};