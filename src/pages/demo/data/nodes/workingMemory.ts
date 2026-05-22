import type { NodeType } from "../../types";

export const WorkingMemoryNode: NodeType = {
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
    questions: [],
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
                // {
                //     type: "quiz",
                //     question: {
                //         type: "multiple_choice",
                //         question: "La mémoire de travail est surtout caractérisée par :",
                //         choices: [
                //             "Sa capacité illimitée",
                //             "Sa durée illimitée",
                //             "Sa capacité limitée et son caractère temporaire",
                //             "Son indépendance par rapport aux autres systèmes",
                //         ],
                //         correctIndex: 2,
                //         explanation: "La mémoire de travail est définie par ses deux contraintes principales : capacité limitée (~4-7 chunks) et durée limitée (quelques secondes sans effort de maintien).",
                //     },
                // },
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
                // {
                //     type: "quiz",
                //     question: {
                //         type: "word_bank",
                //         question: "Complète la phrase avec les bons mots :",
                //         sentence: "La capacité de la mémoire de travail dépend du nombre de ___ , pas du nombre d'___ bruts.",
                //         bank: ["chunks", "éléments", "neurones", "secondes", "mots"],
                //         correctWords: ["chunks", "éléments"],
                //         explanation: "C'est la distinction clé : le chunking permet d'augmenter la quantité d'information dans un même espace cognitif.",
                //     },
                // },
                {
                    type: "explanation",
                    title: "L'expertise comme chunking",
                    content: "C'est pourquoi les experts semblent avoir une mémoire de travail plus grande : ils ne voient pas plus d'éléments, ils *chunckent* mieux.\n\nUn grand maître aux échecs ne voit pas 32 pièces — il voit 5 ou 6 configurations familières.",
                },
                // {
                //     type: "quiz",
                //     question: {
                //         type: "true_false",
                //         question: "Les experts ont une mémoire de travail biologiquement plus grande que les débutants.",
                //         correct: false,
                //         explanation: "Faux — les experts chunckent mieux. Leur mémoire de travail a la même capacité, mais ils regroupent l'information en unités plus denses et significatives.",
                //     },
                // },
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
                // {
                //     type: "quiz",
                //     question: {
                //         type: "match_pairs",
                //         question: "Associe chaque composante à sa fonction :",
                //         pairs: [
                //             { left: "Administrateur central", right: "Coordonne les ressources" },
                //             { left: "Boucle phonologique", right: "Traite le langage et les sons" },
                //             { left: "Calepin visuospatial", right: "Traite les images et l'espace" },
                //         ],
                //         explanation: "Baddeley a montré que ces systèmes fonctionnent en parallèle — c'est pourquoi on peut conduire (visuospatial) et écouter la radio (phonologique) simultanément... jusqu'à un certain point.",
                //     },
                // },
                // {
                //     type: "quiz",
                //     question: {
                //         type: "ordering",
                //         question: "Mets ces composantes dans l'ordre de leur découverte par Baddeley (des premières aux plus récentes) :",
                //         items: [
                //             "Buffer épisodique",
                //             "Boucle phonologique",
                //             "Administrateur central",
                //             "Calepin visuospatial",
                //         ],
                //         correctOrder: [1, 2, 3, 0],
                //         explanation: "Baddeley et Hitch ont proposé les trois premières composantes en 1974. Le buffer épisodique a été ajouté bien plus tard, en 2000.",
                //     },
                // },
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
                // {
                //     type: "quiz",
                //     question: {
                //         type: "multiple_choice",
                //         question: "La psychologie cognitive est née en réaction à quel courant ?",
                //         choices: ["Psychanalyse", "Béhaviorisme", "Gestalt", "Humanisme"],
                //         correctIndex: 1,
                //         explanation: "La psychologie cognitive s'est développée en opposition au béhaviorisme, qui refusait d'étudier les processus mentaux internes et se limitait au comportement observable.",
                //     },
                // },
            ],
        },
    ],
};