import { PlayIcon } from "../../constants/icons/icons";
import type { BottomActionsProps } from "../../types";

export function BottomActions({
    fontSize,
    showFunFact,
    showStrengthen,
    onFunFact,
    onStrengthen,
}: BottomActionsProps) {
    if (!showFunFact && !showStrengthen) return null;

    return (
        <div style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 12,
            zIndex: 20,
        }}>
            {showFunFact && (
                <button
                    onClick={onFunFact}
                    style={{
                        background: "linear-gradient(135deg, rgba(124,106,247,0.2) 0%, rgba(124,106,247,0.1) 100%)",
                        border: "1px solid rgba(124,106,247,0.5)",
                        color: "#a39af7",
                        borderRadius: 10,
                        padding: "10px 18px",
                        fontSize: fontSize,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 4px 16px rgba(124,106,247,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(124,106,247,0.3) 0%, rgba(124,106,247,0.2) 100%)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,106,247,0.35), 0 0 0 1px rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(124,106,247,0.2) 0%, rgba(124,106,247,0.1) 100%)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,106,247,0.25), 0 0 0 1px rgba(255,255,255,0.05)";
                    }}
                >
                    Le saviez-vous ?
                </button>
            )}
            {showStrengthen && (
                <button
                    onClick={onStrengthen}
                    style={{
                        background: "linear-gradient(135deg, rgba(165,180,252,0.2) 0%, rgba(165,180,252,0.1) 100%)",
                        border: "1px solid rgba(165,180,252,0.5)",
                        color: "#a5b4fc",
                        borderRadius: 10,
                        padding: "10px 18px",
                        fontSize: fontSize,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 4px 16px rgba(165,180,252,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(165,180,252,0.3) 0%, rgba(165,180,252,0.2) 100%)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(165,180,252,0.35), 0 0 0 1px rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(165,180,252,0.2) 0%, rgba(165,180,252,0.1) 100%)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(165,180,252,0.25), 0 0 0 1px rgba(255,255,255,0.05)";
                    }}
                >
                    <PlayIcon size={14} color="#a5b4fc" />
                    S'entraîner
                </button>
            )}
        </div>
    );
}