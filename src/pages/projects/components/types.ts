// src/pages/projects/components/types.ts

export type ProjectStatus =
    "not-started" | "in-progress" |
    "paused" | "started" |
    "completed" | "soon-release";

export interface Project {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    status: ProjectStatus;
    link?: string;
    img?: string;
}

export interface ProjectCardProps {
    project: Project;
}