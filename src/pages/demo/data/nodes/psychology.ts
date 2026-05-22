import type { NodeType } from "../../types";

export const psychologyNode: NodeType = {
    id: "psychologie",
    title: "Psychologie Cognitive",
    kind: "domain",
    type: "folder",
    links: ["memoire", "attention"],
    isUnlocked: true,
    prerequisites: [],
    depth: 1,
    branchColor: "#FF6B6B",
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
    questions: [
        {
            id: "psychologie_intro_q1",
            lessonId: "psychologie_intro",
            blockIndex: 2,
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
            }
        },
        {
            id: "psychologie_intro_q2",
            lessonId: "psychologie_intro",
            blockIndex: 2,
            question: {
                type: "true_false",
                question: "La psychologie cognitive considère le cerveau comme un système de traitement de l'information.",
                correct: true,
                explanation: "Oui, la métaphore dominante en psychologie cognitive est celle du cerveau comme un ordinateur qui traite, stocke et récupère l'information.",
            }
        },
        {
            id: "psychologie_methodes_q1",
            lessonId: "psychologie_methodes",
            blockIndex: 1,
            question: {
                type: "true_false",
                question: "Les temps de réaction plus longs indiquent toujours une moins bonne performance cognitive.",
                correct: false,
                explanation: "Faux — un temps de réaction plus long peut indiquer un traitement plus profond ou plus complexe, pas nécessairement une performance moindre.",
            },
        },
        {
            id: "psychologie_methodes_q2",
            lessonId: "psychologie_methodes",
            blockIndex: 1,
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
            id: "psychologie_recap_q1",
            lessonId: "psychologie_recap",
            blockIndex: 1,
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
        {
            id: "psychologie_final_q1",
            lessonId: "psychologie_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "La psychologie cognitive est née en réaction à quel courant ?",
                choices: ["Psychanalyse", "Béhaviorisme", "Gestalt", "Humanisme"],
                correctIndex: 1,
                explanation: "La psychologie cognitive s'est développée en opposition au béhaviorisme, qui refusait d'étudier les processus mentaux internes et se limitait au comportement observable.",
            },
        },
        {
            id: "psychologie_final_q2",
            lessonId: "psychologie_final_quiz",
            blockIndex: 1,
            question: {
                type: "true_false",
                question: "Avant la révolution cognitive, le béhaviorisme acceptait d'étudier les processus mentaux internes.",
                correct: false,
                explanation: "Faux — le béhaviorisme refusait précisément d'étudier ce qui se passait 'dans la tête'. C'est cette limitation qui a motivé l'émergence de la psychologie cognitive.",
            },
        },
        {
            id: "psychologie_final_q3",
            lessonId: "psychologie_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Quelle métaphore centrale la psychologie cognitive utilise-t-elle pour décrire le cerveau ?",
                choices: [
                    "Un muscle qui se renforce par l'exercice",
                    "Un système de traitement de l'information",
                    "Un réservoir d'émotions et de pulsions",
                    "Un miroir de l'environnement social",
                ],
                correctIndex: 1,
                explanation: "La métaphore centrale est celle de l'ordinateur : le cerveau perçoit, stocke, récupère et transforme l'information — comme un système de traitement.",
            },
        },
        {
            id: "psychologie_final_q4",
            lessonId: "psychologie_final_quiz",
            blockIndex: 1,
            question: {
                type: "match_pairs",
                question: "Associe chaque méthode à ce qu'elle mesure :",
                pairs: [
                    { left: "Temps de réaction", right: "Vitesse de traitement" },
                    { left: "IRMf", right: "Activité cérébrale" },
                    { left: "Protocole verbal", right: "Pensée consciente" },
                    { left: "Expérience contrôlée", right: "Effet d'une variable isolée" },
                ],
                explanation: "Chaque outil capture un aspect différent de la cognition. Ensemble, ils permettent de construire une image complète des processus mentaux.",
            },
        },
        {
            id: "psychologie_final_q5",
            lessonId: "psychologie_final_quiz",
            blockIndex: 1,
            question: {
                type: "true_false",
                question: "Un temps de réaction plus long signifie toujours une performance cognitive inférieure.",
                correct: false,
                explanation: "Faux — un temps de réaction plus long peut refléter un traitement plus profond ou plus complexe, pas nécessairement une performance moindre.",
            },
        },
        {
            id: "psychologie_final_q6",
            lessonId: "psychologie_final_quiz",
            blockIndex: 1,
            question: {
                type: "ordering",
                question: "Remets ces étapes dans l'ordre d'une expérience contrôlée typique en psychologie cognitive :",
                items: [
                    "Analyser les données et conclure",
                    "Formuler une hypothèse",
                    "Manipuler une variable indépendante",
                    "Mesurer l'effet sur la cognition",
                ],
                correctOrder: [1, 2, 3, 0],
                explanation: "Une expérience part d'une hypothèse, manipule une variable, mesure l'effet, puis analyse les résultats pour valider ou infirmer l'hypothèse.",
            },
        },
        {
            id: "psychologie_final_q7",
            lessonId: "psychologie_final_quiz",
            blockIndex: 1,
            question: {
                type: "word_bank",
                question: "Complète la définition :",
                sentence: "La psychologie cognitive étudie les ___ mentaux internes, en considérant le cerveau comme un système de ___ de l'information.",
                bank: ["processus", "traitement", "stockage", "comportements", "réflexes"],
                correctWords: ["processus", "traitement"],
                explanation: "Ces deux termes résument l'essence de la discipline : elle s'intéresse aux processus (pas aux comportements) et à la façon dont l'information est traitée.",
            },
        },
        {
            id: "psychologie_final_q8",
            lessonId: "psychologie_final_quiz",
            blockIndex: 1,
            question: {
                type: "multiple_choice",
                question: "Dans quel contexte George Miller a-t-il présenté ses travaux fondateurs ?",
                choices: [
                    "Un article publié dans Nature en 1950",
                    "Une conférence en 1956",
                    "Un livre publié en 1962",
                    "Une émission de radio en 1948",
                ],
                correctIndex: 1,
                explanation: "George Miller a présenté ses travaux sur la limite de la mémoire lors d'une conférence en 1956, marquant un tournant dans l'histoire de la psychologie cognitive.",
            },
        },
    ],
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
                    content: "Tu es dans une salle de conférence bondée...",
                },
                {
                    type: "explanation",
                    title: "La révolution cognitive",
                    content: "La **psychologie cognitive** est née...",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_intro_q1",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_intro_q2",
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
                    questionId: "psychologie_methodes_q1",
                },
                {
                    type: "explanation",
                    title: "Le paradigme expérimental",
                    content: "La méthode clé reste l'**expérience contrôlée** : on manipule une variable, on mesure l'effet sur la cognition. C'est ce qui a permis de découvrir la plupart des effets que tu vas apprendre ici.",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_methodes_q2",
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
                    questionId: "psychologie_recap_q1",
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
                    questionId: "psychologie_final_q1",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q2",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q3",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q4",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q5",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q6",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q7",
                },
                {
                    type: "quiz",
                    questionId: "psychologie_final_q8",
                },
            ],
        },
    ],
};