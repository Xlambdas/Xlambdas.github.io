import React from 'react';
import { SIZE_MAP } from '../constants/config';
import { type TextSize } from '../types/types';
import { initialNodes } from '../data/graphData';

// --- Component ---

export const Legend: React.FC<{ textSize: TextSize }> = ({ textSize }) => {
    const fs = SIZE_MAP[textSize];

    // Get all nodes that are direct children of domains (not profile)
    // These are the main branches to display in the legend
    const getLegendNodes = () => {
        // Find the profile node
        const profileNode = initialNodes.find(n => (n as any).kind === "profile");
        if (!profileNode) return [];

        // Get all domain nodes (direct children of profile)
        const domainNodes = profileNode.links
            .map(id => initialNodes.find(n => n.id === id))
            .filter(Boolean);

        // For each domain, get its children (topics)
        const allBranchNodes: Array<{ id: string; title: string; color: string; kind: string }> = [];

        domainNodes.forEach(domain => {
            if (!domain) return;

            // Add domain itself
            allBranchNodes.push({
                id: domain.id,
                title: domain.title,
                color: (domain as any).branchColor || "#a5b4fc",
                kind: (domain as any).kind || "domain",
            });

            // Add its topics
            // domain.links.forEach(linkId => {
            //     const node = initialNodes.find(n => n.id === linkId);
            //     if (node) {
            //         allBranchNodes.push({
            //             id: node.id,
            //             title: node.title,
            //             color: (node as any).branchColor || "#a5b4fc",
            //             kind: (node as any).kind || "topic",
            //         });
            //     }
            // });
        });

        return allBranchNodes;
    };

    const legendNodes = getLegendNodes();

    if (legendNodes.length === 0) return null;

    return (
        <div
            className="hidden sm:block"
            style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                zIndex: 10,
                background: "rgba(22,27,34,0.95)",
                border: "1px solid #21262d",
                borderRadius: 10,
                padding: "12px 14px",
                backdropFilter: "blur(8px)",
            }}
        >
            <div style={{
                color: "#8b949e",
                fontSize: fs - 1,
                marginBottom: 8,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
            }}>
                Parcours
            </div>
            {legendNodes.map(({ id, title, color, kind }) => (
                <div key={id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                    paddingLeft: kind === "topic" ? 8 : 0, // Indent topics
                }}>
                    <div style={{
                        width: kind === "domain" ? 10 : 8,
                        height: kind === "domain" ? 10 : 8,
                        borderRadius: "50%",
                        background: color,
                        flexShrink: 0,
                        boxShadow: `0 0 8px ${color}66`,
                    }} />
                    <span style={{
                        color: kind === "domain" ? "#c9d1d9" : "#8b949e",
                        fontSize: kind === "domain" ? fs : fs - 1,
                        fontWeight: kind === "domain" ? 600 : 400,
                    }}>
                        {title}
                    </span>
                </div>
            ))}
        </div>
    );
};