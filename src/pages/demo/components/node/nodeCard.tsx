import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNodeCompletionPercent } from "../../data/graphData";
import { NodePathSettings } from "./NodePathSettings";
import type { NodeCardProps } from "../../types";
import { KIND_COLOR, KIND_ICON, KIND_LABEL, HEX_CLIP } from "../../constants";
import { getStats } from "../../helpers";

export const NodeCard: React.FC<NodeCardProps> = ({
    node, onClose, onOpenProfile, onOpenStrengthen,
}) => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [, setCompleted] = useState<string[]>([]);
    const [showNodeSettings, setShowNodeSettings] = useState(false);


    useEffect(() => {
        setCompleted(JSON.parse(localStorage.getItem("completed_nodes") ?? "[]"));
        setShowNodeSettings(false);
    }, [node]);

    useEffect(() => {
        if (node) {
            setVisible(false);
            requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        } else {
            setVisible(false);
        }
    }, [node]);

    if (!node && !visible) return null;

    // --- Derived ---
    const kind = (node as any)?.kind ?? "concept";
    const color = KIND_COLOR[kind] ?? "#94a3b8";
    const icon = KIND_ICON[kind] ?? "📄";
    const isLocked = !node?.isUnlocked;
    // const alreadyDone = completed.includes(node?.id ?? "");
    const stats = node ? getStats(node) : [];

    const isProfile = kind === "profile";
    // const hasPath = !isProfile && (node?.lessonPath?.length ?? 0) > 0;

    const pct = node ? getNodeCompletionPercent(node.id) : 0;
    const isStarted = pct > 0 && pct < 100;
    const isFinished = pct === 100;

    // --- Handlers ---
    const handleBackdrop = () => {
        setVisible(false);
        setTimeout(onClose, 320);
    };

    const handleStart = () => {
        if (!node) return;
        if (isProfile) { onOpenProfile(); return; }
        if (!isLocked) navigate(`/demo/node/${node.id}`);
    };

    // const handleSubgraph = () => {
    //     if (!node) return;
    //     // focus graph on this node — subgraph view TBD
    //     window.__graphFocus?.(node.id);
    //     handleBackdrop();
    // };

    const ctaLabel = isProfile ? "Voir mon profil →"
        : isLocked ? "🔒 Verrouillé"
            : isStarted ? "Continuer →"
                : isFinished ? "↩ Revoir"
                    : "Commencer →";

    // --- Render ---
    return (
        <>
            <style>{`
                @keyframes cardSlideUp {
                    from { opacity: 0; transform: translateX(-50%) translateY(24px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>

            {/* backdrop */}
            <div
                onClick={handleBackdrop}
                style={{
                    position: "absolute", inset: 0, zIndex: 30,
                    backdropFilter: visible ? "blur(5px)" : "none",
                    background: visible ? "rgba(0,0,0,0.4)" : "transparent",
                    transition: "all 0.32s ease",
                    pointerEvents: visible ? "auto" : "none",
                }}
            />

            {/* card */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    position: "absolute", zIndex: 40,
                    bottom: 32, left: "50%",
                    transform: "translateX(-50%)",
                    width: "min(440px, calc(100vw - 32px))",
                    background: "#161b22",
                    border: "1px solid #30363d",
                    borderRadius: 16,
                    overflow: "visible",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
                    opacity: visible ? 1 : 0,
                    animation: visible ? "cardSlideUp 0.32s cubic-bezier(0.32,0.72,0,1) both" : "none",
                }}
            >
                {/* --- Hexagon icon (protruding from top) --- */}
                <div style={{
                    position: "absolute", top: -28, left: "50%",
                    transform: "translateX(-50%)",
                    width: 56, height: 56,
                    clipPath: HEX_CLIP,
                    background: isLocked ? "#4b5563" : color,
                    boxShadow: isLocked ? "none" : `0 0 24px ${color}66`,
                    display: "flex", alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    zIndex: 2,
                }}>
                    {isLocked ? "🔒" : icon}
                </div>

                <button
                    onClick={() => setShowNodeSettings(true)}
                    style={{
                        position: "absolute", top: 12, right: 12,
                        width: 28, height: 28,
                        background: "#21262d",
                        border: "1px solid #30363d",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#6e7681",
                        zIndex: 3,
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                </button>

                <button
                    onClick={handleBackdrop}
                    style={{
                        position: "absolute", top: 12, left: 12,
                        background: "none", border: "none",
                        color: "#484f58", fontSize: 18,
                        cursor: "pointer", lineHeight: 1, padding: 4,
                        zIndex: 3,
                    }}
                >×</button>

                {/* --- Card body --- */}
                <div style={{
                    padding: "44px 20px 20px",
                    display: "flex", flexDirection: "column", gap: 16,
                }}>
                    {/* kind label + title */}
                    <div style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center", gap: 4, textAlign: "center",
                    }}>
                        <span style={{
                            color, fontSize: 10, fontWeight: 600,
                            textTransform: "uppercase", letterSpacing: "0.1em",
                        }}>
                            {KIND_LABEL[kind]}
                        </span>
                        <h2 style={{
                            color: "#c9d1d9", fontSize: 20,
                            fontWeight: 700, margin: 0, lineHeight: 1.2,
                        }}>
                            {node?.title}
                        </h2>
                        {node?.shortDescription && (
                            <p style={{
                                color: "#6e7681", fontSize: 12,
                                margin: 0, lineHeight: 1.5,
                                fontStyle: "italic",
                            }}>
                                {node.shortDescription}
                            </p>
                        )}
                    </div>

                    {/* stats box */}
                    {stats.length > 0 && (
                        <div style={{
                            background: "#0d1117",
                            border: "1px solid #21262d",
                            borderRadius: 12,
                            display: "flex",
                            overflow: "hidden",
                        }}>
                            {stats.map(({ label, value }, i) => (
                                <div key={label} style={{
                                    flex: 1,
                                    padding: "12px 8px",
                                    textAlign: "center",
                                    borderRight: i < stats.length - 1
                                        ? "1px solid #21262d" : "none",
                                }}>
                                    <div style={{
                                        color: "#c9d1d9",
                                        fontSize: 16, fontWeight: 700,
                                    }}>
                                        {value}
                                    </div>
                                    <div style={{
                                        color: "#484f58",
                                        fontSize: 9, marginTop: 3,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.06em",
                                    }}>
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* hook (if available) */}
                    {node?.hook && !isProfile && (
                        <div style={{
                            background: `${color}0a`,
                            border: `1px solid ${color}22`,
                            borderLeft: `3px solid ${color}`,
                            borderRadius: 8,
                            padding: "10px 12px",
                            color: "#6e7681",
                            fontSize: 12, lineHeight: 1.6,
                            fontStyle: "italic",
                        }}>
                            {node.hook}
                        </div>
                    )}

                    {/* locked message */}
                    {isLocked && !isProfile && (
                        <div style={{
                            background: "rgba(75,85,99,0.15)",
                            border: "1px solid #374151",
                            borderRadius: 8, padding: "10px 12px",
                            color: "#6b7280", fontSize: 12, textAlign: "center",
                        }}>
                            Complète les prérequis pour débloquer ce nœud.
                        </div>
                    )}

                    {/* CTAs */}
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>

                        {/* strengthen button — always visible for non-profile unlocked nodes */}
                        {!isProfile && !isLocked && (
                            <button
                                onClick={() => onOpenStrengthen(node!.id)}
                                style={{
                                    flex: isFinished ? 1 : "none",
                                    padding: "11px 14px",
                                    background: "#21262d",
                                    border: "1px solid #30363d",
                                    borderRadius: 10,
                                    color: "#8b949e",
                                    fontSize: 11, cursor: "pointer",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", gap: 5,
                                    transition: "all 0.15s ease",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                S'entraîner
                            </button>
                        )}

                        {/* primary CTA — hidden when node is finished */}
                        {true && ( // not isFinished && ( --> if not showing when path finished
                            <button
                                onClick={handleStart}
                                disabled={isLocked && !isProfile}
                                style={{
                                    flex: 1,
                                    padding: "11px 10px",
                                    background: isLocked && !isProfile
                                        ? "#21262d"
                                        : `${color}22`,
                                    border: `1px solid ${isLocked && !isProfile
                                        ? "#30363d" : `${color}55`}`,
                                    borderRadius: 10,
                                    color: isLocked && !isProfile ? "#484f58" : color,
                                    fontSize: 12, fontWeight: 600,
                                    cursor: isLocked && !isProfile ? "not-allowed" : "pointer",
                                    transition: "all 0.15s ease",
                                }}
                            >
                                {ctaLabel}
                            </button>
                        )}
                    </div>
                </div>
                {showNodeSettings && node && (
                    <NodePathSettings
                        node={node}
                        onClose={() => setShowNodeSettings(false)}
                    />
                )}
            </div>
        </>
    );
};