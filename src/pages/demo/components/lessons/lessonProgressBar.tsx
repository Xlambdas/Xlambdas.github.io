import React from "react";
import type { LessonProgressBarProps } from "../../types";
import { BlockIcon } from "../../constants/icons/icons";

// --- Main Component ---
export const LessonProgressBar: React.FC<LessonProgressBarProps> = ({
    blocks,
    currentIndex,
    color,
    colors,
}) => {
    // Use individual colors if provided, otherwise use single color for all
    const getBlockColor = (index: number) => {
        return colors && colors[index] ? colors[index] : color;
    };

    return (
        <div style={{
            background: "#161b22",
            borderBottom: "1px solid #21262d",
            padding: "12px 24px",
        }}>
            {/* Segmented progress bar */}
            <div style={{
                display: "flex",
                gap: 2,
                height: 4,
                marginBottom: 12,
            }}>
                {blocks.map((_, i) => {
                    const blockColor = getBlockColor(i);
                    const isPast = i < currentIndex;
                    const isCurrent = i === currentIndex;
                    // const isFuture = i > currentIndex;

                    return (
                        <div
                            key={i}
                            style={{
                                flex: 1,
                                height: "100%",
                                borderRadius: 2,
                                background: isPast
                                    ? blockColor // Completed: full color
                                    : isCurrent
                                        ? `${blockColor}88` // Current: semi-transparent
                                        : `${blockColor}22`, // Future: very faint
                                transition: "all 0.4s ease",
                                boxShadow: isCurrent ? `0 0 8px ${blockColor}66` : "none",
                            }}
                        />
                    );
                })}
            </div>

            {/* Block indicators */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                flexWrap: "wrap",
            }}>
                {blocks.map((_, i) => (
                    <BlockIcon
                        key={i}
                        type={blocks[i].type}
                        isActive={i === currentIndex}
                        isPast={i < currentIndex}
                        color={getBlockColor(i)}
                    />
                ))}
            </div>
        </div>
    );
};