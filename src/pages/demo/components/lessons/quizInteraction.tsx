import React, { useState } from "react";
import type { QuizQuestion } from "../../constants/types";

// ─── Quiz Interaction ─────────────────────────────────────────────────────────

interface QuizInteractionProps {
    question: QuizQuestion;
    onSubmit: (answer: any, idk: boolean) => void;
    color: string;
}

// const isAutoValidate = (type: QuizQuestion["type"]) => {
//     return type === "multiple_choice" || type === "true_false";
// };

export const QuizInteraction: React.FC<QuizInteractionProps> = ({
    question,
    onSubmit,
    color,
}) => {
    const [answer, setAnswer] = useState<any>(null);

    const hasAnswer = answer !== null && answer !== undefined;

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
                    />
                )}
                {question.type === "true_false" && (
                    <TrueFalseUI
                        selected={answer}
                        onSelect={setAnswer}
                        onSubmit={onSubmit}
                        color={color}
                    />
                )}
                {question.type === "ordering" && (
                    <OrderingUI
                        question={question}
                        order={answer}
                        onOrderChange={setAnswer}
                        color={color}
                    />
                )}
                {question.type === "match_pairs" && (
                    <MatchPairsUI
                        question={question}
                        matches={answer}
                        onMatchChange={setAnswer}
                        color={color}
                    />
                )}
                {question.type === "word_bank" && (
                    <WordBankUI
                        question={question}
                        filled={answer}
                        onFilledChange={setAnswer}
                        color={color}
                    />
                )}
                {question.type === "sentence" && (
                    <SentenceUI
                        question={question}
                        value={answer}
                        onChange={setAnswer}
                    />
                )}
            </div>

            {/* Action buttons - only for multi-step quizzes */}
            {(question.type === "ordering" ||
                question.type === "match_pairs" ||
                question.type === "word_bank" ||
                question.type === "sentence") && (
                <div style={{ display: "flex", gap: 10 }}>
                    <button
                        onClick={() => onSubmit(null, true)}
                        style={{
                            flex: 1,
                            padding: "12px 0",
                            background: "#21262d",
                            border: "1px solid #30363d",
                            color: "#8b949e",
                            borderRadius: 8,
                            fontSize: 13,
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
                            padding: "12px 0",
                            background: hasAnswer ? `${color}22` : "#21262d",
                            border: `1px solid ${hasAnswer ? `${color}66` : "#30363d"}`,
                            color: hasAnswer ? color : "#484f58",
                            borderRadius: 8,
                            fontSize: 13,
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

// ─── Multiple Choice ──────────────────────────────────────────────────────────

const MultipleChoiceUI: React.FC<{
    question: Extract<QuizQuestion, { type: "multiple_choice" }>;
    selected: number | null;
    onSelect: (index: number) => void;
    onSubmit: (answer: any, idk: boolean) => void;
    color: string;
}> = ({ question, selected, onSelect, onSubmit, color }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {question.choices.map((choice, i) => (
            <button
                key={i}
                onClick={() => {
                    onSelect(i);
                    setTimeout(() => onSubmit(i, false), 100);
                }}
                style={{
                    padding: "12px 16px",
                    background: selected === i ? `${color}15` : "#161b22",
                    border: `1px solid ${selected === i ? color : "#30363d"}`,
                    borderRadius: 8,
                    color: "#c9d1d9",
                    fontSize: 13,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <span style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `1px solid ${selected === i ? color : "#484f58"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: selected === i ? color : "#484f58",
                    flexShrink: 0,
                }}>
                    {String.fromCharCode(65 + i)}
                </span>
                {choice}
            </button>
        ))}
    </div>
);

// ─── True/False ───────────────────────────────────────────────────────────────

const TrueFalseUI: React.FC<{
    selected: boolean | null;
    onSelect: (value: boolean) => void;
    onSubmit: (answer: any, idk: boolean) => void;
    color: string;
}> = ({ selected, onSelect, onSubmit, color }) => (
    <div style={{ display: "flex", gap: 12 }}>
        {[true, false].map(val => (
            <button
                key={String(val)}
                onClick={() => {
                    onSelect(val);
                    setTimeout(() => onSubmit(val, false), 100);
                }}
                style={{
                    flex: 1,
                    padding: "16px 0",
                    background: selected === val ? `${color}15` : "#161b22",
                    border: `1px solid ${selected === val ? color : "#30363d"}`,
                    borderRadius: 10,
                    color: selected === val ? color : "#c9d1d9",
                    fontSize: 14,
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

// ─── Ordering ─────────────────────────────────────────────────────────────────

const OrderingUI: React.FC<{
    question: Extract<QuizQuestion, { type: "ordering" }>;
    order: number[] | null;
    onOrderChange: (order: number[]) => void;
    color: string;
}> = ({ question, onOrderChange, color }) => {
    const [localOrder, setLocalOrder] = useState<number[]>([...question.items.keys()]);
    const [selected, setSelected] = useState<number | null>(null);

    React.useEffect(() => {
        onOrderChange(localOrder);
    }, [localOrder]);

    const handleTap = (pos: number) => {
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
            <p style={{ color: "#6e7681", fontSize: 11, margin: "0 0 4px 0", textAlign: "center" }}>
                Appuie sur deux éléments pour les échanger
            </p>
            {localOrder.map((itemIdx, pos) => (
                <button
                    key={pos}
                    onClick={() => handleTap(pos)}
                    style={{
                        padding: "12px 16px",
                        background: selected === pos ? `${color}15` : "#161b22",
                        border: `1px solid ${selected === pos ? color : "#30363d"}`,
                        borderRadius: 8,
                        color: "#c9d1d9",
                        fontSize: 13,
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <span style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "#21262d",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
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

// ─── Match Pairs ──────────────────────────────────────────────────────────────

const MatchPairsUI: React.FC<{
    question: Extract<QuizQuestion, { type: "match_pairs" }>;
    matches: Record<number, number> | null;
    onMatchChange: (matches: Record<number, number>) => void;
    color: string;
}> = ({ question, onMatchChange, color }) => {
    const [localMatches, setLocalMatches] = useState<Record<number, number>>({});
    const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
    const [selectedRight, setSelectedRight] = useState<number | null>(null);
    const [rightOrder] = useState(() => [...question.pairs.keys()].sort(() => Math.random() - 0.5));

    React.useEffect(() => {
        onMatchChange(localMatches);
    }, [localMatches]);

    const matchedRights = new Set(Object.values(localMatches));

    return (
        <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" }}>
                {question.pairs.map((pair, i) => {
                    const isMatched = localMatches[i] !== undefined;
                    return (
                        <button
                            key={i}
                            onClick={() => {
                                if (isMatched) return;
                                if (selectedRight !== null) {
                                    // Right was selected, now match with left
                                    setLocalMatches(prev => ({ ...prev, [i]: selectedRight }));
                                    setSelectedRight(null);
                                } else {
                                    setSelectedLeft(i === selectedLeft ? null : i);
                                }
                            }}
                            disabled={isMatched}
                            style={{
                                padding: "10px 12px",
                                minHeight: "44px",
                                display: "flex",
                                alignItems: "center",
                                background: selectedLeft === i ? `${color}15` : isMatched ? "#0d1117" : "#161b22",
                                border: `1px solid ${selectedLeft === i ? color : "#30363d"}`,
                                borderRadius: 8,
                                color: "#c9d1d9",
                                fontSize: 12,
                                textAlign: "left",
                                cursor: isMatched ? "default" : "pointer",
                                opacity: isMatched ? 0.6 : 1,
                            }}
                        >
                            {pair.left}
                        </button>
                    );
                })}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {rightOrder.map((originalIdx, shuffledIdx) => {
                    const isMatched = matchedRights.has(shuffledIdx);
                    return (
                        <button
                            key={shuffledIdx}
                            onClick={() => {
                                if (isMatched) return;
                                if (selectedLeft !== null) {
                                    // Left was selected, now match with right
                                    setLocalMatches(prev => ({ ...prev, [selectedLeft]: shuffledIdx }));
                                    setSelectedLeft(null);
                                } else {
                                    setSelectedRight(shuffledIdx === selectedRight ? null : shuffledIdx);
                                }
                            }}
                            disabled={isMatched}
                            style={{
                                padding: "10px 12px",
                                minHeight: "44px",
                                display: "flex",
                                alignItems: "center",
                                background: selectedRight === shuffledIdx ? `${color}15` : isMatched ? "#0d1117" : selectedLeft !== null ? `${color}08` : "#161b22",
                                border: `1px solid ${selectedRight === shuffledIdx ? color : isMatched ? "#21262d" : selectedLeft !== null ? `${color}33` : "#30363d"}`,
                                borderRadius: 8,
                                color: "#c9d1d9",
                                fontSize: 12,
                                textAlign: "left",
                                cursor: isMatched || selectedLeft === null ? "default" : "pointer",
                                opacity: isMatched ? 0.6 : 1,
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

// ─── Word Bank ────────────────────────────────────────────────────────────────

const WordBankUI: React.FC<{
    question: Extract<QuizQuestion, { type: "word_bank" }>;
    filled: string[] | null;
    onFilledChange: (filled: string[]) => void;
    color: string;
}> = ({ question, onFilledChange, color }) => {
    const blankCount = (question.sentence.match(/___/g) ?? []).length;
    const [localFilled, setLocalFilled] = useState<(string | null)[]>(Array(blankCount).fill(null));
    const [usedBank, setUsedBank] = useState<Set<string>>(new Set());

    React.useEffect(() => {
        onFilledChange(localFilled.filter(Boolean) as string[]);
    }, [localFilled]);

    const parts = question.sentence.split("___");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{
                background: "#161b22",
                border: "1px solid #21262d",
                borderRadius: 8,
                padding: 14,
                fontSize: 14,
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
                                    const word = localFilled[i];
                                    if (word) {
                                        const next = [...localFilled];
                                        next[i] = null;
                                        setLocalFilled(next);
                                        setUsedBank(prev => { const s = new Set(prev); s.delete(word); return s; });
                                    }
                                }}
                                style={{
                                    minWidth: 70,
                                    padding: "2px 8px",
                                    background: localFilled[i] ? `${color}15` : "#1c2128",
                                    border: `1px solid ${localFilled[i] ? color : "#30363d"}`,
                                    borderRadius: 6,
                                    fontSize: 13,
                                    color: localFilled[i] ? color : "#484f58",
                                    cursor: localFilled[i] ? "pointer" : "default",
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
                            if (!usedBank.has(word)) {
                                const idx = localFilled.findIndex(f => f === null);
                                if (idx !== -1) {
                                    const next = [...localFilled];
                                    next[idx] = word;
                                    setLocalFilled(next);
                                    setUsedBank(prev => new Set([...prev, word]));
                                }
                            }
                        }}
                        disabled={usedBank.has(word)}
                        style={{
                            padding: "6px 12px",
                            background: usedBank.has(word) ? "#0d1117" : "#21262d",
                            border: `1px solid ${usedBank.has(word) ? "#1c2128" : "#30363d"}`,
                            borderRadius: 16,
                            color: usedBank.has(word) ? "#30363d" : "#c9d1d9",
                            fontSize: 12,
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

// ─── Sentence ─────────────────────────────────────────────────────────────────

const SentenceUI: React.FC<{
    question: Extract<QuizQuestion, { type: "sentence" }>;
    value: string | null;
    onChange: (value: string) => void;
}> = ({ question, value, onChange }) => (
    <textarea
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        placeholder={question.placeholder}
        rows={4}
        style={{
            width: "100%",
            padding: "12px 14px",
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: 8,
            color: "#c9d1d9",
            fontSize: 13,
            lineHeight: 1.6,
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
        }}
    />
);