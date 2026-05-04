import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type NodeType = {
    id: string;
    title: string;
    type: "main" | "folder" | "file";
    links: string[];
    isUnlocked: boolean;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
};

type LinkType = {
    source: string | NodeType;
    target: string | NodeType;
};

const DemoGraph: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    let selectedNode: NodeType | null = null;
    let draggingNode: NodeType | null = null;

    useEffect(() => {
        let isNodeDrag = false;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        let width = window.innerWidth;
        let height = window.innerHeight;

        // 🔹 DPI scaling (fix blurry / oval nodes)
        function setCanvasSize() {
            const ratio = window.devicePixelRatio || 1;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        }

        setCanvasSize();

        // 🔹 Data
        const nodes: NodeType[] = [
            { id: "A", title: "Home", type: "main", links: ["B", "C"], isUnlocked: true },
            { id: "B", title: "Projects", type: "folder", links: ["D"], isUnlocked: true },
            { id: "C", title: "Notes", type: "folder", links: ["E"], isUnlocked: false },
            { id: "D", title: "Graph", type: "file", links: [], isUnlocked: true },
            { id: "E", title: "Ideas", type: "file", links: ["F"], isUnlocked: false },
            { id: "F", title: "Todo", type: "file", links: [], isUnlocked: false },
        ];

        const links: LinkType[] = nodes.flatMap(n =>
            n.links.map(target => ({
                source: n.id,
                target
            }))
        );

        // 🔹 Simulation
        const simulation = d3
            .forceSimulation(nodes)
            .force(
                "link",
                d3
                    .forceLink<NodeType, LinkType>(links)
                    .id((d) => d.id)
                    .distance(80)
                    .strength(1)
            )
            .force("charge", d3.forceManyBody().strength(-250))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .alphaDecay(0.03);

        // 🔹 Zoom state
        let transform = d3.zoomIdentity;

        // function isDraggingNode(event: any) {
        //     const [mx, my] = transform.invert(d3.pointer(event));
        //     return simulation.find(mx, my, 10);
        // }

        let isPointerDownOnNode = false;

        canvas.addEventListener("mousedown", (event) => {
            const [mx, my] = transform.invert(d3.pointer(event));
            const found = simulation.find(mx, my, 10);
            isPointerDownOnNode = !!found;
        });
        canvas.addEventListener("click", (event) => {
            const [mx, my] = d3.pointer(event);
            const [x, y] = transform.invert([mx, my]);

            const node = simulation.find(x, y, 10);

            selectedNode = node || null;
            draw();
        });
        canvas.addEventListener("mouseup", () => {
            isPointerDownOnNode = false;
        });

        const zoom = d3
            .zoom<HTMLCanvasElement, unknown>()
            .scaleExtent([0.2, 4])
            .filter((event) => {
                if (event.type === "mousedown" && isPointerDownOnNode) {
                    return false;
                }

                return true;
            })
            .on("zoom", (event) => {
                transform = event.transform;
                draw();
            });

        d3.select(canvas).call(zoom as any);

        // 🔹 Hover detection
        // let hoveredNode: NodeType | null = null;

        canvas.addEventListener("mousemove", () => { // (event) => {
            // const [mx, my] = d3.pointer(event);
            // const [x, y] = transform.invert([mx, my]);
            // hoveredNode = simulation.find(x, y, 10) || null;
            draw();
        });

        // const isDimmed = selectedNode !== null;

        // 🔹 Draw
        function draw() {
            const isSelected = (n: NodeType) => selectedNode?.id === n.id;
            // const isNeighbor = (n: NodeType) =>
            //     selectedNode?.links.includes(n.id) || false;
            ctx.save();
            ctx.clearRect(0, 0, width, height);

            ctx.translate(transform.x, transform.y);
            ctx.scale(transform.k, transform.k);

            // links
            ctx.strokeStyle = "#555";
            ctx.globalAlpha = 0.6;
            links.forEach((l) => {
                const sNode = l.source as NodeType;
                const tNode = l.target as NodeType;

                const sourceLocked = !sNode.isUnlocked;
                const targetLocked = !tNode.isUnlocked;

                const lockedLink = sourceLocked || targetLocked;

                const isActive =
                    selectedNode &&
                    (sNode.id === selectedNode.id || tNode.id === selectedNode.id);

                ctx.beginPath();
                ctx.moveTo(sNode.x!, sNode.y!);
                ctx.lineTo(tNode.x!, tNode.y!);

                // style
                ctx.strokeStyle = lockedLink
                    ? "rgba(148, 163, 184, 0.25)" // muted gray
                    : isActive
                        ? "rgba(255, 200, 120, 0.9)"
                        : "rgba(120, 120, 120, 0.35)";

                if (lockedLink) {
                    ctx.setLineDash([2, 6]); // dotted effect
                } else if (isActive) {
                    ctx.setLineDash([]); // solid strong
                    ctx.lineWidth = 2;
                } else {
                    ctx.setLineDash([]); // normal solid
                    ctx.lineWidth = 1;
                        }

                ctx.stroke();
                ctx.setLineDash([]);
            });

            // nodes
            nodes.forEach((n) => {
                // const selected = isSelected(n);
                // const neighbor = isNeighbor(n);

                let radius = 5;
                const locked = !n.isUnlocked;

                if (n.type === "main") radius = 8;
                if (n.type === "folder") radius = 6;

                if (selectedNode?.id === n.id) radius = 9;
                if (draggingNode?.id === n.id) radius = 10;

                // subtle color system

                let color = "#6b7280";

                if (n.type === "main") color = "#ffffff";
                if (n.type === "folder") color = "#a5b4fc";
                if (n.type === "file") color = "#94a3b8";

                if (selectedNode?.id === n.id) {
                    color = "#fbbf24";
                }

                if (draggingNode?.id === n.id) {
                    color = "#fb923c";
                }

                // locked override
                if (locked) {
                    color = "#4b5563";
                }

                ctx.beginPath();
                ctx.arc(n.x!, n.y!, radius, 0, Math.PI * 2);

                // if (!selectedNode) {
                //     // idle state
                //     ctx.globalAlpha = locked ? 0.35 : 1;
                // } else {
                //     ctx.globalAlpha = selected || neighbor ? 1 : 0.25;
                // }

                ctx.fillStyle = color;

                ctx.shadowBlur =
                    draggingNode?.id === n.id
                        ? 18
                        : selectedNode?.id === n.id
                            ? 12
                            : 3;

                ctx.shadowColor = ctx.fillStyle;

                ctx.fill();

                // if (locked) {
                //     ctx.save();

                //     ctx.beginPath();
                //     ctx.arc(n.x!, n.y!, radius, 0, Math.PI * 2);
                //     ctx.clip();

                //     ctx.strokeStyle = "rgba(255,255,255,0.15)";
                //     ctx.lineWidth = 2;

                //     for (let i = -radius; i < radius; i += 4) {
                //         ctx.beginPath();
                //         ctx.moveTo(n.x! - radius, n.y! + i);
                //         ctx.lineTo(n.x! + radius, n.y! + i + 6);
                //         ctx.stroke();
                //     }

                //     ctx.restore();
                // }
                // ctx.shadowBlur = 0;
                ctx.globalAlpha = 1;
            });

            // labels (fade based on zoom)
            if (transform.k > 0.5) {
                ctx.fillStyle = "#aaa";
                ctx.font = "12px sans-serif";
                nodes.forEach((n) => {
                    ctx.globalAlpha =
                        selectedNode && !isSelected(n) ? 0.3 : 0.8;

                    ctx.fillStyle = "#cbd5e1";
                    ctx.font = "12px sans-serif";

                    ctx.fillText(n.title, n.x! + 8, n.y! + 4);
                });
            }

            ctx.restore();
        }

        simulation.on("tick", draw);
        // let draggingNode = false;

        // 🔹 Drag
        const drag = d3
            .drag<HTMLCanvasElement, unknown>()
            .subject((event) => {
                const [mx, my] = transform.invert(d3.pointer(event));
                return simulation.find(mx, my, 10);
            })
            .on("start", (event) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();

                draggingNode = event.subject;

                isNodeDrag = !!event.subject;

                if (event.subject) {
                    event.subject.fx = event.subject.x;
                    event.subject.fy = event.subject.y;
                }
            })
            .on("drag", (event) => {
                if (isNodeDrag) {
                    const [mx, my] = d3.pointer(event.sourceEvent, canvas);

                    const [x, y] = transform.invert([mx, my]);

                    event.subject.fx = x;
                    event.subject.fy = y;
                }
            })
            .on("end", (event) => {
                if (!event.active) simulation.alphaTarget(0);

                if (event.subject) {
                    event.subject.fx = null;
                    event.subject.fy = null;
                }

                draggingNode = null;
                isNodeDrag = false;
            })

        d3.select(canvas).call(drag as any);

        // 🔹 Resize handling (THIS fixes your issue)
        function handleResize() {
            width = window.innerWidth;
            height = window.innerHeight;

            setCanvasSize();

            simulation.force("center", d3.forceCenter(width / 2, height / 2));
            simulation.alpha(1).restart();
        }

        window.addEventListener("resize", handleResize);

        return () => {
            simulation.stop();
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: "block",
                background: "#0b0f14",
            }}
        />
    );
};

export default DemoGraph;