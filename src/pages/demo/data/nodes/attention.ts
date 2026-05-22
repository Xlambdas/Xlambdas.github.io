import type { NodeType } from "../../types";

export const AttentionNode: NodeType = {
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
    questions: [],
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
                // {
                //     type: "quiz",
                //     question: {
                //         type: "multiple_choice",
                //         question: "Qu'est-ce que la cécité d'inattention démontre principalement ?",
                //         choices: [
                //             "Que les humains ont une mauvaise vue",
                //             "Que l'attention filtre activement ce qui entre dans la conscience",
                //             "Que regarder des vidéos est une mauvaise méthode d'apprentissage",
                //             "Que la mémoire de travail est limitée à 7 éléments",
                //         ],
                //         correctIndex: 1,
                //         explanation: "La cécité d'inattention montre que l'attention est un filtre actif : on ne perçoit consciemment que ce sur quoi le système cognitif est configuré — même si le reste est physiquement visible.",
                //     },
                // },
                // {
                //     type: "quiz",
                //     question: {
                //         type: "word_bank",
                //         question: "Complète la définition :",
                //         sentence: "L'attention est un ___ actif qui détermine ce qui entre dans la ___.",
                //         bank: ["filtre", "conscience", "mémoire", "cerveau", "capteur"],
                //         correctWords: ["filtre", "conscience"],
                //         explanation: "L'attention n'est pas passive — c'est un mécanisme de sélection qui détermine ce qui accède à la conscience et donc à la mémoire de travail.",
                //     },
                // },
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
                // {
                //     type: "quiz",
                //     question: {
                //         type: "match_pairs",
                //         question: "Associe chaque situation au type d'attention utilisé :",
                //         pairs: [
                //             { left: "Lire un livre dans le métro", right: "Attention sélective" },
                //             { left: "Prendre des notes pendant un cours", right: "Attention divisée" },
                //             { left: "Chercher un ami dans une foule", right: "Attention sélective" },
                //             { left: "Conduire en parlant à un passager", right: "Attention divisée" },
                //         ],
                //         explanation: "L'attention sélective implique de filtrer activement pour une seule source. L'attention divisée implique de gérer plusieurs sources — avec un coût cognitif souvent sous-estimé.",
                //     },
                // },
                {
                    type: "explanation",
                    title: "Le mythe du multitâche",
                    content: "Le vrai **multitâche** — traiter deux tâches cognitives complexes en parallèle — n'existe pas chez l'humain.\n\nCe qu'on appelle multitâche est en réalité du **task-switching** rapide : alterner entre tâches avec un coût à chaque transition.\n\nCe coût s'appelle le **switch cost** : temps de réorientation + erreurs d'interférence.",
                },
                // {
                //     type: "quiz",
                //     question: {
                //         type: "true_false",
                //         question: "Les humains peuvent réellement traiter deux tâches cognitives complexes en parfait parallèle.",
                //         correct: false,
                //         explanation: "Faux — ce qu'on appelle multitâche est en réalité une alternance rapide entre tâches (task-switching), avec un coût cognitif à chaque transition.",
                //     },
                // },
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
};