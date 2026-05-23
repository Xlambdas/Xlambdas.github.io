import type { ContentBlock } from "../../types";

export const Divider = () => (
    <div style={{
        width: 24,
        height: 1,
        background: "#21262d",
        margin: "2px 0",
    }} />
);

// --- general icons ---

import React from 'react';

export interface IconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
}

export const BackIcon: React.FC<IconProps> = ({ size = 16, color = "currentColor", strokeWidth = 2.5 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 14, color = "currentColor", strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 20, color = "currentColor", strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export const LockIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export const PlayIcon: React.FC<IconProps> = ({ size = 16, color = "currentColor", strokeWidth = 2.5 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 16, color = "currentColor", strokeWidth = 2.5 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ size = 16, color = "currentColor", strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
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
    const size = isActive ? 12 : 8;
    const borderWidth = 2;
    const isFilled = isPast || isActive; // Fill if completed OR current

    // Different shapes based on block type
    switch (type) {
        case "explanation":
        case "vignette":
            // Square for explanation/vignette
            return (
                <div style={{
                    width: size,
                    height: size,
                    background: isFilled ? color : "transparent", // Filled if completed or current
                    border: `${borderWidth}px solid ${color}`, // Always show colored border
                    transition: "all 0.3s ease",
                    boxShadow: isActive ? `0 0 8px ${color}88` : "none",
                    opacity: isFilled ? 1 : 0.4,
                }} />
            );

        case "quiz":
            // Circle for quiz
            return (
                <div style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    background: isFilled ? color : "transparent", // Filled if completed or current
                    border: `${borderWidth}px solid ${color}`, // Always show colored border
                    transition: "all 0.3s ease",
                    boxShadow: isActive ? `0 0 8px ${color}88` : "none",
                    opacity: isFilled ? 1 : 0.4,
                }} />
            );

        case "recap":
            // Triangle for recap (always filled since border trick doesn't work well for hollow triangles)
            return (
                <div style={{
                    width: 0,
                    height: 0,
                    borderLeft: `${size / 2}px solid transparent`,
                    borderRight: `${size / 2}px solid transparent`,
                    borderBottom: `${size}px solid ${color}`,
                    filter: isActive ? `drop-shadow(0 0 4px ${color}88)` : "none",
                    transition: "all 0.3s ease",
                    opacity: isFilled ? 1 : 0.4,
                }} />
            );
        default:
            return null;
    }
};

// Dock Icons

export const StrengthenIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
        <path d="M14.4 14.4L9.6 9.6" />
        <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
        <path d="M21.5 11.5l-1.914-1.914A2 2 0 1 1 17.672 7.672L15.914 5.914a2 2 0 1 1-1.414-1.414l1.914-1.914A2 2 0 1 1 14.5 0.672L12.672 2.586a2 2 0 1 1-1.414 1.414L9.5 2.5" />
    </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

export const NotificationIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);