import type { NodeType } from "../types";

export const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export const NODE_COLOR: Record<NodeType["type"], string> = {
    main: "#ffffff",
    folder: "#a5b4fc",
    file: "#94a3b8",
};

export const KIND_COLOR: Record<string, string> = {
    profile: "#7c6af7",
    domain: "#a5b4fc",
    topic: "#a5b4fc",
    concept: "#94a3b8",
    subconcept: "#94a3b8",
};

export const KIND_ICON: Record<string, string> = {
    profile: "🧠",
    domain: "🗂",
    topic: "📂",
    concept: "📄",
    subconcept: "🔬",
};

export const KIND_LABEL: Record<string, string> = {
    profile: "Profil",
    domain: "Domaine",
    topic: "Sujet",
    concept: "Concept",
    subconcept: "Sous-concept",
};