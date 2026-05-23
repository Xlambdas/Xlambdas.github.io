import React from "react";
import type { LessonProgressBarProps } from "../../types";
import { BlockIcon } from "../../constants/icons/icons";

// --- Main Component ---
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