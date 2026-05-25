import React, { useState } from "react";
import { CloseIcon } from "../../constants/icons/icons";

interface DailyMoodModalProps {
    onComplete: (preferences: DailyPreferences) => void;
    onSkip: () => void;
}

export interface DailyPreferences {
    mood: "energized" | "focused" | "calm" | "tired" | "quick-win";
    timeAvailable: "5min" | "15min" | "30min" | "1hour+";
    goal: "review" | "learn" | "practice" | "explore";
}

const MOOD_OPTIONS = [
    {
        value: "energized" as const,
        emoji: "🚀",
        label: "Énergisé",
        description: "Prêt à tout conquérir !",
        color: "#22c55e"
    },
    {
        value: "focused" as const,
        emoji: "😊",
        label: "Concentré",
        description: "En forme et motivé",
        color: "#a5b4fc"
    },
    {
        value: "calm" as const,
        emoji: "😌",
        label: "Serein",
        description: "Calme et régulier",
        color: "#8b9dfc"
    },
    {
        value: "tired" as const,
        emoji: "😴",
        label: "Fatigué",
        description: "Mais toujours partant",
        color: "#94a3b8"
    },
    {
        value: "quick-win" as const,
        emoji: "🎯",
        label: "Petite victoire",
        description: "Juste un coup rapide",
        color: "#fbbf24"
    },
];

const TIME_OPTIONS = [
    { value: "5min" as const, label: "5 minutes", emoji: "⚡" },
    { value: "15min" as const, label: "15 minutes", emoji: "⏱️" },
    { value: "30min" as const, label: "30 minutes", emoji: "⏰" },
    { value: "1hour+" as const, label: "1 heure+", emoji: "🎓" },
];

const GOAL_OPTIONS = [
    { value: "review" as const, label: "Réviser", emoji: "🔄", description: "Renforcer ce que je sais" },
    { value: "learn" as const, label: "Apprendre", emoji: "📚", description: "Découvrir du nouveau" },
    { value: "practice" as const, label: "Pratiquer", emoji: "💪", description: "M'entraîner activement" },
    { value: "explore" as const, label: "Explorer", emoji: "🔍", description: "Parcourir librement" },
];

export const MoodModal: React.FC<DailyMoodModalProps> = ({ onComplete, onSkip }) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [mood, setMood] = useState<DailyPreferences["mood"] | null>(null);
    const [timeAvailable, setTimeAvailable] = useState<DailyPreferences["timeAvailable"] | null>(null);
    const [goal, setGoal] = useState<DailyPreferences["goal"] | null>(null);

    const handleComplete = () => {
        if (mood && timeAvailable && goal) {
            onComplete({ mood, timeAvailable, goal });
        }
    };

    const selectedMood = MOOD_OPTIONS.find(m => m.value === mood);

    return (
        <>
            {/* Backdrop */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(8px)",
                    zIndex: 10000,
                    animation: "fadeIn 0.3s ease",
                }}
            />

            {/* Modal */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "min(520px, calc(100vw - 32px))",
                    background: "#161b22",
                    border: "1px solid #30363d",
                    borderRadius: 16,
                    boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
                    zIndex: 10001,
                    animation: "slideUp 0.3s ease",
                    overflow: "hidden",
                }}
            >
                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { opacity: 0; transform: translate(-50%, -45%); }
                        to { opacity: 1; transform: translate(-50%, -50%); }
                    }
                `}</style>

                {/* Header */}
                <div style={{
                    padding: "24px 28px",
                    borderBottom: "1px solid #21262d",
                    background: "linear-gradient(135deg, rgba(165,180,252,0.1) 0%, rgba(139,157,252,0.05) 100%)",
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <div>
                            <h2 style={{
                                color: "#c9d1d9",
                                fontSize: 20,
                                fontWeight: 700,
                                margin: "0 0 4px 0",
                            }}>
                                {step === 1 && "Comment te sens-tu ?"}
                                {step === 2 && "Combien de temps as-tu ?"}
                                {step === 3 && "Quel est ton objectif ?"}
                            </h2>
                            <p style={{
                                color: "#8b949e",
                                fontSize: 13,
                                margin: 0,
                            }}>
                                {step === 1 && "Adaptons ta session à ton énergie du moment"}
                                {step === 2 && "Pour te proposer le bon rythme"}
                                {step === 3 && "On ajuste le contenu pour toi"}
                            </p>
                        </div>
                        <button
                            onClick={onSkip}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#484f58",
                                cursor: "pointer",
                                padding: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 6,
                                transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#21262d";
                                e.currentTarget.style.color = "#8b949e";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "none";
                                e.currentTarget.style.color = "#484f58";
                            }}
                        >
                            <CloseIcon size={20} />
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div style={{
                        marginTop: 16,
                        display: "flex",
                        gap: 6,
                    }}>
                        {[1, 2, 3].map(s => (
                            <div
                                key={s}
                                style={{
                                    flex: 1,
                                    height: 3,
                                    background: s <= step ? "#a5b4fc" : "#21262d",
                                    borderRadius: 2,
                                    transition: "all 0.3s ease",
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div style={{
                    padding: "28px",
                    maxHeight: "60vh",
                    overflowY: "auto",
                }}>
                    {/* Step 1: Mood */}
                    {step === 1 && (
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}>
                            {MOOD_OPTIONS.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setMood(option.value)}
                                    style={{
                                        width: "100%",
                                        background: mood === option.value
                                            ? `${option.color}15`
                                            : "#0d1117",
                                        border: `2px solid ${mood === option.value
                                            ? option.color
                                            : "#21262d"}`,
                                        borderRadius: 12,
                                        padding: "16px 20px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 16,
                                        transition: "all 0.2s ease",
                                        transform: mood === option.value ? "scale(1.02)" : "scale(1)",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (mood !== option.value) {
                                            e.currentTarget.style.background = "#161b22";
                                            e.currentTarget.style.borderColor = "#30363d";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (mood !== option.value) {
                                            e.currentTarget.style.background = "#0d1117";
                                            e.currentTarget.style.borderColor = "#21262d";
                                        }
                                    }}
                                >
                                    <span style={{ fontSize: 32 }}>{option.emoji}</span>
                                    <div style={{ flex: 1, textAlign: "left" }}>
                                        <div style={{
                                            color: mood === option.value ? option.color : "#c9d1d9",
                                            fontSize: 15,
                                            fontWeight: 600,
                                            marginBottom: 4,
                                        }}>
                                            {option.label}
                                        </div>
                                        <div style={{
                                            color: "#8b949e",
                                            fontSize: 12,
                                        }}>
                                            {option.description}
                                        </div>
                                    </div>
                                    {mood === option.value && (
                                        <div style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: "50%",
                                            background: option.color,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#0d1117",
                                            fontWeight: 700,
                                            fontSize: 14,
                                        }}>
                                            ✓
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Time */}
                    {step === 2 && (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: 12,
                        }}>
                            {TIME_OPTIONS.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setTimeAvailable(option.value)}
                                    style={{
                                        background: timeAvailable === option.value
                                            ? "rgba(165,180,252,0.15)"
                                            : "#0d1117",
                                        border: `2px solid ${timeAvailable === option.value
                                            ? "#a5b4fc"
                                            : "#21262d"}`,
                                        borderRadius: 12,
                                        padding: "20px 16px",
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 8,
                                        transition: "all 0.2s ease",
                                        transform: timeAvailable === option.value ? "scale(1.05)" : "scale(1)",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (timeAvailable !== option.value) {
                                            e.currentTarget.style.background = "#161b22";
                                            e.currentTarget.style.borderColor = "#30363d";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (timeAvailable !== option.value) {
                                            e.currentTarget.style.background = "#0d1117";
                                            e.currentTarget.style.borderColor = "#21262d";
                                        }
                                    }}
                                >
                                    <span style={{ fontSize: 32 }}>{option.emoji}</span>
                                    <span style={{
                                        color: timeAvailable === option.value ? "#a5b4fc" : "#c9d1d9",
                                        fontSize: 14,
                                        fontWeight: 600,
                                    }}>
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Step 3: Goal */}
                    {step === 3 && (
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}>
                            {GOAL_OPTIONS.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setGoal(option.value)}
                                    style={{
                                        width: "100%",
                                        background: goal === option.value
                                            ? "rgba(165,180,252,0.15)"
                                            : "#0d1117",
                                        border: `2px solid ${goal === option.value
                                            ? "#a5b4fc"
                                            : "#21262d"}`,
                                        borderRadius: 12,
                                        padding: "16px 20px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 16,
                                        transition: "all 0.2s ease",
                                        transform: goal === option.value ? "scale(1.02)" : "scale(1)",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (goal !== option.value) {
                                            e.currentTarget.style.background = "#161b22";
                                            e.currentTarget.style.borderColor = "#30363d";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (goal !== option.value) {
                                            e.currentTarget.style.background = "#0d1117";
                                            e.currentTarget.style.borderColor = "#21262d";
                                        }
                                    }}
                                >
                                    <span style={{ fontSize: 28 }}>{option.emoji}</span>
                                    <div style={{ flex: 1, textAlign: "left" }}>
                                        <div style={{
                                            color: goal === option.value ? "#a5b4fc" : "#c9d1d9",
                                            fontSize: 15,
                                            fontWeight: 600,
                                            marginBottom: 4,
                                        }}>
                                            {option.label}
                                        </div>
                                        <div style={{
                                            color: "#8b949e",
                                            fontSize: 12,
                                        }}>
                                            {option.description}
                                        </div>
                                    </div>
                                    {goal === option.value && (
                                        <div style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: "50%",
                                            background: "#a5b4fc",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#0d1117",
                                            fontWeight: 700,
                                            fontSize: 14,
                                        }}>
                                            ✓
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: "20px 28px",
                    borderTop: "1px solid #21262d",
                    background: "#0d1117",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)}
                            style={{
                                background: "#21262d",
                                border: "1px solid #30363d",
                                borderRadius: 8,
                                padding: "10px 16px",
                                color: "#8b949e",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#30363d"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "#21262d"}
                        >
                            ← Retour
                        </button>
                    ) : (
                        <div />
                    )}

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(s => (s + 1) as 1 | 2 | 3)}
                            disabled={
                                (step === 1 && !mood) ||
                                (step === 2 && !timeAvailable)
                            }
                            style={{
                                background: (step === 1 && !mood) || (step === 2 && !timeAvailable)
                                    ? "#30363d"
                                    : "linear-gradient(135deg, #a5b4fc 0%, #8b9dfc 100%)",
                                border: "none",
                                borderRadius: 8,
                                padding: "10px 24px",
                                color: (step === 1 && !mood) || (step === 2 && !timeAvailable)
                                    ? "#6e7681"
                                    : "#0d1117",
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: (step === 1 && !mood) || (step === 2 && !timeAvailable)
                                    ? "not-allowed"
                                    : "pointer",
                                transition: "all 0.2s ease",
                                opacity: (step === 1 && !mood) || (step === 2 && !timeAvailable) ? 0.5 : 1,
                            }}
                            onMouseEnter={(e) => {
                                if (!((step === 1 && !mood) || (step === 2 && !timeAvailable))) {
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(165,180,252,0.4)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            Suivant →
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            disabled={!goal}
                            style={{
                                background: !goal
                                    ? "#30363d"
                                    : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                                border: "none",
                                borderRadius: 8,
                                padding: "10px 24px",
                                color: !goal ? "#6e7681" : "#fff",
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: !goal ? "not-allowed" : "pointer",
                                transition: "all 0.2s ease",
                                opacity: !goal ? 0.5 : 1,
                            }}
                            onMouseEnter={(e) => {
                                if (goal) {
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(34,197,94,0.4)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            C'est parti ! 🚀
                        </button>
                    )}
                </div>

                {/* Selected mood indicator in footer */}
                {step > 1 && selectedMood && (
                    <div style={{
                        position: "absolute",
                        bottom: 20,
                        left: 28,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 12px",
                        background: "#0d1117",
                        border: "1px solid #21262d",
                        borderRadius: 8,
                        fontSize: 11,
                        color: "#8b949e",
                    }}>
                        <span>{selectedMood.emoji}</span>
                        <span>{selectedMood.label}</span>
                    </div>
                )}
            </div>
        </>
    );
};