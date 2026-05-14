import React, { useState } from "react";
import type { QuizQuestion } from "../../types/types";
import { useLessonTextSize } from "../../hooks";

// --- Quiz Interaction ---

interface QuizInteractionProps {
    question: QuizQuestion;
    onSubmit: (answer: any, idk: boolean) => void;
    color: string;
    submitted?: boolean;
    userAnswer?: any;
}

export const QuizInteraction: React.FC<QuizInteractionProps> = ({
    question,
    onSubmit,
    color,
    submitted = false,
    userAnswer: externalAnswer,
}) => {
    const [answer, setAnswer] = useState<any>(externalAnswer ?? null);
    const { textScale } = useLessonTextSize();

    React.useEffect(() => {
        if (externalAnswer !== undefined && externalAnswer !== null) {
            setAnswer(externalAnswer);
        }
    }, [externalAnswer]);

    // Check if answer is properly filled based on question type
    const hasAnswer = React.useMemo(() => {
        if (answer === null || answer === undefined) return false;

        if (question.type === "ordering") {
            return Array.isArray(answer) && answer.length > 0;
        }
        if (question.type === "match_pairs") {
            return typeof answer === "object" && Object.keys(answer).length > 0;
        }
        if (question.type === "word_bank") {
            return Array.isArray(answer) && answer.length > 0 && answer.every(w => w !== null && w !== "");
        }
        if (question.type === "sentence") {
            return typeof answer === "string" && answer.trim().length > 0;
        }

        return true; // For simple types (multiple_choice, true_false)
    }, [answer, question.type]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Question-specific UI */}
            <div>
                {question.type === "multiple_choice" && (
                    <MultipleChoiceUI
                        question={question}
                        selected={answer}
                        onSelect={setAnswer}
                        onSubmit={onSubmit}
                        color={color}
                        textScale={textScale}
                        submitted={submitted}
                    />
                )}
                {question.type === "true_false" && (
                    <TrueFalseUI
                        question={question}
                        selected={answer}
                        onSelect={setAnswer}
                        onSubmit={onSubmit}
                        color={color}
                        textScale={textScale}
                        submitted={submitted}
                    />
                )}
                {question.type === "ordering" && (
                    <OrderingUI
                        question={question}
                        order={answer}
                        onOrderChange={setAnswer}
                        color={color}
                        textScale={textScale}
                        submitted={submitted}
                    />
                )}
                {question.type === "match_pairs" && (
                    <MatchPairsUI
                        question={question}
                        matches={answer}
                        onMatchChange={setAnswer}
                        color={color}
                        textScale={textScale}
                        submitted={submitted}
                    />
                )}
                {question.type === "word_bank" && (
                    <WordBankUI
                        question={question}
                        filled={answer}
                        onFilledChange={setAnswer}
                        color={color}
                        textScale={textScale}
                        submitted={submitted}
                    />
                )}
                {question.type === "sentence" && (
                    <SentenceUI
                        question={question}
                        value={answer}
                        onChange={setAnswer}
                        textScale={textScale}
                        submitted={submitted}
                    />
                )}
            </div>

            {/* Action buttons - only for multi-step quizzes */}
            {!submitted && (question.type === "ordering" ||
                question.type === "match_pairs" ||
                question.type === "word_bank" ||
                question.type === "sentence") && (
                <div style={{ display: "flex", gap: 10 }}>
                    <button
                        onClick={() => onSubmit(null, true)}
                        style={{
                            flex: 1,
                            padding: `${12 * textScale}px 0`,
                            background: "#21262d",
                            border: "1px solid #30363d",
                            color: "#8b949e",
                            borderRadius: `${8 * textScale}px`,
                            fontSize: `${13 * textScale}px`,
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                        }}
                    >
                        Je ne sais pas
                    </button>
                    <button
                        onClick={() => onSubmit(answer, false)}
                        disabled={!hasAnswer}
                        style={{
                            flex: 1,
                            padding: `${12 * textScale}px 0`,
                            background: hasAnswer ? `${color}22` : "#21262d",
                            border: `1px solid ${hasAnswer ? `${color}66` : "#30363d"}`,
                            color: hasAnswer ? color : "#484f58",
                            borderRadius: `${8 * textScale}px`,
                            fontSize: `${13 * textScale}px`,
                            fontWeight: 500,
                            cursor: hasAnswer ? "pointer" : "not-allowed",
                            transition: "all 0.15s ease",
                        }}
                    >
                        Valider
                    </button>
                </div>
            )}
        </div>
    );
};

// --- Multiple Choice ---

const MultipleChoiceUI: React.FC<{
    question: Extract<QuizQuestion, { type: "multiple_choice" }>;
    selected: number | null;
    onSelect: (index: number) => void;
    onSubmit: (answer: any, idk: boolean) => void;
    color: string;
    textScale: number;
    submitted?: boolean;
}> = ({ question, selected, onSelect, onSubmit, color, textScale, submitted = false }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {question.choices.map((choice, i) => (
            <button
                key={i}
                onClick={() => {
                    if (!submitted) {
                        onSelect(i);
                        setTimeout(() => onSubmit(i, false), 100);
                    }
                }}
                disabled={submitted}
                style={{
                    padding: `${12 * textScale}px ${16 * textScale}px`,
                    background: !submitted ? (selected === i ? `${color}15` : "#161b22")
                        : i === question.correctIndex ? "rgba(34,197,94,0.12)"
                            : selected === i ? "rgba(239,68,68,0.1)"
                                : "#161b22",
                    border: `1px solid ${!submitted ? (selected === i ? color : "#30363d")
                        : i === question.correctIndex ? "#22c55e"
                            : selected === i ? "#ef4444"
                                : "#30363d"}`,
                    borderRadius: `${8 * textScale}px`,
                    color: submitted && i === question.correctIndex ? "#22c55e"
                        : submitted && selected === i ? "#ef4444"
                            : submitted ? "#484f58"
                                : "#c9d1d9",
                    fontSize: `${13 * textScale}px`,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <span style={{
                    width: 20 * textScale,
                    height: 20 * textScale,
                    borderRadius: "50%",
                    border: `1px solid ${selected === i ? color : "#484f58"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10 * textScale,
                    color: !submitted ? (selected === i ? color : "#484f58")
                        : i === question.correctIndex ? "#22c55e"
                            : selected === i ? "#ef4444"
                                : "#484f58",
                    flexShrink: 0,
                }}>
                    {submitted && i === question.correctIndex ? "✓"
                        : submitted && selected === i ? "✗"
                            : String.fromCharCode(65 + i)}
                </span>
                {choice}
            </button>
        ))}
    </div>
);

// --- True/False ---

const TrueFalseUI: React.FC<{
    question: Extract<QuizQuestion, { type: "true_false" }>;
    selected: boolean | null;
    onSelect: (value: boolean) => void;
    onSubmit: (answer: any, idk: boolean) => void;
    color: string;
    textScale: number;
    submitted?: boolean;
}> = ({ question, selected, onSelect, onSubmit, color, textScale, submitted = false }) => (
    <div style={{ display: "flex", gap: 12 }}>
        {[true, false].map(val => (
            <button
                key={String(val)}
                onClick={() => {
                    if (!submitted) {
                        onSelect(val);
                        setTimeout(() => onSubmit(val, false), 100);
                    }
                }}
                disabled={submitted}
                style={{
                    flex: 1,
                    padding: `${16 * textScale}px 0`,
                    background: submitted && val === question.correct ? "rgba(34,197,94,0.12)"
                        : submitted && selected === val ? "rgba(239,68,68,0.1)"
                            : selected === val ? `${color}15` : "#161b22",
                    border: `1px solid ${submitted && val === question.correct ? "#22c55e"
                        : submitted && selected === val ? "#ef4444"
                            : selected === val ? color : "#30363d"}`,
                    borderRadius: `${10 * textScale}px`,
                    color: submitted && val === question.correct ? "#22c55e"
                        : submitted && selected === val ? "#ef4444"
                            : selected === val ? color : "#c9d1d9",
                    fontSize: `${14 * textScale}px`,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                }}
            >
                {val ? "✓ Vrai" : "✗ Faux"}
            </button>
        ))}
    </div>
);

// --- Ordering ---

const OrderingUI: React.FC<{
    question: Extract<QuizQuestion, { type: "ordering" }>;
    order: number[] | null;
    onOrderChange: (order: number[]) => void;
    color: string;
    textScale: number;
    submitted?: boolean;
}> = ({ question, order, onOrderChange, color, textScale, submitted = false }) => {
    const [localOrder, setLocalOrder] = useState<number[]>([...question.items.keys()]);
    const [selected, setSelected] = useState<number | null>(null);

    React.useEffect(() => {
        if (order !== null && order !== undefined) {
            setLocalOrder(order);
        }
    }, [order]);

    React.useEffect(() => {
        if (!submitted) {
            onOrderChange(localOrder);
        }
    }, [localOrder, submitted, onOrderChange]);

    const handleTap = (pos: number) => {
        if (submitted) return;
        if (selected === null) {
            setSelected(pos);
        } else if (selected === pos) {
            setSelected(null);
        } else {
            const next = [...localOrder];
            [next[selected], next[pos]] = [next[pos], next[selected]];
            setLocalOrder(next);
            setSelected(null);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {!submitted && (
                <p style={{ color: "#6e7681", fontSize: 11, margin: "0 0 4px 0", textAlign: "center" }}>
                    Appuie sur deux éléments pour les échanger
                </p>
            )}
            {localOrder.map((itemIdx, pos) => (
                <button
                    key={pos}
                    onClick={() => handleTap(pos)}
                    disabled={submitted}
                    style={{
                        padding: `${12 * textScale}px ${16 * textScale}px`,
                        background: !submitted && selected === pos ? `${color}15`
                            : submitted ? (pos === question.correctOrder.indexOf(itemIdx) ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.08)")
                                : "#161b22",
                        border: `1px solid ${!submitted && selected === pos ? color
                            : submitted ? (pos === question.correctOrder.indexOf(itemIdx) ? "#22c55e" : "#ef4444")
                                : "#30363d"}`,
                        borderRadius: `${8 * textScale}px`,
                        color: submitted ? (pos === question.correctOrder.indexOf(itemIdx) ? "#22c55e" : "#ef4444") : "#c9d1d9",
                        fontSize: `${13 * textScale}px`,
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <span style={{
                        width: `${20 * textScale}px`,
                        height: `${20 * textScale}px`,
                        borderRadius: `${10 * textScale}px`,
                        background: "#21262d",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: `${10 * textScale}px`,
                        color: "#8b949e",
                    }}>
                        {pos + 1}
                    </span>
                    {question.items[itemIdx]}
                </button>
            ))}
        </div>
    );
};

// --- Match Pairs ---

// Color palette for matched pairs
const PAIR_COLORS = [
    { bg: "rgba(99,102,241,0.15)", border: "#6366f1", text: "#818cf8" },   // Indigo
    { bg: "rgba(236,72,153,0.15)", border: "#ec4899", text: "#f472b6" },   // Pink
    { bg: "rgba(34,197,94,0.15)", border: "#22c55e", text: "#4ade80" },    // Green
    { bg: "rgba(251,146,60,0.15)", border: "#fb923c", text: "#fb923c" },   // Orange
    { bg: "rgba(168,85,247,0.15)", border: "#a855f7", text: "#c084fc" },   // Purple
    { bg: "rgba(14,165,233,0.15)", border: "#0ea5e9", text: "#38bdf8" },   // Sky
];

const MatchPairsUI: React.FC<{
    question: Extract<QuizQuestion, { type: "match_pairs" }>;
    matches: Record<number, number> | null;
    onMatchChange: (matches: Record<number, number>) => void;
    color: string;
    textScale: number;
    submitted?: boolean;
}> = ({ question, matches, onMatchChange, color, textScale, submitted = false }) => {
    const [localMatches, setLocalMatches] = useState<Record<number, number>>(matches ?? {});
    const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
    const [selectedRight, setSelectedRight] = useState<number | null>(null);
    const [rightOrder] = useState(() => [...question.pairs.keys()].sort(() => Math.random() - 0.5));
    const [matchColors] = useState<Record<number, number>>({});
    const [colorIndex, setColorIndex] = useState(0);

    // Sync localMatches with external matches prop
    React.useEffect(() => {
        if (submitted && matches) {
            setLocalMatches(matches);
        }
    }, [matches, submitted]);

    React.useEffect(() => {
        if (!submitted) {
            onMatchChange(localMatches);
        }
    }, [localMatches, submitted, onMatchChange]);

    // Get matched right original indices
    const matchedRightOriginals = new Set(Object.values(localMatches));

    // Get color for a matched pair
    const getPairColor = (leftIdx: number) => {
        if (matchColors[leftIdx] !== undefined) {
            return PAIR_COLORS[matchColors[leftIdx] % PAIR_COLORS.length];
        }
        return null;
    };

    // Check if match is correct (for submitted state)
    const isCorrectMatch = (leftIdx: number, rightOriginalIdx: number) => {
        return leftIdx === rightOriginalIdx;
    };

    // Handle left click
    const handleLeftClick = (leftIdx: number) => {
        if (submitted) return;

        // If already matched, unmatch it
        if (localMatches[leftIdx] !== undefined) {
            setLocalMatches(prev => {
                const next = { ...prev };
                delete next[leftIdx];
                return next;
            });
            delete matchColors[leftIdx];
            return;
        }

        if (selectedRight !== null) {
            // Right was selected, create match
            const rightOriginalIdx = rightOrder[selectedRight];
            setLocalMatches(prev => ({ ...prev, [leftIdx]: rightOriginalIdx }));
            matchColors[leftIdx] = colorIndex;
            setColorIndex(prev => prev + 1);
            setSelectedRight(null);
        } else {
            // Toggle left selection
            setSelectedLeft(leftIdx === selectedLeft ? null : leftIdx);
        }
    };

    // Handle right click
    const handleRightClick = (shuffledIdx: number) => {
        const rightOriginalIdx = rightOrder[shuffledIdx];

        if (submitted) return;

        // If already matched, unmatch it
        if (matchedRightOriginals.has(rightOriginalIdx)) {
            const leftEntry = Object.entries(localMatches).find(([, r]) => r === rightOriginalIdx);
            if (leftEntry) {
                const leftIdx = parseInt(leftEntry[0]);
                setLocalMatches(prev => {
                    const next = { ...prev };
                    delete next[leftIdx];
                    return next;
                });
                delete matchColors[leftIdx];
            }
            return;
        }

        if (selectedLeft !== null) {
            // Left was selected, create match
            setLocalMatches(prev => ({ ...prev, [selectedLeft]: rightOriginalIdx }));
            matchColors[selectedLeft] = colorIndex;
            setColorIndex(prev => prev + 1);
            setSelectedLeft(null);
        } else {
            // Toggle right selection
            setSelectedRight(shuffledIdx === selectedRight ? null : shuffledIdx);
        }
    };

    return (
        <div style={{ display: "flex", gap: 12 }}>
            {/* Left column */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {question.pairs.map((pair, leftIdx) => {
                    const isMatched = localMatches[leftIdx] !== undefined;
                    const isSelected = selectedLeft === leftIdx;
                    const pairColor = getPairColor(leftIdx);

                    // For submitted state
                    const isCorrect = submitted && isMatched && isCorrectMatch(leftIdx, localMatches[leftIdx]);
                    const isWrong = submitted && isMatched && !isCorrectMatch(leftIdx, localMatches[leftIdx]);

                    return (
                        <button
                            key={leftIdx}
                            onClick={() => handleLeftClick(leftIdx)}
                            disabled={submitted}
                            style={{
                                padding: "10px 12px",
                                minHeight: "44px",
                                display: "flex",
                                alignItems: "center",
                                background: submitted
                                    ? isCorrect ? "rgba(34,197,94,0.1)" : isWrong ? "rgba(239,68,68,0.08)" : "#161b22"
                                    : isMatched && pairColor ? pairColor.bg
                                        : isSelected ? `${color}15`
                                            : "#161b22",
                                border: `1px solid ${submitted
                                    ? isCorrect ? "#22c55e" : isWrong ? "#ef4444" : "#30363d"
                                    : isMatched && pairColor ? pairColor.border
                                        : isSelected ? color
                                            : "#30363d"}`,
                                borderRadius: 8,
                                color: submitted
                                    ? isCorrect ? "#22c55e" : isWrong ? "#ef4444" : "#c9d1d9"
                                    : isMatched && pairColor ? pairColor.text
                                        : "#c9d1d9",
                                fontSize: 12 * textScale,
                                textAlign: "left",
                                cursor: submitted || isMatched ? "default" : "pointer",
                                transition: "all 0.15s ease",
                            }}
                        >
                            {pair.left}
                        </button>
                    );
                })}
            </div>

            {/* Right column */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {rightOrder.map((originalIdx, shuffledIdx) => {
                    const isMatched = matchedRightOriginals.has(originalIdx);
                    const isSelected = selectedRight === shuffledIdx;

                    // Find which left matched this right
                    const leftEntry = Object.entries(localMatches).find(([, r]) => r === originalIdx);
                    const leftIdx = leftEntry ? parseInt(leftEntry[0]) : null;
                    const pairColor = leftIdx !== null ? getPairColor(leftIdx) : null;

                    // For submitted state
                    const isCorrect = submitted && isMatched && leftIdx !== null && isCorrectMatch(leftIdx, originalIdx);
                    const isWrong = submitted && isMatched && leftIdx !== null && !isCorrectMatch(leftIdx, originalIdx);

                    return (
                        <button
                            key={shuffledIdx}
                            onClick={() => handleRightClick(shuffledIdx)}
                            disabled={submitted}
                            style={{
                                padding: "10px 12px",
                                minHeight: "44px",
                                display: "flex",
                                alignItems: "center",
                                background: submitted
                                    ? isCorrect ? "rgba(34,197,94,0.1)" : isWrong ? "rgba(239,68,68,0.08)" : "#161b22"
                                    : isMatched && pairColor ? pairColor.bg
                                        : isSelected ? `${color}15`
                                            : selectedLeft !== null ? `${color}08`
                                                : "#161b22",
                                border: `1px solid ${submitted
                                    ? isCorrect ? "#22c55e" : isWrong ? "#ef4444" : "#30363d"
                                    : isMatched && pairColor ? pairColor.border
                                        : isSelected ? color
                                            : selectedLeft !== null ? `${color}33`
                                                : "#30363d"}`,
                                borderRadius: 8,
                                color: submitted
                                    ? isCorrect ? "#22c55e" : isWrong ? "#ef4444" : "#c9d1d9"
                                    : isMatched && pairColor ? pairColor.text
                                        : "#c9d1d9",
                                fontSize: 12 * textScale,
                                textAlign: "left",
                                cursor: submitted || isMatched ? "default" : "pointer",
                                transition: "all 0.15s ease",
                            }}
                        >
                            {question.pairs[originalIdx].right}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// --- Word Bank ---

const WordBankUI: React.FC<{
    question: Extract<QuizQuestion, { type: "word_bank" }>;
    filled: string[] | null;
    onFilledChange: (filled: string[]) => void;
    color: string;
    textScale: number;
    submitted?: boolean;
}> = ({ question, filled, onFilledChange, color, textScale, submitted = false }) => {
    const blankCount = (question.sentence.match(/___/g) ?? []).length;

    // Initialize localFilled properly - expand filled array to full blank count
    const [localFilled, setLocalFilled] = useState<(string | null)[]>(() => {
        if (!filled) return Array(blankCount).fill(null);
        const fullArray = Array(blankCount).fill(null);
        filled.forEach((word, i) => {
            if (i < blankCount) fullArray[i] = word;
        });
        return fullArray;
    });

    const [usedBank, setUsedBank] = useState<Set<string>>(new Set(filled?.filter(Boolean) ?? []));

    // Only propagate changes upward when not submitted
    React.useEffect(() => {
        if (!submitted) {
            const filledWords = localFilled.filter((w): w is string => w !== null && w !== "");
            onFilledChange(filledWords);
        }
    }, [localFilled, submitted, onFilledChange]);

    const parts = question.sentence.split("___");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
                background: "#161b22",
                border: "1px solid #21262d",
                borderRadius: 8,
                padding: `${12 * textScale}px ${14 * textScale}px`,
                fontSize: 14 * textScale,
                lineHeight: 2,
                color: "#c9d1d9",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 4,
            }}>
                {parts.map((part, i) => (
                    <React.Fragment key={i}>
                        <span>{part}</span>
                        {i < parts.length - 1 && (
                            <button
                                onClick={() => {
                                    if (submitted) return;
                                    const word = localFilled[i];
                                    if (word) {
                                        const next = [...localFilled];
                                        next[i] = null;
                                        setLocalFilled(next);
                                        setUsedBank(prev => { const s = new Set(prev); s.delete(word); return s; });
                                    }
                                }}
                                disabled={submitted}
                                style={{
                                    minWidth: 70 * textScale,
                                    padding: `${2 * textScale}px ${8 * textScale}px`,
                                    background: !localFilled[i] ? "#1c2128"
                                        : submitted
                                            ? localFilled[i] === question.correctWords[i]
                                                ? "rgba(34,197,94,0.15)"  // Green: correct position
                                                : question.correctWords.includes(localFilled[i]!)
                                                    ? "rgba(251,146,60,0.15)"  // Orange: wrong position
                                                    : "rgba(239,68,68,0.12)"   // Red: wrong word
                                            : `${color}15`,
                                    border: `1px solid ${!localFilled[i] ? "#30363d"
                                        : submitted
                                            ? localFilled[i] === question.correctWords[i]
                                                ? "#22c55e"  // Green
                                                : question.correctWords.includes(localFilled[i]!)
                                                    ? "#fb923c"  // Orange
                                                    : "#ef4444"  // Red
                                            : color}`,
                                    borderRadius: 6,
                                    fontSize: 13 * textScale,
                                    color: !localFilled[i] ? "#484f58"
                                        : submitted
                                            ? localFilled[i] === question.correctWords[i]
                                                ? "#22c55e"  // Green
                                                : question.correctWords.includes(localFilled[i]!)
                                                    ? "#fb923c"  // Orange
                                                    : "#ef4444"  // Red
                                            : color,
                                    cursor: localFilled[i] && !submitted ? "pointer" : "default",
                                }}
                            >
                                {localFilled[i] ?? "___"}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {question.bank.map(word => (
                    <button
                        key={word}
                        onClick={() => {
                            if (submitted || usedBank.has(word)) return;
                            const idx = localFilled.findIndex(f => f === null);
                            if (idx !== -1) {
                                const next = [...localFilled];
                                next[idx] = word;
                                setLocalFilled(next);
                                setUsedBank(prev => new Set([...prev, word]));
                            }
                        }}
                        disabled={usedBank.has(word) || submitted}
                        style={{
                            padding: `${6 * textScale}px ${12 * textScale}px`,
                            background: usedBank.has(word) ? "#0d1117" : "#21262d",
                            border: `1px solid ${usedBank.has(word) ? "#1c2128" : "#30363d"}`,
                            borderRadius: 16 * textScale,
                            color: usedBank.has(word) ? "#30363d" : "#c9d1d9",
                            fontSize: 12 * textScale,
                            cursor: usedBank.has(word) ? "default" : "pointer",
                            textDecoration: usedBank.has(word) ? "line-through" : "none",
                        }}
                    >
                        {word}
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- Sentence ---

const SentenceUI: React.FC<{
    question: Extract<QuizQuestion, { type: "sentence" }>;
    value: string | null;
    onChange: (value: string) => void;
    textScale: number;
    submitted?: boolean;
}> = ({ question, value, onChange, textScale, submitted = false }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <textarea
            value={value ?? ""}
            onChange={e => onChange(e.target.value)}
            disabled={submitted}
            placeholder={question.placeholder}
            rows={4}
            style={{
                width: "100%",
                padding: "12px 14px",
                background: "#161b22",
                border: `1px solid ${submitted ? "#484f58" : "#30363d"}`,
                borderRadius: 8 * textScale,
                color: "#c9d1d9",
                fontSize: 13 * textScale,
                lineHeight: 1.6,
                resize: "none",
                outline: "none",
                fontFamily: "inherit",
                opacity: submitted ? 0.7 : 1,
            }}
        />
        {submitted && (
            <div style={{
                background: "rgba(165,180,252,0.08)",
                border: "1px solid rgba(165,180,252,0.2)",
                borderRadius: 8 * textScale,
                padding: `${12 * textScale}px ${14 * textScale}px`,
            }}>
                <div style={{
                    color: "#484f58",
                    fontSize: 10 * textScale,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 8 * textScale,
                }}>
                    Réponse de référence
                </div>
                <div style={{ color: "#c9d1d9", fontSize: 13 * textScale, lineHeight: 1.7 }}>
                    {question.modelAnswer}
                </div>
            </div>
        )}
    </div>
);