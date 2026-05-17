import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getUserProfile,
    getEarnedBadges,
    getDynamicNodes,
    initialNodes,
    getNodeCompletionPercent,
} from "../data/graphData";
import { getAllCards } from "../utils/srEngine";
import type { EarnedBadge } from "../types/types";


// --- Constants ---

const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const BANNER_COLORS = [
    { name: "Violet", color: "#7c3aed" },
    { name: "Bleu", color: "#3b82f6" },
    { name: "Cyan", color: "#06b6d4" },
    { name: "Vert", color: "#10b981" },
    { name: "Rose", color: "#ec4899" },
    { name: "Orange", color: "#f59e0b" },
    { name: "Rouge", color: "#ef4444" },
    { name: "Indigo", color: "#6366f1" },
];

const PERSONA_OPTIONS = [
    { id: "avatar1", type: "image", src: "demo/avatar_1.png" },
    { id: "avatar2", type: "image", src: "demo/avatar_1.png" },
    { id: "avatar3", type: "image", src: "demo/avatar_1.png" },
    { id: "avatar4", type: "image", src: "demo/avatar_1.png" },
];

const PERSONA_BG_COLORS = [
    { name: "Violet", color: "#7c3aed" },
    { name: "Bleu", color: "#3b82f6" },
    { name: "Rose", color: "#ec4899" },
    { name: "Vert", color: "#10b981" },
    { name: "Orange", color: "#f59e0b" },
    { name: "Rouge", color: "#ef4444" },
    { name: "Gris", color: "#6b7280" },
    { name: "Noir", color: "#1f2937" },
];

const STATUS_EMOJIS = ["🧠", "🎯", "⚡", "🔥", "💡", "🌟", "🚀", "💪", "🎨", "📚", "✨", "🎓"];

// --- Helpers ---

// const getStudyStreak = (): number => {
//     const completed = getCompletedNodes();
//     return completed.length > 0 ? Math.min(completed.length, 7) : 0;
// };

const getTotalLessons = (): { completed: number; total: number } => {
    const nodes = getDynamicNodes();
    let completed = 0;
    let total = 0;

    nodes.forEach(node => {
        if (node.lessonPath) {
            total += node.lessonPath.length;
            node.lessonPath.forEach(() => {
                const pct = getNodeCompletionPercent(node.id);
                if (pct > 0) completed++;
            });
        }
    });

    return { completed, total };
};

// --- Profile Storage ---

const getProfileSettings = () => ({
    bannerColor: localStorage.getItem("profile_banner_color") || BANNER_COLORS[1].color,
    persona: localStorage.getItem("profile_persona") || PERSONA_OPTIONS[0].id,
    personaBgColor: localStorage.getItem("profile_persona_bg") || PERSONA_BG_COLORS[0].color,
    status: localStorage.getItem("profile_status") || STATUS_EMOJIS[0],
});

const saveProfileSettings = (bannerColor: string, persona: string, personaBgColor: string, status: string) => {
    localStorage.setItem("profile_banner_color", bannerColor);
    localStorage.setItem("profile_persona", persona);
    localStorage.setItem("profile_persona_bg", personaBgColor);
    localStorage.setItem("profile_status", status);
};
// --- Sub-components ---

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

// const StatCard: React.FC<{
//     icon: string;
//     label: string;
//     value: string | number;
//     color: string;
// }> = ({ icon, label, value, color }) => (
//     <div style={{
//         background: "linear-gradient(135deg, #161b22 0%, #0d1117 100%)",
//         border: "1px solid #21262d",
//         borderRadius: 16,
//         padding: "20px",
//         display: "flex",
//         flexDirection: "column",
//         gap: 12,
//         position: "relative",
//         overflow: "hidden",
//     }}>
//         <div style={{
//             position: "absolute",
//             top: -20,
//             right: -20,
//             width: 80,
//             height: 80,
//             background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
//             borderRadius: "50%",
//         }} />

//         <div style={{ fontSize: 32, position: "relative", zIndex: 1 }}>{icon}</div>
//         <div style={{ position: "relative", zIndex: 1 }}>
//             <div style={{
//                 color: "#c9d1d9",
//                 fontSize: 28,
//                 fontWeight: 700,
//                 lineHeight: 1,
//                 marginBottom: 6,
//             }}>
//                 {value}
//             </div>
//             <div style={{
//                 color: "#6e7681",
//                 fontSize: 12,
//                 textTransform: "uppercase",
//                 letterSpacing: "0.08em",
//             }}>
//                 {label}
//             </div>
//         </div>
//     </div>
// );

const BadgeCard: React.FC<{
    badge: any;
    onClick: () => void;
}> = ({ badge, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const node = initialNodes.find(n => n.id === badge.nodeId);

    const levelColor = badge.level === "gold" ? "#fbbf24"
        : badge.level === "silver" ? "#94a3b8"
            : "#fb923c";

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered
                    ? "linear-gradient(135deg, #1c2128 0%, #161b22 100%)"
                    : "#161b22",
                border: `2px solid ${hovered ? levelColor + "44" : "#21262d"}`,
                borderRadius: 16,
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: hovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hovered
                    ? `0 8px 24px ${levelColor}33`
                    : "0 2px 8px rgba(0,0,0,0.2)",
                position: "relative",
            }}
        >
            <div style={{
                width: 80,
                height: 80,
                clipPath: HEX_CLIP,
                background: `linear-gradient(135deg, ${levelColor} 0%, ${levelColor}dd 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                margin: "0 auto 16px",
                boxShadow: `0 4px 16px ${levelColor}44`,
            }}>
                {node?.badge?.icon || "🏆"}
            </div>

            <div style={{ textAlign: "center" }}>
                <div style={{
                    color: "#c9d1d9",
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 4,
                }}>
                    {node?.badge?.name || "Badge"}
                </div>
                <div style={{
                    color: levelColor,
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                }}>
                    {badge.level}
                </div>
            </div>

            <div style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: levelColor,
                boxShadow: `0 0 12px ${levelColor}88`,
            }} />
        </div>
    );
};

const ProgressBar: React.FC<{
    label: string;
    value: number;
    max: number;
    color: string;
}> = ({ label, value, max, color }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;

    return (
        <div style={{
            background: "#0d1117",
            border: "1px solid #21262d",
            borderRadius: 12,
            padding: "16px",
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
            }}>
                <span style={{ color: "#8b949e", fontSize: 13 }}>{label}</span>
                <span style={{ color: "#c9d1d9", fontSize: 13, fontWeight: 600 }}>
                    {value} / {max}
                </span>
            </div>
            <div style={{
                width: "100%",
                height: 8,
                background: "#21262d",
                borderRadius: 4,
                overflow: "hidden",
            }}>
                <div style={{
                    width: `${percentage}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`,
                    transition: "width 0.6s ease",
                }} />
            </div>
        </div>
    );
};

// --- Main Component ---

export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const profile = getUserProfile();
    const badges = getEarnedBadges();
    // const completedNodes = getCompletedNodes();
    // const dueCards = getDueCount();
    const allCards = getAllCards();
    // const streak = getStudyStreak();
    const { completed: completedLessons, total: totalLessons } = getTotalLessons();

    const settings = getProfileSettings();
    const [editMode, setEditMode] = useState(false);
    const [tempName, setTempName] = useState(profile.name);
    const [tempBannerColor, setTempBannerColor] = useState(settings.bannerColor);
    const [tempPersona, setTempPersona] = useState(settings.persona);
    const [tempPersonaBgColor, setTempPersonaBgColor] = useState(settings.personaBgColor);
    const [tempStatus, setTempStatus] = useState(settings.status);

    const currentPersona = PERSONA_OPTIONS.find(p => p.id === (editMode ? tempPersona : settings.persona)) || PERSONA_OPTIONS[0];
    const currentBannerColor = editMode ? tempBannerColor : settings.bannerColor;
    const currentPersonaBgColor = editMode ? tempPersonaBgColor : settings.personaBgColor;
    const currentStatus = editMode ? tempStatus : settings.status;

    const handleSave = () => {
        localStorage.setItem("user_name", tempName);
        saveProfileSettings(tempBannerColor, tempPersona, tempPersonaBgColor, tempStatus);
        setEditMode(false);
    };

    const handleCancel = () => {
        setTempName(profile.name);
        setTempBannerColor(settings.bannerColor);
        setTempPersona(settings.persona);
        setTempPersonaBgColor(settings.personaBgColor);
        setTempStatus(settings.status);
        setEditMode(false);
    };

    // const totalBadges = initialNodes.filter(n => n.badge).length;

    return (
        <div style={{
            minHeight: "100vh",
            background: "#0b0f14",
            paddingBottom: 80,
        }}>
            {/* Top Navigation */}
            <div style={{
                background: "#161b22",
                borderBottom: "1px solid #21262d",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: "#21262d",
                        border: "1px solid #30363d",
                        borderRadius: 10,
                        padding: "8px 16px",
                        color: "#8b949e",
                        fontSize: 13,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Retour
                </button>

                <button
                    onClick={() => editMode ? handleSave() : setEditMode(true)}
                    style={{
                        background: editMode ? "linear-gradient(135deg, #a5b4fc 0%, #8b9dfc 100%)" : "#21262d",
                        border: "1px solid " + (editMode ? "#a5b4fc" : "#30363d"),
                        borderRadius: 10,
                        padding: "8px 16px",
                        color: editMode ? "#0d1117" : "#8b949e",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    {editMode ? "Sauvegarder" : "Modifier"}
                </button>
            </div>

            {/* Banner Section */}
            <div style={{
                background: currentBannerColor,
                height: 200,
                position: "relative",
                display: "flex",
                alignItems: "flex-end",
                padding: "0 40px 20px",
            }}>
                {/* Settings icon in banner */}
                {editMode && (
                    <button
                        onClick={handleCancel}
                        style={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            background: "rgba(0,0,0,0.3)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: 8,
                            padding: "8px 12px",
                            color: "#fff",
                            fontSize: 12,
                            cursor: "pointer",
                        }}
                    >
                        Annuler
                    </button>
                )}

                {/* Profile Section (overlapping banner) */}
                <div style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 20,
                    transform: "translateY(80px)",
                }}>
                    {/* Persona Hexagon with Status */}
                    <div style={{ position: "relative" }}>
                        <PersonaHexagon
                            persona={currentPersona}
                            size={120}
                            bgColor={currentPersonaBgColor}
                        />

                        {/* Status Circle (overlapping) */}
                        <div style={{
                            position: "absolute",
                            bottom: -8,
                            right: -8,
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            background: "#fff",
                            border: "4px solid " + currentBannerColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 24,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        }}>
                            {currentStatus}
                        </div>
                    </div>

                    {/* Profile Name */}
                    {editMode ? (
                        <input
                            type="text"
                            value={tempName}
                            onChange={e => setTempName(e.target.value)}
                            style={{
                                background: "#fff",
                                border: "2px solid #e5e7eb",
                                borderRadius: 10,
                                padding: "12px 16px",
                                color: "#1f2937",
                                fontSize: 24,
                                fontWeight: 700,
                                width: 300,
                            }}
                        />
                    ) : (
                        <h1 style={{
                            color: "#fff",
                            fontSize: 32,
                            fontWeight: 700,
                            margin: 0,
                            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        }}>
                            {profile.name}
                        </h1>
                    )}
                </div>
            </div>

            {/* Customization Options (Edit Mode) */}
            {editMode && (
                <div style={{
                    background: "#161b22",
                    borderBottom: "1px solid #21262d",
                    padding: "80px 40px 32px",
                }}>
                    {/* Banner Color Picker */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{
                            color: "#8b949e",
                            fontSize: 12,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 12,
                        }}>
                            Couleur de bannière
                        </div>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            {BANNER_COLORS.map(({ name, color }) => (
                                <button
                                    key={color}
                                    onClick={() => setTempBannerColor(color)}
                                    title={name}
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        background: color,
                                        border: tempBannerColor === color ? "3px solid #fff" : "2px solid #30363d",
                                        cursor: "pointer",
                                        boxShadow: tempBannerColor === color ? `0 0 0 4px ${color}44` : "none",
                                        transition: "all 0.2s ease",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Persona Picker */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{
                            color: "#8b949e",
                            fontSize: 12,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 12,
                        }}>
                            Personnage
                        </div>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            {PERSONA_OPTIONS.map(persona => (
                                <button
                                    key={persona.id}
                                    onClick={() => setTempPersona(persona.id)}
                                    style={{
                                        padding: 4,
                                        background: tempPersona === persona.id ? "#30363d" : "transparent",
                                        border: tempPersona === persona.id ? "2px solid #a5b4fc" : "2px solid #30363d",
                                        borderRadius: 12,
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <PersonaHexagon persona={persona} size={60} bgColor={tempPersonaBgColor} />                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Persona Background Color Picker */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{
                            color: "#8b949e",
                            fontSize: 12,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 12,
                        }}>
                            Couleur de fond du personnage
                        </div>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            {PERSONA_BG_COLORS.map(({ name, color }) => (
                                <button
                                    key={color}
                                    onClick={() => setTempPersonaBgColor(color)}
                                    title={name}
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        background: color,
                                        border: tempPersonaBgColor === color ? "3px solid #fff" : "2px solid #30363d",
                                        cursor: "pointer",
                                        boxShadow: tempPersonaBgColor === color ? `0 0 0 4px ${color}44` : "none",
                                        transition: "all 0.2s ease",
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Status Emoji Picker */}
                    <div>
                        <div style={{
                            color: "#8b949e",
                            fontSize: 12,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 12,
                        }}>
                            Statut
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {STATUS_EMOJIS.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => setTempStatus(emoji)}
                                    style={{
                                        width: 48,
                                        height: 48,
                                        fontSize: 24,
                                        background: tempStatus === emoji ? "#a5b4fc22" : "#21262d",
                                        border: `2px solid ${tempStatus === emoji ? "#a5b4fc" : "#30363d"}`,
                                        borderRadius: 12,
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div style={{
                maxWidth: 1200,
                margin: "0 auto",
                padding: editMode ? "32px 20px" : "112px 20px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 32,
            }}>
                {/* Stats Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 16,
                }}>
                    {/* <StatCard
                        icon="🏆"
                        label="Badges"
                        value={`${badges.length}/${totalBadges}`}
                        color="#fbbf24"
                    />
                    <StatCard
                        icon="✅"
                        label="Modules complétés"
                        value={completedNodes.length}
                        color="#22c55e"
                    />
                    <StatCard
                        icon="🔥"
                        label="Série actuelle"
                        value={`${streak} jours`}
                        color="#ef4444"
                    />
                    <StatCard
                        icon="📚"
                        label="À réviser"
                        value={dueCards}
                        color="#a5b4fc"
                    /> */}
                </div>

                {/* Progress Section */}
                <div>
                    <h3 style={{
                        color: "#c9d1d9",
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 16,
                    }}>
                        Progression
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <ProgressBar
                            label="Leçons complétées"
                            value={completedLessons}
                            max={totalLessons}
                            color="#a5b4fc"
                        />
                        <ProgressBar
                            label="Cartes de révision"
                            value={allCards.length}
                            max={totalLessons * 2}
                            color="#8b9dfc"
                        />
                    </div>
                </div>

                {/* Badges Section */}
                <div>
                    <h3 style={{
                        color: "#c9d1d9",
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 16,
                    }}>
                        Badges débloqués
                    </h3>

                    {badges.length > 0 ? (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                            gap: 16,
                        }}>
                            {badges.map((badge: EarnedBadge) => (
                                <BadgeCard
                                    key={badge.badgeId}
                                    badge={badge}
                                    onClick={() => navigate(`/demo/node/${badge.nodeId}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            background: "#161b22",
                            border: "1px solid #21262d",
                            borderRadius: 16,
                            padding: "40px 20px",
                            textAlign: "center",
                            color: "#6e7681",
                        }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
                            <div style={{ fontSize: 14, marginBottom: 8 }}>
                                Aucun badge débloqué pour le moment
                            </div>
                            <div style={{ fontSize: 12 }}>
                                Complète des modules pour gagner des badges !
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};