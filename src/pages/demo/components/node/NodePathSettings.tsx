import React, { useState } from "react";
import { type NodeType, getNodeCompletionPercent } from "../../data/graphData";
import { getAllCards, saveCards } from "../../helpers/srEngine";

interface NodePathSettingsProps {
    node: NodeType;
    onClose: () => void;
}

type ConfirmState = "idle" | "confirming" | "done";

export const NodePathSettings: React.FC<NodePathSettingsProps> = ({ node, onClose }) => {
    const [confirmReset, setConfirmReset] = useState<ConfirmState>("idle");
    const pct = getNodeCompletionPercent(node.id);

    const handleResetPath = () => {
        if (confirmReset !== "confirming") {
            setConfirmReset("confirming");
            return;
        }

        // remove completed lessons for this node
        const lessons: string[] = JSON.parse(localStorage.getItem("completed_lessons") ?? "[]");
        localStorage.setItem(
            "completed_lessons",
            JSON.stringify(lessons.filter(l => !l.startsWith(`${node.id}::`)))
        );

        // remove node from completed nodes
        const nodes: string[] = JSON.parse(localStorage.getItem("completed_nodes") ?? "[]");
        localStorage.setItem(
            "completed_nodes",
            JSON.stringify(nodes.filter(id => id !== node.id))
        );

        // remove SR cards for this node
        const cards = getAllCards().filter(c => c.nodeId !== node.id);
        saveCards(cards);

        // remove badge for this node
        const badges = JSON.parse(localStorage.getItem("earned_badges") ?? "[]");
        localStorage.setItem(
            "earned_badges",
            JSON.stringify(badges.filter((b: any) => b.nodeId !== node.id))
        );

        setConfirmReset("done");
    };

    return (
        <div style={{
            position: "absolute", inset: 0, zIndex: 5,
            background: "#161b22",
            borderRadius: 16,
            padding: "20px",
            display: "flex", flexDirection: "column", gap: 16,
            animation: "settingsSlideIn 0.22s ease both",
        }}>
            <style>{`
                @keyframes settingsSlideIn {
                    from { opacity: 0; transform: translateX(12px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>

            {/* header */}
            <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
            }}>
                <span style={{ color: "#c9d1d9", fontSize: 13, fontWeight: 600 }}>
                    Paramètres — {node.title}
                </span>
                <button
                    onClick={onClose}
                    style={{
                        background: "none", border: "none",
                        color: "#484f58", fontSize: 18,
                        cursor: "pointer", padding: 0, lineHeight: 1,
                    }}
                >×</button>
            </div>

            {/* current progress info */}
            <div style={{
                background: "#0d1117",
                border: "1px solid #21262d",
                borderRadius: 10, padding: "12px 14px",
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
            }}>
                <span style={{ color: "#484f58", fontSize: 12 }}>Progression actuelle</span>
                <span style={{ color: "#c9d1d9", fontSize: 13, fontWeight: 600 }}>
                    {pct}%
                </span>
            </div>

            {/* reset section */}
            <div style={{
                display: "flex", flexDirection: "column", gap: 8,
            }}>
                <span style={{
                    color: "#484f58", fontSize: 10,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                    Réinitialisation
                </span>

                {confirmReset === "done" ? (
                    <div style={{
                        background: "rgba(34,197,94,0.08)",
                        border: "1px solid rgba(34,197,94,0.3)",
                        borderRadius: 8, padding: "10px 14px",
                        color: "#22c55e", fontSize: 12, textAlign: "center",
                    }}>
                        ✓ Parcours réinitialisé avec succès.
                    </div>
                ) : confirmReset === "confirming" ? (
                    <div style={{
                        display: "flex", flexDirection: "column", gap: 8,
                    }}>
                        <div style={{
                            background: "rgba(239,68,68,0.08)",
                            border: "1px solid rgba(239,68,68,0.25)",
                            borderRadius: 8, padding: "10px 14px",
                            color: "#ef4444", fontSize: 12, lineHeight: 1.6,
                        }}>
                            Toute ta progression, tes révisions SR et ton badge pour ce nœud seront supprimés. Cette action est irréversible.
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                onClick={() => setConfirmReset("idle")}
                                style={{
                                    flex: 1, padding: "10px 0",
                                    background: "#21262d",
                                    border: "1px solid #30363d",
                                    color: "#8b949e", borderRadius: 8,
                                    fontSize: 12, cursor: "pointer",
                                }}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleResetPath}
                                style={{
                                    flex: 1, padding: "10px 0",
                                    background: "rgba(239,68,68,0.12)",
                                    border: "1px solid rgba(239,68,68,0.4)",
                                    color: "#ef4444", borderRadius: 8,
                                    fontSize: 12, fontWeight: 500,
                                    cursor: "pointer",
                                }}
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleResetPath}
                        style={{
                            padding: "11px 0",
                            background: "#21262d",
                            border: "1px solid #30363d",
                            borderRadius: 8,
                            color: "#8b949e", fontSize: 12,
                            cursor: "pointer",
                            display: "flex", alignItems: "center",
                            justifyContent: "center", gap: 6,
                        }}
                    >
                        🔄 Réinitialiser ce parcours
                    </button>
                )}
            </div>
        </div>
    );
};