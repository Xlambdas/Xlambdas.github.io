import React from "react";
import type { ContentBlock } from "../../types/types";

// --- Block Icon Component ---

const BlockIcon: React.FC<{
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

// --- Main Component ---

interface LessonProgressBarProps {
    blocks: ContentBlock[];
    currentIndex: number;
    color: string;
}

export const LessonProgressBar: React.FC<LessonProgressBarProps> = ({
    blocks,
    currentIndex,
    color,
}) => {
    const progress = blocks.length > 0 ? ((currentIndex + 1) / blocks.length) * 100 : 0;

    return (
        <div style={{
            background: "#161b22",
            borderBottom: "1px solid #21262d",
            padding: "12px 24px",
        }}>
            {/* Progress bar fill */}
            <div style={{
                height: 3,
                background: "#21262d",
                borderRadius: 2,
                marginBottom: 12,
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: color,
                    transition: "width 0.4s ease",
                    borderRadius: 2,
                }} />
            </div>

            {/* Block indicators */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                flexWrap: "wrap",
            }}>
                {blocks.map((block, i) => (
                    <BlockIcon
                        key={i}
                        type={block.type}
                        isActive={i === currentIndex}
                        isPast={i < currentIndex}
                        color={color}
                    />
                ))}
            </div>
        </div>
    );
};