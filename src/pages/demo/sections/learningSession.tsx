import React, { useState, useRef, useEffect } from "react";
import { type NodeType, initialNodes } from "../data/graphData";

import { getNotesForNode } from "../data/teacherNotes";
import { TeacherNoteCard } from "./teacherNoteCard";

const TYPE_COLOR: Record<NodeType["type"], string> = {
    main: "#ffffff",
    folder: "#a5b4fc",
    file: "#94a3b8",
};

interface LearningSessionProps {
    node: NodeType;
    onComplete: (nodeId: string) => void;
    onClose: () => void;
}

type SessionStep =
    | { type: "hook"; content: string }
    | { type: "attempt"; question: string; placeholder: string }
    | { type: "concept"; layers: string[] }
    | { type: "tension"; content: string; question: string }
    | { type: "connection"; prompt: string }
    | { type: "return_hook"; content: string; nextNodeId?: string }


export const LearningSession: React.FC<LearningSessionProps> = ({ node, onComplete, onClose }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [layerIndex, setLayerIndex] = useState(0);
    const [attemptText, setAttemptText] = useState("");
    const [attemptSubmitted, setAttemptSubmitted] = useState(false);
    const [connectionText, setConnectionText] = useState("");
    const [connectionSubmitted, setConnectionSubmitted] = useState(false);
    const [tensionText, setTensionText] = useState("");
    const [tensionSubmitted, setTensionSubmitted] = useState(false);
    const [visible, setVisible] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const steps: SessionStep[] = (node as any).session ?? [];
    const step = steps[stepIndex] as SessionStep | undefined;
    const color = TYPE_COLOR[node.type];
    const progress = steps.length > 0 ? ((stepIndex) / steps.length) * 100 : 0;

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, []);

    useEffect(() => {
        setLayerIndex(0);
        setAttemptSubmitted(false);
        setConnectionSubmitted(false);
        setTensionSubmitted(false);
        setAttemptText("");
        setConnectionText("");
        setTensionText("");
    }, [stepIndex]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 350);
    };

    const handleNext = () => {
        if (stepIndex < steps.length - 1) {
            setStepIndex(i => i + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        const completed: string[] = JSON.parse(localStorage.getItem("completed_nodes") ?? "[]");
        if (!completed.includes(node.id)) {
            localStorage.setItem("completed_nodes", JSON.stringify([...completed, node.id]));
        }
        onComplete(node.id);
        setVisible(false);
        setTimeout(onClose, 350);
    };

    const renderMarkdown = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            .split("\n\n")
            .map((p, i) => `<p key=${i} style="margin:0 0 14px 0">${p}</p>`)
            .join("");
    };

    const renderStep = () => {
        if (!step) return null;

        switch (step.type) {

            case "hook":
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
                        <div style={{
                            background: "#0d1117",
                            border: "1px solid #21262d",
                            borderLeft: `3px solid ${color}`,
                            borderRadius: 10, padding: "20px 22px",
                            color: "#c9d1d9", fontSize: 15, lineHeight: 1.8,
                        }}
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(step.content) }}
                        />
                        <button onClick={handleNext} style={primaryBtn(color)}>
                            Je suis curieux →
                        </button>
                    </div>
                );

            case "attempt":
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
                        <p style={{ color: "#c9d1d9", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                            {step.question}
                        </p>
                        <textarea
                            ref={textareaRef}
                            value={attemptText}
                            onChange={e => setAttemptText(e.target.value)}
                            placeholder={step.placeholder}
                            disabled={attemptSubmitted}
                            style={{
                                background: "#0d1117",
                                border: `1px solid ${attemptSubmitted ? color + "44" : "#30363d"}`,
                                borderRadius: 10, padding: "14px 16px",
                                color: "#c9d1d9", fontSize: 13,
                                resize: "none", outline: "none",
                                minHeight: 120, lineHeight: 1.6,
                                opacity: attemptSubmitted ? 0.6 : 1,
                                transition: "border 0.3s ease",
                                fontFamily: "inherit",
                            }}
                        />
                        {!attemptSubmitted ? (
                            <button
                                onClick={() => {
                                    setAttemptSubmitted(true);
                                    setTimeout(() => textareaRef.current?.blur(), 50);
                                }}
                                disabled={attemptText.trim().length === 0}
                                style={primaryBtn(color, attemptText.trim().length === 0)}
                            >
                                Voir ce que dit la recherche →
                            </button>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{
                                    background: `${color}11`,
                                    border: `1px solid ${color}33`,
                                    borderRadius: 8, padding: "10px 14px",
                                    color: "#6e7681", fontSize: 12, lineHeight: 1.6,
                                }}>
                                    ✓ Ta réponse est enregistrée. Maintenant, voici ce que la recherche dit — compare avec ce que tu as écrit.
                                </div>
                                <button onClick={handleNext} style={primaryBtn(color)}>
                                    Découvrir l'explication →
                                </button>
                            </div>
                        )}
                    </div>
                );

            case "concept":
                const currentLayer = step.layers[layerIndex];
                const hasMore = layerIndex < step.layers.length - 1;
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
                        {/* layer progress dots */}
                        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                            {step.layers.map((_, i) => (
                                <div key={i} style={{
                                    width: 6, height: 6, borderRadius: "50%",
                                    background: i <= layerIndex ? color : "#21262d",
                                    transition: "background 0.3s ease",
                                }} />
                            ))}
                        </div>

                        <div
                            key={layerIndex}
                            style={{
                                background: "#0d1117",
                                border: "1px solid #21262d",
                                borderRadius: 10, padding: "20px 22px",
                                color: "#c9d1d9", fontSize: 14, lineHeight: 1.8,
                                flex: 1,
                                animation: "fadeSlideIn 0.3s ease",
                            }}
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(currentLayer) }}
                        />
                        {(() => {
                            const notes = getNotesForNode(node.id);
                            if (notes.length === 0) return null;
                            return (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                                    <span style={{
                                        color: "#484f58", fontSize: 10,
                                        textTransform: "uppercase", letterSpacing: "0.08em",
                                    }}>Notes des enseignants</span>
                                    {notes.map((note, i) => (
                                        <TeacherNoteCard key={i} note={note} isTeacher={false} />
                                    ))}
                                </div>
                            );
                        })()}

                        {hasMore ? (
                            <button onClick={() => setLayerIndex(i => i + 1)} style={secondaryBtn}>
                                Aller plus loin ↓
                            </button>
                        ) : (
                            <button onClick={handleNext} style={primaryBtn(color)}>
                                J'ai compris →
                            </button>
                        )}
                    </div>
                );

            case "tension":
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
                        <div style={{
                            background: "rgba(251,146,60,0.08)",
                            border: "1px solid rgba(251,146,60,0.25)",
                            borderRadius: 10, padding: "18px 20px",
                            color: "#c9d1d9", fontSize: 14, lineHeight: 1.8,
                        }}
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(step.content) }}
                        />
                        <p style={{ color: "#8b949e", fontSize: 13, margin: 0 }}>{step.question}</p>
                        <textarea
                            value={tensionText}
                            onChange={e => setTensionText(e.target.value)}
                            disabled={tensionSubmitted}
                            placeholder="Ta réflexion..."
                            style={{
                                background: "#0d1117", border: "1px solid #30363d",
                                borderRadius: 10, padding: "14px 16px",
                                color: "#c9d1d9", fontSize: 13,
                                resize: "none", outline: "none",
                                minHeight: 90, lineHeight: 1.6,
                                opacity: tensionSubmitted ? 0.6 : 1,
                                fontFamily: "inherit",
                            }}
                        />
                        {!tensionSubmitted ? (
                            <button
                                onClick={() => setTensionSubmitted(true)}
                                disabled={tensionText.trim().length === 0}
                                style={primaryBtn(color, tensionText.trim().length === 0)}
                            >
                                Continuer →
                            </button>
                        ) : (
                            <button onClick={handleNext} style={primaryBtn(color)}>
                                Voir la suite →
                            </button>
                        )}
                    </div>
                );

            case "connection":
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
                        <div style={{
                            background: "#0d1117", border: "1px solid #21262d",
                            borderLeft: `3px solid ${color}`,
                            borderRadius: 10, padding: "16px 18px",
                            color: "#8b949e", fontSize: 13, lineHeight: 1.7,
                            fontStyle: "italic",
                        }}>
                            {step.prompt}
                        </div>
                        <textarea
                            value={connectionText}
                            onChange={e => setConnectionText(e.target.value)}
                            disabled={connectionSubmitted}
                            placeholder="En une phrase..."
                            style={{
                                background: "#0d1117", border: "1px solid #30363d",
                                borderRadius: 10, padding: "14px 16px",
                                color: "#c9d1d9", fontSize: 13,
                                resize: "none", outline: "none",
                                minHeight: 90, lineHeight: 1.6,
                                opacity: connectionSubmitted ? 0.6 : 1,
                                fontFamily: "inherit",
                            }}
                        />
                        {!connectionSubmitted ? (
                            <button
                                onClick={() => setConnectionSubmitted(true)}
                                disabled={connectionText.trim().length === 0}
                                style={primaryBtn(color, connectionText.trim().length === 0)}
                            >
                                Valider ma connexion →
                            </button>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div style={{
                                    background: `${color}11`, border: `1px solid ${color}33`,
                                    borderRadius: 8, padding: "10px 14px",
                                    color: "#6e7681", fontSize: 12, lineHeight: 1.6,
                                }}>
                                    ✓ Connexion enregistrée. C'est exactement ce type de lien que ton cerveau cherche à construire.
                                </div>
                                <button onClick={handleNext} style={primaryBtn(color)}>
                                    Terminer →
                                </button>
                            </div>
                        )}
                    </div>
                );

            case "return_hook":
                const nextNode = step.nextNodeId
                    ? initialNodes.find(n => n.id === step.nextNodeId)
                    : null;
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                        <div style={{ fontSize: 32 }}>✦</div>
                        <p style={{
                            color: "#c9d1d9", fontSize: 16, lineHeight: 1.8,
                            fontStyle: "italic", margin: 0, padding: "0 8px",
                        }}>
                            {step.content}
                        </p>
                        {nextNode && (
                            <div style={{
                                background: "#0d1117", border: "1px solid #21262d",
                                borderRadius: 10, padding: "12px 20px",
                                color: "#484f58", fontSize: 12,
                            }}>
                                Prochain concept : <span style={{ color: "#8b949e" }}>{nextNode.title}</span>
                            </div>
                        )}
                        <button onClick={handleComplete} style={primaryBtn(color)}>
                            Terminer la session ✓
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    const stepLabels: Record<string, string> = {
        hook: "Accroche",
        attempt: "Ta réponse",
        concept: "Concept",
        tension: "Tension",
        connection: "Connexion",
        return_hook: "À suivre",
    };

    return (
        <>
            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div style={{
                position: "absolute", inset: 0, zIndex: 50,
                backdropFilter: "blur(8px)",
                background: "rgba(0,0,0,0.7)",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.35s ease",
                display: "flex", alignItems: "flex-end", justifyContent: "center",
            }}>
                <div style={{
                    width: "min(600px, 100vw)",
                    height: "92vh",
                    background: "#161b22",
                    borderRadius: "16px 16px 0 0",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden",
                    transform: visible ? "translateY(0)" : "translateY(100%)",
                    transition: "transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)",
                }}>

                    {/* progress bar */}
                    <div style={{ height: 3, background: "#21262d", flexShrink: 0 }}>
                        <div style={{
                            height: "100%", background: color,
                            width: `${progress}%`,
                            transition: "width 0.4s ease",
                        }} />
                    </div>

                    {/* header */}
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 20px", borderBottom: "1px solid #21262d", flexShrink: 0,
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: "50%",
                                background: color, flexShrink: 0,
                            }} />
                            <span style={{ color: "#c9d1d9", fontSize: 13, fontWeight: 500 }}>
                                {node.title}
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {step && (
                                <span style={{ color: "#484f58", fontSize: 11 }}>
                                    {stepLabels[step.type]} · {stepIndex + 1}/{steps.length}
                                </span>
                            )}
                            <button onClick={handleClose} style={{
                                background: "none", border: "none", color: "#484f58",
                                fontSize: 18, cursor: "pointer", lineHeight: 1, padding: 0,
                            }}>×</button>
                        </div>
                    </div>

                    {/* step label */}
                    {step && (
                        <div style={{ padding: "16px 24px 0", flexShrink: 0 }}>
                            <span style={{
                                color: color, fontSize: 10, fontWeight: 600,
                                textTransform: "uppercase", letterSpacing: "0.1em",
                            }}>
                                {stepLabels[step.type]}
                            </span>
                        </div>
                    )}

                    {/* content */}
                    <div style={{
                        flex: 1, padding: "16px 24px 24px",
                        overflowY: "auto", display: "flex", flexDirection: "column",
                    }}>
                        <div key={stepIndex} style={{
                            display: "flex", flexDirection: "column", flex: 1,
                            animation: "fadeSlideIn 0.3s ease",
                        }}>
                            {renderStep()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// --- style helpers ---
const primaryBtn = (color: string, disabled = false): React.CSSProperties => ({
    padding: "13px 0",
    background: disabled ? "#21262d" : `${color}22`,
    border: `1px solid ${disabled ? "#30363d" : color + "66"}`,
    color: disabled ? "#484f58" : color,
    borderRadius: 10, fontSize: 13, fontWeight: 500,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    width: "100%",
});

const secondaryBtn: React.CSSProperties = {
    padding: "11px 0",
    background: "transparent",
    border: "1px solid #30363d",
    color: "#6e7681",
    borderRadius: 10, fontSize: 13,
    cursor: "pointer", width: "100%",
};