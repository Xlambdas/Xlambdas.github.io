import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDynamicNodes, getNodeCompletionPercent, getVisibleIds } from "../../data/graphData";
import { NodePathSettings } from "./NodePathSettings";
import type { NodeCardProps } from "../../types";
import { KIND_LABEL, HEX_CLIP, getNodeIcon } from "../../constants";
import { getStats } from "../../helpers";
import { SettingsIcon, CloseIcon, LockIcon } from "../../constants/icons/icons";

export const NodeCard: React.FC<NodeCardProps> = ({
    node, onClose, onOpenStrengthen,
}) => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [, setCompleted] = useState<string[]>([]);
    const [showNodeSettings, setShowNodeSettings] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Recalculate pct whenever node or refreshKey changes
    const pct = node ? getNodeCompletionPercent(node.id) : 0;

    useEffect(() => {
        setCompleted(JSON.parse(localStorage.getItem("completed_nodes") ?? "[]"));
        setShowNodeSettings(false);
        setRefreshKey(prev => prev + 1); // Force recalculation
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
    const color = (node as any)?.branchColor ?? "#94a3b8";
    const IconComponent = getNodeIcon(kind);

    // Recalculate stats when refreshKey changes (forces fresh calculation)
    const stats = node ? getStats(node) : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        // Trigger re-render when localStorage changes
    }, [refreshKey]);

    // Recalculate if node is locked (don't trust node.isUnlocked from other sources)
    const visibleIds = getVisibleIds(getDynamicNodes());
    const isLocked = node ? !visibleIds.has(node.id) : true;

    // const pct = node ? getNodeCompletionPercent(node.id) : 0;
    const isStarted = pct > 0 && pct < 100;
    const isFinished = pct === 100;

    // --- Handlers ---
    const handleBackdrop = () => {
        setVisible(false);
        setTimeout(onClose, 320);
    };

    const handleStart = () => {
        if (!node) return;
        if (!isLocked) navigate(`/demo/node/${node.id}`);
    };

    const ctaLabel = isLocked ? "Verrouillé"
            : isStarted ? "Continuer"
                : isFinished ? "Revoir"
                    : "Commencer";

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
                    background: "linear-gradient(135deg, #161b22 0%, #0d1117 100%)",
                    border: "1px solid #30363d",
                    borderRadius: 16,
                    overflow: "visible",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
                    opacity: visible ? 1 : 0,
                    animation: visible ? "cardSlideUp 0.32s cubic-bezier(0.32,0.72,0,1) both" : "none",
                }}
            >
                {/* Glow effect behind hexagon */}
                {!isLocked && (
                    <div style={{
                        position: "absolute",
                        top: -40,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 80,
                        height: 80,
                        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                        borderRadius: "50%",
                        pointerEvents: "none",
                    }} />
                )}

                {/* --- Hexagon icon --- */}
                <div style={{
                    position: "absolute", top: -28, left: "50%",
                    transform: "translateX(-50%)",
                    width: 56, height: 56,
                    clipPath: HEX_CLIP,
                    background: isLocked
                        ? "linear-gradient(135deg, #4b5563 0%, #374151 100%)"
                        : `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                    boxShadow: isLocked
                        ? "0 4px 12px rgba(0,0,0,0.3)"
                        : `0 4px 20px ${color}66, 0 0 40px ${color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                    border: isLocked ? "none" : `1px solid ${color}aa`,
                }}>
                    {isLocked ? (
                        <LockIcon size={24} color="#ffffff" />
                    ) : (
                        <IconComponent size={24} color="#ffffff" />
                    )}
                </div>

                <button
                    onClick={() => setShowNodeSettings(true)}
                    style={{
                        position: "absolute", top: 16, right: 16,
                        width: 32, height: 32,
                        background: "#21262d",
                        border: "1px solid #30363d",
                        borderRadius: 8,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#6e7681",
                        zIndex: 3,
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#30363d";
                        e.currentTarget.style.borderColor = "#8b949e";
                        e.currentTarget.style.color = "#c9d1d9";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#21262d";
                        e.currentTarget.style.borderColor = "#30363d";
                        e.currentTarget.style.color = "#6e7681";
                    }}
                >
                    <SettingsIcon size={18} color="#6e7681" />
                </button>

                <button
                    onClick={handleBackdrop}
                    style={{
                        position: "absolute", top: 16, left: 16,
                        width: 32, height: 32,
                        background: "#21262d",
                        border: "1px solid #30363d",
                        borderRadius: 8,
                        color: "#6e7681",
                        fontSize: 20,
                        cursor: "pointer",
                        lineHeight: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 3,
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#30363d";
                        e.currentTarget.style.borderColor = "#8b949e";
                        e.currentTarget.style.color = "#c9d1d9";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#21262d";
                        e.currentTarget.style.borderColor = "#30363d";
                        e.currentTarget.style.color = "#6e7681";
                    }}
                >
                    <CloseIcon size={20} color="#6e7681" />
                </button>

                {/* --- Card body --- */}
                <div style={{
                    padding: "48px 24px 24px",
                    display: "flex", flexDirection: "column", gap: 20,
                }}>
                    {/* kind label + title */}
                    <div style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center", gap: 6, textAlign: "center",
                    }}>
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 12px",
                            background: `${color}15`,
                            border: `1px solid ${color}33`,
                            borderRadius: 20,
                        }}>
                            <div style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: color,
                                boxShadow: `0 0 8px ${color}88`,
                            }} />
                            <span style={{
                                color: color,
                                fontSize: 10,
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                            }}>
                                {KIND_LABEL[kind]}
                            </span>
                        </div>

                        <h2 style={{
                            color: "#c9d1d9", fontSize: 22,
                            fontWeight: 700, margin: 0, lineHeight: 1.2,
                        }}>
                            {node?.title}
                        </h2>
                        {node?.shortDescription && (
                            <p style={{
                                color: "#8b949e", fontSize: 13,
                                margin: 0, lineHeight: 1.6,
                                fontStyle: "italic",
                            }}>
                                {node.shortDescription}
                            </p>
                        )}
                    </div>

                    {/* stats box */}
                    {stats.length > 0 && (
                        <div style={{
                            background: "linear-gradient(135deg, #0d1117 0%, #000000 100%)",
                            border: "1px solid #21262d",
                            borderRadius: 12,
                            display: "flex",
                            overflow: "hidden",
                        }}>
                            {stats.map(({ label, value }, i) => (
                                <div key={label} style={{
                                    flex: 1,
                                    padding: "14px 8px",
                                    textAlign: "center",
                                    borderRight: i < stats.length - 1
                                        ? "1px solid #21262d" : "none",
                                }}>
                                    <div style={{
                                        color: "#e6edf3",
                                        fontSize: 18, fontWeight: 700,
                                        marginBottom: 4,
                                    }}>
                                        {value}
                                    </div>
                                    <div style={{
                                        color: "#6e7681",
                                        fontSize: 9,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.08em",
                                        fontWeight: 600,
                                    }}>
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* hook (if available) */}
                    {node?.hook && (
                        <div style={{
                            background: `linear-gradient(135deg, ${color}08 0%, ${color}04 100%)`,
                            border: `1px solid ${color}22`,
                            borderLeft: `3px solid ${color}`,
                            borderRadius: 10,
                            padding: "12px 14px",
                            color: "#8b949e",
                            fontSize: 12.5, lineHeight: 1.7,
                            fontStyle: "italic",
                        }}>
                            {node.hook}
                        </div>
                    )}

                    {/* locked message */}
                    {isLocked && (
                        <div style={{
                            background: "rgba(75,85,99,0.1)",
                            border: "1px solid #374151",
                            borderRadius: 10,
                            padding: "12px 14px",
                            color: "#9ca3af",
                            fontSize: 12.5,
                            textAlign: "center",
                            lineHeight: 1.6,
                        }}>
                            Complète les prérequis pour débloquer ce nœud.
                        </div>
                    )}

                    {/* CTAs */}
                    <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                        {/* strengthen button */}
                        {(isStarted || isFinished) && !isLocked  && (
                            <button
                                onClick={() => onOpenStrengthen(node!.id)}
                                style={{
                                    flex: isFinished ? 1 : "none",
                                    padding: "12px 16px",
                                    background: "#21262d",
                                    border: "1px solid #30363d",
                                    borderRadius: 10,
                                    color: "#8b949e",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                    transition: "all 0.2s ease",
                                    whiteSpace: "nowrap",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#30363d";
                                    e.currentTarget.style.borderColor = color;
                                    e.currentTarget.style.color = color;
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "#21262d";
                                    e.currentTarget.style.borderColor = "#30363d";
                                    e.currentTarget.style.color = "#8b949e";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                S'entraîner
                            </button>
                        )}

                        {/* primary CTA */}
                        {true && (
                            <button
                                onClick={handleStart}
                                disabled={isLocked}
                                style={{
                                    flex: 1,
                                    padding: "12px 16px",
                                    background: isLocked
                                        ? "#21262d"
                                        : `linear-gradient(135deg, ${color}22 0%, ${color}18 100%)`,
                                    border: `1px solid ${isLocked
                                        ? "#30363d" : `${color}55`}`,
                                    borderRadius: 10,
                                    color: isLocked ? "#484f58" : color,
                                    fontSize: 13,
                                    fontWeight: 700,
                                    cursor: isLocked ? "not-allowed" : "pointer",
                                    transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isLocked) {
                                        e.currentTarget.style.background = `linear-gradient(135deg, ${color}33 0%, ${color}22 100%)`;
                                        e.currentTarget.style.borderColor = `${color}88`;
                                        e.currentTarget.style.transform = "translateY(-1px)";
                                        e.currentTarget.style.boxShadow = `0 4px 16px ${color}33`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isLocked) {
                                        e.currentTarget.style.background = `linear-gradient(135deg, ${color}22 0%, ${color}18 100%)`;
                                        e.currentTarget.style.borderColor = `${color}55`;
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }
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
                        mode="card"
                        onClose={() => {
                            setShowNodeSettings(false);
                            // Trigger refresh after settings close
                            setTimeout(() => setRefreshKey(prev => prev + 1), 100);
                        }}
                    />
                )}
            </div>
        </>
    );
};