// import { PlayIcon } from "../../constants/icons/icons";
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
        <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 w-auto sm:w-auto px-4 sm:px-0"
            style={{
                maxWidth: "calc(100vw - 32px)",
            }}
        >
            {showFunFact && (
                <button
                    onClick={onFunFact}
                    className="flex-1 sm:flex-none"
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
                        justifyContent: "center",
                        gap: 8,
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 4px 16px rgba(124,106,247,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
                        transition: "all 0.2s ease",
                        whiteSpace: "nowrap",
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
                    className="flex-1 sm:flex-none"
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
                        justifyContent: "center",
                        gap: 8,
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 4px 16px rgba(165,180,252,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
                        transition: "all 0.2s ease",
                        whiteSpace: "nowrap",
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
                    {/* <PlayIcon size={14} color="#a5b4fc" /> */}
                    S'entraîner
                </button>
            )}
        </div>
    );
}