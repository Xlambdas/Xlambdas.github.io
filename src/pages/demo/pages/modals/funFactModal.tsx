import React, { useState, useEffect } from "react";
import { type FunFact, FUN_FACTS } from "../../data/funFacts";
import { type NodeType, initialNodes } from "../../data/graphData";

interface FunFactModalProps {
    onClose: () => void;
    onNavigate: (node: NodeType) => void;
}

export const FunFactModal: React.FC<FunFactModalProps> = ({ onClose, onNavigate }) => {
    const [visible, setVisible] = useState(false);
    const [fact, setFact] = useState<FunFact | null>(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        // pick a random fact whose related node exists
        const available = FUN_FACTS.filter(f =>
            initialNodes.find(n => n.id === f.relatedNodeId)
        );
        const pick = available[Math.floor(Math.random() * available.length)];
        setFact(pick);
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 320);
    };

    const handleNavigate = () => {
        if (!fact) return;
        const node = initialNodes.find(n => n.id === fact.relatedNodeId);
        if (!node) return;
        handleClose();
        setTimeout(() => onNavigate(node), 320);
    };

    if (!fact) return null;

    return (
        <>
            <style>{`
                @keyframes factFadeIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: "absolute", inset: 0, zIndex: 45,
                    backdropFilter: visible ? "blur(5px)" : "none",
                    background: visible ? "rgba(0,0,0,0.5)" : "transparent",
                    transition: "all 0.32s ease",
                    pointerEvents: visible ? "auto" : "none",
                }}
            />

            {/* modal */}
            <div style={{
                position: "absolute", zIndex: 46,
                left: "50%", top: "50%",
                transform: visible
                    ? "translate(-50%, -50%)"
                    : "translate(-50%, -44%)",
                width: "min(480px, 90vw)",
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: 14,
                overflow: "hidden",
                opacity: visible ? 1 : 0,
                transition: "all 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            }}>
                {/* header */}
                <div style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #21262d",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 16 }}>💡</span>
                        <span style={{ color: "#c9d1d9", fontSize: 13, fontWeight: 500 }}>
                            Le saviez-vous ?
                        </span>
                    </div>
                    <button onClick={handleClose} style={{
                        background: "none", border: "none", color: "#484f58",
                        fontSize: 18, cursor: "pointer", lineHeight: 1, padding: 0,
                    }}>×</button>
                </div>

                {/* fact */}
                <div style={{ padding: "24px 24px 0" }}>
                    <p style={{
                        color: "#c9d1d9", fontSize: 14, lineHeight: 1.8,
                        margin: 0,
                    }}>
                        {fact.fact}
                    </p>
                </div>

                {/* source */}
                <div style={{ padding: "12px 24px 0" }}>
                    <span style={{
                        color: "#484f58", fontSize: 11,
                        fontStyle: "italic",
                    }}>
                        — {fact.source}
                    </span>
                </div>

                {/* reveal question */}
                {!revealed ? (
                    <div style={{ padding: "20px 24px 24px" }}>
                        <button
                            onClick={() => setRevealed(true)}
                            style={{
                                width: "100%", padding: "11px 0",
                                background: "rgba(124,106,247,0.12)",
                                border: "1px solid rgba(124,106,247,0.35)",
                                color: "#a39af7", borderRadius: 10,
                                fontSize: 13, cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {fact.question}
                        </button>
                    </div>
                ) : (
                    <div style={{
                        padding: "16px 24px 24px",
                        display: "flex", flexDirection: "column", gap: 10,
                        animation: "factFadeIn 0.3s ease",
                    }}>
                        <div style={{
                            background: "rgba(124,106,247,0.08)",
                            border: "1px solid rgba(124,106,247,0.2)",
                            borderRadius: 8, padding: "10px 14px",
                            color: "#8b949e", fontSize: 12, lineHeight: 1.6,
                        }}>
                            {(() => {
                                const node = initialNodes.find(n => n.id === fact.relatedNodeId);
                                return node
                                    ? `Ce concept est lié au nœud "${node.title}"`
                                    : null;
                            })()}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                onClick={handleClose}
                                style={{
                                    flex: 1, padding: "10px 0",
                                    background: "transparent",
                                    border: "1px solid #30363d",
                                    color: "#6e7681", borderRadius: 10,
                                    fontSize: 12, cursor: "pointer",
                                }}
                            >
                                Peut-être plus tard
                            </button>
                            <button
                                onClick={handleNavigate}
                                style={{
                                    flex: 2, padding: "10px 0",
                                    background: "rgba(124,106,247,0.15)",
                                    border: "1px solid rgba(124,106,247,0.4)",
                                    color: "#a39af7", borderRadius: 10,
                                    fontSize: 12, fontWeight: 500,
                                    cursor: "pointer",
                                }}
                            >
                                Explorer ce concept →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};