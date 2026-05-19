import type { NodeType } from "../types/types";
export type { NodeType, QuizQuestion, SRCard, SRRating, Lesson, LessonProgress, UserProfile, EarnedBadge, Badge } from "../types/types";
import { computeBadgeLevel } from "../utils/srEngine";


// --- Helpers ---

export const getCompletedNodes = (): string[] =>
    JSON.parse(localStorage.getItem("completed_nodes") ?? "[]");

export const getCompletedLessons = (): string[] =>
    JSON.parse(localStorage.getItem("completed_lessons") ?? "[]");

export const isLessonCompleted = (nodeId: string, lessonId: string): boolean =>
    getCompletedLessons().includes(`${nodeId}::${lessonId}`);

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

export const getNodeCompletionPercent = (nodeId: string): number => {
    const node = initialNodes.find(n => n.id === nodeId);
    if (!node || node.lessonPath.length === 0) return 0;
    const done = node.lessonPath.filter(l => isLessonCompleted(nodeId, l.id)).length;
    return Math.round((done / node.lessonPath.length) * 100);
};

export const getDynamicNodes = (): NodeType[] => {
    return initialNodes.map(n => {
        if (n.isUnlocked) return n;

        // Check if all prerequisites have their FINAL QUIZ completed
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

// --- Badge helpers ---

export const getEarnedBadges = () =>
    JSON.parse(localStorage.getItem("earned_badges") ?? "[]");

export const awardBadge = (nodeId: string, level: "bronze" | "silver" | "gold") => {
    const node = initialNodes.find(n => n.id === nodeId);
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


// --- Final Quiz helpers ---

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
    if (level) awardBadge(nodeId, level);
};


// --- Links derived from nodes ---

export type LinkType = {
    source: string | NodeType;
    target: string | NodeType;
};

export const initialLinks: LinkType[] = [];  // populated after initialNodes

// --- Node data ---

export const initialNodes: NodeType[] = [
    {
        id: "profile",
        title: "Mon Profil",
        kind: "profile",
        type: "main",
        links: ["psychologie"],
        isUnlocked: true,
        prerequisites: [],
        depth: 0,
        branchColor: "#3b82f6",
        shortDescription: "Ton espace personnel — progression, badges, révisions.",
        lessonPath: [],
    },
    {
        id: "psychologie",
        title: "Psychologie Cognitive",
        kind: "domain",
        type: "folder",
        links: ["memoire", "attention"],
        isUnlocked: true,
        prerequisites: [],
        depth: 1,
        branchColor: "#3b82f6",
        hook: "Depuis un siècle, des chercheurs tentent de comprendre comment l'esprit humain fonctionne. Ce qu'ils ont découvert remet en question presque tout ce qu'on croit savoir sur l'apprentissage.",
        shortDescription: "L'étude scientifique des processus mentaux.",
        badge: {
            id: "badge_psychologie",
            nodeId: "psychologie",
            icon: "🧠",
            name: "Esprit Scientifique",
            description: "Maîtrise des fondements de la psychologie cognitive",
            levels: {
                bronze: "Toutes les leçons complétées",
                silver: "80% de bonnes réponses aux quiz",
                gold: "100% de bonnes réponses + révisions à jour",
            },
        },
        lessonPath: [
            {
                id: "psychologie_intro",
                title: "Qu'est-ce que la psychologie cognitive ?",
                type: "vignette",
                estimatedMinutes: 4,
                blocks: [
                    {
                        type: "vignette",
                        title: "Genève, 1956",
                        content: "Tu es dans une salle de conférence bondée. Un homme s'avance vers le tableau noir et écrit une phrase qui va changer la psychologie pour toujours : *'Le cerveau humain n'est pas une machine — c'est un système de traitement de l'information.'*\n\nCet homme s'appelle George Miller. Et dans quelques minutes, il va prouver que ton cerveau a une limite précise.",
                    },
                    {
                        type: "explanation",
                        title: "La révolution cognitive",
                        content: "La **psychologie cognitive** est née officiellement dans les années 1950, en réaction au béhaviorisme — qui refusait d'étudier ce qui se passait 'dans la tête'.\n\nSon idée centrale : le cerveau *traite* l'information, comme un ordinateur. Il perçoit, stocke, récupère, et transforme.",
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "multiple_choice",
                            question: "La psychologie cognitive s'intéresse principalement à :",
                            choices: [
                                "Le comportement observable uniquement",
                                "Les processus mentaux internes",
                                "Les émotions et l'inconscient",
                                "Les différences génétiques entre individus",
                            ],
                            correctIndex: 1,
                            explanation: "La psychologie cognitive étudie les processus mentaux internes — perception, mémoire, raisonnement — contrairement au béhaviorisme qui se limitait au comportement observable.",
                        },
                    },
                    {
                        type: "recap",
                        points: [
                            "La psychologie cognitive est née dans les années 1950",
                            "Elle étudie les processus mentaux : perception, mémoire, raisonnement",
                            "Elle considère le cerveau comme un système de traitement de l'information",
                        ],
                    },
                ],
            },
            {
                id: "psychologie_methodes",
                title: "Comment étudier le cerveau ?",
                type: "explanation",
                estimatedMinutes: 5,
                blocks: [
                    {
                        type: "explanation",
                        title: "Les outils du chercheur",
                        content: "Les psychologues cognitifs utilisent plusieurs méthodes pour observer ce qu'on ne peut pas voir directement.\n\nLes **temps de réaction** révèlent la complexité d'un traitement mental. L'**imagerie cérébrale** (IRMf) montre quelles zones s'activent. Les **protocoles verbaux** captent la pensée en cours.",
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "true_false",
                            question: "Les temps de réaction plus longs indiquent toujours une moins bonne performance cognitive.",
                            correct: false,
                            explanation: "Faux — un temps de réaction plus long peut indiquer un traitement plus profond ou plus complexe, pas nécessairement une performance moindre.",
                        },
                    },
                    {
                        type: "explanation",
                        title: "Le paradigme expérimental",
                        content: "La méthode clé reste l'**expérience contrôlée** : on manipule une variable, on mesure l'effet sur la cognition. C'est ce qui a permis de découvrir la plupart des effets que tu vas apprendre ici.",
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "match_pairs",
                            question: "Associe chaque méthode à ce qu'elle mesure :",
                            pairs: [
                                { left: "Temps de réaction", right: "Vitesse de traitement" },
                                { left: "IRMf", right: "Activité cérébrale" },
                                { left: "Protocole verbal", right: "Pensée consciente" },
                            ],
                            explanation: "Chaque méthode capture un aspect différent de l'activité cognitive — ensemble elles donnent une image plus complète.",
                        },
                    },
                    {
                        type: "recap",
                        points: [
                            "Les temps de réaction mesurent la vitesse de traitement mental",
                            "L'IRMf montre l'activité cérébrale en temps réel",
                            "L'expérience contrôlée est la méthode centrale de la psychologie cognitive",
                        ],
                    },
                ],
            },
            {
                id: "psychologie_recap",
                title: "Récapitulatif",
                type: "recap",
                estimatedMinutes: 3,
                blocks: [
                    {
                        type: "recap",
                        points: [
                            "La psychologie cognitive étudie les processus mentaux internes",
                            "Elle est née dans les années 1950 en réaction au béhaviorisme",
                            "Ses méthodes incluent les temps de réaction, l'IRMf, et l'expérimentation",
                            "Le cerveau est conçu comme un système de traitement de l'information",
                        ],
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "multiple_choice",
                            question: "Lequel de ces chercheurs est associé à la naissance de la psychologie cognitive ?",
                            choices: [
                                "Sigmund Freud",
                                "B.F. Skinner",
                                "George Miller",
                                "Carl Jung",
                            ],
                            correctIndex: 2,
                            explanation: "George Miller est une figure fondatrice de la psychologie cognitive, notamment grâce à son article de 1956 sur la mémoire de travail.",
                        },
                    },
                ],
            },
            {
                id: "psychologie_final_quiz",
                title: "Quiz Final — Psychologie Cognitive",
                type: "final_quiz",
                estimatedMinutes: 8,
                blocks: [
                    {
                        type: "explanation",
                        content: "Ce quiz final évalue ta compréhension de tous les concepts de ce module. Tu as droit à **3 erreurs maximum**. Bonne chance !",
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "multiple_choice",
                            question: "La psychologie cognitive est née en réaction à quel courant ?",
                            choices: ["Psychanalyse", "Béhaviorisme", "Gestalt", "Humanisme"],
                            correctIndex: 1,
                            explanation: "La psychologie cognitive s'est développée en opposition au béhaviorisme, qui refusait d'étudier les processus mentaux internes et se limitait au comportement observable.",
                        },
                    },
                    // {
                    //     type: "quiz",
                    //     question: {
                    //         type: "true_false",
                    //         question: "Avant la révolution cognitive, le béhaviorisme acceptait d'étudier les processus mentaux internes.",
                    //         correct: false,
                    //         explanation: "Faux — le béhaviorisme refusait précisément d'étudier ce qui se passait 'dans la tête'. C'est cette limitation qui a motivé l'émergence de la psychologie cognitive.",
                    //     },
                    // },
                    // {
                    //     type: "quiz",
                    //     question: {
                    //         type: "multiple_choice",
                    //         question: "Quelle métaphore centrale la psychologie cognitive utilise-t-elle pour décrire le cerveau ?",
                    //         choices: [
                    //             "Un muscle qui se renforce par l'exercice",
                    //             "Un système de traitement de l'information",
                    //             "Un réservoir d'émotions et de pulsions",
                    //             "Un miroir de l'environnement social",
                    //         ],
                    //         correctIndex: 1,
                    //         explanation: "La métaphore centrale est celle de l'ordinateur : le cerveau perçoit, stocke, récupère et transforme l'information — comme un système de traitement.",
                    //     },
                    // },
                    // {
                    //     type: "quiz",
                    //     question: {
                    //         type: "match_pairs",
                    //         question: "Associe chaque méthode à ce qu'elle mesure :",
                    //         pairs: [
                    //             { left: "Temps de réaction", right: "Vitesse de traitement" },
                    //             { left: "IRMf", right: "Activité cérébrale" },
                    //             { left: "Protocole verbal", right: "Pensée consciente" },
                    //             { left: "Expérience contrôlée", right: "Effet d'une variable isolée" },
                    //         ],
                    //         explanation: "Chaque outil capture un aspect différent de la cognition. Ensemble, ils permettent de construire une image complète des processus mentaux.",
                    //     },
                    // },
                    // {
                    //     type: "quiz",
                    //     question: {
                    //         type: "true_false",
                    //         question: "Un temps de réaction plus long signifie toujours une performance cognitive inférieure.",
                    //         correct: false,
                    //         explanation: "Faux — un temps de réaction plus long peut refléter un traitement plus profond ou plus complexe, pas nécessairement une performance moindre.",
                    //     },
                    // },
                    // {
                    //     type: "quiz",
                    //     question: {
                    //         type: "ordering",
                    //         question: "Remets ces étapes dans l'ordre d'une expérience contrôlée typique en psychologie cognitive :",
                    //         items: [
                    //             "Analyser les données et conclure",
                    //             "Formuler une hypothèse",
                    //             "Manipuler une variable indépendante",
                    //             "Mesurer l'effet sur la cognition",
                    //         ],
                    //         correctOrder: [1, 2, 3, 0],
                    //         explanation: "Une expérience part d'une hypothèse, manipule une variable, mesure l'effet, puis analyse les résultats pour valider ou infirmer l'hypothèse.",
                    //     },
                    // },
                    // {
                    //     type: "quiz",
                    //     question: {
                    //         type: "word_bank",
                    //         question: "Complète la définition :",
                    //         sentence: "La psychologie cognitive étudie les ___ mentaux internes, en considérant le cerveau comme un système de ___ de l'information.",
                    //         bank: ["processus", "traitement", "stockage", "comportements", "réflexes"],
                    //         correctWords: ["processus", "traitement"],
                    //         explanation: "Ces deux termes résument l'essence de la discipline : elle s'intéresse aux processus (pas aux comportements) et à la façon dont l'information est traitée.",
                    //     },
                    // },
                    // {
                    //     type: "quiz",
                    //     question: {
                    //         type: "multiple_choice",
                    //         question: "Dans quel contexte George Miller a-t-il présenté ses travaux fondateurs ?",
                    //         choices: [
                    //             "Un article publié dans Nature en 1950",
                    //             "Une conférence en 1956",
                    //             "Un livre publié en 1962",
                    //             "Une émission de radio en 1948",
                    //         ],
                    //         correctIndex: 1,
                    //         explanation: "George Miller a présenté ses travaux sur la limite de la mémoire lors d'une conférence en 1956, marquant un tournant dans l'histoire de la psychologie cognitive.",
                    //     },
                    // },
                ],
            },
        ],
    },
    {
        id: "memoire",
        title: "Mémoire",
        kind: "topic",
        type: "folder",
        links: ["memoire_travail", "memoire_semantique"],
        isUnlocked: false,
        prerequisites: ["psychologie"],
        depth: 2,
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
                        question: {
                            type: "true_false",
                            question: "H.M. ne pouvait plus former de nouveaux souvenirs à long terme après son opération.",
                            correct: true,
                            explanation: "Exact. L'ablation de son hippocampe l'empêchait de consolider de nouvelles informations en mémoire à long terme, tout en laissant intact ses souvenirs anciens.",
                        },
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "multiple_choice",
                            question: "Quelle structure cérébrale est essentielle pour former de nouveaux souvenirs ?",
                            choices: ["Le cortex préfrontal", "Le cervelet", "L'hippocampe", "L'amygdale"],
                            correctIndex: 2,
                            explanation: "L'hippocampe joue un rôle clé dans la consolidation des souvenirs — transformer une expérience en mémoire à long terme.",
                        },
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
                        question: {
                            type: "true_false",
                            question: "Réviser immédiatement après avoir appris quelque chose est plus efficace que d'attendre le lendemain.",
                            correct: false,
                            explanation: "Faux — laisser passer du temps (et dormir) permet à la consolidation synaptique de se produire. Réviser trop tôt ne laisse pas le temps à ce processus.",
                        },
                    },
                    {
                        type: "quiz",
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
                        type: "quiz",
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
                ],
            },
            {
                id: "psychologie_final_quiz",
                title: "Quiz Final — Psychologie Cognitive",
                type: "final_quiz",
                estimatedMinutes: 8,
                blocks: [
                    {
                        type: "explanation",
                        content: "Ce quiz final évalue ta compréhension de tous les concepts de ce module. Tu as droit à **3 erreurs maximum**. Bonne chance !",
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "multiple_choice",
                            question: "La psychologie cognitive est née en réaction à quel courant ?",
                            choices: ["Psychanalyse", "Béhaviorisme", "Gestalt", "Humanisme"],
                            correctIndex: 1,
                            explanation: "La psychologie cognitive s'est développée en opposition au béhaviorisme, qui refusait d'étudier les processus mentaux internes et se limitait au comportement observable.",
                        },
                    },
                ],
            },
        ],
    },
    {
        id: "attention",
        title: "Attention",
        kind: "topic",
        type: "folder",
        links: [],
        isUnlocked: false,
        prerequisites: ["psychologie"],
        depth: 2,
        branchColor: "#3b82f6",
        hook: "Tu crois choisir où tu portes ton attention. La recherche suggère le contraire.",
        shortDescription: "Le filtre invisible qui gouverne ta perception.",
        lessonPath: [
            {
                id: "attention_intro",
                title: "L'attention est-elle un choix ?",
                type: "vignette",
                estimatedMinutes: 4,
                blocks: [
                    {
                        type: "vignette",
                        title: "Une expérience qui dérange",
                        content: "En 1999, deux chercheurs demandent à des participants de compter les passes entre des joueurs en blanc.\n\nAu milieu de la vidéo, un homme en costume de gorille traverse le terrain, s'arrête, se frappe la poitrine, et repart.\n\nPrès de 50% des participants ne voient pas le gorille.\n\nPas parce qu'ils sont distraits. Parce qu'ils *font exactement ce qu'on leur a demandé*.",
                    },
                    {
                        type: "explanation",
                        title: "La cécité d'inattention",
                        content: "Cet effet s'appelle la **cécité d'inattention** (Simons & Chabris, 1999).\n\nIl démontre que l'attention n'est pas un enregistreur passif. C'est un **filtre actif** — ce qui entre dans le champ de conscience dépend de ce sur quoi le système cognitif est configuré.\n\nTu ne vois pas ce que tu ne cherches pas.",
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "multiple_choice",
                            question: "Qu'est-ce que la cécité d'inattention démontre principalement ?",
                            choices: [
                                "Que les humains ont une mauvaise vue",
                                "Que l'attention filtre activement ce qui entre dans la conscience",
                                "Que regarder des vidéos est une mauvaise méthode d'apprentissage",
                                "Que la mémoire de travail est limitée à 7 éléments",
                            ],
                            correctIndex: 1,
                            explanation: "La cécité d'inattention montre que l'attention est un filtre actif : on ne perçoit consciemment que ce sur quoi le système cognitif est configuré — même si le reste est physiquement visible.",
                        },
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "word_bank",
                            question: "Complète la définition :",
                            sentence: "L'attention est un ___ actif qui détermine ce qui entre dans la ___.",
                            bank: ["filtre", "conscience", "mémoire", "cerveau", "capteur"],
                            correctWords: ["filtre", "conscience"],
                            explanation: "L'attention n'est pas passive — c'est un mécanisme de sélection qui détermine ce qui accède à la conscience et donc à la mémoire de travail.",
                        },
                    },
                    {
                        type: "recap",
                        points: [
                            "L'attention est un filtre actif, pas un enregistreur passif",
                            "La cécité d'inattention montre qu'on peut ne pas voir ce qui est devant nous",
                            "Ce qu'on perçoit dépend de ce sur quoi l'attention est configurée",
                            "Simons & Chabris (1999) ont démontré cet effet avec l'expérience du gorille",
                        ],
                    },
                ],
            },
            {
                id: "attention_types",
                title: "Attention sélective vs divisée",
                type: "explanation",
                estimatedMinutes: 5,
                blocks: [
                    {
                        type: "explanation",
                        title: "Deux modes d'attention",
                        content: "Les chercheurs distinguent principalement deux formes d'attention :\n\n**L'attention sélective** : se concentrer sur une source en ignorant les autres. Lire dans un café bruyant.\n\n**L'attention divisée** : traiter plusieurs sources simultanément. Conduire en écoutant de la musique.",
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "match_pairs",
                            question: "Associe chaque situation au type d'attention utilisé :",
                            pairs: [
                                { left: "Lire un livre dans le métro", right: "Attention sélective" },
                                { left: "Prendre des notes pendant un cours", right: "Attention divisée" },
                                { left: "Chercher un ami dans une foule", right: "Attention sélective" },
                                { left: "Conduire en parlant à un passager", right: "Attention divisée" },
                            ],
                            explanation: "L'attention sélective implique de filtrer activement pour une seule source. L'attention divisée implique de gérer plusieurs sources — avec un coût cognitif souvent sous-estimé.",
                        },
                    },
                    {
                        type: "explanation",
                        title: "Le mythe du multitâche",
                        content: "Le vrai **multitâche** — traiter deux tâches cognitives complexes en parallèle — n'existe pas chez l'humain.\n\nCe qu'on appelle multitâche est en réalité du **task-switching** rapide : alterner entre tâches avec un coût à chaque transition.\n\nCe coût s'appelle le **switch cost** : temps de réorientation + erreurs d'interférence.",
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "true_false",
                            question: "Les humains peuvent réellement traiter deux tâches cognitives complexes en parfait parallèle.",
                            correct: false,
                            explanation: "Faux — ce qu'on appelle multitâche est en réalité une alternance rapide entre tâches (task-switching), avec un coût cognitif à chaque transition.",
                        },
                    },
                    {
                        type: "recap",
                        points: [
                            "L'attention sélective filtre pour une source, l'attention divisée gère plusieurs",
                            "Le vrai multitâche n'existe pas — c'est du task-switching",
                            "Chaque transition entre tâches a un coût cognitif (switch cost)",
                            "L'attention divisée est toujours moins efficace que l'attention sélective sur chaque tâche",
                        ],
                    },
                ],
            },
        ],
        badge: {
            id: "badge_attention",
            nodeId: "attention",
            icon: "🎯",
            name: "Maître de l'Attention",
            description: "Comprend les mécanismes de l'attention sélective et divisée",
            levels: {
                bronze: "Toutes les leçons complétées",
                silver: "80% de bonnes réponses aux quiz",
                gold: "100% de bonnes réponses + révisions à jour",
            },
        },
    },
    {
        id: "memoire_travail",
        title: "Mémoire de Travail",
        kind: "concept",
        type: "file",
        links: [],
        isUnlocked: false,
        prerequisites: ["memoire"],
        depth: 3,
        branchColor: "#3b82f6",
        hook: "En 1956, un psychologue a parié sa carrière sur le chiffre 7. Il avait à la fois raison et tort.",
        shortDescription: "La mémoire du présent — limitée, volatile, essentielle.",
        badge: {
            id: "badge_memoire_travail",
            nodeId: "memoire_travail",
            icon: "⚡",
            name: "Gestionnaire Cognitif",
            description: "Maîtrise le modèle de Baddeley et ses implications",
            levels: {
                bronze: "Toutes les leçons complétées",
                silver: "80% de bonnes réponses aux quiz",
                gold: "100% de bonnes réponses + révisions à jour",
            },
        },
        lessonPath: [
            {
                id: "mdt_intro",
                title: "Le chiffre magique",
                type: "vignette",
                estimatedMinutes: 4,
                blocks: [
                    {
                        type: "vignette",
                        title: "New York, 1956",
                        content: "Tu es assis dans l'amphithéâtre. George Miller s'avance, visiblement nerveux.\n\n« J'ai été persécuté par un entier depuis plusieurs années », commence-t-il. « Cet entier est sept. »\n\nLe public rit. Mais Miller ne plaisante pas. Il vient de découvrir quelque chose d'étrange : peu importe ce qu'on mémorise — des chiffres, des lettres, des mots — le cerveau humain plafonne toujours autour de sept éléments.",
                    },
                    {
                        type: "explanation",
                        title: "La mémoire de travail",
                        content: "La **mémoire de travail** est le système qui maintient et manipule temporairement l'information pendant qu'on l'utilise.\n\nC'est la mémoire du *présent* — ce qui est actif dans ton esprit en ce moment même, pendant que tu lis ceci.",
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "multiple_choice",
                            question: "La mémoire de travail est surtout caractérisée par :",
                            choices: [
                                "Sa capacité illimitée",
                                "Sa durée illimitée",
                                "Sa capacité limitée et son caractère temporaire",
                                "Son indépendance par rapport aux autres systèmes",
                            ],
                            correctIndex: 2,
                            explanation: "La mémoire de travail est définie par ses deux contraintes principales : capacité limitée (~4-7 chunks) et durée limitée (quelques secondes sans effort de maintien).",
                        },
                    },
                    {
                        type: "recap",
                        points: [
                            "George Miller a identifié la limite de 7 éléments en 1956",
                            "La mémoire de travail maintient l'information activement",
                            "Elle est limitée en capacité et en durée",
                        ],
                    },
                ],
            },
            {
                id: "mdt_chunks",
                title: "Les chunks : l'art de regrouper",
                type: "explanation",
                estimatedMinutes: 5,
                blocks: [
                    {
                        type: "explanation",
                        title: "Pas 7 éléments — 7 chunks",
                        content: "La limite n'est pas 7 *éléments bruts* — c'est 7 **chunks**.\n\nUn chunk est une unité significative. Pour quelqu'un qui ne connaît pas le foot, « 4-3-3 » c'est 3 chiffres. Pour un entraîneur, c'est 1 chunk — une formation entière.",
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "word_bank",
                            question: "Complète la phrase avec les bons mots :",
                            sentence: "La capacité de la mémoire de travail dépend du nombre de ___ , pas du nombre d'___ bruts.",
                            bank: ["chunks", "éléments", "neurones", "secondes", "mots"],
                            correctWords: ["chunks", "éléments"],
                            explanation: "C'est la distinction clé : le chunking permet d'augmenter la quantité d'information dans un même espace cognitif.",
                        },
                    },
                    {
                        type: "explanation",
                        title: "L'expertise comme chunking",
                        content: "C'est pourquoi les experts semblent avoir une mémoire de travail plus grande : ils ne voient pas plus d'éléments, ils *chunckent* mieux.\n\nUn grand maître aux échecs ne voit pas 32 pièces — il voit 5 ou 6 configurations familières.",
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "true_false",
                            question: "Les experts ont une mémoire de travail biologiquement plus grande que les débutants.",
                            correct: false,
                            explanation: "Faux — les experts chunckent mieux. Leur mémoire de travail a la même capacité, mais ils regroupent l'information en unités plus denses et significatives.",
                        },
                    },
                    {
                        type: "recap",
                        points: [
                            "Un chunk est une unité significative d'information",
                            "La limite de 7 s'applique aux chunks, pas aux éléments bruts",
                            "L'expertise = meilleur chunking, pas plus de capacité biologique",
                        ],
                    },
                ],
            },
            {
                id: "mdt_modele",
                title: "Le modèle de Baddeley",
                type: "explanation",
                estimatedMinutes: 6,
                blocks: [
                    {
                        type: "explanation",
                        title: "Une mémoire de travail en plusieurs parties",
                        content: "En 1974, **Baddeley et Hitch** ont montré que la mémoire de travail n'est pas un espace unique — c'est un système à plusieurs composantes :\n\n- **L'administrateur central** : chef d'orchestre, alloue les ressources\n- **La boucle phonologique** : maintient les sons et le langage\n- **Le calepin visuospatial** : maintient les images et positions\n- **Le buffer épisodique** : intègre tout avec la mémoire à long terme",
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "match_pairs",
                            question: "Associe chaque composante à sa fonction :",
                            pairs: [
                                { left: "Administrateur central", right: "Coordonne les ressources" },
                                { left: "Boucle phonologique", right: "Traite le langage et les sons" },
                                { left: "Calepin visuospatial", right: "Traite les images et l'espace" },
                            ],
                            explanation: "Baddeley a montré que ces systèmes fonctionnent en parallèle — c'est pourquoi on peut conduire (visuospatial) et écouter la radio (phonologique) simultanément... jusqu'à un certain point.",
                        },
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "ordering",
                            question: "Mets ces composantes dans l'ordre de leur découverte par Baddeley (des premières aux plus récentes) :",
                            items: [
                                "Buffer épisodique",
                                "Boucle phonologique",
                                "Administrateur central",
                                "Calepin visuospatial",
                            ],
                            correctOrder: [1, 2, 3, 0],
                            explanation: "Baddeley et Hitch ont proposé les trois premières composantes en 1974. Le buffer épisodique a été ajouté bien plus tard, en 2000.",
                        },
                    },
                    {
                        type: "recap",
                        points: [
                            "Baddeley et Hitch ont proposé leur modèle en 1974",
                            "La mémoire de travail a 4 composantes distinctes",
                            "L'administrateur central coordonne les autres sous-systèmes",
                            "Le buffer épisodique a été ajouté au modèle en 2000",
                        ],
                    },
                ],
            },
            {
                id: "psychologie_final_quiz",
                title: "Quiz Final — Psychologie Cognitive",
                type: "final_quiz",
                estimatedMinutes: 8,
                blocks: [
                    {
                        type: "explanation",
                        content: "Ce quiz final évalue ta compréhension de tous les concepts de ce module. Tu as droit à **3 erreurs maximum**. Bonne chance !",
                    },
                    {
                        type: "quiz",
                        question: {
                            type: "multiple_choice",
                            question: "La psychologie cognitive est née en réaction à quel courant ?",
                            choices: ["Psychanalyse", "Béhaviorisme", "Gestalt", "Humanisme"],
                            correctIndex: 1,
                            explanation: "La psychologie cognitive s'est développée en opposition au béhaviorisme, qui refusait d'étudier les processus mentaux internes et se limitait au comportement observable.",
                        },
                    },
                ],
            },
        ],
    },
    {
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
        lessonPath: [],
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
    },
];

// populate links after nodes are defined
initialLinks.push(
    ...initialNodes.flatMap(n =>
        n.links.map(target => ({ source: n.id, target }))
    )
);