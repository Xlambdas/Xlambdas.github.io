import { type TextSize } from "../types/types";

export const SIZE_MAP: Record<TextSize, number> = { S: 10, M: 11, L: 13 };

// --- Config ---

export const LEGEND_ITEMS: { key: string; color: string; label: string; border?: boolean }[] = [
    { key: "main", color: "#ffffff", label: "Principal" },
    { key: "folder", color: "#a5b4fc", label: "Domaine" },
    { key: "file", color: "#94a3b8", label: "Concept" },
    { key: "locked", color: "#4b5563", label: "Verrouillé", border: true },
];