import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { type NodeType, initialNodes, getVisibleIds } from "../data/graphData";
import { getNotesForNode } from "../data/teacherNotes";
import { getDueCount } from "../helpers/srEngine";
import { Stat } from "./stat";
import { TeacherNoteEditor } from "../section/teacherNoteEditor";

// ─── Types ────────────────────────────────────────────────────────────────────

type TextSize = "S" | "M" | "L";
const SIZE_MAP: Record<TextSize, number> = { S: 11, M: 13, L: 15 };

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_COLOR: Record<NodeType["type"], string> = {
    main: "#ffffff",
    folder: "#a5b4fc",
    file: "#94a3b8",
};

const visibleIds = getVisibleIds(initialNodes);

// ─── Props ────────────────────────────────────────────────────────────────────

interface SidebarProps {
    collapsed: boolean;
    onCollapse: () => void;
    onSelectNode: (node: NodeType | null) => void;
    textSize: TextSize;
    isTeacher: boolean;
    teacherName: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Sidebar: React.FC<SidebarProps> = ({
    collapsed, onCollapse, onSelectNode, textSize, isTeacher, teacherName,
}) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const [, setNoteRefresh] = useState(0);

    const fs = SIZE_MAP[textSize];
    const dueCount = getDueCount();

    const filtered = useMemo(() =>
        initialNodes.filter(n =>
            visibleIds.has(n.id) &&
            n.title.toLowerCase().includes(search.toLowerCase())
        ),
        [search]
    );

    if (collapsed) return null;

    const unlockedCount = initialNodes.filter(n => n.isUnlocked).length;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div style={{
            width: 252, height: "100%",
            background: "#161b22",
            borderRight: "1px solid #21262d",
            display: "flex", flexDirection: "column", flexShrink: 0,
        }}>

            {/* ── Header ── */}
            <div style={{
                padding: "13px 14px 10px",
                borderBottom: "1px solid #21262d",
            }}>
                <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", marginBottom: 10,
                }}>
                    <span style={{ color: "#c9d1d9", fontSize: fs + 1, fontWeight: 500 }}>
                        Graph View
                    </span>
                    <button
                        onClick={onCollapse}
                        style={{
                            background: "none", border: "none",
                            color: "#484f58", cursor: "pointer",
                            fontSize: 18, lineHeight: 1, padding: "2px 4px",
                        }}
                    >‹</button>
                </div>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher…"
                    style={{
                        width: "100%", boxSizing: "border-box",
                        background: "#0d1117", border: "1px solid #21262d",
                        borderRadius: 5, padding: "5px 9px",
                        color: "#c9d1d9", fontSize: fs, outline: "none",
                    }}
                />
            </div>

            {/* ── Node list ── */}
            <div style={{
                flex: 1, overflowY: "auto",
                scrollbarWidth: "thin", scrollbarColor: "#21262d transparent",
                padding: "4px 0",
            }}>
                {filtered.map(node => (
                    <div key={node.id}>

                        {/* node row */}
                        <div
                            onClick={() => {
                                if (!node.isUnlocked) return;
                                window.__graphFocus?.(node.id);
                                onSelectNode(node);
                            }}
                            style={{
                                display: "flex", alignItems: "center",
                                gap: 9, padding: "5px 14px",
                                cursor: node.isUnlocked ? "pointer" : "default",
                            }}
                        >
                            {/* dot */}
                            <div style={{
                                width: 7, height: 7, borderRadius: "50%",
                                background: node.isUnlocked ? TYPE_COLOR[node.type] : "#4b5563",
                                border: node.isUnlocked ? "none" : "1px solid #6b7280",
                                flexShrink: 0,
                            }} />

                            {/* title */}
                            <span style={{
                                color: node.isUnlocked ? "#8b949e" : "#4b5563",
                                fontSize: fs, flex: 1,
                            }}>
                                {node.title}
                            </span>

                            {/* link count */}
                            {node.isUnlocked && (
                                <span style={{ color: "#30363d", fontSize: fs - 1 }}>
                                    {node.links.length}
                                </span>
                            )}

                            {/* teacher add-note button */}
                            {isTeacher && (
                                <button
                                    onClick={e => { e.stopPropagation(); setEditingNodeId(node.id); }}
                                    title="Ajouter une note"
                                    style={{
                                        background: "none", border: "none",
                                        color: "#484f58", cursor: "pointer",
                                        fontSize: 14, padding: "0 2px", flexShrink: 0,
                                    }}
                                >+</button>
                            )}
                        </div>

                        {/* inline note editor */}
                        {isTeacher && editingNodeId === node.id && (
                            <div style={{ padding: "4px 14px 8px" }}>
                                <TeacherNoteEditor
                                    nodeId={node.id}
                                    nodeTitle={node.title}
                                    authorName={teacherName}
                                    existingNote={
                                        getNotesForNode(node.id)
                                            .find(n => n.authorName === teacherName)
                                    }
                                    onSave={() => {
                                        setEditingNodeId(null);
                                        setNoteRefresh(r => r + 1);
                                    }}
                                    onCancel={() => setEditingNodeId(null)}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Stats ── */}
            <div style={{
                padding: "10px 14px",
                borderTop: "1px solid #21262d",
                display: "flex",
            }}>
                <Stat value={unlockedCount} label="Débloqués" />
                <div style={{ width: 1, background: "#21262d" }} />
                <Stat value={initialNodes.length} label="Total" />
                <div style={{ width: 1, background: "#21262d" }} />
                <Stat value={visibleIds.size} label="Visibles" />
            </div>

            {/* ── Due reviews CTA ── */}
            {dueCount > 0 && (
                <button
                    onClick={() => window.__graphStrengthen?.()}
                    style={{
                        margin: "0 10px 8px",
                        padding: "8px 0",
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.3)",
                        color: "#ef4444", borderRadius: 8,
                        fontSize: fs - 1, cursor: "pointer",
                        display: "flex", alignItems: "center",
                        justifyContent: "center", gap: 6,
                    }}
                >
                    <span>💪</span>
                    <span>{dueCount} révision{dueCount > 1 ? "s" : ""} en attente</span>
                </button>
            )}

            {/* ── Footer ── */}
            <div style={{
                padding: "8px 14px",
                borderTop: "1px solid #21262d",
                display: "flex", justifyContent: "space-between",
            }}>
                <span
                    onClick={() => navigate("/")}
                    style={{ color: "#30363d", fontSize: fs - 1, cursor: "pointer" }}
                >
                    XLS.studio
                </span>
                <span style={{ color: "#30363d", fontSize: fs - 1 }}>05 · 2026</span>
            </div>
        </div>
    );
};