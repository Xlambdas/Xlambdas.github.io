import React, { useState, useEffect } from "react";
import {
    getDueCards,
    getAllCards,
    upsertCard,
} from "../helpers/srEngine";
import type { SRCard, SRRating } from "../constants/types";
import { initialNodes } from "../data/graphData";
import { QuizPlayer } from "../components/quizPlayer";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MAX_PER_SESSION = 7;

const NODE_COLOR: Record<string, string> = {
    main: "#ffffff",
    folder: "#a5b4fc",
    file: "#94a3b8",
};

const getColor = (nodeId: string): string => {
    const node = initialNodes.find(n => n.id === nodeId);
    return node ? NODE_COLOR[node.type] ?? "#a5b4fc" : "#a5b4fc";
};

// resolve a card back to its QuizQuestion by parsing questionId
// format: nodeId::lessonId::blockIndex
const resolveCard = (card: SRCard) => {
    const [nodeId, lessonId, blockIndexStr] = card.questionId.split("::");
    const blockIndex = parseInt(blockIndexStr ?? "0");
    const node = initialNodes.find(n => n.id === nodeId);
    if (!node) return null;
    const lesson = node.lessonPath.find(l => l.id === lessonId)
        ?? node.optionalLessonPath?.find(l => l.id === lessonId);
    if (!lesson) return null;
    const block = lesson.blocks[blockIndex];
    if (!block || block.type !== "quiz") return null;
    return {
        node,
        lesson,
        question: block.question,
        questionId: card.questionId,
        nodeId,
    };
};

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState: React.FC<{
    totalCards: number;
    onClose: () => void;
}> = ({ totalCards, onClose }) => (
    <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: "0 32px",
        textAlign: "center",
    }}>
        <span style={{ fontSize: 40 }}>✦</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <h2 style={{
                color: "#c9d1d9", fontSize: 18,
                fontWeight: 600, margin: 0,
            }}>
                Tout est à jour
            </h2>
            <p style={{
                color: "#6e7681", fontSize: 13,
                lineHeight: 1.7, margin: 0,
            }}>
                {totalCards === 0
                    ? "Tu n'as pas encore de questions à réviser. Complète des leçons pour en ajouter."
                    : `Aucune révision due aujourd'hui. Tu as ${totalCards} question${totalCards > 1 ? "s" : ""} dans ta banque — reviens demain.`}
            </p>
        </div>
        <button
            onClick={onClose}
            style={{
                padding: "12px 28px",
                background: "rgba(165,180,252,0.12)",
                border: "1px solid rgba(165,180,252,0.3)",
                color: "#a5b4fc", borderRadius: 10,
                fontSize: 13, cursor: "pointer",
            }}
        >
            Revenir au graphe
        </button>
    </div>
);

// ─── Session complete screen ───────────────────────────────────────────────────

const SessionComplete: React.FC<{
    done: number;
    remaining: number;
    ratings: SRRating[];
    onContinue: () => void;
    onClose: () => void;
}> = ({ done, remaining, ratings, onContinue, onClose }) => {
    const perfect = ratings.filter(r => r === "perfect").length;
    const almost = ratings.filter(r => r === "almost").length;
    const forgot = ratings.filter(r => r === "forgot").length;

    return (
        <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            padding: "0 28px",
            textAlign: "center",
        }}>
            <span style={{ fontSize: 36 }}>
                {forgot === 0 ? "🎯" : perfect > forgot ? "📈" : "💪"}
            </span>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <h2 style={{
                    color: "#c9d1d9", fontSize: 18,
                    fontWeight: 600, margin: 0,
                }}>
                    Session terminée
                </h2>
                <p style={{
                    color: "#6e7681", fontSize: 13,
                    lineHeight: 1.7, margin: 0,
                }}>
                    {done} question{done > 1 ? "s" : ""} révisée{done > 1 ? "s" : ""}.
                    {remaining > 0
                        ? ` Il en reste ${remaining} — tu peux continuer maintenant.`
                        : " Tu as tout révisé pour aujourd'hui."}
                </p>
            </div>

            {/* score breakdown */}
            <div style={{
                background: "#0d1117",
                border: "1px solid #21262d",
                borderRadius: 12,
                padding: "16px 20px",
                width: "100%",
                display: "flex",
                justifyContent: "space-around",
            }}>
                {[
                    [forgot, "😅 Pas su", "#ef4444"],
                    [almost, "🤔 Presque", "#f59e0b"],
                    [perfect, "✓ Parfait", "#22c55e"],
                ].map(([count, label, color]) => (
                    <div key={String(label)} style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                    }}>
                        <span style={{
                            color: color as string,
                            fontSize: 20,
                            fontWeight: 700,
                        }}>
                            {count}
                        </span>
                        <span style={{
                            color: "#484f58",
                            fontSize: 10,
                        }}>
                            {label}
                        </span>
                    </div>
                ))}
            </div>

            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                width: "100%",
            }}>
                {remaining > 0 && (
                    <button
                        onClick={onContinue}
                        style={{
                            padding: "13px 0",
                            background: "rgba(165,180,252,0.12)",
                            border: "1px solid rgba(165,180,252,0.3)",
                            color: "#a5b4fc", borderRadius: 10,
                            fontSize: 13, fontWeight: 500,
                            cursor: "pointer",
                        }}
                    >
                        Continuer ({remaining} restante{remaining > 1 ? "s" : ""}) →
                    </button>
                )}
                <button
                    onClick={onClose}
                    style={{
                        padding: "13px 0",
                        background: "transparent",
                        border: "1px solid #30363d",
                        color: "#6e7681", borderRadius: 10,
                        fontSize: 13, cursor: "pointer",
                    }}
                >
                    Retour au graphe
                </button>
            </div>
        </div>
    );
};

// ─── Card header ──────────────────────────────────────────────────────────────

const CardHeader: React.FC<{
    current: number;
    total: number;
    nodeId: string;
    lessonTitle: string;
    dueDate: string;
}> = ({ current, total, nodeId, lessonTitle, dueDate }) => {
    const color = getColor(nodeId);
    const node = initialNodes.find(n => n.id === nodeId);
    const isOverdue = dueDate < new Date().toISOString().split("T")[0];

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid #21262d",
            flexShrink: 0,
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
            }}>
                <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 8px ${color}88`,
                    flexShrink: 0,
                }} />
                <div>
                    <div style={{
                        color: "#c9d1d9", fontSize: 12, fontWeight: 500,
                    }}>
                        {node?.title ?? nodeId}
                    </div>
                    <div style={{
                        color: "#484f58", fontSize: 10, marginTop: 2,
                    }}>
                        {lessonTitle}
                        {isOverdue && (
                            <span style={{
                                color: "#ef4444",
                                marginLeft: 6,
                            }}>
                                · en retard
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <span style={{
                color: "#484f58", fontSize: 11,
                background: "#21262d",
                border: "1px solid #30363d",
                borderRadius: 20,
                padding: "2px 10px",
            }}>
                {current} / {total}
            </span>
        </div>
    );
};

// ─── Main component ───────────────────────────────────────────────────────────

interface StrengthenSessionProps {
    nodeId?: string;       // if set, only show cards from this node/branch
    onClose: () => void;
}

type Phase = "session" | "complete" | "empty";

export const StrengthenSession: React.FC<StrengthenSessionProps> = ({
    nodeId, onClose,
}) => {
    const [visible, setVisible] = useState(false);
    const [phase, setPhase] = useState<Phase>("session");
    const [sessionCards, setSessionCards] = useState<SRCard[]>([]);
    const [cardIndex, setCardIndex] = useState(0);
    const [ratings, setRatings] = useState<SRRating[]>([]);
    const [totalDue, setTotalDue] = useState(0);

    const totalCards = getAllCards().length;

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
        initSession();
    }, []);

    const initSession = () => {
        const due = getDueCards(nodeId);
        setTotalDue(due.length);

        if (due.length === 0) {
            setPhase("empty");
            return;
        }

        // take max MAX_PER_SESSION, prioritize most overdue
        const batch = due.slice(0, MAX_PER_SESSION);
        setSessionCards(batch);
        setCardIndex(0);
        setRatings([]);
        setPhase("session");
    };

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 350);
    };

    const handleRate = (rating: SRRating) => {
        const card = sessionCards[cardIndex];
        upsertCard(card.questionId, card.nodeId, rating);
        setRatings(prev => [...prev, rating]);

        if (cardIndex < sessionCards.length - 1) {
            setCardIndex(i => i + 1);
        } else {
            setPhase("complete");
        }
    };

    // remaining after this session
    const remaining = Math.max(0, totalDue - sessionCards.length);

    const currentCard = sessionCards[cardIndex];
    const resolved = currentCard ? resolveCard(currentCard) : null;

    const progress = sessionCards.length > 0
        ? (cardIndex / sessionCards.length) * 100
        : 0;

    return (
        <>
            <style>{`
                @keyframes cardIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>

            {/* backdrop */}
            <div style={{
                position: "absolute", inset: 0, zIndex: 55,
                backdropFilter: visible ? "blur(8px)" : "none",
                background: visible ? "rgba(0,0,0,0.75)" : "transparent",
                transition: "all 0.35s ease",
                pointerEvents: visible ? "auto" : "none",
            }} />

            {/* panel */}
            <div style={{
                position: "absolute", zIndex: 56,
                bottom: 0, left: "50%",
                transform: visible
                    ? "translateX(-50%)"
                    : "translateX(-50%) translateY(100%)",
                width: "min(600px, 100vw)",
                height: "94vh",
                background: "#161b22",
                borderRadius: "16px 16px 0 0",
                border: "1px solid #30363d",
                borderBottom: "none",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)",
                boxShadow: "0 -8px 60px rgba(0,0,0,0.8)",
            }}
                onClick={e => e.stopPropagation()}
            >
                {/* progress bar */}
                <div style={{ height: 3, background: "#21262d", flexShrink: 0 }}>
                    <div style={{
                        height: "100%",
                        width: phase === "complete" ? "100%" : `${progress}%`,
                        background: "#a5b4fc",
                        transition: "width 0.4s ease",
                    }} />
                </div>

                {/* top bar */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 20px",
                    borderBottom: "1px solid #21262d",
                    flexShrink: 0,
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}>
                        <span style={{ fontSize: 16 }}>💪</span>
                        <span style={{
                            color: "#c9d1d9",
                            fontSize: 13,
                            fontWeight: 500,
                        }}>
                            S'entraîner
                        </span>
                        {nodeId && (
                            <span style={{
                                color: "#484f58",
                                fontSize: 11,
                            }}>
                                · {initialNodes.find(n => n.id === nodeId)?.title}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleClose}
                        style={{
                            background: "none", border: "none",
                            color: "#484f58", fontSize: 20,
                            cursor: "pointer", lineHeight: 1, padding: 4,
                        }}
                    >×</button>
                </div>

                {/* body */}
                {phase === "empty" && (
                    <EmptyState
                        totalCards={totalCards}
                        onClose={handleClose}
                    />
                )}

                {phase === "complete" && (
                    <SessionComplete
                        done={sessionCards.length}
                        remaining={remaining}
                        ratings={ratings}
                        onContinue={initSession}
                        onClose={handleClose}
                    />
                )}

                {phase === "session" && resolved && (
                    <>
                        {/* card header */}
                        <CardHeader
                            current={cardIndex + 1}
                            total={sessionCards.length}
                            nodeId={resolved.nodeId}
                            lessonTitle={resolved.lesson.title}
                            dueDate={currentCard.dueDate}
                        />

                        {/* question */}
                        <div
                            key={cardIndex}
                            style={{
                                flex: 1,
                                overflowY: "auto",
                                scrollbarWidth: "thin",
                                scrollbarColor: "#21262d transparent",
                                padding: "24px",
                                animation: "cardIn 0.25s ease",
                            }}
                        >
                            <QuizPlayer
                                question={resolved.question}
                                questionId={resolved.questionId}
                                nodeId={resolved.nodeId}
                                onComplete={(_, rating) => handleRate(rating)}
                            />
                        </div>
                    </>
                )}

                {/* session fallback: card resolved to null (lesson deleted etc) */}
                {phase === "session" && currentCard && !resolved && (
                    <div style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 16,
                        color: "#484f58",
                        fontSize: 13,
                        padding: 24,
                        textAlign: "center",
                    }}>
                        <span>Cette question n'est plus disponible.</span>
                        <button
                            onClick={() => {
                                if (cardIndex < sessionCards.length - 1) {
                                    setCardIndex(i => i + 1);
                                } else {
                                    setPhase("complete");
                                }
                            }}
                            style={{
                                padding: "10px 20px",
                                background: "#21262d",
                                border: "1px solid #30363d",
                                color: "#8b949e",
                                borderRadius: 8,
                                fontSize: 12,
                                cursor: "pointer",
                            }}
                        >
                            Passer →
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};