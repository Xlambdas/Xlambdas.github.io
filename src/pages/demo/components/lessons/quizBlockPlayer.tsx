import React, { useState } from "react";
import type { SRRating, QuizBlockPlayerProps } from "../../types";
import { QuizInteraction } from "./quizInteraction";
import { useLessonTextSize } from "../../hooks";
import { getQuizTypeLabel, checkAnswer } from "../../helpers";

// --- Quiz Block Player ---
export const QuizBlockPlayer: React.FC<QuizBlockPlayerProps> = ({
    question,
    color,
    onComplete,
    onExplain,
    isAnswered,
    reviewMode = false,
    reviewData,
    reviewCorrect,
    onContinue,
    onPrevious,
}) => {
    const shouldShowSolution = reviewMode || isAnswered;
    const [phase, setPhase] = useState<"question" | "solution">(
        shouldShowSolution ? "solution" : "question"
    );
    const [userAnswer, setUserAnswer] = useState<any>(reviewData ?? null);
    const [, setIsCorrect] = useState(reviewCorrect ?? false);
    const [, setUsedIDK] = useState(false);
    const textScale = useLessonTextSize().textScale;

    // Sync phase with props whenever they change
    React.useEffect(() => {
        const newPhase = (reviewMode || isAnswered) ? "solution" : "question";
        setPhase(newPhase);

        // Update user answer and correctness when in review/answered mode
        if (reviewMode || isAnswered) {
            if (reviewData !== undefined && reviewData !== null) {
                setUserAnswer(reviewData);
            }
            if (reviewCorrect !== undefined) {
                setIsCorrect(reviewCorrect);
            }
        }
    }, [reviewMode, isAnswered, reviewData, reviewCorrect]);

    // Handle user submitting answer or clicking "I don't know"
    const handleSubmit = (answer: any, idk: boolean) => {
        // Check if answer is correct
        const correct = !idk && checkAnswer(question, answer);

        // Update state
        setUserAnswer(answer);
        setUsedIDK(idk);
        setIsCorrect(correct);
        setPhase("solution");

        // Complete quiz immediately (triggers re-insertion if wrong)
        // Use answer parameter directly, not state
        if (!reviewMode && !isAnswered) {
            const rating: SRRating = correct ? "perfect" : "forgot";
            onComplete(correct, rating, answer);
        }
    };

    // Handle continue button (after showing solution)
    const handleContinue = () => {
        onContinue?.();
    };

    // Handle explain button
    const handleExplainClick = () => {
        onExplain(question.explanation);
    };

    return (
        <div style={{
            background: "#0d1117",
            border: "1px solid #21262d",
            borderRadius: 12,
            padding: `${24 * textScale}px`,
            display: "flex",
            flexDirection: "column",
            gap: `${20 * textScale}px`,
        }}>
            {/* Question */}
            <div>
                <div style={{
                    background: "rgba(165,180,252,0.1)",
                    border: "1px solid rgba(165,180,252,0.25)",
                    borderRadius: 20,
                    padding: `${4 * textScale}px ${12 * textScale}px`,
                    display: "inline-block",
                    marginBottom: `${12 * textScale}px`,
                }}>
                    <span style={{
                        color,
                        fontSize: `${10 * textScale}px`,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontWeight: 600,
                    }}>
                        {getQuizTypeLabel(question.type)}
                    </span>
                </div>
                <p style={{
                    color: "#c9d1d9",
                    fontSize: `${15 * textScale}px`,
                    lineHeight: 1.7,
                    margin: 0,
                }}>
                    {question.question}
                </p>
            </div>

            {/* Question Phase */}
            {phase === "question" && (
                <QuizInteraction
                    question={question}
                    onSubmit={handleSubmit}
                    color={color}
                />
            )}

            {/* Solution Phase */}
            {phase === "solution" && (
                <>
                    <QuizInteraction
                        key="solution"
                        question={question}
                        onSubmit={handleSubmit}
                        color={color}
                        submitted={true}
                        userAnswer={userAnswer}
                    />

                    {/* Buttons */}
                    <div style={{ display: "flex", gap: `${10 * textScale}px`, marginTop: `${16 * textScale}px` }}>
                        {onPrevious && (
                            <button
                                onClick={onPrevious}
                                style={{
                                    flex: 1,
                                    padding: `${12 * textScale}px 0`,
                                    background: "#21262d",
                                    border: "1px solid #30363d",
                                    color: "#8b949e",
                                    borderRadius: `${8 * textScale}px`,
                                    fontSize: `${13 * textScale}px`,
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "all 0.15s ease",
                                }}
                            >
                                ← Précédent
                            </button>
                        )}
                        <button
                            onClick={handleExplainClick}
                            style={{
                                flex: 1,
                                padding: `${12 * textScale}px 0`,
                                background: "#21262d",
                                border: "1px solid #30363d",
                                color: "#8b949e",
                                borderRadius: `${8 * textScale}px`,
                                fontSize: `${13 * textScale}px`,
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                            }}
                        >
                            Explication
                        </button>
                        <button
                            onClick={handleContinue}
                            style={{
                                flex: 1,
                                padding: `${12 * textScale}px 0`,
                                background: `${color}22`,
                                border: `1px solid ${color}66`,
                                color,
                                borderRadius: `${8 * textScale}px`,
                                fontSize: `${13 * textScale}px`,
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                            }}
                        >
                            Continuer →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
