import type { ContentBlock } from "../types";

export const Divider = () => (
    <div style={{
        width: 24,
        height: 1,
        background: "#21262d",
        margin: "2px 0",
    }} />
);

// --- Icons ---

export const BackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
);

export const SettingsIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);


export const LessonIcon: React.FC<{ type: string; size?: number }> = ({ type, size = 20 }) => {
    const iconProps = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

    switch (type) {
        case "explanation":
            return (
                <svg {...iconProps}>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
            );
        case "vignette":
            return (
                <svg {...iconProps}>
                    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
            );
        case "recap":
            return (
                <svg {...iconProps}>
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
            );
        case "video":
            return (
                <svg {...iconProps}>
                    <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
            );
        case "quiz":
            return (
                <svg {...iconProps}>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            );
        default:
            return (
                <svg {...iconProps}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
            );
    }
};


// --- Block Icon Component ---

export const BlockIcon: React.FC<{
    type: ContentBlock["type"];
    isActive: boolean;
    isPast: boolean;
    color: string;
}> = ({ type, isActive, isPast, color }) => {
    const baseColor = isPast || isActive ? color : "#30363d";
    const size = isActive ? 12 : 8;

    // Different shapes based on block type
    switch (type) {
        case "explanation":
        case "vignette":
            // Square for explanation/vignette
            return (
                <div style={{
                    width: size,
                    height: size,
                    background: baseColor,
                    border: isActive ? `2px solid ${color}` : "none",
                    transition: "all 0.3s ease",
                    boxShadow: isActive ? `0 0 8px ${color}88` : "none",
                }} />
            );

        case "quiz":
            // Circle for quiz
            return (
                <div style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    background: baseColor,
                    border: isActive ? `2px solid ${color}` : "none",
                    transition: "all 0.3s ease",
                    boxShadow: isActive ? `0 0 8px ${color}88` : "none",
                }} />
            );

        case "recap":
            // Triangle for recap
            return (
                <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: `${size / 2}px solid transparent`,
                    borderRight: `${size / 2}px solid transparent`,
                    borderBottom: `${size}px solid ${baseColor}`,
                    filter: isActive ? `drop-shadow(0 0 4px ${color}88)` : "none",
                    transition: "all 0.3s ease",
                }} />
            );
    }
};