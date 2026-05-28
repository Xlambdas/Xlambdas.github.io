import type { NodeType } from "../types";
import { computeBadgeLevel } from "../utils/srEngine";

// Import individual nodes
import {
    ProfileNode, PsychologyNode, MemoryNode, AttentionNode, WorkingMemoryNode, LongTermMemoryNode,
    NeuroscienceNode
} from "./nodes";
import { isLessonCompleted, getCompletedLessons, getCompletedNodes, awardBadge } from "./dataHelpers";

// Re-export types
export type {
    NodeType, QuizQuestion, SRCard, SRRating, Lesson, LessonProgress, UserProfile, EarnedBadge, Badge
} from "../types";

// Re-export helpers
export * from "./dataHelpers";

// --- Main node array ---
export const initialNodes: NodeType[] = [
    ProfileNode,
    PsychologyNode,
    MemoryNode,
    AttentionNode,
    WorkingMemoryNode,
    LongTermMemoryNode,
    NeuroscienceNode,
];

// --- Links derived from nodes ---
export type LinkType = {
    source: string | NodeType;
    target: string | NodeType;
};

export const initialLinks: LinkType[] = initialNodes.flatMap(n =>
    n.links.map(target => ({ source: n.id, target }))
);

// --- Node operations ---

export const getNodeCompletionPercent = (nodeId: string): number => {
    const node = initialNodes.find(n => n.id === nodeId);
    if (!node || node.lessonPath.length === 0) return 0;
    const done = node.lessonPath.filter(l => isLessonCompleted(nodeId, l.id)).length;
    return Math.round((done / node.lessonPath.length) * 100);
};

export const completeLesson = (nodeId: string, lessonId: string): void => {
    const node = initialNodes.find(n => n.id === nodeId);
    if (!node) return;

    const lesson = node.lessonPath.find(l => l.id === lessonId);

    // If it's a final quiz, use special completion logic
    if (lesson?.type === "final_quiz") {
        completeFinalQuiz(nodeId, lessonId);
        return;
    }

    // Regular lesson completion
    const key = `${nodeId}::${lessonId}`;
    const current = getCompletedLessons();
    if (!current.includes(key)) {
        localStorage.setItem("completed_lessons", JSON.stringify([...current, key]));
    }
};

export const isFinalQuizCompleted = (nodeId: string): boolean => {
    const node = initialNodes.find(n => n.id === nodeId);
    if (!node) return false;

    const finalQuiz = node.lessonPath.find(l => l.type === "final_quiz");
    if (!finalQuiz) return false;

    return isLessonCompleted(nodeId, finalQuiz.id);
};

export const completeFinalQuiz = (nodeId: string, lessonId: string): void => {
    const node = initialNodes.find(n => n.id === nodeId);
    if (!node) return;

    // 1. Mark the final quiz as complete
    const key = `${nodeId}::${lessonId}`;
    const current = getCompletedLessons();
    if (!current.includes(key)) {
        current.push(key);
    }

    // 2. Mark ALL "explanation" type lessons in this node as complete
    node.lessonPath.forEach(lesson => {
        if (lesson.type === "explanation" || lesson.type === "recap" || lesson.type === "vignette") {
            const lessonKey = `${nodeId}::${lesson.id}`;
            if (!current.includes(lessonKey)) {
                current.push(lessonKey);
            }
        }
    });

    localStorage.setItem("completed_lessons", JSON.stringify(current));

    // 3. Mark node as complete
    const completedNodes = getCompletedNodes();
    if (!completedNodes.includes(nodeId)) {
        localStorage.setItem("completed_nodes", JSON.stringify([...completedNodes, nodeId]));
    }

    // 4. Award badge
    const level = computeBadgeLevel(nodeId);
    if (level) awardBadge(nodeId, level, initialNodes);
};

export const getDynamicNodes = (): NodeType[] => {
    return initialNodes.map(n => {
        if (n.isUnlocked) return n;
        const prereqsMet = n.prerequisites.every(id => isFinalQuizCompleted(id));
        return { ...n, isUnlocked: prereqsMet };
    });
};

export const getVisibleIds = (nodes: NodeType[]): Set<string> => {
    const unlockedIds = new Set(nodes.filter(n => n.isUnlocked).map(n => n.id));
    const visibleIds = new Set<string>(unlockedIds);
    nodes.forEach(n => {
        if (n.isUnlocked) {
            n.links.forEach(targetId => {
                if (!unlockedIds.has(targetId)) visibleIds.add(targetId);
            });
        }
    });
    return visibleIds;
};

export const getNewlyUnlocked = (prevCompleted: string[], newCompleted: string[]): string[] => {
    const wasUnlocked = (id: string) =>
        initialNodes.find(n => n.id === id)?.isUnlocked ||
        initialNodes.find(n => n.id === id)?.prerequisites.every(p => prevCompleted.includes(p));
    const isNowUnlocked = (id: string) =>
        initialNodes.find(n => n.id === id)?.isUnlocked ||
        initialNodes.find(n => n.id === id)?.prerequisites.every(p => newCompleted.includes(p));
    return initialNodes
        .filter(n => !wasUnlocked(n.id) && isNowUnlocked(n.id))
        .map(n => n.id);
};