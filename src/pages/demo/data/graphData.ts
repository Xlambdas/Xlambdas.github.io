export type NodeType = {
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

export type LinkType = {
    source: string | NodeType;
    target: string | NodeType;
};

export const initialNodes: NodeType[] = [
    { id: "A", title: "Home", type: "main", links: ["B", "C"], isUnlocked: true },
    { id: "B", title: "Projects", type: "folder", links: ["D"], isUnlocked: true },
    { id: "C", title: "Notes", type: "folder", links: ["E"], isUnlocked: false },
    { id: "D", title: "Graph", type: "file", links: [], isUnlocked: true },
    { id: "E", title: "Ideas", type: "file", links: ["F"], isUnlocked: false },
    { id: "F", title: "Todo", type: "file", links: [], isUnlocked: false },
];

export const initialLinks: LinkType[] = initialNodes.flatMap(n =>
    n.links.map(target => ({ source: n.id, target }))
);

// -----------------------------
// old version of graph data, will be used for testing new graph component

export type Group = "hub" | "folder" | "skill" | "note";

export interface NodeDef {
    id: string;
    label: string;
    group: Group;
}

export interface GroupCfg {
    fill: string;
    glow: string;
    size: number;
    label: string;
}

export const NODES: NodeDef[] = [
    { id: "home", label: "Home", group: "hub" },
    { id: "projects", label: "Projects", group: "folder" },
    { id: "react", label: "React", group: "skill" },
    { id: "typescript", label: "TypeScript", group: "skill" },
    { id: "design", label: "Design", group: "folder" },
    { id: "portfolio", label: "Portfolio", group: "note" },
    { id: "blog", label: "Blog", group: "folder" },
    { id: "tools", label: "Tools", group: "folder" },
    { id: "figma", label: "Figma", group: "skill" },
    { id: "nextjs", label: "Next.js", group: "skill" },
    { id: "python", label: "Python", group: "skill" },
    { id: "api", label: "API Design", group: "note" },
    { id: "notes", label: "Daily Notes", group: "note" },
    { id: "reading", label: "Reading List", group: "note" },
    { id: "ideas", label: "Ideas", group: "note" },
    { id: "goals", label: "2025 Goals", group: "note" },
    { id: "bookmarks", label: "Bookmarks", group: "folder" },
    { id: "research", label: "Research", group: "folder" },
    { id: "ml", label: "Machine Learning", group: "skill" },
    { id: "journal", label: "Journal", group: "note" },
];

export const EDGES: [string, string][] = [
    ["home", "projects"], ["home", "design"], ["home", "tools"], ["home", "blog"], ["home", "notes"], ["home", "ideas"],
    ["projects", "react"], ["projects", "typescript"], ["projects", "nextjs"], ["projects", "portfolio"],
    ["design", "figma"], ["design", "portfolio"], ["design", "tools"],
    ["tools", "figma"], ["tools", "python"], ["tools", "api"],
    ["react", "nextjs"], ["react", "typescript"],
    ["python", "ml"], ["python", "api"],
    ["research", "ml"], ["research", "ideas"], ["research", "bookmarks"],
    ["blog", "reading"], ["blog", "notes"], ["blog", "ideas"],
    ["goals", "ideas"], ["goals", "journal"],
    ["notes", "journal"], ["notes", "reading"],
    ["bookmarks", "reading"],
];

export const GROUP_CONFIG: Record<Group, GroupCfg> = {
    hub: { fill: "#7c6af7", glow: "rgba(124,106,247,0.7)", size: 13, label: "Hub" },
    folder: { fill: "#4ecdc4", glow: "rgba(78,205,196,0.6)", size: 9, label: "Folder" },
    skill: { fill: "#f0c040", glow: "rgba(240,192,64,0.55)", size: 7, label: "Skill" },
    note: { fill: "#8b949e", glow: "rgba(139,148,158,0.5)", size: 6, label: "Note" },
};

export const ADJACENCY = new Map<string, string[]>(NODES.map(n => [n.id, []]));
EDGES.forEach(([s, t]) => { ADJACENCY.get(s)!.push(t); ADJACENCY.get(t)!.push(s); });