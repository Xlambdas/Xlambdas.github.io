import {
    type NodeType,
    getNodeCompletionPercent,
} from '../data/graphData';
import {
    NODE_RADIUS,
    NODE_COLOR,
    LOCKED_COLOR,
    SELECTED_COLOR,
    DRAGGING_COLOR,
} from '../constants';

// Get branch color for a node
export const getBranchColor = (n: NodeType): string => {
    // Use branchColor from node data if available
    if ((n as any).branchColor) return (n as any).branchColor;

    return NODE_COLOR[n.type] ?? "#6b7280";
};

// Get profile banner color from localStorage
export const getProfileBannerColor = (): string => {
    return localStorage.getItem("profile_banner_color") || "#7c6af7";
};

// --- Helpers ---

export const isProfile = (n: NodeType) => (n as any).kind === "profile";

export const getColor = (
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

export const getRadius = (
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
export const drawProfileNode = (
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