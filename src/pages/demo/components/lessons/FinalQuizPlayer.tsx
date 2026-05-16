import React, { useState } from "react";
import { type Lesson, type NodeType, completeFinalQuiz, getDynamicNodes } from "../../data/graphData";
import { type SRRating } from "../../types/types";
// import { QuizBlockPlayer } from "./quizBlockPlayer";
import { BlockRenderer } from "./blockRenderer";
// import { useLessonTextSize } from "../../hooks";
import { useNavigate } from "react-router-dom";


interface FinalQuizPlayerProps {
    node: NodeType;
    lesson: Lesson;
    onComplete: () => void;
    onClose: () => void;
}

export const FinalQuizPlayer: React.FC<FinalQuizPlayerProps> = ({
    node,
    lesson,
    onComplete,
    onClose,
}) => {
    const navigate = useNavigate();
    const [mistakes, setMistakes] = useState(0);
    const [showFailModal, setShowFailModal] = useState(false);
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [explanationModalContent, setExplanationModalContent] = useState<string | null>(null);
    // const textScale = useLessonTextSize().textScale;

    const MAX_MISTAKES = 3;
    const currentBlock = lesson.blocks[currentBlockIndex];
    const isLastBlock = currentBlockIndex === lesson.blocks.length - 1;
    const color = "#a5b4fc"; // Node color

    const handleQuizComplete = (correct: boolean, _rating: SRRating, _userAnswer: any) => {
        if (!correct) {
            const newMistakes = mistakes + 1;
            setMistakes(newMistakes);

            if (newMistakes >= MAX_MISTAKES) {
                setShowFailModal(true);
                return;
            }
        }
        // Quiz answer submitted, user clicks "Continuer" to move forward
    };

    const handleContinue = () => {
        if (isLastBlock) {
            // Quiz completed successfully!
            completeFinalQuiz(node.id, lesson.id);

            // Find next unlocked node
            const updatedNodes = getDynamicNodes();
            const nextNode = updatedNodes.find(n =>
                n.isUnlocked &&
                n.prerequisites.includes(node.id) &&
                n.lessonPath.length > 0
            );

            if (nextNode) {
                // Navigate immediately to next node
                const firstLesson = nextNode.lessonPath[0];
                navigate(`/demo/node/${nextNode.id}?lesson=${firstLesson.id}`);
                // Close the modal
                onClose();
            } else {
                // No next node, just complete normally
                onComplete();
            }
        } else {
            setCurrentBlockIndex(currentBlockIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentBlockIndex > 0) {
            setCurrentBlockIndex(currentBlockIndex - 1);
        }
    };

    const handleRestart = () => {
        setMistakes(0);
        setCurrentBlockIndex(0);
        setShowFailModal(false);
    };

    const handleExplain = (explanation: string) => {
        setExplanationModalContent(explanation);
    };

    // Fail modal
    if (showFailModal) {
        return (
            <>
                <style>{`
                    @keyframes modalSlideIn {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                `}</style>
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.85)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 100,
                }}>
                    <div style={{
                        background: "linear-gradient(135deg, #1c2128 0%, #161b22 100%)",
                        border: "2px solid #ef4444",
                        borderRadius: 20,
                        padding: 40,
                        maxWidth: 440,
                        textAlign: "center",
                        animation: "modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        boxShadow: "0 24px 60px rgba(239,68,68,0.4)",
                    }}>
                        <div style={{ fontSize: 64, marginBottom: 20 }}>❌</div>
                        <h2 style={{
                            color: "#c9d1d9",
                            fontSize: 24,
                            fontWeight: 700,
                            marginBottom: 12,
                        }}>
                            3 erreurs atteintes
                        </h2>
                        <p style={{
                            color: "#8b949e",
                            fontSize: 15,
                            lineHeight: 1.6,
                            marginBottom: 32,
                        }}>
                            Tu as fait {MAX_MISTAKES} erreurs. Révise le contenu du module et réessaie le quiz final !
                        </p>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                            <button
                                onClick={onClose}
                                style={{
                                    flex: 1,
                                    padding: "12px 24px",
                                    background: "#21262d",
                                    border: "1px solid #30363d",
                                    borderRadius: 10,
                                    color: "#8b949e",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                }}
                            >
                                Quitter
                            </button>
                            <button
                                onClick={handleRestart}
                                style={{
                                    flex: 1,
                                    padding: "12px 24px",
                                    background: "linear-gradient(135deg, #a5b4fc 0%, #8b9dfc 100%)",
                                    border: "none",
                                    borderRadius: 10,
                                    color: "#0d1117",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                    boxShadow: "0 4px 12px rgba(165,180,252,0.4)",
                                }}
                            >
                                Recommencer
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div style={{
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
        }}>
            {/* Header with mistake counter */}
            <div style={{
                position: "sticky",
                top: 0,
                background: "#0b0f14",
                borderBottom: "1px solid #21262d",
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 10,
            }}>
                <div>
                    <div style={{
                        color: "#a5b4fc",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontWeight: 600,
                        marginBottom: 4,
                    }}>
                        Quiz Final
                    </div>
                    <div style={{
                        color: "#c9d1d9",
                        fontSize: 18,
                        fontWeight: 700,
                    }}>
                        {node.title}
                    </div>
                </div>

                {/* Mistake counter */}
                <div style={{
                    background: mistakes >= 2
                        ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                        : "linear-gradient(135deg, #21262d 0%, #1c2128 100%)",
                    border: `2px solid ${mistakes >= 2 ? "#ef4444" : "#30363d"}`,
                    borderRadius: 12,
                    padding: "10px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: mistakes >= 2 ? "0 4px 16px rgba(239,68,68,0.3)" : "none",
                }}>
                    <span style={{ fontSize: 18 }}>❌</span>
                    <span style={{
                        color: mistakes >= 2 ? "#fff" : "#c9d1d9",
                        fontWeight: 700,
                        fontSize: 16,
                    }}>
                        {mistakes} / {MAX_MISTAKES}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div style={{
                flex: 1,
                padding: "24px 20px",
                maxWidth: 800,
                width: "100%",
                margin: "0 auto",
            }}>
                {/* Progress indicator */}
                <div style={{
                    marginBottom: 24,
                    padding: "12px 16px",
                    background: "#161b22",
                    border: "1px solid #21262d",
                    borderRadius: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <span style={{
                        color: "#6e7681",
                        fontSize: 13,
                    }}>
                        Question {currentBlockIndex + 1} sur {lesson.blocks.length}
                    </span>
                    <div style={{
                        width: 120,
                        height: 6,
                        background: "#21262d",
                        borderRadius: 3,
                        overflow: "hidden",
                    }}>
                        <div style={{
                            width: `${((currentBlockIndex + 1) / lesson.blocks.length) * 100}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #a5b4fc 0%, #8b9dfc 100%)",
                            transition: "width 0.3s ease",
                        }} />
                    </div>
                </div>

                {/* Render current block */}
                <BlockRenderer
                    block={currentBlock}
                    color={color}
                    nodeId={node.id}
                    onQuizComplete={handleQuizComplete}
                    onExplain={handleExplain}
                    isAnswered={false}
                    onContinue={handleContinue}
                    onPrevious={currentBlockIndex > 0 ? handlePrevious : undefined}
                    canContinue={true}
                    buttonLabel={isLastBlock ? "Terminer" : "Continuer →"}
                />
            </div>

            {/* Explanation modal */}
            {explanationModalContent && (
                <div
                    onClick={() => setExplanationModalContent(null)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 100,
                        padding: 20,
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: "#161b22",
                            border: "1px solid #30363d",
                            borderRadius: 16,
                            padding: 28,
                            maxWidth: 600,
                            width: "100%",
                        }}
                    >
                        <div style={{
                            color: "#a5b4fc",
                            fontSize: 12,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 600,
                            marginBottom: 12,
                        }}>
                            Explication
                        </div>
                        <p style={{
                            color: "#c9d1d9",
                            fontSize: 15,
                            lineHeight: 1.7,
                            margin: 0,
                            marginBottom: 24,
                        }}>
                            {explanationModalContent}
                        </p>
                        <button
                            onClick={() => setExplanationModalContent(null)}
                            style={{
                                width: "100%",
                                padding: "12px 0",
                                background: `${color}22`,
                                border: `1px solid ${color}66`,
                                color,
                                borderRadius: 8,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                            }}
                        >
                            Compris
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};