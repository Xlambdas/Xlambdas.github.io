import React, { useState } from "react";
import { getNodeCompletionPercent, initialNodes } from "../../data/graphData";
import { getAllCards, saveCards } from "../../utils/srEngine";
import { findParent } from "../../helpers";
import type { ConfirmState, NodePathSettingsProps, NodeType } from "../../types";
import { CloseIcon, RefreshIcon } from "../../constants/icons/icons";

export const NodePathSettings: React.FC<NodePathSettingsProps> = ({
    node,
    onClose,
    mode = 'card'
}) => {
    const [confirmReset, setConfirmReset] = useState<ConfirmState>("idle");
    const [confirmBulkReset, setConfirmBulkReset] = useState<ConfirmState>("idle");
    const [selectedNodeId, setSelectedNodeId] = useState<string>(node.id);

    const pct = getNodeCompletionPercent(node.id);
    // const kind = (node as any)?.kind ?? "concept";
    // const isParentNode = kind === "domain" || kind === "topic";

    // Build path from root to current node
    const buildPathToNode = (): NodeType[] => {
        const expandedPath: NodeType[] = [];

        // First, build the linear path from current node to root
        const linearPath: NodeType[] = [];
        let currentNode: NodeType | undefined = node;

        while (currentNode) {
            const currentKind = (currentNode as any)?.kind ?? "concept";
            if (currentKind !== "profile") {
                linearPath.unshift(currentNode);
            }

            const parent = findParent(currentNode.id);
            if (parent && !linearPath.some(n => n.id === parent.id)) {
                currentNode = parent;
            } else {
                currentNode = undefined;
            }
        }

        // Now expand the path to include all siblings at each level
        for (let i = 0; i < linearPath.length; i++) {
            const pathNode = linearPath[i];
            expandedPath.push(pathNode);

            // If this node has a parent, add all siblings (other children of the parent)
            if (i < linearPath.length - 1) {
                const parent = linearPath[i];
                const nextInPath = linearPath[i + 1];

                // Get all children of this parent
                const siblings = initialNodes.filter(n => {
                    const nKind = (n as any)?.kind ?? "concept";
                    return nKind !== "profile" &&
                        parent.links.includes(n.id) &&
                        n.id !== nextInPath.id; // Exclude the one already in path
                });

                // Add siblings after the parent
                expandedPath.push(...siblings);
            }
        }

        return expandedPath;
    };

    const pathNodes = mode === 'modal' ? buildPathToNode() : [];
    const selectedNode = initialNodes.find(n => n.id === selectedNodeId) || node;
    const selectedPct = getNodeCompletionPercent(selectedNode.id);
    const selectedKind = (selectedNode as any)?.kind ?? "concept";
    const isSelectedParent = selectedKind === "domain" || selectedKind === "topic";

    // Get child nodes of selected node
    const childNodes = isSelectedParent
        ? initialNodes.filter(n => selectedNode.links.includes(n.id))
        : [];

    const handleResetPath = () => {
        if (confirmReset !== "confirming") {
            setConfirmReset("confirming");
            return;
        }

        const nodeToReset = mode === 'modal' ? selectedNode : node;

        // Remove completed lessons for this node
        const lessons: string[] = JSON.parse(localStorage.getItem("completed_lessons") ?? "[]");
        localStorage.setItem(
            "completed_lessons",
            JSON.stringify(lessons.filter(l => !l.startsWith(`${nodeToReset.id}::`)))
        );

        // Remove node from completed nodes
        const nodes: string[] = JSON.parse(localStorage.getItem("completed_nodes") ?? "[]");
        localStorage.setItem(
            "completed_nodes",
            JSON.stringify(nodes.filter(id => id !== nodeToReset.id))
        );

        // Remove SR cards for this node
        const cards = getAllCards().filter(c => c.nodeId !== nodeToReset.id);
        saveCards(cards);

        // Remove badge for this node
        const badges = JSON.parse(localStorage.getItem("earned_badges") ?? "[]");
        localStorage.setItem(
            "earned_badges",
            JSON.stringify(badges.filter((b: any) => b.nodeId !== nodeToReset.id))
        );

        setConfirmReset("done");
        setTimeout(() => {
            onClose();
            window.location.reload();
        }, 1500);
    };

    const handleBulkReset = () => {
        if (confirmBulkReset !== "confirming") {
            setConfirmBulkReset("confirming");
            return;
        }

        const nodeToReset = mode === 'modal' ? selectedNode : node;
        const childrenToReset = isSelectedParent
            ? initialNodes.filter(n => nodeToReset.links.includes(n.id))
            : [];
        const nodeIds = [nodeToReset.id, ...childrenToReset.map(n => n.id)];

        // Remove completed lessons for all nodes
        const lessons: string[] = JSON.parse(localStorage.getItem("completed_lessons") ?? "[]");
        localStorage.setItem(
            "completed_lessons",
            JSON.stringify(lessons.filter(l => !nodeIds.some(id => l.startsWith(`${id}::`))))
        );

        // Remove all nodes from completed
        const nodes: string[] = JSON.parse(localStorage.getItem("completed_nodes") ?? "[]");
        localStorage.setItem(
            "completed_nodes",
            JSON.stringify(nodes.filter(id => !nodeIds.includes(id)))
        );

        // Remove SR cards for all nodes
        const cards = getAllCards().filter(c => !nodeIds.includes(c.nodeId));
        saveCards(cards);

        // Remove badges for all nodes
        const badges = JSON.parse(localStorage.getItem("earned_badges") ?? "[]");
        localStorage.setItem(
            "earned_badges",
            JSON.stringify(badges.filter((b: any) => !nodeIds.includes(b.nodeId)))
        );

        setConfirmBulkReset("done");
        setTimeout(() => {
            onClose();
            window.location.reload();
        }, 1500);
    };

    // Card mode - fills parent container
    if (mode === 'card') {
        return (
            <div style={{
                position: "absolute",
                inset: 0,
                zIndex: 5,
                background: "#161b22",
                borderRadius: 16,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                animation: "settingsSlideIn 0.22s ease both",
            }}>
                <style>{`
                    @keyframes settingsSlideIn {
                        from { opacity: 0; transform: translateX(12px); }
                        to   { opacity: 1; transform: translateX(0); }
                    }
                `}</style>

                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <span style={{ color: "#c9d1d9", fontSize: 13, fontWeight: 600 }}>
                        Paramètres — {node.title}
                    </span>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#484f58",
                            cursor: "pointer",
                            padding: 0,
                            lineHeight: 1,
                        }}
                    >
                        <CloseIcon size={18} />
                    </button>
                </div>

                {/* Progress info */}
                <div style={{
                    background: "#0d1117",
                    border: "1px solid #21262d",
                    borderRadius: 10,
                    padding: "12px 14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <span style={{ color: "#484f58", fontSize: 12 }}>Progression actuelle</span>
                    <span style={{ color: "#c9d1d9", fontSize: 13, fontWeight: 600 }}>
                        {pct}%
                    </span>
                </div>

                {/* Reset section */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <span style={{
                        color: "#484f58",
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                    }}>
                        Réinitialisation
                    </span>

                    {confirmReset === "done" ? (
                        <div style={{
                            background: "rgba(34,197,94,0.08)",
                            border: "1px solid rgba(34,197,94,0.3)",
                            borderRadius: 8,
                            padding: "10px 14px",
                            color: "#22c55e",
                            fontSize: 12,
                            textAlign: "center",
                        }}>
                            ✓ Parcours réinitialisé avec succès.
                        </div>
                    ) : confirmReset === "confirming" ? (
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                        }}>
                            <div style={{
                                background: "rgba(239,68,68,0.08)",
                                border: "1px solid rgba(239,68,68,0.25)",
                                borderRadius: 8,
                                padding: "10px 14px",
                                color: "#ef4444",
                                fontSize: 12,
                                lineHeight: 1.6,
                            }}>
                                Toute ta progression, tes révisions SR et ton badge pour ce nœud seront supprimés. Cette action est irréversible.
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    onClick={() => setConfirmReset("idle")}
                                    style={{
                                        flex: 1,
                                        padding: "10px 0",
                                        background: "#21262d",
                                        border: "1px solid #30363d",
                                        color: "#8b949e",
                                        borderRadius: 8,
                                        fontSize: 12,
                                        cursor: "pointer",
                                    }}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleResetPath}
                                    style={{
                                        flex: 1,
                                        padding: "10px 0",
                                        background: "rgba(239,68,68,0.12)",
                                        border: "1px solid rgba(239,68,68,0.4)",
                                        color: "#ef4444",
                                        borderRadius: 8,
                                        fontSize: 12,
                                        fontWeight: 500,
                                        cursor: "pointer",
                                    }}
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleResetPath}
                            disabled={pct === 0}
                            style={{
                                padding: "11px 0",
                                background: pct === 0 ? "#161b22" : "#21262d",
                                border: "1px solid #30363d",
                                borderRadius: 8,
                                color: pct === 0 ? "#484f58" : "#8b949e",
                                fontSize: 12,
                                cursor: pct === 0 ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 6,
                                opacity: pct === 0 ? 0.5 : 1,
                            }}
                        >
                            <RefreshIcon size={14} />
                            Réinitialiser ce parcours
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Modal mode - floating panel on the left
    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(4px)",
                    zIndex: 100,
                }}
            />

            {/* Modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "max(80px, 5vw)", // Responsive left position
                    transform: "translateY(-50%)",
                    width: "min(380px, calc(100vw - 100px))", // Responsive width
                    maxHeight: "80vh",
                    background: "#161b22",
                    border: "1px solid #30363d",
                    borderRadius: 12,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                    zIndex: 101,
                    display: "flex",
                    flexDirection: "column",
                    animation: "modalSlideIn 0.25s ease both",
                }}
                className="hidden sm:flex" // Hide on mobile, show on desktop
            >
                <style>{`
                    @keyframes modalSlideIn {
                        from { opacity: 0; transform: translateY(-50%) translateX(-20px); }
                        to   { opacity: 1; transform: translateY(-50%) translateX(0); }
                    }
                `}</style>

                {/* Header */}
                <div style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid #21262d",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <span style={{ color: "#c9d1d9", fontSize: 14, fontWeight: 600 }}>
                        Paramètres du parcours
                    </span>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#484f58",
                            cursor: "pointer",
                            padding: 0,
                        }}
                    >
                        <CloseIcon size={18} />
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "16px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                }}>
                    {/* Path selection */}
                    <div>
                        <div style={{
                            color: "#484f58",
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 10,
                        }}>
                            Parcours actuel
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                        }}>
                            {pathNodes.map((pathNode) => {
                                const isSelected = pathNode.id === selectedNodeId;
                                const pathPct = getNodeCompletionPercent(pathNode.id);
                                const color = (pathNode as any)?.branchColor || "#a5b4fc";

                                return (
                                    <button
                                        key={pathNode.id}
                                        onClick={() => {
                                            setSelectedNodeId(pathNode.id);
                                            setConfirmReset("idle");
                                            setConfirmBulkReset("idle");
                                        }}
                                        style={{
                                            width: "100%",
                                            background: isSelected ? "#0d1117" : "transparent",
                                            border: `1px solid ${isSelected ? "#30363d" : "#21262d"}`,
                                            borderRadius: 8,
                                            padding: "10px 12px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            transition: "all 0.15s ease",
                                            // marginLeft: index * 12, // Indent based on depth
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.background = "#0d1117";
                                                e.currentTarget.style.borderColor = "#30363d";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.background = "transparent";
                                                e.currentTarget.style.borderColor = "#21262d";
                                            }
                                        }}
                                    >
                                        <div style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: color,
                                            boxShadow: `0 0 6px ${color}66`,
                                            flexShrink: 0,
                                        }} />
                                        <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                                            <div style={{
                                                color: isSelected ? "#c9d1d9" : "#8b949e",
                                                fontSize: 12,
                                                fontWeight: isSelected ? 500 : 400,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}>
                                                {pathNode.title}
                                            </div>
                                        </div>
                                        <div style={{
                                            color: "#6e7681",
                                            fontSize: 11,
                                            fontWeight: 600,
                                        }}>
                                            {pathPct}%
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Selected node info */}
                    <div>
                        <div style={{
                            color: "#484f58",
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 10,
                        }}>
                            Nœud sélectionné
                        </div>
                        <div style={{
                            background: "#0d1117",
                            border: "1px solid #21262d",
                            borderRadius: 8,
                            padding: "12px",
                        }}>
                            <div style={{
                                color: "#c9d1d9",
                                fontSize: 13,
                                fontWeight: 500,
                                marginBottom: 6,
                            }}>
                                {selectedNode.title}
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>
                                <span style={{ color: "#484f58", fontSize: 11 }}>
                                    Progression
                                </span>
                                <span style={{ color: "#a5b4fc", fontSize: 12, fontWeight: 600 }}>
                                    {selectedPct}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reset this node */}
                    <div>
                        <div style={{
                            color: "#484f58",
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            marginBottom: 10,
                        }}>
                            Réinitialisation
                        </div>

                        {confirmReset === "done" ? (
                            <div style={{
                                background: "rgba(34,197,94,0.08)",
                                border: "1px solid rgba(34,197,94,0.3)",
                                borderRadius: 8,
                                padding: "10px 14px",
                                color: "#22c55e",
                                fontSize: 12,
                                textAlign: "center",
                            }}>
                                ✓ Réinitialisé avec succès
                            </div>
                        ) : confirmReset === "confirming" ? (
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                            }}>
                                <div style={{
                                    background: "rgba(239,68,68,0.08)",
                                    border: "1px solid rgba(239,68,68,0.25)",
                                    borderRadius: 8,
                                    padding: "10px 12px",
                                    color: "#ef4444",
                                    fontSize: 11,
                                    lineHeight: 1.5,
                                }}>
                                    Confirmer la suppression de toute la progression pour "{selectedNode.title}" ?
                                </div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button
                                        onClick={() => setConfirmReset("idle")}
                                        style={{
                                            flex: 1,
                                            padding: "8px 0",
                                            background: "#21262d",
                                            border: "1px solid #30363d",
                                            color: "#8b949e",
                                            borderRadius: 6,
                                            fontSize: 11,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleResetPath}
                                        style={{
                                            flex: 1,
                                            padding: "8px 0",
                                            background: "rgba(239,68,68,0.12)",
                                            border: "1px solid rgba(239,68,68,0.4)",
                                            color: "#ef4444",
                                            borderRadius: 6,
                                            fontSize: 11,
                                            fontWeight: 500,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Confirmer
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleResetPath}
                                disabled={selectedPct === 0}
                                style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    background: selectedPct === 0 ? "#161b22" : "#21262d",
                                    border: "1px solid #30363d",
                                    borderRadius: 8,
                                    color: selectedPct === 0 ? "#484f58" : "#8b949e",
                                    fontSize: 12,
                                    cursor: selectedPct === 0 ? "not-allowed" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                    opacity: selectedPct === 0 ? 0.5 : 1,
                                    transition: "all 0.15s ease",
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedPct > 0) {
                                        e.currentTarget.style.background = "#30363d";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedPct > 0) {
                                        e.currentTarget.style.background = "#21262d";
                                    }
                                }}
                            >
                                <RefreshIcon size={14} />
                                Réinitialiser ce nœud
                            </button>
                        )}
                    </div>

                    {/* Bulk reset for parent nodes */}
                    {isSelectedParent && childNodes.length > 0 && (
                        <div>
                            <div style={{
                                color: "#484f58",
                                fontSize: 10,
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                marginBottom: 10,
                            }}>
                                Réinitialisation complète
                            </div>

                            {confirmBulkReset === "done" ? (
                                <div style={{
                                    background: "rgba(34,197,94,0.08)",
                                    border: "1px solid rgba(34,197,94,0.3)",
                                    borderRadius: 8,
                                    padding: "10px 14px",
                                    color: "#22c55e",
                                    fontSize: 12,
                                    textAlign: "center",
                                }}>
                                    ✓ Tout réinitialisé
                                </div>
                            ) : confirmBulkReset === "confirming" ? (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                }}>
                                    <div style={{
                                        background: "rgba(239,68,68,0.08)",
                                        border: "1px solid rgba(239,68,68,0.25)",
                                        borderRadius: 8,
                                        padding: "10px 12px",
                                        color: "#ef4444",
                                        fontSize: 11,
                                        lineHeight: 1.5,
                                    }}>
                                        Supprimer la progression de "{selectedNode.title}" ET de tous ses {childNodes.length} sous-nœuds ?
                                    </div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button
                                            onClick={() => setConfirmBulkReset("idle")}
                                            style={{
                                                flex: 1,
                                                padding: "8px 0",
                                                background: "#21262d",
                                                border: "1px solid #30363d",
                                                color: "#8b949e",
                                                borderRadius: 6,
                                                fontSize: 11,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={handleBulkReset}
                                            style={{
                                                flex: 1,
                                                padding: "8px 0",
                                                background: "rgba(239,68,68,0.12)",
                                                border: "1px solid rgba(239,68,68,0.4)",
                                                color: "#ef4444",
                                                borderRadius: 6,
                                                fontSize: 11,
                                                fontWeight: 500,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Tout supprimer
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleBulkReset}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        background: "#21262d",
                                        border: "1px solid rgba(239,68,68,0.3)",
                                        borderRadius: 8,
                                        color: "#ef4444",
                                        fontSize: 12,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 6,
                                        transition: "all 0.15s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "#21262d";
                                    }}
                                >
                                    <RefreshIcon size={14} />
                                    Réinitialiser tout ({childNodes.length + 1} nœuds)
                                </button>
                            )}

                            {/* Show affected nodes */}
                            {childNodes.length > 0 && (
                                <div style={{
                                    marginTop: 8,
                                    padding: "8px 10px",
                                    background: "#0d1117",
                                    border: "1px solid #21262d",
                                    borderRadius: 6,
                                    maxHeight: 120,
                                    overflowY: "auto",
                                }}>
                                    <div style={{
                                        color: "#484f58",
                                        fontSize: 10,
                                        marginBottom: 6,
                                    }}>
                                        Nœuds affectés :
                                    </div>
                                    <div style={{
                                        color: "#6e7681",
                                        fontSize: 10,
                                        lineHeight: 1.5,
                                    }}>
                                        {selectedNode.title}, {childNodes.map(n => n.title).join(", ")}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};