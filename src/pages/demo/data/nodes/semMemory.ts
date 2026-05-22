import type { NodeType } from "../graphData";

export const SemMemoryNode: NodeType = {
    id: "memoire_semantique",
    title: "Mémoire Sémantique",
    kind: "concept",
    type: "file",
    links: [],
    isUnlocked: false,
    prerequisites: ["memoire"],
    depth: 3,
    branchColor: "#3b82f6",
    hook: "Tu sais que Paris est la capitale de la France. Mais tu ne te souviens pas du moment où tu l'as appris. Pourquoi ?",
    shortDescription: "La mémoire des faits, sans le souvenir de les avoir appris.",
    badge: {
        id: "badge_memoire_semantique",
        nodeId: "memoire_semantique",
        icon: "📚",
        name: "Encyclopédiste",
        description: "Comprend la mémoire sémantique et ses propriétés",
        levels: {
            bronze: "Toutes les leçons complétées",
            silver: "80% de bonnes réponses aux quiz",
            gold: "100% de bonnes réponses + révisions à jour",
        },
    },
    questions: [],
    lessonPath: [],
};