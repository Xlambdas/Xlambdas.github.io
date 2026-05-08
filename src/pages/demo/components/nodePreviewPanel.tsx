import React, { useEffect, useState } from "react";
import { type NodeType } from "../data/graphData";

const TYPE_COLOR: Record<NodeType["type"], string> = {
    main: "#ffffff",
    folder: "#a5b4fc",
    file: "#94a3b8",
};

interface NodePreviewPanelProps {
    node: NodeType | null;
    onClose: () => void;
}

export const NodePreviewPanel: React.FC<NodePreviewPanelProps> = ({ node, onClose }) => {
    const [phase, setPhase] = useState<"hidden" | "peek" | "full">("hidden");

    // slide in when node appears
    useEffect(() => {
        if (node) {
            setPhase("hidden");
            requestAnimationFrame(() => requestAnimationFrame(() => setPhase("peek")));
        } else {
            setPhase("hidden");
        }
    }, [node]);

    if (!node && phase === "hidden") return null;

    const color = TYPE_COLOR[node?.type ?? "file"];

    const handleBackdropClick = () => {
        setPhase("hidden");
        setTimeout(onClose, 380);
    };

    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (phase === "peek") setPhase("full");
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (phase === "full") {
            setPhase("peek");
        } else {
            setPhase("hidden");
            setTimeout(onClose, 380);
        }
    };

    const isFull = phase === "full";
    const isVisible = phase !== "hidden";

    return (
        <>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to   { transform: translateY(0); }
                }
                @keyframes slideDown {
                    from { transform: translateY(0); }
                    to   { transform: translateY(100%); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to   { opacity: 0; }
                }
                @media (max-width: 640px) {
                    .preview-card {
                        width: 100% !important;
                        border-radius: 16px 16px 0 0 !important;
                    }
                }
            `}</style>

            {/* backdrop blur */}
            <div
                onClick={handleBackdropClick}
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
                onClick={handleCardClick}
                style={{
                    position: "absolute", zIndex: 40,
                    left: isFull ? 0 : "50%",
                    bottom: isFull ? 0 : 0,
                    transform: isFull
                        ? "none"
                        : isVisible
                            ? "translateX(-50%)"
                            : "translateX(-50%) translateY(110%)",
                    width: isFull ? "100%" : "min(75vw, 100%)",
                    height: isFull ? "100%" : "50vh",
                    background: "#161b22",
                    border: isFull ? "none" : "1px solid #30363d",
                    borderRadius: isFull ? 0 : "16px 16px 0 0",
                    maxWidth: isFull ? "none" : "none",
                    boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
                    cursor: isFull ? "default" : "pointer",
                    transition: "all 0.38s cubic-bezier(0.32, 0.72, 0, 1)",
                    display: "flex", flexDirection: "column", alignItems: "center",
                    overflow: "hidden",
                    paddingBottom: isFull ? 0 : 32,
                    justifyContent: isFull ? "flex-start" : "flex-start",
                    overflowY: "auto",
                }}
            >
                {/* node circle */}
                <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 24px ${color}88`,
                    marginTop: -28, marginBottom: 16, flexShrink: 0,
                    border: "3px solid #161b22",
                    transition: "all 0.38s ease",
                    ...(isFull ? { marginTop: 48, width: 72, height: 72 } : {}),
                }} />

                <span style={{
                    color: "#c9d1d9", fontWeight: 600,
                    fontSize: isFull ? 22 : 16,
                    marginBottom: 6, transition: "font-size 0.3s ease",
                }}>{node?.title}</span>

                <span style={{
                    color: "#6e7681", fontSize: isFull ? 13 : 11,
                    marginBottom: isFull ? 32 : 0,
                    padding: "0 24px", textAlign: "center",
                    transition: "font-size 0.3s ease",
                }}>
                    {node?.type === "main" ? "Main node" : node?.type === "folder" ? "Section" : "Topic"}
                    {" · "}
                    {node?.isUnlocked ? "Unlocked" : "Locked"}
                </span>

                {isFull && (
                    <div style={{
                        flex: 1, width: "100%", padding: "0 32px",
                        display: "flex", flexDirection: "column", gap: 12,
                        overflowY: "auto",
                    }}>
                        <div style={{
                            background: "#21262d", borderRadius: 10,
                            padding: "14px 16px", color: "#8b949e", fontSize: 13, lineHeight: 1.6,
                        }}>
                            Connected to: {node?.links.join(", ") || "—"}
                        </div>
                        <div style={{
                            background: "#21262d", borderRadius: 10,
                            padding: "14px 16px", color: "#8b949e", fontSize: 13,
                        }}>
                            Links: {node?.links.length ?? 0}
                        </div>
                    </div>
                )}

                {isFull && (
                    <div style={{ padding: 24, width: "100%", boxSizing: "border-box" }}>
                        <button style={{
                            width: "100%", padding: "12px 0",
                            background: `${color}22`, border: `1px solid ${color}66`,
                            color: color, borderRadius: 10, fontSize: 13,
                            fontWeight: 500, cursor: "pointer",
                        }}>Start learning</button>
                    </div>
                )}

                {/* close button */}
                <button
                    onClick={handleClose}
                    style={{
                        position: "absolute", top: 12, right: 14,
                        background: "none", border: "none", color: "#484f58",
                        fontSize: 18, cursor: "pointer", lineHeight: 1, padding: 4,
                    }}
                >×</button>
            </div>
        </>
    );
};