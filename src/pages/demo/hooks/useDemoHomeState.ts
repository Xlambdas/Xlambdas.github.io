// all use state and logic for demo home page

import { useState, useRef, useEffect } from "react";
import { type NodeType, type Lesson } from "../data/graphData";

// ─── Types ────────────────────────────────────────────────────────────────────
export type TextSize = "S" | "M" | "L";
export const SIZE_MAP: Record<TextSize, number> = { S: 10, M: 11, L: 13 };

export type ActiveLesson = { node: NodeType; lesson: Lesson; index: number };

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const persist = (key: string, value: string) => localStorage.setItem(key, value);
export const restore = <T extends string>(key: string, fallback: T): T =>
    (localStorage.getItem(key) as T) ?? fallback;

// ─────────────────────────────────────────────────────────────────────────────
export function useDemoHomeState() {

    // ── UI state ──────────────────────────────────────────────────────────────
    const [collapsed, setCollapsed] = useState<boolean>(
        () => restore<"true" | "false">("graph_collapsed", "false") === "true"
    );
    const [textSize, setTextSize] = useState<TextSize>(
        () => restore("graph_textSize", "M")
    );
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [mobileSearch, setMobileSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<NodeType[]>([]);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // ── Graph state ───────────────────────────────────────────────────────────
    const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
    // const [previewNode, setPreviewNode] = useState<NodeType | null>(null);
    const [activeNode, setActiveNode] = useState<NodeType | null>(null);
    const [pathNode, setPathNode] = useState<NodeType | null>(null);
    const [activeLesson, setActiveLesson] = useState<ActiveLesson | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [newlyUnlockedIds, setNewlyUnlockedIds] = useState<string[]>([]);

    // ── Modals ────────────────────────────────────────────────────────────────
    const [funFactOpen, setFunFactOpen] = useState(false);
    const [strengthenOpen, setStrengthenOpen] = useState(false);
    const [strengthenNodeId, setStrengthenNodeId] = useState<string | undefined>();
    const [profileOpen, setProfileOpen] = useState(false);

    // ── Teacher mode ──────────────────────────────────────────────────────────
    const [isTeacher, setIsTeacher] = useState<boolean>(
        () => restore<"true" | "false">("teacher_mode", "false") === "true"
    );
    const [teacherName, setTeacherName] = useState<string>(
        () => restore("teacher_name", "")
    );
    const [showTeacherLogin, setShowTeacherLogin] = useState(false);

    // ── Window hook: expose strengthen globally ───────────────────────────────
    useEffect(() => {
        window.__graphStrengthen = () => {
            setStrengthenNodeId(undefined);
            setStrengthenOpen(true);
        };
        return () => { delete window.__graphStrengthen; };
    }, []);

    return {
        // UI
        collapsed, setCollapsed,
        textSize, setTextSize,
        settingsOpen, setSettingsOpen,
        mobileSearch, setMobileSearch,
        searchQuery, setSearchQuery,
        suggestions, setSuggestions,
        searchInputRef,

        // Graph
        selectedNode, setSelectedNode,
        // previewNode, setPreviewNode,
        activeNode, setActiveNode,
        pathNode, setPathNode,
        activeLesson, setActiveLesson,
        refreshKey, setRefreshKey,
        newlyUnlockedIds, setNewlyUnlockedIds,

        // Modals
        funFactOpen, setFunFactOpen,
        strengthenOpen, setStrengthenOpen,
        strengthenNodeId, setStrengthenNodeId,
        profileOpen, setProfileOpen,

        // Teacher
        isTeacher, setIsTeacher,
        teacherName, setTeacherName,
        showTeacherLogin, setShowTeacherLogin,
    };
}