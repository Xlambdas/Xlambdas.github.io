import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

import type { Lesson, NodeType } from "../types";
import { initialNodes } from "../data/graphData";
import { HoneycombPath } from "../components/ui/honeyCombPath";
import { NodePathSettings } from "../components/node/NodePathSettings";
import {
    getSelectedPaths,
    saveSelectedPath,
    findParent,
    shouldNavigateToHome,
    buildPathTree
} from "../helpers";
import {
    BackIcon,
    SettingsIcon,
} from "../constants";
import { Dock } from "../components/ui/dock";

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
    const [, setActiveLesson] = useState<{ node: NodeType; lesson: Lesson; index: number } | null>(null);
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

    // Handle back navigation
    const handleBack = () => {
        if (shouldNavigateToHome()) {
            navigate("/demoHome");
        } else {
            navigate(-1);
        }
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
                onClick={handleBack}
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

            <Dock
                items={[
                    { type: 'back', onClick: handleBack },
                    { type: 'divider' },
                    { type: 'profile' },
                    // { type: 'strengthen' },
                    { type: 'divider' },
                    { type: 'settings', onClick: () => setSettingsOpen(v => !v), active: settingsOpen },
                ]}
            />

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
        </div>
    );
};