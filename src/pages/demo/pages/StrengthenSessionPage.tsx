import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAllCards, getQuestionById, upsertCard, getDueCount } from '../utils/srEngine';
import { initialNodes, isLessonCompleted } from '../data/graphData';
import { LessonProgressBar } from '../components/lessons/lessonProgressBar';
import { BlockRenderer } from '../components/lessons/blockRenderer';
import { ExplanationModal } from './modals';
import { useLessonTextSize } from '../hooks';
import type { SRRating, StrengthenBlockMetadata } from '../types';
import { FeedbackButton } from '../components/feedbackBtn';
import { FeedbackModal } from './modals/feedbackModal';

export const StrengthenSessionPage: React.FC = () => {
    const navigate = useNavigate();
    const [feedbackOpen, setFeedbackOpen] = useState(false);


    // Helper to check if a question's lesson is accessible
    const isQuestionAccessible = (questionId: string, nodeId: string): boolean => {
        const questionData = getQuestionById(questionId);
        if (!questionData) return false;

        const targetNode = initialNodes.find(n => n.id === nodeId);
        if (!targetNode?.lessonPath) return false;

        const lessonIndex = targetNode.lessonPath.findIndex(l => l.id === questionData.lessonId);
        if (lessonIndex === -1) return false;

        // Check if all previous lessons are completed
        for (let i = 0; i < lessonIndex; i++) {
            if (!isLessonCompleted(nodeId, targetNode.lessonPath[i].id)) {
                return false;
            }
        }
        return true;
    };

    const [blocks, setBlocks] = useState<StrengthenBlockMetadata[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<Map<number, { correct: boolean; rating?: SRRating; userAnswer?: any }>>(new Map());
    const [showExplanation, setShowExplanation] = useState(false);
    const [currentExplanation, setCurrentExplanation] = useState<string>("");
    const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
    const [showQuitModal, setShowQuitModal] = useState(false);
    const [totalCards, setTotalCards] = useState(0);
    const [showCompletion, setShowCompletion] = useState(false);
    const { textScale } = useLessonTextSize();

    useEffect(() => {
        const settingsStr = localStorage.getItem('strengthen_settings');
        const settings = settingsStr ? JSON.parse(settingsStr) : { sessionLength: 20 };

        // console.log("=== STRENGTHEN SESSION DEBUG ===");
        // console.log("Settings:", settings);
        // console.log("selectedTopics:", settings.selectedTopics);
        // console.log("mode:", settings.mode);
        // console.log("sessionLength:", settings.sessionLength);

        const allSRCards = getAllCards();
        const today = new Date().toISOString().split("T")[0];

        // console.log("Total SR cards:", allSRCards.length);

        // Filter by node if selectedTopics is specified
        let relevantCards = allSRCards;
        if (settings.selectedTopics && settings.selectedTopics.length > 0) {
            relevantCards = allSRCards.filter(card =>
                settings.selectedTopics.includes(card.nodeId)
            );
            // console.log("Filtered to node-specific cards:", relevantCards.length);
        }

        // Filter by due date UNLESS mode is 'all'
        let dueCards = settings.mode === 'all'
            ? relevantCards  // Show all cards from the node, regardless of due date
            : relevantCards.filter(c => c.dueDate <= today);  // Only show due cards

        // Filter out locked questions (questions from lessons not yet accessible)
        dueCards = dueCards.filter(card => isQuestionAccessible(card.questionId, card.nodeId));
        // console.log("Due cards (after date filter):", dueCards.length);

        // Apply session length limit ONLY for global sessions (not node-specific)
        const isNodeSpecific = settings.selectedTopics && settings.selectedTopics.length > 0;
        const cardsToUse = isNodeSpecific
            ? dueCards  // Node-specific: show ALL cards from the node
            : dueCards.slice(0, settings.sessionLength);  // Global: apply session length limit

        // Convert SRCards to quiz blocks (filter out invalid questions)
        const quizBlocks: StrengthenBlockMetadata[] = cardsToUse
            .map((srCard, index): StrengthenBlockMetadata | null => {
                const questionData = getQuestionById(srCard.questionId);
                if (!questionData) {
                    console.warn(`Question not found for card: ${srCard.questionId}`);
                    return null;
                }

                return {
                    block: {
                        type: "quiz",
                        question: questionData.fullQuestion,
                    },
                    originalIndex: index,
                    questionId: srCard.questionId,
                    nodeId: srCard.nodeId,
                    isRetry: false,
                };
            })
            .filter((block): block is StrengthenBlockMetadata => block !== null);

        // If no valid blocks after filtering, redirect
        if (quizBlocks.length === 0) {
            // console.log("No valid quiz blocks found, redirecting...");
            const nextLesson = findNextLesson();
            if (nextLesson) {
                navigate(`/demo/lesson/${nextLesson.node.id}/${nextLesson.lesson.id}`);
            } else {
                navigate('/demoHome');
            }
            return;
        }

        setBlocks(quizBlocks);
        setTotalCards(quizBlocks.length);

        // Don't clear settings here - they'll be cleared when session completes
        // console.log("Session loaded with", quizBlocks.length, "cards");
    }, [navigate]);

    if (blocks.length === 0) {
        return null;
    }

    const currentBlockMeta = blocks[currentIndex];
    const currentBlock = currentBlockMeta?.block;
    const isLastBlock = currentIndex === blocks.length - 1;
    const color = "#a5b4fc";
    const isReviewMode = currentBlock?.type === "quiz" && quizAnswers.has(currentIndex);

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

    const findBestNextLesson = () => {
        const arePrerequisitesMet = (nodeId: string) => {
            const node = initialNodes.find(n => n.id === nodeId);
            if (!node) return false;
            return node.prerequisites.every(prereqId => {
                const prereqNode = initialNodes.find(n => n.id === prereqId);
                if (!prereqNode?.lessonPath) return true;
                return prereqNode.lessonPath.every(lesson =>
                    isLessonCompleted(prereqId, lesson.id)
                );
            });
        };

        const activeTopics = initialNodes
            .filter(node => {
                if ((node as any).kind === "profile") return false;
                if (!node.lessonPath || node.lessonPath.length === 0) return false;
                if (!node.isUnlocked && !arePrerequisitesMet(node.id)) return false;
                return node.lessonPath.some(lesson =>
                    !isLessonCompleted(node.id, lesson.id)
                );
            })
            .map(node => {
                const nextLesson = node.lessonPath.find(lesson =>
                    !isLessonCompleted(node.id, lesson.id)
                );
                const completedCount = node.lessonPath.filter(lesson =>
                    isLessonCompleted(node.id, lesson.id)
                ).length;
                const progress = completedCount / node.lessonPath.length;
                return { node, nextLesson: nextLesson!, progress };
            })
            .sort((a, b) => b.progress - a.progress);

        return activeTopics[0] || null;
    };

    const handleQuizComplete = (correct: boolean, rating: SRRating, userAnswer: any) => {
        const questionId = currentBlockMeta.questionId;
        const nodeId = currentBlockMeta.nodeId;

        // Update the SR card with the rating (schedules next review)
        upsertCard(questionId, nodeId, rating);

        // Record the answer
        setQuizAnswers(prev => new Map(prev).set(currentIndex, { correct, rating, userAnswer }));

        // If correct, mark this question as completed for this session
        if (correct) {
            setCompletedQuestions(prev => new Set([...prev, questionId]));
        }

        // If wrong AND not already completed in this session, add to end
        if (!correct && !completedQuestions.has(questionId)) {
            const retryBlock: StrengthenBlockMetadata = {
                block: currentBlock,
                originalIndex: currentBlockMeta.originalIndex,
                questionId: currentBlockMeta.questionId,
                nodeId: currentBlockMeta.nodeId,
                isRetry: true,
            };
            setBlocks(prev => [...prev, retryBlock]);
        }
    };

    const handleExplain = (explanation: string) => {
        setCurrentExplanation(explanation);
        setShowExplanation(true);
    };

    const handleNext = () => {
        if (isLastBlock) {
            // Clear node-specific settings now that session is complete
            const settingsStr = localStorage.getItem('strengthen_settings');
            if (settingsStr) {
                const settings = JSON.parse(settingsStr);
                if (settings.selectedTopics || settings.mode) {
                    const { selectedTopics, mode, ...restSettings } = settings;
                    localStorage.setItem('strengthen_settings', JSON.stringify(restSettings));
                }
            }

            // Session complete - show completion modal
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
                    colors={blocks.map(b => {
                        const node = initialNodes.find(n => n.id === b.nodeId);
                        return (node as any)?.branchColor || "#a5b4fc";
                    })}
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
                                Carte {currentIndex + 1} / {blocks.length}
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
                                nodeId={currentBlockMeta.nodeId}
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
                                            ? "Terminer la session ✓"
                                            : "Continuer →"
                                }
                            />
                        )}
                    </div>
                </div>

                {/* Completion Panel */}
                {showCompletion && (() => {
                    const dueCount = getDueCount();
                    const nextLesson = findBestNextLesson();

                    return (
                        <>
                        <div
                            style={{
                                position: "fixed",
                                inset: 0,
                                background: "rgba(0,0,0,0.75)",
                                backdropFilter: "blur(8px)",
                                zIndex: 999,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 24,
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
                            {/* Success icon */}
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

                            {/* Title */}
                            <h2 style={{
                                color: "#c9d1d9",
                                fontSize: 18,
                                fontWeight: 600,
                                margin: "0 0 8px 0",
                                textAlign: "center",
                            }}>
                                Session terminée !
                            </h2>

                            <p style={{
                                color: "#8b949e",
                                fontSize: 13,
                                margin: "0 0 24px 0",
                                textAlign: "center",
                                lineHeight: 1.5,
                            }}>
                                Tu as révisé {totalCards} carte{totalCards > 1 ? 's' : ''}. Continue sur ta lancée ?
                            </p>

                            {/* Active topics */}
                            <div style={{
                                background: "#0d1117",
                                border: "1px solid #21262d",
                                borderRadius: 8,
                                padding: 16,
                                marginBottom: 20,
                            }}>
                                <div style={{
                                    color: "#484f58",
                                    fontSize: 10,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    marginBottom: 12,
                                }}>
                                    Parcours en cours
                                </div>

                                {(() => {
                                    // Helper: check if all prerequisites are completed
                                    const arePrerequisitesMet = (nodeId: string) => {
                                        const node = initialNodes.find(n => n.id === nodeId);
                                        if (!node) return false;

                                        // Check if all prerequisite nodes are fully completed
                                        return node.prerequisites.every(prereqId => {
                                            const prereqNode = initialNodes.find(n => n.id === prereqId);
                                            if (!prereqNode?.lessonPath) return true;

                                            // All lessons in prerequisite must be completed
                                            return prereqNode.lessonPath.every(lesson =>
                                                isLessonCompleted(prereqId, lesson.id)
                                            );
                                        });
                                    };

                                    // Find accessible nodes with incomplete lessons
                                    const activeTopics = initialNodes
                                        .filter(node => {
                                            // Skip profile node
                                            if ((node as any).kind === "profile") return false;

                                            // Must have lessons
                                            if (!node.lessonPath || node.lessonPath.length === 0) return false;

                                            // Prerequisites must be met
                                            if (!node.isUnlocked && !arePrerequisitesMet(node.id)) return false;

                                            // Must have incomplete lessons
                                            const hasIncomplete = node.lessonPath.some(lesson =>
                                                !isLessonCompleted(node.id, lesson.id)
                                            );

                                            return hasIncomplete;
                                        })
                                        .map(node => {
                                            const nextLesson = node.lessonPath.find(lesson =>
                                                !isLessonCompleted(node.id, lesson.id)
                                            );

                                            // Calculate progress to prioritize started paths
                                            const completedCount = node.lessonPath.filter(lesson =>
                                                isLessonCompleted(node.id, lesson.id)
                                            ).length;
                                            const progress = completedCount / node.lessonPath.length;

                                            return {
                                                node,
                                                nextLesson: nextLesson!,
                                                progress
                                            };
                                        })
                                        // Sort by progress (prioritize paths already started)
                                        .sort((a, b) => b.progress - a.progress)
                                        .slice(0, 3); // Show max 3 topics

                                    if (activeTopics.length === 0) {
                                        return (
                                            <div style={{
                                                color: "#6e7681",
                                                fontSize: 12,
                                                fontStyle: "italic",
                                                textAlign: "center",
                                                padding: "8px 0",
                                            }}>
                                                Tous les parcours sont complétés ! 🎉
                                            </div>
                                        );
                                    }

                                    return activeTopics.map(({ node, nextLesson, progress }) => (
                                        <button
                                            key={node.id}
                                            onClick={() => navigate(`/demo/lesson/${node.id}/${nextLesson.id}`)}
                                            style={{
                                                width: "100%",
                                                background: "#21262d",
                                                border: "1px solid #30363d",
                                                borderRadius: 6,
                                                padding: "12px 14px",
                                                marginBottom: 8,
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                transition: "all 0.15s ease",
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = "#30363d";
                                                e.currentTarget.style.borderColor = color;
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = "#21262d";
                                                e.currentTarget.style.borderColor = "#30363d";
                                            }}
                                        >
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                                                <div style={{
                                                    color: "#c9d1d9",
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                }}>
                                                    {node.title}
                                                </div>
                                                <div style={{
                                                    color: "#6e7681",
                                                    fontSize: 11,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                }}>
                                                    {progress > 0 && (
                                                        <span style={{
                                                            color: color,
                                                            fontSize: 10,
                                                            fontWeight: 600,
                                                        }}>
                                                            {Math.round(progress * 100)}%
                                                        </span>
                                                    )}
                                                    {nextLesson.title}
                                                </div>
                                            </div>
                                            <div style={{
                                                color: color,
                                                fontSize: 16,
                                            }}>
                                                →
                                            </div>
                                        </button>
                                    ));
                                })()}
                            </div>

                                {/* Action Buttons */}
                                <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
                                    {dueCount > 0 ? (
                                        <button
                                            onClick={() => window.location.reload()}
                                            style={{
                                                width: "100%",
                                                background: "#21262d",
                                                border: "1px solid #30363d",
                                                borderRadius: 6,
                                                padding: "12px 14px",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                transition: "all 0.15s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "#30363d";
                                                e.currentTarget.style.borderColor = color;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "#21262d";
                                                e.currentTarget.style.borderColor = "#30363d";
                                            }}
                                        >
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                                                <div style={{
                                                    color: "#c9d1d9",
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                }}>
                                                    Continuer la révision
                                                </div>
                                                <div style={{
                                                    color: "#6e7681",
                                                    fontSize: 11,
                                                }}>
                                                    {dueCount} carte{dueCount > 1 ? 's' : ''} à réviser
                                                </div>
                                            </div>
                                            <div style={{
                                                color: color,
                                                fontSize: 16,
                                            }}>
                                                →
                                            </div>
                                        </button>
                                    ) : nextLesson ? (
                                        <button
                                            onClick={() => navigate(`/demo/lesson/${nextLesson.node.id}/${nextLesson.nextLesson.id}`)}
                                            style={{
                                                width: "100%",
                                                background: "#21262d",
                                                border: "1px solid #30363d",
                                                borderRadius: 6,
                                                padding: "12px 14px",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                transition: "all 0.15s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "#30363d";
                                                e.currentTarget.style.borderColor = color;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "#21262d";
                                                e.currentTarget.style.borderColor = "#30363d";
                                            }}
                                        >
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                                                <div style={{
                                                    color: "#c9d1d9",
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                }}>
                                                    {nextLesson.node.title}
                                                </div>
                                                <div style={{
                                                    color: "#6e7681",
                                                    fontSize: 11,
                                                }}>
                                                    {nextLesson.nextLesson.title}
                                                </div>
                                            </div>
                                            <div style={{
                                                color: color,
                                                fontSize: 16,
                                            }}>
                                                →
                                            </div>
                                        </button>
                                    ) : null}

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
                                            textAlign: "center",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "#1c2128";
                                            e.currentTarget.style.borderColor = "#8b949e";
                                            e.currentTarget.style.color = "#c9d1d9";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "#161b22";
                                            e.currentTarget.style.borderColor = "#30363d";
                                            e.currentTarget.style.color = "#8b949e";
                                        }}
                                    >
                                        Retour à l'accueil
                                    </button>
                                </div>
                        </div>
                    </>
                    );
                })()}

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

            {/* Feedback System */}
            <FeedbackButton onClick={() => setFeedbackOpen(true)} />

            {feedbackOpen && (
                <FeedbackModal onClose={() => setFeedbackOpen(false)} from="StrengthenSessionPage" />
            )}
        </div>
    );
};