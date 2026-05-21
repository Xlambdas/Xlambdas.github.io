import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getEarnedBadges,
    getUserProfile,
} from "../data/graphData";
import { getDueCount } from "../utils/srEngine";
import { getProfileSettings, getStudyStreak } from "../helpers";
import { PERSONA_OPTIONS, HEX_CLIP } from "../constants";
import type { ProfileNodeModalProps } from "../types";

// --- PersonaHexagon Component ---

const PersonaHexagon: React.FC<{ persona: any; size: number; bgColor?: string }> = ({ persona, size, bgColor = "#1f2937" }) => {
    if (persona.type === "image") {
        return (
            <div style={{
                width: size,
                height: size,
                clipPath: HEX_CLIP,
                background: bgColor,
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <img
                    src={persona.src}
                    alt="Avatar"
                    style={{
                        width: "85%",
                        height: "85%",
                        objectFit: "contain",
                        display: "block",
                    }}
                />
            </div>
        );
    }

    return null;
};

// --- Component ---

export const ProfileNodeModal: React.FC<ProfileNodeModalProps> = ({
    onClose,
    onOpenStrengthen,
}) => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const profile = getUserProfile();
    const badges = getEarnedBadges();
    const dueCards = getDueCount();
    const settings = getProfileSettings();

    const completedNodes = JSON.parse(localStorage.getItem("completed_nodes") ?? "[]");
    const streak = getStudyStreak();

    const currentPersona = PERSONA_OPTIONS.find(p => p.id === settings.persona) || PERSONA_OPTIONS[0];
    const currentPersonaBgColor = settings.personaBgColor;
    const currentStatus = settings.status;

    useEffect(() => {
        setVisible(false);
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, []);

    const handleBackdrop = () => {
        setVisible(false);
        setTimeout(onClose, 320);
    };

    const handleViewProfile = () => {
        setVisible(false);
        setTimeout(() => navigate("/demo/profile"), 320);
    };

    const stats = [
        { label: "Badges", value: badges.length, icon: "🏆", color: "#fbbf24" },
        { label: "Modules", value: completedNodes.length, icon: "✅", color: "#22c55e" },
        { label: "À réviser", value: dueCards, icon: "📚", color: "#a5b4fc" },
    ];

    return (
        <>
            <style>{`
                @keyframes cardSlideUp {
                    from { opacity: 0; transform: translateX(-50%) translateY(24px); }
                    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>

            {/* backdrop */}
            <div
                onClick={handleBackdrop}
                style={{
                    position: "absolute", inset: 0, zIndex: 30,
                    backdropFilter: visible ? "blur(5px)" : "none",
                    background: visible ? "rgba(0,0,0,0.4)" : "transparent",
                    transition: "all 0.32s ease",
                    pointerEvents: visible ? "auto" : "none",
                }}
            />

            {/* card */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    position: "absolute", zIndex: 40,
                    bottom: 32, left: "50%",
                    transform: "translateX(-50%)",
                    width: "min(440px, calc(100vw - 32px))",
                    background: "#161b22",
                    border: "1px solid #30363d",
                    borderRadius: 16,
                    overflow: "visible",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
                    opacity: visible ? 1 : 0,
                    animation: visible ? "cardSlideUp 0.32s cubic-bezier(0.32,0.72,0,1) both" : "none",
                }}
            >
                {/* Streak badge - left side */}
                <div style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    border: "1px solid #ef4444",
                    borderRadius: 8,
                    padding: "4px 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    borderColor: streak >= 5 ? "#fbbf24" : "#ef4444",
                    boxShadow: streak >= 5 ? "0 2px 8px rgba(251,191,36,0.3)" : "0 2px 8px rgba(239,68,68,0.3)",
                    zIndex: 3,
                }}>
                    <span style={{ fontSize: 16 }}>🔥</span>
                    <span style={{
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                    }}>
                        {streak}
                    </span>
                </div>
                {/* Hexagon icon (protruding from top) */}
                <div style={{
                    position: "absolute", top: -50, left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 2,
                }}>
                    {/* Avatar - Persona Hexagon with Status */}
                    <div style={{ position: "relative" }}>
                        <PersonaHexagon persona={currentPersona} size={100} bgColor={currentPersonaBgColor} />

                        {/* Status Circle (overlapping) */}
                        <div style={{
                            position: "absolute",
                            bottom: 5,
                            right: -15,
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: "#161b22",
                            border: "3px solid " + settings.bannerColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        }}>
                            {currentStatus}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleBackdrop}
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        width: 32,
                        height: 32,
                        background: "#21262d",
                        border: "1px solid #30363d",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#8b949e",
                        transition: "all 0.15s ease",
                        zIndex: 3,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#30363d";
                        e.currentTarget.style.color = "#c9d1d9";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#21262d";
                        e.currentTarget.style.color = "#8b949e";
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Card body */}
                <div style={{
                    padding: "60px 20px 20px",
                    display: "flex", flexDirection: "column", gap: 12,
                }}>
                    {/* Profile header */}
                    <div style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center", gap: 10, textAlign: "center",
                    }}>

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                        }}>
                            <h2 style={{
                                color: "#7c6af7", fontSize: 20,
                                fontWeight: 700, margin: 0, lineHeight: 1.2,
                            }}>
                                {profile.name}
                            </h2>
                        </div>
                        {/* <h2 style={{
                            color: "#7c6af7", fontSize: 20,
                            fontWeight: 700, margin: 0, lineHeight: 1.2,
                        }}>
                            {profile.name}
                        </h2> */}

                        <p style={{
                            color: "#6e7681", fontSize: 12,
                            margin: 0, lineHeight: 1.5,
                        }}>
                            Membre depuis {new Date(profile.joinDate).toLocaleDateString('fr-FR', {
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>

                    {/* Quick stats */}
                    <div style={{
                        background: "#0d1117",
                        border: "1px solid #21262d",
                        borderRadius: 12,
                        display: "flex",
                        overflow: "hidden",
                    }}>
                        {stats.map(({ label, value, icon }, i) => (
                            <div key={label} style={{
                                flex: 1,
                                padding: "12px 8px",
                                textAlign: "center",
                                borderRight: i < stats.length - 1
                                    ? "1px solid #21262d" : "none",
                            }}>
                                <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                                <div style={{
                                    color: "#c9d1d9",
                                    fontSize: 16, fontWeight: 700,
                                }}>
                                    {value}
                                </div>
                                <div style={{
                                    color: "#484f58",
                                    fontSize: 9, marginTop: 3,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                }}>
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message */}
                    {/* <div style={{
                        background: "rgba(124,106,247,0.1)",
                        border: "1px solid rgba(124,106,247,0.25)",
                        borderLeft: "3px solid #7c6af7",
                        borderRadius: 8,
                        padding: "10px 12px",
                        color: "#8b949e",
                        fontSize: 12, lineHeight: 1.6,
                        fontStyle: "italic",
                    }}>
                        Ton espace personnel — progression, badges, révisions, et statistiques détaillées.
                    </div> */}

                    {/* CTAs */}
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <button
                            onClick={onOpenStrengthen}
                            style={{
                                flex: "none",
                                padding: "11px 14px",
                                background: "#21262d",
                                border: "1px solid #30363d",
                                borderRadius: 10,
                                color: "#8b949e",
                                fontSize: 11, cursor: "pointer",
                                display: "flex", alignItems: "center",
                                justifyContent: "center", gap: 5,
                                transition: "all 0.15s ease",
                                whiteSpace: "nowrap",
                            }}
                        >
                            S'entraîner
                        </button>

                        <button
                            onClick={handleViewProfile}
                            style={{
                                flex: 1,
                                padding: "11px 10px",
                                background: "linear-gradient(135deg, #7c6af7 0%, #6858d3 100%)",
                                border: "1px solid #7c6af7",
                                borderRadius: 10,
                                color: "#fff",
                                fontSize: 12, fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                boxShadow: "0 4px 12px rgba(124,106,247,0.3)",
                            }}
                        >
                            Voir mon profil →
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};