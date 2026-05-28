import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { initialNodes, type NodeType } from "../../data/graphData";
import { getNodeCompletionPercent, getVisibleIds } from "../../data/graphData";
import { getProfileSettings } from "../../helpers";
import { PERSONA_OPTIONS, SIZE_MAP } from "../../constants";
import type { SidebarProps } from "../../types";

export const Sidebar: React.FC<SidebarProps> = ({
    collapsed,
    onCollapse,
    onSelectNode,
    textSize,
    isTeacher,
    teacherName,
    onOpenFunFact,
    // onOpenDailyMood,
}) => {
    const navigate = useNavigate();
    const fs = SIZE_MAP[textSize];

    const [searchQuery, setSearchQuery] = useState("");
    const [clickTimeout, setClickTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

    const handleNodeClick = (node: NodeType, isLocked: boolean) => {
        if (isLocked) return;

        // Clear any existing timeout
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
        }

        // Set timeout for single click (preview)
        const timeout = setTimeout(() => {
            onSelectNode(node);
            setClickTimeout(null);
        }, 250);

        setClickTimeout(timeout);
    };

    const handleNodeDoubleClick = (node: NodeType, isLocked: boolean) => {
        if (isLocked) return;

        // Clear single click timeout
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
        }

        // Navigate to page
        navigate(`/demo/node/${node.id}`);
    };

    // Get nodes with learning progress
    const getRecentNodes = () => {
        return initialNodes
            .filter(n => {
                if ((n as any).type === "profile") return false;
                const pct = getNodeCompletionPercent(n.id);
                return pct > 0 && pct < 100;
            })
            .slice(0, 3);
    };

    // Normalize string for accent-insensitive search
    const normalizeString = (str: string) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    // Get visible nodes from graph
    const visibleIds = getVisibleIds(initialNodes);

    // Filter nodes by search (show ALL matching nodes, even if not visible yet)
    const filteredNodes = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const normalizedQuery = normalizeString(searchQuery);
        return initialNodes
            .filter(n => {
                if ((n as any).type === "profile") return false;
                return normalizeString(n.title).includes(normalizedQuery);
            })
            .slice(0, 8); // Increased to show more results
    }, [searchQuery]);

    const recentNodes = getRecentNodes();

    // user profile
    const settings = getProfileSettings();
    const currentPersona = PERSONA_OPTIONS.find(p => p.id === settings.persona) || PERSONA_OPTIONS[0];
    // const currentBannerColor = settings.bannerColor;
    const currentPersonaBgColor = settings.personaBgColor;
    // const currentStatus = settings.statusIndex;
    const userName = localStorage.getItem("user_name") || "Username";

    if (collapsed) return null;

    return (
        <div
            className="hidden sm:flex flex-col border-r border-[#21262d] bg-[#0d1117] h-screen fixed left-0 top-0 z-50"
            style={{
                width: 240,
                // background: "#0d1117",
                // borderRight: "1px solid #21262d",
                // display: "flex",
                // flexDirection: "column",
                // height: "100vh",
                // position: "fixed",
                // left: 0,
                // top: 0,
                // zIndex: 50,
            }}
        >
            {/* Header with collapse button */}
            <div style={{
                padding: "16px 16px 12px",
                borderBottom: "1px solid #21262d",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <div style={{
                    color: "#c9d1d9",
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                }}>
                    Demo
                </div>
                <button
                    onClick={onCollapse}
                    style={{
                        background: "#21262d",
                        border: "1px solid #30363d",
                        borderRadius: 6,
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#8b949e",
                        transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#30363d"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#21262d"}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
            </div>

            {/* Profile Section */}
            <div style={{
                padding: "20px 16px",
                borderBottom: "1px solid #21262d",
            }}>
                <button
                    onClick={() => navigate("/demo/profile")}
                    style={{
                        width: "100%",
                        background: "#161b22",
                        border: "1px solid #21262d",
                        borderRadius: 10,
                        padding: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#1c2128";
                        e.currentTarget.style.borderColor = "#30363d";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#161b22";
                        e.currentTarget.style.borderColor = "#21262d";
                    }}
                >
                    {/* Profile Avatar */}
                    <div style={{
                        position: "relative",
                        flexShrink: 0,
                    }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                            background: currentPersonaBgColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                        }}>
                            <img
                                src={currentPersona.src}
                                alt="Avatar"
                                style={{
                                    width: "85%",
                                    height: "85%",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                        {/* Status badge */}
                        {/* <div style={{
                            position: "absolute",
                            bottom: -4,
                            right: -4,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: "#fff",
                            border: "2px solid #0d1117",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                        }}>
                            {currentStatus}
                        </div> */}
                    </div>

                    {/* Profile Info */}
                    <div style={{
                        flex: 1,
                        textAlign: "left",
                        minWidth: 0,
                    }}>
                        <div style={{
                            color: "#c9d1d9",
                            fontSize: 13,
                            fontWeight: 600,
                            marginBottom: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}>
                            {userName}
                        </div>
                        <div style={{
                            color: "#8b949e",
                            fontSize: 11,
                        }}>
                            Voir le profil
                        </div>
                    </div>

                    {/* Arrow */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#484f58" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>

                {/* Teacher Mode Indicator */}
                {isTeacher && (
                    <div style={{
                        marginTop: 12,
                        background: "rgba(124,106,247,0.08)",
                        border: "1px solid rgba(124,106,247,0.2)",
                        borderRadius: 8,
                        padding: "8px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}>
                        <div style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#a5b4fc",
                            boxShadow: "0 0 8px #a5b4fc88",
                        }} />
                        <div style={{
                            color: "#a39af7",
                            fontSize: 11,
                            fontWeight: 500,
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}>
                            Mode enseignant • {teacherName}
                        </div>
                    </div>
                )}
            </div>

            {/* Search Section */}
            <div style={{
                padding: "12px 16px",
                borderBottom: "1px solid #21262d",
            }}>
                <div style={{ position: "relative" }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher un module..."
                        style={{
                            width: "100%",
                            background: "#161b22",
                            border: "1px solid #30363d",
                            borderRadius: 8,
                            padding: "8px 12px 8px 36px",
                            color: "#c9d1d9",
                            fontSize: fs,
                            outline: "none",
                            transition: "all 0.15s ease",
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = "#8b949e"}
                        onBlur={(e) => e.currentTarget.style.borderColor = "#30363d"}
                    />
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#6e7681"
                        strokeWidth="2"
                        style={{
                            position: "absolute",
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                        }}
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>

                {/* Search Results */}
                {searchQuery && filteredNodes.length > 0 && (
                    <div style={{
                        marginTop: 8,
                        background: "#0d1117",
                        border: "1px solid #21262d",
                        borderRadius: 8,
                        overflow: "hidden",
                    }}>
                        {filteredNodes.map(node => {
                            const color = (node as any).branchColor || "#a5b4fc";
                            const pct = getNodeCompletionPercent(node.id);
                            const isLocked = !visibleIds.has(node.id);
                            return (
                                <button
                                    key={node.id}
                                    onClick={() => {
                                        if (!isLocked) {
                                            setSearchQuery("");
                                        }
                                        handleNodeClick(node, isLocked);
                                    }}
                                    onDoubleClick={() => {
                                        if (!isLocked) {
                                            setSearchQuery("");
                                        }
                                        handleNodeDoubleClick(node, isLocked);
                                    }}
                                    disabled={isLocked}
                                    style={{
                                        width: "100%",
                                        background: "transparent",
                                        border: "none",
                                        borderBottom: "1px solid #21262d",
                                        padding: "10px 12px",
                                        cursor: isLocked ? "not-allowed" : "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        transition: "all 0.15s ease",
                                        opacity: isLocked ? 0.5 : 1,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isLocked) e.currentTarget.style.background = "#161b22";
                                    }}
                                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                >
                                    <div style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: isLocked ? "#4b5563" : color,
                                        boxShadow: isLocked ? "none" : `0 0 8px ${color}66`,
                                        border: isLocked ? "1px solid #6b7280" : "none",
                                        flexShrink: 0,
                                    }} />
                                    <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                                        <div style={{
                                            color: isLocked ? "#4b5563" : "#c9d1d9",
                                            fontSize: fs - 1,
                                            fontWeight: 500,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}>
                                            {node.title}
                                        </div>
                                        {!isLocked && pct > 0 && (
                                            <div style={{
                                                color: "#6e7681",
                                                fontSize: fs - 2,
                                                marginTop: 2,
                                            }}>
                                                {pct}% complété
                                            </div>
                                        )}
                                    </div>
                                    {isLocked ? (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    ) : (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#484f58" strokeWidth="2">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {searchQuery && filteredNodes.length === 0 && (
                    <div style={{
                        marginTop: 8,
                        padding: "12px",
                        textAlign: "center",
                        color: "#6e7681",
                        fontSize: fs - 1,
                    }}>
                        Aucun résultat trouvé
                    </div>
                )}
            </div>

            {/* Navigation Links */}
            <div style={{
                flex: 1,
                overflowY: "auto",
                padding: "12px 16px",
            }}>

                {/* Recent Activity */}
                {recentNodes.length > 0 && (
                    <>
                        <div style={{
                            color: "#6e7681",
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            fontWeight: 600,
                            marginTop: 24,
                            marginBottom: 12,
                            paddingLeft: 4,
                        }}>
                            En cours
                        </div>

                        {recentNodes.map(node => {
                            const color = (node as any).branchColor || "#a5b4fc";
                            const pct = getNodeCompletionPercent(node.id);
                            return (
                                <button
                                    key={node.id}
                                    onClick={() => handleNodeClick(node, false)}
                                    onDoubleClick={() => handleNodeDoubleClick(node, false)}
                                    style={{
                                        width: "100%",
                                        background: "transparent",
                                        border: "1px solid #21262d",
                                        borderRadius: 8,
                                        padding: "10px 12px",
                                        marginBottom: 6,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        transition: "all 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#161b22";
                                        e.currentTarget.style.borderColor = "#30363d";
                                        e.currentTarget.style.transform = "translateX(2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.borderColor = "#21262d";
                                        e.currentTarget.style.transform = "translateX(0)";
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
                                    <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                                        <div style={{
                                            color: "#c9d1d9",
                                            fontSize: fs - 1,
                                            fontWeight: 500,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            marginBottom: 2,
                                        }}>
                                            {node.title}
                                        </div>
                                        <div style={{
                                            width: "100%",
                                            height: 3,
                                            background: "#21262d",
                                            borderRadius: 2,
                                            overflow: "hidden",
                                        }}>
                                            <div style={{
                                                width: `${pct}%`,
                                                height: "100%",
                                                background: color,
                                                transition: "width 0.3s ease",
                                            }} />
                                        </div>
                                    </div>
                                    <span style={{
                                        color: "#6e7681",
                                        fontSize: fs - 2,
                                        fontWeight: 600,
                                    }}>
                                        {pct}%
                                    </span>
                                </button>
                            );
                        })}
                    </>
                )}
                <div style={{
                    color: "#6e7681",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 600,
                    marginBottom: 12,
                    paddingLeft: 4,
                }}>
                    Navigation
                </div>

                {/* Graph View */}
                <button
                    onClick={() => navigate("/demoHome")}
                    style={{
                        width: "100%",
                        background: "#161b22",
                        border: "1px solid #30363d",
                        borderRadius: 8,
                        padding: "10px 12px",
                        marginBottom: 6,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#1c2128";
                        e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#161b22";
                        e.currentTarget.style.transform = "translateX(0)";
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2">
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="12" cy="19" r="2" />
                        <circle cx="5" cy="12" r="2" />
                        <circle cx="19" cy="12" r="2" />
                        <line x1="12" y1="7" x2="12" y2="10" />
                        <line x1="12" y1="14" x2="12" y2="17" />
                        <line x1="7" y1="12" x2="10" y2="12" />
                        <line x1="14" y1="12" x2="17" y2="12" />
                    </svg>
                    <span style={{ color: "#c9d1d9", fontSize: fs, fontWeight: 500 }}>
                        Vue graphe
                    </span>
                </button>

                {/* Strengthen Session */}
                <button
                    onClick={() => {
                        window.__openStrengthenModal?.();
                    }}
                    style={{
                        width: "100%",
                        background: "transparent",
                        border: "1px solid #21262d",
                        borderRadius: 8,
                        padding: "10px 12px",
                        marginBottom: 6,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#161b22";
                        e.currentTarget.style.borderColor = "#30363d";
                        e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "#21262d";
                        e.currentTarget.style.transform = "translateX(0)";
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span style={{ color: "#8b949e", fontSize: fs, fontWeight: 500 }}>
                        Révision
                    </span>
                </button>

                {/* Fun Facts */}
                <button
                    onClick={onOpenFunFact}
                    style={{
                        width: "100%",
                        background: "transparent",
                        border: "1px solid #21262d",
                        borderRadius: 8,
                        padding: "10px 12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#161b22";
                        e.currentTarget.style.borderColor = "#30363d";
                        e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "#21262d";
                        e.currentTarget.style.transform = "translateX(0)";
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <span style={{ color: "#8b949e", fontSize: fs, fontWeight: 500 }}>
                        Le saviez-vous ?
                    </span>
                </button>

                {/* Daily Session */}
                {/* <button
                    onClick={onOpenDailyMood}
                    style={{
                        width: "100%",
                        background: "linear-gradient(135deg, rgba(165,180,252,0.12) 0%, rgba(139,157,252,0.08) 100%)",
                        border: "1px solid rgba(165,180,252,0.3)",
                        borderRadius: 8,
                        padding: "10px 12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(165,180,252,0.18) 0%, rgba(139,157,252,0.12) 100%)";
                        e.currentTarget.style.borderColor = "rgba(165,180,252,0.5)";
                        e.currentTarget.style.transform = "translateX(2px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(165,180,252,0.12) 0%, rgba(139,157,252,0.08) 100%)";
                        e.currentTarget.style.borderColor = "rgba(165,180,252,0.3)";
                        e.currentTarget.style.transform = "translateX(0)";
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span style={{ color: "#a5b4fc", fontSize: fs, fontWeight: 500 }}>
                        Session du jour
                    </span>
                </button> */}

            </div>

            {/* --- Footer --- */}
            <div style={{
                padding: "12px 16px",
                borderTop: "1px solid #21262d",
                display: "flex", justifyContent: "space-between",
            }}>
                <span
                    onClick={() => navigate("/")}
                    style={{ color: "#30363d", fontSize: fs - 1, cursor: "pointer" }}
                >
                    XLS.studio
                </span>
                <span style={{ color: "#30363d", fontSize: fs - 1 }}>05 · 2026</span>
            </div>
        </div>
    );
};