import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ContentBlock, SRRating } from "../types/types";
import { initialNodes, completeLesson } from "../data/graphData";
import { upsertCard } from "../utils/srEngine";
import { LessonProgressBar } from "../components/lessons/lessonProgressBar";
import { BlockRenderer } from "../components/lessons/blockRenderer";
import { ExplanationModal } from "../components/lessons/explanationModal";
import { useLessonTextSize } from "../hooks";

// --- Types ---

interface BlockWithMetadata {
    block: ContentBlock;
    originalIndex: number;
    isRetry?: boolean; // if this is a re-added wrong quiz
}

// --- Main Component ---

export const LessonPage: React.FC = () => {
    const { nodeId, lessonId } = useParams<{ nodeId: string; lessonId: string }>();
    const navigate = useNavigate();

    const node = initialNodes.find(n => n.id === nodeId);
    const lessonIndex = node?.lessonPath.findIndex(l => l.id === lessonId) ?? -1;
    const lesson = node?.lessonPath[lessonIndex];

    const [blocks, setBlocks] = useState<BlockWithMetadata[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<Map<number, { correct: boolean; rating?: SRRating; userAnswer?: any }>>(new Map());
    // const [wrongQuizIndices, setWrongQuizIndices] = useState<Set<number>>(new Set());
    const [showExplanation, setShowExplanation] = useState(false);
    const [currentExplanation, setCurrentExplanation] = useState<string>("");
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showQuitModal, setShowQuitModal] = useState(false);
    const { textScale, updateTextScale } = useLessonTextSize();
    const SettingsButtonRef = React.useRef<HTMLButtonElement>(null);

    // Initialize blocks from lesson
    useEffect(() => {
        if (!lesson) return;
        setBlocks(lesson.blocks.map((block, i) => ({
            block,
            originalIndex: i,
            isRetry: false,
        })));
    }, [lesson]);

    // Not found
    if (!node || !lesson || lessonIndex === -1) {
        return (
            <div style={{
                height: "100dvh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0b0f14",
                color: "#484f58",
                fontSize: 14 * textScale,
            }}>
                Leçon introuvable.
                <span
                    onClick={() => navigate(`/demo/node/${nodeId}?lesson=${lessonId}`)}
                    style={{ color: "#a5b4fc", cursor: "pointer", marginLeft: 8 }}
                >
                    Retour
                </span>
            </div>
        );
    }

    const currentBlockMeta = blocks[currentIndex];
    const currentBlock = currentBlockMeta?.block;
    const isLastBlock = currentIndex === blocks.length - 1;
    const color = "#a5b4fc";

    const isReviewMode = currentBlock?.type === "quiz" && quizAnswers.has(currentIndex);

    // Handle quiz completion
    const handleQuizComplete = (correct: boolean, rating: SRRating, userAnswer: any) => {
        const questionId = `${nodeId}::${lessonId}::${currentBlockMeta.originalIndex}`;

        // Update quiz answers
        setQuizAnswers(prev => new Map(prev).set(currentIndex, { correct, rating, userAnswer }));

        // Store in spaced repetition
        if (nodeId) upsertCard(questionId, nodeId, rating);

        // If wrong and not already a retry, immediately insert before recap
        if (!correct) {
            const recapIndex = blocks.findIndex(b => b.block.type === "recap");
            if (recapIndex !== -1) {
                const quizToReAdd: BlockWithMetadata = {
                    block: currentBlock,
                    originalIndex: currentBlockMeta.originalIndex,
                    isRetry: true,
                };
                const newBlocks = [...blocks];
                newBlocks.splice(recapIndex, 0, quizToReAdd);
                setBlocks(newBlocks);
            }
        }
    };

    // Handle "Explain" button
    const handleExplain = (explanation: string) => {
        setCurrentExplanation(explanation);
        setShowExplanation(true);
    };

    // Handle next block
    const handleNext = () => {
        if (isLastBlock) {
            // Complete lesson and return to path
            if (nodeId && lessonId) {
                completeLesson(nodeId, lessonId);
                navigate(`/demo/node/${nodeId}?lesson=${lessonId}`);
            }
        } else {
            setCurrentIndex(i => i + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(i => i - 1);
        }
    };

    const canContinue = () => {
        if (!currentBlock) return false;
        if (currentBlock.type !== "quiz") return true;
        return quizAnswers.has(currentIndex);
    };

    // --- Main render ---
    return (
        <div style={{
            height: "100dvh",
            background: "#0b0f14",
            display: "flex",
            overflow: "hidden",
        }}>

            {/* Main column */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
            }}>
                {/* Progress Bar */}
                <LessonProgressBar
                    blocks={blocks.map(b => b.block)}
                    currentIndex={currentIndex}
                    color={color}
                />

                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 24px",
                    borderBottom: "1px solid #21262d",
                    background: "#161b22",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: color,
                            boxShadow: `0 0 8px ${color}88`,
                        }} />
                        <div>
                            <div style={{ color: "#c9d1d9", fontSize: 14 * textScale, fontWeight: 500 }}>
                                {lesson.title}
                            </div>
                            <div style={{ color: "#484f58", fontSize: 11 * textScale, marginTop: 2 }}>
                                {node.title}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {/* Text size button */}
                        <div style={{ position: "relative" }}>
                            <button
                                ref={SettingsButtonRef}
                                onClick={() => setShowSettingsModal(true)}
                                style={{
                                width: 32,
                                height: 32,
                                background: "#21262d",
                                border: "1px solid #30363d",
                                borderRadius: 8,
                                color: "#8b949e",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: 14 * textScale,
                                transition: "all 0.15s ease",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#30363d"}
                            onMouseLeave={e => e.currentTarget.style.background = "#21262d"}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="4 7 4 4 20 4 20 7" />
                                <line x1="9" y1="20" x2="15" y2="20" />
                                <line x1="12" y1="4" x2="12" y2="20" />
                                </svg>
                            </button>

                            {/* Settings Modal - positioned relative to button */}
                            {showSettingsModal && (
                                <>
                                    <div
                                        onClick={() => setShowSettingsModal(false)}
                                        style={{
                                            position: "fixed",
                                            inset: 0,
                                            zIndex: 999,
                                        }}
                                    />

                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "calc(100% + 8px)",
                                            right: 0,
                                            background: "#161b22",
                                            border: "1px solid #30363d",
                                            borderRadius: 8,
                                            padding: 16,
                                            zIndex: 1000,
                                            width: 240,
                                            boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
                                        }}
                                    >
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: 14,
                                        }}>
                                            <span style={{ color: "#c9d1d9", fontSize: 15 * textScale, fontWeight: 500 }}>
                                                Taille du texte
                                            </span>
                                            <button
                                                onClick={() => setShowSettingsModal(false)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "#484f58",
                                                    cursor: "pointer",
                                                    fontSize: 20 * textScale,
                                                    lineHeight: 1,
                                                    padding: 0,
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>

                                        <div style={{
                                            background: "#0d1117",
                                            border: "1px solid #21262d",
                                            borderRadius: 6,
                                            padding: 12,
                                            marginBottom: 14,
                                        }}>
                                            <div style={{
                                                color: "#484f58",
                                                fontSize: 11 * textScale,
                                                marginBottom: 6,
                                            }}>
                                                Aperçu
                                            </div>
                                            <p style={{
                                                color: "#c9d1d9",
                                                fontSize: `${textScale * 14}px`,
                                                lineHeight: 1.6,
                                                margin: 0,
                                            }}>
                                                Lorem ipsum dolor sit amet
                                            </p>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <button
                                                onClick={() => {
                                                    updateTextScale(Math.max(0.6, textScale - 0.1));
                                                }}
                                                disabled={textScale <= 0.6}
                                                style={{
                                                    flex: 1,
                                                    padding: "8px",
                                                    background: textScale <= 0.6 ? "#21262d" : "#30363d",
                                                    border: `1px solid ${textScale <= 0.6 ? "#30363d" : "#8b949e"}`,
                                                    borderRadius: 5,
                                                    color: textScale <= 0.6 ? "#484f58" : "#c9d1d9",
                                                    fontSize: 16 * textScale,
                                                    fontWeight: 600,
                                                    cursor: textScale <= 0.6 ? "not-allowed" : "pointer",
                                                }}
                                            >
                                                −
                                            </button>

                                            <div style={{
                                                color: "#8b949e",
                                                fontSize: 12 * textScale,
                                                fontWeight: 500,
                                                minWidth: 50,
                                                textAlign: "center",
                                            }}>
                                                {Math.round(textScale * 100)}%
                                            </div>

                                            <button
                                                onClick={() => {
                                                    updateTextScale(Math.min(1.5, textScale + 0.1));
                                                }}
                                                disabled={textScale >= 1.5}
                                                style={{
                                                    flex: 1,
                                                    padding: "8px",
                                                    background: textScale >= 1.5 ? "#21262d" : "#30363d",
                                                    border: `1px solid ${textScale >= 1.5 ? "#30363d" : "#8b949e"}`,
                                                    borderRadius: 5,
                                                    color: textScale >= 1.5 ? "#484f58" : "#c9d1d9",
                                                    fontSize: 16 * textScale,
                                                    fontWeight: 600,
                                                    cursor: textScale >= 1.5 ? "not-allowed" : "pointer",
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setShowQuitModal(true)}
                            style={{
                                width: 32,
                                height: 32,
                                background: "#21262d",
                                border: "1px solid #30363d",
                                borderRadius: 8,
                                color: "#8b949e",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: 18 * textScale,
                                fontWeight: 300,
                                transition: "all 0.15s ease",
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#30363d"}
                            onMouseLeave={e => e.currentTarget.style.background = "#21262d"}
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Content Zone - Scrollable */}
                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#21262d transparent",
                    // display: "flex",
                    // flexDirection: "column",
                }}>
                    <div style={{
                        width: "min(700px, 100%)",
                        margin: "0 auto",
                        padding: "32px 24px",
                        minHeight: "100%",
                        // flex: 1,
                    }}>
                        {currentBlock && (
                                <BlockRenderer
                                    key={currentIndex}
                                    block={currentBlock}
                                    color={color}
                                    nodeId={nodeId!}
                                    onQuizComplete={handleQuizComplete}
                                    onExplain={handleExplain}
                                    isAnswered={quizAnswers.has(currentIndex)}
                                    isRetry={currentBlockMeta.isRetry}
                                    reviewMode={isReviewMode}
                                    reviewAnswer={quizAnswers.has(currentIndex) ? quizAnswers.get(currentIndex)?.userAnswer : null}
                                    reviewCorrect={quizAnswers.get(currentIndex)?.correct}
                                    onContinue={handleNext}
                                    onPrevious={currentIndex > 0 ? handlePrevious : undefined}
                                    canContinue={canContinue()}
                                    buttonLabel={
                                        currentBlock?.type === "quiz" && !quizAnswers.has(currentIndex)
                                            ? "Réponds pour continuer"
                                            : isLastBlock
                                                ? "Terminer la leçon ✓"
                                                : "Continuer →"
                                    }
                                />

                        )}
                    </div>
                </div>

                {/* Quit Confirmation Modal */}
                {showQuitModal && (
                    <>
                        <div
                            onClick={() => setShowQuitModal(false)}
                            style={{
                                position: "fixed",
                                inset: 0,
                                background: "rgba(0,0,0,0.5)",
                                zIndex: 999,
                            }}
                        />

                        <div
                            style={{
                                position: "fixed",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                background: "#161b22",
                                border: "1px solid #30363d",
                                borderRadius: 8,
                                padding: 16 * textScale,
                                zIndex: 1000,
                                width: 280 * textScale,
                                boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
                            }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 14 * textScale,
                            }}>
                                <span style={{ color: "#c9d1d9", fontSize: 15 * textScale, fontWeight: 500 }}>
                                    Quitter la leçon
                                </span>
                                <button
                                    onClick={() => setShowQuitModal(false)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#484f58",
                                        cursor: "pointer",
                                        fontSize: 20 * textScale,
                                        lineHeight: 1,
                                        padding: 0,
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            <p style={{
                                color: "#8b949e",
                                fontSize: 13 * textScale,
                                lineHeight: 1.5 * textScale,
                                margin: `0 0 ${16 * textScale}px 0`,
                            }}>
                                Ta progression sera sauvegardée. Es-tu sûr de vouloir quitter ?
                            </p>

                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    onClick={() => setShowQuitModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: `${8 * textScale}px 0`,
                                        background: "transparent",
                                        border: "1px solid #30363d",
                                        color: "#8b949e",
                                        borderRadius: 5 * textScale,
                                        fontSize: 13 * textScale,
                                        cursor: "pointer",
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => navigate(`/demo/node/${nodeId}?lesson=${lessonId}`)}
                                    style={{
                                        flex: 1,
                                        padding: `${8 * textScale}px 0`,
                                        background: "rgba(239,68,68,0.1)",
                                        border: "1px solid rgba(239,68,68,0.3)",
                                        color: "#ef4444",
                                        borderRadius: 5 * textScale,
                                        fontSize: 13 * textScale,
                                        cursor: "pointer",
                                    }}
                                >
                                    Quitter
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Explanation Modal */}
                {showExplanation && (
                    <ExplanationModal
                        explanation={currentExplanation}
                        onClose={() => setShowExplanation(false)}
                    />
                )}
            </div>
        </div>
    );
};