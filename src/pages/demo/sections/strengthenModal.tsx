import React, { useState } from 'react';
import { initialNodes, getNodeCompletionPercent } from '../data/graphData';
import { getAllCards, getDueCount } from '../utils/srEngine';
import { useNavigate } from 'react-router-dom';
import type { StrengthenSettings, StrengthenModalProps } from '../types';

export const StrengthenModal: React.FC<StrengthenModalProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState<StrengthenSettings>({
        sessionLength: 20,
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
                            {[10, 20, 30, 50].map(num => (
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