import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCards, getQuestionById, upsertCard } from '../utils/srEngine';
import { initialNodes, isLessonCompleted } from '../data/graphData';
import { LessonProgressBar } from '../components/lessons/lessonProgressBar';
import { BlockRenderer } from '../components/lessons/blockRenderer';
import { ExplanationModal } from '../components/lessons/explanationModal';
import { useLessonTextSize } from '../hooks';
import type { ContentBlock, SRRating } from '../types/types';

interface BlockWithMetadata {
    block: ContentBlock;
    originalIndex: number;
}

const findNextLesson = () => {
    for (const node of initialNodes) {
        if ((node as any).kind === "profile") continue;
        if (!node.lessonPath) continue;
        for (let i = 0; i < node.lessonPath.length; i++) {
            const lesson = node.lessonPath[i];
            if (!isLessonCompleted(node.id, lesson.id)) {
                return { node, lesson };
            }
        }
    }
    return null;
};

export const StrengthenSessionPage: React.FC = () => {
    const navigate = useNavigate();
    const [blocks, setBlocks] = useState<BlockWithMetadata[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<Map<number, { correct: boolean; rating?: SRRating; userAnswer?: any }>>(new Map());
    const [showExplanation, setShowExplanation] = useState(false);
    const [currentExplanation, setCurrentExplanation] = useState<string>("");
    const [showQuitModal, setShowQuitModal] = useState(false);
    const [totalCards, setTotalCards] = useState(0);
    const { textScale } = useLessonTextSize();

    useEffect(() => {
        const settingsStr = localStorage.getItem('strengthen_settings');
        const settings = settingsStr ? JSON.parse(settingsStr) : { sessionLength: 20 };

        const allSRCards = getAllCards();
        const dueCards = allSRCards.filter(c => new Date(c.dueDate) <= new Date());

        if (dueCards.length === 0) {
            const nextLesson = findNextLesson();
            if (nextLesson) {
                navigate(`/demo/lesson/${nextLesson.node.id}/${nextLesson.lesson.id}`);
            } else {
                navigate('/demoHome');
            }
            return;
        }

        // Convert SRCards to quiz blocks
        const quizBlocks: BlockWithMetadata[] = dueCards
            .slice(0, settings.sessionLength)
            .map((srCard, index): BlockWithMetadata | null => {
                const questionData = getQuestionById(srCard.questionId);
                if (!questionData) return null;

                return {
                    block: {
                        type: "quiz",
                        question: questionData.fullQuestion,
                    },
                    originalIndex: index,
                };
            })
            .filter((block): block is BlockWithMetadata => block !== null);

        setBlocks(quizBlocks);
        setTotalCards(quizBlocks.length);
    }, [navigate]);

    if (blocks.length === 0) {
        return null;
    }

    const currentBlockMeta = blocks[currentIndex];
    const currentBlock = currentBlockMeta?.block;
    const isLastBlock = currentIndex === blocks.length - 1;
    const color = "#a5b4fc";
    const isReviewMode = currentBlock?.type === "quiz" && quizAnswers.has(currentIndex);

    const handleQuizComplete = (correct: boolean, rating: SRRating, userAnswer: any) => {
        const card = getAllCards()[currentBlockMeta.originalIndex];
        if (card) {
            upsertCard(card.questionId, card.nodeId, rating);
        }
        setQuizAnswers(prev => new Map(prev).set(currentIndex, { correct, rating, userAnswer }));
    };

    const handleExplain = (explanation: string) => {
        setCurrentExplanation(explanation);
        setShowExplanation(true);
    };

    const handleNext = () => {
        if (isLastBlock) {
            // Show completion and navigate home
            navigate('/demoHome');
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

    return (
        <div style={{
            height: "100dvh",
            background: "#0b0f14",
            display: "flex",
            overflow: "hidden",
        }}>
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
                                Session de révision
                            </div>
                            <div style={{ color: "#484f58", fontSize: 11 * textScale, marginTop: 2 }}>
                                Carte {currentIndex + 1} / {totalCards}
                            </div>
                        </div>
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

                {/* Content Zone */}
                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#21262d transparent",
                }}>
                    <div style={{
                        width: "min(700px, 100%)",
                        margin: "0 auto",
                        padding: "32px 24px",
                        minHeight: "100%",
                    }}>
                        {currentBlock && (
                            <BlockRenderer
                                key={currentIndex}
                                block={currentBlock}
                                color={color}
                                nodeId="strengthen"
                                onQuizComplete={handleQuizComplete}
                                onExplain={handleExplain}
                                isAnswered={quizAnswers.has(currentIndex)}
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
                                            ? "Terminer la session ✓"
                                            : "Continuer →"
                                }
                            />
                        )}
                    </div>
                </div>

                {/* Quit Modal */}
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
                        <div style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "#161b22",
                            border: "1px solid #30363d",
                            borderRadius: 8,
                            padding: 16,
                            zIndex: 1000,
                            width: 280,
                            boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
                        }}>
                            <p style={{ color: "#8b949e", fontSize: 13, margin: "0 0 16px 0" }}>
                                Quitter la session de révision ?
                            </p>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    onClick={() => setShowQuitModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: "8px 0",
                                        background: "transparent",
                                        border: "1px solid #30363d",
                                        color: "#8b949e",
                                        borderRadius: 5,
                                        fontSize: 13,
                                        cursor: "pointer",
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => navigate('/demoHome')}
                                    style={{
                                        flex: 1,
                                        padding: "8px 0",
                                        background: "rgba(239,68,68,0.1)",
                                        border: "1px solid rgba(239,68,68,0.3)",
                                        color: "#ef4444",
                                        borderRadius: 5,
                                        fontSize: 13,
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