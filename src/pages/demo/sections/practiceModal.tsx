import React, { useState, useEffect, useRef } from "react";
import { type PracticeQuestion, PRACTICE_QUESTIONS } from "../data/practiceQuestions";
import { initialNodes } from "../data/graphData";

interface PracticeModalProps {
    onClose: () => void;
}

type Phase = "question" | "comparing" | "done";

export const PracticeModal: React.FC<PracticeModalProps> = ({ onClose }) => {
    const [visible, setVisible] = useState(false);
    const [question, setQuestion] = useState<PracticeQuestion | null>(null);
    const [nodeName, setNodeName] = useState("");
    const [answer, setAnswer] = useState("");
    const [phase, setPhase] = useState<Phase>("question");
    const [selfScore, setSelfScore] = useState<"easy" | "medium" | "hard" | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // only pick from completed nodes that have questions
        const completed: string[] = JSON.parse(localStorage.getItem("completed_nodes") ?? "[]");
        const available = PRACTICE_QUESTIONS.filter(q => completed.includes(q.nodeId));

        // if nothing completed yet, fall back to all questions
        const pool = available.length > 0 ? available : PRACTICE_QUESTIONS;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        setQuestion(pick);

        const node = initialNodes.find(n => n.id === pick.nodeId);
        setNodeName(node?.title ?? "");

        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        setTimeout(() => textareaRef.current?.focus(), 400);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 320);
    };

    const handleSubmit = () => {
        if (answer.trim().length === 0) return;
        setPhase("comparing");
    };

    const handleSelfScore = (score: "easy" | "medium" | "hard") => {
        setSelfScore(score);
        setPhase("done");
    };

    const TYPE_LABEL: Record<PracticeQuestion["type"], string> = {
        recall: "Rappel",
        relational: "Connexion",
        applicable: "Application",
    };

    const TYPE_COLOR: Record<PracticeQuestion["type"], string> = {
        recall: "#94a3b8",
        relational: "#a5b4fc",
        applicable: "#4ecdc4",
    };

    if (!question) return null;

    const typeColor = TYPE_COLOR[question.type];

    return (
        <>
            <style>{`
                @keyframes practiceIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .self-score-btn:hover {
                    opacity: 0.85;
                }
            `}</style>

            {/* backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: "absolute", inset: 0, zIndex: 45,
                    backdropFilter: visible ? "blur(5px)" : "none",
                    background: visible ? "rgba(0,0,0,0.5)" : "transparent",
                    transition: "all 0.32s ease",
                    pointerEvents: visible ? "auto" : "none",
                }}
            />

            {/* modal */}
            <div style={{
                position: "absolute", zIndex: 46,
                left: "50%", top: "50%",
                transform: visible
                    ? "translate(-50%, -50%)"
                    : "translate(-50%, -44%)",
                width: "min(520px, 92vw)",
                background: "#161b22",
                border: "1px solid #30363d",
                borderRadius: 14,
                overflow: "hidden",
                opacity: visible ? 1 : 0,
                transition: "all 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            }}>

                {/* header */}
                <div style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #21262d",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 16 }}>💪</span>
                        <span style={{ color: "#c9d1d9", fontSize: 13, fontWeight: 500 }}>
                            S'entraîner
                        </span>
                        <div style={{
                            background: `${typeColor}18`,
                            border: `1px solid ${typeColor}44`,
                            borderRadius: 20, padding: "2px 9px",
                            color: typeColor, fontSize: 10,
                        }}>
                            {TYPE_LABEL[question.type]}
                        </div>
                    </div>
                    <button onClick={handleClose} style={{
                        background: "none", border: "none", color: "#484f58",
                        fontSize: 18, cursor: "pointer", lineHeight: 1, padding: 0,
                    }}>×</button>
                </div>

                {/* node badge */}
                <div style={{ padding: "14px 20px 0" }}>
                    <span style={{
                        background: "#21262d", border: "1px solid #30363d",
                        borderRadius: 20, padding: "3px 10px",
                        color: "#6e7681", fontSize: 11,
                    }}>
                        {nodeName}
                    </span>
                </div>

                {/* content */}
                <div style={{ padding: "16px 20px 20px" }}>

                    {/* question */}
                    <p style={{
                        color: "#c9d1d9", fontSize: 14, lineHeight: 1.7,
                        margin: "0 0 16px 0", fontWeight: 400,
                    }}>
                        {question.question}
                    </p>

                    {/* answer textarea - phase: question */}
                    {phase === "question" && (
                        <>
                            <textarea
                                ref={textareaRef}
                                value={answer}
                                onChange={e => setAnswer(e.target.value)}
                                placeholder="Écris ta réponse ici — sans regarder tes notes..."
                                style={{
                                    width: "100%", boxSizing: "border-box",
                                    background: "#0d1117", border: "1px solid #30363d",
                                    borderRadius: 10, padding: "14px 16px",
                                    color: "#c9d1d9", fontSize: 13,
                                    resize: "none", outline: "none",
                                    minHeight: 130, lineHeight: 1.7,
                                    fontFamily: "inherit",
                                    transition: "border 0.2s ease",
                                }}
                                onFocus={e => e.target.style.borderColor = `${typeColor}66`}
                                onBlur={e => e.target.style.borderColor = "#30363d"}
                            />
                            <div style={{
                                display: "flex", alignItems: "center",
                                justifyContent: "space-between", marginTop: 12,
                            }}>
                                <span style={{ color: "#484f58", fontSize: 11 }}>
                                    Pas d'inquiétude — il n'y a pas de notation.
                                </span>
                                <button
                                    onClick={handleSubmit}
                                    disabled={answer.trim().length === 0}
                                    style={{
                                        padding: "9px 20px",
                                        background: answer.trim().length > 0
                                            ? `${typeColor}22` : "#21262d",
                                        border: `1px solid ${answer.trim().length > 0
                                            ? `${typeColor}66` : "#30363d"}`,
                                        color: answer.trim().length > 0 ? typeColor : "#484f58",
                                        borderRadius: 8, fontSize: 12, fontWeight: 500,
                                        cursor: answer.trim().length > 0 ? "pointer" : "not-allowed",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    Comparer →
                                </button>
                            </div>
                        </>
                    )}

                    {/* comparing phase */}
                    {phase === "comparing" && (
                        <div style={{ animation: "practiceIn 0.3s ease" }}>

                            {/* user answer */}
                            <div style={{ marginBottom: 14 }}>
                                <span style={{
                                    color: "#484f58", fontSize: 10,
                                    textTransform: "uppercase", letterSpacing: "0.08em",
                                    display: "block", marginBottom: 6,
                                }}>Ta réponse</span>
                                <div style={{
                                    background: "#0d1117", border: "1px solid #21262d",
                                    borderRadius: 8, padding: "12px 14px",
                                    color: "#8b949e", fontSize: 13, lineHeight: 1.7,
                                    whiteSpace: "pre-wrap",
                                }}>
                                    {answer}
                                </div>
                            </div>

                            {/* model answer */}
                            <div style={{ marginBottom: 14 }}>
                                <span style={{
                                    color: typeColor, fontSize: 10,
                                    textTransform: "uppercase", letterSpacing: "0.08em",
                                    display: "block", marginBottom: 6,
                                }}>Réponse de référence</span>
                                <div style={{
                                    background: `${typeColor}0d`,
                                    border: `1px solid ${typeColor}33`,
                                    borderRadius: 8, padding: "12px 14px",
                                    color: "#c9d1d9", fontSize: 13, lineHeight: 1.7,
                                }}>
                                    {question.modelAnswer}
                                </div>
                            </div>

                            {/* follow up */}
                            {question.followUp && (
                                <div style={{
                                    background: "#21262d", borderRadius: 8,
                                    padding: "10px 14px", marginBottom: 16,
                                    color: "#6e7681", fontSize: 12, lineHeight: 1.6,
                                    fontStyle: "italic",
                                }}>
                                    💬 {question.followUp}
                                </div>
                            )}

                            {/* self assessment */}
                            <div>
                                <span style={{
                                    color: "#484f58", fontSize: 11,
                                    display: "block", marginBottom: 10,
                                }}>
                                    Comment tu évalues ta réponse ?
                                </span>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {([
                                        ["hard", "😅 Difficile", "#ef4444"],
                                        ["medium", "🤔 Presque", "#f59e0b"],
                                        ["easy", "✓ Bien compris", "#22c55e"],
                                    ] as const).map(([score, label, color]) => (
                                        <button
                                            key={score}
                                            className="self-score-btn"
                                            onClick={() => handleSelfScore(score)}
                                            style={{
                                                flex: 1, padding: "9px 4px",
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
                        </div>
                    )}

                    {/* done phase */}
                    {phase === "done" && (
                        <div style={{
                            animation: "practiceIn 0.3s ease",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: 16, paddingTop: 8,
                        }}>
                            <div style={{ fontSize: 28 }}>
                                {selfScore === "easy" ? "✦" : selfScore === "medium" ? "→" : "↺"}
                            </div>
                            <p style={{
                                color: "#c9d1d9", fontSize: 14, lineHeight: 1.7,
                                textAlign: "center", margin: 0,
                            }}>
                                {selfScore === "easy"
                                    ? "C'est noté. Le simple fait d'avoir généré cette réponse renforce la trace mémorielle — même si tu t'en souviens bien."
                                    : selfScore === "medium"
                                        ? "C'est exactement là que l'apprentissage se produit. Reviens sur ce concept dans quelques jours."
                                        : "La difficulté que tu ressens est le signe que ton cerveau travaille. C'est ici que la consolidation commence."
                                }
                            </p>
                            <button
                                onClick={handleClose}
                                style={{
                                    padding: "10px 28px",
                                    background: "rgba(78,205,196,0.12)",
                                    border: "1px solid rgba(78,205,196,0.35)",
                                    color: "#4ecdc4", borderRadius: 8,
                                    fontSize: 13, cursor: "pointer",
                                }}
                            >
                                Terminer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};