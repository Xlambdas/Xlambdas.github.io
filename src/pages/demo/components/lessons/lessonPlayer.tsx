import React, { useState, useEffect, useRef } from "react";
import type { NodeType, Lesson, ContentBlock, SRRating } from "../../types/types";
import { completeLesson, getNodeCompletionPercent } from "../../data/graphData";
import { upsertCard } from "../../utils/srEngine";
import { QuizPlayer } from "./quizPlayer";
import { getNotesForNode } from "../../data/teacherNotes";
import { TeacherNoteCard } from "../../sections/teacherNoteCard";

// --- Constants ---

const NODE_COLOR: Record<NodeType["type"], string> = {
    main: "#ffffff",
    folder: "#a5b4fc",
    file: "#94a3b8",
};

const BLOCK_LABELS: Record<ContentBlock["type"], string> = {
    explanation: "Explication",
    vignette: "Histoire",
    quiz: "Quiz",
    recap: "Récapitulatif",
};

// --- Markdown ---

const md = (text: string) =>
    "<p>" +
    text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n- /g, "<br/>• ") +
    "</p>";

// --- Sub-components ---

const ExplanationBlock: React.FC<{
    block: Extract<ContentBlock, { type: "explanation" }>;
    color: string;
    nodeId: string;
}> = ({ block, color, nodeId }) => {
    const notes = getNotesForNode(nodeId);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {block.title && (
                <h2 style={{
                    color, fontSize: 16, fontWeight: 600,
                    margin: 0, lineHeight: 1.4,
                    borderLeft: `3px solid ${color}`,
                    paddingLeft: 12,
                }}>
                    {block.title}
                </h2>
            )}
            <div
                style={{ color: "#c9d1d9", fontSize: 14, lineHeight: 1.85 }}
                dangerouslySetInnerHTML={{ __html: md(block.content) }}
            />
            {notes.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                    <span style={{
                        color: "#484f58", fontSize: 10,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                    }}>
                        Notes des enseignants
                    </span>
                    {notes.map((note, i) => (
                        <TeacherNoteCard key={i} note={note} isTeacher={false} />
                    ))}
                </div>
            )}
        </div>
    );
};

const VignetteBlock: React.FC<{
    block: Extract<ContentBlock, { type: "vignette" }>;
    color: string;
}> = ({ block, color }) => (
    <div style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderLeft: `3px solid ${color}`,
        borderRadius: 10, padding: "20px 20px 20px 18px",
        display: "flex", flexDirection: "column", gap: 14,
    }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>🎭</span>
            <span style={{
                color, fontSize: 11, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
                {block.title}
            </span>
        </div>
        <div
            style={{ color: "#8b949e", fontSize: 14, lineHeight: 1.85, fontStyle: "italic" }}
            dangerouslySetInnerHTML={{ __html: md(block.content) }}
        />
    </div>
);

const RecapBlock: React.FC<{
    block: Extract<ContentBlock, { type: "recap" }>;
    color: string;
}> = ({ block, color }) => (
    <div style={{
        background: `${color}08`,
        border: `1px solid ${color}22`,
        borderRadius: 10, padding: "18px 20px",
        display: "flex", flexDirection: "column", gap: 12,
    }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>🔁</span>
            <span style={{
                color, fontSize: 11, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
                À retenir
            </span>
        </div>
        {block.points.map((point, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: color, flexShrink: 0, marginTop: 8,
                }} />
                <span style={{ color: "#c9d1d9", fontSize: 13, lineHeight: 1.65 }}>
                    {point}
                </span>
            </div>
        ))}
    </div>
);

// --- Completion screen ---

const CompletionScreen: React.FC<{
    lesson: Lesson;
    node: NodeType;
    color: string;
    isNodeComplete: boolean;
    onContinue: () => void;
}> = ({ lesson, node, color, isNodeComplete, onContinue }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, []);

    return (
        <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 24, padding: "0 24px", textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.4s ease",
        }}>
            <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: `${color}18`, border: `2px solid ${color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 30, boxShadow: `0 0 30px ${color}33`,
            }}>
                {isNodeComplete ? (node.badge?.icon ?? "✦") : "✓"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <h2 style={{ color: "#c9d1d9", fontSize: 18, fontWeight: 600, margin: 0 }}>
                    {isNodeComplete ? `${node.title} complété !` : `${lesson.title} terminé !`}
                </h2>
                <p style={{ color: "#6e7681", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                    {isNodeComplete
                        ? node.badge
                            ? `Tu as obtenu le badge "${node.badge.name}" ${node.badge.icon}`
                            : "Tu as complété toutes les leçons de ce nœud."
                        : "Continue sur ta lancée — la prochaine leçon t'attend."}
                </p>
            </div>

            {isNodeComplete && node.badge && (
                <div style={{
                    background: `${color}0d`, border: `1px solid ${color}33`,
                    borderRadius: 12, padding: "14px 20px",
                    display: "flex", flexDirection: "column", gap: 6,
                }}>
                    <span style={{
                        color, fontSize: 11, fontWeight: 600,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                    }}>
                        Badge débloqué
                    </span>
                    <span style={{ color: "#8b949e", fontSize: 12, lineHeight: 1.5 }}>
                        {node.badge.levels.bronze}
                    </span>
                </div>
            )}

            <button
                onClick={onContinue}
                style={{
                    padding: "14px 36px",
                    background: `${color}22`, border: `1px solid ${color}66`,
                    color, borderRadius: 12, fontSize: 14, fontWeight: 500,
                    cursor: "pointer", transition: "all 0.2s ease",
                }}
            >
                {isNodeComplete ? "Retour au graphe →" : "Continuer →"}
            </button>
        </div>
    );
};

// --- Main component ---

interface LessonPlayerProps {
    node: NodeType;
    lesson: Lesson;
    lessonIndex: number;
    onComplete: (nodeId: string, newlyCompleted: boolean) => void;
    onClose: () => void;
}

type Phase = "playing" | "completed";

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
    node, lesson, onComplete, onClose,
}) => {
    const [visible, setVisible] = useState(false);
    const [blockIndex, setBlockIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>("playing");
    const [isNodeComplete, setIsNodeComplete] = useState(false);
    const [quizDone, setQuizDone] = useState<Set<number>>(new Set());
    const scrollRef = useRef<HTMLDivElement>(null);

    const color = NODE_COLOR[node.type];
    const blocks = lesson.blocks;
    const currentBlock = blocks[blockIndex];
    const isLastBlock = blockIndex === blocks.length - 1;
    const progress = blocks.length > 0 ? (blockIndex / blocks.length) * 100 : 0;

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, [blockIndex]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 350);
    };

    const canAdvance = () => {
        if (!currentBlock) return false;
        return currentBlock.type !== "quiz" || quizDone.has(blockIndex);
    };

    const handleNext = () => {
        if (!canAdvance()) return;
        if (isLastBlock) {
            completeLesson(node.id, lesson.id);
            const nodeCompleted = getNodeCompletionPercent(node.id) === 100;
            setIsNodeComplete(nodeCompleted);
            setPhase("completed");
        } else {
            setBlockIndex(i => i + 1);
        }
    };

    const handleContinue = () => {
        setVisible(false);
        setTimeout(() => onComplete(node.id, isNodeComplete), 350);
    };

    const questionId = (blockIdx: number) => `${node.id}::${lesson.id}::${blockIdx}`;

    const handleQuizComplete = (_: string, rating: SRRating) => {
        upsertCard(questionId(blockIndex), node.id, rating);
        setQuizDone(prev => new Set([...prev, blockIndex]));
    };

    // --- Main render ---
    return (
        <>
            <style>{`
                @keyframes blockIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* backdrop */}
            <div style={{
                position: "absolute", inset: 0, zIndex: 55,
                backdropFilter: visible ? "blur(8px)" : "none",
                background: visible ? "rgba(0,0,0,0.75)" : "transparent",
                transition: "all 0.35s ease",
            }} />

            {/* panel */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    position: "absolute", zIndex: 56,
                    bottom: 0, left: "50%",
                    transform: visible
                        ? "translateX(-50%)"
                        : "translateX(-50%) translateY(100%)",
                    width: "min(600px, 100vw)", height: "96vh",
                    background: "#161b22",
                    borderRadius: "16px 16px 0 0",
                    border: "1px solid #30363d", borderBottom: "none",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden",
                    transition: "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
                    boxShadow: "0 -8px 60px rgba(0,0,0,0.8)",
                }}
            >
                {/* progress bar */}
                <div style={{ height: 3, background: "#21262d", flexShrink: 0 }}>
                    <div style={{
                        height: "100%",
                        width: phase === "completed" ? "100%" : `${progress}%`,
                        background: color, transition: "width 0.4s ease",
                    }} />
                </div>

                {/* header (playing only) */}
                {phase === "playing" && (
                    <div style={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 20px",
                        borderBottom: "1px solid #21262d",
                        flexShrink: 0,
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: "50%",
                                background: color, boxShadow: `0 0 8px ${color}88`,
                                flexShrink: 0,
                            }} />
                            <div>
                                <div style={{ color: "#c9d1d9", fontSize: 12, fontWeight: 500 }}>
                                    {lesson.title}
                                </div>
                                <div style={{ color: "#484f58", fontSize: 10, marginTop: 2 }}>
                                    {node.title} · {blockIndex + 1} / {blocks.length}
                                </div>
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
                )}

                {/* body */}
                {phase === "playing" ? (
                    <>
                        <div
                            ref={scrollRef}
                            style={{
                                flex: 1, overflowY: "auto",
                                scrollbarWidth: "thin",
                                scrollbarColor: "#21262d transparent",
                                padding: "24px 24px 0",
                            }}
                        >
                            <div key={blockIndex} style={{ animation: "blockIn 0.3s ease" }}>

                                {/* block label */}
                                <div style={{
                                    display: "flex", alignItems: "center",
                                    gap: 6, marginBottom: 16,
                                }}>
                                    <span style={{
                                        color, fontSize: 10, fontWeight: 600,
                                        textTransform: "uppercase", letterSpacing: "0.1em",
                                    }}>
                                        {currentBlock ? BLOCK_LABELS[currentBlock.type] : ""}
                                    </span>
                                    <span style={{ color: "#30363d", fontSize: 10 }}>
                                        · {blockIndex + 1}/{blocks.length}
                                    </span>
                                </div>

                                {/* block content */}
                                {currentBlock?.type === "explanation" && (
                                    <ExplanationBlock block={currentBlock} color={color} nodeId={node.id} />
                                )}
                                {currentBlock?.type === "vignette" && (
                                    <VignetteBlock block={currentBlock} color={color} />
                                )}
                                {currentBlock?.type === "recap" && (
                                    <RecapBlock block={currentBlock} color={color} />
                                )}
                                {currentBlock?.type === "quiz" && (
                                    <QuizPlayer
                                        question={currentBlock.question}
                                        questionId={questionId(blockIndex)}
                                        nodeId={node.id}
                                        onComplete={handleQuizComplete}
                                    />
                                )}
                            </div>
                            <div style={{ height: 32 }} />
                        </div>

                        {/* next button */}
                        <div style={{
                            padding: "16px 24px",
                            borderTop: "1px solid #21262d",
                            flexShrink: 0, background: "#161b22",
                        }}>
                            <button
                                onClick={handleNext}
                                disabled={!canAdvance()}
                                style={{
                                    width: "100%", padding: "14px 0",
                                    background: canAdvance() ? `${color}22` : "#21262d",
                                    border: `1px solid ${canAdvance() ? `${color}66` : "#30363d"}`,
                                    color: canAdvance() ? color : "#484f58",
                                    borderRadius: 10, fontSize: 13, fontWeight: 500,
                                    cursor: canAdvance() ? "pointer" : "not-allowed",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                {currentBlock?.type === "quiz" && !quizDone.has(blockIndex)
                                    ? "Réponds au quiz pour continuer"
                                    : isLastBlock ? "Terminer la leçon ✓" : "Continuer →"}
                            </button>
                        </div>
                    </>
                ) : (
                    <CompletionScreen
                        lesson={lesson}
                        node={node}
                        color={color}
                        isNodeComplete={isNodeComplete}
                        onContinue={handleContinue}
                    />
                )}
            </div>
        </>
    );
};