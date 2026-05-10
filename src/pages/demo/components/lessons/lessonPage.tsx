import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ContentBlock, SRRating } from "../../constants/types";
import { initialNodes, completeLesson } from "../../data/graphData";
import { upsertCard } from "../../helpers/srEngine";
import { LessonProgressBar } from "./lessonProgressBar";
import { BlockRenderer } from "./blockRenderer";
import { ExplanationModal } from "./explanationModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlockWithMetadata {
    block: ContentBlock;
    originalIndex: number;
    isRetry?: boolean; // if this is a re-added wrong quiz
}

// ─── Dock Components ──────────────────────────────────────────────────────────

const DockBtn: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}> = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        title={label}
        style={{
            width: 40,
            height: 40,
            background: "none",
            border: "1px solid transparent",
            borderRadius: 10,
            color: "#484f58",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 16,
            transition: "all 0.15s ease",
        }}
    >
        {icon}
    </button>
);

const Divider = () => (
    <div style={{
        width: 24,
        height: 1,
        background: "#21262d",
        margin: "2px 0",
    }} />
);

const BackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const LessonPage: React.FC = () => {
    const { nodeId, lessonId } = useParams<{ nodeId: string; lessonId: string }>();
    const navigate = useNavigate();

    const node = initialNodes.find(n => n.id === nodeId);
    const lessonIndex = node?.lessonPath.findIndex(l => l.id === lessonId) ?? -1;
    const lesson = node?.lessonPath[lessonIndex];

    const [blocks, setBlocks] = useState<BlockWithMetadata[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<Map<number, { correct: boolean; rating?: SRRating }>>(new Map());
    // const [wrongQuizIndices, setWrongQuizIndices] = useState<Set<number>>(new Set());
    const [showExplanation, setShowExplanation] = useState(false);
    const [currentExplanation, setCurrentExplanation] = useState<string>("");

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
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#0b0f14",
                color: "#484f58",
                fontSize: 14,
            }}>
                Leçon introuvable.
                <span
                    onClick={() => navigate(`/demo/node/${nodeId}`)}
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
    const color = "#a5b4fc"; // Use consistent color

    // Handle quiz completion
    const handleQuizComplete = (correct: boolean, rating: SRRating) => {
        const questionId = `${nodeId}::${lessonId}::${currentBlockMeta.originalIndex}`;

        // Update quiz answers
        setQuizAnswers(prev => new Map(prev).set(currentIndex, { correct, rating }));

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
                navigate(`/demo/node/${nodeId}`);
            }
        } else {
            setCurrentIndex(i => i + 1);
        }
    };

    const canContinue = () => {
        if (!currentBlock) return false;
        if (currentBlock.type !== "quiz") return true;
        return quizAnswers.has(currentIndex);
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div style={{
            height: "100vh",
            background: "#0b0f14",
            display: "flex",
            overflow: "hidden",
        }}>
            {/* Left Dock (desktop) */}
            <div
                className="hidden sm:flex flex-col items-center shrink-0 border-r border-[#21262d] bg-[#161b22] py-3 gap-1"
                style={{ width: 56 }}
            >
                <DockBtn
                    icon={<BackIcon />}
                    label="Retour"
                    onClick={() => navigate(`/demo/node/${nodeId}`)}
                />
                <Divider />
                <DockBtn
                    icon="💪"
                    label="S'entraîner"
                    onClick={() => {/* strengthen */ }}
                />
            </div>

            {/* Main column */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
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
                            <div style={{ color: "#c9d1d9", fontSize: 14, fontWeight: 500 }}>
                                {lesson.title}
                            </div>
                            <div style={{ color: "#484f58", fontSize: 11, marginTop: 2 }}>
                                {node.title}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(`/demo/node/${nodeId}`)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#484f58",
                            fontSize: 20,
                            cursor: "pointer",
                            padding: 4,
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Content Zone - Scrollable */}
                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#21262d transparent",
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <div style={{
                        width: "min(700px, 100%)",
                        margin: "0 auto",
                        padding: "32px 24px",
                        flex: 1,
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
                                onContinue={handleNext}
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