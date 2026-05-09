import React, { useState, useEffect, useRef } from "react";
import {
    getUserProfile,
    saveUserProfile,
    initialNodes,
    getNodeCompletionPercent,
    getCompletedNodes,
    getBadgeForNode,
    getEarnedBadges,
    getDynamicNodes,
} from "../data/graphData";
import { getAllCards, getDueCount } from "../helpers/srEngine";
import type { NodeType, EarnedBadge } from "../constants/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const NODE_COLOR: Record<NodeType["type"], string> = {
    main: "#ffffff",
    folder: "#a5b4fc",
    file: "#94a3b8",
};

const AVATAR_OPTIONS = [
    "🧠", "🎯", "⚡", "🔬", "📚", "💡", "🌊", "🎭",
    "🦉", "🔭", "🧩", "✦", "🌀", "🎓", "🧬", "🔮",
];

const BADGE_LEVEL_COLOR: Record<string, string> = {
    bronze: "#cd7f32",
    silver: "#94a3b8",
    gold: "#f59e0b",
};

// ─── Hex skill tree ───────────────────────────────────────────────────────────

const HexCell: React.FC<{
    node: NodeType;
    size: number;
    onClick: () => void;
}> = ({ node, size, onClick }) => {
    const pct = getNodeCompletionPercent(node.id);
    const color = NODE_COLOR[node.type];
    const badge = getBadgeForNode(node.id);
    const done = pct === 100;

    const bg = done
        ? `${color}22`
        : pct > 0
            ? `${color}0d`
            : "#1c2128";

    return (
        <div
            onClick={onClick}
            title={node.title}
            style={{
                position: "relative",
                width: size,
                height: size,
                cursor: "pointer",
                flexShrink: 0,
            }}
        >
            {/* pulse for in-progress */}
            {pct > 0 && !done && (
                <div style={{
                    position: "absolute", inset: -4,
                    clipPath: HEX_CLIP,
                    background: `${color}18`,
                    animation: "hexGlow 2.4s ease-in-out infinite",
                }} />
            )}

            {/* main hex */}
            <div style={{
                width: "100%", height: "100%",
                clipPath: HEX_CLIP,
                background: bg,
                border: `2px solid ${done ? color : pct > 0 ? `${color}55` : "#30363d"}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                boxShadow: done ? `0 0 14px ${color}33` : "none",
                transition: "all 0.2s ease",
            }}>
                {/* icon or percent */}
                {done ? (
                    <span style={{ fontSize: size * 0.28 }}>
                        {node.badge?.icon ?? "✓"}
                    </span>
                ) : pct > 0 ? (
                    <span style={{
                        color, fontSize: size * 0.22,
                        fontWeight: 700, lineHeight: 1,
                    }}>
                        {pct}%
                    </span>
                ) : (
                    <span style={{
                        color: "#484f58",
                        fontSize: size * 0.2,
                        lineHeight: 1,
                    }}>
                        {node.isUnlocked ? "○" : "🔒"}
                    </span>
                )}
            </div>

            {/* badge level dot */}
            {badge && (
                <div style={{
                    position: "absolute",
                    top: -2, right: -2,
                    width: 10, height: 10,
                    borderRadius: "50%",
                    background: BADGE_LEVEL_COLOR[badge.level] ?? "#484f58",
                    border: "2px solid #161b22",
                }} />
            )}
        </div>
    );
};

// build hex tree: domain → topics → concepts
const HexSkillTree: React.FC<{
    onNavigate: (nodeId: string) => void;
}> = ({ onNavigate }) => {
    const dynamicNodes = getDynamicNodes();

    const domains = dynamicNodes.filter(n => n.kind === "domain");

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
        }}>
            {domains.map(domain => {
                const topics = dynamicNodes.filter(
                    n => n.kind === "topic" && domain.links.includes(n.id)
                );

                return (
                    <div key={domain.id} style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}>
                        {/* domain row */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}>
                            <HexCell
                                node={domain}
                                size={64}
                                onClick={() => onNavigate(domain.id)}
                            />
                            <div>
                                <div style={{
                                    color: "#c9d1d9",
                                    fontSize: 13,
                                    fontWeight: 600,
                                }}>
                                    {domain.title}
                                </div>
                                <div style={{
                                    color: "#484f58",
                                    fontSize: 11,
                                    marginTop: 2,
                                }}>
                                    {domain.shortDescription}
                                </div>
                            </div>
                        </div>

                        {/* topics row */}
                        {topics.length > 0 && (
                            <div style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 10,
                                paddingLeft: 20,
                            }}>
                                {topics.map(topic => {
                                    const concepts = dynamicNodes.filter(
                                        n => (n.kind === "concept" || n.kind === "subconcept")
                                            && topic.links.includes(n.id)
                                    );

                                    return (
                                        <div key={topic.id} style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: 8,
                                        }}>
                                            <HexCell
                                                node={topic}
                                                size={52}
                                                onClick={() => onNavigate(topic.id)}
                                            />
                                            <span style={{
                                                color: "#6e7681",
                                                fontSize: 10,
                                                textAlign: "center",
                                                maxWidth: 70,
                                                lineHeight: 1.3,
                                            }}>
                                                {topic.title}
                                            </span>

                                            {/* concepts */}
                                            {concepts.length > 0 && (
                                                <div style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 6,
                                                    justifyContent: "center",
                                                    maxWidth: 160,
                                                }}>
                                                    {concepts.map(concept => (
                                                        <div
                                                            key={concept.id}
                                                            style={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                alignItems: "center",
                                                                gap: 4,
                                                            }}
                                                        >
                                                            <HexCell
                                                                node={concept}
                                                                size={38}
                                                                onClick={() => onNavigate(concept.id)}
                                                            />
                                                            <span style={{
                                                                color: "#484f58",
                                                                fontSize: 9,
                                                                textAlign: "center",
                                                                maxWidth: 50,
                                                                lineHeight: 1.2,
                                                            }}>
                                                                {concept.title}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* divider */}
                        <div style={{
                            height: 1,
                            background: "#21262d",
                            marginTop: 4,
                        }} />
                    </div>
                );
            })}
        </div>
    );
};

// ─── Stats bar ────────────────────────────────────────────────────────────────

const StatsBar: React.FC = () => {
    const completedNodes = getCompletedNodes();
    const totalCards = getAllCards().length;
    const dueCount = getDueCount();
    const badges = getEarnedBadges();

    const stats = [
        { value: completedNodes.length, label: "Complétés" },
        { value: totalCards, label: "Questions" },
        { value: dueCount, label: "À réviser", alert: dueCount > 0 },
        { value: badges.length, label: "Badges" },
    ];

    return (
        <div style={{
            display: "flex",
            background: "#0d1117",
            border: "1px solid #21262d",
            borderRadius: 12,
        }}>
            {stats.map(({ value, label, alert }, i) => (
                <div key={label} style={{
                    flex: 1,
                    padding: "12px 0",
                    textAlign: "center",
                    borderRight: i < stats.length - 1
                        ? "1px solid #21262d" : "none",
                }}>
                    <div style={{
                        color: alert ? "#ef4444" : "#c9d1d9",
                        fontSize: 18, fontWeight: 700,
                    }}>
                        {value}
                    </div>
                    <div style={{
                        color: alert ? "#ef444488" : "#484f58",
                        fontSize: 9,
                        marginTop: 2,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                    }}>
                        {label}
                    </div>
                </div>
            ))}
        </div>
    );
};

// ─── Badges section ───────────────────────────────────────────────────────────

const BadgesSection: React.FC = () => {
    const earned: EarnedBadge[] = getEarnedBadges();

    if (earned.length === 0) {
        return (
            <div style={{
                background: "#0d1117",
                border: "1px solid #21262d",
                borderRadius: 12, padding: "20px",
                textAlign: "center", color: "#484f58",
                fontSize: 12,
            }}>
                Aucun badge encore. Complète tes premières leçons pour en obtenir.
            </div>
        );
    }

    return (
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
        }}>
            {earned.map(eb => {
                const node = initialNodes.find(n => n.id === eb.nodeId);
                const badge = node?.badge;
                if (!badge) return null;
                const levelColor = BADGE_LEVEL_COLOR[eb.level];

                return (
                    <div key={eb.nodeId} style={{
                        background: "#0d1117",
                        border: `1px solid ${levelColor}44`,
                        borderRadius: 10,
                        padding: "12px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        minWidth: 140,
                    }}>
                        <div style={{
                            width: 36, height: 36,
                            clipPath: HEX_CLIP,
                            background: `${levelColor}18`,
                            border: `1px solid ${levelColor}44`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18, flexShrink: 0,
                        }}>
                            {badge.icon}
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}>
                            <span style={{
                                color: "#c9d1d9",
                                fontSize: 11,
                                fontWeight: 500,
                            }}>
                                {badge.name}
                            </span>
                            <span style={{
                                color: levelColor,
                                fontSize: 9,
                                textTransform: "capitalize",
                            }}>
                                {eb.level}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// ─── Avatar picker ────────────────────────────────────────────────────────────

const AvatarPicker: React.FC<{
    current: string;
    onSelect: (emoji: string) => void;
    onClose: () => void;
}> = ({ current, onSelect, onClose }) => (
    <div style={{
        position: "absolute",
        top: "100%", left: 0,
        marginTop: 8,
        background: "#161b22",
        border: "1px solid #30363d",
        borderRadius: 10,
        padding: 12,
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        zIndex: 10,
        width: 220,
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
    }}>
        {AVATAR_OPTIONS.map(emoji => (
            <button
                key={emoji}
                onClick={() => { onSelect(emoji); onClose(); }}
                style={{
                    width: 36, height: 36,
                    background: emoji === current
                        ? "rgba(165,180,252,0.2)" : "#21262d",
                    border: `1px solid ${emoji === current
                        ? "rgba(165,180,252,0.5)" : "#30363d"}`,
                    borderRadius: 8,
                    fontSize: 18,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {emoji}
            </button>
        ))}
    </div>
);

// ─── Learning style inference ─────────────────────────────────────────────────

const inferLearningStyle = (): string => {
    const cards = getAllCards();
    if (cards.length === 0) return "Non défini — complète des leçons pour le découvrir";

    const avgEase = cards.reduce((s, c) => s + c.easeFactor, 0) / cards.length;
    const avgInterval = cards.reduce((s, c) => s + c.interval, 0) / cards.length;

    if (avgEase > 2.8 && avgInterval > 10) return "Mémorisation rapide — tu retiens vite et durablement";
    if (avgEase > 2.4) return "Apprentissage régulier — progression constante et stable";
    if (avgEase < 1.8) return "Apprentissage profond — tu prends le temps de vraiment comprendre";
    return "Apprentissage équilibré — tu t'adaptes bien aux différents types de contenu";
};

const inferStrongest = (): string => {
    const completed = getCompletedNodes();
    if (completed.length === 0) return "—";
    const node = initialNodes.find(n => completed.includes(n.id) && n.kind !== "profile");
    return node?.title ?? "—";
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section: React.FC<{
    title: string;
    children: React.ReactNode;
}> = ({ title, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={{
            color: "#484f58",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 600,
        }}>
            {title}
        </span>
        {children}
    </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

interface ProfileViewProps {
    onClose: () => void;
    onNavigate: (nodeId: string) => void;
    onOpenStrengthen: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
    onClose, onNavigate, onOpenStrengthen,
}) => {
    const [visible, setVisible] = useState(false);
    const [profile, setProfile] = useState(getUserProfile());
    const [editingName, setEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(profile.name);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [activeTab, setActiveTab] = useState<"progress" | "badges" | "info">("progress");
    const nameInputRef = useRef<HTMLInputElement>(null);
    const dueCount = getDueCount();

    useEffect(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 350);
    };

    const handleSaveName = () => {
        const trimmed = nameInput.trim();
        if (trimmed.length === 0) return;
        saveUserProfile(trimmed, profile.avatarEmoji);
        setProfile(getUserProfile());
        setEditingName(false);
    };

    const handleSelectAvatar = (emoji: string) => {
        saveUserProfile(profile.name, emoji);
        setProfile(getUserProfile());
    };

    const joinDate = new Date(
        localStorage.getItem("join_date") ??
        new Date().toISOString().split("T")[0]
    ).toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric",
    });

    const tabs = [
        { id: "progress", label: "Progression" },
        { id: "badges", label: "Badges" },
        { id: "info", label: "Profil" },
    ] as const;

    return (
        <>
            <style>{`
                @keyframes hexGlow {
                    0%, 100% { opacity: 0.3; }
                    50%       { opacity: 0.7; }
                }
                @keyframes profileSlide {
                    from { transform: translateX(-50%) translateY(100%); }
                    to   { transform: translateX(-50%) translateY(0); }
                }
            `}</style>

            {/* backdrop */}
            <div
                onClick={handleClose}
                style={{
                    position: "absolute", inset: 0, zIndex: 50,
                    backdropFilter: visible ? "blur(8px)" : "none",
                    background: visible ? "rgba(0,0,0,0.7)" : "transparent",
                    transition: "all 0.35s ease",
                    pointerEvents: visible ? "auto" : "none",
                }}
            />

            {/* panel */}
            <div
                style={{
                    position: "absolute", zIndex: 51,
                    bottom: 0, left: "50%",
                    transform: visible
                        ? "translateX(-50%)"
                        : "translateX(-50%) translateY(100%)",
                    width: "min(600px, 100vw)",
                    height: "96vh",
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
                {/* top accent line */}
                <div style={{
                    height: 3, background: "#21262d", flexShrink: 0,
                }}>
                    <div style={{
                        height: "100%",
                        width: `${Math.min(100, (getCompletedNodes().length / Math.max(1, initialNodes.filter(n => n.kind !== "profile").length)) * 100)}%`,
                        background: "linear-gradient(90deg, #7c6af7, #4ecdc4)",
                        transition: "width 0.6s ease",
                    }} />
                </div>

                {/* header */}
                <div style={{
                    padding: "20px 20px 16px",
                    borderBottom: "1px solid #21262d",
                    flexShrink: 0,
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: 16,
                    }}>
                        {/* avatar */}
                        <div style={{ position: "relative" }}>
                            <button
                                onClick={() => setShowAvatarPicker(v => !v)}
                                style={{
                                    width: 60, height: 60,
                                    clipPath: HEX_CLIP,
                                    background: "rgba(124,106,247,0.15)",
                                    border: "2px solid rgba(124,106,247,0.3)",
                                    fontSize: 28,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {profile.avatarEmoji}
                            </button>
                            {showAvatarPicker && (
                                <AvatarPicker
                                    current={profile.avatarEmoji}
                                    onSelect={handleSelectAvatar}
                                    onClose={() => setShowAvatarPicker(false)}
                                />
                            )}
                        </div>

                        {/* name + join */}
                        <div style={{
                            flex: 1, paddingLeft: 14,
                        }}>
                            {editingName ? (
                                <div style={{
                                    display: "flex", gap: 8, alignItems: "center",
                                }}>
                                    <input
                                        ref={nameInputRef}
                                        autoFocus
                                        value={nameInput}
                                        onChange={e => setNameInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") handleSaveName();
                                            if (e.key === "Escape") setEditingName(false);
                                        }}
                                        style={{
                                            background: "#0d1117",
                                            border: "1px solid #30363d",
                                            borderRadius: 7,
                                            padding: "6px 10px",
                                            color: "#c9d1d9",
                                            fontSize: 16, fontWeight: 600,
                                            outline: "none",
                                            flex: 1,
                                            fontFamily: "inherit",
                                        }}
                                    />
                                    <button
                                        onClick={handleSaveName}
                                        style={{
                                            background: "rgba(124,106,247,0.2)",
                                            border: "1px solid rgba(124,106,247,0.4)",
                                            color: "#a39af7",
                                            borderRadius: 7,
                                            padding: "6px 12px",
                                            fontSize: 12,
                                            cursor: "pointer",
                                        }}
                                    >
                                        ✓
                                    </button>
                                </div>
                            ) : (
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}>
                                    <span style={{
                                        color: "#c9d1d9",
                                        fontSize: 18, fontWeight: 700,
                                    }}>
                                        {profile.name}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setEditingName(true);
                                            setNameInput(profile.name);
                                        }}
                                        style={{
                                            background: "none", border: "none",
                                            color: "#484f58", cursor: "pointer",
                                            fontSize: 12, padding: 2,
                                        }}
                                    >
                                        ✎
                                    </button>
                                </div>
                            )}
                            <div style={{
                                color: "#484f58", fontSize: 11, marginTop: 4,
                            }}>
                                Membre depuis {joinDate}
                            </div>
                        </div>

                        {/* close */}
                        <button
                            onClick={handleClose}
                            style={{
                                background: "none", border: "none",
                                color: "#484f58", fontSize: 20,
                                cursor: "pointer", lineHeight: 1, padding: 4,
                            }}
                        >×</button>
                    </div>

                    {/* stats */}
                    <StatsBar />
                </div>

                {/* strengthen CTA — shown if reviews due */}
                {dueCount > 0 && (
                    <button
                        onClick={() => { handleClose(); onOpenStrengthen(); }}
                        style={{
                            margin: "12px 20px 0",
                            padding: "11px 16px",
                            background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            color: "#ef4444",
                            borderRadius: 10,
                            fontSize: 12,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexShrink: 0,
                        }}
                    >
                        <span>💪</span>
                        <span>
                            {dueCount} révision{dueCount > 1 ? "s" : ""} en attente — S'entraîner maintenant
                        </span>
                    </button>
                )}

                {/* tabs */}
                <div style={{
                    display: "flex",
                    borderBottom: "1px solid #21262d",
                    padding: "0 20px",
                    marginTop: 12,
                    flexShrink: 0,
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                background: "none",
                                border: "none",
                                borderBottom: `2px solid ${activeTab === tab.id
                                    ? "#a5b4fc" : "transparent"}`,
                                color: activeTab === tab.id ? "#c9d1d9" : "#484f58",
                                fontSize: 12,
                                padding: "10px 14px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                marginBottom: -1,
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* tab content */}
                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#21262d transparent",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                }}>

                    {/* ── Progress tab ── */}
                    {activeTab === "progress" && (
                        <>
                            <Section title="Arbre de connaissances">
                                <HexSkillTree
                                    onNavigate={(nodeId) => {
                                        handleClose();
                                        setTimeout(() => onNavigate(nodeId), 400);
                                    }}
                                />
                            </Section>
                        </>
                    )}

                    {/* ── Badges tab ── */}
                    {activeTab === "badges" && (
                        <Section title="Badges obtenus">
                            <BadgesSection />
                            {/* locked badges preview */}
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                            }}>
                                <span style={{
                                    color: "#30363d",
                                    fontSize: 10,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                }}>
                                    À débloquer
                                </span>
                                {initialNodes
                                    .filter(n => n.badge && !getBadgeForNode(n.id))
                                    .map(n => (
                                        <div key={n.id} style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            background: "#0d1117",
                                            border: "1px solid #21262d",
                                            borderRadius: 8,
                                            padding: "10px 14px",
                                            opacity: 0.5,
                                        }}>
                                            <span style={{ fontSize: 18 }}>
                                                {n.badge!.icon}
                                            </span>
                                            <div>
                                                <div style={{
                                                    color: "#484f58",
                                                    fontSize: 11,
                                                }}>
                                                    {n.badge!.name}
                                                </div>
                                                <div style={{
                                                    color: "#30363d",
                                                    fontSize: 10,
                                                    marginTop: 2,
                                                }}>
                                                    {n.title}
                                                </div>
                                            </div>
                                            <span style={{
                                                marginLeft: "auto",
                                                color: "#30363d",
                                                fontSize: 12,
                                            }}>
                                                🔒
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </Section>
                    )}

                    {/* ── Info tab ── */}
                    {activeTab === "info" && (
                        <>
                            <Section title="Style d'apprentissage">
                                <div style={{
                                    background: "#0d1117",
                                    border: "1px solid #21262d",
                                    borderRadius: 10,
                                    padding: "14px 16px",
                                    color: "#8b949e",
                                    fontSize: 13,
                                    lineHeight: 1.6,
                                }}>
                                    {inferLearningStyle()}
                                </div>
                            </Section>

                            <Section title="Domaine le plus avancé">
                                <div style={{
                                    background: "#0d1117",
                                    border: "1px solid #21262d",
                                    borderRadius: 10,
                                    padding: "14px 16px",
                                    color: "#8b949e",
                                    fontSize: 13,
                                }}>
                                    {inferStrongest()}
                                </div>
                            </Section>

                            <Section title="Statistiques SR">
                                {(() => {
                                    const cards = getAllCards();
                                    if (cards.length === 0) {
                                        return (
                                            <div style={{
                                                color: "#484f58",
                                                fontSize: 12,
                                                padding: "12px 0",
                                            }}>
                                                Aucune donnée encore.
                                            </div>
                                        );
                                    }
                                    const avgInterval = Math.round(
                                        cards.reduce((s, c) => s + c.interval, 0) / cards.length
                                    );
                                    const avgEase = (
                                        cards.reduce((s, c) => s + c.easeFactor, 0) / cards.length
                                    ).toFixed(2);
                                    const mature = cards.filter(c => c.interval >= 21).length;

                                    return (
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 8,
                                        }}>
                                            {[
                                                ["Intervalle moyen", `${avgInterval} jours`],
                                                ["Facteur de facilité", avgEase],
                                                ["Cartes matures", `${mature} / ${cards.length}`],
                                            ].map(([label, value]) => (
                                                <div key={label} style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    padding: "10px 14px",
                                                    background: "#0d1117",
                                                    border: "1px solid #21262d",
                                                    borderRadius: 8,
                                                }}>
                                                    <span style={{
                                                        color: "#484f58", fontSize: 12,
                                                    }}>
                                                        {label}
                                                    </span>
                                                    <span style={{
                                                        color: "#c9d1d9", fontSize: 12,
                                                        fontWeight: 500,
                                                    }}>
                                                        {value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </Section>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};