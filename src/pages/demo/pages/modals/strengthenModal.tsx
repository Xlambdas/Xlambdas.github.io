import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { initialNodes, getNodeCompletionPercent, isLessonCompleted } from '../../data/graphData';
import { getAllCards, getAllQuestions, getDueCount } from '../../utils/srEngine';
import type { StrengthenSettings, StrengthenModalProps } from '../../types';

export const StrengthenModal: React.FC<StrengthenModalProps> = ({ onClose, nodeId, nodeName }) => {
    const navigate = useNavigate();

    // Helper to check if a question's lesson is COMPLETED
    const isQuestionAccessible = (question: any, targetNodeId: string): boolean => {
        if (!question) return false;

        const targetNode = initialNodes.find(n => n.id === targetNodeId);
        if (!targetNode?.lessonPath) return false;

        const lesson = targetNode.lessonPath.find(l => l.id === question.lessonId);
        if (!lesson) return false;

        // Question is only accessible if its lesson is COMPLETED
        return isLessonCompleted(targetNodeId, question.lessonId);
    };

    const [showSettings, setShowSettings] = useState(false);
    const [showNodeChoice, ] = useState(!!nodeId);
    const [settings, setSettings] = useState<StrengthenSettings>({
        sessionLength: 5,
        includeNew: true,
        focusWeak: true,
        selectedTopics: [],
    });

    const allCards = getAllCards();
    const dueCards = getDueCount();

    // Get topics with cards
    const topicsWithCards = initialNodes
        .filter(n => {
            if ((n as any).kind === "profile") return false;
            const pct = getNodeCompletionPercent(n.id);
            return pct > 0;
        })
        .slice(0, 5);

    const handleStartSession = () => {
        // Save settings to localStorage
        localStorage.setItem('strengthen_settings', JSON.stringify(settings));
        onClose();
        navigate('/demo/strengthen');
        };

    if (showNodeChoice && nodeId) {
        // Filter to only accessible questions (from completed lessons)
        const allQuestions = getAllQuestions();
        const accessibleNodeQuestions = allQuestions.filter(q =>
            q.nodeId === nodeId && isQuestionAccessible(q, nodeId)
        );

        // Count only accessible due cards
        const allCards = getAllCards();
        const today = new Date().toISOString().split("T")[0];
        const nodeDueCards = allCards.filter(c =>
            c.nodeId === nodeId &&
            c.dueDate <= today &&
            isQuestionAccessible(allQuestions.find(q => q.id === c.questionId), nodeId)
        ).length;

        return (
            <>
                {/* Backdrop */}
                <div
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(4px)",
                        zIndex: 200,
                    }}
                />

                {/* Choice Modal */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "#0d1117",
                        border: "1px solid #30363d",
                        borderRadius: 16,
                        padding: "32px",
                        maxWidth: 480,
                        width: "calc(100% - 32px)",
                        zIndex: 201,
                        boxShadow: "0 16px 64px rgba(0,0,0,0.6)",
                    }}
                >
                    {/* Header */}
                    <div style={{
                        marginBottom: 24,
                    }}>
                        <h2 style={{
                            color: "#c9d1d9",
                            fontSize: 20,
                            fontWeight: 700,
                            margin: "0 0 8px 0",
                        }}>
                            S'entraîner : {nodeName || nodeId}
                        </h2>
                        <p style={{
                            color: "#8b949e",
                            fontSize: 13,
                            margin: 0,
                        }}>
                            Choisis ton mode de révision
                        </p>
                    </div>

                    {/* Options */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* Due cards only */}
                        <button
                            onClick={() => {
                                localStorage.setItem('strengthen_settings', JSON.stringify({
                                    ...settings,
                                    selectedTopics: [nodeId],
                                    mode: 'due',
                                }));
                                onClose();
                                navigate('/demo/strengthen');
                            }}
                            disabled={nodeDueCards === 0}
                            style={{
                                width: "100%",
                                background: nodeDueCards > 0 ? "#21262d" : "#161b22",
                                border: `1px solid ${nodeDueCards > 0 ? "#30363d" : "#21262d"}`,
                                borderRadius: 10,
                                padding: "16px",
                                cursor: nodeDueCards > 0 ? "pointer" : "not-allowed",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                transition: "all 0.15s ease",
                                opacity: nodeDueCards > 0 ? 1 : 0.5,
                            }}
                            onMouseEnter={(e) => {
                                if (nodeDueCards > 0) {
                                    e.currentTarget.style.background = "#30363d";
                                    e.currentTarget.style.borderColor = "#a5b4fc";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (nodeDueCards > 0) {
                                    e.currentTarget.style.background = "#21262d";
                                    e.currentTarget.style.borderColor = "#30363d";
                                }
                            }}
                        >
                            <div style={{ textAlign: "left" }}>
                                <div style={{
                                    color: "#c9d1d9",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    marginBottom: 4,
                                }}>
                                    Réviser les cartes dues
                                </div>
                                <div style={{
                                    color: "#6e7681",
                                    fontSize: 12,
                                }}>
                                    {nodeDueCards} carte{nodeDueCards > 1 ? 's' : ''} à réviser                                </div>
                            </div>
                            <div style={{
                                color: nodeDueCards > 0 ? "#a5b4fc" : "#484f58",
                                fontSize: 18,
                            }}>
                                →
                            </div>
                        </button>

                        {/* All cards */}
                        <button
                            onClick={() => {
                                // Set mode to 'all' to show all cards
                                localStorage.setItem('strengthen_settings', JSON.stringify({
                                    ...settings,
                                    selectedTopics: [nodeId],
                                    mode: 'all',
                                }));
                                onClose();
                                navigate('/demo/strengthen');
                            }}
                            style={{
                                width: "100%",
                                background: "#21262d",
                                border: "1px solid #30363d",
                                borderRadius: 10,
                                padding: "16px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#30363d";
                                e.currentTarget.style.borderColor = "#a5b4fc";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#21262d";
                                e.currentTarget.style.borderColor = "#30363d";
                            }}
                        >
                            <div style={{ textAlign: "left" }}>
                                <div style={{
                                    color: "#c9d1d9",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    marginBottom: 4,
                                }}>
                                    Réviser toutes les cartes
                                </div>
                                <div style={{
                                    color: "#6e7681",
                                    fontSize: 12,
                                }}>
                                    {accessibleNodeQuestions.length} carte{accessibleNodeQuestions.length > 1 ? 's' : ''} au total                                </div>
                            </div>
                            <div style={{
                                color: "#a5b4fc",
                                fontSize: 18,
                            }}>
                                →
                            </div>
                        </button>
                    </div>

                    {/* Cancel */}
                    <button
                        onClick={onClose}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "transparent",
                            border: "1px solid #30363d",
                            borderRadius: 10,
                            color: "#8b949e",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            marginTop: 16,
                            transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#8b949e";
                            e.currentTarget.style.color = "#c9d1d9";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#30363d";
                            e.currentTarget.style.color = "#8b949e";
                        }}
                    >
                        Annuler
                    </button>
                </div>
            </>
        );
    }

    if (showSettings) {
        return (
            <>
                {/* Backdrop */}
                <div
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(4px)",
                        zIndex: 200,
                    }}
                />

                {/* Settings Modal */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "#0d1117",
                        border: "1px solid #30363d",
                        borderRadius: 16,
                        padding: "32px",
                        maxWidth: 500,
                        width: "calc(100% - 32px)",
                        maxHeight: "80vh",
                        overflowY: "auto",
                        zIndex: 201,
                        boxShadow: "0 16px 64px rgba(0,0,0,0.6)",
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 24,
                    }}>
                        <h2 style={{
                            color: "#c9d1d9",
                            fontSize: 20,
                            fontWeight: 700,
                            margin: 0,
                        }}>
                            Paramètres de révision
                        </h2>
                        <button
                            onClick={() => setShowSettings(false)}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#8b949e",
                                fontSize: 24,
                                cursor: "pointer",
                                padding: 0,
                                lineHeight: 1,
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Session Length */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={{
                            color: "#8b949e",
                            fontSize: 13,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 12,
                        }}>
                            Nombre de cartes par session
                        </label>
                        <div style={{ display: "flex", gap: 8 }}>
                            {[5, 10, 20, 30, 50].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setSettings({ ...settings, sessionLength: num })}
                                    style={{
                                        flex: 1,
                                        padding: "10px",
                                        background: settings.sessionLength === num ? "#30363d" : "#161b22",
                                        border: `1px solid ${settings.sessionLength === num ? "#8b949e" : "#30363d"}`,
                                        borderRadius: 8,
                                        color: settings.sessionLength === num ? "#c9d1d9" : "#8b949e",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Options */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={{
                            color: "#8b949e",
                            fontSize: 13,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 12,
                        }}>
                            Options
                        </label>

                        <button
                            onClick={() => setSettings({ ...settings, includeNew: !settings.includeNew })}
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                background: settings.includeNew ? "rgba(165,180,252,0.1)" : "#161b22",
                                border: `1px solid ${settings.includeNew ? "#a5b4fc" : "#30363d"}`,
                                borderRadius: 8,
                                marginBottom: 8,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                transition: "all 0.15s ease",
                            }}
                        >
                            <div style={{ textAlign: "left" }}>
                                <div style={{
                                    color: "#c9d1d9",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    marginBottom: 2,
                                }}>
                                    Inclure nouvelles cartes
                                </div>
                                <div style={{
                                    color: "#6e7681",
                                    fontSize: 11,
                                }}>
                                    Ajouter des cartes non révisées
                                </div>
                            </div>
                            <div style={{
                                width: 20,
                                height: 20,
                                borderRadius: 4,
                                background: settings.includeNew ? "#a5b4fc" : "#30363d",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.15s ease",
                            }}>
                                {settings.includeNew && (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d1117" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                        </button>

                        <button
                            onClick={() => setSettings({ ...settings, focusWeak: !settings.focusWeak })}
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                background: settings.focusWeak ? "rgba(165,180,252,0.1)" : "#161b22",
                                border: `1px solid ${settings.focusWeak ? "#a5b4fc" : "#30363d"}`,
                                borderRadius: 8,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                transition: "all 0.15s ease",
                            }}
                        >
                            <div style={{ textAlign: "left" }}>
                                <div style={{
                                    color: "#c9d1d9",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    marginBottom: 2,
                                }}>
                                    Focus sur cartes faibles
                                </div>
                                <div style={{
                                    color: "#6e7681",
                                    fontSize: 11,
                                }}>
                                    Prioriser les cartes difficiles
                                </div>
                            </div>
                            <div style={{
                                width: 20,
                                height: 20,
                                borderRadius: 4,
                                background: settings.focusWeak ? "#a5b4fc" : "#30363d",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.15s ease",
                            }}>
                                {settings.focusWeak && (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d1117" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Debug Section */}
                    <div style={{
                        marginTop: 32,
                        paddingTop: 24,
                        borderTop: "1px solid #30363d",
                    }}>
                        <label style={{
                            color: "#8b949e",
                            fontSize: 13,
                            fontWeight: 600,
                            display: "block",
                            marginBottom: 12,
                        }}>
                            🔧 Debug (Dev only)
                        </label>

                        <button
                            onClick={() => {
                                // Import at runtime
                                const allQuestions = getAllQuestions();

                                console.log("=== RESET DEBUG ===");
                                console.log("Total questions found:", allQuestions.length);
                                console.log("Sample question IDs:", allQuestions.slice(0, 5).map(q => q.id));

                                // Create/reset cards for ALL questions with NEW format
                                const resetCards = allQuestions.map(q => ({
                                    questionId: q.id,  // This should be "nodeId::questionId" format
                                    nodeId: q.nodeId,
                                    dueDate: "2020-01-01",
                                    interval: 1,
                                    repetitions: 0,
                                    easeFactor: 2.5,
                                }));

                                console.log("Created cards:", resetCards.length);
                                console.log("Sample card IDs:", resetCards.slice(0, 5).map((c: any) => c.questionId));

                                localStorage.setItem('sr_cards', JSON.stringify(resetCards));

                                alert(`✓ ${resetCards.length} cartes créées avec le nouveau format !`);

                                // Close everything and refresh
                                onClose();
                                window.location.reload();
                            }}
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                background: "rgba(251,146,60,0.1)",
                                border: "1px solid rgba(251,146,60,0.3)",
                                borderRadius: 8,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                transition: "all 0.15s ease",
                                marginTop: 8,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(251,146,60,0.15)";
                                e.currentTarget.style.borderColor = "rgba(251,146,60,0.5)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(251,146,60,0.1)";
                                e.currentTarget.style.borderColor = "rgba(251,146,60,0.3)";
                            }}
                        >
                            <div style={{ textAlign: "left" }}>
                                <div style={{
                                    color: "#fb923c",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    marginBottom: 2,
                                }}>
                                    Nettoyer les cartes orphelines
                                </div>
                                <div style={{
                                    color: "#6e7681",
                                    fontSize: 11,
                                }}>
                                    Supprimer les cartes dont les questions n'existent plus
                                </div>
                            </div>
                            <div style={{
                                color: "#fb923c",
                                fontSize: 18,
                            }}>
                                🧹
                            </div>
                        </button>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={() => setShowSettings(false)}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "linear-gradient(135deg, #a5b4fc 0%, #8b9dfc 100%)",
                            border: "none",
                            borderRadius: 10,
                            color: "#0d1117",
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(165,180,252,0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        Sauvegarder les paramètres
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(4px)",
                    zIndex: 200,
                }}
            />

            {/* Main Modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "#0d1117",
                    border: "1px solid #30363d",
                    borderRadius: 16,
                    padding: "32px",
                    maxWidth: 600,
                    width: "calc(100% - 32px)",
                    maxHeight: "85vh",
                    overflowY: "auto",
                    zIndex: 201,
                    boxShadow: "0 16px 64px rgba(0,0,0,0.6)",
                }}
            >
                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                }}>
                    <h2 style={{
                        color: "#c9d1d9",
                        fontSize: 24,
                        fontWeight: 700,
                        margin: 0,
                    }}>
                        Session de révision
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#8b949e",
                            fontSize: 24,
                            cursor: "pointer",
                            padding: 0,
                            lineHeight: 1,
                        }}
                    >
                        ✕
                    </button>
                </div>

                <p style={{
                    color: "#8b949e",
                    fontSize: 14,
                    marginBottom: 32,
                }}>
                    Renforce ta mémoire avec la répétition espacée
                </p>

                {/* Stats Cards */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: 12,
                    marginBottom: 32,
                }}>
                    {/* Due Cards */}
                    <div style={{
                        background: "linear-gradient(135deg, #161b22 0%, #0d1117 100%)",
                        border: "1px solid #30363d",
                        borderRadius: 12,
                        padding: "16px",
                        position: "relative",
                        overflow: "hidden",
                    }}>
                        <div style={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            width: 60,
                            height: 60,
                            background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)",
                            borderRadius: "50%",
                        }} />
                        <div style={{
                            color: "#ef4444",
                            fontSize: 28,
                            fontWeight: 700,
                            marginBottom: 4,
                            position: "relative",
                        }}>
                            {dueCards}
                        </div>
                        <div style={{
                            color: "#8b949e",
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}>
                            À réviser
                        </div>
                    </div>

                    {/* Total Cards */}
                    <div style={{
                        background: "linear-gradient(135deg, #161b22 0%, #0d1117 100%)",
                        border: "1px solid #30363d",
                        borderRadius: 12,
                        padding: "16px",
                        position: "relative",
                        overflow: "hidden",
                    }}>
                        <div style={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            width: 60,
                            height: 60,
                            background: "radial-gradient(circle, rgba(165,180,252,0.15) 0%, transparent 70%)",
                            borderRadius: "50%",
                        }} />
                        <div style={{
                            color: "#a5b4fc",
                            fontSize: 28,
                            fontWeight: 700,
                            marginBottom: 4,
                            position: "relative",
                        }}>
                            {allCards.length}
                        </div>
                        <div style={{
                            color: "#8b949e",
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}>
                            Total cartes
                        </div>
                    </div>

                    {/* Session Length */}
                    <div style={{
                        background: "linear-gradient(135deg, #161b22 0%, #0d1117 100%)",
                        border: "1px solid #30363d",
                        borderRadius: 12,
                        padding: "16px",
                        position: "relative",
                        overflow: "hidden",
                    }}>
                        <div style={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            width: 60,
                            height: 60,
                            background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)",
                            borderRadius: "50%",
                        }} />
                        <div style={{
                            color: "#22c55e",
                            fontSize: 28,
                            fontWeight: 700,
                            marginBottom: 4,
                            position: "relative",
                        }}>
                            {settings.sessionLength}
                        </div>
                        <div style={{
                            color: "#8b949e",
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}>
                            Par session
                        </div>
                    </div>
                </div>

                {/* Topics Overview */}
                <div style={{ marginBottom: 32 }}>
                    <h3 style={{
                        color: "#c9d1d9",
                        fontSize: 14,
                        fontWeight: 600,
                        marginBottom: 12,
                    }}>
                        Thèmes disponibles
                    </h3>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                    }}>
                        {topicsWithCards.map(node => {
                            const color = (node as any).branchColor || "#a5b4fc";
                            const pct = getNodeCompletionPercent(node.id);
                            return (
                                <div
                                    key={node.id}
                                    style={{
                                        background: "#161b22",
                                        border: "1px solid #30363d",
                                        borderRadius: 8,
                                        padding: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                >
                                    <div style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: color,
                                        boxShadow: `0 0 8px ${color}66`,
                                        flexShrink: 0,
                                    }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            color: "#c9d1d9",
                                            fontSize: 13,
                                            fontWeight: 500,
                                            marginBottom: 4,
                                        }}>
                                            {node.title}
                                        </div>
                                        <div style={{
                                            width: "100%",
                                            height: 4,
                                            background: "#21262d",
                                            borderRadius: 2,
                                            overflow: "hidden",
                                        }}>
                                            <div style={{
                                                width: `${pct}%`,
                                                height: "100%",
                                                background: color,
                                            }} />
                                        </div>
                                    </div>
                                    <div style={{
                                        color: "#6e7681",
                                        fontSize: 12,
                                        fontWeight: 600,
                                    }}>
                                        {pct}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        onClick={() => setShowSettings(true)}
                        style={{
                            flex: 1,
                            padding: "12px",
                            background: "#161b22",
                            border: "1px solid #30363d",
                            borderRadius: 10,
                            color: "#8b949e",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#1c2128";
                            e.currentTarget.style.borderColor = "#8b949e";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#161b22";
                            e.currentTarget.style.borderColor = "#30363d";
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        Paramètres
                    </button>

                    <button
                        onClick={handleStartSession}
                        disabled={dueCards === 0}
                        style={{
                            flex: 2,
                            padding: "12px",
                            background: dueCards === 0 ? "#30363d" : "linear-gradient(135deg, #a5b4fc 0%, #8b9dfc 100%)",
                            border: "none",
                            borderRadius: 10,
                            color: dueCards === 0 ? "#6e7681" : "#0d1117",
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: dueCards === 0 ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            transition: "all 0.2s ease",
                            opacity: dueCards === 0 ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => {
                            if (dueCards > 0) {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 24px rgba(165,180,252,0.4)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Commencer la session
                    </button>
                </div>
            </div>
        </>
    );
};