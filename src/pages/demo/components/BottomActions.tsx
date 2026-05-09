interface BottomActionsProps {
    fontSize: number;
    showFunFact: boolean;
    showStrengthen: boolean;
    onFunFact: () => void;
    onStrengthen: () => void;
}

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
            position: "absolute", bottom: 16, left: "50%",
            transform: "translateX(-50%)",
            display: "flex", gap: 8, zIndex: 20,
        }}>
            {showFunFact && (
                <button
                    onClick={onFunFact}
                    style={{
                        background: "rgba(124,106,247,0.15)",
                        border: "1px solid rgba(124,106,247,0.4)",
                        color: "#a39af7", borderRadius: 8,
                        padding: "8px 16px", fontSize: fontSize + 1,
                        cursor: "pointer", display: "flex",
                        alignItems: "center", gap: 6,
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 2px 12px rgba(124,106,247,0.2)",
                    }}
                >
                    Le saviez-vous ?
                </button>
            )}
            {showStrengthen && (
                <button
                    onClick={onStrengthen}
                    style={{
                        background: "rgba(78,205,196,0.15)",
                        border: "1px solid rgba(78,205,196,0.4)",
                        color: "#4ecdc4", borderRadius: 8,
                        padding: "8px 16px", fontSize: fontSize + 1,
                        cursor: "pointer", display: "flex",
                        alignItems: "center", gap: 6,
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 2px 12px rgba(78,205,196,0.2)",
                    }}
                >
                    S'entraîner
                </button>
            )}
        </div>
    );
}