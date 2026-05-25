import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getStoredSession, clearStoredSession, type SessionBlock, storeSession } from '../helpers/sessionBuilder';
import { getDueCount, upsertCard } from '../utils/srEngine';
import { LessonProgressBar } from '../components/lessons/lessonProgressBar';
import { BlockRenderer } from '../components/lessons/blockRenderer';
import { ExplanationModal } from './modals';
import { useLessonTextSize } from '../hooks';
import type { SRRating } from '../types';
import { FeedbackButton } from '../components/feedbackBtn';
import { FeedbackModal } from './modals/feedbackModal';
import { completeLesson, getNodeCompletionPercent, getVisibleIds, initialNodes, isLessonCompleted } from '../data/graphData';
import { getStrengthenBlocks } from '../helpers/sessionBuilder';

export const FullSessionPage: React.FC = () => {
    const navigate = useNavigate();
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [blocks, setBlocks] = useState<SessionBlock[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<Map<number, { correct: boolean; rating?: SRRating; userAnswer?: any }>>(new Map());
    const [showExplanation, setShowExplanation] = useState(false);
    const [currentExplanation, setCurrentExplanation] = useState<string>("");
    const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
    const [showQuitModal, setShowQuitModal] = useState(false);
    const [showCompletion, setShowCompletion] = useState(false);
    const [showPathSelector, setShowPathSelector] = useState(false);

    const { textScale } = useLessonTextSize();

    useEffect(() => {
        const session = getStoredSession();
        if (!session || session.length === 0) {
            // No session, redirect home
            navigate('/demoHome');
            return;
        }
        setBlocks(session);
    }, [navigate]);

    if (blocks.length === 0) {
        return null;
    }

    const currentBlockMeta = blocks[currentIndex];
    const currentBlock = currentBlockMeta?.block;
    const isLastBlock = currentIndex === blocks.length - 1;
    const color = currentBlockMeta?.color || '#a5b4fc';
    const isReviewMode = currentBlock?.type === 'quiz' && quizAnswers.has(currentIndex);

    const handleQuizComplete = (correct: boolean, rating: SRRating, userAnswer: any) => {
        if (currentBlockMeta.type === 'strengthen' && currentBlockMeta.questionId) {
            // Strengthen question
            upsertCard(currentBlockMeta.questionId, currentBlockMeta.nodeId, rating);

            setQuizAnswers(prev => new Map(prev).set(currentIndex, { correct, rating, userAnswer }));

            if (correct) {
                setCompletedQuestions(prev => new Set([...prev, currentBlockMeta.questionId!]));
            }

            // If wrong and not already completed, add retry
            if (!correct && currentBlockMeta.questionId && !completedQuestions.has(currentBlockMeta.questionId)) {
                const retryBlock: SessionBlock = {
                    ...currentBlockMeta,
                };
                setBlocks(prev => [...prev, retryBlock]);
            }
        } else if (currentBlockMeta.type === 'lesson' && currentBlockMeta.nodeId && currentBlockMeta.lessonId) {
            // Lesson quiz
            const questionId = currentBlock.type === 'quiz' && currentBlock.questionId
                ? `${currentBlockMeta.nodeId}::${currentBlock.questionId}`
                : `${currentBlockMeta.nodeId}::${currentBlockMeta.lessonId}::${currentBlockMeta.originalIndex}`;

            upsertCard(questionId, currentBlockMeta.nodeId, rating);
            setQuizAnswers(prev => new Map(prev).set(currentIndex, { correct, rating, userAnswer }));

            // If wrong, add retry
            if (!correct) {
                const retryBlock: SessionBlock = {
                    ...currentBlockMeta,
                };
                setBlocks(prev => [...prev, retryBlock]);
            }
        }
    };

    const handleExplain = (explanation: string) => {
        setCurrentExplanation(explanation);
        setShowExplanation(true);
    };

    const handleNext = () => {
        if (isLastBlock) {
            // Mark lessons as completed
            const lessonsCompleted = new Set<string>();
            blocks.forEach(b => {
                if (b.type === 'lesson' && b.nodeId && b.lessonId) {
                    const key = `${b.nodeId}::${b.lessonId}`;
                    if (!lessonsCompleted.has(key)) {
                        completeLesson(b.nodeId, b.lessonId);
                        lessonsCompleted.add(key);
                    }
                }
            });

            // Clear session
            clearStoredSession();

            // Show completion
            setShowCompletion(true);
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
        if (currentBlock.type !== 'quiz') return true;
        return quizAnswers.has(currentIndex);
    };

    // Get the last node we worked on in this session
    const lastNodeId = blocks.filter(b => b.type === 'lesson').slice(-1)[0]?.nodeId;
    const lastNode = initialNodes.find(n => n.id === lastNodeId);

    // Find children of the last node (nodes that have lastNodeId as prerequisite)
    const childrenNodes = initialNodes.filter(node => {
        if ((node as any).type === 'profile') return false;
        const prereqs = node.prerequisites || [];
        return prereqs.includes(lastNodeId);
    });

    // Find sibling nodes (nodes with same prerequisites, now visible)
    const visibleIds = getVisibleIds(initialNodes);
    const lastNodePrereqs = lastNode?.prerequisites || [];
    const siblingNodes = initialNodes.filter(node => {
        if ((node as any).type === 'profile') return false;
        if (node.id === lastNodeId) return false;
        if (!visibleIds.has(node.id)) return false;

        const nodePrereqs = node.prerequisites || [];
        // Siblings share at least one prerequisite
        return lastNodePrereqs.length > 0 &&
            lastNodePrereqs.some(p => nodePrereqs.includes(p));
    });

    // Combine children and siblings, filter incomplete only
    const availablePaths = [...childrenNodes, ...siblingNodes]
        .filter((node, index, self) =>
            self.findIndex(n => n.id === node.id) === index // Deduplicate
        )
        .filter(node => {
            if (!node.lessonPath || node.lessonPath.length === 0) return false;
            const completion = getNodeCompletionPercent(node.id);
            return completion < 100;
        })
        .map(node => {
            const nextLesson = node.lessonPath.find(lesson =>
                !isLessonCompleted(node.id, lesson.id)
            );
            const completion = getNodeCompletionPercent(node.id);
            const color = (node as any).branchColor || '#a5b4fc';

            return {
                node,
                nextLesson,
                completion,
                color,
            };
        })
        .sort((a, b) => b.completion - a.completion); // Sort by progress

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
                    colors={blocks.map(b => b.color)}
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
                                Session personnalisée
                            </div>
                            <div style={{ color: "#484f58", fontSize: 11 * textScale, marginTop: 2 }}>
                                {currentBlockMeta.type === 'lesson' ? '📚' : '💪'} {currentBlockMeta.nodeTitle}
                                {currentBlockMeta.lessonTitle && ` • ${currentBlockMeta.lessonTitle}`}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                            color: "#6e7681",
                            fontSize: 12 * textScale,
                            fontWeight: 600,
                        }}>
                            {currentIndex + 1}/{blocks.length}
                        </div>
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

                {/* Content */}
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
                                nodeId={currentBlockMeta.nodeId}
                                onQuizComplete={handleQuizComplete}
                                onExplain={handleExplain}
                                isAnswered={quizAnswers.has(currentIndex)}
                                isRetry={false}
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

                {/* Completion Modal */}
                {showCompletion && (
                    <>
                        <div
                            style={{
                                position: "fixed",
                                inset: 0,
                                background: "rgba(0,0,0,0.75)",
                                backdropFilter: "blur(8px)",
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
                            borderRadius: 12,
                            padding: 24,
                            zIndex: 1000,
                            width: "min(420px, 90vw)",
                            boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
                        }}>
                            <div style={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                background: `${color}18`,
                                border: `2px solid ${color}44`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 24,
                                margin: "0 auto 20px",
                            }}>
                                ✓
                            </div>

                            <h2 style={{
                                color: "#c9d1d9",
                                fontSize: 18,
                                fontWeight: 600,
                                margin: "0 0 8px 0",
                                textAlign: "center",
                            }}>
                                Bravo ! Session terminée
                            </h2>

                            <p style={{
                                color: "#8b949e",
                                fontSize: 13,
                                margin: "0 0 24px 0",
                                textAlign: "center",
                                lineHeight: 1.5,
                            }}>
                                Tu as complété {blocks.length} exercice{blocks.length > 1 ? 's' : ''}. Excellent travail !
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {/* Choose Path button */}
                                {availablePaths.length > 0 && (
                                    <button
                                        onClick={() => setShowPathSelector(true)}
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px",
                                            background: "linear-gradient(135deg, #a5b4fc 0%, #8b9dfc 100%)",
                                            border: "none",
                                            borderRadius: 6,
                                            color: "#0d1117",
                                            fontSize: 13,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            transition: "all 0.15s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-1px)";
                                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(165,180,252,0.4)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        Choisir un parcours →
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        const dueCount = getDueCount();
                                        if (dueCount > 0) {
                                            // Build strengthen-only session
                                            const strengthenBlocks = getStrengthenBlocks(dueCount);
                                            storeSession(strengthenBlocks);
                                            // Reload page to start new session
                                            window.location.reload();
                                        }
                                    }}
                                    disabled={getDueCount() === 0}
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        background: getDueCount() === 0 ? "#161b22" : "#21262d",
                                        border: `1px solid ${getDueCount() === 0 ? "#21262d" : "#30363d"}`,
                                        borderRadius: 6,
                                        color: getDueCount() === 0 ? "#484f58" : "#c9d1d9",
                                        fontSize: 13,
                                        fontWeight: 500,
                                        cursor: getDueCount() === 0 ? "not-allowed" : "pointer",
                                        opacity: getDueCount() === 0 ? 0.6 : 1,
                                        transition: "all 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        const dueCount = getDueCount();
                                        if (dueCount > 0) {
                                            e.currentTarget.style.background = "#30363d";
                                            e.currentTarget.style.borderColor = color;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        const dueCount = getDueCount();
                                        if (dueCount > 0) {
                                            e.currentTarget.style.background = "#21262d";
                                            e.currentTarget.style.borderColor = "#30363d";
                                        }
                                    }}
                                >
                                    {getDueCount() === 0 ? 'Aucune révision disponible' : `Continuer la révision (${getDueCount()} carte${getDueCount() > 1 ? 's' : ''})`}
                                </button>

                                <button
                                    onClick={() => navigate('/demoHome')}
                                    style={{
                                        width: "100%",
                                        padding: "12px 14px",
                                        background: "#161b22",
                                        border: "1px solid #30363d",
                                        borderRadius: 6,
                                        color: "#8b949e",
                                        fontSize: 13,
                                        fontWeight: 500,
                                        cursor: "pointer",
                                        transition: "all 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#1c2128";
                                        e.currentTarget.style.color = "#c9d1d9";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "#161b22";
                                        e.currentTarget.style.color = "#8b949e";
                                    }}
                                >
                                    Retour à l'accueil
                                </button>
                            </div>
                        </div>
                    </>
                )}

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
                                Quitter la session ?
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
                                    onClick={() => {
                                        clearStoredSession();
                                        navigate('/demoHome');
                                    }}
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

                {showExplanation && (
                    <ExplanationModal
                        explanation={currentExplanation}
                        onClose={() => setShowExplanation(false)}
                    />
                )}
            </div>

            <FeedbackButton onClick={() => setFeedbackOpen(true)} />
            {feedbackOpen && (
                <FeedbackModal onClose={() => setFeedbackOpen(false)} from="FullSessionPage" />
            )}

            {/* Path Selector Modal */}
            {showPathSelector && (
                <>
                    <div
                        onClick={() => setShowPathSelector(false)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.5)",
                            zIndex: 1001,
                        }}
                    />
                    <div style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "#161b22",
                        border: "1px solid #30363d",
                        borderRadius: 12,
                        padding: "20px 24px",
                        zIndex: 1002,
                        width: "min(440px, 90vw)",
                        maxHeight: "70vh",
                        overflowY: "auto",
                        boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 16,
                        }}>
                            <h3 style={{
                                color: "#c9d1d9",
                                fontSize: 16,
                                fontWeight: 600,
                                margin: 0,
                            }}>
                                Choisir un parcours
                            </h3>
                            <button
                                onClick={() => setShowPathSelector(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#484f58",
                                    cursor: "pointer",
                                    fontSize: 20,
                                    lineHeight: 1,
                                    padding: 0,
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{
                            color: "#8b949e",
                            fontSize: 12,
                            marginBottom: 16,
                        }}>
                            Sélectionne un parcours pour continuer ton apprentissage
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {availablePaths.map(({ node, nextLesson, completion, color }) => (
                                <button
                                    key={node.id}
                                    onClick={() => {
                                        if (nextLesson) {
                                            clearStoredSession();
                                            navigate(`/demo/lesson/${node.id}/${nextLesson.id}`);
                                        }
                                    }}
                                    style={{
                                        width: "100%",
                                        background: "#0d1117",
                                        border: "1px solid #21262d",
                                        borderRadius: 8,
                                        padding: "14px 16px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        transition: "all 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#161b22";
                                        e.currentTarget.style.borderColor = color;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "#0d1117";
                                        e.currentTarget.style.borderColor = "#21262d";
                                    }}
                                >
                                    <div style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        background: color,
                                        boxShadow: `0 0 8px ${color}66`,
                                        flexShrink: 0,
                                    }} />

                                    <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                                        <div style={{
                                            color: "#c9d1d9",
                                            fontSize: 13,
                                            fontWeight: 500,
                                            marginBottom: 4,
                                        }}>
                                            {node.title}
                                        </div>

                                        {nextLesson && (
                                            <div style={{
                                                color: "#6e7681",
                                                fontSize: 11,
                                            }}>
                                                Prochain : {nextLesson.title}
                                            </div>
                                        )}

                                        {/* Progress bar */}
                                        <div style={{
                                            marginTop: 6,
                                            width: "100%",
                                            height: 4,
                                            background: "#21262d",
                                            borderRadius: 2,
                                            overflow: "hidden",
                                        }}>
                                            <div style={{
                                                width: `${completion}%`,
                                                height: "100%",
                                                background: color,
                                                transition: "width 0.3s ease",
                                            }} />
                                        </div>
                                    </div>

                                    <div style={{
                                        color: color,
                                        fontSize: 11,
                                        fontWeight: 600,
                                    }}>
                                        {completion}%
                                    </div>

                                    <div style={{
                                        color: color,
                                        fontSize: 16,
                                    }}>
                                        →
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};