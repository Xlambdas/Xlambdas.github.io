import React, { useState, useEffect, useRef } from "react";
import { type NodeType, type Lesson, isLessonCompleted } from "../../data/graphData";
import { useNavigate } from "react-router-dom";
import { initialNodes } from "../../data/graphData";

// --- Constants ---

const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const NODE_COLOR: Record<NodeType["type"], string> = {
    main: "#ffffff",
    folder: "#a5b4fc",
    file: "#94a3b8",
};

// --- SVG Icons for Lesson Types ---

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

// --- Types ---

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
    scrollToLesson?: string;
    scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

// --- Hexagon Components ---

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
    const [hovered, setHovered] = useState(false);
    const SIZE = 110;

    const bg = status === "completed"
        ? `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`
        : status === "current" ? `linear-gradient(135deg, ${color}44 0%, ${color}22 100%)`
            : "linear-gradient(135deg, #1c2128 0%, #161b22 100%)";

    const iconColor = status === "locked" ? "#484f58" : status === "completed" ? "#0d1117" : color;

    return (
        <div
            onClick={status !== "locked" ? onClick : undefined}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                cursor: status === "locked" ? "not-allowed" : "pointer",
                position: "relative",
                filter: hovered && status !== "locked" ? "brightness(1.1)" : "none",
                transition: "filter 0.2s ease",
            }}
        >
            {/* Pulsing ring for current lesson */}
            {status === "current" && (
                <>
                    <div style={{
                        position: "absolute",
                        inset: -8,
                        clipPath: HEX_CLIP,
                        background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
                        animation: "hexPulse 2s ease-in-out infinite",
                        zIndex: 0,
                    }} />
                    <div style={{
                        position: "absolute",
                        inset: -4,
                        clipPath: HEX_CLIP,
                        background: `${color}22`,
                        animation: "hexPulseInner 2s ease-in-out infinite 0.3s",
                        zIndex: 0,
                    }} />
                </>
            )}

            {/* Glow effect for completed */}
            {status === "completed" && (
                <div style={{
                    position: "absolute",
                    inset: -6,
                    clipPath: HEX_CLIP,
                    background: `radial-gradient(circle, ${color}44 0%, transparent 70%)`,
                    filter: "blur(8px)",
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
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: pressed ? "scale(0.95)" : hovered && status !== "locked" ? "scale(1.05)" : "scale(1)",
                    transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    boxShadow: status === "current" ? `0 8px 32px ${color}55, 0 0 0 1px ${color}33 inset`
                        : status === "completed" ? `0 4px 16px ${color}44, 0 0 0 1px ${color}22 inset`
                            : "0 2px 8px rgba(0,0,0,0.3)",
                    position: "relative",
                    zIndex: 1,
                    padding: "0 14px",
                }}
            >
                {/* Icon */}
                <div style={{
                    color: iconColor,
                    opacity: status === "locked" ? 0.4 : 1,
                    marginBottom: 6,
                    transition: "all 0.2s ease",
                }}>
                    {status === "completed" ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <LessonIcon type={lesson.type} size={22} />
                    )}
                </div>

                {/* Lesson title */}
                <div style={{
                    color: status === "locked" ? "#484f58" : status === "completed" ? "#0d1117" : "#c9d1d9",
                    fontSize: 10.5,
                    fontWeight: status === "current" ? 600 : 500,
                    lineHeight: 1.3,
                    textAlign: "center",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    textShadow: status === "completed" ? "none" : "0 1px 2px rgba(0,0,0,0.5)",
                }}>
                    {lesson.title}
                </div>

                {/* Lesson number badge */}
                <div style={{
                    position: "absolute",
                    bottom: -8,
                    right: -8,
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: status === "locked" ? "#21262d"
                        : `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                    // border: "3px solid #0b0f14",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: status === "locked" ? "#484f58" : "#0d1117",
                    boxShadow: status !== "locked" ? `0 2px 8px ${color}66` : "none",
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
            background: done
                ? `linear-gradient(180deg, ${color}44 0%, ${color}22 100%)`
                : "linear-gradient(180deg, #21262d 0%, #1c2128 100%)",
            margin: "6px 0",
            boxShadow: done ? `0 0 16px ${color}22` : "none",
            transition: "all 0.3s ease",
        }} />
    );
};

// --- Path Selection Component ---

const PathSelector: React.FC<{
    options: NodeType[];
    selectedId: string | null;
    onSelect: (nodeId: string) => void;
    color: string;
    parentNodeId: string;
}> = ({ options, selectedId, onSelect }) => {
    const [localSelected, setLocalSelected] = React.useState<string | null>(selectedId);
    const [hoveredId, setHoveredId] = React.useState<string | null>(null);

    return (
        <div style={{
            margin: "56px 24px",
            padding: "28px",
            background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
            border: "1px solid #21262d",
            borderRadius: 20,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
            <div style={{
                textAlign: "center",
                color: "#484f58",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 24,
            }}>
                Choisis ton prochain parcours
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: options.length === 1 ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 14,
            }}>
                {options.map(node => {
                    const isSelected = localSelected === node.id;
                    const isHovered = hoveredId === node.id;
                    const nodeColor = (node as any).branchColor || NODE_COLOR[node.type];

                    return (
                        <button
                            key={node.id}
                            onClick={() => {
                                setLocalSelected(node.id);
                                onSelect(node.id);
                            }}
                            onMouseEnter={() => setHoveredId(node.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{
                                padding: "18px",
                                background: isSelected
                                    ? `linear-gradient(135deg, ${nodeColor}22 0%, ${nodeColor}11 100%)`
                                    : isHovered ? "linear-gradient(135deg, #1c2128 0%, #161b22 100%)"
                                        : "#161b22",
                                border: `2px solid ${isSelected ? nodeColor : isHovered ? "#30363d" : "#21262d"}`,
                                borderRadius: 14,
                                cursor: "pointer",
                                transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                                boxShadow: isSelected
                                    ? `0 4px 16px ${nodeColor}33, 0 0 0 1px ${nodeColor}22 inset`
                                    : isHovered ? "0 4px 12px rgba(0,0,0,0.3)"
                                        : "0 2px 4px rgba(0,0,0,0.2)",
                                textAlign: "left",
                            }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                marginBottom: 10,
                            }}>
                                <div style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    background: `radial-gradient(circle, ${nodeColor} 0%, ${nodeColor}cc 100%)`,
                                    boxShadow: `0 0 12px ${nodeColor}88, 0 0 0 2px ${nodeColor}22`,
                                }} />
                                <div style={{
                                    color: "#c9d1d9",
                                    fontSize: 14.5,
                                    fontWeight: 600,
                                    flex: 1,
                                }}>
                                    {node.title}
                                </div>
                                {isSelected && (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={nodeColor} strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                            {node.shortDescription && (
                                <div style={{
                                    color: "#6e7681",
                                    fontSize: 11.5,
                                    lineHeight: 1.6,
                                    paddingLeft: 22,
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

// --- Section Component ---

const PathSectionComponent: React.FC<{
    section: PathSection;
    color: string;
    onLessonClick: (lesson: Lesson, lessonIndex: number) => void;
    lessonRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}> = ({ section, color, lessonRefs }) => {
    const { node, lessons } = section;
    const navigate = useNavigate();

    const getLessonStatus = (lesson: Lesson, index: number): LessonStatus => {
        // Check prerequisites for both first lesson AND final quiz
        if ((lesson.type === "final_quiz" || index === 0) && node.prerequisites.length > 0) {
            // All prerequisite nodes must have their final quiz completed
            const prereqsMet = node.prerequisites.every(prereqId => {
                const prereqNode = initialNodes.find(n => n.id === prereqId);
                if (!prereqNode) return false;

                const finalQuiz = prereqNode.lessonPath.find(l => l.type === "final_quiz");
                if (!finalQuiz) return true; // No final quiz = consider it met

                return isLessonCompleted(prereqId, finalQuiz.id);
            });

            if (!prereqsMet) return "locked";
        }

        // Final quiz: if prerequisites met, it's available
        if (lesson.type === "final_quiz") {
            return isLessonCompleted(node.id, lesson.id) ? "completed" : "current";
        }

        // Regular lessons follow normal progression
        if (isLessonCompleted(node.id, lesson.id)) return "completed";
        const firstIncomplete = lessons.findIndex(l => !isLessonCompleted(node.id, l.id));
        return index === firstIncomplete ? "current" : "locked";
    };

    return (
        <div style={{
            padding: "40px 0",
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

            {/* Honeycomb grid */}
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
                    const isLeftOnRow = index % 2 === 0;

                    const getOffset = () => {
                        if (index % 2 === 0) return -65;
                        return 65;
                    };

                    return (
                        <React.Fragment key={lesson.id}>
                            {index > 0 && (
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    width: "100%",
                                }}>
                                    <ConnectorHex color={color} done={prevDone} />
                                </div>
                            )}

                            <div
                                ref={el => { lessonRefs.current[lesson.id] = el; }}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    transform: `translateX(${getOffset()}px)`,
                                    transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                                }}
                            >
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

// --- Main Component ---

export const HoneycombPath: React.FC<HoneycombPathProps> = ({
    sections,
    onLessonClick,
    onPathSelect,
    pathOptions,
    selectedPaths = {},
    scrollToLesson,
    scrollContainerRef,
}) => {
    const lessonRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [shouldScroll, setShouldScroll] = useState(scrollToLesson);

    useEffect(() => {
        if (shouldScroll && sections.length > 0 && scrollContainerRef?.current) {
            const timeoutId = setTimeout(() => {
                const targetElement = lessonRefs.current[shouldScroll];
                const container = scrollContainerRef.current;

                if (targetElement && container) {
                    const containerRect = container.getBoundingClientRect();
                    const elementRect = targetElement.getBoundingClientRect();
                    const scrollTop = container.scrollTop;

                    const targetScroll = scrollTop + elementRect.top - containerRect.top - (containerRect.height / 2) + (elementRect.height / 2);

                    container.scrollTo({
                        top: targetScroll,
                        behavior: 'auto'
                    });

                    setShouldScroll(undefined);
                }
            }, 300);

            return () => clearTimeout(timeoutId);
        }
    }, [shouldScroll, sections, scrollContainerRef]);

    useEffect(() => {
        if (scrollToLesson) {
            setShouldScroll(scrollToLesson);
        }
    }, [scrollToLesson]);

    return (
        <>
            <style>{`
                @keyframes hexPulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50%      { opacity: 0.7; transform: scale(1.12); }
                }
                @keyframes hexPulseInner {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50%      { opacity: 1; transform: scale(1.06); }
                }
            `}</style>

            <div style={{
                width: "min(500px, 100%)",
                margin: "0 auto",
                paddingBottom: 80,
                paddingTop: 20,
            }}>
                {sections.map((section, sectionIndex) => {
                    const color = (section.node as any).branchColor || NODE_COLOR[section.node.type];
                    const nextOptions = pathOptions?.find(opt => opt.nodeId === section.node.id);

                    return (
                        <div key={section.node.id}>
                            <PathSectionComponent
                                section={section}
                                color={color}
                                onLessonClick={(lesson, index) =>
                                    onLessonClick(section.node, lesson, index)
                                }
                                lessonRefs={lessonRefs}
                            />

                            {nextOptions && nextOptions.nodes.length > 0 && (
                                <PathSelector
                                    options={nextOptions.nodes}
                                    selectedId={selectedPaths[nextOptions.nodeId] || null}
                                    onSelect={(nodeId) => onPathSelect?.(nodeId)}
                                    color={color}
                                    parentNodeId={nextOptions.nodeId}
                                />
                            )}

                            {sectionIndex < sections.length - 1 && (
                                <div style={{
                                    margin: "48px auto",
                                    maxWidth: 200,
                                    height: 2,
                                    background: `linear-gradient(90deg, transparent 0%, #21262d 50%, transparent 100%)`,
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};