import React from "react";
import { type TopBarProps } from '../../types';
// import { SIZE_MAP } from '../../constants';
import { getNodeCompletionPercent, getVisibleIds } from '../../data/graphData';
import { useNavigate } from 'react-router-dom';

export function TopBar({
    collapsed,
    onCollapse,
    // textSize,
    settingsOpen,
    onSettingsToggle,
    mobileSearch,
    setMobileSearch,
    searchQuery,
    suggestions,
    onSearchChange,
    onSuggestionSelect,
    searchInputRef,
}: TopBarProps) {
    // const ts = SIZE_MAP[textSize];
    const navigate = useNavigate();
    const [clickTimeout, setClickTimeout] = React.useState<ReturnType<typeof setTimeout> | null>(null);
    const visibleIds = getVisibleIds(suggestions);

    return (
        <div
            className="fixed top-0 right-0 bg-[#161b22] border-b border-[#21262d] flex items-center justify-between z-100 transition-all duration-300"
            style={{
                left: collapsed ? 0 : 240,
                padding: "12px 16px",
                // position: "fixed",
                // top: 0,
                // left: collapsed ? 0 : 240,
                // right: 0,
                // background: "#161b22",
                // borderBottom: "1px solid #21262d",
                // padding: "16px 20px",
                // display: "flex",
                // alignItems: "center",
                // justifyContent: "space-between",
                // zIndex: 100,
                // transition: "left 0.3s ease",
            }}
        >
            {/* Left side - Sidebar reopen */}
            <div className="flex items-center gap-3">
                {collapsed && (
                    <button
                        onClick={() => onCollapse(false)}
                        className="hidden md:flex items-center gap-1.5"
                        style={{
                            background: "#21262d",
                            border: "1px solid #30363d",
                            borderRadius: 10,
                            padding: "8px 16px",
                            color: "#8b949e",
                            fontSize: 13,
                            cursor: "pointer",
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                        <span className="hidden lg:inline">Menu</span>
                    </button>
                )}

                <span style={{
                    color: "#8b949e",
                    fontSize: "clamp(10px, 2.5vw, 12px)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontWeight: 600,
                }}>
                    Vue Graphe
                </span>
            </div>

            {/* --- Mobile search --- */}
            <div className="flex sm:hidden ml-auto items-center gap-2 relative">
                {mobileSearch ? (
                    <div className="fixed inset-x-0 top-0 z-50 bg-[rgba(22,27,34,1)] p-3 border-b border-[#21262d]">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setMobileSearch(false);
                                    onSearchChange("");
                                }}
                                className="text-[#8b949e] text-sm"
                            >
                                ✕
                            </button>
                            <input
                                ref={searchInputRef}
                                autoFocus
                                value={searchQuery}
                                onChange={e => onSearchChange(e.target.value)}
                                placeholder="Rechercher…"
                                className="flex-1 bg-[#21262d] border border-[#30363d] text-[#c9d1d9] rounded-lg px-3 py-2 outline-none"
                                style={{ fontSize: 16 }}
                            />
                        </div>
                        {suggestions.map(n => {
                            const isLocked = !visibleIds.has(n.id);
                            const pct = getNodeCompletionPercent(n.id);
                            const color = (n as any).branchColor || "#a5b4fc";

                            return (
                                <div
                                    key={n.id}
                                    onClick={() => {
                                        if (isLocked) return;

                                        // Clear any existing timeout
                                        if (clickTimeout) {
                                            clearTimeout(clickTimeout);
                                            setClickTimeout(null);
                                        }

                                        // Set timeout for single click (preview)
                                        const timeout = setTimeout(() => {
                                            onSuggestionSelect(n);
                                            setClickTimeout(null);
                                        }, 250);

                                        setClickTimeout(timeout);
                                    }}
                                    onDoubleClick={() => {
                                        if (isLocked) return;

                                        // Clear single click timeout
                                        if (clickTimeout) {
                                            clearTimeout(clickTimeout);
                                            setClickTimeout(null);
                                        }

                                        // Navigate to page
                                        setMobileSearch(false);
                                        onSearchChange("");
                                        navigate(`/demo/node/${n.id}`);
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "10px 12px",
                                        cursor: isLocked ? "not-allowed" : "pointer",
                                        borderBottom: "1px solid #21262d",
                                        opacity: isLocked ? 0.5 : 1,
                                        transition: "all 0.15s ease",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: isLocked ? "#4b5563" : color,
                                            boxShadow: isLocked ? "none" : `0 0 8px ${color}66`,
                                            border: isLocked ? "1px solid #6b7280" : "none",
                                            flexShrink: 0,
                                        }}
                                    />
                                    <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                                        <div style={{
                                            color: isLocked ? "#4b5563" : "#c9d1d9",
                                            fontSize: 12,
                                            fontWeight: 500,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}>
                                            {n.title}
                                        </div>
                                        {!isLocked && pct > 0 && (
                                            <div style={{
                                                color: "#6e7681",
                                                fontSize: 11,
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
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            setMobileSearch(true);
                            setTimeout(() => searchInputRef.current?.focus(), 50);
                        }}
                        style={{
                            width: 32,
                            height: 32,
                            background: "#21262d",
                            border: "1px solid #30363d",
                            borderRadius: 8,
                            color: "#8b949e",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>
                )}
            </div>

            {/* --- Desktop controls --- */}
            <div className="ml-auto hidden sm:flex gap-2 items-center">
                {/* Zoom controls */}
                <div style={{ display: "flex", gap: 4 }}>
                    {([["−", 0.8], ["+", 1.25]] as [string, number][]).map(([label, factor]) => (
                        <button
                            key={label}
                            onClick={() => window.__graphZoom?.(factor)}
                            style={{
                                width: 32,
                                height: 32,
                                background: "#21262d",
                                border: "1px solid #30363d",
                                borderRadius: 8,
                                color: "#8b949e",
                                fontSize: 16,
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.15s ease",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#30363d"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "#21262d"}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Reset button */}
                <button
                    onClick={() => window.__graphReset?.()}
                    style={{
                        background: "#21262d",
                        border: "1px solid #30363d",
                        borderRadius: 8,
                        padding: "8px 12px",
                        color: "#8b949e",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#30363d"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "#21262d"}
                >
                    Reset
                </button>

                {/* Settings button */}
                <button
                    onClick={onSettingsToggle}
                    style={{
                        width: 32,
                        height: 32,
                        background: settingsOpen ? "#30363d" : "#21262d",
                        border: "1px solid #30363d",
                        borderRadius: 8,
                        color: "#8b949e",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#30363d"}
                    onMouseLeave={(e) => {
                        if (!settingsOpen) e.currentTarget.style.background = "#21262d";
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}