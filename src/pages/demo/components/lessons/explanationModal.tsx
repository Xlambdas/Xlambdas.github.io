import React, { useState, useEffect } from "react";

// ─── Explanation Modal ────────────────────────────────────────────────────────

interface ExplanationModalProps {
    explanation: string;
    onClose: () => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
    explanation,
    onClose,
}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 250);
    };

    return (
        <>
            <style>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* Backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 100,
                    background: visible ? "rgba(0,0,0,0.6)" : "transparent",
                    backdropFilter: visible ? "blur(4px)" : "none",
                    transition: "all 0.25s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                }}
            >
                {/* Modal */}
                <div
                    onClick={e => e.stopPropagation()}
                    style={{
                        width: "min(500px, 100%)",
                        maxHeight: "80vh",
                        background: "#161b22",
                        border: "1px solid #30363d",
                        borderRadius: 14,
                        overflow: "hidden",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                        animation: visible ? "modalFadeIn 0.3s ease both" : "none",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 20px",
                        borderBottom: "1px solid #21262d",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 18 }}>💡</span>
                            <span style={{
                                color: "#c9d1d9",
                                fontSize: 14,
                                fontWeight: 600,
                            }}>
                                Explication détaillée
                            </span>
                        </div>
                        <button
                            onClick={handleClose}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#484f58",
                                fontSize: 20,
                                cursor: "pointer",
                                padding: 4,
                                lineHeight: 1,
                            }}
                        >
                            ×
                        </button>
                    </div>

                    {/* Content */}
                    <div style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "20px 24px",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#21262d transparent",
                    }}>
                        <p style={{
                            color: "#c9d1d9",
                            fontSize: 14,
                            lineHeight: 1.8,
                            margin: 0,
                            whiteSpace: "pre-wrap",
                        }}>
                            {explanation}
                        </p>
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: "16px 20px",
                        borderTop: "1px solid #21262d",
                    }}>
                        <button
                            onClick={handleClose}
                            style={{
                                width: "100%",
                                padding: "12px 0",
                                background: "rgba(165,180,252,0.12)",
                                border: "1px solid rgba(165,180,252,0.3)",
                                color: "#a5b4fc",
                                borderRadius: 8,
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                            }}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};