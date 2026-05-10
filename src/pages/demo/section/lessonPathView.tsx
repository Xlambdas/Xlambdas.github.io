import React, { useState, useEffect, useRef } from "react";
import {
    type NodeType,
    type Lesson,
    isLessonCompleted,
    getNodeCompletionPercent,
    getCompletedNodes,
    getBadgeForNode,
    initialNodes,
} from "../data/graphData";
import { isNodeBranchBlocked } from "../helpers/srEngine";

// ─── Constants ────────────────────────────────────────────────────────────────

const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const NODE_COLOR: Record<NodeType["type"], string> = {
    main: "#ffffff",
    folder: "#a5b4fc",
    file: "#94a3b8",
};

const LESSON_ICONS: Record<string, string> = {
    explanation: "📖",
    vignette: "🎭",
    recap: "🔁",
    video: "🎬",
    quiz: "⚡",
};

const LESSON_LABELS: Record<string, string> = {
    explanation: "Leçon",
    vignette: "Histoire",
    recap: "Récap",
    video: "Vidéo",
    quiz: "Quiz",
};

const BADGE_LEVEL_COLOR: Record<string, string> = {
    bronze: "#cd7f32",
    silver: "#94a3b8",
    gold: "#f59e0b",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type HexStatus = "completed" | "current" | "locked";

interface LessonPathViewProps {
    node: NodeType;
    parentTitle?: string;
    onClose: () => void;
    onStartLesson: (node: NodeType, lesson: Lesson, lessonIndex: number) => void;
    onOpenStrengthen?: (nodeId: string) => void;
    asPage?: boolean;
}

// ─── Hex lesson ───────────────────────────────────────────────────────────────

const HexLesson: React.FC<{
    lesson: Lesson;
    status: HexStatus;
    index: number;
    color: string;
    isLeft: boolean;
    onClick: () => void;
}> = ({ lesson, status, index, color, isLeft, onClick }) => {
    const [pressed, setPressed] = useState(false);
    const SIZE = 68;

    const bg = status === "completed" ? color
        : status === "current" ? `${color}33`
            : "#1c2128";

    const borderColor = status === "locked" ? "#30363d" : color;

    return (
        <div
            onClick={status !== "locked" ? onClick : undefined}
            style={{
                display: "flex",
                flexDirection: isLeft ? "row" : "row-reverse",
                alignItems: "center",
                gap: 14,
                alignSelf: isLeft ? "flex-start" : "flex-end",
                marginLeft: isLeft ? 16 : 0,
                marginRight: isLeft ? 0 : 16,
                cursor: status === "locked" ? "not-allowed" : "pointer",
            }}
        >
            <div style={{ position: "relative", flexShrink: 0 }}>
                {status === "current" && (
                    <div style={{
                        position: "absolute", inset: -6,
                        clipPath: HEX_CLIP,
                        background: `${color}22`,
                        animation: "hexPulse 1.8s ease-in-out infinite",
                    }} />
                )}
                <div
                    onMouseDown={() => setPressed(true)}
                    onMouseUp={() => setPressed(false)}
                    onMouseLeave={() => setPressed(false)}
                    style={{
                        width: SIZE, height: SIZE,
                        clipPath: HEX_CLIP,
                        background: bg,
                        border: `2px solid ${borderColor}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transform: pressed ? "scale(0.93)" : "scale(1)",
                        transition: "transform 0.12s ease",
                        boxShadow: status === "current" ? `0 0 20px ${color}44`
                            : status === "completed" ? `0 0 10px ${color}33`
                                : "none",
                    }}
                >
                    <span style={{
                        fontSize: 20,
                        opacity: status === "locked" ? 0.3 : 1,
                        filter: status === "locked" ? "grayscale(1)" : "none",
                    }}>
                        {status === "completed" ? "✓"
                            : status === "locked" ? "🔒"
                                : LESSON_ICONS[lesson.type] ?? "📖"}
                    </span>
                </div>
                <div style={{
                    position: "absolute", bottom: -4, right: -4,
                    width: 18, height: 18, borderRadius: "50%",
                    background: status === "locked" ? "#21262d" : color,
                    border: "2px solid #161b22",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 700,
                    color: status === "locked" ? "#484f58" : "#0d1117",
                }}>
                    {index + 1}
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 140 }}>
                <span style={{
                    color: status === "locked" ? "#484f58" : "#c9d1d9",
                    fontSize: 13, fontWeight: status === "current" ? 600 : 400,
                    lineHeight: 1.3,
                }}>
                    {lesson.title}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: status === "locked" ? "#30363d" : "#484f58", fontSize: 10 }}>
                        {LESSON_LABELS[lesson.type] ?? "Leçon"}
                    </span>
                    <span style={{ color: "#30363d", fontSize: 10 }}>·</span>
                    <span style={{ color: status === "locked" ? "#30363d" : "#484f58", fontSize: 10 }}>
                        ~{lesson.estimatedMinutes} min
                    </span>
                </div>
            </div>
        </div>
    );
};

// ─── Snake connector ──────────────────────────────────────────────────────────

const Connector: React.FC<{ fromLeft: boolean; color: string; done: boolean }> = ({
    fromLeft, color, done,
}) => (
    <div style={{
        width: "55%", height: 28, alignSelf: "center",
        display: "flex", alignItems: "center",
        justifyContent: fromLeft ? "flex-end" : "flex-start",
        padding: "0 20px",
    }}>
        <svg width="100%" height="28" viewBox="0 0 120 28" preserveAspectRatio="none">
            <path
                d={fromLeft
                    ? "M 110 4 Q 60 4 60 14 Q 60 24 10 24"
                    : "M 10 4 Q 60 4 60 14 Q 60 24 110 24"}
                fill="none"
                stroke={done ? color : "#30363d"}
                strokeWidth="2"
                strokeDasharray={done ? "none" : "4 4"}
                opacity={done ? 0.6 : 0.4}
            />
        </svg>
    </div>
);

// ─── Completed banner ─────────────────────────────────────────────────────────

const CompletedBanner: React.FC<{ node: NodeType; color: string }> = ({ node, color }) => {
    const badge = getBadgeForNode(node.id);
    return (
        <div style={{
            margin: "32px 20px 0",
            background: `${color}0d`, border: `1px solid ${color}33`,
            borderRadius: 12, padding: "20px",
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 10, textAlign: "center",
        }}>
            <span style={{ fontSize: 28 }}>{node.badge?.icon ?? "✦"}</span>
            <span style={{ color, fontSize: 14, fontWeight: 600 }}>
                {node.badge?.name ?? "Parcours complété"}
            </span>
            <span style={{ color: "#6e7681", fontSize: 12, lineHeight: 1.6 }}>
                {node.badge?.description ?? "Tu as complété toutes les leçons."}
            </span>
            {badge && (
                <div style={{
                    background: "#21262d", border: "1px solid #30363d",
                    borderRadius: 20, padding: "3px 12px",
                    color: BADGE_LEVEL_COLOR[badge.level] ?? "#8b949e",
                    fontSize: 11, textTransform: "capitalize",
                }}>
                    {badge.level}
                </div>
            )}
        </div>
    );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export const LessonPathView: React.FC<LessonPathViewProps> = ({
    node, parentTitle, onClose, onStartLesson, onOpenStrengthen, asPage = false,
}) => {
    const [visible, setVisible] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const color = NODE_COLOR[node.type];
    const pct = getNodeCompletionPercent(node.id);
    const earnedBadge = getBadgeForNode(node.id);
    const nodeCompleted = getCompletedNodes().includes(node.id);
    const lessons = node.lessonPath ?? [];
    const optionals = node.optionalLessonPath ?? [];
    const parentNode = initialNodes.find(n => n.links.includes(node.id));
    const nextNodes = node.links
        .map(id => initialNodes.find(n => n.id === id))
        .filter(Boolean) as NodeType[];

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        setTimeout(() => {
            document.getElementById("hex-current")
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 500);
    }, []);

    const handleClose = () => { setVisible(false); setTimeout(onClose, 350); };

    const getLessonStatus = (lesson: Lesson, index: number): HexStatus => {
        if (isLessonCompleted(node.id, lesson.id)) return "completed";
        const firstIncomplete = lessons.findIndex(l => !isLessonCompleted(node.id, l.id));
        return index === firstIncomplete ? "current" : "locked";
    };

    const completedCount = lessons.filter((l, i) =>
        getLessonStatus(l, i) === "completed"
    ).length;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <>
            <style>{`
                @keyframes hexPulse {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50%      { opacity: 0.8; transform: scale(1.08); }
                }
            `}</style>

            {/* backdrop — modal mode only */}
            {!asPage && (
                <div
                    onClick={handleClose}
                    style={{
                        position: "absolute", inset: 0, zIndex: 50,
                        backdropFilter: visible ? "blur(8px)" : "none",
                        background: visible ? "rgba(0,0,0,0.65)" : "transparent",
                        transition: "all 0.35s ease",
                        pointerEvents: visible ? "auto" : "none",
                    }}
                />
            )}

            {/* panel */}
            <div
                onClick={e => e.stopPropagation()}
                style={asPage ? {
                    position: "relative",
                    width: "100%", height: "100%",
                    background: "#0b0f14",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden",
                } : {
                    position: "absolute", zIndex: 51,
                    bottom: 0, left: "50%",
                    transform: visible
                        ? "translateX(-50%)"
                        : "translateX(-50%) translateY(100%)",
                    width: "min(560px, 100vw)", height: "94vh",
                    background: "#161b22",
                    borderRadius: "16px 16px 0 0",
                    border: "1px solid #30363d", borderBottom: "none",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden",
                    transition: "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
                    boxShadow: "0 -8px 60px rgba(0,0,0,0.7)",
                }}
            >
                {/* progress bar */}
                <div style={{ height: 3, background: "#21262d", flexShrink: 0 }}>
                    <div style={{
                        height: "100%", width: `${pct}%`,
                        background: color, transition: "width 0.6s ease",
                    }} />
                </div>

                {/* ── Header ── */}
                {asPage ? (
                    <div className="flex flex-col shrink-0 px-6 sm:px-8" style={{ paddingTop: "calc(48px + 20px)" }}>
                        {/* centered title */}
                        <h1 className="text-center font-bold text-[#c9d1d9] mb-2" style={{ fontSize: 18 }}>
                            {parentTitle && (
                                <span style={{ color: "#484f58", fontWeight: 400 }}>
                                    {parentTitle}{" — "}
                                </span>
                            )}
                            {node.title}
                        </h1>

                        {/* left-aligned description */}
                        {node.shortDescription && (
                            <p className="text-[#6e7681] italic text-sm leading-relaxed mb-3">
                                {node.shortDescription}
                            </p>
                        )}

                        {/* previous node button */}
                        {parentNode && (
                            <div className="mb-4">
                                <span className="text-[#30363d] text-[10px] uppercase tracking-widest block mb-1.5">
                                    Prérequis
                                </span>
                                <button
                                    onClick={() => window.__graphFocus?.(parentNode.id)}
                                    className="flex items-center gap-2 px-3 py-2 bg-[#161b22] border border-[#21262d] rounded-lg text-[#484f58] text-xs hover:border-[#30363d] hover:text-[#8b949e] transition-all"
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2">
                                        <path d="M19 12H5M12 5l-7 7 7 7" />
                                    </svg>
                                    {parentNode.title}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // Modal mode — compact row header
                    <>
                        <div style={{
                            padding: "16px 20px",
                            borderBottom: "1px solid #21262d",
                            flexShrink: 0,
                            display: "flex", alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                    width: 10, height: 10, borderRadius: "50%",
                                    background: color, flexShrink: 0,
                                    boxShadow: `0 0 8px ${color}88`,
                                }} />
                                <div>
                                    <div style={{ color: "#c9d1d9", fontSize: 14, fontWeight: 600 }}>
                                        {parentTitle && (
                                            <span style={{ color: "#484f58", fontWeight: 400 }}>
                                                {parentTitle}{" — "}
                                            </span>
                                        )}
                                        {node.title}
                                    </div>
                                    {node.shortDescription && (
                                        <div style={{ color: "#484f58", fontSize: 11, marginTop: 2 }}>
                                            {node.shortDescription}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                style={{
                                    background: "none", border: "none",
                                    color: "#484f58", fontSize: 20,
                                    cursor: "pointer", lineHeight: 1, padding: 4,
                                }}
                            >×</button>
                        </div>

                        {/* stats bar — modal only */}
                        <div style={{ display: "flex", borderBottom: "1px solid #21262d", flexShrink: 0 }}>
                            {[
                                [`${completedCount}/${lessons.length}`, "Leçons"],
                                [`${pct}%`, "Complété"],
                                [earnedBadge?.level ?? "—", node.badge?.icon ? `${node.badge.icon} Badge` : "Badge"],
                            ].map(([val, label], i) => (
                                <div key={i} style={{
                                    flex: 1, padding: "10px 0", textAlign: "center",
                                    borderRight: i < 2 ? "1px solid #21262d" : "none",
                                }}>
                                    <div style={{ color: "#c9d1d9", fontSize: 15, fontWeight: 600 }}>
                                        {val}
                                    </div>
                                    <div style={{
                                        color: "#484f58", fontSize: 9, marginTop: 2,
                                        textTransform: "uppercase", letterSpacing: "0.06em",
                                    }}>
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* ── Snake path ── */}
                <div
                    ref={scrollRef}
                    style={{
                        flex: 1, overflowY: "auto",
                        scrollbarWidth: "thin", scrollbarColor: "#21262d transparent",
                    }}
                >
                    <div style={{
                        width: "min(480px, 100%)",
                        margin: "0 auto",
                        padding: "32px 0 64px",
                        display: "flex", flexDirection: "column",
                    }}>
                        {lessons.length === 0 ? (
                            <div style={{
                                flex: 1, display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center",
                                gap: 12, padding: "40px 24px",
                            }}>
                                <span style={{ fontSize: 32 }}>🔜</span>
                                <span style={{ color: "#484f58", fontSize: 13, textAlign: "center" }}>
                                    Les leçons arrivent bientôt.
                                </span>
                            </div>
                        ) : (
                            <>
                                {lessons.map((lesson, index) => {
                                    const status = getLessonStatus(lesson, index);
                                    const isLeft = index % 2 === 0;
                                    const prevDone = index === 0 ||
                                        getLessonStatus(lessons[index - 1], index - 1) === "completed";

                                    return (
                                        <div
                                            key={lesson.id}
                                            id={status === "current" ? "hex-current" : undefined}
                                            style={{ display: "flex", flexDirection: "column" }}
                                        >
                                            {index > 0 && (
                                                <Connector
                                                    fromLeft={!isLeft}
                                                    color={color}
                                                    done={prevDone}
                                                />
                                            )}
                                            <HexLesson
                                                lesson={lesson}
                                                status={status}
                                                index={index}
                                                color={color}
                                                isLeft={isLeft}
                                                onClick={() => {
                                                    if (isNodeBranchBlocked(node.id) && status === "current") {
                                                        onOpenStrengthen?.(node.id);
                                                    } else {
                                                        onStartLesson(node, lesson, index);
                                                    }
                                                }}
                                            />
                                        </div>
                                    );
                                })}

                                {/* optional lessons */}
                                {optionals.length > 0 && (
                                    <>
                                        <div style={{
                                            margin: "32px 20px 16px",
                                            display: "flex", alignItems: "center", gap: 10,
                                        }}>
                                            <div style={{ flex: 1, height: 1, background: "#21262d" }} />
                                            <span style={{
                                                color: "#484f58", fontSize: 10,
                                                textTransform: "uppercase", letterSpacing: "0.08em",
                                            }}>
                                                Optionnel
                                            </span>
                                            <div style={{ flex: 1, height: 1, background: "#21262d" }} />
                                        </div>
                                        <div style={{
                                            display: "flex", flexWrap: "wrap",
                                            gap: 16, justifyContent: "center", padding: "0 20px",
                                        }}>
                                            {optionals.map((lesson, index) => {
                                                const status = getLessonStatus(lesson, index);
                                                return (
                                                    <div
                                                        key={lesson.id}
                                                        onClick={() =>
                                                            status !== "locked" &&
                                                            onStartLesson(node, lesson, index)
                                                        }
                                                        style={{
                                                            display: "flex", flexDirection: "column",
                                                            alignItems: "center", gap: 6,
                                                            cursor: status === "locked" ? "not-allowed" : "pointer",
                                                            opacity: status === "locked" ? 0.4 : 1,
                                                        }}
                                                    >
                                                        <div style={{
                                                            width: 56, height: 56,
                                                            clipPath: HEX_CLIP,
                                                            background: status === "completed"
                                                                ? `${color}44` : "#1c2128",
                                                            border: `2px solid ${color}44`,
                                                            display: "flex", alignItems: "center",
                                                            justifyContent: "center", fontSize: 18,
                                                        }}>
                                                            {status === "completed"
                                                                ? "✓"
                                                                : LESSON_ICONS[lesson.type] ?? "📖"}
                                                        </div>
                                                        <span style={{
                                                            color: "#6e7681", fontSize: 11,
                                                            textAlign: "center", maxWidth: 80,
                                                        }}>
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}

                                {nodeCompleted && <CompletedBanner node={node} color={color} />}
                                    {nextNodes.length > 0 && (
                                        <div className="mx-5 mt-8 mb-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex-1 h-px bg-[#21262d]" />
                                                <span className="text-[#484f58] text-[10px] uppercase tracking-widest shrink-0">
                                                    {nextNodes.length === 1 ? "Concept suivant" : "Concepts suivants"}
                                                </span>
                                                <div className="flex-1 h-px bg-[#21262d]" />
                                            </div>
                                            <div className={`grid gap-2 ${nextNodes.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                                                {nextNodes.map(next => {
                                                    const nextColor = NODE_COLOR[next.type];
                                                    const nextPct = getNodeCompletionPercent(next.id);
                                                    const isLocked = !next.isUnlocked;
                                                    return (
                                                        <button
                                                            key={next.id}
                                                            onClick={() => !isLocked && window.__graphFocus?.(next.id)}
                                                            disabled={isLocked}
                                                            className="flex flex-col gap-1 p-3 rounded-xl text-left transition-all"
                                                            style={{
                                                                background: isLocked ? "#0d1117" : `${nextColor}0d`,
                                                                border: `1px solid ${isLocked ? "#21262d" : `${nextColor}33`}`,
                                                                cursor: isLocked ? "not-allowed" : "pointer",
                                                                opacity: isLocked ? 0.5 : 1,
                                                            }}
                                                        >
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span style={{
                                                                    color: isLocked ? "#484f58" : nextColor,
                                                                    fontSize: 12, fontWeight: 600,
                                                                }}>
                                                                    {next.title}
                                                                </span>
                                                                {isLocked
                                                                    ? <span style={{ fontSize: 10 }}>🔒</span>
                                                                    : <svg width="12" height="12" viewBox="0 0 24 24"
                                                                        fill="none" stroke={nextColor} strokeWidth="2">
                                                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                                                    </svg>
                                                                }
                                                            </div>
                                                            {next.shortDescription && (
                                                                <span className="text-[#484f58] text-[10px] leading-snug line-clamp-2">
                                                                    {next.shortDescription}
                                                                </span>
                                                            )}
                                                            {/* mini progress bar */}
                                                            {!isLocked && (
                                                                <div className="mt-1 h-0.5 bg-[#21262d] rounded-full overflow-hidden w-full">
                                                                    <div style={{
                                                                        height: "100%", width: `${nextPct}%`,
                                                                        background: nextColor, transition: "width 0.4s ease",
                                                                    }} />
                                                                </div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};