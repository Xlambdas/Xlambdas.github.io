import type { ContentBlock } from "../types";

export const BLOCK_LABELS: Record<ContentBlock["type"], string> = {
    explanation: "Explication",
    vignette: "Histoire",
    quiz: "Quiz",
    recap: "Récapitulatif",
};

// --- Markdown ---
export const md = (text: string) =>
    "<p>" +
    text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n- /g, "<br/>• ") +
    "</p>";