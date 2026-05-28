import {
    getDynamicNodes,
    getNodeCompletionPercent,
} from "../data/graphData";
import { BANNER_COLORS, PERSONA_OPTIONS, PERSONA_BG_COLORS } from "../constants/profile";
// import { STATUS_ICONS } from "../constants/icons/statusIcons";

export const getTotalLessons = (): { completed: number; total: number } => {
    const nodes = getDynamicNodes();
    let completed = 0;
    let total = 0;

    nodes.forEach(node => {
        if (node.lessonPath) {
            total += node.lessonPath.length;
            node.lessonPath.forEach(() => {
                const pct = getNodeCompletionPercent(node.id);
                if (pct > 0) completed++;
            });
        }
    });

    return { completed, total };
};

// --- Profile Storage ---

export const getProfileSettings = () => ({
    bannerColor: localStorage.getItem("profile_banner_color") || BANNER_COLORS[0].color,
    persona: localStorage.getItem("profile_persona") || PERSONA_OPTIONS[0].id,
    personaBgColor: localStorage.getItem("profile_persona_bg") || PERSONA_BG_COLORS[6].color,
    statusIndex: parseInt(localStorage.getItem("profile_status_index") || "0", 10),
});

export const saveProfileSettings = (
    bannerColor: string,
    persona: string,
    personaBgColor: string,
    statusIndex: number,
) => {
    localStorage.setItem("profile_banner_color", bannerColor);
    localStorage.setItem("profile_persona", persona);
    localStorage.setItem("profile_persona_bg", personaBgColor);
    localStorage.setItem("profile_status_index", String(statusIndex));
};

export const getStudyStreak = (): number => {
    const completedNodes = JSON.parse(localStorage.getItem("completed_nodes") ?? "[]");
    return completedNodes.length > 0 ? Math.min(completedNodes.length, 7) : 0;
};