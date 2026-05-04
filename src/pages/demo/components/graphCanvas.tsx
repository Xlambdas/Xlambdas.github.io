import { useEffect, useRef, useCallback } from "react";
import { type NodeDef, EDGES, GROUP_CONFIG, ADJACENCY } from "../data/graphData";
import { type SimNode, initPositions, tick } from "../helpers/simulation";
import { registerGraphControls } from "../helpers/windowControls";
import { NODES } from "../data/graphData";

interface GraphCanvasProps {
    selectedNode: NodeDef | null;
    onSelectNode: (node: NodeDef | null) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({ selectedNode, onSelectNode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nodesRef = useRef<SimNode[]>(initPositions(NODES));
    const stateRef = useRef({ tx: 0, ty: 0, scale: 1 });
    const inputRef = useRef({ dragging: false, dragStart: { x: 0, y: 0 }, hovered: null as SimNode | null });
    const frameRef = useRef(0);
    const rafRef = useRef<number>(0);
    const selRef = useRef<NodeDef | null>(selectedNode);
    selRef.current = selectedNode;

    useEffect(() => {
        const resize = () => {
            const c = canvasRef.current;
            if (!c) return;
            c.width = c.offsetWidth; c.height = c.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        const draw = () => {
            const c = canvasRef.current;
            if (!c) return;
            const ctx = c.getContext("2d")!;
            const W = c.offsetWidth, H = c.offsetHeight;
            const { tx, ty, scale } = stateRef.current;
            const nodes = nodesRef.current;
            const sel = selRef.current;
            const hov = inputRef.current.hovered;
            const selAdj = sel ? new Set(ADJACENCY.get(sel.id) ?? []) : null;

            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, W, H);
            ctx.save();
            ctx.translate(tx + W / 2, ty + H / 2);
            ctx.scale(scale, scale);

            for (const [s, t] of EDGES) {
                const a = nodes.find(n => n.id === s), b = nodes.find(n => n.id === t);
                if (!a || !b) continue;
                const hi = sel && (sel.id === s || sel.id === t);
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = hi ? "rgba(124,106,247,0.5)" : "rgba(255,255,255,0.065)";
                ctx.lineWidth = hi ? 1.3 / scale : 0.7 / scale;
                ctx.stroke();
            }

            for (const n of nodes) {
                const cfg = GROUP_CONFIG[n.group];
                const isH = hov?.id === n.id, isS = sel?.id === n.id;
                const fade = sel && !isS && !selAdj?.has(n.id);
                const r = (cfg.size * (isS ? 1.65 : isH ? 1.35 : 1)) / scale;
                ctx.globalAlpha = fade ? 0.2 : 1;
                ctx.shadowBlur = isS ? 24 : isH ? 16 : 9;
                ctx.shadowColor = cfg.glow;
                ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                ctx.fillStyle = cfg.fill; ctx.fill();
                ctx.shadowBlur = 0;
                if (scale > 0.45 || isH || isS) {
                    const fs = Math.max(9, 10 / scale);
                    ctx.font = `${isS ? "500 " : ""}${fs}px -apple-system,sans-serif`;
                    ctx.fillStyle = isH || isS ? "rgba(201,209,217,0.95)" : "rgba(201,209,217,0.42)";
                    ctx.textAlign = "center";
                    ctx.fillText(n.label, n.x, n.y + r + 12 / scale);
                }
                ctx.globalAlpha = 1;
            }
            ctx.restore();
        };

        const loop = () => {
            if (frameRef.current < 260) tick(nodesRef.current);
            frameRef.current++;
            draw();
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    useEffect(() => registerGraphControls(stateRef, nodesRef), []);

    const getNodeAt = useCallback((cx: number, cy: number): SimNode | null => {
        const c = canvasRef.current;
        if (!c) return null;
        const { tx, ty, scale } = stateRef.current;
        const W = c.offsetWidth, H = c.offsetHeight;
        const wx = (cx - (tx + W / 2)) / scale, wy = (cy - (ty + H / 2)) / scale;
        for (const n of nodesRef.current) {
            const cfg = GROUP_CONFIG[n.group];
            if (Math.sqrt((n.x - wx) ** 2 + (n.y - wy) ** 2) < cfg.size * 2.4) return n;
        }
        return null;
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const r = canvasRef.current?.getBoundingClientRect();
        if (!r) return;
        if (inputRef.current.dragging) {
            stateRef.current.tx += e.clientX - inputRef.current.dragStart.x;
            stateRef.current.ty += e.clientY - inputRef.current.dragStart.y;
            inputRef.current.dragStart = { x: e.clientX, y: e.clientY };
        } else {
            inputRef.current.hovered = getNodeAt(e.clientX - r.left, e.clientY - r.top);
            if (canvasRef.current)
                canvasRef.current.style.cursor = inputRef.current.hovered ? "pointer" : "grab";
        }
    }, [getNodeAt]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const r = canvasRef.current?.getBoundingClientRect();
        if (!r) return;
        if (!getNodeAt(e.clientX - r.left, e.clientY - r.top)) {
            inputRef.current.dragging = true;
            inputRef.current.dragStart = { x: e.clientX, y: e.clientY };
            if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }
    }, [getNodeAt]);

    const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const r = canvasRef.current?.getBoundingClientRect();
        if (!r) return;
        if (!inputRef.current.dragging)
            onSelectNode(getNodeAt(e.clientX - r.left, e.clientY - r.top) ?? null);
        inputRef.current.dragging = false;
        if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    }, [getNodeAt, onSelectNode]);

    const handleWheel = useCallback((e: WheelEvent) => {
        e.preventDefault();
        stateRef.current.scale = Math.max(0.15, Math.min(6, stateRef.current.scale * (1 + -e.deltaY * 0.001)));
    }, []);

    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;
        c.addEventListener("wheel", handleWheel, { passive: false });
        return () => c.removeEventListener("wheel", handleWheel);
    }, [handleWheel]);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", display: "block", cursor: "grab" }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { inputRef.current.dragging = false; inputRef.current.hovered = null; }}
        />
    );
};