import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import type { Lesson, NodeType } from "../../types/types";
import { initialNodes, getDynamicNodes } from "../../data/graphData";
import { HoneycombPath } from "../ui/honeyCombPath";
import { LessonPlayer } from "../lessons/lessonPlayer";
import { StrengthenSession } from "../../sections/strengthenSession";
import { ProfileView } from "../../sections/profileView";
import { NodePathSettings } from "./NodePathSettings";

// --- Helpers ---

const findParent = (nodeId: string) =>
    initialNodes.find(n => n.links.includes(nodeId));

// Build the complete path tree - traverse backwards to root, then forwards
const buildPathTree = (startNode: NodeType, selectedPaths: Record<string, string> = {}): {
    sections: Array<{ node: NodeType; lessons: Lesson[] }>;
    pathOptions: Array<{ nodeId: string; nodes: NodeType[] }>;
} => {
    const sections: Array<{ node: NodeType; lessons: Lesson[] }> = [];
    const pathOptions: Array<{ nodeId: string; nodes: NodeType[] }> = [];
    const dynamicNodes = getDynamicNodes();

    // Step 1: Traverse backwards to find root
    const pathToRoot: NodeType[] = [];
    let currentNode: NodeType | undefined = startNode;

    while (currentNode) {
        pathToRoot.unshift(currentNode); // Add to beginning
        const parent = findParent(currentNode.id);
        if (parent && !pathToRoot.some(n => n.id === parent.id)) {
            currentNode = parent;
        } else {
            currentNode = undefined; // Reached root
        }
    }

    // Step 2: Traverse forwards from root following selected paths
    const traverse = (node: NodeType) => {
        // Add current node's lessons as a section
        if (node.lessonPath && node.lessonPath.length > 0) {
            sections.push({
                node,
                lessons: node.lessonPath,
            });
        }

        // Get next nodes
        const nextNodeIds = node.links || [];
        const nextNodes = nextNodeIds
            .map(id => dynamicNodes.find(n => n.id === id))
            .filter(Boolean) as NodeType[];

        if (nextNodes.length > 0) {
            // Add path options
            pathOptions.push({
                nodeId: node.id,
                nodes: nextNodes,
            });

            // Determine which path to follow
            let selectedNode: NodeType | undefined;

            if (selectedPaths[node.id]) {
                // Use user's selection
                selectedNode = nextNodes.find(n => n.id === selectedPaths[node.id]);
            } else {
                // Check if we're on the path to startNode
                const nodeIndexInPath = pathToRoot.findIndex(n => n.id === node.id);
                if (nodeIndexInPath !== -1 && nodeIndexInPath < pathToRoot.length - 1) {
                    // We're on the path to startNode, follow it
                    const nextInPath = pathToRoot[nodeIndexInPath + 1];
                    selectedNode = nextNodes.find(n => n.id === nextInPath?.id);
                }
                // else: not on path and no selection -> stop here
            }

            // Continue traversing only if a path was selected
            if (selectedNode) {
                traverse(selectedNode);
            }
        }
    };

    // Start from root
    if (pathToRoot.length > 0) {
        traverse(pathToRoot[0]);
    }

    return { sections, pathOptions };
};

// Get selected paths from localStorage
const getSelectedPaths = (): Record<string, string> => {
    try {
        return JSON.parse(localStorage.getItem("selected_paths") || "{}");
    } catch {
        return {};
    }
};

// Save selected path
const saveSelectedPath = (parentNodeId: string, selectedNodeId: string) => {
    const paths = getSelectedPaths();
    paths[parentNodeId] = selectedNodeId;
    localStorage.setItem("selected_paths", JSON.stringify(paths));
};

// --- Dock button ---

const DockBtn: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
    danger?: boolean;
}> = ({ icon, label, onClick, active, danger }) => (
    <button
        onClick={onClick}
        title={label}
        style={{
            width: 40,
            height: 40,
            background: active
                ? danger ? "rgba(239,68,68,0.12)" : "rgba(165,180,252,0.12)"
                : "none",
            border: `1px solid ${active
                ? danger ? "rgba(239,68,68,0.3)" : "rgba(165,180,252,0.25)"
                : "transparent"}`,
            borderRadius: 10,
            color: active
                ? danger ? "#ef4444" : "#a5b4fc"
                : "#484f58",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 16,
            transition: "all 0.15s ease",
            flexShrink: 0,
        }}
    >
        {icon}
    </button>
);

const Divider = () => (
    <div style={{
        width: 24,
        height: 1,
        background: "#21262d",
        margin: "2px 0",
    }} />
);

// --- Icons ---

const BackIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
);

const SettingsIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

// --- Component ---

export const NodePage: React.FC = () => {
    const { nodeId } = useParams<{ nodeId: string }>();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const scrollToLessonId = searchParams.get('lesson');

    const node = initialNodes.find(n => n.id === nodeId);

    // State to track scroll target - set once, then clear after scroll
    const [scrollTarget, setScrollTarget] = useState<string | undefined>(undefined);

    // Set scroll target when navigating to a new node or when lesson param changes
    useEffect(() => {
        const target = scrollToLessonId || node?.lessonPath?.[0]?.id;
        if (target) {
            setScrollTarget(target);
        }
    }, [nodeId, scrollToLessonId]);

    // Clear both URL param and scroll target after use
    useEffect(() => {
        if (scrollTarget) {
            const timeoutId = setTimeout(() => {
                setSearchParams({}, { replace: true });
                setScrollTarget(undefined); // Clear the scroll target
            }, 800); // Slightly longer to ensure scroll completes
            return () => clearTimeout(timeoutId);
        }
    }, [scrollTarget, setSearchParams]);

    const parent = node ? findParent(node.id) : null;

    const [selectedPaths, setSelectedPaths] = useState<Record<string, string>>(getSelectedPaths());

    // Auto-select path to current node when coming from graph (no lesson param)
    useEffect(() => {
        if (!node || scrollToLessonId) return; // Only when no explicit lesson (coming from graph)

        // Build path from root to this node
        const pathToNode: NodeType[] = [];
        let currentNode: NodeType | undefined = node;

        while (currentNode) {
            pathToNode.unshift(currentNode);
            const parent = findParent(currentNode.id);
            if (parent && !pathToNode.some(n => n.id === parent.id)) {
                currentNode = parent;
            } else {
                currentNode = undefined;
            }
        }

        // Auto-select each step in the path
        const newSelections: Record<string, string> = { ...getSelectedPaths() };
        let hasChanges = false;

        for (let i = 0; i < pathToNode.length - 1; i++) {
            const parent = pathToNode[i];
            const child = pathToNode[i + 1];

            // If this selection doesn't exist or is different, set it
            if (newSelections[parent.id] !== child.id) {
                newSelections[parent.id] = child.id;
                saveSelectedPath(parent.id, child.id);
                hasChanges = true;
            }
        }

        if (hasChanges) {
            setSelectedPaths(newSelections);
            setRefreshKey(k => k + 1); // Force rebuild
        }
    }, [nodeId, scrollToLessonId, node]);
    const [activeLesson, setActiveLesson] = useState<{ node: NodeType; lesson: Lesson; index: number } | null>(null);
    const [strengthenOpen, setStrengthenOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Build path tree whenever node or selectedPaths change
    const { sections, pathOptions } = node
        ? buildPathTree(node, selectedPaths)
        : { sections: [], pathOptions: [] };

    // Handle path selection
    const handlePathSelect = (parentNodeId: string, selectedNodeId: string) => {
        saveSelectedPath(parentNodeId, selectedNodeId);
        setSelectedPaths(prev => ({ ...prev, [parentNodeId]: selectedNodeId }));
        setRefreshKey(k => k + 1);
    };

    // --- Not found ---
    if (!node) return (
        <div style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0b0f14",
            color: "#484f58",
            fontSize: 14,
            gap: 8,
        }}>
            Nœud introuvable.
            <span
                onClick={() => navigate("/demoHome")}
                style={{ color: "#a5b4fc", cursor: "pointer" }}
            >
                Retour
            </span>
        </div>
    );

    // --------
    return (
        <div style={{
            height: "100vh",
            background: "#0b0f14",
            display: "flex",
            overflow: "hidden",
            position: "relative",
        }}>

            {/* --- Left dock (desktop) --- */}
            <div
                className="hidden sm:flex flex-col items-center shrink-0 border-r border-[#21262d] bg-[#161b22] py-3 gap-1"
                style={{ width: 56 }}
            >
                {/* back to graph */}
                <DockBtn
                    icon={<BackIcon />}
                    label="Retour au graphe"
                    onClick={() => navigate("/demoHome")}
                />

                <Divider />

                {/* profile */}
                <DockBtn
                    icon="🧠"
                    label="Profil"
                    onClick={() => setProfileOpen(true)}
                    active={profileOpen}
                />

                {/* strengthen this node only */}
                <DockBtn
                    icon="💪"
                    label="S'entraîner sur ce parcours"
                    onClick={() => setStrengthenOpen(true)}
                    active={strengthenOpen}
                />

                <Divider />

                {/* path settings */}
                <DockBtn
                    icon={<SettingsIcon />}
                    label="Paramètres du parcours"
                    onClick={() => setSettingsOpen(v => !v)}
                    active={settingsOpen}
                />
            </div>

            {/* --- Main content --- */}
            <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>

                {/* mobile top bar */}
                <div
                    className="flex sm:hidden items-center gap-2 px-3 border-b border-[#21262d] bg-[rgba(13,17,23,0.96)] shrink-0"
                    style={{ height: 48 }}
                >
                    <button
                        onClick={() => navigate("/demoHome")}
                        style={{
                            background: "#21262d",
                            border: "1px solid #30363d",
                            borderRadius: 8,
                            padding: "5px 10px",
                            color: "#8b949e",
                            fontSize: 12,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                        }}
                    >
                        <BackIcon />
                        Graph
                    </button>
                    <span style={{
                        flex: 1,
                        textAlign: "center",
                        color: "#c9d1d9",
                        fontSize: 13,
                        fontWeight: 500,
                    }}>
                        {parent ? `${parent.title} — ` : ""}{node.title}
                    </span>
                    <button
                        onClick={() => setSettingsOpen(v => !v)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#484f58",
                            cursor: "pointer",
                            padding: 4,
                        }}
                    >
                        <SettingsIcon />
                    </button>
                </div>

                {/* Honeycomb path - scrollable */}
                <div
                    ref={scrollContainerRef}
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#21262d transparent",
                    }}
                >
                    <HoneycombPath
                        key={refreshKey}
                        sections={sections}
                        currentNodeId={node.id}
                        scrollToLesson={scrollTarget}
                        scrollContainerRef={scrollContainerRef as React.RefObject<HTMLDivElement>}
                        onLessonClick={(node, lesson, index) => setActiveLesson({ node, lesson, index })}
                        onPathSelect={(selectedNodeId) => {
                            // Find which parent node this selection belongs to
                            const parentOpt = pathOptions.find(opt =>
                                opt.nodes.some(n => n.id === selectedNodeId)
                            );
                            if (parentOpt) {
                                handlePathSelect(parentOpt.nodeId, selectedNodeId);
                            }
                        }}
                        pathOptions={pathOptions}
                        selectedPaths={selectedPaths}
                    />
                </div>
            </div>

            {/* --- Overlays --- */}

            {/* path settings overlay */}
            {settingsOpen && (
                <div
                    onClick={() => setSettingsOpen(false)}
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 60,
                        background: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            width: "min(380px, 92vw)",
                            background: "#161b22",
                            border: "1px solid #30363d",
                            borderRadius: 14,
                            overflow: "hidden",
                            boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
                        }}
                    >
                        <NodePathSettings
                            node={node}
                            onClose={() => setSettingsOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* lesson player */}
            {activeLesson && (
                <LessonPlayer
                    node={activeLesson.node}
                    lesson={activeLesson.lesson}
                    lessonIndex={activeLesson.index}
                    onComplete={() => {
                        setActiveLesson(null);
                        setRefreshKey(k => k + 1);
                    }}
                    onClose={() => setActiveLesson(null)}
                />
            )}

            {/* strengthen */}
            {strengthenOpen && (
                <StrengthenSession
                    nodeId={node.id}
                    onClose={() => {
                        setStrengthenOpen(false);
                        setRefreshKey(k => k + 1);
                    }}
                />
            )}

            {/* profile */}
            {profileOpen && (
                <ProfileView
                    onClose={() => setProfileOpen(false)}
                    onNavigate={(id) => {
                        setProfileOpen(false);
                        navigate(`/demo/node/${id}`);
                    }}
                    onOpenStrengthen={() => {
                        setProfileOpen(false);
                        setStrengthenOpen(true);
                    }}
                />
            )}
        </div>
    );
};