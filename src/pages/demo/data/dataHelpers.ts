import type { NodeType } from "../types/types";

// --- Storage helpers ---

export const getCompletedNodes = (): string[] =>
    JSON.parse(localStorage.getItem("completed_nodes") ?? "[]");

export const getCompletedLessons = (): string[] =>
    JSON.parse(localStorage.getItem("completed_lessons") ?? "[]");

export const isLessonCompleted = (nodeId: string, lessonId: string): boolean =>
    getCompletedLessons().includes(`${nodeId}::${lessonId}`);

// --- Badge helpers ---

export const getEarnedBadges = () =>
    JSON.parse(localStorage.getItem("earned_badges") ?? "[]");

// Pass initialNodes as parameter to avoid circular dependency
export const awardBadge = (
    nodeId: string,
    level: "bronze" | "silver" | "gold",
    allNodes: NodeType[]
) => {
    const node = allNodes.find((n: NodeType) => n.id === nodeId);
    if (!node?.badge) return;
    const badges = getEarnedBadges();
    const existing = badges.findIndex((b: any) => b.nodeId === nodeId);
    const entry = { badgeId: node.badge.id, nodeId, level, earnedAt: new Date().toISOString() };
    if (existing >= 0) badges[existing] = entry;
    else badges.push(entry);
    localStorage.setItem("earned_badges", JSON.stringify(badges));
};

export const getBadgeForNode = (nodeId: string) =>
    getEarnedBadges().find((b: any) => b.nodeId === nodeId) ?? null;

// --- User profile helpers ---

export const getUserProfile = () => ({
    name: localStorage.getItem("user_name") ?? "Étudiant",
    avatarEmoji: localStorage.getItem("user_avatar") ?? "🧠",
    joinDate: localStorage.getItem("join_date") ?? new Date().toISOString().split("T")[0],
});

export const saveUserProfile = (name: string, avatarEmoji: string) => {
    localStorage.setItem("user_name", name);
    localStorage.setItem("user_avatar", avatarEmoji);
    if (!localStorage.getItem("join_date")) {
        localStorage.setItem("join_date", new Date().toISOString().split("T")[0]);
    }
};