// import { useRef } from "react";
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
        <div className="h-10.5 shrink-0 bg-[rgba(13,17,23,0.94)] border-b border-[#21262d] flex items-center px-3.5 gap-2.5 z-10">

            {/* Sidebar reopen (desktop) */}
            {collapsed && (
                <button
                    onClick={() => onCollapse(settingsOpen ? false : true)}
                    className="hidden sm:block bg-[#21262d] border border-[#30363d] text-[#8b949e] rounded px-2 py-0.5 text-xs cursor-pointer hover:bg-[#30363d] transition-colors"
                >≡</button>
            )}

            <span className="text-[#484f58] text-xs">Graph View</span>

            {/* --- Mobile search --- */}
            <div className="flex sm:hidden ml-auto items-center gap-2 relative">
                {mobileSearch ? (
                    <div className="relative">
                        <input
                            ref={searchInputRef}
                            autoFocus
                            value={searchQuery}
                            onChange={e => onSearchChange(e.target.value)}
                            onBlur={() => setTimeout(() => {
                                if (!searchQuery) setMobileSearch(false);
                            }, 150)}
                            placeholder="Rechercher…"
                            className="bg-[#21262d] border border-[#30363d] text-[#c9d1d9] rounded-lg px-3 py-1.5 text-xs outline-none w-48"
                        />
                        {suggestions.length > 0 && (
                            <div style={{
                                position: "absolute", top: "calc(100% + 6px)",
                                left: 0, right: 0,
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
                                        <div style={{
                                            width: 6, height: 6, borderRadius: "50%",
                                            background: n.isUnlocked
                                                ? n.type === "main" ? "#ffffff"
                                                    : n.type === "folder" ? "#a5b4fc"
                                                        : "#94a3b8"
                                                : "#4b5563",
                                            flexShrink: 0,
                                        }} />
                                        <span style={{ color: n.isUnlocked ? "#c9d1d9" : "#4b5563", fontSize: 12 }}>
                                            {n.title}
                                        </span>
                                        {!n.isUnlocked && (
                                            <span style={{ color: "#30363d", fontSize: ts-1, marginLeft: "auto" }}>🔒</span>
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
                        className="text-[#8b949e] flex items-center justify-center w-8 h-8 bg-[#21262d] border border-[#30363d] rounded-lg"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>
                )}
            </div>

            {/* --- Desktop controls --- */}
            <div className="ml-auto hidden sm:flex gap-1.5 items-center">
                {([["−", 0.8], ["+", 1.25]] as [string, number][]).map(([label, factor]) => (
                    <button
                        key={label}
                        onClick={() => window.__graphZoom?.(factor)}
                        className="bg-[#21262d] border border-[#30363d] text-[#8b949e] rounded w-6 h-6 text-sm cursor-pointer flex items-center justify-center hover:bg-[#30363d] transition-colors"
                    >
                        {label}
                    </button>
                ))}
                <button
                    onClick={() => window.__graphReset?.()}
                    className="bg-[#21262d] border border-[#30363d] text-[#8b949e] rounded px-2 py-0.5 text-[11px] cursor-pointer hover:bg-[#30363d] transition-colors"
                >
                    Reset
                </button>
                <button
                    onClick={onSettingsToggle}
                    className="bg-[#21262d] border border-[#30363d] text-[#8b949e] rounded w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-[#30363d] transition-colors"
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}