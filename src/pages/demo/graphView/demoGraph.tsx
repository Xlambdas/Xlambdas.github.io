import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
    type NodeType,
    type LinkType,
    initialLinks,
    getVisibleIds,
    getDynamicNodes,
    getNodeCompletionPercent,
} from '../data/graphData';

// --- Constants ---

const NODE_RADIUS: Record<NodeType["type"], number> = {
    main: 8,
    folder: 6,
    file: 5,
};

const NODE_COLOR: Record<NodeType["type"], string> = {
    main: "#ffffff",
    folder: "#a5b4fc",
    file: "#94a3b8",
};

const LOCKED_COLOR = "#4b5563";
const SELECTED_COLOR = "#fbbf24";
const DRAGGING_COLOR = "#fb923c";
const PULSE_DURATION = 2000;

// Get branch color for a node
const getBranchColor = (n: NodeType): string => {
    // Use branchColor from node data if available
    if ((n as any).branchColor) return (n as any).branchColor;

    return NODE_COLOR[n.type] ?? "#6b7280";
};

// Get profile banner color from localStorage
const getProfileBannerColor = (): string => {
    return localStorage.getItem("profile_banner_color") || "#7c6af7";
};

// --- Helpers ---

const isProfile = (n: NodeType) => (n as any).kind === "profile";

const getColor = (
    n: NodeType,
    selectedNode: NodeType | null,
    draggingNode: NodeType | null,
): string => {
    if (isProfile(n)) {
        if (draggingNode?.id === n.id) return DRAGGING_COLOR;
        if (selectedNode?.id === n.id) return "#a39af7";
        return getProfileBannerColor();
    }
    if (!n.isUnlocked) return LOCKED_COLOR;
    if (draggingNode?.id === n.id) return DRAGGING_COLOR;
    if (selectedNode?.id === n.id) return SELECTED_COLOR;

    // Use branch color instead of default node color
    return getBranchColor(n);
};

const getRadius = (
    n: NodeType,
    selectedNode: NodeType | null,
    draggingNode: NodeType | null,
): number => {
    // Profile node
    if (isProfile(n)) {
        if (draggingNode?.id === n.id) return 16;
        if (selectedNode?.id === n.id) return 14;
        return 12;
    }

    // Get completion percentage
    const pct = getNodeCompletionPercent(n.id);

    // Started or completed nodes are bigger (hexagons)
    if (pct > 0) {
        if (draggingNode?.id === n.id) return 12;
        if (selectedNode?.id === n.id) return 11;
        return 10;
    }

    if (draggingNode?.id === n.id) return NODE_RADIUS[n.type] + 4;
    if (selectedNode?.id === n.id) return NODE_RADIUS[n.type] + 2;
    return NODE_RADIUS[n.type] ?? 6;
};

// Draw profile node with double hexagon border
const drawProfileNode = (
    ctx: CanvasRenderingContext2D,
    n: NodeType,
    radius: number,
    color: string,
) => {
    const bgColor = "#0b0f14"; // Graph background color

    // Outer hexagon (banner color)
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = n.x! + radius * Math.cos(angle);
        const py = n.y! + radius * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Middle ring (background color)
    const midRadius = radius * 0.85;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = n.x! + midRadius * Math.cos(angle);
        const py = n.y! + midRadius * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = bgColor;
    ctx.fill();

    // Inner hexagon (banner color again)
    const innerRadius = radius * 0.65;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = n.x! + innerRadius * Math.cos(angle);
        const py = n.y! + innerRadius * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0;
};

// --- Props ---

interface DemoGraphProps {
    onSelectNode?: (node: NodeType | null) => void;
    refreshKey?: number;
    newlyUnlockedIds?: string[];
}

// --- Component ---

const DemoGraph: React.FC<DemoGraphProps> = ({
    onSelectNode,
    refreshKey = 0,
    newlyUnlockedIds = [],
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const onSelectNodeRef = useRef(onSelectNode);
    useEffect(() => { onSelectNodeRef.current = onSelectNode; }, [onSelectNode]);

    // mutable references shared between d3 handlers and draw()
    const selectedNodeRef = useRef<NodeType | null>(null);
    const draggingNodeRef = useRef<NodeType | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        let width = canvas.parentElement?.clientWidth ?? window.innerWidth;
        let height = canvas.parentElement?.clientHeight ?? window.innerHeight;

        // --- DPI scaling ---
        const setCanvasSize = () => {
            const ratio = window.devicePixelRatio || 1;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        };
        setCanvasSize();

        // --- Data ---
        const nodes: NodeType[] = getDynamicNodes().map(n => ({ ...n }));
        const links: LinkType[] = initialLinks.map(l => ({ ...l }));
        const visibleIds = getVisibleIds(nodes);

        const visibleNodes = nodes.filter(n => visibleIds.has(n.id));
        const visibleLinks = links.filter(l => {
            const sId = typeof l.source === "string" ? l.source : (l.source as NodeType).id;
            const tId = typeof l.target === "string" ? l.target : (l.target as NodeType).id;
            return visibleIds.has(sId) && visibleIds.has(tId);
        });

        // --- Pulse ---
        const pulseNodes = new Set<string>(newlyUnlockedIds);
        const pulseStart = performance.now();

        // --- Search ---
        let searchFilter = "";
        window.__graphSearch = (query) => { searchFilter = query.toLowerCase(); draw(); };

        // --- Simulation ---
        const simulation = d3
            .forceSimulation(visibleNodes)
            .force("link", d3.forceLink<NodeType, LinkType>(visibleLinks)
                .id(d => d.id).distance(80).strength(1))
            .force("charge", d3.forceManyBody().strength(-250))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .alphaDecay(0.03);

        // --- Zoom ---
        let transform = d3.zoomIdentity;

        let isPointerDownOnNode = false;

        canvas.addEventListener("mousedown", event => {
            isPointerDownOnNode = !!simulation.find(...toWorld(event), 10);
        });

        const zoom = d3.zoom<HTMLCanvasElement, unknown>()
            .scaleExtent([0.2, 4])
            .filter(event => {
                if (event.type === "mousedown" && isPointerDownOnNode) return false;
                return true;
            })
            .on("zoom", event => { transform = event.transform; draw(); });

        d3.select(canvas).call(zoom as any);

        const toWorld = (event: MouseEvent): [number, number] => {
            const [mx, my] = d3.pointer(event);
            return transform.invert([mx, my]) as [number, number];
        };

        canvas.addEventListener("mousedown", event => {
            isPointerDownOnNode = !!simulation.find(...toWorld(event), 10);
        });
        canvas.addEventListener("mouseup", () => {
            isPointerDownOnNode = false;
        });
        canvas.addEventListener("click", event => {
            const node = simulation.find(...toWorld(event), 10) ?? null;
            selectedNodeRef.current = node;
            onSelectNodeRef.current?.(node);
            draw();
        });
        canvas.addEventListener("mousemove", () => draw());

        // --- Draw ---
        function draw() {
            const selected = selectedNodeRef.current;
            const dragging = draggingNodeRef.current;
            const isSelected = (n: NodeType) => selected?.id === n.id;

            ctx.save();
            ctx.clearRect(0, 0, width, height);
            ctx.translate(transform.x, transform.y);
            ctx.scale(transform.k, transform.k);

            // links
            visibleLinks.forEach(l => {
                const s = l.source as NodeType;
                const t = l.target as NodeType;
                const locked = !s.isUnlocked || !t.isUnlocked;
                const dragging_ = dragging && (s.id === dragging.id || t.id === dragging.id);
                const active = selected && (s.id === selected.id || t.id === selected.id);

                // Check if connected to profile and if node is completed
                const sourceIsProfile = isProfile(s);
                const targetIsProfile = isProfile(t);
                const connectedToProfile = sourceIsProfile || targetIsProfile;

                // Get the non-profile node
                const otherNode = sourceIsProfile ? t : s;
                const otherNodeCompleted = !isProfile(otherNode) && getNodeCompletionPercent(otherNode.id) === 100;

                // Check if both nodes are completed (for non-profile links)
                const sourceCompleted = !isProfile(s) && getNodeCompletionPercent(s.id) === 100;
                const targetCompleted = !isProfile(t) && getNodeCompletionPercent(t.id) === 100;
                const bothCompleted = sourceCompleted && targetCompleted;

                // Special case: profile link with completed node
                const isProfileLinkCompleted = connectedToProfile && otherNodeCompleted;

                // Get branch color for the link
                const branchColor = getBranchColor(sourceIsProfile ? t : s);
                const profileColor = getProfileBannerColor();

                ctx.beginPath();
                ctx.moveTo(s.x!, s.y!);
                ctx.lineTo(t.x!, t.y!);

                // Determine line appearance
                if (locked) {
                    ctx.strokeStyle = "rgba(148,163,184,0.25)";
                    ctx.lineWidth = 1;
                    ctx.globalAlpha = 0.6;
                } else if (dragging_) {
                    ctx.strokeStyle = "rgba(251,146,60,0.9)";
                    ctx.lineWidth = 2;
                    ctx.globalAlpha = 0.8;
                } else if (active) {
                    ctx.strokeStyle = "rgba(255,200,120,0.9)";
                    ctx.lineWidth = 2;
                    ctx.globalAlpha = 0.8;
                } else if (isProfileLinkCompleted) {
                    // Profile link with completed node - bigger and cleaner
                    ctx.strokeStyle = profileColor;
                    ctx.lineWidth = 4;
                    ctx.globalAlpha = 0.9;
                } else if (connectedToProfile) {
                    // Normal profile link
                    ctx.strokeStyle = `${profileColor}44`;
                    ctx.lineWidth = 1.5;
                    ctx.globalAlpha = 0.5;
                } else if (bothCompleted) {
                    // Both nodes completed (non-profile)
                    ctx.strokeStyle = branchColor;
                    ctx.lineWidth = 3;
                    ctx.globalAlpha = 0.8;
                } else {
                    // Default link
                    ctx.strokeStyle = `${branchColor}33`;
                    ctx.lineWidth = 1;
                    ctx.globalAlpha = 0.6;
                }

                ctx.setLineDash(locked ? [2, 6] : []);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.lineWidth = 1;
                ctx.globalAlpha = 1;
            });

            // nodes
            visibleNodes.forEach(n => {
                const color = getColor(n, selected, dragging);
                const radius = getRadius(n, selected, dragging);
                const dimmed = !!searchFilter && !n.title.toLowerCase().includes(searchFilter);
                const pct = isProfile(n) ? 0 : getNodeCompletionPercent(n.id);

                // Profile node gets special double-hexagon rendering
                if (isProfile(n)) {
                    ctx.globalAlpha = dimmed ? 0.15 : 1;
                    drawProfileNode(ctx, n, radius, color);
                    ctx.globalAlpha = 1;
                } else {
                    // Draw hexagon if started or completed, circle if not started
                    if (pct > 0) {
                        // Hexagon shape
                        ctx.beginPath();
                        for (let i = 0; i < 6; i++) {
                            const angle = (Math.PI / 3) * i - Math.PI / 6;
                            const px = n.x! + radius * Math.cos(angle);
                            const py = n.y! + radius * Math.sin(angle);
                            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                        }
                        ctx.closePath();
                    } else {
                        // Circle shape for not started
                        ctx.beginPath();
                        ctx.arc(n.x!, n.y!, radius, 0, Math.PI * 2);
                    }

                    // Node background - solid color for hexagons
                    if (pct === 100) {
                        // Completed - solid bright color
                        ctx.fillStyle = color;
                    } else if (pct > 0) {
                        // Started - solid color with slight transparency
                        ctx.fillStyle = `${color}dd`;
                    } else {
                        // Not started - dark background
                        ctx.fillStyle = "#1c2128";
                    }

                    ctx.shadowBlur = dragging?.id === n.id ? 18 : selected?.id === n.id ? 12 : 3;
                    ctx.shadowColor = color;
                    ctx.globalAlpha = dimmed ? 0.15 : 1;
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // Border
                    if (pct > 0) {
                        ctx.strokeStyle = "#0b0f14"; // Dark border for contrast
                        ctx.lineWidth = 1;
                    } else {
                        ctx.strokeStyle = "#30363d";
                        ctx.lineWidth = 0.5;
                    }
                    ctx.stroke();
                    ctx.lineWidth = 0.5;

                    // // Icon for completed nodes - clean checkmark
                    // if (pct === 100) {
                    //     const checkSize = radius * 0.6;
                    //     const checkX = n.x!;
                    //     const checkY = n.y!;

                    //     ctx.strokeStyle = "#0b0f14"; // Dark checkmark on bright background
                    //     ctx.lineWidth = radius * 0.25;
                    //     ctx.lineCap = "round";
                    //     ctx.lineJoin = "round";

                    //     // Draw clean checkmark path
                    //     ctx.beginPath();
                    //     ctx.moveTo(checkX - checkSize * 0.5, checkY);
                    //     ctx.lineTo(checkX - checkSize * 0.1, checkY + checkSize * 0.4);
                    //     ctx.lineTo(checkX + checkSize * 0.6, checkY - checkSize * 0.5);
                    //     ctx.stroke();

                    //     ctx.lineCap = "butt";
                    //     ctx.lineJoin = "miter";
                    //     ctx.lineWidth = 1;
                    // }
                }

                // pulse ring (newly unlocked)
                const age = performance.now() - pulseStart;
                if (pulseNodes.has(n.id) && age < PULSE_DURATION) {
                    const t2 = age / PULSE_DURATION;
                    ctx.beginPath();
                    ctx.arc(n.x!, n.y!, radius + t2 * 20, 0, Math.PI * 2);
                    ctx.strokeStyle = color;
                    ctx.globalAlpha = (1 - t2) * 0.6;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.lineWidth = 1;
                }

                ctx.globalAlpha = 1;
            });

            // labels
            if (transform.k > 0.5) {
                ctx.font = "12px sans-serif";
                ctx.textAlign = "center";

                visibleNodes.forEach(n => {
                    const dimmed = !!searchFilter && !n.title.toLowerCase().includes(searchFilter);
                    const radius = getRadius(n, selected, dragging);
                    ctx.globalAlpha = dimmed ? 0.15 : selected && !isSelected(n) ? 0.3 : 0.8;
                    ctx.fillStyle = "#cbd5e1";
                    ctx.fillText(n.title, n.x!, n.y! + radius + 12);
                });
            }

            ctx.restore();
        }

        simulation.on("tick", draw);

        // --- Drag ---
        const drag = d3.drag<HTMLCanvasElement, unknown>()
            .subject(event => {
                const [mx, my] = transform.invert(d3.pointer(event));
                return simulation.find(mx, my, 10);
            })
            .on("start", event => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                draggingNodeRef.current = event.subject ?? null;
                if (event.subject) {
                    event.subject.fx = event.subject.x;
                    event.subject.fy = event.subject.y;
                }
            })
            .on("drag", event => {
                if (!draggingNodeRef.current) return;
                const [x, y] = transform.invert(d3.pointer(event, canvas));
                event.subject.fx = x;
                event.subject.fy = y;
            })
            .on("end", event => {
                if (!event.active) simulation.alphaTarget(0);
                if (event.subject) {
                    event.subject.fx = null;
                    event.subject.fy = null;
                }
                draggingNodeRef.current = null;
            });

        d3.select(canvas).call(drag as any);

        // --- Window controls ---
        window.__graphZoom = factor => {
            const cx = width / 2;
            const cy = height / 2;
            transform = transform.translate(cx, cy).scale(factor).translate(-cx, -cy);
            draw();
        };

        window.__graphReset = () => {
            transform = d3.zoomIdentity;
            d3.select(canvas).call((zoom as any).transform, d3.zoomIdentity);
            simulation.alpha(1).restart();
            draw();
        };

        // --- Resize ---
        const handleResize = () => {
            width = canvas.parentElement?.clientWidth ?? window.innerWidth;
            height = canvas.parentElement?.clientHeight ?? window.innerHeight;
            setCanvasSize();
            simulation.force("center", d3.forceCenter(width / 2, height / 2));
            simulation.alpha(1).restart();
        };

        window.addEventListener("resize", handleResize);

        // --- Cleanup ---
        return () => {
            simulation.stop();
            window.removeEventListener("resize", handleResize);
            delete window.__graphZoom;
            delete window.__graphReset;
            delete window.__graphSearch;
        };
    }, [refreshKey]);

    return <canvas ref={canvasRef} className="block w-full h-full bg-[#0b0f14] touch-none" />;
};

export default DemoGraph;