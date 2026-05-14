import React from "react";
import type { ContentBlock, SRRating } from "../../types/types";
import { QuizBlockPlayer } from "./quizBlockPlayer";
import { useLessonTextSize } from "../../hooks";

// --- Markdown Helper ---

const md = (text: string) =>
    text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .split("\n\n")
        .map(p => `<p style="margin:0 0 14px 0;line-height:1.85">${p}</p>`)
        .join("");

// --- Block Components ---

const ExplanationBlock: React.FC<{
    block: Extract<ContentBlock, { type: "explanation" }>;
    color: string;
    textScale: number;
}> = ({ block, color, textScale }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {block.title && (
            <h2 style={{
                color,
                fontSize: 18 * textScale,
                fontWeight: 600,
                margin: 0,
                paddingLeft: 12,
                borderLeft: `3px solid ${color}`,
            }}>
                {block.title}
            </h2>
        )}
        <div
            style={{ color: "#c9d1d9", fontSize: 15 * textScale }}
            dangerouslySetInnerHTML={{ __html: md(block.content) }}
        />
    </div>
);

const VignetteBlock: React.FC<{
    block: Extract<ContentBlock, { type: "vignette" }>;
    color: string;
    textScale: number;
}> = ({ block, color, textScale }) => (
    <div style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderLeft: `3px solid ${color}`,
        borderRadius: 12,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
    }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 * textScale }}>🎭</span>
            <span style={{
                color,
                fontSize: 11 * textScale,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
            }}>
                {block.title}
            </span>
        </div>
        <div
            style={{
                color: "#8b949e",
                fontSize: 15 * textScale,
                fontStyle: "italic",
            }}
            dangerouslySetInnerHTML={{ __html: md(block.content) }}
        />
    </div>
);

const RecapBlock: React.FC<{
    block: Extract<ContentBlock, { type: "recap" }>;
    color: string;
    textScale: number;
}> = ({ block, color, textScale }) => (
    <div style={{
        background: `${color}08`,
        border: `1px solid ${color}22`,
        borderRadius: 12,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
    }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 * textScale }}>🔁</span>
            <span style={{
                color,
                fontSize: 12 * textScale,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
            }}>
                À retenir
            </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {block.points.map((point, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: color,
                        flexShrink: 0,
                        marginTop: 8,
                    }} />
                    <span style={{ color: "#c9d1d9", fontSize: 14 * textScale, lineHeight: 1.7 }}>
                        {point}
                    </span>
                </div>
            ))}
        </div>

        {/* Bibliography placeholder */}
        <div style={{
            marginTop: 8,
            paddingTop: 16,
            borderTop: "1px solid #21262d",
        }}>
            <span style={{
                color: "#484f58",
                fontSize: 10 * textScale,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
            }}>
                Bibliographie
            </span>
            <p style={{
                color: "#6e7681",
                fontSize: 12 * textScale,
                marginTop: 8,
                fontStyle: "italic",
            }}>
                À venir — références et ressources complémentaires
            </p>
        </div>
    </div>
);

// --- Main Renderer ---

interface BlockRendererProps {
    block: ContentBlock;
    color: string;
    nodeId: string;
    onQuizComplete: (correct: boolean, rating: SRRating, userAnswer: any) => void;
    onExplain: (explanation: string) => void;
    isAnswered: boolean;
    isRetry?: boolean;
    reviewMode?: boolean;
    reviewAnswer?: any;
    reviewCorrect?: boolean;
    onContinue?: () => void;
    onPrevious?: () => void;
    canContinue?: boolean;
    buttonLabel?: string;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
    block,
    color,
    onQuizComplete,
    onExplain,
    isAnswered,
    isRetry,
    reviewMode,
    reviewAnswer,
    reviewCorrect,
    onContinue,
    onPrevious,
    canContinue,
    buttonLabel,
}) => {
    const textScale = useLessonTextSize().textScale;
    return (
        <div style={{
            animation: "blockFadeIn 0.4s ease",
        }}>
            <style>{`
                @keyframes blockFadeIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* Retry badge */}
            {isRetry && (
                <div style={{
                    background: "rgba(251,146,60,0.1)",
                    border: "1px solid rgba(251,146,60,0.3)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    marginBottom: 16,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11 * textScale,
                    color: "#fb923c",
                    fontWeight: 500,
                }}>
                    Précédente erreur
                </div>
            )}

            {block.type === "explanation" && (
                <ExplanationBlock block={block} color={color} textScale={textScale} />
            )}

            {block.type === "vignette" && (
                <VignetteBlock block={block} color={color} textScale={textScale} />
            )}

            {block.type === "recap" && (
                <RecapBlock block={block} color={color} textScale={textScale} />
            )}

            {block.type === "quiz" && (
                <QuizBlockPlayer
                    question={block.question}
                    color={color}
                    onComplete={onQuizComplete}
                    onExplain={onExplain}
                    isAnswered={isAnswered}
                    reviewMode={reviewMode}
                    reviewData={reviewAnswer}
                    reviewCorrect={reviewCorrect}
                    onContinue={onContinue}
                    onPrevious={onPrevious}
                />
            )}

            {/* Continue button inline */}
            {onContinue && block.type !== "quiz" && (
                <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                    {onPrevious && (
                        <button
                            onClick={onPrevious}
                            style={{
                                padding: "12px 20px",
                                background: "transparent",
                                border: "1px solid #30363d",
                                color: "#8b949e",
                                borderRadius: 10,
                                fontSize: 13 * textScale,
                                fontWeight: 500,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                whiteSpace: "nowrap",
                            }}
                        >
                            ← Précédent
                        </button>
                    )}
                    <button
                        onClick={onContinue}
                        style={{
                            flex: 1,
                            padding: "14px 0",
                            background: canContinue ? `${color}22` : "#21262d",
                            border: `1px solid ${canContinue ? `${color}66` : "#30363d"}`,
                            color: canContinue ? color : "#484f58",
                            borderRadius: 10,
                            fontSize: 14 * textScale,
                            fontWeight: 500,
                            cursor: canContinue ? "pointer" : "not-allowed",
                            transition: "all 0.2s ease",
                        }}
                    >
                        {buttonLabel}
                    </button>
                </div>
            )}
        </div>
    );
};