import React, { useState } from "react";

interface FeedbackButtonProps {
    onClick: () => void;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-9999"
            style={{
                background: "linear-gradient(135deg, #a5b4fc 0%, #8b9dfc 100%)",
                border: "1px solid rgba(165,180,252,0.5)",
                borderRight: "none",
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
                padding: "16px 8px",
                cursor: "pointer",
                boxShadow: isHovered
                    ? "0 4px 20px rgba(165,180,252,0.4), 0 0 0 1px rgba(255,255,255,0.1)"
                    : "0 2px 12px rgba(165,180,252,0.3)",
                transition: "all 0.2s ease",
                transform: isHovered
                    ? "translateY(-50%) translateX(0)"
                    : "translateY(-50%) translateX(0)",
                writingMode: "vertical-rl",
                textOrientation: "mixed",
            }}
        >
            <span style={{
                color: "#0d1117",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
            }}>
                Feedback
            </span>
        </button>
    );
};