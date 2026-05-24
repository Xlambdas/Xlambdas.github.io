import React, { useState } from "react";

interface FeedbackButtonProps {
    onClick: () => void;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isMobile = window.innerWidth < 640;

    return (
        <>
            {/* Desktop - Vertical text button */}
            {!isMobile && (
                <button
                    onClick={onClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        position: "fixed",
                        right: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 9999,
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
            )}

            {/* Mobile - Small icon button */}
            {isMobile && (
                <button
                    onClick={onClick}
                    style={{
                        position: "fixed",
                        top: 160,
                        right: 16,
                        zIndex: 9999,
                        background: "linear-gradient(135deg, #a5b4fc 0%, #8b9dfc 100%)",
                        border: "1px solid rgba(165,180,252,0.5)",
                        borderRadius: "50%",
                        width: 48,
                        height: 48,
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(165,180,252,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                    }}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0d1117"
                        strokeWidth="2.5"
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                </button>
            )}
        </>
    );
};