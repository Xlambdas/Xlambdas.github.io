import React, { useEffect, useState } from "react";
import { type NodeType } from "../data/graphData";
import { useNavigate } from "react-router-dom";

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_COLOR: Record<NodeType["type"], string> = {
    main: "#ffffff",
    folder: "#a5b4fc",
    file: "#94a3b8",
};

type Phase = "hidden" | "peek" | "full";

// ─── Props ────────────────────────────────────────────────────────────────────

interface NodePreviewPanelProps {
    node: NodeType | null;
    onClose: () => void;
    onOpenPath: (node: NodeType) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NodePreviewPanel: React.FC<NodePreviewPanelProps> = ({
    node, onClose,
}) => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState<Phase>("hidden");
    const [completed, setCompleted] = useState<string[]>([]);

    // re-read completed nodes whenever the target node changes
    useEffect(() => {
        setCompleted(JSON.parse(localStorage.getItem("completed_nodes") ?? "[]"));
    }, [node]);

    // animate in / out
    useEffect(() => {
        if (node) {
            setPhase("hidden");
            requestAnimationFrame(() => requestAnimationFrame(() => setPhase("peek")));
        } else {
            setPhase("hidden");
        }
    }, [node]);

    if (!node && phase === "hidden") return null;

    // ── Derived state ─────────────────────────────────────────────────────────
    const color = TYPE_COLOR[node?.type ?? "file"];
    const isLocked = !node?.isUnlocked;
    const isFull = phase === "full";
    const isVisible = phase !== "hidden";
    const estimatedMinutes = node?.lessonPath?.reduce((s, l) => s + l.estimatedMinutes, 0) ?? 0;
    const alreadyDone = completed.includes(node?.id ?? "");
    const canStart = !isLocked;

    // ── Handlers ──────────────────────────────────────────────────────────────
    const animateClose = (callback: () => void) => {
        setPhase("hidden");
        setTimeout(callback, 380);
    };

    const handleBackdrop = () => animateClose(onClose);

    const handleCard = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (phase === "peek") setPhase("full");
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (phase === "full") setPhase("peek");
        else animateClose(onClose);
    };

    const handleStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (node && canStart) navigate(`/demo/node/${node.id}`);
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <>
            <style>{`
                @media (max-width: 640px) {
                    .preview-card { width: 100% !important; }
                }
            `}</style>

            {/* backdrop */}
            <div
                onClick={handleBackdrop}
                style={{
                    position: "absolute", inset: 0, zIndex: 30,
                    backdropFilter: isVisible ? "blur(6px)" : "none",
                    background: isVisible ? "rgba(0,0,0,0.45)" : "transparent",
                    transition: "backdrop-filter 0.35s ease, background 0.35s ease",
                    pointerEvents: isVisible ? "auto" : "none",
                }}
            />

            {/* card */}
            <div
                className="preview-card"
                onClick={handleCard}
                style={{
                    position: "absolute", zIndex: 40,
                    left: isFull ? 0 : "50%",
                    bottom: 0,
                    transform: isFull
                        ? "none"
                        : isVisible
                            ? "translateX(-50%)"
                            : "translateX(-50%) translateY(110%)",
                    width: isFull ? "100%" : "75vw",
                    height: isFull ? "100%" : "50vh",
                    background: "#161b22",
                    border: isFull ? "none" : "1px solid #30363d",
                    borderRadius: isFull ? 0 : "16px 16px 0 0",
                    boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
                    cursor: isFull ? "default" : "pointer",
                    transition: "all 0.38s cubic-bezier(0.32, 0.72, 0, 1)",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    overflow: "hidden",
                }}
            >
                {/* node circle */}
                <div style={{
                    width: isFull ? 72 : 56,
                    height: isFull ? 72 : 56,
                    borderRadius: "50%",
                    background: isLocked ? "#4b5563" : color,
                    boxShadow: isLocked ? "none" : `0 0 24px ${color}88`,
                    marginTop: isFull ? 48 : -28,
                    marginBottom: 16,
                    flexShrink: 0,
                    border: "3px solid #161b22",
                    transition: "all 0.38s ease",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                }}>
                    {isLocked ? "🔒" : ""}
                </div>

                {/* title */}
                <span style={{
                    color: "#c9d1d9", fontWeight: 600,
                    fontSize: isFull ? 22 : 16,
                    marginBottom: 4,
                    padding: "0 24px", textAlign: "center",
                    transition: "font-size 0.3s ease",
                }}>
                    {node?.title}
                </span>

                {/* short description */}
                {node?.shortDescription && (
                    <span style={{
                        color: "#6e7681",
                        fontSize: isFull ? 13 : 11,
                        padding: "0 28px",
                        textAlign: "center",
                        marginBottom: 8,
                        fontStyle: "italic",
                        lineHeight: 1.5,
                    }}>
                        {node.shortDescription}
                    </span>
                )}

                {/* time + lesson count */}
                {estimatedMinutes > 0 && !isLocked && (
                    <div style={{
                        background: "#21262d", border: "1px solid #30363d",
                        borderRadius: 20, padding: "2px 10px",
                        color: "#484f58", fontSize: 10,
                        marginBottom: isFull ? 24 : 8,
                    }}>
                        ⏱ ~{estimatedMinutes} min · {node?.lessonPath?.length ?? 0} leçons
                    </div>
                )}

                {/* hook (full only) */}
                {isFull && node?.hook && (
                    <div style={{
                        width: "100%", padding: "0 28px",
                        boxSizing: "border-box", marginBottom: 24,
                    }}>
                        <div style={{
                            background: "#0d1117",
                            border: "1px solid #21262d",
                            borderLeft: `3px solid ${color}`,
                            borderRadius: 8,
                            padding: "14px 16px",
                            color: "#8b949e",
                            fontSize: 13, lineHeight: 1.7,
                            fontStyle: "italic",
                        }}>
                            {node.hook}
                        </div>
                    </div>
                )}

                {/* locked message (full only) */}
                {isFull && isLocked && (
                    <div style={{
                        width: "100%", padding: "0 28px",
                        boxSizing: "border-box", marginBottom: 16,
                    }}>
                        <div style={{
                            background: "rgba(75,85,99,0.2)",
                            border: "1px solid #374151",
                            borderRadius: 8, padding: "10px 14px",
                            color: "#6b7280", fontSize: 12,
                        }}>
                            Ce concept sera disponible après avoir complété les prérequis.
                        </div>
                    </div>
                )}

                <div style={{ flex: 1 }} />

                {/* CTA (full only) */}
                {isFull && (
                    <div style={{
                        padding: "16px 28px", width: "100%",
                        boxSizing: "border-box",
                    }}>
                        <button
                            onClick={handleStart}
                            disabled={!canStart}
                            style={{
                                width: "100%", padding: "13px 0",
                                background: canStart ? `${color}22` : "#21262d",
                                border: `1px solid ${canStart ? `${color}66` : "#30363d"}`,
                                color: canStart ? color : "#484f58",
                                borderRadius: 10, fontSize: 13, fontWeight: 500,
                                cursor: canStart ? "pointer" : "not-allowed",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {isLocked
                                ? "🔒 Verrouillé"
                                : alreadyDone
                                    ? "↩ Revoir"
                                    : "Commencer →"}
                        </button>
                    </div>
                )}

                {/* close */}
                <button
                    onClick={handleClose}
                    style={{
                        position: "absolute", top: 12, right: 14,
                        background: "none", border: "none",
                        color: "#484f58", fontSize: 18,
                        cursor: "pointer", lineHeight: 1, padding: 4,
                    }}
                >×</button>
            </div>
        </>
    );
};