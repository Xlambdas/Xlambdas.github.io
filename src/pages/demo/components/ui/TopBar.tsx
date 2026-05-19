import { type NodeType } from '../../data/graphData';
import { type TextSize, SIZE_MAP } from '../../hooks/useDemoHomeState';

interface TopBarProps {
    collapsed: boolean;
    onCollapse: (val: boolean) => void;
    textSize: TextSize;
    settingsOpen: boolean;
    onSettingsToggle: () => void;

    // Search
    mobileSearch: boolean;
    setMobileSearch: (val: boolean) => void;
    searchQuery: string;
    suggestions: NodeType[];
    onSearchChange: (q: string) => void;
    onSuggestionSelect: (node: NodeType) => void;
    searchInputRef: React.RefObject<HTMLInputElement>;
}

export function TopBar({
    collapsed,
    onCollapse,
    textSize,
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
    const ts = SIZE_MAP[textSize];

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: collapsed ? 0 : 240,
            right: 0,
            background: "#161b22",
            borderBottom: "1px solid #21262d",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 100,
            transition: "left 0.3s ease",
        }}>
            {/* Left side - Sidebar reopen */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }} >
                {collapsed && (
                    <button
                        onClick={() => onCollapse(false)}
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
                        className="hidden sm:flex"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                        Menu
                    </button>
                )}

                <span style={{
                    color: "#8b949e",
                    fontSize: 12,
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
                        {suggestions.length > 0 && (
                            <div style={{
                                position: "absolute", top: "calc(100% + 12px)",
                                left: 12, right: 12,
                                background: "#161b22", border: "1px solid #30363d",
                                borderRadius: 8, zIndex: 50, overflow: "hidden",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                            }}>
                                {suggestions.map(n => (
                                    <div
                                        key={n.id}
                                        onMouseDown={() => onSuggestionSelect(n)}
                                        style={{
                                            display: "flex", alignItems: "center",
                                            gap: 8, padding: "8px 12px",
                                            cursor: "pointer",
                                            borderBottom: "1px solid #21262d",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 6, height: 6, borderRadius: "50%",
                                                background: n.isUnlocked
                                                    ? n.type === "main" ? "#ffffff"
                                                        : n.type === "folder" ? "#a5b4fc"
                                                            : "#94a3b8"
                                                    : "#4b5563",
                                                flexShrink: 0,
                                            }}
                                        />
                                        <span style={{ color: n.isUnlocked ? "#c9d1d9" : "#4b5563", fontSize: 12 }}>
                                            {n.title}
                                        </span>
                                        {!n.isUnlocked && (
                                            <span style={{ color: "#30363d", fontSize: ts - 1, marginLeft: "auto" }}>🔒</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
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