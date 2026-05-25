import type { NodeType } from "../../types";

export const MemoryNode: NodeType = {
    id: "memoire",
    title: "Mémoire",
    type: "topic",
    links: ["memoire_travail", "memoire_semantique"],
    isUnlocked: false,
    prerequisites: ["psychologie"],
    branchColor: "#3b82f6",
    hook: "La mémoire n'est pas un enregistreur — c'est un reconstructeur. Chaque souvenir que tu récupères est légèrement différent de la dernière fois.",
    shortDescription: "Comment le cerveau stocke, oublie, et reconstruit.",
    badge: {
        id: "badge_memoire",
        nodeId: "memoire",
        icon: "💾",
        name: "Architecte de la Mémoire",
        description: "Comprend les systèmes et mécanismes de la mémoire humaine",
        levels: {
            bronze: "Toutes les leçons complétées",
            silver: "80% de bonnes réponses aux quiz",
            gold: "100% de bonnes réponses + révisions à jour",
        },
    },
    questions: [
        {
            id: "memoire_intro_q1",
            lessonId: "memoire_intro",
            blockIndex: 2,
            question: {
                type: "true_false",
                question: "H.M. ne pouvait plus former de nouveaux souvenirs à long terme après son opération.",
                correct: true,
                explanation: "Exact. L'ablation de son hippocampe l'empêchait de consolider de nouvelles informations en mémoire à long terme, tout en laissant intact ses souvenirs anciens.",
            },
        },
        {
            id: "memoire_intro_q2",
            lessonId: "memoire_intro",
            blockIndex: 2,
            question: {
                type: "multiple_choice",
                question: "Quelle structure cérébrale est essentielle pour former de nouveaux souvenirs ?",
                choices: ["Le cortex préfrontal", "Le cervelet", "L'hippocampe", "L'amygdale"],
                correctIndex: 2,
                explanation: "L'hippocampe joue un rôle clé dans la consolidation des souvenirs — transformer une expérience en mémoire à long terme.",
            },
        },
        {
            id: "memoire_consolidation_q3",
            lessonId: "memoire_consolidation",
            blockIndex: 2,
            question: {
                type: "true_false",
                question: "Réviser immédiatement après avoir appris quelque chose est plus efficace que d'attendre le lendemain.",
                correct: false,
                explanation: "Faux — laisser passer du temps (et dormir) permet à la consolidation synaptique de se produire. Réviser trop tôt ne laisse pas le temps à ce processus.",
            },
        },
        {
            id: "memoire_consolidation_q4",
            lessonId: "memoire_consolidation",
            blockIndex: 2,
            question: {
                type: "ordering",
                question: "Mets ces étapes dans l'ordre chronologique de la formation d'un souvenir :",
                items: [
                    "Consolidation systémique (cortex)",
                    "Encodage (apprentissage actif)",
                    "Consolidation synaptique (hippocampe)",
                    "Récupération (rappel futur)",
                ],
                correctOrder: [1, 2, 0, 3],
                explanation: "L'encodage vient d'abord, puis la consolidation synaptique rapide, puis la consolidation systémique lente, puis finalement la récupération lors d'une révision ou d'un examen.",
            },
        },
        {
            id: "memoire_recap_q1",
            lessonId: "memoire_recap",
            blockIndex: 1,
            question: {
                type: "match_pairs",
                question: "Associe chaque concept à sa définition :",
                pairs: [
                    { left: "Hippocampe", right: "Structure clé pour former de nouveaux souvenirs" },
                    { left: "Consolidation", right: "Processus qui stabilise les souvenirs dans le temps" },
                    { left: "Mémoire à court terme", right: "Stockage temporaire, quelques secondes à minutes" },
                    { left: "Mémoire à long terme", right: "Stockage potentiellement permanent" },
                ],
                explanation: "Ces quatre concepts forment les bases de toute compréhension de la mémoire humaine.",
            },
        },
        {
            id: "memoire_recap_q2",
            lessonId: "memoire_recap",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Que se passe-t-il principalement dans le cerveau pendant le sommeil par rapport à la mémoire ?",
                choices: [
                    "Les souvenirs sont effacés pour libérer de la place",
                    "L'hippocampe rejoue et transfère les souvenirs vers le cortex",
                    "La mémoire de travail augmente sa capacité temporairement",
                    "Rien — le cerveau est en pause complète",
                ],
                correctIndex: 1,
                explanation: "Pendant le sommeil, l'hippocampe rejoue les événements de la journée et les transfère progressivement vers le cortex pour un stockage à long terme — c'est la consolidation systémique.",
            },
        },
        {
            id: "psychologie_final_q1",
            lessonId: "memoire_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "La psychologie cognitive est née en réaction à quel courant ?",
                choices: ["Psychanalyse", "Béhaviorisme", "Gestalt", "Humanisme"],
                correctIndex: 1,
                explanation: "La psychologie cognitive s'est développée en opposition au béhaviorisme, qui refusait d'étudier les processus mentaux internes et se limitait au comportement observable.",
            },
        }
    ],
    lessonPath: [
        {
            id: "memoire_intro",
            title: "Les systèmes de mémoire",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "vignette",
                    title: "Une amnésie qui a tout changé",
                    content: "En 1953, un jeune homme de 27 ans subit une opération au cerveau pour soigner son épilepsie. Quand il se réveille, quelque chose d'étrange se produit : il peut encore parler, marcher, reconnaître sa famille.\n\nMais il est incapable de former un seul nouveau souvenir.\n\nChaque matin, il se réveille en croyant que c'est encore 1953. Cet homme — connu comme H.M. — va révolutionner notre compréhension de la mémoire.",
                },
                {
                    type: "explanation",
                    title: "Mémoire à court terme vs long terme",
                    content: "Le cas H.M. a prouvé que la mémoire n'est pas un système unique. Il existe au minimum :\n\n- La **mémoire à court terme** : quelques secondes, capacité limitée\n- La **mémoire à long terme** : potentiellement illimitée, durable\n\nL'hippocampe — la zone opérée chez H.M. — est le pont entre les deux.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_intro_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_intro_q2",
                },
                {
                    type: "recap",
                    points: [
                        "La mémoire est composée de plusieurs systèmes distincts",
                        "L'hippocampe est essentiel pour former de nouveaux souvenirs",
                        "Le cas H.M. a prouvé la distinction entre mémoire à court et long terme",
                    ],
                },
            ],
        },
        {
            id: "memoire_consolidation",
            title: "Consolider un souvenir",
            type: "explanation",
            estimatedMinutes: 5,
            blocks: [
                {
                    type: "vignette",
                    title: "La nuit qui suit l'apprentissage",
                    content: "Tu viens d'apprendre quelque chose de nouveau. Tu fermes ton manuel et tu t'endors.\n\nPendant que tu dors, ton hippocampe rejoue les événements de la journée — des centaines de fois, à grande vitesse. Il transfère progressivement les souvenirs vers le cortex.\n\nCe processus s'appelle la **consolidation**. Et il est impossible à accélérer.",
                },
                {
                    type: "explanation",
                    title: "Deux phases de consolidation",
                    content: "La consolidation se produit en deux temps :\n\n**Synaptique** (heures) — les connexions entre neurones se renforcent chimiquement.\n\n**Systémique** (jours à années) — le souvenir migre de l'hippocampe vers le cortex pour un stockage à long terme.",
                },
                {
                    type: "quiz",
                    questionId: "memoire_consolidation_q4",
                },
                {
                    type: "quiz",
                    questionId: "memoire_consolidation_q3",
                },
                {
                    type: "recap",
                    points: [
                        "La consolidation transforme les souvenirs fragiles en mémoires durables",
                        "Le sommeil est essentiel à la consolidation systémique",
                        "On distingue deux phases : synaptique (heures) et systémique (jours)",
                        "Apprendre et dormir est plus efficace qu'apprendre et rester éveillé",
                    ],
                },
            ],
        },
        {
            id: "memoire_recap",
            title: "Récapitulatif — Mémoire",
            type: "recap",
            estimatedMinutes: 4,
            blocks: [
                {
                    type: "recap",
                    points: [
                        "La mémoire est composée de plusieurs systèmes distincts",
                        "L'hippocampe est essentiel pour former de nouveaux souvenirs",
                        "Le cas H.M. a prouvé la distinction mémoire court/long terme",
                        "La consolidation nécessite du temps et du sommeil",
                        "Les souvenirs migrent de l'hippocampe vers le cortex pendant le sommeil",
                    ],
                },
                {
                    type: "quiz",
                    questionId: "memoire_recap_q1",
                },
                {
                    type: "quiz",
                    questionId: "memoire_recap_q2",
                },
            ],
        },
        {
            id: "memoire_final_quiz",
            title: "Quiz Final — Mémoire",
            type: "final_quiz",
            estimatedMinutes: 8,
            blocks: [
                {
                    type: "explanation",
                    content: "Ce quiz final évalue ta compréhension de tous les concepts de ce module. Tu as droit à **3 erreurs maximum**. Bonne chance !",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q1",
                },
            ],
        },
    ],
};