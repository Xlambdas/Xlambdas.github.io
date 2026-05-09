import React, { useState } from "react";
import type {
    QuizQuestion,
    MultipleChoiceQuestion,
    TrueFalseQuestion,
    OrderingQuestion,
    MatchPairsQuestion,
    WordBankQuestion,
    SentenceQuestion,
    SRRating,
} from "../constants/types";

// ─── Theme ────────────────────────────────────────────────────────────────────

const C = {
    correct: "#22c55e",
    incorrect: "#ef4444",
    neutral: "#a5b4fc",
    bg: "#0d1117",
    surface: "#21262d",
    border: "#30363d",
    text: "#c9d1d9",
    muted: "#484f58",
};

// ─── Shared helpers ───────────────────────────────────────────────────────────

const explanationBox = (correct: boolean): React.CSSProperties => ({
    background: correct ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
    border: `1px solid ${correct ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
    borderRadius: 10, padding: "12px 14px",
    color: C.muted, fontSize: 12, lineHeight: 1.7, marginTop: 12,
});

const submitBtn = (active: boolean): React.CSSProperties => ({
    padding: "12px 0",
    background: active ? "rgba(165,180,252,0.12)" : C.surface,
    border: `1px solid ${active ? "rgba(165,180,252,0.3)" : C.border}`,
    color: active ? C.neutral : C.muted,
    borderRadius: 10, fontSize: 13, fontWeight: 500,
    cursor: active ? "pointer" : "not-allowed",
    width: "100%",
});

const choiceBtn = (
    bg: string, border: string, color: string, clickable: boolean
): React.CSSProperties => ({
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: 10, padding: "13px 16px",
    color, fontSize: 13, textAlign: "left",
    cursor: clickable ? "pointer" : "default",
    display: "flex", alignItems: "center", gap: 12,
    transition: "all 0.15s ease",
    width: "100%",
});

// ─── Rating row ───────────────────────────────────────────────────────────────

const RATINGS = [
    ["forgot", "😅 Pas su", "#ef4444"],
    ["almost", "🤔 Presque", "#f59e0b"],
    ["perfect", "✓ Parfait", "#22c55e"],
] as const;

const RatingRow: React.FC<{ onRate: (r: SRRating) => void }> = ({ onRate }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
        <span style={{ color: C.muted, fontSize: 11, textAlign: "center" }}>
            Comment tu évalues ta réponse ?
        </span>
        <div style={{ display: "flex", gap: 8 }}>
            {RATINGS.map(([rating, label, color]) => (
                <button
                    key={rating}
                    onClick={() => onRate(rating)}
                    style={{
                        flex: 1, padding: "10px 4px",
                        background: `${color}14`,
                        border: `1px solid ${color}44`,
                        color, borderRadius: 8,
                        fontSize: 12, cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                >
                    {label}
                </button>
            ))}
        </div>
    </div>
);

// ─── 1. Multiple Choice ───────────────────────────────────────────────────────

const MultipleChoice: React.FC<{
    q: MultipleChoiceQuestion; onRate: (r: SRRating) => void;
}> = ({ q, onRate }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const answered = selected !== null;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.choices.map((choice, i) => {
                const isCorrect = i === q.correctIndex;
                const isSelected = i === selected;

                const bg = !answered ? C.bg
                    : isCorrect ? "rgba(34,197,94,0.12)"
                        : isSelected ? "rgba(239,68,68,0.1)"
                            : C.bg;
                const border = !answered && isSelected ? C.neutral
                    : answered && isCorrect ? C.correct
                        : answered && isSelected ? C.incorrect
                            : C.border;
                const color = answered && isCorrect ? C.correct
                    : answered && isSelected ? C.incorrect
                        : answered ? C.muted
                            : C.text;

                const icon = answered && isCorrect ? "✓"
                    : answered && isSelected ? "✗"
                        : String.fromCharCode(65 + i);

                return (
                    <button
                        key={i}
                        onClick={() => !answered && setSelected(i)}
                        style={choiceBtn(bg, border, color, !answered)}
                    >
                        <span style={{
                            width: 22, height: 22, borderRadius: "50%",
                            border: `1px solid ${border}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, flexShrink: 0, color,
                        }}>
                            {icon}
                        </span>
                        {choice}
                    </button>
                );
            })}
            {answered && (
                <>
                    <div style={explanationBox(selected === q.correctIndex)}>
                        {q.explanation}
                    </div>
                    <RatingRow onRate={onRate} />
                </>
            )}
        </div>
    );
};

// ─── 2. True / False ──────────────────────────────────────────────────────────

const TrueFalse: React.FC<{
    q: TrueFalseQuestion; onRate: (r: SRRating) => void;
}> = ({ q, onRate }) => {
    const [selected, setSelected] = useState<boolean | null>(null);
    const answered = selected !== null;
    const isCorrect = selected === q.correct;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12 }}>
                {([true, false] as const).map(val => {
                    const isSelected = selected === val;
                    const showCorrect = answered && val === q.correct;
                    const showWrong = answered && isSelected && val !== q.correct;

                    return (
                        <button
                            key={String(val)}
                            onClick={() => !answered && setSelected(val)}
                            style={{
                                flex: 1, padding: "18px 0",
                                background: showCorrect ? "rgba(34,197,94,0.12)"
                                    : showWrong ? "rgba(239,68,68,0.1)"
                                        : C.bg,
                                border: `1px solid ${showCorrect ? C.correct
                                        : showWrong ? C.incorrect
                                            : isSelected ? C.neutral
                                                : C.border}`,
                                borderRadius: 12,
                                color: showCorrect ? C.correct
                                    : showWrong ? C.incorrect
                                        : C.text,
                                fontSize: 15, fontWeight: 600,
                                cursor: answered ? "default" : "pointer",
                                transition: "all 0.15s ease",
                            }}
                        >
                            {val ? "✓ Vrai" : "✗ Faux"}
                        </button>
                    );
                })}
            </div>
            {answered && (
                <>
                    <div style={explanationBox(isCorrect)}>{q.explanation}</div>
                    <RatingRow onRate={onRate} />
                </>
            )}
        </div>
    );
};

// ─── 3. Ordering (tap-to-swap) ────────────────────────────────────────────────

const Ordering: React.FC<{
    q: OrderingQuestion; onRate: (r: SRRating) => void;
}> = ({ q, onRate }) => {
    const [order, setOrder] = useState<number[]>([...q.items.keys()]);
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const isCorrect = order.every((idx, pos) => idx === q.correctOrder[pos]);

    const handleTap = (pos: number) => {
        if (submitted) return;
        if (selected === null) { setSelected(pos); return; }
        if (selected === pos) { setSelected(null); return; }
        const next = [...order];
        [next[selected], next[pos]] = [next[pos], next[selected]];
        setOrder(next);
        setSelected(null);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <p style={{ color: C.muted, fontSize: 11, margin: 0, textAlign: "center" }}>
                Appuie sur deux éléments pour les échanger
            </p>
            {order.map((itemIdx, pos) => {
                const isSelected = selected === pos;
                const correctPos = submitted && pos === q.correctOrder.indexOf(itemIdx);
                return (
                    <button
                        key={pos}
                        onClick={() => handleTap(pos)}
                        style={choiceBtn(
                            isSelected ? "rgba(165,180,252,0.12)"
                                : submitted ? (correctPos ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.08)")
                                    : C.bg,
                            isSelected ? C.neutral
                                : submitted ? (correctPos ? C.correct : C.incorrect)
                                    : C.border,
                            submitted ? (correctPos ? C.correct : C.incorrect) : C.text,
                            !submitted,
                        )}
                    >
                        <span style={{
                            width: 22, height: 22, borderRadius: "50%",
                            background: isSelected ? `${C.neutral}22` : C.surface,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, flexShrink: 0, color: "#8b949e",
                        }}>
                            {pos + 1}
                        </span>
                        {q.items[itemIdx]}
                    </button>
                );
            })}
            {!submitted
                ? <button onClick={() => setSubmitted(true)} style={submitBtn(true)}>
                    Valider l'ordre →
                </button>
                : <>
                    <div style={explanationBox(isCorrect)}>{q.explanation}</div>
                    <RatingRow onRate={onRate} />
                </>
            }
        </div>
    );
};

// ─── 4. Match Pairs (tap left → tap right) ────────────────────────────────────

const MatchPairs: React.FC<{
    q: MatchPairsQuestion; onRate: (r: SRRating) => void;
}> = ({ q, onRate }) => {
    const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
    const [matches, setMatches] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);

    const [rightOrder] = useState(() =>
        [...q.pairs.keys()].sort(() => Math.random() - 0.5)
    );

    const matchedRights = new Set(Object.values(matches));
    const allMatched = Object.keys(matches).length === q.pairs.length;

    const isCorrectMatch = (leftIdx: number, rightShuffledIdx: number) =>
        rightOrder[rightShuffledIdx] === leftIdx;

    const handleLeft = (i: number) => {
        if (submitted || matches[i] !== undefined) return;
        setSelectedLeft(i === selectedLeft ? null : i);
    };
    const handleRight = (shuffledIdx: number) => {
        if (submitted || selectedLeft === null || matchedRights.has(shuffledIdx)) return;
        setMatches(prev => ({ ...prev, [selectedLeft]: shuffledIdx }));
        setSelectedLeft(null);
    };

    const pairBtnStyle = (
        isSelected: boolean, correct: boolean, wrong: boolean,
        isMatched: boolean, hintActive: boolean
    ): React.CSSProperties => ({
        padding: "11px 12px",
        background: isSelected ? "rgba(165,180,252,0.12)"
            : correct ? "rgba(34,197,94,0.1)"
                : wrong ? "rgba(239,68,68,0.08)"
                    : hintActive ? "rgba(165,180,252,0.06)"
                        : C.bg,
        border: `1px solid ${isSelected ? C.neutral
                : correct ? C.correct
                    : wrong ? C.incorrect
                        : isMatched ? C.muted
                            : hintActive ? `${C.neutral}44`
                                : C.border}`,
        borderRadius: 8, fontSize: 12, textAlign: "left",
        color: correct ? C.correct : wrong ? C.incorrect : C.text,
        cursor: (isMatched || submitted) ? "default" : "pointer",
        transition: "all 0.15s ease",
        opacity: isMatched && !submitted ? 0.6 : 1,
        width: "100%",
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 10 }}>
                {/* left */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    {q.pairs.map((pair, i) => {
                        const isMatched = matches[i] !== undefined;
                        const isSelected = selectedLeft === i;
                        const correct = submitted && isMatched && isCorrectMatch(i, matches[i]);
                        const wrong = submitted && isMatched && !isCorrectMatch(i, matches[i]);
                        return (
                            <button key={i} onClick={() => handleLeft(i)}
                                style={pairBtnStyle(isSelected, correct, wrong, isMatched, false)}>
                                {pair.left}
                            </button>
                        );
                    })}
                </div>
                {/* right */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    {rightOrder.map((originalIdx, shuffledIdx) => {
                        const isMatched = matchedRights.has(shuffledIdx);
                        const leftEntry = Object.entries(matches).find(([, r]) => r === shuffledIdx);
                        const leftIdx = leftEntry ? parseInt(leftEntry[0]) : -1;
                        const correct = submitted && leftIdx >= 0 && isCorrectMatch(leftIdx, shuffledIdx);
                        const wrong = submitted && leftIdx >= 0 && !isCorrectMatch(leftIdx, shuffledIdx);
                        return (
                            <button key={shuffledIdx} onClick={() => handleRight(shuffledIdx)}
                                style={pairBtnStyle(false, correct, wrong, isMatched,
                                    selectedLeft !== null && !isMatched)}>
                                {q.pairs[originalIdx].right}
                            </button>
                        );
                    })}
                </div>
            </div>
            {allMatched && !submitted && (
                <button onClick={() => setSubmitted(true)} style={submitBtn(true)}>
                    Valider →
                </button>
            )}
            {submitted && (
                <>
                    <div style={explanationBox(
                        Object.entries(matches).every(([l, r]) => isCorrectMatch(parseInt(l), r))
                    )}>
                        {q.explanation}
                    </div>
                    <RatingRow onRate={onRate} />
                </>
            )}
        </div>
    );
};

// ─── 5. Word Bank ─────────────────────────────────────────────────────────────

const WordBank: React.FC<{
    q: WordBankQuestion; onRate: (r: SRRating) => void;
}> = ({ q, onRate }) => {
    const blankCount = (q.sentence.match(/___/g) ?? []).length;
    const [filled, setFilled] = useState<(string | null)[]>(Array(blankCount).fill(null));
    const [usedBank, setUsedBank] = useState<Set<string>>(new Set());
    const [submitted, setSubmitted] = useState(false);
    const [shuffled] = useState(() => [...q.bank].sort(() => Math.random() - 0.5));

    const allFilled = filled.every(Boolean);
    const isCorrect = filled.every((f, i) => f === q.correctWords[i]);
    const parts = q.sentence.split("___");

    const fill = (word: string) => {
        if (submitted || usedBank.has(word)) return;
        const idx = filled.findIndex(f => f === null);
        if (idx === -1) return;
        setFilled(prev => { const n = [...prev]; n[idx] = word; return n; });
        setUsedBank(prev => new Set([...prev, word]));
    };

    const unfill = (idx: number) => {
        if (submitted) return;
        const word = filled[idx];
        if (!word) return;
        setFilled(prev => { const n = [...prev]; n[idx] = null; return n; });
        setUsedBank(prev => { const s = new Set(prev); s.delete(word); return s; });
    };

    const blankStyle = (idx: number): React.CSSProperties => {
        const val = filled[idx];
        const ok = submitted && val === q.correctWords[idx];
        const bad = submitted && val !== q.correctWords[idx];
        return {
            minWidth: 80, padding: "3px 10px",
            background: !val ? "#1c2128"
                : ok ? "rgba(34,197,94,0.15)"
                    : bad ? "rgba(239,68,68,0.12)"
                        : "rgba(165,180,252,0.15)",
            border: `1px solid ${!val ? C.border : ok ? C.correct : bad ? C.incorrect : C.neutral}`,
            borderRadius: 6, fontSize: 13, fontWeight: val ? 500 : 400,
            color: !val ? C.muted : ok ? C.correct : bad ? C.incorrect : C.neutral,
            cursor: val && !submitted ? "pointer" : "default",
            transition: "all 0.15s ease",
        };
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* sentence with blanks */}
            <div style={{
                background: C.bg, border: "1px solid #21262d",
                borderRadius: 10, padding: 16,
                fontSize: 14, lineHeight: 2.2, color: C.text,
                display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4,
            }}>
                {parts.map((part, i) => (
                    <React.Fragment key={i}>
                        <span>{part}</span>
                        {i < parts.length - 1 && (
                            <button onClick={() => unfill(i)} style={blankStyle(i)}>
                                {filled[i] ?? "___"}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* word bank */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {shuffled.map(word => {
                    const used = usedBank.has(word);
                    return (
                        <button key={word} onClick={() => fill(word)}
                            disabled={used || submitted}
                            style={{
                                padding: "7px 14px",
                                background: used ? C.bg : C.surface,
                                border: `1px solid ${used ? C.surface : C.border}`,
                                borderRadius: 20, color: used ? C.border : C.text,
                                fontSize: 12,
                                cursor: used || submitted ? "default" : "pointer",
                                textDecoration: used ? "line-through" : "none",
                                transition: "all 0.15s ease",
                            }}
                        >
                            {word}
                        </button>
                    );
                })}
            </div>

            {!submitted
                ? <button onClick={() => setSubmitted(true)} style={submitBtn(allFilled)}>
                    Valider →
                </button>
                : <>
                    <div style={explanationBox(isCorrect)}>{q.explanation}</div>
                    <RatingRow onRate={onRate} />
                </>
            }
        </div>
    );
};

// ─── 6. Sentence (free text) ──────────────────────────────────────────────────

const Sentence: React.FC<{
    q: SentenceQuestion; onRate: (r: SRRating) => void;
}> = ({ q, onRate }) => {
    const [answer, setAnswer] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const hasText = answer.trim().length > 0;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                disabled={submitted}
                placeholder={q.placeholder}
                rows={4}
                style={{
                    background: C.bg,
                    border: `1px solid ${submitted ? C.muted : C.border}`,
                    borderRadius: 10, padding: "14px 16px",
                    color: C.text, fontSize: 13,
                    resize: "none", outline: "none",
                    lineHeight: 1.7, fontFamily: "inherit",
                    opacity: submitted ? 0.7 : 1,
                    transition: "border 0.2s ease",
                    width: "100%", boxSizing: "border-box",
                }}
            />
            {!submitted ? (
                <button onClick={() => setSubmitted(true)} style={submitBtn(hasText)}>
                    Voir la réponse →
                </button>
            ) : (
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <span style={{
                            color: C.muted, fontSize: 10,
                            textTransform: "uppercase", letterSpacing: "0.08em",
                        }}>
                            Réponse de référence
                        </span>
                        <div style={{
                            background: "rgba(165,180,252,0.08)",
                            border: "1px solid rgba(165,180,252,0.2)",
                            borderRadius: 8, padding: "12px 14px",
                            color: C.text, fontSize: 13, lineHeight: 1.7,
                        }}>
                            {q.modelAnswer}
                        </div>
                        <div style={explanationBox(true)}>{q.explanation}</div>
                    </div>
                    <RatingRow onRate={onRate} />
                </>
            )}
        </div>
    );
};

// ─── Quiz type labels ─────────────────────────────────────────────────────────

const QUIZ_LABELS: Record<QuizQuestion["type"], string> = {
    multiple_choice: "Choix multiple",
    true_false: "Vrai ou Faux",
    ordering: "Ordre",
    match_pairs: "Association",
    word_bank: "Compléter",
    sentence: "Réponse libre",
};

// ─── Quiz Player ──────────────────────────────────────────────────────────────

interface QuizPlayerProps {
    question: QuizQuestion;
    questionId: string;
    nodeId: string;
    onComplete: (questionId: string, rating: SRRating) => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
    question, questionId, onComplete,
}) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* type badge */}
        <span style={{
            alignSelf: "flex-start",
            background: "rgba(165,180,252,0.1)",
            border: "1px solid rgba(165,180,252,0.25)",
            borderRadius: 20, padding: "2px 10px",
            color: C.neutral, fontSize: 10,
            textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
            {QUIZ_LABELS[question.type]}
        </span>

        {/* question */}
        <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            {question.question}
        </p>

        {/* interaction */}
        {question.type === "multiple_choice" && (
            <MultipleChoice q={question} onRate={r => onComplete(questionId, r)} />
        )}
        {question.type === "true_false" && (
            <TrueFalse q={question} onRate={r => onComplete(questionId, r)} />
        )}
        {question.type === "ordering" && (
            <Ordering q={question} onRate={r => onComplete(questionId, r)} />
        )}
        {question.type === "match_pairs" && (
            <MatchPairs q={question} onRate={r => onComplete(questionId, r)} />
        )}
        {question.type === "word_bank" && (
            <WordBank q={question} onRate={r => onComplete(questionId, r)} />
        )}
        {question.type === "sentence" && (
            <Sentence q={question} onRate={r => onComplete(questionId, r)} />
        )}
    </div>
);