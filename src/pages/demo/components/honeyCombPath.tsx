import React, { useState } from "react";
import { type NodeType, type Lesson, isLessonCompleted } from "../data/graphData";
import { useNavigate } from "react-router-dom";

// ─── Constants ────────────────────────────────────────────────────────────────

const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const NODE_COLOR: Record<NodeType["type"], string> = {
    main: "#ffffff",
    folder: "#a5b4fc",
    file: "#94a3b8",
};

// ─── SVG Icons for Lesson Types ──────────────────────────────────────────────

const LessonIcon: React.FC<{ type: string; size?: number }> = ({ type, size = 20 }) => {
    const iconProps = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

    switch (type) {
        case "explanation":
            return (
                <svg {...iconProps}>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
            );
        case "vignette":
            return (
                <svg {...iconProps}>
                    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
            );
        case "recap":
            return (
                <svg {...iconProps}>
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
            );
        case "video":
            return (
                <svg {...iconProps}>
                    <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
            );
        case "quiz":
            return (
                <svg {...iconProps}>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            );
        default:
            return (
                <svg {...iconProps}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
            );
    }
};

// ─── Types ────────────────────────────────────────────────────────────────────

type LessonStatus = "completed" | "current" | "locked";

interface PathSection {
    node: NodeType;
    lessons: Lesson[];
}

interface HoneycombPathProps {
    sections: PathSection[];
    currentNodeId: string;
    onLessonClick: (node: NodeType, lesson: Lesson, lessonIndex: number) => void;
    onPathSelect?: (nodeId: string) => void;
    pathOptions?: { nodeId: string; nodes: NodeType[] }[];
    selectedPaths?: Record<string, string>;
}

// ─── Hexagon Components ───────────────────────────────────────────────────────

const LessonHex: React.FC<{
    lesson: Lesson;
    status: LessonStatus;
    index: number;
    color: string;
    onClick: () => void;
    node: NodeType;
    position: 'left' | 'center' | 'right';
}> = ({ lesson, status, index, color, onClick }) => {
    const [pressed, setPressed] = useState(false);
    const SIZE = 110;

    const bg = status === "completed" ? color
        : status === "current" ? `${color}33`
            : "#1c2128";

    const borderColor = status === "locked" ? "#30363d" : color;
    const iconColor = status === "locked" ? "#484f58" : status === "completed" ? "#0d1117" : color;

    return (
        <div
            onClick={status !== "locked" ? onClick : undefined}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                cursor: status === "locked" ? "not-allowed" : "pointer",
                position: "relative",
            }}
        >
            {/* Pulsing ring for current lesson */}
            {status === "current" && (
                <div style={{
                    position: "absolute",
                    inset: -6,
                    clipPath: HEX_CLIP,
                    background: `${color}22`,
                    animation: "hexPulse 1.8s ease-in-out infinite",
                    zIndex: 0,
                }} />
            )}

            {/* Main hexagon */}
            <div
                onMouseDown={() => setPressed(true)}
                onMouseUp={() => setPressed(false)}
                onMouseLeave={() => setPressed(false)}
                style={{
                    width: SIZE,
                    height: SIZE,
                    clipPath: HEX_CLIP,
                    background: bg,
                    border: `2px solid ${borderColor}`,
                    display: "flex",
                    flexDirection: "column", // ADD
                    alignItems: "center",
                    justifyContent: "center",
                    transform: pressed ? "scale(0.93)" : "scale(1)",
                    transition: "transform 0.12s ease",
                    boxShadow: status === "current" ? `0 0 20px ${color}44`
                        : status === "completed" ? `0 0 10px ${color}33`
                            : "none",
                    position: "relative",
                    zIndex: 1,
                    padding: "0 12px", // ADD
                }}
            >
                <div style={{ color: iconColor, opacity: status === "locked" ? 0.4 : 1, marginBottom: 4 }}> {/* ADD marginBottom */}
                    {status === "completed" ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"> {/* CHANGE from 24 to 20 */}
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <LessonIcon type={lesson.type} size={20} />
                    )}
                </div>

                {/* Lesson title INSIDE hexagon */}
                <div style={{
                    color: status === "locked" ? "#484f58" : "#c9d1d9",
                    fontSize: 10, // CHANGE from 12
                    fontWeight: status === "current" ? 600 : 500,
                    lineHeight: 1.2,
                    textAlign: "center",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                }}>
                    {lesson.title}
                </div>

                {/* Lesson number badge */}
                <div style={{
                    position: "absolute",
                    bottom: -6,
                    right: -6,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: status === "locked" ? "#21262d" : color,
                    border: "2px solid #161b22",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: status === "locked" ? "#484f58" : "#0d1117",
                }}>
                    {index + 1}
                </div>
            </div>
        </div>
    );
};

const ConnectorHex: React.FC<{ color: string; done: boolean }> = ({ color, done }) => {
    const SIZE = 80;
    return (
        <div style={{
            width: SIZE,
            height: SIZE,
            clipPath: HEX_CLIP,
            background: done ? `${color}33` : "#21262d",
            border: `1px solid ${done ? `${color}55` : "#30363d"}`,
            margin: "4px 0",
        }} />
    );
};

// ─── Path Selection Component ─────────────────────────────────────────────────

const PathSelector: React.FC<{
    options: NodeType[];
    selectedId: string | null;
    onSelect: (nodeId: string) => void;
    color: string;
    parentNodeId: string;
}> = ({ options, selectedId, onSelect }) => {
    const [localSelected, setLocalSelected] = React.useState<string | null>(selectedId);

    return (
        <div style={{
            margin: "48px 20px",
            padding: "24px",
            background: "#0d1117",
            border: "1px solid #21262d",
            borderRadius: 16,
        }}>
            <div style={{
                textAlign: "center",
                color: "#484f58",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 16,
            }}>
                Choisis ton prochain parcours
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: options.length === 1 ? "1fr" : "repeat(2, 1fr)",
                gap: 12,
            }}>
                {options.map(node => {
                    const isSelected = localSelected === node.id;
                    const nodeColor = NODE_COLOR[node.type];
                    // const isLocked = false;

                    return (
                        <button
                            key={node.id}
                            onClick={() => {
                                // if (!isLocked) {
                                    setLocalSelected(node.id);
                                    onSelect(node.id);
                                // }
                            }}
                            // disabled={isLocked}
                            style={{
                                padding: "16px",
                                background: isSelected ? `${nodeColor}1a` : "#161b22",
                                border: `2px solid ${isSelected ? nodeColor : "#21262d"}`,
                                borderRadius: 12,
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                opacity: 1,
                                textAlign: "left",
                            }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                marginBottom: 8,
                            }}>
                                <div style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: nodeColor,
                                    boxShadow: `0 0 8px ${nodeColor}88`,
                                }} />
                                <div style={{
                                    color: "#c9d1d9",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    flex: 1,
                                }}>
                                    {node.title}
                                </div>
                                { isSelected ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={nodeColor} strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : null}
                            </div>
                            {node.shortDescription && (
                                <div style={{
                                    color: "#6e7681",
                                    fontSize: 11,
                                    lineHeight: 1.5,
                                }}>
                                    {node.shortDescription}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ─── Section Component ────────────────────────────────────────────────────────

const PathSectionComponent: React.FC<{
    section: PathSection;
    color: string;
    onLessonClick: (lesson: Lesson, lessonIndex: number) => void;
}> = ({ section, color }) => {
    const { node, lessons } = section;
    const navigate = useNavigate();

    const getLessonStatus = (lesson: Lesson, index: number): LessonStatus => {
        if (isLessonCompleted(node.id, lesson.id)) return "completed";
        const firstIncomplete = lessons.findIndex(l => !isLessonCompleted(node.id, l.id));
        return index === firstIncomplete ? "current" : "locked";
    };

    return (
        <div style={{
            padding: "32px 0",
        }}>
            {/* Section header */}
            <div style={{
                textAlign: "center",
                marginBottom: 32,
            }}>
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                }}>
                    <div style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: color,
                        boxShadow: `0 0 8px ${color}88`,
                    }} />
                    <h2 style={{
                        color: "#c9d1d9",
                        fontSize: 20,
                        fontWeight: 700,
                        margin: 0,
                    }}>
                        {node.title}
                    </h2>
                </div>
                {node.shortDescription && (
                    <p style={{
                        color: "#6e7681",
                        fontSize: 13,
                        margin: 0,
                        fontStyle: "italic",
                    }}>
                        {node.shortDescription}
                    </p>
                )}
            </div>

            {/* Honeycomb grid - SNAKE PATTERN */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
                position: "relative",
            }}>
                {lessons.map((lesson, index) => {
                    const status = getLessonStatus(lesson, index);
                    const prevDone = index === 0 || getLessonStatus(lessons[index - 1], index - 1) === "completed";

                    // Snake pattern: determine position based on index
                    // const row = Math.floor(index / 2);
                    const isLeftOnRow = index % 2 === 0;

                    // Calculate horizontal offset for honeycomb pattern
                    const getOffset = () => {
                        if (index % 2 === 0) return -60; // Left
                        return 60; // Right
                    };

                    return (
                        <React.Fragment key={lesson.id}>
                            {/* Connector stays at center (0px) */}
                            {index > 0 && (
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    width: "100%",
                                }}>
                                    <ConnectorHex color={color} done={prevDone} />
                                </div>
                            )}

                            {/* Lesson offset left or right */}
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                transform: `translateX(${getOffset()}px)`,
                                transition: "transform 0.3s ease",
                            }}>
                                <LessonHex
                                    lesson={lesson}
                                    status={status}
                                    index={index}
                                    color={color}
                                    onClick={() => {
                                        if (status !== "locked") {
                                            navigate(`/demo/lesson/${node.id}/${lesson.id}`);
                                        }
                                    }}
                                    node={node}
                                    position={isLeftOnRow ? 'left' : 'right'}
                                />
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const HoneycombPath: React.FC<HoneycombPathProps> = ({
    sections,
    // currentNodeId,
    onLessonClick,
    onPathSelect,
    pathOptions,
    selectedPaths = {},
}) => {
    return (
        <>
            <style>{`
                @keyframes hexPulse {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50%      { opacity: 0.8; transform: scale(1.08); }
                }
            `}</style>

            <div style={{
                width: "min(480px, 100%)",
                margin: "0 auto",
                paddingBottom: 64,
            }}>
                {sections.map((section, sectionIndex) => {
                    const color = NODE_COLOR[section.node.type];
                    const nextOptions = pathOptions?.find(opt => opt.nodeId === section.node.id);

                    return (
                        <div key={section.node.id}>
                            <PathSectionComponent
                                section={section}
                                color={color}
                                onLessonClick={(lesson, index) =>
                                    onLessonClick(section.node, lesson, index)
                                }
                            />

                            {/* Path selector after this section */}
                            {nextOptions && nextOptions.nodes.length > 0 && (
                                <PathSelector
                                    options={nextOptions.nodes}
                                    selectedId={selectedPaths[nextOptions.nodeId] || null}
                                    onSelect={(nodeId) => onPathSelect?.(nodeId)}
                                    color={color}
                                    parentNodeId={nextOptions.nodeId}
                                />
                            )}

                            {/* Divider between sections */}
                            {sectionIndex < sections.length - 1 && (
                                <div style={{
                                    margin: "32px 20px",
                                    height: 1,
                                    background: "#21262d",
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};