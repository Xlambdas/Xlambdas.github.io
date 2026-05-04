import { type NodeDef, EDGES } from "../data/graphData";

export interface SimNode extends NodeDef {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export function initPositions(nodes: NodeDef[]): SimNode[] {
    return nodes.map(n => {
        const angle = Math.random() * Math.PI * 2;
        const r = 80 + Math.random() * 220;
        return { ...n, x: Math.cos(angle) * r, y: Math.sin(angle) * r, vx: 0, vy: 0 };
    });
}

export function tick(nodes: SimNode[]): void {
    const alpha = 0.28, rep = 2800, spring = 0.04, restLen = 100, centerG = 0.005, damp = 0.82;

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j];
            const dx = b.x - a.x, dy = b.y - a.y;
            const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
            const f = (rep / (dist * dist)) * alpha;
            const fx = (dx / dist) * f, fy = (dy / dist) * f;
            a.vx -= fx; a.vy -= fy;
            b.vx += fx; b.vy += fy;
        }
    }

    for (const [s, t] of EDGES) {
        const a = nodes.find(n => n.id === s);
        const b = nodes.find(n => n.id === t);
        if (!a || !b) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const f = (dist - restLen) * spring;
        const fx = (dx / dist) * f, fy = (dy / dist) * f;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
    }

    for (const n of nodes) {
        n.vx -= n.x * centerG;
        n.vy -= n.y * centerG;
        n.vx *= damp;
        n.vy *= damp;
        n.x += n.vx;
        n.y += n.vy;
    }
}