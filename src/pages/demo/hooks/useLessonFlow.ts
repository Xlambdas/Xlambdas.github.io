import { type NodeType, type Lesson, getNewlyUnlocked } from "../data/graphData";
import { type ActiveLesson } from "./useDemoHomeState";

interface UseLessonFlowParams {
    activeLesson: ActiveLesson | null;
    setActiveLesson: (lesson: ActiveLesson | null) => void;
    setPathNode: (node: NodeType | null) => void;
    setPreviewNode: (node: NodeType | null) => void;
    setRefreshKey: (updater: (k: number) => number) => void;
    setNewlyUnlockedIds: (ids: string[]) => void;
}

export function useLessonFlow({
    activeLesson,
    setActiveLesson,
    setPathNode,
    setPreviewNode,
    setRefreshKey,
    setNewlyUnlockedIds,
}: UseLessonFlowParams) {

    const openPath = (node: NodeType) => {
        setPreviewNode(null);
        setPathNode(node);
    };

    const openLesson = (node: NodeType, lesson: Lesson, index: number) => {
        setActiveLesson({ node, lesson, index });
        setPathNode(null);
    };

    const handleLessonComplete = (nodeId: string) => {
        const newCompleted: string[] = JSON.parse(
            localStorage.getItem("completed_nodes") ?? "[]"
        );
        const prevCompleted = newCompleted.filter(id => id !== nodeId);
        const justUnlocked = getNewlyUnlocked(prevCompleted, newCompleted);

        setNewlyUnlockedIds(justUnlocked);
        setRefreshKey(k => k + 1);

        const node = activeLesson?.node ?? null;
        setActiveLesson(null);
        if (node) setPathNode(node);

        setTimeout(() => setNewlyUnlockedIds([]), 2500);
    };

    const handleLessonClose = () => {
        const node = activeLesson?.node ?? null;
        setActiveLesson(null);
        if (node) setPathNode(node);
    };

    return {
        openPath,
        openLesson,
        handleLessonComplete,
        handleLessonClose,
    };
}