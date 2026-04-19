// src/pages/projects/components/ProjectCard.tsx
import React from "react";
import { useTheme } from "../../../context/themeContext";
import { type ProjectCardProps } from "./types";
import { PROJECTS_TRANSLATIONS } from "../../../locales";

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const { theme } = useTheme();
    const t = PROJECTS_TRANSLATIONS[theme.language];
    const { id, status, link, img } = project;
    const projectData = t.projects[id];
    const statusLabel = t.statusLabels[status];


    // Map status to display text & color
    const statusColors: Record<string, string> = {
        "not-started": "#d1d5db", // gray
        "in-progress": "#facc15", // yellow
        "paused": "#f87171",      // red
        "started": "#3b82f6",     // blue
        "completed": "#22c55e",   // green
        "soon-release": "#a78bfa",// purple
    };

    return (
        <div
            className="shrink-0 lg:w-[calc(50%-1rem)] snap-start p-6 sm:p-8 rounded-xl border-2 flex flex-col h-full w-full"
            style={{
                borderColor: 'var(--color-primary)',
                backgroundColor: 'var(--color-secondary)',
            }}
            role="article"
            aria-label={`${projectData.title}: ${projectData.subtitle}`}
        >

            {/* HEADER */}
            <div>
                <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2 mb-3">
                    <h2
                        className="text-xl sm:text-2xl lg:text-3xl font-light italic"
                        style={{
                            color: 'var(--color-primary)',
                            fontFamily: 'var(--font-primary)',
                        }}
                    >
                        {projectData.title}
                    </h2>

                    <span
                        className="text-xs sm:text-sm px-3 py-1 rounded-md font-medium w-full sm:w-auto text-right"
                        style={{
                            backgroundColor: statusColors[status],
                            color: "#000",
                        }}
                    >
                        {statusLabel}
                    </span>
                </div>

                {projectData.subtitle && (
                    <h3
                        className="text-sm sm:text-base italic mb-3"
                        style={{
                            color: 'var(--color-primary)',
                            fontFamily: 'var(--font-secondary)',
                            opacity: 0.8,
                        }}
                    >
                        {projectData.subtitle}
                    </h3>
                )}
            </div>

            {/* DESCRIPTION */}
            <p
                className="text-sm sm:text-base leading-relaxed mb-4 text-justify hide-on-small-height"
                style={{
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-secondary)',
                    fontSize: 'calc(16px * var(--font-scale))',
                    whiteSpace: "pre-wrap",
                }}
            >
                {projectData.description}
            </p>

            {/* FLEXIBLE IMAGE AREA */}
            {img && (
                <div className="flex-1 flex items-center justify-center overflow-hidden rounded-lg hide-on-small-height">
                    <img
                        src={img}
                        alt={`${projectData.title}: ${projectData.subtitle}`}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )}

            {/* FOOTER */}
            {link && (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm font-medium underline hover:opacity-80 w-fit"
                    style={{ color: 'var(--color-primary)' }}
                >
                    {t.viewMore}
                </a>
            )}

        </div>
    );
};