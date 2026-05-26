import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProjectInfoButtonProps {
    isBelow?: boolean;
}

export const ProjectInfoButton: React.FC<ProjectInfoButtonProps> = ({ isBelow = true }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const isMobile = window.innerWidth < 640;

    const handleClick = () => {
        navigate('/demo/project-info');
    };

    return (
        <>
            {/* Desktop - Vertical text button */}
            {!isMobile && (
                <button
                    onClick={handleClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        position: "fixed",
                        right: 0,
                        top: isBelow ? "calc(50% + 105px)" : "50%",
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
                        À Propos
                    </span>
                </button>
            )}

            {/* Mobile - Small icon button */}
            {isMobile && (
                <button
                    onClick={handleClick}
                    style={{
                        position: "fixed",
                        top: 224,
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
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                    </svg>
                </button>
            )}
        </>
    );
};