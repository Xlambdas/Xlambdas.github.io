import React, { useState } from "react";
import type { QuizQuestion, SRRating } from "../../types/types";
import { QuizInteraction } from "./quizInteraction";

// --- Quiz Block Player ---

interface QuizBlockPlayerProps {
    question: QuizQuestion;
    color: string;
    onComplete: (correct: boolean, rating: SRRating, userAnswer: any) => void;
    onExplain: (explanation: string) => void;
    isAnswered: boolean;
    reviewMode?: boolean;
    reviewData?: any;
    reviewCorrect?: boolean;
    onContinue?: () => void;
    onPrevious?: () => void;
}

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
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
        }}>
            {/* Question */}
            <div>
                <div style={{
                    background: "rgba(165,180,252,0.1)",
                    border: "1px solid rgba(165,180,252,0.25)",
                    borderRadius: 20,
                    padding: "4px 12px",
                    display: "inline-block",
                    marginBottom: 12,
                }}>
                    <span style={{
                        color,
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        fontWeight: 600,
                    }}>
                        {getQuizTypeLabel(question.type)}
                    </span>
                </div>
                <p style={{
                    color: "#c9d1d9",
                    fontSize: 15,
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
                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                        {onPrevious && (
                            <button
                                onClick={onPrevious}
                                style={{
                                    flex: 1,
                                    padding: "12px 0",
                                    background: "#21262d",
                                    border: "1px solid #30363d",
                                    color: "#8b949e",
                                    borderRadius: 8,
                                    fontSize: 13,
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
                                padding: "12px 0",
                                background: "#21262d",
                                border: "1px solid #30363d",
                                color: "#8b949e",
                                borderRadius: 8,
                                fontSize: 13,
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
                                padding: "12px 0",
                                background: `${color}22`,
                                border: `1px solid ${color}66`,
                                color,
                                borderRadius: 8,
                                fontSize: 13,
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

// --- Solution Display ---

// interface SolutionDisplayProps {
//     question: QuizQuestion;
//     userAnswer: any;
//     isCorrect: boolean;
//     usedIDK: boolean;
//     color: string;
//     onContinue: (rating: SRRating) => void;
//     onExplain: () => void;
//     onPrevious?: () => void;
// }

// const SolutionDisplay: React.FC<SolutionDisplayProps> = ({
//     question,
//     isCorrect,
//     usedIDK,
//     color,
//     onContinue,
//     onExplain,
//     onPrevious,
// }) => {
//     const [rating, ] = useState<SRRating | null>(null);

//     // const handleRate = (r: SRRating) => {
//     //     setRating(r);
//     //     onContinue(r);
//     // };

//     return (
//         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//             {/* Result indicator */}
//             <div style={{
//                 background: isCorrect
//                     ? "rgba(34,197,94,0.1)"
//                     : "rgba(239,68,68,0.1)",
//                 border: `1px solid ${isCorrect
//                     ? "rgba(34,197,94,0.3)"
//                     : "rgba(239,68,68,0.3)"}`,
//                 borderRadius: 8,
//                 padding: "12px 16px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 10,
//             }}>
//                 <span style={{ fontSize: 18 }}>
//                     {isCorrect ? "✓" : "✗"}
//                 </span>
//                 <span style={{
//                     color: isCorrect ? "#22c55e" : "#ef4444",
//                     fontSize: 13,
//                     fontWeight: 500,
//                 }}>
//                     {isCorrect
//                         ? "Bonne réponse !"
//                         : usedIDK
//                             ? "Voici la bonne réponse"
//                             : "Pas tout à fait"}
//                 </span>
//             </div>

//             {/* Correct answer display */}
//             <div style={{
//                 background: "#161b22",
//                 border: "1px solid #30363d",
//                 borderRadius: 8,
//                 padding: "14px 16px",
//             }}>
//                 <div style={{
//                     color: "#484f58",
//                     fontSize: 10,
//                     textTransform: "uppercase",
//                     letterSpacing: "0.08em",
//                     marginBottom: 8,
//                 }}>
//                     Réponse correcte
//                 </div>
//                 <div style={{ color: "#c9d1d9", fontSize: 14 }}>
//                     {getCorrectAnswerText(question)}
//                 </div>
//             </div>

//             {/* Buttons */}
//             {!rating ? (
//                 <div style={{ display: "flex", gap: 10 }}>
//                     {onPrevious && (
//                         <button
//                             onClick={onPrevious}
//                             style={{
//                                 flex: 1,
//                                 padding: "12px 0",
//                                 background: "#21262d",
//                                 border: "1px solid #30363d",
//                                 color: "#8b949e",
//                                 borderRadius: 8,
//                                 fontSize: 13,
//                                 fontWeight: 500,
//                                 cursor: "pointer",
//                                 transition: "all 0.15s ease",
//                             }}
//                         >
//                             ← Précédent
//                         </button>
//                     )}
//                     <button
//                         onClick={onExplain}
//                         style={{
//                             flex: 1,
//                             padding: "12px 0",
//                             background: "#21262d",
//                             border: "1px solid #30363d",
//                             color: "#8b949e",
//                             borderRadius: 8,
//                             fontSize: 13,
//                             fontWeight: 500,
//                             cursor: "pointer",
//                             transition: "all 0.15s ease",
//                         }}
//                     >
//                         Explication
//                     </button>
//                     <button
//                         onClick={() => {
//                             const r = isCorrect ? "perfect" : "forgot";
//                             // handleRate(r);
//                             onContinue(r);
//                         }}
//                         style={{
//                             flex: 1,
//                             padding: "12px 0",
//                             background: `${color}22`,
//                             border: `1px solid ${color}66`,
//                             color,
//                             borderRadius: 8,
//                             fontSize: 13,
//                             fontWeight: 500,
//                             cursor: "pointer",
//                             transition: "all 0.15s ease",
//                         }}
//                     >
//                         Continuer →
//                     </button>
//                 </div>
//             ) : null}
//         </div>
//     );
// };

// --- Helpers ---

const getQuizTypeLabel = (type: QuizQuestion["type"]): string => {
    const labels: Record<QuizQuestion["type"], string> = {
        multiple_choice: "Choix multiple",
        true_false: "Vrai ou Faux",
        ordering: "Ordre",
        match_pairs: "Association",
        word_bank: "Compléter",
        sentence: "Réponse libre",
    };
    return labels[type];
};

const checkAnswer = (question: QuizQuestion, answer: any): boolean => {
    switch (question.type) {
        case "multiple_choice":
            return answer === question.correctIndex;
        case "true_false":
            return answer === question.correct;
        case "ordering":
            return JSON.stringify(answer) === JSON.stringify(question.correctOrder);
        case "match_pairs":
            return Object.entries(answer as Record<number, number>).every(
                ([left, right]) => question.pairs[parseInt(left)].right === question.pairs[right].right
            );
        case "word_bank":
            return JSON.stringify(answer) === JSON.stringify(question.correctWords);
        case "sentence":
            return false; // Sentence is always marked as "needs review"
        default:
            return false;
    }
};

// const getCorrectAnswerText = (question: QuizQuestion): string => {
//     switch (question.type) {
//         case "multiple_choice":
//             return question.choices[question.correctIndex];
//         case "true_false":
//             return question.correct ? "Vrai" : "Faux";
//         case "ordering":
//             return question.correctOrder.map(i => question.items[i]).join(" → ");
//         case "match_pairs":
//             return question.pairs.map(p => `${p.left} → ${p.right}`).join(", ");
//         case "word_bank":
//             return question.correctWords.join(", ");
//         case "sentence":
//             return question.modelAnswer;
//         default:
//             return "";
//     }
// };